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
					:model='form' :rules='rules' ref='form' class='c-form-mini' status-icon>
					<divider title='生产日志'></divider>
					<el-form-item label='生产日期' prop='produce_date'>
						<el-date-picker v-model='form.produce_date' value-format='yyyy-MM-dd' style='width:100%'></el-date-picker>
					</el-form-item>
					<el-form-item :label='"生产数量（最大生产数量："+form.max_input_amount+"樘）"' prop='produce_amount'>
						<el-input v-model.number='form.produce_amount' placeholder=''>
							<span slot="suffix">樘</span>
						</el-input>
					</el-form-item>
					<el-form-item :label='"生产面积（最大生产面积："+form.max_input_area+"㎡）"' prop='produce_area'>
						<el-input v-model.number='form.produce_area' placeholder=''>
							<span slot="suffix">㎡</span>
						</el-input>
					</el-form-item>
				</el-form>			
			</div>
			<span slot="footer">
		    <el-button type='primary' @click='submit' v-loading='loading'>提交</el-button>
		    <el-button @click="show=false">关 闭</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	import produceLogApi from '@/api/sc/produceLog'

	const formInit = {
		id:null,
		product_ids:'',
		produce_date:'',
		produce_amount:'',
		produce_area:''
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
			let validator1 = (rule,value,callback)=>{
				if(value > this.form.max_input_amount){
					callback(new Error('生产数量已大于最大生产数量'))
				}else{
					callback()
				}
			}
			let validator2 = (rule,value,callback)=>{
				if(value > this.form.max_input_area){
					callback(new Error('生产面积已大于最大生产面积'))
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
					produce_date:[{	required:true,message:'请填写订单日期' }],
					produce_amount:[
						{ required:true,message:'请填写生产数量' },
						{ type:'number',message:'请输入数字' },
						{ validator:validator1 },
					],
					produce_area:[
						{ required:true,message:'请填写生产面积' },
						{ type:'number',message:'请输入数字' },
						{ 
							validator:(rule,value,callback)=>{
								if(value<=0){
									callback(new Error('必须大于0'))
								}else{
									callback()
								}
							}
						},
						{ 
							validator:validator2
						}
					],
				}
			}
		},
		computed:{
			isEdit(){
				return this.form.id!=null
			},
			title(){
				return '生产日志修改'
			},
			productParams(){
				let order_id = this.form.order_id
				let product_ids = this.form.product_ids
				return {
					order_id,
					product_ids
				}
			}
		},
		mounted(){
		},
		methods:{
			openDialog(){
				this.changed = false
				this.$nextTick(()=>{
					this.clearValidate()
				})
			},
			closeDialog(){
				this.loading = false
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
				this.form.produce_area = Number(this.form.produce_area)
				return this
			},	
			get(id){
				this.loading = true
				produceLogApi.getLogForm(id).then(res=>{
					this.assign(res.data)
					this.loading = false
					this.clearValidate()
				})
				return this
			},		
			//保存
			submit() {
				this.$refs.form.validate(vaild=>{
					if(vaild){							
						this.loading = true
						produceLogApi.update(this.form).then(res=>{
							this.$message.success('修改成功')
							this.loading = false
							this.changed = true
							this.show = false
						})											
					}else{
						return false
					}
				})
			},			
			editProduct(row){
				this.$refs.productFormDialog.assign(row).open()
			},
			delProduct({row,$index}){
				this.$refs.productList.list.splice($index,1)
			}
		}
	}
</script>