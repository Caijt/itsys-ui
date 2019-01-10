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
			<divider title='样品收件地址'></divider>
			<el-form class='c-form-text' label-width='80px'>
				<el-form-item label='收件人'>
					<span>{{ form.receiver }}</span>
				</el-form-item>
				<el-form-item label='联系手机'>
					<span>{{ form.receive_tel }}</span>
				</el-form-item>
				<el-form-item label='收件地址'>
					<span>{{ form.receive_address }}</span>
				</el-form-item>
			</el-form>
			<el-form 
				:model='form' :rules='rules' 
				ref='form' label-width='85px' 
				size='mini' status-icon
				class='c-form-mini'>
				<divider title='色样寄出信息'></divider>
				<el-form-item label='快递信息' prop='delivery_express'>
					<el-input v-model='form.delivery_express' placeholder='填写样品寄出快递信息，例如：顺丰快递/1234567890'>
					</el-input>
				</el-form-item>
				<el-form-item label='寄出日期' prop='delivery_date'>
					<el-date-picker v-model='form.delivery_date' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
				</el-form-item>
				<el-form-item label='寄出说明' prop='delivery_remarks'>
					<el-input v-model='form.delivery_remarks' >
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
	import deliveryApi from '@/api/yyzx/colorSampleDelivery'
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
					delivery_express:[{ required:true, message:'请填写寄出快递信息' }],
					delivery_date:[{ required:true, message:'请填写寄出日期' }]
				},
				params:{
					no:null
				},
				updated:false,				
				attachParams:{
					table_name:'yyzx_color_sample_delivery',
					table_id:null
				}
			}
		},
		computed:{
			isEdit(){
				return this.form.id? true:false
			},
			title(){
				let title = '色样寄出'
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
				deliveryApi.getForm(id).then(res=>{
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
				deliveryApi.create(this.form).then(res=>{
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
							deliveryApi.update(this.form).then(res=>{
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