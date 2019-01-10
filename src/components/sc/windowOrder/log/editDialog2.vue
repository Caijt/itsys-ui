<template>
	<div>
	<el-dialog 
		:title='title'
		class='c-dialog-fixed'
		:visible.sync='show'
		:append-to-body='inDialog'
		@open='openDialog'
		width='80%'
		@close='closeDialog'>
		<div v-loading='loading'>
			<el-form 
				:model='form' :rules='rules' 
				ref='form' label-width='95px' 
				size='mini' status-icon 
				class='c-form-mini'>
				<el-row :gutter='10'>
					<el-col :span='8'>
						<el-form-item label='生产日期' prop='produce_date'>
							<el-date-picker 
								v-model='form.produce_date' 
								value-format='yyyy-MM-dd' 
								style='width: 100%'
								 :picker-options="pickerOptions">
							</el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>				
			</el-form>
			<divider title='产品生产明细'></divider>			
			<project-edit-list :data='form' in-dialog ref='projectEditList'></project-edit-list>
		</div>
			<span slot="footer">
			 	<el-button type='primary' @click='save(1)' :loading='loading'>提交</el-button>
			 	<el-button @click='save(0)' :loading='loading'>保存</el-button>
		    <el-button @click="show=false">关 闭</el-button>
	  	</span>
		</el-dialog>
	</div>
</template>
<script>
	import companyApi from '@/api/yyzx/company'
	import paymentApi from '@/api/cw/receivePaymentRecord'
	import projectEditList from './productEditList'

	const formInit = {
		id:null,
		produce_date:'',
		projectList:null,
		projectRemoveList:null
	}
	export default {
		components:{ 
			projectEditList,
		},
		props:{
			inDialog:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return {
				testMax:0,
				resolve:null,
				show:false,
				loading:false,
				updated:false,
				data: { },
				pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
        },
				companyLoading:false,
				companyList:[],
				form: { ...formInit },
				attachUploadParams: {
					table_name:'cw_receive_payment_record',
					table_id:null,
				},
				paymentMethodList:[
					'电汇','现金','银承','冲账','商承'
				],
				rules:{
					company_id:[{ required:true, message:'请选择收款单位' }],
					customer_id:[{ required:true, message:'请选择回款客户' }],
					payment_date:[{	required:true,message:'请填写回款日期' }],
					currency_price:[
						{	required:true,message:'请填写外币金额' },
						{ type:'number',message:'请输入数字' },
						{ validator:this.$commonJs.validateRules.et0 }
					],
					payment_price:[
						{	required:true,message:'请填写回款金额' },
						{ type:'number',message:'请输入数字' },
						{ validator:this.$commonJs.validateRules.et0 },
						{ validator:(rule,value,callback)=>{
								if(value < this.projectPriceTotal){
									callback(new Error('回款金额小于项目货款核销总回款金额'))
								}else{
									callback()
								}
							} 
						},
					],
				}			
			}
		},
		computed:{
			isEdit(){
				return this.form.id? true:false
			},
			title(){
				let title = '生产日志录入'
				return title
			},
			projectPriceTotal(){
				let sum = 0
				this.$refs.projectEditList.list.forEach(item=>{
					sum += Number(item.payment_price)
				})
				return sum
			}
		},
		mounted(){
		},
		methods:{
			openDialog(){
				this.$nextTick(()=>{
					if(this.resolve){
						this.resolve(this)
					}
				})
			},
			open(){
				this.show = true
				return new Promise((resolve,reject)=>{
					this.resolve = resolve
				}) 
			},
			getForm(id){
				this.loading = true
				paymentApi.getForm(id).then(res=>{
					this.initData(res.data)
					this.loading = false
				})
			},
			create(params={}){
				this.loading = true
				paymentApi.create(params).then(res=>{
					this.initData(res.data)
					this.loading = false
				})
			},			
			save(isSubmit=false){
				this.$refs.form.validate(valid=>{
					if(valid&&this.$refs.projectEditList.validate()){
						if(this.$refs.projectEditList.list.some(item=>{
							return item.customer_id != this.form.customer_id
						})){
							this.$message.error('货款核销的项目客户必须跟回款客户一致！')
							return false
						}
						this.form.input_status = isSubmit?1:0
						if(isSubmit){
							this.$confirm('确定提交吗？提交后信息无法修改','提示',{
								type: 'warning'
							}).then(()=>{
								this.update()
							})
						}else{
							this.update()
						}
					}else{
						this.$message.error('无法保存，请检查错误的字段！')
						return false
					}
				})
			},
			update(){
				this.loading = true
				let messageText = this.form.input_status?'提交成功':'保存成功'
				this.form.projectList = this.$refs.projectEditList.list.map(item=>{
					return this.$commonJs.obj.copyByKey(item,['payment_project_id','project_id','payment_price'])
				})
				this.form.projectRemoveList = this.$refs.projectEditList.removeList.map(item=>{
					return item.payment_project_id
				})
				paymentApi.update(this.form).then(res=>{
					this.updated = true
					this.loading = false
					this.$message.success(messageText)
					this.$refs.projectEditList.reload()						
					if(this.form.input_status==1){
						this.show=false
					}								
				}).catch(res=>{
					this.loading = false
				})
			},
			closeDialog(){	
				if(this.updated){
					this.$emit('updated')
				}
				this.resolve = null
				this.loading = false
				this.resetFields()			
				this.$refs.projectEditList.clear()	
			},
			initData(data){
				this.assign(data)				
				this.clearValidate()
			},
			assign(data){				
				this.form = { ...this.form, ...data }
				return this
			},
			getCompanyList(){
				this.companyLoading = true
				companyApi.getEnumList().then(res=>{
					this.companyList = res.data
					this.companyLoading = false
				})
			},
			clearValidate(){
				this.$nextTick(()=>{
					this.$refs.form && this.$refs.form.clearValidate()
				})
			},
			resetFields(){
				this.updated = false
				this.form = {...formInit}
				this.clearValidate()
				return this
			},
			productUpdated(){
				this.updated = true
				this.$refs.productList.reload()
			},
			openCustomerDialog(){
				this.$refs.customerListDialog.open().then(that=>{
					// that.$refs.list.queryParams.isArrears = 1
					that.$refs.list.initData()
				})
			},
			selectCustomer(row){
				this.form.customer_name = row.name
				this.form.customer_type = row.type
				this.form.customer_id = row.id
				this.form.arrears_price = row.arrears_price
				this.form.settlement_area_total = row.settlement_area_total
				this.form.settlement_price_total = row.settlement_price_total
				this.$refs.customerListDialog.close()
			},
			openContract(){
				this.$refs.contractListDialog.open().then(that=>{
					// that.$refs.list.queryParams.isArrears = 1
					that.$refs.list.initData({customer_id:this.form.customer_id})
				})
			},
			selectContract(row){
				this.form.contract_no = row.contract_no
				this.form.salesman = row.salesman
				this.$refs.contractListDialog.close()
			},
		}
	}
</script>