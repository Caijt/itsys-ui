<template>
	<div>
	<el-dialog 
		:title='title'
		class='c-dialog-fixed'
		:visible.sync='show'
		:append-to-body='inDialog'
		@open='openDialog'
		@close='closeDialog'>
		<div v-loading='loading'>
			<divider title='资产信息'></divider>
			<el-form 
				:model='form' :rules='rules' 
				ref='form' label-width='85px' 
				size='mini' status-icon
				class='c-form-mini' >
				<el-form-item label='所属公司' prop='company_id'>
					<el-select 
						v-model='form.company_id' 
						placeholder='选择资产所属公司'
						filterable
						style='width: 100%'
						:loading='companyLoading'>
						<el-option
							v-for='item in companyList'
							:key='item.id'
							:label='item.name'
							:value='item.id'
							v-show='item.is_disabled==1?false:true'
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label='资产型号' prop='model' >
					<el-input v-model='form.model' placeholder='资产具体型号'>
					</el-input>
				</el-form-item>
				<el-form-item label='资产类型' prop='type_id'>
					<el-input v-model='form.type_name' placeholder='点击选择' readonly @click.native='openSelectTypeDialog'>
						<i 
							style='cursor: pointer;'
							v-show='form.type_id' 
							slot="suffix" 
							class="el-input__icon el-icon-close" 
							@click.stop='form.type_name="";form.type_id=null'></i>
						<el-button slot="append" @click.stop='createType'>创建</el-button>
					</el-input>
				</el-form-item>
				<el-form-item label='标识号' prop='diy_no' >
					<el-input v-model='form.diy_no' placeholder='企业内部一些自定义的标识号'>
					</el-input>
				</el-form-item>				
				<el-row :gutter='10'>
					<el-col :span='12'>
						<el-form-item label='入库日期' prop='inbound_date'>
							<el-date-picker 
								v-model='form.inbound_date' 
								value-format='yyyy-MM-dd' 
								style='width: 150px' />
						</el-form-item>		
					</el-col>
					<el-col :span='12'>
						<el-form-item label='入库数量' prop='amount' >
							<el-input v-model.number='form.amount'  style='width: 150px'>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter='10'>
					<el-col :span='12' >
						<el-form-item label='库存预警' prop='is_stock_warning' >
							<el-tooltip content='是否关联库存预警种类'>
								<el-switch 
									v-model='form.is_stock_warning'
									:active-value='1'
							    :inactive-value='0' />
							</el-tooltip>
						</el-input>
				</el-form-item>
					</el-col>
					<el-col :span='12' v-if='form.is_stock_warning'>
						<el-form-item label='库存种类' prop='stock_warning_id'>
					<el-input v-model='form.stock_warning_name' placeholder='点击选择' readonly @click.native='openSelectStockWarningDialog'>
						<i 
							style='cursor: pointer;'
							v-show='form.stock_warning_id' 
							slot="suffix" 
							class="el-input__icon el-icon-close" 
							@click.stop='form.stock_warning_name="";form.stock_warning_id=null'></i>
					</el-input>
				</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label='供应商' prop='supplier_id'>
					<el-input v-model='form.supplier_name' placeholder='点击选择' readonly @click.native='openSelectSupplierDialog'>
						<i 
							style='cursor: pointer;'
							v-show='form.supplier_id' 
							slot="suffix" 
							class="el-input__icon el-icon-close" 
							@click.stop='form.supplier_name="";form.supplier_id=null'></i>
					</el-input>
				</el-form-item>
				<el-form-item label='来源方式' prop='source' >
					<el-autocomplete v-model='form.source' clearable :fetch-suggestions="getFieldList('source')" style='width: 150px'></el-autocomplete>
					<span style='font-size: 12px'>* 资产是从什么方式入库</span>
				</el-form-item>
				<el-form-item label='价格' prop='price' >
					<el-input v-model.number='form.price' style='width: 150px'>
						<span slot="prefix">￥</span>
					</el-input>
					<span style='font-size: 12px'>* 该资产总价格，非单价</span>
				</el-form-item>
				<el-form-item label='序列号' prop='sn' >
					<el-input v-model='form.sn' placeholder='资产出厂编号' style='width: 150px'>
					</el-input>
					<span style='font-size: 12px'>* 如果涉及产品保修，请务必填写</span>
				</el-form-item>				
				<el-form-item label='备注' prop='remarks' >
					<el-input type='textarea' autosize v-model='form.remarks' placeholder='资产其它备注信息'>
					</el-input>
				</el-form-item>
				<el-form-item label='附件' prop='remarks'>
					<attach-upload ref='attachUpload' :url='uploadAttachUrl' :params='attachParams' @uploaded='uploaded'></attach-upload>
					<attach-list ref='attachList' :del-url='delAttachUrl' show-del @del='updated=true'></attach-list>
				</el-form-item>
			</el-form>
		</div>
			<div slot="footer" v-loading='loading'>
		    <el-button type='primary'  @click='save(0)' :loading='loading'>保存</el-button>
		    <el-button @click="show=false">关 闭</el-button>
	  	</div>
		</el-dialog>
		<type-dialog :in-dialog='inDialog' ref='typeDialog' show-select @select='selectType'/>
		<type-edit-dialog :in-dialog='inDialog' ref='typeEditDialog'/>
		<supplier-dialog :in-dialog='inDialog' show-select ref='supplierDialog' @select='selectSupplier'/>
		<stock-warning-dialog :in-dialog='inDialog' show-select ref='stockWarningDialog' @select='selectStockWarning'/>
	</div>
