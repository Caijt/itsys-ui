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
			<el-form class='c-form-text' label-width='85px' v-show='form.project_id'>
				<divider title='对账项目信息'></divider>	
				<el-row :gutter='10'>
					<el-col :span='16'>
						<el-form-item label='项目名称'>
							<span>{{form.project_name}}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='类别'>
							<span>{{form.customer_type}}</span>
						</el-form-item>
					</el-col>					
				</el-row>
			</el-form>
			<el-form 
				:model='form' :rules='rules' ref='form' label-width='95px' size='mini' status-icon
				class='c-form-mini'>
				<divider title='本次对账信息'></divider>	
				<el-row :gutter='10'>
					<el-col :span='16'>
						<el-form-item label='对账项目' prop='project_id' class='no-border' :inline-message='true'>
							<el-button type='primary' @click='openCustomerDialog'>{{ form.project_id?form.project_name:'选择'}}</el-button>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter='10'>
					<el-col :span='8'>
						<el-form-item label='回款日期' prop='payment_date'>
							<el-date-picker 
								v-model='form.payment_date' 
								value-format='yyyy-MM-dd' 
								style='width: 100%'
								 :picker-options="pickerOptions">
							</el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter='10'>
					<el-col :span='8'>
						<el-form-item label='回款金额' prop='payment_price'>
							<el-input v-model.number='form.payment_price' >
								<span slot='prefix'>￥</span>
								<span slot='suffix'>人民币</span>
							</el-input>
						</el-form-item>
					</el-col>					
				</el-row>	
			<el-form-item label='备注' prop='remarks'>
			  <el-input v-model='form.remarks' ></el-input>
			</el-form-item>
				<el-form-item label='附件管理' >
					<attach-upload ref='attachUpload' :params='attachUploadParams' @uploaded='res=>{$refs.attachList.push(res)}'></attach-upload>
					<attach-list show-del ref='attachList'></attach-list>
				</el-form-item>	
			</el-form>
			<divider title='对账产品明细'></divider>
			<el-alert title='此次回款的金额是哪些项目货款的，如果暂时不知是哪个项目货款的，可以先不选择，提交后在项目货款核销功能中进行处理' type='warning' style='margin-bottom: 10px'></el-alert>	
			<project-edit-list :payment-form='form' in-dialog ref='projectEditList'></project-edit-list>
		</div>
			<span slot="footer">
			 	<el-button type='primary' @click='save(1)' :loading='loading'>提交</el-button>
			 	<el-button @click='save(0)' :loading='loading'>保存</el-button>
		    <el-button @click="show=false">关 闭</el-button>
	  	</span>
		</el-dialog>
		<customer-list-dialog ref='customerListDialog'>
			<el-table-column slot='column' fixed='right' align='center' label='操作' width='60'>
				<template slot-scope='{row}'>
					<el-button type='text' @click='selectProject(row)'>选择</el-button>
				</template>
			</el-table-column>
		</customer-list-dialog>		
	</div>
</template>
<script>
	import companyApi from '@/api/yyzx/company'
	import paymentApi from '@/api/cw/receivePaymentRecord'
	import attachUpload from '@/components/common/attach/upload'
	import attachList from '@/components/common/attach/textList'
	import customerListDialog from '@/components/yyzx/project/listDialog'
	import contractListDialog from '@/components/cw/arrears/contractListDialog'
	import projectEditList from './productEditList'

	const formInit = {
		id:null,
		input_status:-1,
		project_id:null,
		arrears_price:0,
		customer_id:null,
		customer_name:'',
		customer_no:'',
		salesman:'',
		payment_date:'',
		payment_price:0,
		payment_currency:'CNY',
		payment_method:'',
		currency_price:'',
		remarks:'',
		projectList:null,
		projectRemoveList:null
	}
	export default {
		components:{ 
			attachUpload,
			attachList,
			customerListDialog,
			contractListDialog,
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
					project_id:[{ required:true, message:'请选择对账项目' }],
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
				let title = this.isEdit?'对账单编辑':'对账单录入'
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
			this.getCompanyList()
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
				this.$refs.attachUpload.clear()
				this.$refs.attachList.clear()
				this.$refs.projectEditList.clear()	
			},
			initData(data){
				this.assign(data)
				this.attachUploadParams.table_id = data.id
				if(data.attach_ids){
					this.$refs.attachList.initData({attach_ids:data.attach_ids})
				}
				this.$refs.projectEditList.initData({payment_id:data.id})
				this.clearValidate()
			},
			assign(data){				
				this.form = { ...this.form, ...data }
				this.form.payment_price = Number(this.form.payment_price)
				this.form.currency_price = Number(this.form.currency_price)
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
				this.$refs.customerListDialog.open()
				//.then(that=>{
					// that.$refs.list.queryParams.isArrears = 1 
				//	that.$refs.list.initData()
				//})
			},
			selectProject(row){
				this.form.project_name = row.name
				this.form.customer_type = row.type
				this.form.project_id = row.id
				this.$refs.customerListDialog.close()
			},
			openContract(){ 
				this.$refs.contractListDialog.open().then(that=>{
					//that.$refs.list.queryParams.isArrears = 1 
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