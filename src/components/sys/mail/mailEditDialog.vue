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
			<divider title='邮箱配置'></divider>
			<el-form 
				:model='data' :rules='rules' 
				ref='form' label-width='90px' 
				size='mini' status-icon
				class='c-form-mini'>
				<el-row :gutter='12'>
					<el-col :span='24'>
						<el-form-item label='邮箱地址' prop='mail' >
							<el-input v-model='data.mail' placeholder='' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='12'>
						<el-form-item label='发件者名称' prop='sender_name' >
							<el-input v-model='data.sender_name' placeholder='如果为空，则为邮箱地址'>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='12'>
						<el-form-item label='SMTP地址' prop='smtp_host' >
							<el-input v-model='data.smtp_host' placeholder='' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='12'>
						<el-form-item label='开启SSL' prop='is_ssl'>
							<el-switch 
								v-model='data.is_ssl'/>
						</el-form-item>
					</el-col>
					<el-col :span='12'>
						<el-form-item label='端口' prop='port' >
							<el-input v-model.number='data.port' placeholder='默认为25，开启SSL默认为465' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='12'>
						<el-form-item label='登录名' prop='user_name' >
							<el-input v-model='data.user_name' placeholder='' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='12'>
						<el-form-item label='登录密码' prop='password' >
							<el-input v-model='data.password' placeholder='' >
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>		
			</el-form>
		</div>
		<div slot="footer" v-loading='loading'>
			<el-tooltip content='系统会以当前邮箱配置向自己发送一封测试邮件，无错误出现就会保存邮箱配置'>
				<el-button type='primary'  @click='save(0)' :loading='loading'>测试并保存</el-button>
			</el-tooltip>
	    
	    <el-button @click="show=false">关 闭</el-button>
  	</div>
	</el-dialog>
</div>
</template>
<script>
	import api from '@/api/sys/mail'

	const dataInit = {
		mail:'',
		sender_name:'',
		smtp_host:'',
		prop:'',
		user_name:'',
		password:'',
		is_ssl:false
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
			let validator = (rule,value,callback)=>{
				if(value){
					api.checkNameUnique(value,this.form.id).then(res=>{
						if(res.data>0){
							callback(new Error('邮箱地址已重复'))
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
				show:false,
				loading:false,
				updated:false,
				data:{ ...dataInit },				
				factoryList:[],
				companyList:[],
				roleList:[],
				rules:{
					mail:[
						{ required:true, message:'请填写邮箱地址' },
					],
					smtp_host:[
						{ required:true, message:'请填写SMTP地址' },
					]
				},
				updated:false,
			}
		},
		computed:{
			isEdit(){
				return this.data.id? true:false
			},
			title(){
				let title = '邮箱配置'
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
			closeDialog(){				
				if(this.updated){
					this.$emit('updated',this.data)
				}
				this.resetFields()
			},
			getData(){
				this.loading = true
				api.getMailDetails('DEFAULT').then(res=>{
					this.initData(res.data)
					this.loading = false
				})
			},
			initData(data){
				this.assign(data)
				this.clearValidate()
			},
			assign(data){
				this.data = { ...this.data, ...data }	
				return this
			},
			save(status=0){
				this.$refs.form.validate(valid=>{
					if(valid){
						this.data.action = status
						this.loading = true
						api.saveMail(this.data).then(res=>{
							this.data.id = res.data.id
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
			test(){

			},
			clearValidate(){
				this.$nextTick(()=>{
					this.$refs.form && this.$refs.form.clearValidate()
				})
			},
			resetFields(){
				this.updated = false
				this.data = { ...dataInit }
				this.clearValidate()
				return this
			}
		}
	}
</script>