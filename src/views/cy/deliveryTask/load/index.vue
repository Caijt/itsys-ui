<template>
	<div>
		<el-alert title='运营中心提交发货任务后，储运中心对发货任务的产品进行分配装车，所以一个发货任务可能由一个或多个不同的车辆进行发货。' type='warning' style='margin-bottom: 10px'></el-alert>
		<el-tabs v-model='tabName' @tab-click='reload'>
			<el-tab-pane label='待装车任务' name='toLoad'>
				<task-list ref='toLoadList' :params='toLoadListParams' init hide-edit-field sort-prop='submit_time'>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='90'>
						<template slot-scope='scope'>
							<el-button  size='mini' type='text' @click='details(scope.row)'>详情</el-button>
							<el-button  size='mini' type='text' @click='load(scope.row)'>装车</el-button>
						</template>
					</el-table-column>
				</task-list>
			</el-tab-pane>
			<el-tab-pane label='已完成装车任务' name='loadFinish'>
				<task-list ref='loadFinishList' :params='loadFinishListParams' init hide-edit-field show-load-finish-field sort-prop='load_finish_time'>
					<el-table-column slot='column' label='操作'  fixed='right' align='center' width='60'>
						<template slot-scope='scope'>
							<el-button  size='mini' type='text' @click='undoLoadFinish(scope)'>撤销</el-button>
						</template>
					</el-table-column>
				</task-list>
			</el-tab-pane>
			<el-tab-pane label='已提交车辆' name='car'>
				<el-alert title='以下为已提交的发货车辆' type='warning' style='margin-bottom: 10px'></el-alert>
				<car-list ref='carList' hide-edit-field :params='{input_status:1,inFactory:1}'>
					<el-table-column slot='column' fixed='right' label='操作' align='center' width='130'>
						<template slot-scope='scope'>
							<el-button type='text' @click='supply(scope)'>补充</el-button>
							<el-button type='text' @click='undo(scope)'>撤销</el-button>
							<el-button type='text' @click='printCar(scope)'>打印</el-button>
						</template>
					</el-table-column>
				</car-list>
			</el-tab-pane>
		</el-tabs>
		<task-dialog ref='taskDialog' @updated='reload'></task-dialog>
		<task-details ref='taskDetails'>
			<div slot='footer' slot-scope='{data}' v-if='Number(data.cy_load_area_total) > Number(data.product_area_total)'>
				<el-button type='primary' @click='load(data)' >装车</el-button>
			</div>
		</task-details>
		<print ref='print' />
		<driver-supply ref='driverSupply' @updated='reload'/>
	</div>
</template>
<script>
	import list from '@/components/cy/deliveryTask/list'	
	import carApi from '@/api/cy/deliveryCar'
	import taskList from '@/components/yyzx/deliveryTask/edit/editList'
	import taskDialog from '@/components/cy/deliveryTask/car/taskDialog'
	import taskDetails from '@/components/yyzx/deliveryTask/details'
	import carList from '@/components/cy/deliveryTask/car/list'
	import print from '@/components/cy/deliveryTask/car/print'	
	import driverSupply from '@/components/cy/deliveryTask/car/driverSupply'

	export default {
		components:{
			list,
			taskList,
			taskDialog,
			taskDetails,
			carList,
			print,
			driverSupply
		},
		data(){
			return {
				tabName:'toLoad',
				toPurchaseOrderTotal:0,
				toOrderProjectLoading:true,
				toLoadListParams:{
					toLoad:1,
					inFactory:1
				},
				loadFinishListParams:{
					loadFinish:1,
					inFactory:1
				}
			}
		},
		mounted(){
			
		},
		methods:{	
			reload(){
				if(this.$refs.taskDetails.show){
					this.$refs.taskDetails.reload()
				}
				this.$refs[this.tabName+'List'].reload()
			},
			load(row){
				this.$refs.taskDialog.open().then(that=>{
					that.initData(row)
				})
			},
			details(row){
				this.$refs.taskDetails.open().then(that=>{
					that.initData(row)
				})
			},
			undo(scope){
				this.$refs.carList.undo(scope)
			},
			supply(scope){
				this.$refs.driverSupply.open().then(that=>{
					let data = this.$commonJs.obj.copyByKey(scope.row,[
						'id','driver_unit','driver_no','driver_name','driver_tel'])
					that.initData(data)
				})
			},
			printCar(scope){
				this.$refs.print.open().then(that=>{
					that.get(scope.row.id)
				})
			},
			undoLoadFinish({row}){
				this.$confirm('你确定要撤销该发货任务的装车完成操作吗？','提示',{
	        type: 'warning'
	      }).then(()=>{
	        carApi.undoLoadFinish(row.id).then(res=>{
	          this.$message.success('撤销成功')
	          this.reload()
	        })
	      })
			}
		}
	}
</script>