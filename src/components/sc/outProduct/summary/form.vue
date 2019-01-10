<template>
	<div v-loading='loading'>
		<el-form 
			:model='form' :rules='rules' 
			ref='form' label-width='85px' 
			size='mini' status-icon
			class='c-form-mini' >
			<el-row :gutter='20' >
				<divider title='订单信息'></divider>
				<el-row :gutter='10' class='c-input-readonly'>
					<el-col :span='8'>
						<el-form-item label='所属订单' prop='order_id'>
							<el-input readonly :value='form.order_no' placeholder='请选择订单'>
								<el-button slot="prepend" v-if='form.order_id' 
									icon='el-icon-document'
									@click='$refs.orderInfo.open(form.order_id)'></el-button>
								<el-button slot="append" @click='openSummaryDialog' type='primary'>选择</el-button>
							</el-input>
						</el-form-item>
					</el-col>	
					<el-col :span='16'>
						<el-form-item label='项目名称' prop='project_name'>
							<el-input readonly :value='form.project_name' placeholder='选择订单自动加载'>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='订单面积' prop='order_area'>
							<el-input readonly :value='form.order_area' placeholder='选择订单'>
								<span slot="suffix">㎡</span>
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
				<divider title='生产信息'></divider>
				<el-row >
					<el-col :span='19'>
						<el-alert
					    title="当已生产面积大于0时，当前订单会出现在储运中心的待入库订单中" 
					    type="warning" style='margin-bottom: 10px'>
					  </el-alert>
						<el-row :gutter='10'>
							<el-col :span='8' >
								<el-form-item label='计划生产' prop='out_area' class='c-input-readonly'>
									<el-input readonly :value='form.out_area' placeholder='选择订单'>
										<span slot="suffix">㎡</span>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span='8'>
								<el-form-item label='已生产面积' prop='out_finish_area_total' class='c-input-readonly'>
									<el-input readonly :value='form.out_finish_area_total' placeholder='选择订单'>
										<span slot="suffix">㎡</span>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span='8'>
								<el-form-item label='未生产面积' prop='no_product_area' class='c-input-readonly'>
									<el-input readonly :value='form.no_product_area' >
										<span slot="suffix">㎡</span>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span='24'>
								<el-form-item label='生产状态' prop='sc_out_product_status'>
									<el-input :value='form.sc_out_product_status' >
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span='24'>
								<el-form-item label='加工单位' prop='product_unit'>
									<el-input :value='form.product_unit' >
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span='24'>
								<el-form-item >
									<el-button type='primary'>保 存</el-button>
								</el-form-item>
							</el-col>
						</el-row>
					</el-col>
					<el-col :span='5' style='text-align: center'>
						<!-- <divider title='生产完成进度'></divider> -->
						<div style='margin-bottom: 10px'>生产完成进度</div>
						<el-progress 
							type="circle" 
							:percentage="$commonJs.getProgressPercentage(form.out_finish_area_total/form.out_area)"
							:stroke-width='10'>
						</el-progress>
					</el-col>
					
				</el-row>
				
				
			</el-row>
		
		
	  
	  <el-row>
	  	
	  </el-row>
	  </el-form>
		<divider title='生产记录列表'></divider>
		<div style='margin-bottom:10px'>
			<el-button type='primary' size='mini' @click='create' :disabled='!form.order_id||form.sc_out_is_finish==1'>添加生产</el-button>
			<el-button type='success' size='mini' @click='productFinish' :disabled='!form.order_id||form.sc_out_is_finish==1'>生产完成</el-button>
		</div>
		<delivery-list 
			hide-query
			:params='params' init 
			ref='deliveryList' size='mini' max-height='200'
			@del='reload'>
			<el-table-column slot='column' fixed='right' label='操作' align='center' width='90' v-if='form.sc_out_is_finish!=1'>
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
	import productApi from '@/api/sc/outProduct'
	import summaryDialog from '@/components/sc/outProduct/summary/listDialog'
	import deliveryList from '@/components/sc/outProduct/list'
	import formDialog from '@/components/sc/outProduct/formDialog'
	import contractInfo from '@/components/yyzx/contract/info'
	import orderInfo from '@/components/yyzx/order/info'
	import statusForm from '@/components/sc/outProduct/summary/statusForm'

	const formInit = {
		order_no:'',
		order_id:null,
		project_id:null,//项目id
		sc_out_is_finish:0,
		project_name:'',//项目名称
		project_no:'',
		contract_no:'',	//合同编号
		order_date:'',
		sc_out_product_status:''
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
					'order_id','order_no','contract_id','order_area','out_finish_area_total',
					'no_product_area','order_date','project_id','project_name','out_area',
					'project_no','contract_no','plan_id','sc_out_product_status',
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
					this.form.out_finish_area_total = res.data.out_finish_area_total
					this.form.no_product_area = (Number(this.form.out_area)-Number(this.form.out_finish_area_total)).toFixed(2)
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
						this.form.sc_out_is_finish=1
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