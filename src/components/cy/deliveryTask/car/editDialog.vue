<template>
	<div>
	<el-dialog 
		:title='title'
		class='c-dialog-fixed'
		:visible.sync='show'
		:append-to-body='inDialog'
		@open='openDialog'
		width='75%'
		@close='closeDialog'>
		<div v-loading='loading'>
			<el-form 
				:model='form' :rules='rules' 
				ref='form' label-width='85px' 
				size='mini' status-icon
				class='c-form-mini'>
				<divider title='发货车辆信息'></divider>	
				<el-row :gutter='10'>
					<el-col :span='24'>
						<el-form-item label='发货订单' prop='orderList'>
							<el-select
								style='width:100%'
						    v-model="form.orderList"
						    multiple
						    filterable
						    default-first-option
						    placeholder="请选择发货订单，回车键隔开">
						    <el-option
						    	v-for='item in orderList'
						    	:key='item'
						    	:value='item'
						    >					    	
						    </el-option>
						  </el-select>
						</el-form-item>
					</el-col>
					<el-col :span='16'>
						<el-form-item label='储运电话' prop='delivery_tel'>
							<el-input v-model='form.delivery_tel' placeholder='储运中心负责人联系电话，方便司机联系发货单位'>
							</el-input>
						</el-form-item>		
					</el-col>
				</el-row>
				<el-form-item label='附件管理'>
					<attach-upload ref='attachUpload' :params='attachUploadParams' @uploaded='res=>{$refs.attachList.push(res)}'></attach-upload>
					<attach-list show-del ref='attachList'></attach-list>
				</el-form-item>	
				<divider title='司机信息'></divider>	
				<el-alert style='margin-bottom: 10px' type='warning' title='如果还不知道司机信息，可以先不填，提交后在发货车辆列表中进行补充'></el-alert>
				<el-row>
					<el-col :span='24'>
						<el-form-item label='车辆单位' prop='driver_unit'>
							<el-input v-model='form.driver_unit' placeholder=''>
							</el-input>
						</el-form-item>	
					</el-col>
					<el-col :span='8'>
						<el-form-item label='车牌号码' prop='driver_no'>
							<el-input v-model='form.driver_no' placeholder=''>
							</el-input>
						</el-form-item>	
					</el-col>
					<el-col :span='8'>
						<el-form-item label='司机姓名' prop='driver_name'>
							<el-input v-model='form.driver_name' placeholder=''>
							</el-input>
						</el-form-item>
					</el-col>					
					<el-col :span='8'>
						<el-form-item label='联系电话' prop='driver_tel'>
							<el-input v-model='form.driver_tel' placeholder=''>
							</el-input>
						</el-form-item>	
					</el-col>
				</el-row>
			</el-form>
			<divider title='发货产品'></divider>	
			<div style='margin-bottom: 5px'>
				<el-button type='primary' @click='addProduct'>添加产品</el-button>
				<el-button @click='openImportDialog' type='success'>EXCEL导入</el-button>
			</div>
			<product-list 
				ref='productList' 
				hide-submit-field 
				@del='productUpdated' 
				hide-query 
				no-page 
				sort-prop='index'
				hide-car-fields>
				<el-table-column slot='column' fixed='right' label='操作' align='center' width='130'>
					<template slot-scope='scope'>
						<el-button size='mini' type='text' @click='editProduct(scope)'>编辑</el-button>
						<el-button size='mini' type='text' @click='copyProduct(scope)'>复制</el-button>
						<el-button size='mini' type='text' @click='delProduct(scope)'>删除</el-button>
					</template>
				</el-table-column>
			</product-list>
			<!-- <divider title='装车产品'></divider>	
			<div style='margin-bottom: 5px'>
				<el-button type='primary' @click='addProduct'>添加产品</el-button>
				<el-button type='primary' @click='batchEditProduct'>批量编辑</el-button>
			</div>
			<product-list show-selection ref='productList' hide-edit-field no-page hide-query @remove='productUpdated'>					
				<el-table-column slot='column' fixed='right' align='center' label='操作' width='90'>
					<template slot-scope='scope'>
						<el-button type='text' @click='editProduct(scope.row.car_product_id)'>编辑</el-button>
						<el-button type='text' @click='remove(scope)'>移除</el-button>
					</template>
				</el-table-column>
			</product-list> -->
		</div>
			<span slot="footer">
			 	<el-button type='primary' @click='save(1)' :loading='loading'>提交</el-button>
			 	<el-button @click='save(0)' :loading='loading'>保存</el-button>
		    <el-button @click="show=false">关 闭</el-button>
	  	</span>
		</el-dialog>
		<!-- <product-list-dialog ref='productListDialog' :in-dialog='inDialog' @updated='productUpdated'></product-list-dialog> -->
		<product-dialog ref='productDialog' @updated='productUpdated'></product-dialog>
		<import-dialog ref='importDialog' @updated='productUpdated'/>
	</div>
