<template>
	<div v-loading='loading'>
		<el-form 
			:model='form' 
			:rules='rules' 
			ref='form' 
			label-width='85px' 
			size='mini' 
			class='c-form-mini' 
			status-icon>
			<divider title='生产记录'></divider>
			<el-alert :title='"当前记录最大可生产面积为 "+maxProductArea+" ㎡"' type='warning' style='margin-bottom:10px'></el-alert>
			<el-form-item label='生产面积' prop='finish_area'>
				<el-input  v-model.number='form.finish_area'>
					<span slot="suffix">㎡</span>
				</el-input>
			</el-form-item>
			<el-form-item label='生产日期' prop='product_date'>
				<el-date-picker v-model='form.product_date' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
			</el-form-item>
			<el-form-item label='备注' prop='remarks'>
				<el-input v-model='form.remarks'></el-input>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
	import productApi from '@/api/sc/outProduct'
	const formInit = {
		order_no:'',
		order_id:null,
		project_id:null,//项目id
		project_name:'',//项目名称
		project_no:'',
		contract_no:'',	//合同编号
		order_type:'',
		order_batch:'',
		order_area:'',
		
		id:null,
		finish_area:0,
		series:'',
		model:'',
		window_style:'',
		product_status:'',
		product_date:new Date(),
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
				orderTypeLoading:true,
				form:{ ...formInit },
				maxProductArea:0,
				rules:{
					order_id:[{ required:true, message:'请选择订单' }],
					product_date:[{ required:true, message:'请填写生产日期' }],
					finish_area:[
					{ required:true, message:'请填写生产面积' },
					{	type:'number', message:'请输入数字'},
					{
						validator:(rule,value,callback)=>{
							if(value <= 0){
								callback(new Error('生产面积必须大于0'))
							}else if(value > Number(this.maxProductArea)){
								callback(new Error('生产面积已超出最大可生产面积'))
							}else{
								callback()
							}
						}
					}]
				}
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
				productApi.getForm(id).then(res=>{
					this.assign(res.data)
					this.loading = false
				})
			},
			assign(data){
				this.form = { ...this.form, ...data }
				this.form.finish_area=Number(this.form.finish_area)
				this.maxProductArea = this.form.finish_area + Number(data.no_product_area)
				this.clearValidate()
			},
			//保存
			save() {
				return new Promise(( resolve,reject )=>{
					this.$refs.form.validate(vaild=>{
						if(vaild){
							if(this.isEdit){						
								productApi.update(this.form).then(res=>{
									this.$message.success('更新成功')
									this.$emit('updated')
									this.$emit('saved')
									resolve('updated')
								})
							}else{						
								productApi.create(this.form).then(res=>{
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
			},
			openSummaryDialog(){
				this.$refs.summaryDialog.open({toProduct:1})
			},
			selectProject({row}){
				let data = this.$commonJs.obj.copyByKey(row,[
					'order_id','order_no','order_type','order_batch','order_area','order_amount','order_date','order_delivery_date',
					'project_id','project_name','project_no','contract_no','plan_id','self_area','self_amount'
				])
				this.assign(data)	
				this.$refs.summaryDialog.close()
			}
		}
	}
</script>