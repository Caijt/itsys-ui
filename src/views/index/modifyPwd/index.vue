<template>
	<div>
		<el-row>
			<el-col :md='16'>
				<el-form 
					ref='form'
					:rules='rules' 
					:model='form'
					status-icon 
				>
					<el-form-item prop='oldPassword' label='原密码'>
						<el-input type='password' v-model='form.oldPassword' placeholder='输入原来的密码' clearable></el-input>
					</el-form-item>
					<el-form-item prop='newPassword' label='新密码'>
						<el-input type='password' v-model='form.newPassword' placeholder='输入新的密码' clearable></el-input>
					</el-form-item>
					<el-form-item prop='newPassword2' label='确认密码'>
						<el-input type='password' v-model='form.newPassword2' placeholder='再输入新的密码' clearable></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type='primary' @click='modify' :loading='formLoading' >修改</el-button>
						<el-button @click='reset' >重置</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
		
	</div>
</template>
<script>
	import indexApi from '@/api/index'
	export default {
		data(){
			return {
				formLoading:false,
				form:{
					oldPassword:'',
					newPassword:'',
					newPassword2:''
				},
				rules:{
					oldPassword:[{	required:true,message:'请填写原密码' }],
					newPassword:[{	required:true,message:'请填写新的密码' }],
					newPassword2:[
						{	required:true,message:'请再填写一次新的密码' },
						{ validator:(rule,value,callback)=>{
							if(value!=this.form.newPassword){
								callback(new Error('两次密码不一致！'))
							}else{
								callback()
							}
						}}
					]
				}
			}
		},
		methods:{
			modify(){
				this.$refs.form.validate(vaild=>{
					if(vaild){
						this.formLoading = true
						indexApi.modifyPwd(this.form).then(res=>{
							this.$message.success('修改成功')
							this.formLoading = false
							this.reset()
						}).catch(res=>{
							this.formLoading = false
						})
					}else{
						return false
					}
				})
			},
			reset(){
				this.$refs.form.resetFields()
			}
		}
	}
</script>