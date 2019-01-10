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
				<divider title='项目货款信息'></divider>	
				<el-row :gutter='10'>
					<el-col :span='16'>
						<el-form-item label='项目名称'>
							<span>{{form.project_name}}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='项目编号'>
							<span>{{form.project_no}}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='合同编号'>
							<span>{{form.contract_no}}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='合同面积'>
							<span>{{form.contract_area}}㎡</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='合同金额'>
				  		<span>￥{{form.contract_price}}</span>
						</el-form-item>
					</el-col>
					<el-col :span='16'>
						<el-form-item label='业绩公司'>
							<span>{{form.company_name}}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='业务员'>
							<span>{{form.salesman}}</span>
						</el-form-item>
					</el-col>
					<el-col :span='24'>
						<el-form-item label='客户名称'>
							<span>{{form.customer_name}}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='结算面积'>
							<span>{{form.settlement_area}}㎡</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='结算金额'>
							<span>￥{{form.settlement_price}}</span>
						</el-form-item>
					</el-col>
					<el-col :span='24'>
						<el-form-item label='结算订单'>
							<span>{{form.order_no}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label='备注' prop='remarks'>
			  	<span>{{form.remarks}}</span>
				</el-form-item>
				<el-form-item label='附件' >
					<attach-list ref='attachList'></attach-list>
				</el-form-item>
				<el-row :gutter='10'>
					<el-col :span='8'>
						<el-form-item label='录入员' >
							<span>{{form.create_user_name}}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='提交时间' >
							<span>{{form.submit_time}}</span>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>			
		</div>
		<template slot="footer">
			<slot name='footer' :data='form'></slot>
		</template>
		</el-dialog>
	</div>
</template>
<script>
	import paymentApi from '@/api/yyzx/goodsPayment'
	import attachList from '@/components/common/attach/textList'

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
			attachList
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
			},
			initData(data){
				this.assign(data)
				if(data.attach_ids){
					this.$refs.attachList.initData({attach_ids:data.attach_ids})
				}
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