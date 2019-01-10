<template>
<div>
	<el-dialog 
		:title='title'
		class='c-dialog-fixed'
		:visible.sync='show'
		:append-to-body='inDialog'
		width='80%'
		@open='openDialog'
		@close='closeDialog'>
		<div v-loading='loading'>
			<divider title='发货任务信息'></divider>
			<el-row :gutter='10'>
				<el-col :span='24'>
					<el-form label-width='85px' size='mini' class='c-form-text'>
						<el-row :gutter='10'>
							<el-col :span='8'>
								<el-form-item label='任务编号' class='no-border'>
									<span class='c-link' @click='openTaskDetails'>{{ form.no }}</span>
								</el-form-item>
							</el-col>
							<el-col :span='8'>
								<el-form-item label='发货工厂'>
									<span>{{ form.area_name }}</span>
								</el-form-item>
							</el-col>
							<el-col :span='24'>
								<el-form-item label='项目名称'>
									<span>{{ form.project }}</span>
								</el-form-item>
							</el-col>
							<el-col :span='24'>
								<el-form-item label='收货单位'>
									<span>{{ form.receive_unit }}</span>
								</el-form-item>
							</el-col>
							<el-col :span='24'>
								<el-form-item label='收货地址'>
									<span>{{ form.receive_address }}</span>
								</el-form-item>
							</el-col>
							<el-col :span='8'>
								<el-form-item label='收货人'>
									<span>{{ form.receive_name }}</span>
								</el-form-item>
							</el-col>
							<el-col :span='8'>
								<el-form-item label='联系电话'>
									<span>{{ form.receive_tel }}</span>
								</el-form-item>
							</el-col>
							<el-col :span='8'>
								<el-form-item label='交付方式'>
									<span>{{ form.method }}</span>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
				</el-col>
				<!-- <el-col :span='5' style='text-align: center'>
					<div style='margin-bottom: 5px;color:#999'>装车进度</div>
					<el-tooltip :content='form.cy_load_area_total+"㎡（已装车面积） / "+form.product_area_total+"㎡（产品面积）"'>
						<el-progress 
							type="circle" 
							:percentage="Number(form.load_progress)"
							:stroke-width='10'>
						</el-progress>
					</el-tooltip>
				</el-col> -->
			</el-row>
			<divider title='发货车辆' style='margin-top:10px'></divider>
			<el-tabs v-model='tabName' @tab-click='carReload'>
				<el-tab-pane label='编辑' name='edit' @tab-click='carReload'>
					<car-list in-dialog ref='editList' :params='{ input_status:0,inUser:1 }' no-page hide-query hide-submit-field hide-task-field>
						<el-table-column slot='column' fixed='right' label='操作' align='center' width='130'>
							<template slot-scope='scope'>
								<el-tooltip content='打印发货签收单'>
									<el-button type='text' @click='printCar(scope)'>打印</el-button>
								</el-tooltip>								
								<el-button type='text' @click='editCar(scope)'>编辑</el-button>
								<el-button type='text' @click='delCar(scope)'>删除</el-button>
							</template>
						</el-table-column>
					</car-list>
				</el-tab-pane>
				<el-tab-pane label='已提交' name='submit'>
					<car-list 
						in-dialog
						ref='submitList' 
						sort-prop='submit_time'
						:params='{ input_status:1 }' 
						no-page hide-query hide-edit-field hide-task-field
						@undo='carUpdated'>
						<el-table-column slot='column' fixed='right' label='操作' align='center' width='130'>
							<template slot-scope='scope'>
								<el-button type='text' @click='supply(scope)'>补充</el-button>
								<el-button type='text' v-show='scope.row.create_user_id==$store.state.user.id' @click='undo(scope)'>撤销</el-button>
								<el-tooltip content='打印发货签收单'>
									<el-button type='text' @click='printCar(scope)'>打印</el-button>
								</el-tooltip>	
							</template>
						</el-table-column>
					</car-list>
				</el-tab-pane>
			</el-tabs>
		</div>
		<span slot="footer">
		 	<el-button type='primary' @click='addCar' :loading='loading'>添加车辆</el-button>
		 	<el-tooltip content='如果该发货任务已完成装车操作，请点击此按钮结束装车'>
		 		<el-button type='success' @click='loadFinish' :loading='loading'>装车完成</el-button>
		 	</el-tooltip>
	    <el-button @click="show=false">关 闭</el-button>
  	</span>
	</el-dialog>
	<edit-dialog :order-list='orderList' ref='editDialog' @updated='carUpdated'></edit-dialog>
	<print ref='print' />
	<driver-supply ref='driverSupply' @updated='carUpdated'/>
	<task-details ref='taskDetails'/>
