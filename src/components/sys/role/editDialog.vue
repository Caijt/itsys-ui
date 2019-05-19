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
			<divider title='角色信息'></divider>
			<el-form 
				:model='form' :rules='rules' 
				ref='form' label-width='85px' 
				size='mini' status-icon
				class='c-form-mini'>
				<el-form-item label='角色名称' prop='name' >
					<el-input v-model='form.name' placeholder='此角色的名称'>
					</el-input>
				</el-form-item>
				<el-form-item label='角色说明' prop='remarks' >
					<el-input type='textarea' v-model='form.remarks' placeholder='此角色的说明'>
					</el-input>
				</el-form-item>
				<el-form-item label='菜单权限' prop='menu_ids' >
					<menu-list height='350px' show-checkbox ref='menuList'>
						<!-- <template slot='right' slot-scope='{node,data}' v-if='node.checked&&node.isLeaf'>
							<span style='font-size: 12px'>读[全部] 写[全部] 删[全部]</span>
						</template> -->
					</menu-list>
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
	import api from '@/api/sys/role'
	import menuList from '@/components/sys/menu/treeList'
	const formInit = {		
		id:0,
		login_name:'',
		name:'',
		remarks:'',
		menu_ids:''
	}
	export default {
		components:{ 
			menuList
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
					api.checkNameUnique(value,this.form.id).then(res=>{
						if(res.data){
							callback()
						}else{
							callback(new Error('角色名称已重复'))
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
					name:[
						{ required:true, message:'请填写角色名称' },
						{ validator:validator ,trigger:'blur'}
					]			
				},
				updated:false,
				initMenu:false
			}
		},
		computed:{
			isEdit(){
				return this.form.id? true:false
			},
			title(){
				let title = '角色信息'
				if(this.isEdit){
					title += ' [ 修改 ]'
				}else{
					title += ' [ 新增 ]'
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
						this.initMenuList()
					}
				})
			},
			open(){
				this.show = true
				return new Promise((resolve,reject)=>{
					this.resolve = resolve
				}) 
			},
			initMenuList(){
				if(!this.initMenu){
					this.$refs.menuList.initData()
					this.initMenu = true
				}
			},
			closeDialog(){				
				if(this.updated){
					this.$emit('updated',this.form)
				}
				this.resetFields()
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
				if(this.form.menu_ids){
					let menuIds = this.form.menu_ids.split(',')
					this.$refs.menuList.setCheckedKeys(menuIds)
				}
				return this
			},
			save(status=0){
				this.$refs.form.validate(valid=>{
					if(valid){
						this.form.menu_ids = this.$refs.menuList.getCheckedKeys(true).join(',')
						this.form.action = status
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
				this.$refs.menuList.setCheckedKeys([])
				this.clearValidate()
				return this
			},
			test(){

			}
		}
	}
</script>