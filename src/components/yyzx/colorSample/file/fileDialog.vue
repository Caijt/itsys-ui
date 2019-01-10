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
				<divider title='打样申请归档信息'></divider>
				<el-form-item label='归档编号' prop='file_no'>
					<el-input v-model='form.file_no' >
					</el-input>
				</el-form-item>
				<el-form-item label='归档日期' prop='file_date'>
					<el-date-picker v-model='form.file_date' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
				</el-form-item>
				<el-form-item label='归档说明' prop='file_remarks'>
					<el-input v-model='form.file_remarks' >
					</el-input>
				</el-form-item>
				<el-form-item label='附件管理'>
					<attach-upload 
						ref='attachUpload'
						:disabled='!isEdit'
						:params='attachParams'
						:hide-upload-button='!isEdit'
						@uploaded='uploaded'/>
						<attach-list show-del v-show='isEdit' ref='attachList' />
				</el-form-item>
			</el-form>
		</div>
			<span slot="footer">
			 	<el-button type='primary' @click='submit' :loading='loading'>提交</el-button>
			 	<el-button @click='save(0)' :loading='loading'>保存</el-button>
		    <el-button @click="show=false">关 闭</el-button>
	  	</span>
		</el-dialog>
	</div>
</template>
<script>
	import fileApi from '@/api/yyzx/colorSampleFile'
	import attachUpload from '@/components/common/attach/upload'
	import attachList from '@/components/common/attach/textList'

	const formInit = {
		id:null,
		sample_id:null,
		apply_id:null,
		input_status:0,
		express:'',
		receive_address:'',
		receive_tel:'',
		receiver:''
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
					file_no:[{ required:true, message:'请填写归档编号' }],
					file_date:[{ required:true, message:'请填写归档日期' }]
				},
				params:{
					no:null
				},
				updated:false,				
				attachParams:{
					table_name:'yyzx_color_sample_file',
					table_id:null
				}
			}
		},
		computed:{
			isEdit(){
				return this.form.id? true:false
			},
			title(){
				let title = '打样申请归档'
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
			initData(data){
				this.assign(data)
				this.attachParams.table_id = data.id
				if(data.attach_ids){
					this.$refs.attachList.initData({ attach_ids:data.attach_ids})
				}
				this.clearValidate()
			},
			getForm(id){
				this.loading = true
				fileApi.getForm(id).then(res=>{
					this.initData(res.data)
					this.loading = false
				})
			},
			closeDialog(){	
				if(this.updated){
					this.$emit('updated')
				}
				this.resetFields()
				this.$refs.attachList.clear()
				this.$refs.attachUpload.clear()
			},
			assign(data){				
				this.form = { ...this.form, ...data }
				return this
			},
			create(){
				this.loading = true
				fileApi.create(this.form).then(res=>{
					this.initData(res.data)
					this.updated = true
					this.loading = false
				})
			},
			submit(){				
				this.$confirm('确定提交归档？','提示',{
					type: 'warning'
				}).then(()=>{
					this.save(1)
				})
			},
			save(status=0){			
				let messageText = status==0?'保存成功':'提交成功'
				this.$refs.form.validate(valid=>{
					if(valid){
						this.form.input_status = status
						this.loading = true
						if(this.isEdit){
							fileApi.update(this.form).then(res=>{
								this.loading = false
								this.$message.success(messageText)
								this.updated = true
								if(this.form.input_status==1){
									this.show=false
								}
							})
						}
					}else{
						return false
					}
				})
			},
			saved(){
				this.show=false
				this.$emit('saved')
			},
			clearValidate(){
				this.$nextTick(()=>{
					this.$refs.form && this.$refs.form.clearValidate()
				})
			},
			uploaded(res){
				this.$refs.attachList.push(res)
			},
			resetFields(){
				this.updated = false
				this.form = {...formInit}
				this.clearValidate()
				return this
			}
		}
	}
</script>