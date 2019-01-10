<template>
	<div>
		<el-form 
			:model='form' :rules='rules' ref='form' label-width='85px' 
			size='mini' status-icon class='c-form-mini'>
			<divider title='订单信息'></divider>
			<el-alert type='warning' title='计划创建后，所属订单无法修改！' style='margin-bottom: 10px'></el-alert>
			<el-form-item label='选择订单' prop='order_id' class='c-input-readonly'>
				<el-input readonly :value='form.order_id?(form.order_no||"待生成"):""' placeholder='选择订单'>
					<el-button slot="append" @click='openOrderSummaryDialog' :disabled='isEdit'>选择</el-button>
				</el-input>
			</el-form-item>
			<el-row :gutter='10' class='c-input-readonly'>				
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
				<el-col :span='8'>
					<el-form-item label='合同编号'>
						<el-input readonly :value='form.contract_no' placeholder='选择订单自动加载'>
							<el-button slot='prepend'  v-if='form.contract_id' icon='el-icon-document'></el-button>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter='10' class='c-input-readonly'>
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
					<el-form-item label='下单数量'  prop='order_amount'>
						<el-input readonly :value='form.order_amount' placeholder='选择订单'></el-input>
					</el-form-item>
				</el-col>
				<el-col :span='8'>
					<el-form-item label='下单日期' prop='order_date'>
						<el-input readonly :value='form.order_date' placeholder='选择订单'></el-input>
					</el-form-item>
				</el-col>		
				<el-col :span='8'>
					<el-form-item label='交货日期'  prop='delivery_date'>
						<el-input readonly :value='form.delivery_date' placeholder='选择订单'></el-input>
					</el-form-item>
				</el-col>	
				<el-col :span='8'>
					<el-form-item label='订单附件'>
						<el-button @click='attach' size='mini' type='primary'>{{ form.attach_ids?form.attach_ids.split(',').length:0}}</el-button>
					</el-form-item>
				</el-col>	
			</el-row>
			<el-row v-if='!isEdit'>
				<el-col :span='8'>
					<el-form-item label='订单编号' prop='erp_order_no'>
						<el-input v-model='form.erp_order_no' placeholder='ERP生成的订单号'></el-input>
					</el-form-item>
				</el-col>	
				<el-col :span='16'>
					<span class='el-upload__tip'>（填写ERP生成的订单号，例如X118000000，会覆盖原订单号，创建后无法修改）</span>
				</el-col>
			</el-row>
			<el-row>
				<divider title='物料需求计划'></divider>
				<el-col :span='6'>
					<el-form-item label='物料采购'  prop='is_purchase'>
						<el-tooltip content='打开后此需求计划会出现在物料采购的待采购订单中'>
							<el-switch v-model="form.is_purchase" :active-value='1' :inactive-value='0'></el-switch>
						</el-tooltip>
					</el-form-item>
				</el-col>
				<el-col :span='6'>
					<el-form-item label='采购类型' prop='purchase_type' v-if='form.is_purchase'>
						<el-checkbox-group v-model="form.purchase_type">
					    <el-checkbox label="型材"></el-checkbox>
					    <el-checkbox label="五金"></el-checkbox>
					  </el-checkbox-group>
					</el-form-item>
				</el-col>
				<el-col :span='6'>
					<el-form-item label='库存报告' v-if='form.ck_record_total!=null'>
						<el-button size='mini' type='primary' @click='$refs.storeDialog.open({order_id:form.order_id})'>{{form.ck_record_total}}</el-button>
					</el-form-item>
				</el-col>
				<el-col :span='24'>
					<el-form-item label='采购OA' prop='purchase_oa' v-if='form.is_purchase'>
						<el-input v-model='form.purchase_oa' placeholder='多个OA号请用逗号隔开'></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<divider title='车间生产计划'></divider>
				<el-col :span='6'>
					<el-form-item label='车间生产'  prop='is_self'>
						<el-tooltip content='打开后此需求计划会出现在车间生产任务的待生产订单中'>
							<el-switch v-model="form.is_self" :active-value='1' :inactive-value='0'></el-switch>
						</el-tooltip>
					</el-form-item>
				</el-col>
				<el-col :span='6' v-if='form.is_self'>
					<el-form-item label='生产面积' prop='self_area'>
						<el-input v-model.number='form.self_area'>
							<span slot="suffix">㎡</span>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span='6' v-if='form.is_self'>
					<el-form-item label='生产数量'  prop='self_amount'>
						<el-input v-model.number='form.self_amount'></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<divider title='外协生产计划'></divider>
				<el-col :span='6' >
					<el-form-item label='外协生产'  prop='is_out'>
						<el-tooltip content='打开后此需求计划会出现在外协生产任务的待生产订单中'>
							<el-switch v-model="form.is_out" :active-value='1' :inactive-value='0'></el-switch>
						</el-tooltip>
					</el-form-item>
				</el-col>
				<el-col :span='6' v-if='form.is_out'>
					<el-form-item label='生产面积'  prop='out_area'>
						<el-input v-model.number='form.out_area'>
							<span slot="suffix">㎡</span>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span='6' v-if='form.is_out'>
					<el-form-item label='生产数量'  prop='out_amount'>
						<el-input v-model.number='form.out_amount'></el-input>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<el-alert
    title="车间生产与外协生产的生产面积、数量总和必须等于订单面积、订单数量！"
    type="warning"
    :closable="false">
	  </el-alert>
		<order-summary-dialog ref='orderSummaryDialog' :in-dialog='inDialog'>
			<el-table-column slot='column' width='60' align='center' label='操作' fixed='right'>
				<template slot-scope='scope'>
					<el-button size='mini' type='text' @click='selectProject(scope)'>选择</el-button>
				</template>
			</el-table-column>
		</order-summary-dialog>
		<attach-list-dialog :in-dialog='inDialog' ref='attachListDialog'></attach-list-dialog>
		<store-dialog :in-dialog='inDialog' ref='storeDialog' />
	</div>
