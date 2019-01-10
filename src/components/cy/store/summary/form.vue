<template>
	<div v-loading='loading'>
		<el-form 
			:model='form' :rules='rules' 
			ref='form' label-width='85px' 
			size='mini' status-icon
			class='c-form-mini' >
			<el-row :gutter='20' class='c-input-readonly'>
				<el-col :span='18'>
					<divider title='订单信息'></divider>
					<el-row :gutter='10'>
						<el-col :span='24'>
							<el-form-item label='所属订单' prop='order_id'>
								<el-input readonly :value='form.order_no' placeholder='请选择订单'>
									<el-button slot="prepend" v-if='form.order_id' 
										icon='el-icon-document'
										@click='$refs.orderInfo.open(form.order_id)'></el-button>
									<el-button slot="append" @click='openSummaryDialog'>选择</el-button>
								</el-input>
							</el-form-item>
						</el-col>	
						<el-col :span='8'>
							<el-form-item label='项目名称' prop='project_name'>
								<el-input readonly :value='form.project_name' placeholder='选择订单自动加载'>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='项目编号'>
								<el-input readonly :value='form.project_no' placeholder='选择订单自动加载'>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='合同编号'>
								<el-input readonly :value='form.contract_no' placeholder='选择订单自动加载'>
									<el-button 
										slot="prepend" 
										icon='el-icon-document' 
										v-if='form.contract_id'
										@click='$refs.contractInfo.open(form.contract_id)'
										></el-button>
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter='10'>
						<el-col :span='8'>
							<el-form-item label='订单面积' prop='order_area'>
								<el-input readonly :value='form.order_area' placeholder='选择订单'>
									<span slot="suffix">㎡</span>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='车间已完成' prop='self_finish_area_total'>
								<el-input readonly :value='form.self_finish_area_total'>
									<span slot="suffix">㎡</span>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='外协已完成' prop='out_finish_area_total'>
								<el-input readonly :value='form.out_finish_area_total'>
									<span slot="suffix">㎡</span>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='已生产面积' prop='finish_area_total'>
								<el-input readonly :value='form.finish_area_total'>
									<span slot="suffix">㎡</span>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='已入库面积' prop='storage_area_total'>
								<el-input readonly :value='form.storage_area_total'>
									<span slot="suffix">㎡</span>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='未入库面积'>
								<el-input readonly :value='form.no_storage_area'>
									<span slot="suffix">㎡</span>
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-col>
				<el-col :span='6' style='text-align: center'>
					<divider title='入库进度'></divider>
					<el-progress 
						type="circle" 
						:percentage="$commonJs.getProgressPercentage(form.storage_area_total/form.finish_area_total)" 
						:stroke-width='10'></el-progress>
				</el-col>
			</el-row>
		</el-form>
		<divider title='入库列表'></divider>
		<div style='margin-bottom:10px'>
			<el-button type='primary' size='mini' @click='create' :disabled='!form.order_id'>添加入库</el-button>
		</div>
		<store-list :params='params' ref='storeList' max-height='200' hide-order-field hide-project-field hide-query no-page>
			<el-table-column slot='column' fixed='right' label='操作' align='center' width='100'>
				<template slot-scope='scope'>
					<el-button size='mini' type='text' @click='edit(scope)'>编辑</el-button>
					<el-button size='mini' type='text' @click='del(scope)'>删除</el-button>
				</template>
			</el-table-column>
		</store-list>
		<summary-dialog ref='summaryDialog' :in-dialog='inDialog'>
			<el-table-column slot='column' width='60' align='center' label='操作' fixed='right'>
				<template slot-scope='{row}'>
					<el-button size='mini' type='text' @click='selectOrder(row)'>选择</el-button>
				</template>
			</el-table-column>
		</summary-dialog>
		<form-dialog :in-dialog='inDialog' ref='formDialog' @saved='reload' />
		<contract-info :in-dialog='inDialog' ref='contractInfo' />
		<order-info :in-dialog='inDialog' ref='orderInfo' />
	</div>
</template>
<script>
	import storeApi from '@/api/cy/store'
	import summaryDialog from '@/components/cy/store/summary/listDialog'
	import storeList from '@/components/cy/store/list'
	import formDialog from '@/components/cy/store/formDialog'
	import contractInfo from '@/components/yyzx/contract/info'
	import orderInfo from '@/components/yyzx/order/info'

	const formInit = {
		order_no:'',
		order_id:null,
		project_id:null,//项目id
		project_name:'',//项目名称
		project_no:'',
		contract_no:'',	//合同编号
		order_date:'',
		order_delivery_date:'',
		self_finish_area_total:'',
		out_finish_area_total:'',
		finish_area_total:'',
		storage_area_total:'',
		no_storage_area:''
	}
	export default {
		components:{
			summaryDialog,
			storeList,
			formDialog,
			contractInfo,
			orderInfo
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
					order_id:[{ required:true, message:'请选择订单' }]
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
				if(data.order_id){
					this.params.order_id = data.order_id
					this.$refs.storeList.initData()
				}
				this.clearValidate()
			},
			get(orderId){
				this.loading = true
				storeApi.getSummaryInfo(orderId).then(res=>{
					this.assign(res.data)
					this.loading = false
				})
			},	
			clearValidate(){
				this.$nextTick(()=>{
					this.$refs.form.clearValidate()
				})
			},
			resetFields(){
				this.updated = false
				this.form = {...formInit}
				this.$refs.storeList.clear()
				this.clearValidate()
			},
			openSummaryDialog(){
				this.$refs.summaryDialog.open( { toStorage:1 } )
			},
			selectOrder(row){
				let data = this.$commonJs.obj.copyByKey(row,[
					'order_id','order_no','contract_id','order_area','storage_area_total',
					'no_storage_area','order_date','project_id','project_name',
					'project_no','contract_no','plan_id','self_finish_area_total','out_finish_area_total','finish_area_total'
				])
				this.assign(data)
				this.$refs.summaryDialog.close()
			},
			create(){
				let data = this.$commonJs.obj.copyByKey(this.form,[
					'order_id','project_id','plan_id','contract_id','no_storage_area'
				])
				this.$refs.formDialog.open(data)
			},
			edit({row}){
				this.$refs.formDialog.open(row.id)
			},
			reload(){
				this.$refs.storeList.reload()
				storeApi.getSummary({order_id:this.form.order_id}).then(res=>{
					this.form.storage_area_total = res.data.storage_area_total
					this.form.no_storage_area = (Number(this.form.finish_area_total)-Number(this.form.storage_area_total)).toFixed(2)
				})
				this.updated = true
			},
			del({ row,$index }){
				let confirmText = '确定删除？'
				this.$confirm(confirmText,'提示',{
					type: 'warning'
				}).then(()=>{
					storeApi.del(row.id).then(res=>{
						this.$message.success('删除成功')
						this.reload()					
					})
				})
			},
		}
	}
</script>