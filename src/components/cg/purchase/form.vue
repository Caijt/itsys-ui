<template>
	<div>
		<el-form 
			:model='form' 
			:rules='rules' 
			ref='form' 
			label-width='100px'  
			size='mini' 
			class='c-form-mini' 
			status-icon>
			<divider title='订单信息'></divider>	
			<el-row :gutter='10' class='c-input-readonly'>
				<el-col :span='12'>
					<el-form-item label='所属订单' prop='order_id'>
						<el-input v-model='form.order_no' placeholder='请选择订单'>
							<el-button slot="append" @click='openSummaryDialog'>选择</el-button>
						</el-input>
					</el-form-item>
				</el-col>	
				<el-col :span='6'>
					<el-form-item label='项目名称' prop='project_name'>
						<el-input readonly :value='form.project_name' placeholder='选择订单自动加载'>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span='6'>
					<el-form-item label='项目编号'>
						<el-input readonly :value='form.project_no' placeholder='选择订单自动加载'></el-input>
					</el-form-item>
				</el-col>
				<el-col :span='6'>
					<el-form-item label='合同编号'>
						<el-input readonly :value='form.contract_no' placeholder='选择订单自动加载'></el-input>
					</el-form-item>
				</el-col>
				<el-col :span='6'>
					<el-form-item label='订单类别' prop='order_type'>
						<el-input readonly :value='form.order_type' placeholder='选择订单自动加载'></el-input>
					</el-form-item>
				</el-col>	
				<el-col :span='6'>
					<el-form-item label='订单批次' prop='order_batch'>
						<el-input readonly :value='form.order_batch' placeholder='选择订单自动加载'></el-input>
					</el-form-item>
				</el-col>	
				<el-col :span='6'>
					<el-form-item label='订单面积' prop='order_area'>
						<el-input readonly :value='form.order_area' placeholder='选择订单'>
							<span slot="suffix">㎡</span>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span='6'>
					<el-form-item label='订单数量'  prop='order_amount'>
						<el-input readonly :value='form.order_amount' placeholder='选择订单'></el-input>
					</el-form-item>
				</el-col>
				<el-col :span='6'>
					<el-form-item label='下单日期' prop='order_date'>
						<el-input readonly :value='form.order_date' placeholder='选择订单'></el-input>
					</el-form-item>
				</el-col>		
				<el-col :span='6'>
					<el-form-item label='交货日期'  prop='order_delivery_date'>
						<el-input readonly :value='form.order_delivery_date' placeholder='选择订单'></el-input>
					</el-form-item>
				</el-col>	
				<el-col :span='6'>
					<el-form-item label='采购类型'  prop='purchase_type'>
						<el-input readonly :value='form.purchase_type' placeholder='选择订单'></el-input>
					</el-form-item>
				</el-col>	
				<el-col :span='24'>
					<el-form-item label='采购OA'  prop='purchase_oa'>
						<el-input readonly :value='form.purchase_oa' placeholder='选择订单'></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<divider title='五金采购报告'></divider>
			<el-row :gutter='10'>
				<el-col :span='6'>
					<el-form-item label='五金采购日期' prop='purchase_date'>
						<el-date-picker v-model='form.purchase_date' style='width: 100%' value-format='yyyy-MM-dd'></el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span='6'>
					<el-form-item label='五金采购金额' prop='purchase_price'>
						<el-input v-model.number='form.purchase_price'>
							<span slot="prefix">￥</span>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span='6'>
					<el-form-item label='五金品牌' prop='brand'>
						<el-input v-model='form.brand'>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span='6'>
					<el-form-item label='五金到货日期' prop='delivery_date'>
						<el-date-picker v-model='form.delivery_date' style='width: 100%' value-format='yyyy-MM-dd'></el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span='24'>
					<el-form-item label='状态描述' prop='purchase_status'>
						<el-input v-model='form.purchase_status' type='textarea' :rows='3'></el-input>
					</el-form-item>
				</el-col>
				<el-col :span='24'>
					<el-form-item label='资金需求计划' prop='demand_plan'>
						<el-input v-model='form.demand_plan' ></el-input>
					</el-form-item>
				</el-col>
				<el-col :span='12'>
					<el-form-item label='采购状态' prop='is_finish'>
						<el-radio-group v-model="form.is_finish">
					    <el-radio :label='0'>采购中</el-radio>
					    <el-radio :label="1">已到货</el-radio>
					  </el-radio-group>
					</el-form-item>
				</el-col>
			</el-row>
			<divider title='型材采购报告'></divider>
			<el-row :gutter='10'>
				<el-col :span='6'>
					<el-form-item label='型材采购日期' prop='xc_purchase_date'>
						<el-date-picker v-model='form.xc_purchase_date' style='width: 100%' value-format='yyyy-MM-dd'></el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span='6'>
					<el-form-item label='型材采购金额' prop='xc_purchase_price'>
						<el-input v-model.number='form.xc_purchase_price'>
							<span slot="prefix">￥</span>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span='6'>
					<el-form-item label='型材品牌' prop='xc_brand'>
						<el-input v-model='form.xc_brand'>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span='6'>
					<el-form-item label='型材到货日期' prop='xc_delivery_date'>
						<el-date-picker v-model='form.xc_delivery_date' style='width: 100%' value-format='yyyy-MM-dd'></el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span='24'>
					<el-form-item label='状态描述' prop='xc_purchase_status'>
						<el-input v-model='form.xc_purchase_status' type='textarea' :rows='3'></el-input>
					</el-form-item>
				</el-col>
				<el-col :span='24'>
					<el-form-item label='资金需求计划' prop='xc_demand_plan'>
						<el-input v-model='form.xc_demand_plan' ></el-input>
					</el-form-item>
				</el-col>
				<el-col :span='12'>
					<el-form-item label='采购状态' prop='xc_is_finish'>
						<el-radio-group v-model="form.xc_is_finish">
					    <el-radio :label='0'>采购中</el-radio>
					    <el-radio :label="1">已到货</el-radio>
					  </el-radio-group>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<summary-dialog ref='summaryDialog' :in-dialog='inDialog'>
			<el-table-column slot='column' width='60' align='center' label='操作' fixed='right'>
				<template slot-scope='scope'>
					<el-button size='mini' type='text' @click='selectProject(scope)'>选择</el-button>
				</template>
			</el-table-column>
		</summary-dialog>
	</div>
