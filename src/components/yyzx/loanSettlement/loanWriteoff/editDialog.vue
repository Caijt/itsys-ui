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
			<el-form class='c-form-text' label-width='85px' >
				<el-form-item label='待核销金额'>
					<span>￥ {{form.to_writeoff_price}}</span>
				</el-form-item>
			</el-form>
			<divider title='项目货款核销'></divider>	
			<project-edit-list :payment-form='form' in-dialog ref='projectEditList'></project-edit-list>
		</div>
			<span slot="footer">
			 	<el-button type='primary' @click='save()' :loading='loading'>提交</el-button>
		    <el-button @click="show=false">关 闭</el-button>
	  	</span>
		</el-dialog>
	</div>
</template>
<script>
	import paymentApi from '@/api/cw/receivePaymentRecord'
	import projectEditList from '../paymentProject/projectEditList'

	const formInit = {
		id:null,
		arrears_price:0,
		customer_id:null,
		customer_name:'',
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
			projectEditList
		},
		props:{
			inDialog:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return {
				resolve:null,
				show:false,
				loading:false,
				updated:false,
				data: { },
				form: { ...formInit },
					
			}
		},
		computed:{
			isEdit(){
				return this.form.id? true:false
			},
			title(){
				let title = '项目货款核销'
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
			save(){
				if(this.$refs.projectEditList.validate()){
					if(this.projectPriceTotal>Number(this.form.to_writeoff_price)){
						this.$message.error('货款核销的总额已大于待核销的金额')
						return false
					}					 
					this.$confirm('确定提交吗？提交后信息无法修改','提示',{
						type: 'warning'
					}).then(()=>{
						this.update()
					})				 
				}else{
					this.$message.error('无法保存，请检查错误的字段！')
					return false
				}
			},
			update(){
				this.loading = true
				this.form.projectList = this.$refs.projectEditList.list.map(item=>{
					return this.$commonJs.obj.copyByKey(item,['payment_project_id','project_id','payment_price'])
				})
				paymentApi.writeoff(this.form).then(res=>{
					this.updated = true
					this.loading = false
					this.$message.success('提交成功')						
					this.show=false							
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
				this.form.payment_price = Number(this.form.payment_price)
				this.form.currency_price = Number(this.form.currency_price)
				return this
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
					that.$refs.list.queryParams.isArrears = 1
					that.$refs.list.query()
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
			}
		}
	}
</script>