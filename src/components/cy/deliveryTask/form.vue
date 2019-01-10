<template>
	<div v-loading='loading'>
		<el-form 
			:model='form' :rules='rules' ref='form' class='c-form-mini'
			label-width='90px' size='mini' status-icon>
			<divider title='发货车辆'></divider>
			<el-alert title='填写发货车辆司机信息' type='warning' style='margin-bottom:10px'></el-alert>
			<el-form-item label='车辆标记' prop='sign'>
				<el-input  v-model='form.sign' placeholder='根据发货任务编号及标记生成发货车辆编号'></el-input>
			</el-form-item>
			<el-form-item label='车辆单位' prop='unit'>
				<el-input  v-model='form.unit'></el-input>
			</el-form-item>
			<el-form-item label='车牌号码' prop='no'>
				<el-input  v-model='form.no'></el-input>
			</el-form-item>
			<el-form-item label='司机姓名' prop='name'>
				<el-input  v-model='form.name'></el-input>
			</el-form-item>
			<el-form-item label='司机手机' prop='tel'>
				<el-input  v-model='form.tel'></el-input>
			</el-form-item>
			<el-form-item label='发货订单' prop='orders'>
				<el-input  v-model='form.orders'></el-input>
				<el-button type='text' size='mini' @click='form.orders=form.order_no'>加载任务订单</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
	import deliveryCarApi from '@/api/cy/deliveryCar'
	const formInit = {
		order_id:null,
		project_id:null,//项目id
		contract_id:null,
		no_delivery_total:'',

		id:null,
		delivery_area:0,
		delivery_date:'',
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
				rules:{
					task_id:[{ required:true, message:'请选择发货任务' }],
					sign:[{ required:true, message:'请选择车辆标记' }],
					orders:[{ required:true, message:'请填写车辆发货订单号' }]
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
				deliveryCarApi.getForm(id).then(res=>{
					this.assign(res.data)
					this.loading = false
				})
			},
			//对表单的数据赋值
			assign(data){
				this.form = { ...this.form, ...data }
				
				this.clearValidate()
			},
			//保存
			save() {
				return new Promise(( resolve,reject )=>{
					this.$refs.form.validate(vaild=>{
						if(vaild){
							if(this.isEdit){						
								deliveryCarApi.update(this.form).then(res=>{
									this.$message.success('更新成功')
									this.$emit('updated')
									this.$emit('saved')
									resolve('updated')
								})
							}else{						
								deliveryCarApi.create(this.form).then(res=>{
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