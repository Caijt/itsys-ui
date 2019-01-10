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
					<divider title='玻璃标签信息'></divider>					
					<el-form-item label='玻璃编号' prop='no'>
						<el-input v-model='form.no' placeholder=''>
						</el-input>
					</el-form-item>
					<el-form-item label='玻璃型号' prop='model'>
						<el-input v-model='form.model' placeholder=''>
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
					<el-form-item label='生产日期' prop='produce_date'>
						<el-date-picker v-model='form.produce_date' value-format='yyyy-MM-dd' style='width:100%'></el-date-picker>
					</el-form-item>
					<el-form-item label='生产序号' prop='sn'>
						<el-input v-model.number='form.sn' placeholder=''>
						</el-input>
					</el-form-item>
					<el-form-item label='流程单号' prop='flow_no'>
						<el-input v-model.number='form.flow_no' placeholder=''>
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
	import glassApi from '@/api/sc/glass'

	const formInit = {
		order_id:null,
		width:0,
		height:0,
		amount:0,
		product_date:''
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
					no:[{ required:true, message:'请填写窗号' }],
					sn:[
						{ type:'number',message:'请输入数字' },
						{ required:true, message:'请填写生产序号' }
					],
					model:[{	required:true,message:'请填写窗型' }],			
					produce_date:[{		required:true,message:'请填写生产日期' }]	,
					type:[{		required:true,message:'请选择生产类型' }]	,
					width:[
						{ type:'number',message:'请输入数字' },
						{	required:true,message:'请填写宽' },
						{ validator:a	}
					],
					height:[
						{ type:'number',message:'请输入数字' },
						{	required:true,message:'请填写高' },
						{ validator:a	}
					],
					amount:[
						{ type:'number',message:'请输入数字' },
						{ validator:a	},
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
				return this.isEdit?'编辑玻璃标签':'创建玻璃标签'
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
			open(data=null){
				// this.data = data
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
							glassApi.update(this.form).then(res=>{
								this.$message.success('更新成功')
								this.loading = false
								this.changed = true
								this.show = false
							})
						}else{
							glassApi.create(this.form).then(res=>{
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
			},					
			closeDialog(){
				if(this.changed){
					this.$emit('changed')
				}
			}			
		}
	}
</script>