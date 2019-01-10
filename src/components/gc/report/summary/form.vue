<template>
	<div v-loading='loading'>
		<el-form 
			:model='form' :rules='rules' 
			ref='form' label-width='85px' 
			size='mini' status-icon
			class='c-form-mini' >
			<el-row :gutter='20' class='c-input-readonly'>
				<el-col :span='7'>
					<divider title='项目信息'></divider>
					<el-form-item label='所属项目' prop='project_id'>
						<el-input readonly :value='form.project_no' placeholder='请选择项目'>
							<el-button slot="prepend" v-if='form.project_id' 
								icon='el-icon-document'
								@click='$refs.projectDetails.open(form.project_id)'></el-button>
							<el-button slot="append" @click='openSummaryDialog'>选择</el-button>
						</el-input>
					</el-form-item>
					<el-form-item label='项目名称' prop='project_name'>
						<el-input readonly :value='form.project_name' placeholder='选择项目自动加载'>
						</el-input>
					</el-form-item>
					<el-form-item label='合同编号'>
						<el-input readonly :value='form.contract_no' placeholder='选择项目自动加载'>
							<el-button 
								slot="prepend" 
								icon='el-icon-document' 
								v-if='form.contract_id'
								@click='$refs.contractInfo.open(form.contract_id)'
								></el-button>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span='17' style='text-align: center'>
					<el-row>
						<el-col :span='6'>
							<divider title='下单进度'></divider>
							<el-tooltip placement='bottom' :content='(form.xd_order_area_total||0)+"㎡（下单面积） / "+(form.project_area||0)+"㎡（项目面积）"'>
							<el-progress 
								type="circle" 
								:stroke-width='10' :percentage="$commonJs.getProgressPercentage(form.xd_order_area_total/form.project_area)"></el-progress>
							</el-tooltip>
						</el-col>
						<el-col :span='6'>
							<divider title='生产进度'></divider>
							<el-tooltip 
								placement='bottom' 
								:content='form.sc_finish_area_total+"㎡（生产面积） / "+form.xd_order_area_total+"㎡（下单面积）"'>
								<el-progress 
									type="circle" 
									:stroke-width='10' 
									:percentage="$commonJs.getProgressPercentage(form.sc_finish_area_total/form.xd_order_area_total)"></el-progress>
							</el-tooltip>
						</el-col>
						<el-col :span='6'>
							<divider title='发货进度'></divider>
							<el-tooltip 
								placement='bottom' 
								:content='form.cy_delivery_area_total+"㎡（发货面积） / "+form.cy_storage_area_total+"㎡（成品库存面积）"'>
								<el-progress 
									type="circle" 
									:stroke-width='10' 
									:percentage="$commonJs.getProgressPercentage(form.cy_delivery_area_total/form.cy_storage_area_total)"></el-progress>
							</el-tooltip>
						</el-col>
						<el-col :span='6'>
							<divider title='回款进度'></divider>
							<el-tooltip 
								placement='bottom' 
								:content='"￥"+form.cw_payment_price_total+"（回款金额） / ￥"+form.cw_invoice_price_total+"（开票金额）"'>
								<el-progress 
									type="circle" 
									:stroke-width='10' 
									:percentage="$commonJs.getProgressPercentage(form.cw_payment_price_total/form.cw_invoice_price_total)"></el-progress>
							</el-tooltip>
						</el-col>
					</el-row>
				</el-col>
			</el-row>
		</el-form>
		<divider title='工程进度报告列表'></divider>
		<el-alert
	    title="以最后提交的报告做为项目的工程进度报告，已提交的报告无法修改" 
	    type="warning" style='margin-bottom: 10px'>
	  </el-alert>
		<div style='margin-bottom:10px'>
			<el-button type='primary' size='mini' @click='create' :disabled='!form.project_id'>创建新报告</el-button>
		</div>
		<delivery-list 
			:params='params' ref='deliveryList' size='mini' max-height='200'
			@del='reload'>
			<el-table-column slot='column' fixed='right' label='操作' align='center' width='90'>
				<template slot-scope='scope'>
					<el-button size='mini' type='text' @click='edit(scope)'>编辑</el-button>
					<el-button size='mini' type='text' @click='del(scope)'>删除</el-button>
				</template>
			</el-table-column>
		</delivery-list>
		<summary-dialog ref='summaryDialog' :in-dialog='inDialog'>
			<el-table-column slot='column' width='60' align='center' label='操作' fixed='right'>
				<template slot-scope='{row}'>
					<el-button size='mini' type='text' @click='selectProject(row)'>选择</el-button>
				</template>
			</el-table-column>
		</summary-dialog>
		<form-dialog :in-dialog='inDialog' ref='formDialog' @saved='reload' />
		<contract-info :in-dialog='inDialog' ref='contractInfo' />
		<project-details :in-dialog='inDialog' ref='projectDetails' />
	</div>