</div>
</template>
<script>
	import carApi from '@/api/cy/deliveryCar'
	import editDialog from './editDialog'
	import carList from './list'
	import print from './print'	
	import driverSupply from './driverSupply'
	import taskDetails from '@/components/yyzx/deliveryTask/details'

	const formInit = {
		id:null,
		no:'',
		input_status:0,
		load_progress:0
	}
	export default {
		components:{ 
			editDialog,
			carList,
			print,
			driverSupply,
			taskDetails
		},
		props:{
			inDialog:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return {
				tabName:'submit',
				resolve:null,
				show:false,
				loading:false,
				updated:false,
				data:{ },				
				form:{ ...formInit },
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
				let title = '发货任务装车'
				if(this.isEdit){
					title += ' [ '+this.form.no+' ]'
				}
				return title
			},
			orderList(){
				return this.form.order_no?this.form.order_no.split(','):[]
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
				carApi.getTaskForm(id).then(res=>{
					this.initData(res.data)
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
			saved(){
				this.show=false
				this.$emit('saved')
			},
			closeDialog(){	
				this.tabName = 'submit'
				if(this.updated){
					this.$emit('updated')
				}
				this.$refs.submitList.clear()
				this.$refs.editList.clear()
				this.resetFields()
				this.loading = false
			},
			initData(data){
				this.assign(data)
				this.$refs.editList.initParams = { task_id:data.id }
				this.$refs.submitList.initData({task_id:data.id})
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
			addCar(){
				this.$refs.editDialog.open().then(that=>{
					that.create( { task_id:this.form.id } )
				}).catch(res=>{
					console.log(res)
				})
			},
			editCar({row}){
				this.$refs.editDialog.open().then(that=>{
					that.getForm(row.id)
				})
			},
			delCar(scope){
				this.$refs.editList.del(scope)
			},
			printCar(scope){
				this.$refs.print.open().then(that=>{
					that.get(scope.row.id)
				})
				//this.$refs.carList.del(scope)
			},
			carUpdated(){
				this.updated = true
				this.carReload()
				this.summaryReload()
			},
			carReload(){
				this.$refs[ this.tabName +'List'].reload()
			},
			summaryReload(){
				carApi.getSummaryData({input_status:1,task_id:this.form.id}).then(res=>{
					this.form.cy_load_area_total = res.data.area_total
					this.form.load_progress = this.$commonJs.round(Number(this.form.cy_load_area_total)/Number(this.form.product_area_total)*100)
				})
			},
			undo(scope){
				this.$refs.submitList.undo(scope)
			},
			supply(scope){
				this.$refs.driverSupply.open().then(that=>{
					let data = this.$commonJs.obj.copyByKey(scope.row,[
						'id','driver_unit','driver_no','driver_name','driver_tel'])
					that.initData(data)
				})
			},
			loadFinish(){
				this.$confirm('您确定要完成此发货的装车环节吗？结束后将无法再添加发货车辆。','提示',{
					type: 'warning'
				}).then(()=>{
					this.loading = true
					carApi.loadFinish(this.form.id).then(res=>{
						this.$message.success('此发货任务装车已完成')
						this.loading = false
						this.updated = true
						this.show = false
					}).catch(()=>{
						this.loading = false
					})
				})
			},
			openTaskDetails(){
				this.$refs.taskDetails.open().then(that=>{
					that.get(this.form.id)
				})
			}
		}
	}
</script>