<template>
	<div>
		<el-alert
	    :title='"当前有 "+newOrderTotal+" 个新提交的订单需进行生产，请及时进行处理"'
	    type="error" 
	    :closable="false"
	    style='margin: 10px 0px'
	    v-show='newOrderTotal>0' 
	   />
		<div style='margin:10px 0px'>
			<el-badge :value='newOrderTotal'>
				<el-button type='danger' size='small' @click='openNewOrderDialog' v-loading='newOrderLoading'>待办新订单</el-button>
				<new-order-dialog ref='newOrderDialog'>
					<el-table-column slot='column' label='操作' width='60' fixed='right' align='center'>
						<template slot-scope='scope'>
							<el-button size='mini' type='text' @click='openOrderDialog(scope)'>查看</el-button>
						</template>
					</el-table-column>
				</new-order-dialog>
			</el-badge>			
		</div>
		<el-tabs v-model='tabName' @tab-click='reload'>
			<el-tab-pane label='订单生产汇总' name='order'>
				<order-list ref='summaryList' init>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='60'>
						<template slot-scope='scope'>
							<el-button  size='mini' type='text' @click='openOrderDialog(scope)'>查看</el-button>	
						</template>
					</el-table-column>
				</order-list>
			</el-tab-pane>
			<el-tab-pane label='生产日志明细' name='log'>
				<log-list ref='logList' @del='reload' show-summary>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='90'>
						<template slot-scope='scope'>
							<el-button  size='mini' type='text' @click='editLog(scope)'>编辑</el-button>	
							<el-button  size='mini' type='text' @click='delLog(scope)'>删除</el-button>
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
	import logList from '@/components/sc/produceLog/logList'
	import orderList from '@/components/sc/produceLog/orderList'	
	import newOrderDialog from '@/components/sc/produceLog/newOrderDialog'
	import orderFormDialog from '@/components/sc/produceLog/orderFormDialog'
	import logEditDialog from '@/components/sc/produceLog/logEditDialog'

	export default {
		components:{
			logList,		
			orderList,
			newOrderDialog,
			orderFormDialog,
			logEditDialog
		},
		data(){
			return {
				tabName:'order',
				newOrderTotal:0,
				newOrderLoading:true
			}
		},
		mounted(){
			this.getNewOrderTotal()
		},
		methods:{
			getNewOrderTotal(){
				this.newOrderLoading = true
				productLogApi.getOrderTotal({isNew:1}).then(res=>{
					this.newOrderTotal = res.data
					this.newOrderLoading = false
				})
			},
			openNewOrderDialog(){
				this.$refs.newOrderDialog.open()
			},
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
				this.getNewOrderTotal()
				if(this.$refs.newOrderDialog.show){
					this.$refs.newOrderDialog.reload()
				}
				if(this.tabName==='order'){
					this.$refs.summaryList.reload()
				}else{
					this.$refs.logList.reload()
				}
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