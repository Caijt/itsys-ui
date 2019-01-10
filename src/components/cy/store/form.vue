<template>
	<div v-loading='loading'>
		<el-form 
			:model='form' :rules='rules' ref='form' class='c-form-mini'
			label-width='95px' size='mini' status-icon>
			<divider title='入库记录'></divider>
			<el-alert :title='"当前记录最大可入库面积为 "+maxStorageArea+" ㎡"' type='warning' style='margin-bottom:10px'></el-alert>
			<el-form-item label='入库面积' prop='storage_area'>
				<el-input  v-model.number='form.storage_area'>
					<span slot="suffix">㎡</span>
				</el-input>
			</el-form-item>
			<el-form-item label='入库日期' prop='storage_date'>
				<el-date-picker v-model='form.storage_date' value-format='yyyy-MM-dd' style='width:100%'></el-date-picker>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
	import storeApi from '@/api/cy/store'
	const formInit = {
		order_id:null,
		project_id:null,//项目id
		contract_id:null,
		finish_area_total:'',
		no_area_total:'',

		id:null,
		storage_area:0,
		storage_date:new Date()
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
				maxStorageArea:0,
				rules:{
					order_id:[{ required:true, message:'请选择订单' }],
					storage_area:[{	type:'number', message:'请输入数字'},
					{
						validator:(rule,value,callback)=>{
							if(value <= 0){
								callback(new Error('入库面积必须大于0'))
							}else if(value > Number(this.maxStorageArea)){
								callback(new Error('入库面积已超出最大入库面积'))
							}else{
								callback()
							}
						}
					}],
					storage_date:[{ required:true, message:'请填写入库日期'}]
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
				storeApi.getForm(id).then(res=>{
					this.assign(res.data)
					this.loading = false
				})
			},
			assign(data){
				this.form = { ...this.form, ...data }
				this.form.storage_area=Number(this.form.storage_area)
				this.maxStorageArea = (this.form.storage_area + Number(this.form.no_storage_area)).toFixed(2)
				this.clearValidate()
			},
			//保存
			save() {
				return new Promise(( resolve,reject )=>{
					this.$refs.form.validate(vaild=>{
						if(vaild){
							if(this.isEdit){						
								storeApi.update(this.form).then(res=>{
									this.$message.success('更新成功')
									this.$emit('updated')
									this.$emit('saved')
									resolve('updated')
								})
							}else{						
								storeApi.create(this.form).then(res=>{
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