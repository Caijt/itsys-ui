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
			<divider title='交还信息'></divider>
			<el-form 
				:model='form' :rules='rules' 
				ref='form' label-width='85px' 
				size='mini' status-icon
				class='c-form-mini' >
				<el-form-item label='所属公司' prop='company_id'>
					<el-select 
						v-model='form.company_id' 
						placeholder='选择记录所属公司'
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
				<el-row :gutter='10'>
					<el-col :span='8'>
						<el-form-item label='交还日期' prop='record_date'>
							<el-date-picker 
								v-model='form.record_date' 
								value-format='yyyy-MM-dd' 
								style='width: 100%' />
						</el-form-item>
					</el-col>					
					<el-col :span='8'>
						<el-form-item label='归还地点' prop='place'>
							<el-input v-model='form.place' placeholder='资产交还后放置的地点'></el-input>
						</el-form-item>
					</el-col>
				</el-row>					
				<el-form-item label='交还备注' prop='remarks' >
					<el-input type='textarea' v-model='form.remarks' placeholder=''>
					</el-input>
				</el-form-item>
				<el-form-item label='附件' prop='remarks'>
					<attach-upload ref='attachUpload' :params='attachParams' @uploaded='uploaded'></attach-upload>
					<attach-list  ref='attachList' show-del></attach-list>
				</el-form-item>
			</el-form>
			<divider title='交还资产列表'></divider>
			<asset-list no-page hide-query hide-record-fields in-dialog v-show='isSubmit' ref='assetList' />
			<edit-asset-list in-dialog v-show='!isSubmit' ref='editAssetList'/>
			
		</div>
			<div slot="footer" v-loading='loading'>
				<el-button @click='save(0)' v-if='isSubmit' :loading='loading'>保存</el-button>
				<el-button type='primary' v-else @click='save(1)' :loading='loading'>提交</el-button>
		    <el-button @click="show=false">关 闭</el-button>
	  	</div>
		</el-dialog>
		
	</div>
</template>
<script>
	import assetReturnRecordApi from '@/api/it/assetReturnRecord'
	import companyApi from '@/api/sys/company'
	import attachUpload from '@/components/common/attach/upload'
	import attachList from '@/components/common/attach/textList'
	import editAssetList from './editAssetList'
	import assetList from './detail/list'

	const formInit = {		
		model:'',		
		company_id:'',
		remarks:'',
		id:null,
		no:'',
		input_status:-1	,
		use_date:new Date(),
		price:0,
		amount:1,
		place:''
	}
	export default {
		components:{ 
			attachUpload,
			attachList,
			editAssetList,
			assetList
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
					record_date:[{ required:true, message:'请填写交还日期' }]
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
			isSubmit(){
				return this.form.input_status>=1
			},
			title(){
				let title = 'IT资产交还单'
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
		},
		methods:{
			//
			getCompanyList(){
				this.companyLoading = true
				companyApi.getList({ inCompany:1,noPage:1 }).then(res=>{
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
				if(this.isSubmit){
					this.$refs.assetList.clear()
				}else{
					this.$refs.editAssetList.clear()	
				}				
			},
			create(){
				this.loading = true
				return new Promise((resolve,reject)=>{
					assetReturnRecordApi.create().then(res=>{
						this.initData( res.data )
					 	this.loading = false
						resolve()
					})
				})
			},
			getForm(id){
				this.loading = true
				assetReturnRecordApi.getForm(id).then(res=>{
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
				if(this.isSubmit){
					this.$refs.assetList.initData({record_id:this.form.id})
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
					if(valid&&(this.isSubmit||this.$refs.editAssetList.validate())){
						this.form.action = status
						if(status){
							if(this.$refs.editAssetList.list==0){
								this.$message.warning('请选择交还的资产')
								return false
							}
							let assetList = this.$refs.editAssetList.list.map(item=>{
								return {
									asset_id: item.asset_id,
									amount:item.return_amount,
									dep_id:item.dep_id,
									employee_id:item.employee_id,
									detail_id:item.detail_id
								}
							})
							this.form.asset_list = assetList
							this.$confirm('确定提交此IT资产交还单吗？提交后交还资产不能再修改！','提示',{
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
				let messageText = this.form.action?'提交成功':'保存成功'
				assetReturnRecordApi.update(this.form).then(res=>{
					this.form.no = res.data.no
					this.form.input_status = res.data.input_status
					this.loading = false
					this.$message.success(messageText)
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
			}
		}
	}
</script>