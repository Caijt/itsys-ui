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
			<divider title='用户信息'></divider>
			<el-form 
				:model='form' :rules='rules' 
				ref='form' label-width='85px' 
				size='mini' status-icon
				class='c-form-mini'>
				<el-row :gutter='10'>
					<el-col :span='12'>
						<el-form-item label='登录用户' prop='login_name' >
							<el-input v-model='form.login_name' placeholder='此用户登录系统的登录名' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='12'>
						<el-form-item label='用户名称' prop='name' >
							<el-input v-model='form.name' placeholder='此用户的名称'>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='12' v-if='isEdit'>
						<el-form-item label='修改密码' prop='change_pwd' >
							<el-switch 
								v-model='form.change_pwd'/>
						</el-form-item>	
					</el-col>
					<el-col :span='12' v-if='!isEdit||form.change_pwd'>
						<el-form-item label='登录密码' prop='pwd' >
							<el-input v-model='form.pwd' type='password' placeholder='用户登录密码'>
							</el-input>
						</el-form-item>	
					</el-col>
				</el-row>
				<el-form-item label='企业号ID' prop='qywx_user' >
					<el-input v-model='form.qywx_user' placeholder=''>
					</el-input>
				</el-form-item>
				<el-row :gutter='10'>					
					<el-col :span='12'>
						<el-form-item label='管理公司' prop='companyIds'>
							<el-checkbox-group v-model="form.companyIds">
								<div v-for='item in companyList' :key='item.id'>
									<el-checkbox  :label='item.id+""'>{{item.name}}</el-checkbox>
								</div>				    
						  </el-checkbox-group>
						</el-form-item>
					</el-col>
					<el-col :span='12'>
						<el-form-item label='所属角色' prop='roleIds'>
							<el-checkbox-group v-model="form.roleIds">
								<div v-for='item in roleList' :key='item.id'>
									<el-checkbox  :label='item.id+""'>{{item.name}}</el-checkbox>
									<el-button type='text' style='margin-left:10px' @click='openMenuDialog(item)'> [菜单权限] </el-button>
								</div>				    
						  </el-checkbox-group>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<div slot="footer" v-loading='loading'>
	    <el-button type='primary'  @click='save(0)' :loading='loading'>保存</el-button>
	    <el-button @click="show=false">关 闭</el-button>
  	</div>
	</el-dialog>
	<menu-dialog :in-dialog='inDialog' ref='menuDialog'/>
</div>
</template>
<script>
	import api from '@/api/sys/user'
	import companyApi from '@/api/sys/company'
	import factoryApi from '@/api/sys/factory'
	import roleApi from '@/api/sys/role'
	import menuDialog from '@/components/sys/menu/treeDialog'

	const formInit = {		
		id:0,
		login_name:'',
		name:'',
		qywx_user:'',
		factoryIds:[],
		factory_ids:'',
		roleIds:[],
		role_ids:'',
		companyIds:[],
		company_ids:'',
		role_ids:'',
		roleIds:[],
		pwd:"",
		change_pwd:false
	}
	export default {
		components:{ 
			menuDialog
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
					api.checkLoginNameUnique(value,this.form.id).then(res=>{
						if(res.data){
							callback()
						}else{
							callback(new Error('登录用户名已重复'))
						}
					})
				}else{
					callback()
				}
			}
			return {
				resolve:null,
				show:false,
				loading:false,
				updated:false,
				data:{ },				
				factoryList:[],
				companyList:[],
				roleList:[],
				form:{ ...formInit },
				rules:{
					login_name:[
						{ required:true, message:'请填写登录用户' },
						{ validator:validator, trigger:'blur'}
					],
					pwd:[{ required:true, message:'请填写登录密码' }],
					name:[{ required:true, message:'请填写用户名称' }]
				},
				updated:false,
			}
		},
		computed:{
			isEdit(){
				return this.form.id!=0? true:false
			},
			title(){
				let title = '登陆用户信息'
				if(this.isEdit){
					title += ' [ 修改 ]'
				}else{
					title += ' [ 新增 ]'
				}
				return title
			}
		},
		mounted(){
			this.getCompanyList()
			this.getRoleList()
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
				companyApi.getList().then(res=>{
					this.companyList = res.data
				})
			},
			getRoleList(){
				this.companyLoading = true
				roleApi.getList().then(res=>{
					this.roleList = res.data
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
				if(this.form.role_ids){
					this.form.roleIds = this.form.role_ids.split(',')
				}	
				if(this.form.company_ids){
					this.form.companyIds = this.form.company_ids.split(',')
				}	
				if(this.form.factory_ids){
					this.form.factoryIds = this.form.factory_ids.split(',')
				}			
				return this
			},
			save(status=0){
				this.$refs.form.validate(valid=>{
					if(valid){
						this.form.role_ids = this.form.roleIds.join(',')
						this.form.company_ids = this.form.companyIds.join(',')
						this.form.factory_ids = this.form.factoryIds.join(',')
						this.loading = true
						api.save(this.form).then(res=>{
							this.form.id = res.data.id
							this.loading = false
							this.$message.success('保存成功')
							this.updated = true
						}).catch(res=>{
							this.loading = false
							console.log(res)
						})
					}else{
						return false
					}
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
				return this
			},
			openMenuDialog(row){
				this.$refs.menuDialog.open().then(that=>{
					that.initData({ role_id:row.id })
				})
			}
		}
	}
</script>