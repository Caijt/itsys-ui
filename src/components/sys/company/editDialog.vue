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
			<divider title='公司信息'></divider>
			<el-form 
				:model='form' :rules='rules' 
				ref='form' label-width='85px' 
				size='mini' status-icon
				class='c-form-mini'>
				<el-form-item label='公司名称' prop='name' >
					<el-input v-model='form.name' placeholder='公司名称' >
					</el-input>
				</el-form-item>
				<el-form-item label='公司地址' prop='address' >
					<el-input v-model='form.address' placeholder='公司所在详细地址' >
					</el-input>
				</el-form-item>
				<el-form-item label='启用' prop='is_disabled'>
					<el-switch 
						v-model='form.is_disabled'
						:active-value="false"
    				:inactive-value="true"/>
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
	import api from '@/api/sys/company'

	const formInit = {		
		id:0,
		name:'',
		address:'',
		is_disabled:false
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
						if(res.data){
							callback()
						}else{
							callback(new Error('公司名称已重复'))
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
						{ required:true, message:'请填写公司名称' },
						{ validator:validator ,trigger:'blur'}
					]
				},
				updated:false,
			}
		},
		computed:{
			isEdit(){
				return this.form.id!=0? true:false
			},
			title(){
				let title = '公司信息'
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
				return this
			},
			save(status=0){
				this.$refs.form.validate(valid=>{
					if(valid){
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