</template>
<script>
	import carApi from '@/api/cy/deliveryCar'
	import productListDialog from './productListEditDialog'
	import attachUpload from '@/components/common/attach/upload'
	import attachList from '@/components/common/attach/textList'
	import productList from '../product/list'
	import importDialog from '../product/import'
	import productDialog from '../product/editDialog'

	const formInit = {
		id:null,
		input_status:-1,
		express:'',
		sign:'',
		unit:'',
		name:'',
		no:'',
		tel:'',
		orders:'',
		orderList:[]
	}
	export default {
		components:{ 
			productList,
			productListDialog,
			attachUpload,
			attachList,
			productDialog,
			importDialog
		},
		props:{
			inDialog:{
				type:Boolean,
				default:false
			},
			orderList:{
				type:Array,
				default:[]
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
				attachUploadParams:{
					table_name:'cy_delivery_car',
					table_id:null,
				},
				rules:{
					amount:[
						{ required:true, message:'请填写色样申请数量' },
						{ type:'number',message:'请输入数字' },
						{ 
							validator:(rule,value,callback)=>{
								if(value<=0){
									callback(new Error('必须大于0'))
								}else{
									callback()
								}
							}
						}
					]
				},
				params:{
					no:null
				},
				updated:false,				
			}
		},
		computed:{
			isEdit(){
				return this.form.id? true:false
			},
			title(){
				let title = '发货车辆'
				if(this.form.input_status>=0&&this.form.no){
					title += ' [ '+this.form.no+' ]'
				}else{
					title += '添加'
				}
				return title
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
				carApi.getForm(id).then(res=>{
					this.initData(res.data)
					this.loading = false
				})
			},
			create(params={}){
				this.loading = true
				carApi.create(params).then(res=>{
					this.initData(res.data)
					this.loading = false
				})
			},
			save(isSubmit=false){
				this.$refs.form.validate(valid=>{
					if(valid){						
						this.form.orders = this.form.orderList.join(',')
						this.form.input_status = isSubmit?1:0
						if(isSubmit){
							// if(this.$refs.productList.dataTotal<=0){
							// 	this.$message.error('该发货车辆还未添加产品，无法提交！')
							// 	return false
							// }
							this.$confirm('确定提交吗？提交后车辆信息将无法修改','提示',{
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
				carApi.update(this.form).then(res=>{
					this.form.no = res.data
					this.updated = true
					this.loading = false
					this.$message.success(messageText)								
					if(this.form.input_status==1){
						this.show=false
					}
				}).catch(res=>{
					this.loading = false
					console.log(res)
				})
			},
			closeDialog(){	
				if(this.updated){
					this.$emit('updated')
				}
				this.loading = false
				this.resetFields()
				this.$refs.productList.clear()
				this.$refs.attachList.clear()
			},
			initData(data){
				this.assign(data)
				this.attachUploadParams.table_id = data.id
				if(data.attach_ids){
					this.$refs.attachList.initData({attach_ids:data.attach_ids})
				}
				this.$refs.productList.initData({car_id:data.id})
				this.clearValidate()
			},
			assign(data){				
				this.form = { ...this.form, ...data }
				this.form.orderList = this.form.orders?this.form.orders.split(','):[]
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
			// addProduct(){
			// 	this.$refs.productListDialog.open().then(that=>{
			// 		that.initData({
			// 			task_id:this.form.task_id,
			// 			not_car_id:this.form.id
			// 		})
			// 	})
			// },
			// editProduct(ids){
			// 	this.$refs.productDialog.open().then(that=>{
			// 		that.initData({
			// 			car_product_ids:ids
			// 		})
			// 	})
			// },
			// batchEditProduct(){
			// 	let ids = this.$refs.productList.selectionList.map(item=>{
			// 		return item.car_product_id
			// 	})
			// 	if(ids.length==0){
			// 		this.$message.error('请选择产品，勾选列表前面的复选框！')
			// 		return false
			// 	}
			// 	this.$refs.productListDialog.open().then(that=>{
			// 		that.initData({
			// 			car_product_ids:ids.join(',')
			// 		})
			// 	})
			// },
			productUpdated(){
				this.updated = true
				this.$refs.productList.reload()
			},
			remove(scope){
				this.$refs.productList.remove(scope)
			},
			addProduct(){
    		this.$refs.productDialog.open().then(that=>{
    			that.assign({
    				car_id:this.form.id
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
    		copyData.car_id = this.form.id
    		this.$refs.productDialog.open().then(that=>{
    			that.assign(copyData)
    		})
    	},
    	delProduct(scope){
    		this.$refs.productList.del(scope)
    	},
    	openImportDialog(){
				this.$refs.importDialog.assign({car_id:this.form.id}).open()
			},
		}
	}
</script>