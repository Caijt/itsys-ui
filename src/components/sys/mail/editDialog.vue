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
			<divider title='邮件通知模版'></divider>
			<el-form 
				:model='form' :rules='rules' 
				ref='form' label-width='85px' 
				size='mini' status-icon
				class='c-form-mini'>
				<el-form-item label='通知事件' prop='name' >
					<el-input v-model='form.name' placeholder='' disabled>
					</el-input>
				</el-form-item>
				<el-form-item label='启用' prop='is_disabled'>
					<el-switch 
						v-model='form.is_disabled'
						:active-value="0"
    				:inactive-value="1"/>
				</el-form-item>
				<el-form-item label='标题模版' prop='title_template' >
					<el-input v-model='form.title_template' placeholder='' >
					</el-input>
				</el-form-item>
				<el-form-item label='内容模版' prop='content_template' >
					<el-input type='textarea' autosize v-model='form.content_template' placeholder='' >
					</el-input>
					<span style='font-size:12px'>* 支持html标签</span>
				</el-form-item>
				<el-form-item label='模版变量' prop='tips' >
					<el-input type='textarea' autosize v-model='form.tips' readonly placeholder='' >
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
	import api from '@/api/sys/mail'

	const formInit = {		
		id:null,
		name:'',
		address:'',
		is_disabled:0
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
							callback(new Error('公司名称已重复'))
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
				data:{ },				
				factoryList:[],
				companyList:[],
				roleList:[],
				form:{ ...formInit },
				rules:{
					
				},
				updated:false,
			}
		},
		computed:{
			isEdit(){
				return this.form.id? true:false
			},
			title(){
				let title = '邮件通知信息'
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
			initData(data){
				this.assign(data)
				this.clearValidate()
			},
			assign(data){
				this.form = { ...this.form, ...data }	
				this.form.is_disabled = Number(this.form.is_disabled)	
				return this
			},
			save(status=0){
				this.$refs.form.validate(valid=>{
					if(valid){
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
				this.clearValidate()
				return this
			}
		}
	}
</script>