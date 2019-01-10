<template>
	<div v-loading='loading'>
		<el-form 
			:model='form' 
			:rules='rules' 
			ref='form' 
			label-width='100px' 
			size='mini' 
			class='c-form-mini' 
			status-icon>
			<divider title='工程进度报告'></divider>
			<el-form-item label='是否提供安装' prop='is_install'>
				<el-switch v-model='form.is_install' :active-value='1' :inactive-value='0'>
				</el-switch>
			</el-form-item>
			<el-form-item label='项目管理人员' prop='admin'>
				<el-input v-model='form.admin'></el-input>
			</el-form-item>
			<el-form-item label='安装计划' prop='install_plan'>
				<el-input v-model='form.install_plan' type='textarea' :rows='2'></el-input>
			</el-form-item>
			<el-form-item label='安装进度' prop='install_progress'>
				<el-input v-model='form.install_progress' type='textarea' :rows='2'></el-input>
			</el-form-item>
			<el-form-item label='劳务合同执行情况' prop='contract_status'>
				<el-input v-model='form.contract_status' type='textarea' :rows='2'></el-input>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
	import reportApi from '@/api/gc/report'
	const formInit = {
		project_id:null,//项目id
		contract_id:null,//合同id
		
		id:null,
		is_install:0,
		install_plan:'',
		install_progress:'',
		contract_status:'',
		is_submit:false
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
				loading:false,
				orderTypeLoading:true,
				form:{ ...formInit },
				maxProductArea:0,
				rules:{
					install_plan:[{ required:true, message:'请填写安装计划' }],
					install_progress:[{ required:true, message:'请填写安装进度' }],
					contract_status:[{ required:true, message:'请填写劳务合同执行情况' }]
				}
			}
		},
		computed:{
			//表单是否是编辑状态
			isEdit(){
				return this.form.id!=null
			}
		},
		created(){
			
		},
		methods:{
			get(id){
				this.loading = true
				reportApi.getForm(id).then(res=>{
					this.assign(res.data)
					this.loading = false
				})
			},
			assign(data){
				this.form = { ...this.form, ...data }
			},
			//保存
			save(isSubmit = false) {
				console.log(isSubmit)
				return new Promise(( resolve,reject )=>{
					this.$refs.form.validate(vaild=>{
						if(vaild){
							this.form.is_submit=isSubmit?1:0
							if(this.isEdit){
								reportApi.update(this.form).then(res=>{
									this.$message.success('更新成功')
									this.$emit('updated')
									this.$emit('saved')
									resolve('updated')
								})
							}else{						
								reportApi.create(this.form).then(res=>{
									this.$message.success('创建成功')
									this.$emit('created')
									this.$emit('saved')
									resolve('created')
								})
							}
							resolve()
						}else{
							reject()
						}
					})
				})
			},
			clearValidate(){
				this.$nextTick(()=>{
					this.$refs.form.clearValidate()
				})				
			},
			resetFields(){
				this.form = {...formInit}
				this.clearValidate()
			}
		}
	}
</script>