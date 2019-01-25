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
			<divider title='系统更新记录信息'></divider>
			<el-form 
				:model='form' :rules='rules' 
				ref='form' label-width='85px' 
				size='mini' status-icon
				class='c-form-mini' >
				<el-form-item label='更新标题' prop='title' >
					<el-input v-model='form.title' placeholder=''>
					</el-input>
				</el-form-item>
				<el-form-item label='更新日期' prop='update_date'>
					<el-date-picker 
						v-model='form.update_date' 
						value-format='yyyy-MM-dd' 
						style='width: 30%' />
				</el-form-item>		
				<el-form-item label='更新内容' prop='content' >
					<el-input type='textarea' v-model='form.content' rows='5' placeholder=''>
					</el-input>
				</el-form-item>
				<el-form-item label='附件' prop='remarks'>
					<attach-upload ref='attachUpload' :params='attachParams' @uploaded='uploaded'></attach-upload>
					<attach-list ref='attachList' show-del @del='updated=true'></attach-list>
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
	import api from '@/api/sys/updateRecord'
	import companyApi from '@/api/sys/company'
	import attachUpload from '@/components/common/attach/upload'
	import attachList from '@/components/common/attach/textList'

	const formInit = {		
		id:null,
		input_status:-1,
		company_id:null,
		no:'',
		name:'',
		address:'',
		contacts:'',
		bank:'',
		remarks:'',
		supplier_type:'',
		supplierTypeList:[]
	}
	export default {
		components:{ 
			attachUpload,
			attachList
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
					title:[{ required:true, message:'请填写更新记录的标题' }],
					content:[{ required:true, message:'请填写更新记录的内容' }],
					update_date:[{ required:true, message:'请填写更新日期' }],
				},
				updated:false,
				companyList:[],
				companyLoading:false,
				attachParams:{
					table_name:'sys_update_record',
					table_id:null
				}
			}
		},
		computed:{
			isEdit(){
				return this.form.id? true:false
			},
			title(){
				let title = '系统更新记录信息'
				if(this.form.input_status>=0){
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
				this.$refs.attachUpload.clear()
				this.$refs.attachList.clear()
			},
			create(){
				this.loading = true
				return new Promise((resolve,reject)=>{
					api.create().then(res=>{
						this.initData( res.data )
						this.loading = false
						resolve()
					})
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
				this.attachParams.table_id = data.id
				if(data.attach_ids){
					this.$refs.attachList.initData({ attach_ids:data.attach_ids})
				}
				this.clearValidate()
			},
			assign(data){
				this.form = { ...this.form, ...data }
				return this
			},
			save(status=0){
				this.$refs.form.validate(valid=>{
					if(valid){
						this.form.action = status
						this.update()
					}else{
						return false
					}
				})
			},
			update(){
				this.loading = true
				let messageText = this.form.action?'提交成功':'保存成功'
				api.update(this.form).then(res=>{
					this.form.input_status = res.data.input_status
					this.loading = false
					this.$message.success(messageText)
					this.updated = true
					if(this.form.action==1){
						this.show=false									
					}
				}).catch(res=>{
					this.loading = false
					console.log(res)
				})
			},
			uploaded(res){
				this.updated = true
				this.$refs.attachList.push(res)
			},
			clearValidate(){
				this.$nextTick(()=>{
					this.$refs.form && this.$refs.form.clearValidate()
				})
			},
			resetFields(){
				this.updated = false
				this.form = { ...formInit }
				this.form.supplierTypeList = []
				this.clearValidate()
				return this
			}
		}
	}
</script>