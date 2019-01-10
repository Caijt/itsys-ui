<template>
	<div>
		<el-tabs v-model='tabName' @tab-click='reload'>
			<el-tab-pane label='待生产订单' name='toProduce'>
				<order-list ref='toProduceList' :params='{toProduce:1}' hide-edit-field init>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='60'>
						<template slot-scope='scope'>							
							<el-button  size='mini' type='text' @click='openLogDialog(scope)'>生产</el-button>	
						</template>
					</el-table-column>
				</order-list>
			</el-tab-pane>
			<el-tab-pane label='已完成订单' name='produceFinish'>
				<order-list ref='produceFinishList' :params='{produceFinish:1}'>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='60'>
						<template slot-scope='scope'>							
							<el-button  size='mini' type='text' @click='openLogDialog(scope)'>生产</el-button>	
						</template>
					</el-table-column>
				</order-list>
			</el-tab-pane>
			<el-tab-pane label='生产日志' name='log'>
				<log-list ref='logList'  @del='reload' show-summary>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='90'>
						<template slot-scope='scope'>
							<el-button size='mini' type='text' @click='editLog(scope)'>编辑</el-button>	
							<el-button size='mini' type='text' @click='delLog(scope)'>删除</el-button>
						</template>
					</el-table-column>
				</log-list>
			</el-tab-pane>
		</el-tabs>
		<order-form-dialog ref='orderFormDialog' @changed='reload'/>
		<log-edit-dialog ref='logEditDialog' @changed='reload'/>
	</div>
</template>
<script>
	import productLogApi from '@/api/sc/produceLog'
	import logList from '@/components/sc/windowOrder/log/list'
	import orderList from '@/components/sc/windowOrder/list'	
	import orderFormDialog from '@/components/sc/windowOrder/log/orderEditDialog'
	import logEditDialog from '@/components/sc/windowOrder/log/editDialog'

	export default {
		components:{
			logList,		
			orderList,
			orderFormDialog,
			logEditDialog
		},
		data(){
			return {
				tabName:'toProduce',
				newOrderTotal:0,
				newOrderLoading:true
			}
		},
		mounted(){
		},
		methods:{
			createRecord(){
				this.$refs.summaryFormDialog.open()
			},
			openOrderDialog({ row }){
				this.$refs.orderFormDialog.assign(row).open()
			},
			editRecord({row}){
				this.$refs.formDialog.open(row.id)
			},
			del(scope){
				this.$refs.list.del(scope)
			},
			reload(){
				this.$refs[this.tabName+'List'].reload()
			},
			openLogDialog({row}){
				this.$refs.orderFormDialog.open().then(that=>{
					that.initData(row)
				})
			},
			editLog({row}){
				this.$refs.logEditDialog.get(row.id).open()
			},
			delLog(scope){
				this.$refs.logList.del(scope)
			}
		}
	}
</script>