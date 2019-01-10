<template>
	<div>
	<el-dialog 
		:title='title'
		class='c-dialog-fixed'
		:visible.sync='show'
		:append-to-body='inDialog'
		width='60%'
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
						style='width: 80%'
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
				<el-form-item label='资产型号' prop='model' >
					<el-input v-model='form.model' placeholder='资产具体型号'>
					</el-input>
				</el-form-item>
				<el-form-item label='供应商' prop='supplier_name'>
					<el-input v-model='form.supplier_name' placeholder='资产从哪个经销商购买' style='width:80%'>
					</el-input>
				</el-form-item>
				<el-form-item label='购入日期' prop='buy_date'>
					<el-date-picker 
						v-model='form.buy_date' 
						value-format='yyyy-MM-dd' 
						style='width: 30%' />
				</el-form-item>
				<el-form-item label='数量' prop='amount' >
					<el-input v-model.number='form.amount' style='width: 30%'>
					</el-input>
				</el-form-item>
				<el-form-item label='价格' prop='price' >
					<el-input v-model.number='form.price' style='width: 30%'>
						<span slot="prefix">￥</span>
					</el-input>
					<span style='font-size: 12px'>该资产总价格，非单价</span>
				</el-form-item>
				<el-form-item label='序列号' prop='sn' >
					<el-input v-model='form.sn' placeholder='资产出厂编号' style='width: 30%'>
					</el-input>
					<span style='font-size: 12px'>如果涉及产品保修，请务必填写</span>
				</el-form-item>
				<el-form-item label='备注' prop='remarks' >
					<el-input v-model='form.remarks' placeholder='资产其它备注信息'>
					</el-input>
				</el-form-item>
				<el-form-item label='附件' prop='remarks'>
					<attach-upload ref='attachUpload' :params='attachParams' @uploaded='uploaded'></attach-upload>
					<attach-list ref='attachList' show-del></attach-list>
				</el-form-item>
			</el-form>
		</div>
			<div slot="footer" v-loading='loading'>
		    <el-button type='primary'  @click='save(0)' :loading='loading'>保存</el-button>
		    <el-button @click="show=false">关 闭</el-button>
	  	</div>
		</el-dialog>
		
	</div>
</template>
<script>
	import assetApi from '@/api/it/asset'
	import companyApi from '@/api/yyzx/company'
	import factoryApi from '@/api/yyzx/factory'
	import attachUpload from '@/components/common/attach/upload'
	import attachList from '@/components/common/attach/textList'
	

	const formInit = {		
		model:'',		
		company_id:'',
		orders:[],
		remarks:'',
		id:null,
		no:'',
		input_status:-1	,
		buy_date:new Date(),
		price:0,
		amount:1
	}
	export default {
		components:{ 
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
			return {
				resolve:null,
				show:false,
				loading:false,
				updated:false,
				data:{ },				
				form:{ ...formInit },
				rules:{
					company_id:[{ required:true, message:'请选择资产所属公司' }],	
					model:[{ required:true, message:'请填写资产型号' }],
					buy_date:[{ required:true, message:'请填写购买日期' }],
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
					table_name:'it_asset',
					table_id:null
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
				this.attachParams.table_id = data.id
				if(data.attach_ids){
					this.$refs.attachList.initData({ attach_ids:data.attach_ids})
				}
				this.clearValidate()
			},
			assign(data){
				this.form = { ...this.form, ...data }
				this.form.price = Number(this.form.price)
				return this
			},
			save(status=0){
				this.$refs.form.validate(valid=>{
					if(valid){
						this.form.order_no = this.form.orders.join(',')
						this.form.input_status = status
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
				let messageText = this.form.input_status?'提交成功':'保存成功'
				assetApi.update(this.form).then(res=>{
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
	        assetApi.del(this.form.id).then(res=>{
	          this.$message.success('删除成功')
	          this.$emit('updated')
	          this.loading = false
	          this.show = false
	        }).catch(res=>{
	        	this.loading = false
	        })
	      })
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