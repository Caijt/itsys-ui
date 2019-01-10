<template>
	<div>
	<el-dialog 
		:title='title'
		class='c-dialog-fixed'
		:visible.sync='show'
		:append-to-body='inDialog'
		width='80%'
		@open='openDialog'
		@close='closeDialog'>
		<div v-loading='loading'>
			<divider title='任务信息'></divider>
			<el-form 
				:model='form' :rules='rules' 
				ref='form' label-width='85px' 
				size='mini' status-icon
				class='c-form-mini' >
				<el-row :gutter='10'>
					<el-col :span='16'>
						<el-form-item label='项目名称' prop='project'>
							<el-input v-model='form.project' placeholder=''>
								<el-button slot="append" @click='openProjectDialog'>提取</el-button>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='合同号' prop='contract_no' >
							<el-input v-model='form.contract_no' placeholder=''>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter='10'>
					<el-col :span='8'>
						<el-form-item label='销售公司' prop='company_id'>
							<el-select 
								v-model='form.company_id' 
								placeholder='选择销售公司'
								filterable
								style='width: 100%'
								:loading='companyLoading'>
								<el-option
									v-for='item in companyList'
									:key='item.id'
									:label='item.name'
									:value='item.id'
									v-show='item.is_disabled?false:true'
								></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='业务员' prop='salesman_name' >
							<el-input v-model='form.salesman_name' placeholder=''>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='联系电话' prop='salesman_tel' >
							<el-input v-model='form.salesman_tel' placeholder=''>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter='10'>
					<el-col :span='8'>
						<el-form-item label='调拨单号' prop='db_no' >
							<el-input v-model='form.db_no' placeholder=''>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='发货申请编号' label-width='110px' prop='fh_no' >
							<el-input v-model='form.fh_no' placeholder=''>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter='10'>
					<el-col :span='8'>
						<el-form-item label='发货工厂' prop='area_id'>
							<el-select v-model='form.area_id' style='width: 100%'>
								<el-option 
									v-for='item in factoryList' 
									:value='item.id'
									:label='item.name'
									:key='item.id'>
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='计划发货日期' label-width='110px' prop='plan_send_date' >
							<el-date-picker v-model='form.plan_send_date' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span='24'>
						<el-form-item label='发货订单' prop='orders' >
							<el-select
								style='width:100%'
						    v-model="form.orders"
						    multiple
						    filterable
						    allow-create
						    default-first-option
						    no-data-text='请输入订单号'
						    placeholder="请填写发货订单，回车键隔开">
						  </el-select>
						</el-form-item>
					</el-col>
					<el-col :span='24'>
						<el-form-item label='注意事项' prop='remarks' >
							<el-input v-model='form.remarks' placeholder='此文字会出现在打印任务单上的标题下面'>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label='附件' prop='remarks'>
					<attach-upload ref='attachUpload' :params='attachParams' @uploaded='uploaded'></attach-upload>
					<attach-list ref='attachList' show-del></attach-list>
				</el-form-item>		
				<divider title='收货信息'></divider>
				<el-row :gutter='10'>					
					<el-col :span='8'>
						<el-form-item label='交付方式' prop='method' >
							<el-input v-model='form.method' placeholder=''>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='24'>
						<el-form-item label='收货单位' prop='receive_unit' >
							<el-input v-model='form.receive_unit' placeholder=''>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='24'>
						<el-form-item label='收货地址' prop='receive_address' >
							<el-input v-model='form.receive_address' placeholder=''>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='收货人' prop='receive_name' >
							<el-input v-model='form.receive_name' placeholder=''>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='联系电话' prop='receive_tel' >
							<el-input v-model='form.receive_tel' placeholder=''>
							</el-input>
						</el-form-item>
					</el-col>					
				</el-row>	
			</el-form>
			<!-- <divider title='发货产品'></divider>	 -->
			<!-- <div style='margin-bottom: 5px'>
				<el-button type='primary' @click='addProduct'>添加产品</el-button>
				<el-button @click='openImportDialog' type='success'>EXCEL导入</el-button>
			</div> -->
			<!-- <product-list ref='productList' hide-submit-field @del='productUpdated' hide-query no-page sort-prop='index'>
				<el-table-column slot='column' fixed='right' label='操作' align='center' width='130'>
					<template slot-scope='scope'>
						<el-button size='mini' type='text' @click='editProduct(scope)'>编辑</el-button>
						<el-button size='mini' type='text' @click='copyProduct(scope)'>复制</el-button>
						<el-button size='mini' type='text' @click='delProduct(scope)'>删除</el-button>
					</template>
				</el-table-column>
			</product-list> -->
		</div>
			<div slot="footer" v-loading='loading'>
		    <el-button type='primary' @click='save(1)' :loading='loading'>提交</el-button>
		    <el-button  @click='save(0)' :loading='loading'>保存</el-button>		    
		    <el-button type='danger' @click='del' :loading='loading'>删除</el-button>
		    <el-button @click="show=false">关 闭</el-button>
	  	</div>
		</el-dialog>
		<project-dialog ref='projectDialog' :in-dialog='inDialog'>
			<el-table-column slot='column' width='60' align='center' label='操作' fixed='right'>
				<template slot-scope='{row}'>
					<el-button size='mini' type='text' @click='selectProject(row)'>选择</el-button>
				</template>
			</el-table-column>
		</project-dialog>
		<product-dialog ref='productDialog' @updated='productUpdated'></product-dialog>
		<import-dialog ref='importDialog' @updated='productUpdated'/>
	</div>
