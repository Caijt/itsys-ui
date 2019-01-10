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
								<el-input readonly :value='form.order_area' >
									<span slot="suffix">㎡</span>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='计划生产' prop='self_area'>
								<el-input readonly :value='form.self_area' >
									<span slot="suffix">㎡</span>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='已生产面积' prop='sc_self_finish_area_total'>
								<el-input readonly :value='form.sc_self_finish_area_total' >
									<span slot="suffix">㎡</span>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='未生产面积' prop='no_product_area'>
								<el-input readonly :value='form.no_product_area'>
									<span slot="suffix">㎡</span>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span='16'>
							<el-form-item label='生产状态' prop='sc_self_product_status'>
								<el-input readonly :value='form.sc_self_product_status' >
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-col>
				<el-col :span='6' style='text-align: center'>
					<divider title='生产完成进度'></divider>
					<el-progress 
						type="circle" 
						:percentage="$commonJs.getProgressPercentage(form.sc_self_finish_area_total/form.self_area)"
						:stroke-width='10'>
					</el-progress>
				</el-col>
			</el-row>
		</el-form>
		<el-alert
	    title="当已生产面积大于0时，当前订单会出现在储运中心的待入库订单中" 
	    type="warning" style='margin-bottom: 10px'>
	  </el-alert>
		<divider title='生产列表'></divider>
		<el-alert
	    title="当订单已完成生产，点击以下生产完成按钮进行提交，提交后当前订单的生产记录将无法添加及修改" 
	    type="warning" style='margin-bottom: 10px'></el-alert>
		<div style='margin-bottom:10px'>
			<el-button type='primary' size='mini' @click='create' :disabled='!form.order_id||form.sc_self_is_finish==1'>添加生产记录</el-button>
			<span></span>
			<el-button type='primary' size='mini' @click='openStatusDialog' :disabled='!form.order_id'>修改生产状态</el-button>
			<span></span>
			<el-button type='success' size='mini' @click='productFinish' :disabled='!form.order_id||form.sc_self_is_finish==1'>生产完成</el-button>
		</div>
		<delivery-list 
			:params='params' ref='deliveryList' size='mini' max-height='200'
			@del='reload'>
			<el-table-column slot='column' fixed='right' label='操作' align='center' width='90' v-if='form.sc_self_is_finish!=1'>
				<template slot-scope='scope'>
					<el-button size='mini' type='text' @click='edit(scope)'>编辑</el-button>
					<el-button size='mini' type='text' @click='del(scope)'>删除</el-button>
				</template>
			</el-table-column>
		</delivery-list>
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
		<status-form ref='statusForm' :in-dialog='inDialog' @saved='statusSaved'></status-form>
	</div>
</template>
<script>
	import productApi from '@/api/sc/product'
	import summaryDialog from '@/components/sc/product/summary/listDialog'
	import deliveryList from '@/components/sc/product/list'
	import formDialog from '@/components/sc/product/formDialog'
	import contractInfo from '@/components/yyzx/contract/info'
	import orderInfo from '@/components/yyzx/order/info'
	import statusForm from '@/components/sc/product/summary/statusForm'

	const formInit = {
		order_no:'',
		order_id:null,
		project_id:null,//项目id
		project_name:'',//项目名称
		project_no:'',
		contract_no:'',	//合同编号
		order_date:'',
		storage_area_total:'',
		delivery_area_total:'',
		no_delivery_area:'',
		sc_self_is_finish:0
	}
	export default {
		components:{
			summaryDialog,
			deliveryList,
			formDialog,
			contractInfo,
			orderInfo,
			statusForm
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
				this.$refs.summaryDialog.open( { toProduct:1 } )
			},
			selectOrder(row){
				let data = this.$commonJs.obj.copyByKey(row,[
					'order_id','order_no','contract_id','order_area','sc_self_finish_area_total',
					'no_product_area','order_date','project_id','project_name','self_area','sc_self_is_finish','sc_self_product_status',
					'project_no','contract_no','plan_id'
				])
				this.assign(data)
				this.$refs.summaryDialog.close()
			},
			create(){
				let data = this.$commonJs.obj.copyByKey(this.form,[
					'order_id','project_id','plan_id','contract_id','no_product_area'
				])
				this.$refs.formDialog.open(data)
			},
			edit({row}){
				this.$refs.formDialog.open(row.id)
			},
			reload(){
				productApi.getSummary({order_id:this.form.order_id}).then(res=>{
					this.form.sc_self_finish_area_total = res.data.sc_self_finish_area_total
					this.form.no_product_area = (Number(this.form.self_area)-Number(this.form.sc_self_finish_area_total)).toFixed(2)
				})
				this.$refs.deliveryList.reload()
				this.updated = true
			},
			del(scope){
				this.$refs.deliveryList.del(scope)
			},
			productFinish(){
				this.$confirm('当前订单已生产完成？确定后此订单将无法增加或修改生产记录','提示',{
					type: 'warning'
				}).then(()=>{
					productApi.productFinish(this.form.order_id).then(res=>{
						this.$message.success('生产完成')
						this.form.sc_self_is_finish=1
						this.updated = true
					})
				})
			},
			openStatusDialog(){
				this.$refs.statusForm.open({
					order_id: this.form.order_id,
					product_status: this.form.sc_self_product_status
				})
			},
			statusSaved(data){
				this.form.sc_self_product_status = data.new_product_status
				this.updated = true
			}
		}
	}
</script>