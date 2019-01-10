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
				ref='form' label-width='110px' 
				size='mini' status-icon
				class='c-form-mini'>
				<divider title='色样申请打板信息'></divider>
				<el-form-item label='打板厂家' prop='supplier'>
					<el-input v-model='form.supplier' >
					</el-input>
				</el-form-item>
				<el-form-item label='打板完成' prop='is_finish'>
					<el-radio-group v-model="form.is_finish">
						<el-tooltip content='选择是提交后，申请会提交到下个节点'>
							<el-radio :label="1">是</el-radio>
				    </el-tooltip>
				    <el-tooltip content='选择否提交后，申请仍会在待打板申请列表中'>
				    	<el-radio :label="0">否</el-radio>
				    </el-tooltip>
				  </el-radio-group>
				</el-form-item>
				<el-form-item :label='(form.is_finish?"":"预计")+"完成日期"' prop='finish_date'>
					<el-date-picker v-model='form.finish_date' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
				</el-form-item>
				<el-form-item label='单板说明' prop='remarks'>
					<el-input v-model='form.remarks' >
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
	import makeApi from '@/api/cg/colorSampleMake'
	import attachUpload from '@/components/common/attach/upload'
	import attachList from '@/components/common/attach/textList'

	const formInit = {
		id:null,
		sample_id:null,
		apply_id:null,
		input_status:0,
		supplier:'',
		is_finish:'',
		finish_date:'',
		remarks:''
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
					supplier:[{ required:true, message:'请填写打板厂家' }],
					finish_date:[{ required:true, message:'请填写完成日期' }],
					is_finish:[{ required:true, message:'请选择完成状态' }],
				},
				params:{
					no:null
				},
				updated:false,				
				attachParams:{
					table_name:'cg_color_sample_make',
					table_id:null
				}
			}
		},
		computed:{
			isEdit(){
				return this.form.id? true:false
			},
			title(){
				let title = '色样打板'
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
				makeApi.getForm(id).then(res=>{
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
				makeApi.create(this.form).then(res=>{
					this.initData(res.data)
					this.updated = true
					this.loading = false
				})
			},
			submit(){				
				this.$confirm('确定提交打板信息？','提示',{
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
							makeApi.update(this.form).then(res=>{
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