</template>
<script>
	import planApi from '@/api/sc/productDemandPlan'
	import orderApi from '@/api/yyzx/order'
	import orderSummaryDialog from '@/components/sc/productDemandPlan/summary/listDialog'
	import attachListDialog from '@/components/attachListDialog'
	import storeDialog from '@/components/ck/store/listDialog'

	const formInit = {
		id:null,
		order_id:null,
		contract_id:null,
		project_id:null,//项目id
		type_id:null,//订单类型id
		ck_record_total:null,
		project_name:'',//项目名称
		contract_no:'',	//合同编号
		contract_area:'',
		no_order_area:'',
		attach_ids:'',

		erp_order_no:'',
		is_purchase:0,
		purchase_type:[],
		purchase_oa:'',
		is_self:0,
		self_area:0,
		self_amount:0,
		is_out:0,
		out_area:0,
		out_amount:0,
	}
	export default {
		components:{
			orderSummaryDialog, attachListDialog, storeDialog
		},
		props:{
			size:{
				default:'small'
			},
			inDialog:{
				type:Boolean,
				default:false
			}
		},
		data(){
			let orderNoValidator = (rule,value,callback)=>{
				orderApi.checkNoUnique( value, this.form.order_id ).then(res=>{
					if( res.data > 0 ){
						callback(new Error('订单号已重复'))
					}else{
						callback()
					}
				})
			}
			let areaValidator = (rule,value,callback)=>{
				if(value<=0){
					callback(new Error('生产面积必须大于0'))
				}else if(Number(this.form.self_area)+Number(this.form.out_area)!==Number(this.form.order_area)){
					callback(new Error('计划生产面积必须等于订单面积'))
				}else{
					callback()
				}
			}
			let amountValidator = (rule,value,callback)=>{
				if(Number(this.form.self_amount)+Number(this.form.out_amount)!==Number(this.form.order_amount)){
					callback(new Error('计划生产数量必须等于订单数量'))
				}else{
					callback()
				}
			}
			return {
				formLoading:false,
				orderTypeLoading:true,
				form:{ ...formInit },
				maxOrderArea:0,
				rules:{
					erp_order_no:[
						{ required:true, message:'请填写ERP生成的订单号' },
						{ validator:orderNoValidator, trigger:'blur' }
					],
					order_id:[{ required:true, message:'请选择订单' }],
					finish_date:[{	required:true,message:'请填写完成日期' }],
					purchase_type:[{	required:true,message:'请选择采购类型' }],
					self_amount:[
					{	type:'number',message:'请输入数字'},
					{ validator:amountValidator }],
					self_area:[
					{ type:'number',message:'请输入数字' },
					{ validator:areaValidator }],
					out_amount:[
					{	type:'number',message:'请输入数字'},
					{ validator:amountValidator }],
					out_area:[
					{ type:'number',message:'请输入数字' },
					{ validator:areaValidator}],
					purchase_oa:[{ required:true,message:'请填写关联的物料请购单OA'}]
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
				this.form = {...this.form,...data}				
				this.form.self_area=Number(this.form.self_area)
				this.form.self_amount=Number(this.form.self_amount)
				this.form.out_area=Number(this.form.out_area)
				this.form.out_amount=Number(this.form.out_amount)
				this.form.purchase_type = data.purchase_type?data.purchase_type.split(','):[]
			},
			//保存
			save() {
				return new Promise(( resolve,reject )=>{
					this.$refs.form.validate(vaild=>{
						if(vaild){
							if(this.isEdit){						
								planApi.update(this.form).then(res=>{
									this.$message.success('更新成功')
									this.$emit('updated')
									this.$emit('saved')
									resolve('updated')
								})
							}else{						
								planApi.create(this.form).then(res=>{
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
			openOrderSummaryDialog(){
				this.$refs.orderSummaryDialog.open({toPlan:1})
			},
			selectProject({row}){
				let data = this.$commonJs.obj.copyByKey(row,[
					'order_id','order_no','order_type','order_batch','order_area','order_amount','order_date','delivery_date','ck_record_total',
					'project_id','project_name','project_no','contract_no','contract_id','attach_ids'
				])
				this.assign(data)	
				this.$refs.orderSummaryDialog.close()
			},
			attach(){
				this.$refs.attachListDialog.open({attach_ids:this.form.attach_ids})
			}
		}
	}
</script>