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
			<divider title='库存预警种类信息'></divider>
			<el-form 
				:model='form' :rules='rules' 
				ref='form' label-width='85px' 
				size='mini' status-icon
				class='c-form-mini' >
				<el-form-item label='所属公司' prop='company_id'>
					<el-select 
						v-model='form.company_id' 
						placeholder='选择所属公司'
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
				<el-form-item label='库存名称' prop='name' >
					<el-input v-model='form.name' placeholder=''>
					</el-input>
				</el-form-item>
				<el-form-item label='预警值' prop='warning_value' >
					<el-input v-model.number='form.warning_value' placeholder='库存预警最低值' style='width: 30%'/>
					<span style='font-size: 12px'>当库存值等于或小于该值时，进行提醒</span>
				</el-form-item>
				<el-form-item label='备注' prop='remarks' >
					<el-input type='textarea' v-model='form.remarks' placeholder=''>
					</el-input>
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
	import api from '@/api/it/assetStockWarning'
	import companyApi from '@/api/sys/company'

	const formInit = {		
		id:null,
		input_status:-1,
		company_id:null,
		no:'',
		name:'',
		address:'',
		contacts:'',
		warning_value:0,
	}
	export default {
		components:{ 
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
					name:[{ required:true, message:'请填写库存预警种类名称' }],
					company_id:[{ required:true, message:'请选择所属公司' }],
					warning_value:[
						{ required:true, message:'请填写库存预警值' },
						{ type:'number',message:'请输入数字' }
					]
				},
				updated:false,
				companyList:[],
				companyLoading:false
			}
		},
		computed:{
			isEdit(){
				return this.form.id? true:false
			},
			title(){
				let title = '库存预警种类信息'
				if(this.form.input_status>=0){
					title += ' [ 修改 ]'
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
					this.$emit('updated',this.form)
				}
				this.resetFields()
			},
			getCompanyList(){
				this.companyLoading = true
				companyApi.getList({inCompany:1,noPage:1}).then(res=>{
					this.companyList = res.data.list
					this.companyLoading = false
				})
			},
			create(){
				this.loading = true
				return new Promise((resolve,reject)=>{
					api.create().then(res=>{
						this.initData( res.data )
						this.loading = false
						resolve()
					})
				})
			},
			getForm(id){
				this.loading = true
				api.getForm(id).then(res=>{
					this.initData(res.data)
					this.loading = false
				})
			},
			initData(data){
				this.assign(data)
				this.clearValidate()
			},
			assign(data){
				this.form = { ...this.form, ...data }			
				return this
			},
			save(status=0){
				this.$refs.form.validate(valid=>{
					if(valid){
						this.form.action = status
						this.update()
					}else{
						return false
					}
				})
			},
			update(){
				this.loading = true
				let messageText = this.form.action?'提交成功':'保存成功'
				api.update(this.form).then(res=>{
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
			uploaded(res){
				this.updated = true
				this.$refs.attachList.push(res)
			},
			clearValidate(){
				this.$nextTick(()=>{
					this.$refs.form && this.$refs.form.clearValidate()
				})
			},
			resetFields(){
				this.updated = false
				this.form = { ...formInit }
				this.form.supplierTypeList = []
				this.clearValidate()
				return this
			},	
			openSelectDepDialog(){
				this.$refs.depDialog.open().then(that=>{
					that.initData()
				})
			},
			selectDep(data){
				this.form.dep_id = data.id
				this.form.dep_name = data.name
				this.$refs.depDialog.close()
			},
			clearParentDep(){
				this.form.parent_id = null
				this.form.parent_dep = ''
			},
			isSelect(data){
				let parentIds = (data.parent_ids||'').split(',')
				return data.id==this.form.id || parentIds.indexOf(this.form.id.toString())>=0
			}
		}
	}
</script>