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
					:model='form' :rules='rules' ref='form' label-width='85px' size='mini' class='c-form-mini' status-icon>
						<divider title='订单信息'></divider>
						<el-row :gutter='10'>
							<el-col :span='8'>
								<el-form-item label='订单编号' prop='order_no'>
									<el-input v-model='form.order_no' placeholder=''>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span='8'>
								<el-form-item label='订单日期' prop='order_date'>
									<el-date-picker v-model='form.order_date' @change='orderDateChange' value-format='yyyy-MM-dd' style='width:100%'></el-date-picker>
								</el-form-item>
							</el-col>
							<el-col :span='8'>
								<el-form-item label='订单类型' prop='order_type'>
									<el-autocomplete v-model='form.order_type' clearable style='width:100%' :fetch-suggestions="getFieldList('order_type')"></el-autocomplete>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter='10'>
							<el-col :span='16'>
								<el-form-item label='项目名称' prop='project_name'>
									<el-input v-model='form.project_name' placeholder=''>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span='8'>
								<el-form-item label='客户名称' prop='customer_name'>
									<el-input v-model='form.customer_name' placeholder=''>
									</el-input>
								</el-form-item>
							</el-col>							
							<el-col :span='8'>
								<el-form-item label='交货日期' prop='delivery_date'>
									<el-date-picker v-model='form.delivery_date' value-format='yyyy-MM-dd' style='width:100%'></el-date-picker>
								</el-form-item>
							</el-col>
							<el-col :span='8'>
								<el-form-item label='合同号' prop='contract_no'>
									<el-input v-model='form.contract_no' placeholder=''>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span='8'>
								<el-form-item label='地盘' prop='domain'>
									<el-input v-model='form.domain' placeholder=''>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span='24'>
								<el-form-item label='备注' prop='remarks'>
									<el-input v-model='form.remarks' placeholder=''>
									</el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-form-item label='附件管理'>
							<el-tooltip placement='left' content='请先保存订单信息' :disabled='isEdit'>
								<attach-upload 									
									:params='attachParams'
									:disabled='!isEdit'
									ref='attachUpload'
									:hide-upload-button='!isEdit'
									@uploaded='uploaded'/>
							</el-tooltip>
							<attach-list show-del v-show='isEdit' ref='attachList' />
						</el-form-item>
				</el-form>
				<el-tabs v-model='tabName' @tab-click='tabClick'>
					<el-tab-pane label='产品列表' name='list'>
						<div style='margin-bottom:10px'>
							<el-tooltip content='请先保存订单信息' :disabled='isEdit'>
								<el-button @click='addProduct' type='primary' size='mini'>添加产品</el-button>
							</el-tooltip>					
							<el-button @click='openImportDialog' type='success' size='mini'>EXCEL导入</el-button>
						</div>
						<product-list  ref='productList' :params='productParams' hide-query no-page show-summary hide-order-fields hide-produce-fields @del='reload'>
							<el-table-column fixed='right' slot='column' align='center' width='130' label='操作'>
								<template  slot-scope='scope'>
									<el-button type='text' @click='copyProduct(scope.row)'>复制</el-button>
									<el-button type='text' @click='editProduct(scope.row)'>编辑</el-button>
									<el-button type='text' @click='delProduct(scope)'>删除</el-button>
								</template>
							</el-table-column>
						</product-list>
					</el-tab-pane>
					<el-tab-pane label='产品汇总' name='summary'>
						<product-summary-list ref='productSummaryList' in-dialog :params='productParams' hide-query show-summary hide-produce-fields no-page></product-summary-list>
					</el-tab-pane>
				</el-tabs>				
			</div>
			<span slot="footer">
		    <el-button 
		    	type="primary"  
		    	size='mini' 
		    	:loading='loading'
		    	@click="save(1)">提交
		    </el-button>
		    <el-tooltip content='保存订单信息'>
		    	<el-button @click="save(0)" size='mini' :loading='loading'>保存</el-button>	
		 		</el-tooltip>
		    <el-button @click="show=false" size='mini'>关 闭</el-button>
		  </span>
		</el-dialog>
		<order-list-dialog ref='orderDialog' :in-dialog='inDialog'>
			<el-table-column slot='column' width='60' align='center' label='操作' fixed='right'>
				<template slot-scope='scope'>
					<el-button size='mini' type='text' @click='selectOrder(scope)'>选择</el-button></template>
			</el-table-column>
		</order-list-dialog>
		<product-form-dialog ref='productFormDialog' @changed='reload'/>
		<import-dialog ref='importDialog' @changed='reload'/>
	</div>
</template>

