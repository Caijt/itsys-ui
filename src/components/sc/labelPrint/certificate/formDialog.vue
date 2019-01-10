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
				<el-form :model='form' :rules='rules' ref='form' label-width='100px' size='mini'  status-icon class='c-form-mini'>
					<divider title='合格证信息'></divider>
					<el-form-item label='产品名称' prop='product_name'>
						<el-input v-model='form.product_name' placeholder=''>
						</el-input>
					</el-form-item>
					<el-form-item label='产品编号' prop='product_no'>
						<el-input v-model='form.product_no' placeholder=''>
						</el-input>
					</el-form-item>
					<el-row :gutter='10'>
						<el-col :span='12'>
							<el-form-item label='尺寸（宽）' prop='width'>
								<el-input v-model.number='form.width' placeholder=''>
									<span slot="suffix">mm</span>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span='12'>
							<el-form-item label='尺寸（高）' prop='height'>
								<el-input v-model.number='form.height' placeholder=''>
									<span slot="suffix">mm</span>
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-form-item label='数量' prop='amount'>
						<el-input v-model.number='form.amount' placeholder=''>
						</el-input>
					</el-form-item>
					<el-form-item label='备注' prop='remarks'>
						<el-input v-model='form.remarks' placeholder=''>
						</el-input>
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer">
		    <el-button @click="save" type="primary"  size='small' :loading='loading'>{{ buttonText }}</el-button>		   
		    <el-button @click="show=false" size='small'>关 闭</el-button>
		  </span>
		</el-dialog>		
	</div>
</template>

<script>
	import certificateApi from '@/api/sc/certificate'

	const formInit = {
		order_id:null,
		product_name:'',
		product_no:'',		
		area_id:'',
		width:0,
		height:0,
		amount:0,
		remarks:''
	}
	export default {
		components:{ },
		props:{
			inDialog:{
				type:Boolean,
				default:false
			}
		},
		data(){
			let a	=	(rule,value,callback)=>{
				if(value<=0){
					callback(new Error('必须大于0'))
				}else{
					callback()
				}
			}
			return {
				changed:false,
				show:false,
				data:null,
				loading:false,
				form:{ ...formInit },
				rules:{					
					product_name:[{ required:true, message:'请填写产品名称' }],
					product_no:[{	required:true,message:'请填写产品编号' }],	
					width:[
						{ type:'number',message:'请输入数字' },
						{	required:true,message:'请填写宽' },
						{ 
							validator:a
						}
					],
					height:[
						{ type:'number',message:'请输入数字' },
						{	required:true,message:'请填写高' },
						{ 
							validator:a
						}
					],
					amount:[
						{ type:'number',message:'请输入数字' },
						{ 
							validator:a
						},
						{	required:true,message:'请填写高' },
					],
				},
				areaList:[]
			}
		},
		computed:{
			isEdit(){
				return this.form.id!=null
			},
			title(){
				return this.isEdit?'编辑合格证':'创建合格证'
			},
			buttonText(){
				return this.isEdit?'更新':'创建'
			}			
		},
		mounted(){

		},
		methods:{
			openDialog(){
				this.changed = false
				this.loading = false
				this.$nextTick(()=>{
					this.clearValidate()
				})
			},
			closeDialog(){
				if(this.changed){
					this.$emit('changed')
				}
			},
			open(){
				this.show = true
			},
			//清除字段检验信息
			clearValidate(){
				this.$nextTick(()=>{
					this.$refs.form && this.$refs.form.clearValidate()
				})				
			},
			//重置字段
			resetFields(){
				this.form = { ...formInit }
				this.clearValidate()
				return this
			},
			assign(data){
				this.form = { ...this.form, ...data }
				this.form.width = Number(this.form.width)
				this.form.height = Number(this.form.height)
				return this
				// this.clearValidate()
			},
			//保存
			save() {
				this.$refs.form.validate(vaild=>{
					if(vaild){
						this.loading = true
						if(this.isEdit){						
							certificateApi.update(this.form).then(res=>{
								this.$message.success('更新成功')
								this.loading = false
								this.changed = true
								this.show = false
							})
						}else{
							certificateApi.create(this.form).then(res=>{
								this.$message.success('创建成功')
								this.loading = false
								this.changed = true
								this.show = false
							})
						}
					}else{
						return false
					}
				})
			}
					
		}
	}
</script>