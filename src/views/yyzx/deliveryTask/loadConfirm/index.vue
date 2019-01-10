<template>
	<div>
		<el-alert title='以下是储运中心已完成装车的发货任务，可能会出现发货任务产品数量面积与实际发货产品数量面积不一致的情况，在此页面对发货任务进行确认后，发货任务的面积就会替换成实际发货面积。' type='warning' show-icon style='margin-bottom: 10px'></el-alert>
		<el-tabs v-model='tabName' @tab-click='reload'>
			<el-tab-pane label='待确认任务' name='toConfirm'>
				<task-list ref='toConfirmList' :params='toConfirmListParams' init hide-edit-field show-load-finish-field sort-prop='load_finish_time'>
					<el-table-column slot='column' prop='product_area_total' label='申请发货面积' fixed='right' align='right' width='110'>
						<template slot-scope='{row}'>
							{{ row.product_area_total }}㎡
						</template>
					</el-table-column>
					<el-table-column slot='column' prop='cy_load_area_total' label='实际发货面积' fixed='right' align='right' width='110'>
						<template slot-scope='{row}'>
							<span v-if='Number(row.product_area_total)==Number(row.cy_load_area_total)'>{{ row.cy_load_area_total }}㎡</span>
							<span style='color:#f44' v-else>{{ row.cy_load_area_total }}㎡</span>
						</template>
					</el-table-column>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='90'>
						<template slot-scope='scope'>
							<el-button  size='mini' type='text' @click='details(scope.row)'>详情</el-button>
							<el-button  size='mini' type='text' @click='confirm(scope.row)'>确认</el-button>
						</template>
					</el-table-column>
				</task-list>
			</el-tab-pane>
			<el-tab-pane label='已确认任务' name='confirm'>
				<task-list ref='confirmList' show-load-finish-field show-confirm-field hide-edit-field :params='confirmListParams' sort-prop='confirm_time'></task-list>
			</el-tab-pane>
		</el-tabs>
		<confirm-dialog ref='confirmDialog' @updated='reload'></confirm-dialog>
		<task-details ref='taskDetails'>
			<div slot='footer' slot-scope='{data}' v-if='Number(data.cy_load_area_total) > Number(data.product_area_total)'>
				<el-button type='primary' @click='confirm(data)' >确认</el-button>
			</div>
		</task-details>
	</div>
</template>
<script>
	import list from '@/components/cy/deliveryTask/list'	
	import deliveryApi from '@/api/cy/deliveryCar'
	import taskList from '@/components/yyzx/deliveryTask/edit/editList'
	import confirmDialog from '@/components/yyzx/deliveryTask/confirmDialog'
	import taskDetails from '@/components/yyzx/deliveryTask/details'

	export default {
		components:{
			list,
			taskList,
			confirmDialog,
			taskDetails,
		},
		data(){
			return {
				tabName:'toConfirm',
				toConfirmListParams:{
					toConfirm:1,
					inUser:1
				},
				confirmListParams:{
					confirm:1,
					inUser:1
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
			confirm(row){
				this.$refs.confirmDialog.open().then(that=>{
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
			printCar(scope){
				this.$refs.print.open().then(that=>{
					that.get(scope.row.id)
				})
			},
		}
	}
</script>