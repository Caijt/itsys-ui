<template>
	<el-dialog 
		class='c-dialog-fixed'
		:visible.sync="show" 
		:append-to-body='inDialog'
		:title='title'
		@open='openDialog'
		width='80%'
		@close='closeDialog'>
		<div v-loading='loading'>
			<el-form 
				ref='form' label-width='85px' size='mini' class='c-form-text'>
				<divider title='订单信息'></divider>
					<el-row :gutter='10'>					
						<el-col :span='8'>
							<el-form-item label='订单编号'>
								<span>{{form.order_no}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='订单日期'>
								<span>{{form.order_date}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='订单类型'>
								<span>{{form.order_type}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='16'>
							<el-form-item label='项目名称'>
								<span>{{form.project_name}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='地盘'>
								<span>{{form.domain}}</span>
							</el-form-item>
						</el-col>	
						<el-col :span='16'>
							<el-form-item label='客户名称'>
								<span>{{form.customer_name}}</span>
							</el-form-item>
						</el-col>
										
						<el-col :span='8'>
							<el-form-item label='交货日期' >
								<span>{{form.delivery_date}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='16'>
							<el-form-item label='合同号'>
								<span>{{form.contract_no}}</span>
							</el-form-item>
						</el-col>									
						<el-col :span='24'>
							<el-form-item label='备注'>
								<span>{{form.domain}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='提交人' >
								<span>{{form.create_user_name}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='提交时间' >
								<span>{{ $commonJs.formatDate(form.submit_time) }}</span>
							</el-form-item>
						</el-col>
					</el-row>
					<el-form-item label='附件' class='no-border'  v-show='form.attach_ids'>
						<attach-list ref='attachList'/>
					</el-form-item>
			</el-form>
			<el-tabs v-model='tabName' @tab-click='tabClick'>
				<el-tab-pane label='产品列表' name='list'>
					<product-list ref='productList' :params='productParams' hide-edit-fields hide-query no-page show-summary hide-order-fields />
				</el-tab-pane>
				<el-tab-pane label='产品汇总' name='summary'>
					<product-summary-list ref='productSummaryList' in-dialog :params='productParams' hide-query show-summary no-page />
				</el-tab-pane>
			</el-tabs>	
		</div>
		<template slot="footer">
			<slot name='footer' :data='form'></slot>
		</template>
	</el-dialog>
</template>
<script>
	import orderApi from '@/api/yyzx/windowOrder'
	import attachListDialog from '@/components/attachListDialog'
	import productList from './product/list'
	import productSummaryList from './product/summaryList'
	import attachList from '@/components/common/attach/textList'

	const formInit = {
		id:null,
		input_status:0,
		order_no:'',
		project_name:'',
		customer_name:'',
		order_date:'',
		order_type:'',
		delivery_date:'',
		contract_no:'',
		domain:'',
		remarks:''
	}
	export default {
		components:{ attachListDialog,productList,productSummaryList,attachList },
		props:{
			inDialog:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return {
				resolve:null,
				loading: false,
				form: { ...formInit },
				show: false,
				title:'订单信息',
				tabName:'list'
			}
		},
		computed:{
			productParams(){
				let order_id = this.form.id
				return {
					order_id
				}
			}
		},
		methods:{
			openDialog(){
				this.$nextTick(()=>{
					if(this.resolve){
						this.resolve(this)
					}
				})
			},
			closeDialog(){
				this.tabName = 'list'
				this.form = {...formInit}
				this.$refs.productList.clear()
				this.$refs.attachList.clear()
				this.$refs.productSummaryList.inited = false
			},
			get(id){
				this.loading = true
				this.form.id = id				
				orderApi.getDetails(id).then(res=>{
					this.initData(res.data)
					this.loading = false
				})
				return this
			},
			initData(data){
				this.form = {...data}
				if(data.attach_ids){
					this.$refs.attachList.initData({attach_ids:data.attach_ids})
				}
				this.$refs.productList.reload()
			},
			open(){
				this.show = true
				return new Promise((resolve,reject)=>{
					this.resolve = resolve
				}) 
			},
			tabClick(){
				if(this.tabName=='list'){
					this.$refs.productList.reload()
				}else if(this.tabName=='summary'){
					this.$refs.productSummaryList.reload()				
				}else if(this.tabName=='log'){
					this.$refs.logList.reload()
				}
			}
		}
	}
</script>