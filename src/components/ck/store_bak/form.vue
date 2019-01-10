<template>
	<div>
		<el-form 
			:model='form' :rules='rules' ref='form' label-width='100px' size='small' status-icon>
			<divider title='订单信息'></divider>
			<el-row :gutter='10' class='c-input-readonly'>
				<el-col :span='8'>
					<el-form-item label='订单编号' prop='order_id'>
						<el-input v-model='form.order_no' placeholder='请选择订单'>
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
						<el-input readonly :value='form.project_no' placeholder='选择订单自动加载'></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter='10' class='c-input-readonly'>
				<el-col :span='8'>
					<el-form-item label='合同编号'>
						<el-input readonly :value='form.contract_no' placeholder='选择订单自动加载'>
							<el-button slot="prepend" @click='$refs.contractInfo.open(form.contract_id)' v-if='form.contract_id'>查看</el-button>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span='8'>
					<el-form-item label='订单类别' prop='order_type'>
						<el-input readonly :value='form.order_type' placeholder='选择订单自动加载'></el-input>
					</el-form-item>
				</el-col>	
				<el-col :span='8'>
					<el-form-item label='订单批次' prop='order_batch'>
						<el-input readonly :value='form.order_batch' placeholder='选择订单自动加载'></el-input>
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
					<el-form-item label='订单数量'  prop='order_amount'>
						<el-input readonly :value='form.order_amount' placeholder='选择订单'></el-input>
					</el-form-item>
				</el-col>
				<el-col :span='8'>
					<el-form-item label='下单日期' prop='order_date'>
						<el-input readonly :value='form.order_date' placeholder='选择订单'></el-input>
					</el-form-item>
				</el-col>		
				<el-col :span='8'>
					<el-form-item label='交货日期'  prop='order_delivery_date'>
						<el-input readonly :value='form.order_delivery_date' placeholder='选择订单'></el-input>
					</el-form-item>
				</el-col>	
			</el-row>
			<divider title='物料入库报告'></divider>
			<el-row :gutter='10'>
				<el-col :span='8'>
						<el-form-item label='型材入库日期' prop='xc_storage_date'>
							<el-date-picker v-model='form.xc_storage_date' value-format='yyyy-MM-dd' style='width:100%'></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='材料类别' prop='material_type'>
							<el-input v-model='form.material_type'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='材料状态' prop='material_status'>
							<el-input v-model='form.material_status'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='24'>
						<el-form-item label='材料库存情况' prop='material_stock'>
							<el-input v-model='form.material_stock'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='24'>
						<el-form-item label='非通用材料情况' prop='other_material_stock'>
							<el-input v-model='form.other_material_stock'></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter='20'>
					<el-col :span='8'>
						<el-form-item label='五金入库日期' prop='hardware_storage_date'>
							<el-date-picker v-model='form.hardware_storage_date' value-format='yyyy-MM-dd' style='width:100%'></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='五金材料状态' prop='hardware_status'>
							<el-input v-model='form.hardware_status'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='24'>
						<el-form-item label='五金库存情况' prop='hardware_stock'>
							<el-input v-model='form.hardware_stock'></el-input>
						</el-form-item>
					</el-col>
			</el-row>
		</el-form>
		<summary-dialog title='订单' ref='summaryDialog' :in-dialog='inDialog'>
			<el-table-column slot='column' width='60' align='center' label='操作' fixed='right'>
				<template slot-scope='{row}'>
					<el-button size='mini' type='text' @click='selectOrder(row)'>选择</el-button>
				</template>
			</el-table-column>
		</summary-dialog>
		<contract-info :in-dialog='inDialog' ref='contractInfo'></contract-info>
	</div>
</template>
<script>
	import storeApi from '@/api/ck/store'
	import summaryDialog from '@/components/ck/store2/summary/listDialog'
	import contractInfo from '@/components/yyzx/contract/info'

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

		id:null,
		xc_storage_date:'',
		material_type:'',
		material_status:'',
		material_stock:'',
		other_material_stock:'',
		hardware_storage_date:'',
		hardware_status:'',
		hardware_stock:''
	}
	export default {
		components:{
			summaryDialog,contractInfo
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
					order_id:[{ required:true, message:'请选择订单' }]
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
				this.form.storage_area=Number(this.form.storage_area)
				this.form.to_storage_area_total = Number(this.form.self_to_storage_area_total)+Number(this.form.out_to_storage_area_total)
			},
			//保存
			save() {
				return new Promise(( resolve,reject )=>{
					this.$refs.form.validate(vaild=>{
						if(vaild){
							if(this.isEdit){						
								storeApi.update(this.form).then(res=>{
									this.$message.success('更新成功')
									this.$emit('updated')
									this.$emit('saved')
									resolve('updated')
								})
							}else{						
								storeApi.create(this.form).then(res=>{
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
				this.$refs.summaryDialog.open( { toStorage:1 } )
			},
			selectOrder(row){
				let data = this.$commonJs.obj.copyByKey(row,[
					'order_id','order_no','order_type','order_batch','order_area','order_amount',
					'order_date','order_delivery_date','project_id','project_name','project_no',
					'contract_no','plan_id'
				])
				this.assign(data)					
				this.$refs.summaryDialog.close()
			}
		}
	}
</script>