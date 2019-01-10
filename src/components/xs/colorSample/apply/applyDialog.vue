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
			<divider title='色样信息'></divider>	
			<el-form label-width='85px' size='mini' class='c-form-text'>
				<el-form-item label='色样编号' class='no-border'>
					<span class='c-link'>{{ form.sample_no }}</span>
				</el-form-item>
				<el-form-item label='打样工厂'>
					<span>{{ form.factory_name }}</span>
				</el-form-item>
				<el-form-item label='寄出地址'>
					<span>{{ form.factory_address }}</span>
				</el-form-item>
			</el-form>
			<el-form 
				:model='form' :rules='rules' 
				ref='form' label-width='85px' 
				size='mini' status-icon
				class='c-form-mini'>
				<divider title='打样申请信息'></divider>	
					<el-form-item label='打样数量' prop='amount'>
						<el-input v-model.number='form.amount' placeholder='本次申请打样数量'>
						</el-input>
					</el-form-item>					
					<el-form-item label='快递信息' prop='express'>
						<el-input v-model='form.express' placeholder='填写发出的快递信息，例如：顺丰快递/1234567890'>
						</el-input>
					</el-form-item>
					<el-form-item label='申请备注' prop='remarks'>
						<el-input v-model='form.remarks' placeholder='本次申请打样备注'>
						</el-input>
					</el-form-item>	
					<divider title='寄回信息'></divider>	
					<el-form-item label='收件人' prop='receiver'>
						<el-input v-model='form.receiver' placeholder='填写色样寄回的联系收件人'>
						</el-input>
					</el-form-item>
					<el-form-item label='联系电话' prop='receive_tel'>
						<el-input v-model='form.receive_tel' placeholder='填写色样寄回的联系电话'>
						</el-input>
					</el-form-item>
					<el-form-item label='收件地址' prop='receive_address'>
						<el-input v-model='form.receive_address' placeholder='填写色样寄回的联系地址'>
						</el-input>
					</el-form-item>
			</el-form>
		</div>
			<span slot="footer">
			 	<el-button type='primary' @click='submit' :loading='loading'>提交</el-button>
		    <el-button @click="show=false">关 闭</el-button>
	  	</span>
		</el-dialog>
	</div>
</template>
<script>
	import applyApi from '@/api/xs/colorSampleApply'

	const formInit = {
		id:null,
		sample_id:null,
		no:'',
		input_status:0,
		amount:1,
		remarks:'',
		express:'',
		receive_address:'',
		receive_tel:'',
		receiver:''
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
				form:{ ...formInit },
				rules:{
					express:[{ required:true, message:'请填写快递信息' }],
					salesman:[{ required:true, message:'请填写业务员' }],
					amount:[
						{ required:true, message:'请填写色样申请数量' },
						{ type:'number',message:'请输入数字' },
						{ 
							validator:(rule,value,callback)=>{
								if(value<=0){
									callback(new Error('必须大于0'))
								}else{
									callback()
								}
							}
						}
					]
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
				let title = '色板打样申请'
				if(this.isEdit){
					title += ' [ '+this.form.no+' ]'
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
			submit(){				
				this.$confirm('确定提交打样申请？','提示',{
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
							applyApi.update(this.form).then(res=>{
								this.loading = false
								this.$message.success(messageText)
								this.updated = true
								if(this.form.input_status==1){
									this.show=false
								}
							})
						}else{
							applyApi.create(this.form).then(res=>{
								this.form.id = res.data.id
								this.form.no = res.data.no
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
			closeDialog(){	
				if(this.updated){
					this.$emit('updated')
				}
				this.resetFields()
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
			resetFields(){
				this.updated = false
				this.form = {...formInit}
				this.clearValidate()
				return this
			}
		}
	}
</script>