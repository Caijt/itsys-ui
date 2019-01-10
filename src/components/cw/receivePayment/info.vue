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
				<divider title='回款信息'></divider>	
				<el-row :gutter='10'>
					<el-col :span='16'>
						<el-form-item label='客户名称'>
							<span>{{form.customer_name}}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='类别'>
							<span>{{form.customer_type}}</span>
						</el-form-item>
					</el-col>
					<el-col :span='16'>
						<el-form-item label='收款单位'>
							<span>{{form.company_name}}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='回款日期'>
							<span>{{form.payment_date}}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='回款形式'>
				  		<span>{{form.payment_method}}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='回款金额'>
							<span>￥ {{form.payment_price}}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='待核销金额'>
							<span>￥ {{form.to_writeoff_price}}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='回款合同'>
							<span>{{form.contract_no}}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='业务员'>
							<span>{{form.salesman}}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='区域'>
							<span>{{form.area}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label='附件' >
					<attach-list ref='attachList'></attach-list>
				</el-form-item>	
				<el-form-item label='备注' prop='remarks'>
			  	<span>{{form.remarks}}</span>
				</el-form-item>
			</el-form>
			<divider title='已核销项目货款' style='margin-top:10px'></divider>
			<payment-project-list in-dialog ref='paymentProjectList' hide-payment-field hide-query no-page></payment-project-list>
		</div>
		<template slot="footer">
			<slot name='footer' :data='form'></slot>
		</template>
		</el-dialog>
	</div>
</template>
<script>
	import paymentApi from '@/api/cw/receivePaymentRecord'
	import attachList from '@/components/common/attach/textList'
	import paymentProjectList from './paymentProject/list'

	const formInit = {
		id:null,
		input_status:-1,
		arrears_price:0,
		customer_id:null,
		customer_name:'',
		payment_date:'',
		payment_price:0,
		payment_currency:'CNY',
		payment_method:'',
		currency_price:'',
		remarks:''
	}
	export default {
		components:{ 
			attachList,
			paymentProjectList
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
				form: { ...formInit },
			}
		},
		computed:{
			title(){
				let title = '回款信息'
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
			getInfo(id){
				this.loading = true
				paymentApi.getInfo(id).then(res=>{
					this.initData(res.data)
					this.loading = false
				}).catch(res=>{
					console.log(res)
				})
			},
			reload(){
				this.getInfo(this.form.id)
			},
			closeDialog(){				
				this.resolve = null
				this.loading = false
				this.resetFields()					
				this.$refs.paymentProjectList.clear()	
			},
			initData(data){
				this.assign(data)
				if(data.attach_ids){
					this.$refs.attachList.initData({attach_ids:data.attach_ids})
				}
				this.$refs.paymentProjectList.initData({payment_id:data.id})
			},
			assign(data){				
				this.form = { ...this.form, ...data }
				this.form.payment_price = Number(this.form.payment_price)
				this.form.currency_price = Number(this.form.currency_price)
				return this
			},
			resetFields(){
				this.form = {...formInit}
				return this
			}
		}
	}
</script>