</template>
<script>
	import purchaseApi from '@/api/cg/purchase'
	import summaryDialog from '@/components/cg/purchase/summary/listDialog'
	const formInit = {
		order_no:'',
		order_id:null,
		project_id:null,//项目id
		project_name:'',//项目名称
		project_no:'',
		contract_no:'',	//合同编号
		order_type:'',
		order_batch:'',
		order_area:'',
		order_amount:'',
		order_date:'',
		order_delivery_date:'',
		purchase_oa:'',
		purchase_type:'',
		id:null,
		purchase_date:'',
		purchase_price:0,
		brand:'',
		delivery_date:'',
		demand_plan:'',
		purchase_status:'',
		is_finish:'',
		xc_purchase_date:'',
		xc_purchase_price:0,
		xc_delivery_date:'',
		xc_demand_plan:'',
		xc_purchase_status:'',
		xc_is_finish:'',
		xc_brand:''
	}
	export default {
		components:{
			summaryDialog
		},
		props:{
			inDialog:{
				type:Boolean,
				default:false
			}
		},
		data(){			
			return {
				formLoading:false,
				orderTypeLoading:true,
				form:{ ...formInit },
				maxOrderArea:0,
				rules:{
					order_id:[{ required:true, message:'请选择订单' }],
					// purchase_price:[{	type:'number', message:'请输入数字'}],
					// purchase_date:[{ required:true, message:'请填写采购日期'}],
					// is_finish:[{ required:true, message:'请选择采购状态'}]
				}
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
				this.form.purchase_price=Number(this.form.purchase_price)
				this.form.xc_purchase_price=Number(this.form.xc_purchase_price)
			},
			//保存
			save() {
				return new Promise(( resolve,reject )=>{
					this.$refs.form.validate(vaild=>{
						if(vaild){
							if(this.isEdit){						
								purchaseApi.update(this.form).then(res=>{
									this.$message.success('更新成功')
									this.$emit('updated')
									this.$emit('saved')
									resolve('updated')
								})
							}else{						
								purchaseApi.create(this.form).then(res=>{
									this.$message.success('创建成功')
									this.$emit('created')
									this.$emit('saved')
									resolve('created')
								})
							}
							resolve()
						}else{
							reject()
						}
					})
				})
			},
			clearValidate(){
				this.$refs.form.clearValidate()
			},
			resetFields(){
				this.$refs.form.resetFields()
				this.form = {...formInit}
			},
			openSummaryDialog(){
				this.$refs.summaryDialog.open({toPurchase:1})
			},
			selectProject({row}){
				let data = this.$commonJs.obj.copyByKey(row,[
					'order_id','order_no','order_type','order_batch','order_area','order_amount','order_date','order_delivery_date','purchase_type','purchase_oa',
					'project_id','project_name','project_no','contract_no','plan_id'
				])
				this.assign(data)	
				this.$refs.summaryDialog.close()
			}
		}
	}
</script>