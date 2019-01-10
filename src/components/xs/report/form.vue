<template>
	<div v-loading='loading'>
		<el-form 
			:model='form' 
			:rules='rules' 
			ref='form' 
			label-width='85px' 
			size='mini' 
			class='c-form-mini' 
			status-icon>
			<divider title='销售计划报告'></divider>
			<el-form-item label='下单描述' prop='order_content'>
				<el-input v-model='form.order_content' type='textarea' :row='3'></el-input>
			</el-form-item>
			<el-form-item label='交货计划' prop='delivery_plan'>
				<el-input v-model='form.delivery_plan' type='textarea' :row='3'></el-input>
			</el-form-item>
			<el-form-item label='回款计划' prop='return_plan'>
				<el-input v-model='form.return_plan' type='textarea' :row='3'></el-input>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
	import reportApi from '@/api/xs/report'
	const formInit = {
		project_id:null,//项目id
		contract_id:null,//合同id
		
		id:null,
		order_content:'',
		delivery_plan:'',
		return_plan:'',
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
					order_content:[{ required:true, message:'请填写下单内容' }],
					delivery_plan:[{ required:true, message:'请填写交货计划' }],
					return_plan:[{ required:true, message:'请填写回款计划' }]
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