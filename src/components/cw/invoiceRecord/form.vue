<template>
	<div v-loading='loading'>
		<el-form 
			:model='form' :rules='rules' ref='form' label-width='85px' 
			size='mini' status-icon class='c-form-mini'>
			<divider title='开票记录'></divider>
			<el-alert :title='"根据项目金额，可得出当前记录最大可开票金额为￥"+maxInvoicePrice+"，但目前暂时不做金额最大值限制"' style='margin-bottom: 10px' type='warning'></el-alert>
			<el-form-item label='开票单位' prop='company_id'>
				<el-select v-model='form.company_id' style='width:100%' clearable :loading='companyLoading'>
					<el-option 
						v-for='item in companyList' 
						:key='item.id'
						v-show='!item.is_disabled'
						:label='item.name'
						:value='item.id'>
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label='开票日期' prop='invoice_date'>
				<el-date-picker v-model='form.invoice_date' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
			</el-form-item>
			<el-form-item label='开票金额' prop='invoice_price'>
				<el-input v-model.number='form.invoice_price' >
					<span slot='prefix'>￥</span>
				</el-input>
			</el-form-item>
			<el-form-item label='开票号' prop='invoice_no'>
				<el-input v-model='form.invoice_no' ></el-input>
			</el-form-item>
			<el-form-item label='备注' prop='remarks'>
				<el-input v-model='form.remarks' ></el-input>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
	import companyApi from '@/api/yyzx/company'
	import invoiceRecordApi from '@/api/cw/invoiceRecord'

	const formInit = {
		id:null,
		contract_id:null,
		project_id:null,//项目id
		no_invoice_price:'',
		company_id:'',
		invoice_date:'',
		invoice_price:0,
		invoice_no:'',
		remarks:''
	}
	export default {
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
			return {
				loading:false,
				companyLoading:true,
				form:{...formInit},
				companyList:[],
				maxInvoicePrice:0,
				rules:{
					company_id:[{ required:true, message:'请选择开票单位' }],
					project_id:[{ required:true, message:'请选择订单所属项目' }],
					invoice_date:[{	required:true,message:'请填写开票日期' }],
					invoice_price:[
					{ type:'number',message:'请输入数字' },
					{ 
						validator:(rule,value,callback)=>{
							if(value > this.maxInvoicePrice){
								callback()
								// callback(new Error('开票金额已超过最大开票金额'))
							}else if(value<=0){
								callback(new Error('开票金额必须大于0'))
							}else{
								callback()
							}
						}
					}],
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
			this.getCompanyList()
		},
		methods:{
			get(id){
				this.loading = true
				invoiceRecordApi.getForm(id).then(res=>{
					this.assign(res.data)
					this.loading = false
				})
			},
			//获取订单类型列表
			getCompanyList(){
				this.companyLoading = true
				companyApi.getEnumList().then(res=>{
					this.companyList = res.data
					this.companyLoading = false
				})
			},
			assign(data){
				this.form = {...this.form,...data}
				this.form.invoice_price=Number(this.form.invoice_price)
				this.maxInvoicePrice = (Number(this.form.no_invoice_price) + Number(this.form.invoice_price)).toFixed(2)
			},
			//保存
			save() {
				return new Promise(( resolve,reject )=>{
					this.$refs.form.validate(vaild=>{
						if(vaild){
							if(this.isEdit){						
								invoiceRecordApi.update(this.form).then(res=>{
									this.$message.success('更新成功')
									this.$emit('updated')
									this.$emit('saved')
									resolve('updated')
								})
							}else{						
								invoiceRecordApi.create(this.form).then(res=>{
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
			openprojectListDialog(){
				this.$refs.projectListDialog.open( { hasDelivery:1,toInvoice:1 } )
			},
			selectProject({row}){
				let data = this.$commonJs.obj.copyByKey(row,[
					'project_id','project_name','project_no','project_customer','company_name',
					'salesman','project_price','no_invoice_price','delivery_area_total',
					'contract_no','project_area'])
				this.assign(data)	
				this.$refs.projectListDialog.close()
			}
		}
	}
</script>