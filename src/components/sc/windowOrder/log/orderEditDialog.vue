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
					:model='form' ref='form' label-width='85px' size='mini' class='c-form-text'>
						<divider title='订单信息'></divider>
						<el-row :gutter='10'>
							<el-col :span='20'>
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
									<el-col :span='24'>
										<el-form-item label='项目名称'>
											<span>{{form.project_name}}</span>
										</el-form-item>
									</el-col>
									<el-col :span='16'>
										<el-form-item label='客户名称'>
											<span>{{form.customer_name}}</span>
										</el-form-item>
									</el-col>
									<el-col :span='8'>
										<el-form-item label='地盘'>
											<span>{{form.domain}}</span>
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
									<el-col :span='24'>
										<el-form-item label='生产状态'>
											<span>{{form.produce_status_remarks}}</span>
										</el-form-item>
									</el-col>
									<el-col :span='8'>
										<el-form-item label='录入员' >
											<span>{{form.create_user_name}}</span>
										</el-form-item>
									</el-col>
									<el-col :span='8'>
										<el-form-item label='提交时间' >
											<span>{{ $commonJs.formatDate(form.submit_time) }}</span>
										</el-form-item>
									</el-col>
									<el-col :span='24'>
										<el-form-item class='no-border' label='附件' v-show='form.attach_ids'>
											<attach-list ref='attachList' size='mini' :params='attachParams'/>
										</el-form-item>
									</el-col>
								</el-row>
							</el-col>
							<el-col :span='4' style='text-align: center'>
								<div style='margin-bottom: 5px'>生产进度</div>
								<el-tooltip :content='form.sc_produce_area_total+"㎡ / "+form.area_total+"㎡"'>
									<el-progress 
										type="circle" 
										:percentage="$commonJs.getProgressPercentage(form.sc_produce_area_total/form.area_total)"
										:stroke-width='10'>
									</el-progress>
								</el-tooltip>
							</el-col>
						</el-row>
				</el-form>
				<el-tabs v-model='tabName' @tab-click='tabClick'>
					<el-tab-pane label='产品列表' name='list'>
						<div style='margin-bottom: 5px'>
							<el-button type='primary' @click='openLogDialogFromBatch'>日志批量录入</el-button>
						</div>
						<product-list in-dialog ref='productList' :params='productParams' hide-query no-page show-summary show-selection hide-order-fields hide-edit-fields>
							<el-table-column fixed='right' slot='column' align='center' width='80' label='操作'>
								<template  slot-scope='scope'>
									<el-button type='text' @click='openLogDialogFormProduct(scope.row)'>日志录入</el-button>
								</template>
							</el-table-column>
						</product-list>
					</el-tab-pane>
					<el-tab-pane label='产品汇总' name='summary'>
						<product-summary-list ref='productSummaryList' in-dialog :params='productParams' hide-query show-summary no-page hide-order-fields>
							<el-table-column fixed='right' slot='column' align='center' width='80' label='操作'>
								<template  slot-scope='scope'>
									<el-button type='text' @click='openLogDialogFormProduct(scope.row)'>日志录入</el-button>
								</template>
							</el-table-column>
						</product-summary-list>
					</el-tab-pane>
					<el-tab-pane label='生产日志' name='log'>
						<log-list ref='logList' show-summary no-page hide-query :params='productParams' hide-order-fields @del='logChanged'>
							<el-table-column slot='column' label='操作' align='center' fixed='right' width='90'>
								<template slot-scope='scope'>
									<el-button type='text' size='mini' @click='editLog(scope)'>编辑</el-button>
									<el-button type='text' size='mini' @click='delLog(scope)'>删除</el-button>
								</template>
							</el-table-column>
						</log-list>
					</el-tab-pane>
				</el-tabs>				
			</div>
			<span slot="footer">
		    <el-button type='primary' @click='openStatusDialog'>生产状态描述</el-button>
		    <el-button @click='reload'>刷 新</el-button>
		    <el-button @click='print'>打印加工单</el-button>
		    <el-button @click="show=false">关 闭</el-button>
		  </span>
		</el-dialog>
		<log-form-dialog ref='logFormDialog' :in-dialog='inDialog' @changed='logChanged'/>
		<log-edit-dialog ref='logEditDialog' :in-dialog='inDialog' @changed='logChanged'/>
		<print-dialog ref='printDialog' :in-dialog='inDialog'/>
		<status-dialog ref='statusDialog' @updated='reload'></status-dialog>
	</div>