</template>
<script>
	import productApi from '@/api/gc/report'
	import summaryDialog from '@/components/gc/report/summary/listDialog'
	import deliveryList from '@/components/gc/report/list'
	import formDialog from '@/components/gc/report/formDialog'
	import contractInfo from '@/components/yyzx/contract/info'
	import projectDetails from '@/components/projectDetails'

	const formInit = {
		order_id:null,
		project_id:null,//项目id
		project_name:'',//项目名称
		project_no:'',
		contract_no:'',	//合同编号
		order_date:'',
		project_area:0,
		xd_order_area_total:0,
		sc_finish_area_total:0,
		cy_storage_area_total:0,
		cy_delivery_area_total:0,
		cw_invoice_price_total:0,
		cw_payment_price_total:0
	}
	export default {
		components:{
			summaryDialog,
			deliveryList,
			formDialog,
			contractInfo,
			projectDetails
		},
		props:{
			inDialog:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return {
				loading:false,
				form:{ ...formInit },
				rules:{
					project_id:[{ required:true, message:'请选择项目' }]
				},
				params:{
					order_id:null
				},
				updated:false
			}
		},
		computed:{
			//表单是否是编辑状态
			isEdit(){
				return this.form.id!=null
			}
		},
		created(){
			
		},
		methods:{			
			assign(data){
				this.form = { ...this.form, ...data }
				if(data.project_id){
					this.params.project_id = data.project_id
					this.$refs.deliveryList.initData()
				}
				this.clearValidate()
			},			
			clearValidate(){
				this.$nextTick(()=>{
					this.$refs.form.clearValidate()
				})
			},
			resetFields(){
				this.updated = false
				this.form = {...formInit}
				this.$refs.deliveryList.clear()
				this.clearValidate()
			},
			openSummaryDialog(){
				this.$refs.summaryDialog.open( )
			},
			selectProject(row){
				// let data = this.$commonJs.obj.copyByKey( row, [
				// 	'contract_id','sc_self_finish_area_total','project_area',
				// 	'order_date','project_id','project_name','self_area',
				// 	'project_no','contract_no','plan_id'
				// ])
				this.assign(row)
				this.$refs.summaryDialog.close()
			},
			create(){
				let data = this.$commonJs.obj.copyByKey(this.form,[
					'project_id','contract_id'
				])
				this.$refs.formDialog.open(data)
			},
			edit({row}){
				if(row.is_submit){
					this.$message.error('已提交的报告无法修改！')
					return
				}
				this.$refs.formDialog.open(row)
			},
			reload(){
				// productApi.getSummary({order_id:this.form.order_id}).then(res=>{
				// 	this.form.sc_self_finish_area_total = res.data.sc_self_finish_area_total
				// 	this.form.no_product_area = (Number(this.form.self_area)-Number(this.form.sc_self_finish_area_total)).toFixed(2)
				// })
				this.$refs.deliveryList.reload()
				this.updated = true
			},
			del(scope){
				this.$refs.deliveryList.del(scope)
			},
		}
	}
</script>