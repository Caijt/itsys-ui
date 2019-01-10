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
				<divider title='色样客户确认信息'></divider>
				<el-form-item label='客户确认' prop='is_pass'>
					<el-radio-group v-model="form.is_pass">
						<el-tooltip placement='top' content='打样成功，填写色板色号，提交后打样申请完成'>
							<el-radio :label="1">通过</el-radio>
				    </el-tooltip>
				    <el-tooltip placement='top' content='打样失败！可在打样申请中重新对色样进行打样申请'>
				    	<el-radio :label="0">未通过</el-radio>
				    </el-tooltip>
				  </el-radio-group>
				</el-form-item>
				<el-form-item label='色板色号' prop='color_no' v-if='form.is_pass'>
					<el-input v-model='form.color_no' >
					</el-input>
				</el-form-item>
				<el-form-item label='确认说明' prop='confirm_remarks'>
					<el-input v-model='form.confirm_remarks' >
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
	import confirmApi from '@/api/xs/colorSampleConfirm'
	import attachUpload from '@/components/common/attach/upload'
	import attachList from '@/components/common/attach/textList'

	const formInit = {
		id:null,
		sample_id:null,
		apply_id:null,
		input_status:0,
		delivery_express:'',
		delivery_date:'',
		delivery_remarks:'',
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
					is_pass:[{ required:true, message:'请选择样品是否通过' }],
					confirm_remarks:[{ required:true, message:'请填写确认说明' }],
					color_no:[{ required:true, message:'请填写色板色号' }],
				},
				params:{
					no:null
				},
				updated:false,				
				attachParams:{
					table_name:'xs_color_sample_confirm',
					table_id:null
				}
			}
		},
		computed:{
			isEdit(){
				return this.form.id? true:false
			},
			title(){
				let title = '色样客户确认'
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
				confirmApi.getForm(id).then(res=>{
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
				confirmApi.create(this.form).then(res=>{
					this.initData(res.data)
					this.updated = true
					this.loading = false
				})
			},
			submit(){
				if(this.form.is_pass==1){
					if(this.$refs.attachList.list.length==0){
						this.$message.error('请上传确认签收相关附件')
						return false
					}
				}
				this.$confirm('确定提交确认？','提示',{
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
							confirmApi.update(this.form).then(res=>{
								this.loading = false
								this.$message.success(messageText)
								this.updated = true
								if(this.form.input_status==1){
									if(!this.form.is_pass){
										this.$confirm('此次打样申请未通过，是否前往打样申请进行重新打样','提示',{
											type: 'warning'
										}).then(()=>{
											this.$router.push('/xs/colorSample/apply')
										}).catch(()=>{
											this.show = false
										})
									}else{
										this.show = false
									}
									
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