</template>

<script>
	import produceLogApi from '@/api/sc/produceLog'
	import productList from '../product/list'
	import productSummaryList from '../product/summaryList'
	import logFormDialog from './batchEditDialog'
	import logList from './list'
	import logEditDialog from './editDialog'
	import printDialog from './print'
	import attachList from '@/components/common/attach/textList'
	import statusDialog from './statusDialog'

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
		components:{ 
			productList,
			productSummaryList,
			logFormDialog,
			logList,
			logEditDialog,
			printDialog,
			attachList,
			statusDialog
		},
		props:{
			inDialog:{
				type:Boolean,
				default:false
			}
		},
		data(){			
			return {
				tabName:'list',
				productList:[],
				changed:false,
				show:false,
				data:null,
				loading:false,
				form:{ ...formInit }
			}
		},
		computed:{
			isEdit(){
				return this.form.id!=null
			},
			title(){
				return '订单生产日志'
			},
			productParams(){
				let order_id = this.form.id
				return {
					order_id
				}
			},
			attachParams(){
				let attach_ids = this.form.attach_ids
				return {
					attach_ids
				}
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
			closeDialog(){
				this.$refs.productList.clear()
				this.$refs.attachList.clear()
				this.$refs.productSummaryList.inited = false
				this.$refs.logList.inited = false
				if(this.changed){
					this.$emit('changed')
				}
				this.changed = false
				this.loading = false
				this.tabName = 'list'
			},
			open(){
				this.show = true
				return new Promise((resolve,reject)=>{
					this.resolve = resolve
				}) 
			},
			//清除字段检验信息
			clearValidate(){
				this.$nextTick(()=>{
					this.$refs.form && this.$refs.form.clearValidate()
				})				
			},
			get(id){
				this.loading = true
				produceLogApi.getOrderForm(id).then(res=>{
					this.loading = false
					this.assign(res.data)
				})
			},
			//重置字段
			resetFields(){
				this.form = { ...formInit }
				this.clearValidate()
				return this
			},
			initData(data){
				this.assign(data)
				this.$refs.productList.initData({order_id:this.form.id})
			},
			assign(data){
				this.form = { ...this.form, ...data }
				return this
			},
			submit(){
				this.$confirm('确定提交至生产中心吗？提交后订单信息将无法修改！','提示',{
					type: 'warning'
				}).then(()=>{
					this.save(1)
				})
			},
			addProduct(){
				this.$refs.productFormDialog.resetFields().assign({order_id:this.form.id}).open()
			},
			editProduct(row){
				this.$refs.productFormDialog.assign(row).open()
			},
			delProduct(scope){
				this.$refs.productList.del(scope)
			},
			tabClick(){
				if(this.tabName=='list'){
					this.$refs.productList.reload()
				}else if(this.tabName=='summary'){
					this.$refs.productSummaryList.reload()				
				}else if(this.tabName=='log'){
					this.$refs.logList.reload()				
				}
			},
			logChanged(){
				this.changed = true
				this.reload()
			},
			reload(){
				this.get(this.form.id)
				this.tabClick()
			},
			openLogDialogFromBatch(){
				let product_ids = []
				this.$refs.productList.selectionList.forEach((item,i)=>{
					product_ids.push(item.id)
				})
				if(product_ids.length==0){
					this.$message.error('请选择产品')
					return false
				}
				this.$refs.logFormDialog.resetFields().assign({product_ids:product_ids.join(',')}).open()
			},
			openLogDialogFormProduct(row){
				this.$refs.logFormDialog.resetFields().assign({product_ids:row.product_ids||row.id}).open()
			},
			editLog({row}){
				this.$refs.logEditDialog.get(row.id).open()
			},
			delLog(scope){
				this.$refs.logList.del(scope)
			},
			print(){
				this.$refs.printDialog.get(this.form.id).open()
			},
			openStatusDialog(){
				this.$refs.statusDialog.open().then(that=>{
					that.form.id = this.form.id
					that.form.produce_status_remarks = this.form.produce_status_remarks
					that.clearValidate()
				})
			}
		}
	}
</script>