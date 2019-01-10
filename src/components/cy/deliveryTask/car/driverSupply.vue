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
				:model='form' ref='form' label-width='85px' 
				size='mini' status-icon
				class='c-form-mini'>
				<divider title='司机信息'></divider>	
				<el-form-item label='车辆单位' prop='driver_unit'>
					<el-input v-model='form.driver_unit' placeholder=''>
					</el-input>
				</el-form-item>	
				<el-form-item label='车牌号码' prop='driver_no'>
					<el-input v-model='form.driver_no' placeholder=''>
					</el-input>
				</el-form-item>	
				<el-form-item label='司机姓名' prop='driver_name'>
					<el-input v-model='form.driver_name' placeholder=''>
					</el-input>
				</el-form-item>
				<el-form-item label='联系电话' prop='driver_tel'>
					<el-input v-model='form.driver_tel' placeholder=''>
					</el-input>
				</el-form-item>	
			</el-form>
		</div>
			<span slot="footer">
			 	<el-button @click='submit' type='primary' :loading='loading'>提交</el-button>
		    <el-button @click="show=false">关 闭</el-button>
	  	</span>
		</el-dialog>
	</div>
</template>
<script>
	import carApi from '@/api/cy/deliveryCar'	

	const formInit = {
		id:null,
		driver_unit:'',
		driver_name:'',
		driver_no:'',
		driver_tel:''
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
				updated:false,				
			}
		},
		computed:{
			isEdit(){
				return this.form.id? true:false
			},
			title(){
				let title = '发货司机信息补充'
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
				carApi.getForm(id).then(res=>{
					this.initData(res.data)
					this.loading = false
				})
			},
			submit(){
				this.$refs.form.validate(valid=>{
					if(valid){
						this.update()
					}else{
						return false
					}
				})
			},
			update(){
				this.loading = true
				carApi.driverSupply(this.form).then(res=>{
					this.form.no = res.data
					this.updated = true
					this.loading = false
					this.$message.success('保存成功')	
					this.show=false							
				}).catch(res=>{
					this.loading = false
					console.log(res)
				})
			},
			closeDialog(){	
				if(this.updated){
					this.$emit('updated')
				}
				this.loading = false
				this.resetFields()
			},
			initData(data){
				this.assign(data)
				this.clearValidate()
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
			},
			addProduct(){
				this.$refs.productListDialog.open().then(that=>{
					that.initData({
						task_id:this.form.task_id,
						not_car_id:this.form.id
					})
				})
			},
			editProduct(ids){
				this.$refs.productListDialog.open().then(that=>{
					that.initData({
						car_product_ids:ids
					})
				})
			},
			batchEditProduct(){
				let ids = this.$refs.productList.selectionList.map(item=>{
					return item.car_product_id
				})
				if(ids.length==0){
					this.$message.error('请选择产品，勾选列表前面的复选框！')
					return false
				}
				this.$refs.productListDialog.open().then(that=>{
					that.initData({
						car_product_ids:ids.join(',')
					})
				})
			},
			productUpdated(){
				this.updated = true
				this.$refs.productList.reload()
			},
			remove(scope){
				this.$refs.productList.remove(scope)
			}
		}
	}
</script>