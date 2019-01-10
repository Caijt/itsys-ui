<template>
	<div v-loading='loading'>
		<el-form 
			:model='form' :rules='rules' ref='form' class='c-form-mini'
			label-width='90px' size='mini' status-icon>
			<divider title='发货记录'></divider>
			<el-alert :title='"当前记录最大可发货面积为 "+maxDeliveryArea+" ㎡"' type='warning' style='margin-bottom:10px'></el-alert>
			<el-form-item label='发货面积' prop='delivery_area'>
				<el-input  v-model.number='form.delivery_area'>
					<span slot="suffix">㎡</span>
				</el-input>
			</el-form-item>
			<el-form-item label='发货日期' prop='delivery_date'>
				<el-date-picker v-model='form.delivery_date' value-format='yyyy-MM-dd' style='width:100%'></el-date-picker>
			</el-form-item>
			<el-form-item label='发货内容' prop='delivery_content'>
				<el-input  v-model='form.delivery_content'></el-input>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
	import deliveryApi from '@/api/cy/delivery'
	const formInit = {
		order_id:null,
		project_id:null,//项目id
		contract_id:null,
		no_delivery_total:'',

		id:null,
		delivery_area:0,
		delivery_date:new Date(),
		delivery_content:''
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
				loading:false,
				form:{ ...formInit },
				maxDeliveryArea:0,
				rules:{
					order_id:[{ required:true, message:'请选择订单' }],
					delivery_area:[{	type:'number', message:'请输入数字'},
					{
						validator:(rule,value,callback)=>{
							if(value <= 0){
								callback(new Error('发货面积必须大于0'))
							}else if(value > Number(this.maxDeliveryArea)){
								callback(new Error('发货面积已超出最大入库面积'))
							}else{
								callback()
							}
						}
					}],
					delivery_date:[{ required:true, message:'请填写发货日期'}]
				},
			}
		},
		computed:{
			//表单是否是编辑状态
			isEdit(){
				return this.form.id!=null
			}
		},
		created(){
			
		},
		methods:{			
			get(id){
				this.loading = true
				deliveryApi.getForm(id).then(res=>{
					this.assign(res.data)
					this.loading = false
				})
			},
			//对表单的数据赋值
			assign(data){
				this.form = { ...this.form, ...data }
				this.form.delivery_area=Number(this.form.delivery_area)
				this.maxDeliveryArea = (this.form.delivery_area + Number(this.form.no_delivery_area)).toFixed(2)
				this.clearValidate()
			},
			//保存
			save() {
				return new Promise(( resolve,reject )=>{
					this.$refs.form.validate(vaild=>{
						if(vaild){
							if(this.isEdit){						
								deliveryApi.update(this.form).then(res=>{
									this.$message.success('更新成功')
									this.$emit('updated')
									this.$emit('saved')
									resolve('updated')
								})
							}else{						
								deliveryApi.create(this.form).then(res=>{
									this.$message.success('创建成功')
									this.$emit('created')
									this.$emit('saved')
									resolve('created')
								})
							}
							resolve()
						}else{
							reject()
						}
					})
				})
			},
			clearValidate(){
				this.$nextTick(()=>{
					this.$refs.form.clearValidate()
				})
			},
			resetFields(){
				this.form = {...formInit}
				this.clearValidate()
			}			
		}
	}
</script>