</template>
<script>
	import assetApi from '@/api/it/asset'
	import companyApi from '@/api/sys/company'
	import attachUpload from '@/components/common/attach/upload'
	import attachList from '@/components/common/attach/textList'
	import typeDialog from './type/treeDialog'
	import typeEditDialog from './type/editDialog'
	import supplierDialog from '@/components/it/supplier/listDialog'
	import stockWarningDialog from './stockWarning/listDialog'
	const todayDate = new Date().toJSON().substr(0,10)
	const formInit = {		
		model:'',		
		company_id:'',
		remarks:'',
		id:null,
		no:'',
		input_status:-1	,
		action:null,
		inbound_date:todayDate,
		price:0,
		amount:1,
		type_name:'',
		type_id:null,
		supplier_name:'',
		supplier_id:null,
		stock_warning_name:'',
		stock_warning_id:null,
		is_stock_warning:0
	}
	export default {
		components:{ 
			attachUpload,
			attachList,
			typeDialog,
			typeEditDialog,
			supplierDialog,
			stockWarningDialog
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
					company_id:[{ required:true, message:'请选择资产所属公司' }],	
					type_id:[{ required:true, message:'请选择资产类型' }],	
					stock_warning_id:[{ required:true, message:'请选择库存种类' }],	
					model:[{ required:true, message:'请填写资产型号' }],
					inbound_date:[{ required:true, message:'请填写入库日期' }],
					price:[{ type:'number',message:'请输入数字' }],
					amount:[
						{ required:true,message:'请填写资产数量'},
						{ validator:this.$commonJs.validateRules.et0}
					]
				},
				params:{
					no:null
				},
				updated:false,
				companyList:[],
				companyLoading:false,
				attachParams:{
					id:null
				}
			}
		},
		computed:{
			isEdit(){
				return this.form.id? true:false
			},
			title(){
				let title = 'IT资产信息'
				if(this.form.input_status>=0&&this.form.no){
					title += ' [ '+this.form.no+' ]'
				}else{
					title += ' [ 新增 ]'
				}
				return title
			},
			uploadAttachUrl(){
				return assetApi.uploadAttachUrl
			},
			delAttachUrl(){
				return assetApi.delAttachUrl
			}
		},
		mounted(){
			this.getCompanyList()
		},
		methods:{
			//
			getCompanyList(){
				this.companyLoading = true
				companyApi.getList({inCompany:1,noPage:1}).then(res=>{
					this.companyList = res.data.list
					this.companyLoading = false
				})
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
			},
			create(){
				this.loading = true
				return new Promise((resolve,reject)=>{
					assetApi.create().then(res=>{
						this.initData( res.data )
						this.loading = false
						resolve()
					})
				})
			},
			getForm(id){
				this.loading = true
				assetApi.getForm(id).then(res=>{
					this.initData(res.data)
					this.loading = false
				})
			},
			initData(data){
				this.assign(data)
				this.attachParams.id = data.id
				if(data.attach_ids){
					this.$refs.attachList.initData({ attach_ids:data.attach_ids})
				}
				this.clearValidate()
			},
			assign(data){
				this.form = { ...this.form, ...data }
				this.form.price = Number(this.form.price)
				this.form.is_stock_warning = this.form.stock_warning_id?1:0
				return this
			},
			save(status=0){
				this.$refs.form.validate(valid=>{
					if(valid){
						this.form.action = status
						if(status){
							this.$confirm('确定提交此IT资产吗？提交后资产只能报废不能删除！','提示',{
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
				assetApi.update(this.form).then(res=>{
					this.form.no = res.data.no
					this.form.input_status = res.data.input_status
					this.loading = false
					this.$message.success('保存成功')
					this.updated = true
					if(this.form.action==1){
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
			uploaded(res){
				this.updated = true
				this.$refs.attachList.push(res)
			},
			openSelectTypeDialog(){
				this.$refs.typeDialog.open().then(that=>{
					that.initData()
				})
			},
			selectType(data){
				this.form.type_name = data.name
				this.form.type_id = data.id
				this.$refs.typeDialog.close()
			},
			createType(){
				this.$refs.typeEditDialog.open().then(that=>{
					that.create()
				})
			},
			openSelectSupplierDialog(){
				this.$refs.supplierDialog.open().then(that=>{
					that.initData({
						inCompany:1,
						supplier_type:'ASSET'
					})
				})
			},
			selectSupplier(row){
				this.form.supplier_id = row.id
				this.form.supplier_name = row.name
				this.$refs.supplierDialog.close()
			},
			openSelectStockWarningDialog(){
				this.$refs.stockWarningDialog.open().then(that=>{
					that.initData({
						inCompany:1
					})
				})
			},
			selectStockWarning(row){
				this.form.stock_warning_id = row.id
				this.form.stock_warning_name = row.name
				this.$refs.stockWarningDialog.close()
			},
			getFieldList(field){
				return (keyword,callback)=>{
					assetApi.getFieldList({ field,keyword }).then(res=>{
						callback(res.data)
					})
				}
			}
		}
	}
</script>