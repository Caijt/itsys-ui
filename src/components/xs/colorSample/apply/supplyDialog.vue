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
			<el-form 
				:model='form' :rules='rules' 
				ref='form' label-width='85px' 
				size='mini' status-icon
				class='c-form-mini'>
				<divider title='补充信息'></divider>			
				<el-form-item label='补充内容' prop='content'>
					<el-input v-model='form.content' placeholder=''>
					</el-input>
				</el-form-item>		
				<el-form-item label='附件管理'>
					<attach-upload 
						ref='attachUpload'
						:params='{table_name:"xs_color_sample_supply"}'
						hide-upload-button
						@uploaded='uploaded' />
				</el-form-item>			
			</el-form>
		</div>
			<span slot="footer">
			 	<el-button type='primary' @click='save' :loading='loading'>提交</el-button>
		    <el-button @click="show=false">关 闭</el-button>
	  	</span>
		</el-dialog>
	</div>
</template>
<script>
	import supplyApi from '@/api/xs/colorSampleSupply'
	import attachUpload from '@/components/common/attach/upload'

	const formInit = {
		sample_id:null,
		apply_id:null,
		content:'',
		attach_ids:''
	}
	export default {
		components:{ 
			attachUpload
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
					content:[{ required:true, message:'请填写补充内容' }],
					amount:[{ type:'number',message:'请输入数字' },]
				},
				params:{
					no:null
				},
				updated:false,
				companyList:[],
				companyLoading:false,
				factoryList:[],
				factoryLoading:false
			}
		},
		computed:{
			isEdit(){
				return this.form.id? true:false
			},
			title(){
				let title = '打样申请补充说明'
				if(this.form.apply_no){
					title += ' [ '+this.form.apply_no+' ]'
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
					}
				})
			},
			open(){
				this.show = true
				return new Promise((resolve,reject)=>{
					this.resolve = resolve
				}) 
			},
			getForm(id){
				this.loading = true
				colorSampleApi.getForm(id).then(res=>{
					this.assign(res.data)
					this.loading = false
				})
			},
			save(){			
				this.$refs.form.validate(valid=>{
					if(valid){
						this.$confirm('确定提交补充内容吗？提交后无法修改','提示',{
							type: 'warning'
						}).then(()=>{
							this.loading = true
							this.$refs.attachUpload.upload().then(()=>{
								console.log(this.form)
								supplyApi.create(this.form).then(res=>{
									this.loading = false
									this.$message.success('提交成功')
									this.updated = true
									this.show=false
								})
							})
							
						})						
					}else{
						return false
					}
				})
			},
			closeDialog(){	
				if(this.updated){
					this.$emit('updated')
				}
				this.resetFields()
				this.loading = false
			},
			assign(data){				
				this.form = { ...this.form, ...data }
				return this
			},			
			clearValidate(){
				this.$nextTick(()=>{
					this.$refs.form && this.$refs.form.clearValidate()
				})
			},
			uploaded(data){
				if(this.form.attach_ids){
					this.form.attach_ids += ',' + data.id
				}else{
					this.form.attach_ids = data.id
				}
			},
			resetFields(){
				this.updated = false
				this.form = { ...formInit }
				this.clearValidate()
				return this
			}
		}
	}
</script>