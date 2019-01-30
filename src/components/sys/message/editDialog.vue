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
			<divider title='消息推送信息'></divider>
			<el-form 
				:model='form' :rules='rules' 
				ref='form' label-width='85px' 
				size='mini' status-icon
				class='c-form-mini'>
				<el-form-item label='消息编码' prop='code' >
					<el-input v-model='form.code' placeholder='消息编码' >
					</el-input>
				</el-form-item>
				<el-form-item label='说明' prop='remarks' >
					<el-input v-model='form.remarks' placeholder='说明' >
					</el-input>
				</el-form-item>
				<el-form-item label='推送用户' prop='user'>
					<el-input type='textarea' v-model='form.user' placeholder='以逗号隔开' >
					</el-input>
					<span style='font-size: 12px'>* 消息推送时，只会推送用户有权限查看的数据，例如IT资产所属公司为A公司，B用户的管理公司只有B公司，那即使在推送用户里填上B用户也接收不到消息。</span>
				</el-form-item>
				<el-form-item label='启用' prop='is_disabled'>
					<el-switch 
						v-model='form.is_disabled'
						:active-value="0"
    				:inactive-value="1"/>
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
	import api from '@/api/sys/message'

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
					code:[
						{ required:true, message:'请填写消息编码' }						
					]
				},
				updated:false,
			}
		},
		computed:{
			isEdit(){
				return this.form.id? true:false
			},
			title(){
				let title = '消息推送信息'
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