</template>
<script>
	import taskApi from '@/api/yyzx/deliveryTask'
	import projectDialog from '@/components/yyzx/project/listDialog'
	import companyApi from '@/api/yyzx/company'
	import factoryApi from '@/api/yyzx/factory'
	import attachUpload from '@/components/common/attach/upload'
	import attachList from '@/components/common/attach/textList'
	import productDialog from '../product/editDialog'
	import productList from '../product/list'
	import importDialog from './importProduct'

	const formInit = {
		project_id:null,
		project_no:'',
		project_name:'',
		salesman:'',
		company_id:'',
		orders:[],
		remarks:'请提前联系收货人再送货过去！',
		id:null,
		no:'',
		input_status:-1	
	}
	export default {
		components:{ 
			projectDialog,
			attachUpload,
			attachList,
			productDialog,
			productList,
			importDialog
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
				data:{ },				
				form:{ ...formInit },
				rules:{
					company_id:[{ required:true, message:'请选择销售公司' }],
					orders:[{ required:true, message:'请填写发货订单' }],
					area_id:[{ required:true, message:'请选择打样工厂' }],
					project:[{ required:true, message:'请填写项目名称' }],
					salesman:[{ required:true, message:'请填写业务员' }],					
					amount:[{ type:'number',message:'请输入数字' }],
					receive_unit:[{ required:true, message:'请填写收货单位' }],
					receive_address:[{ required:true, message:'请填写收货地址' }],
					receive_name:[{ required:true, message:'请填写收货人' }],
					receive_tel:[{ required:true, message:'请填写收货人联系电话' }],
					plan_send_date:[{ required:true, message:'请填写计划发货日期' }],
				},
				params:{
					no:null
				},
				updated:false,
				companyList:[],
				companyLoading:false,
				factoryList:[],
				factoryLoading:false,
				attachParams:{
					table_name:'yyzx_delivery_task',
					table_id:null
				}
			}
		},
		computed:{
			isEdit(){
				return this.form.id? true:false
			},
			title(){
				let title = '发货任务信息'
				if(this.form.input_status>=0&&this.form.no){
					title += ' [ '+this.form.no+' ]'
				}
				return title
			}
		},
		mounted(){
			this.getCompanyList()
			this.getFactoryList()
		},
		methods:{
			//
			getCompanyList(){
				this.companyLoading = true
				companyApi.getEnumList().then(res=>{
					this.companyList = res.data
					this.companyLoading = false
				})
			},
			//
			getFactoryList(){
				this.factoryLoading = true
				factoryApi.getEnumList({inUser:1}).then(res=>{
					this.factoryList = res.data
					this.factoryLoading = false
				})
			},
			selectProject(row){
				this.form.project = row.name
				this.form.contract_no = row.contract_no
				this.form.salesman_name = row.salesman
				this.form.company_id = row.company_id
				this.$refs.projectDialog.close()
			},
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
			closeDialog(){				
				if(this.updated){
					this.$emit('updated')
				}
				this.resetFields()
				// this.$refs.productList.clear()
			},
			create(){
				this.loading = true
				return new Promise((resolve,reject)=>{
					taskApi.create().then(res=>{
						this.initData( res.data )
						this.loading = false
						resolve()
					})
				})
			},
			getForm(id){
				this.loading = true
				taskApi.getForm(id).then(res=>{
					this.initData(res.data)
					this.loading = false
				})
			},
			initData(data){
				this.assign(data)
				this.attachParams.table_id = data.id
				if(data.attach_ids){
					this.$refs.attachList.initData({ attach_ids:data.attach_ids})
				}
				// this.$refs.productList.initData({ task_id:data.id })
				this.clearValidate()
			},
			assign(data){
				this.form = { ...this.form, ...data }
				this.form.orders = this.form.order_no?this.form.order_no.split(','):[]
				return this
			},
			save(status=0){
				this.$refs.form.validate(valid=>{
					if(valid){
						this.form.order_no = this.form.orders.join(',')
						this.form.input_status = status
						if(status){
							// if(this.$refs.productList.dataTotal<=0){
							// 	this.$message.error('该发货任务还未添加产品，无法提交！')
							// 	return false
							// }
							this.$confirm('确定提交发货任务吗？提交后任务信息将无法修改！','提示',{
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
				this.loading = true
				let messageText = this.form.input_status?'提交成功':'保存成功'
				taskApi.update(this.form).then(res=>{
					this.form.no = res.data
					this.loading = false
					this.$message.success(messageText)
					this.updated = true
					if(this.form.input_status==1){
						this.show=false									
					}
				}).catch(res=>{
					this.loading = false
					console.log(res)
				})
			},
			clearValidate(){
				this.$nextTick(()=>{
					this.$refs.form && this.$refs.form.clearValidate()
				})
			},
			resetFields(){
				this.updated = false
				this.form = { ...formInit }
				this.clearValidate()
				this.$refs.attachUpload.clear()
				this.$refs.attachList.clear()
				return this
			},
			openProjectDialog(){
				this.$refs.projectDialog.open()
			},			
			uploaded(res){
				this.updated = true
				this.$refs.attachList.push(res)
			},
			del({ row,$index }){
	      let confirmText = '确定删除此任务吗？'
	      this.$confirm(confirmText,'提示',{
	        type: 'warning'
	      }).then(()=>{
	      	this.loading = true
	        taskApi.del(this.form.id).then(res=>{
	          this.$message.success('删除成功')
	          this.$emit('updated')
	          this.loading = false
	          this.show = false
	        }).catch(res=>{
	        	this.loading = false
	        })
	      })
    	},
    	addProduct(){
    		this.$refs.productDialog.open().then(that=>{
    			that.assign({
    				task_id:this.form.id
    			})
    		})
    	},
    	editProduct({row,index}){
    		this.$refs.productDialog.open().then(that=>{
    			that.initData(row)
    		})
    	},
    	copyProduct({row,index}){
    		let copyData = this.$commonJs.obj.copyByKey(row,['name','type','no','index','size','width','height','has_hole','hole_width','hole_height','unit_area','unit','amount','area','remarks'])
    		copyData.task_id = this.form.id
    		this.$refs.productDialog.open().then(that=>{
    			that.assign(copyData)
    		})
    	},
    	delProduct(scope){
    		this.$refs.productList.del(scope)
    	},
    	productUpdated(){
    		this.updated = true
    		this.$refs.productList.reload()
    	},
    	openImportDialog(){
				this.$refs.importDialog.assign({task_id:this.form.id}).open()
			},
		}
	}
</script>