<script>
	import orderApi from '@/api/yyzx/windowOrder'
	import orderListDialog from '@/components/yyzx/order/progress/listDialog'
	import productFormDialog from './product/editDialog'
	import productList from './product/list'
	import productSummaryList from './product/summaryList'
	import importDialog from './product/import'
	import attachUpload from '@/components/common/attach/upload'
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
		components:{ 
			orderListDialog,
			productFormDialog,
			productList,
			productSummaryList,
			importDialog,
			attachUpload,
			attachList
		},
		props:{
			inDialog:{
				type:Boolean,
				default:false
			}
		},
		data(){
			let validator = (rule,value,callback)=>{
				if(value){
					orderApi.checkNoUnique(value,this.form.id).then(res=>{
						if(res.data>0){
							callback(new Error('订单号已重复'))
						}else{
							callback()
						}
					})
				}else{
					callback()
				}
			}
			return {
				resolve:null,
				attachUploadUrl:orderApi.attachUploadUrl,
				tabName:'list',
				productList:[],
				changed:false,
				show:false,
				data:null,
				loading:false,
				form:{ ...formInit },
				//产品参数
				productParams:{
					order_id:null
				},		
				rules:{					
					order_date:[{	required:true,message:'请填写订单日期' }],			
					order_no:[
						{	required:true,message:'请填写订单编号' },
						{ validator:validator, trigger:'blur' }
					]	,					
					project_name:[{	required:true,message:'请填写项目名称' }]	,					
					customer_name:[{	required:true,message:'请填写客户名称' }],
					delivery_date:[{	required:true,message:'请填写交货日期' }],
				},
				attachParams:{
					table_name:'yyzx_window_order',
					table_id:null
				}
			}
		},
		computed:{
			isEdit(){
				return this.form.id!=null
			},
			title(){
				return '订单录入'
			},			
		},
		mounted(){
		},
		methods:{
			openDialog(){
				this.$nextTick(()=>{
					this.clearValidate()
					if(this.resolve){
						this.resolve(this)
					}
				})
			},
			closeDialog(){
				this.tabName = 'list'
				this.$refs.productList.clear()
				this.$refs.attachList.clear()
				if(this.changed){
					this.$emit('changed')
				}
				this.resetFields()
				this.changed = false
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
			//重置字段
			resetFields(){
				this.form = { ...formInit }
				this.clearValidate()
				return this
			},
			assign(data){
				this.form = { ...this.form, ...data }
				return this
			},
			initData(data){
				this.form = { ...formInit,...data }
				if(data.attach_ids){
					this.$refs.attachList.initData({attach_ids:data.attach_ids})
				}
				this.productParams.order_id = data.id
				this.attachParams.table_id = data.id
				this.$refs.productList.reload()
				this.clearValidate()
			},
			//保存
			save( isSubmit = 0 ) {
				this.$refs.form.validate(vaild=>{
					if(vaild){								
						this.form.input_status = isSubmit
						if(isSubmit){
							if(this.$refs.productList.dataTotal==0){
								this.$message.error('请添加订单产品')
								return false
							}
							this.$confirm('确定提交吗？提交后订单信息将无法修改！','提示',{
								type: 'warning'
							}).then(()=>{
								this.update()
							})
						}else{
							this.update()
						}					
					}else{
						return false
					}
				})
			},			
			update(){
				let message = this.form.input_status==0?'保存成功':'提交成功'	
				this.loading = true									
				orderApi.update(this.form).then(res=>{
					this.$message.success(message)
					this.loading = false
					this.changed = true
					if(this.form.input_status==1) this.show=false
				})
			},
			openOrderDialog(){
				this.$refs.orderDialog.open()
			},
			selectOrder({ row }){
				let data = this.$commonJs.obj.copyByKey(row,[
					'order_no','project_name','customer_name','order_date','delivery_date','order_type','contract_no'])
				this.assign(data)	
				this.$refs.orderDialog.close()
			},			
			addProduct(){
				this.$refs.productFormDialog.resetFields().assign({order_id:this.form.id}).open()
			},
			editProduct(row){
				this.$refs.productFormDialog.open().then(that=>{
					that.initData(row)
				})
			},
			copyProduct(row){
				let data = {...row}
				data.id = null
				this.$refs.productFormDialog.resetFields().assign(data).open().then(that=>{
					that.initData(data)
				})
			},
			delProduct(scope){
				this.$refs.productList.del(scope)
			},
			tabClick(){
				if(this.isEdit){
					if(this.tabName=='list'){
						this.$refs.productList.reload()
					}else if(this.tabName=='summary'){
						this.$refs.productSummaryList.reload()
					}
				}
			},
			reload(){
				this.$refs.productList.getData()
			},
			openImportDialog(){
				this.$refs.importDialog.assign({order_id:this.form.id}).open()
			},			
			uploaded(res){
				this.changed = true
				this.$refs.attachList.push(res)
			},
			orderDateChange(value){
				if(value){
					this.form.delivery_date = this.$moment(value).add(40,'days').format('YYYY-MM-DD')
				}				
			},
			getFieldList(field){
				return (keyword,callback)=>{
					orderApi.getFieldList({ field,keyword }).then(res=>{
						callback(res.data)
					})
				}
			},
			create(){
				this.loading = true
				return new Promise((resolve,reject)=>{
					orderApi.create().then(res=>{
						this.initData( res.data )
						this.loading = false
						resolve()
					})
				})
			},
		}
	}
</script>