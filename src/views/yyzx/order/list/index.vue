<template>
	<div>
		<el-alert title='项目立项后，才可以进行运营下单操作，一个项目可以多次下单' type='warning' style='margin-bottom: 10px'></el-alert>
		<el-alert
	    :title='"当前有 "+toOrderProjectTotal+" 个项目仍未下单，请及时进行处理"'
	    type="error" 
	    :closable="false"
	    style='margin: 10px 0px'
	    v-show='toOrderProjectTotal>0'
	    ></el-alert>
		<div style='margin:10px 0px'>
			<el-button type='primary' size='small' @click='createOrder'>运营下单</el-button>
			<el-badge :value='toOrderProjectTotal'>
				<el-button size='small' type='danger' :loading='toOrderProjectLoading' @click='openOrderSummaryDialog'>未下单项目</el-button>
				<order-summary-dialog ref='orderSummaryDialog'>
					<el-table-column slot='column' label='操作' width='60' fixed='right' align='center'>
						<template slot-scope='scope'>
							<el-button size='mini' type='text' @click='createOrderByTodo(scope)'>下单</el-button>
						</template>
					</el-table-column>
				</order-summary-dialog>
			</el-badge>
		</div>
		<el-tabs v-model='tabName' @tab-click='reload'>
			<el-tab-pane label='下单明细' name='list'>
				<order-list :params='{isDel:0}' ref='orderList'>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='90'>
						<template slot-scope='scope'>
							<el-button  size='mini' type='text' @click='editOrder(scope)'>编辑</el-button>	
							<el-button  size='mini' type='text' @click='del(scope)'>删除</el-button>
						</template>
				</el-table-column>
				</order-list>
			</el-tab-pane>
			<el-tab-pane label='项目下单汇总' name='summary'>
				<order-summary ref='orderSummary' :params='{ hasOrder:1 }'>
					<el-table-column slot='column' label='操作' width='60' fixed='right' align='center'>
						<template slot-scope='scope'>
							<el-button  size='mini' type='text' @click='createOrderByTodo(scope)'>下单</el-button>
						</template>
					</el-table-column>
				</order-summary>
			</el-tab-pane>
		</el-tabs>
		<order-form-dialog ref='orderFormDialog' @saved='reload'></order-form-dialog>
	</div>
</template>
<script>
	import orderList from '@/components/yyzx/order/list'
	import orderSummary from '@/components/yyzx/order/summary/list'
	import orderSummaryDialog from '@/components/yyzx/order/summary/listDialog'
	import orderFormDialog from '@/components/yyzx/order/formDialog'
	import orderApi from '@/api/yyzx/order'
	export default {
		components:{
			orderList,
			orderSummary,
			orderSummaryDialog,
			orderFormDialog
		},
		data(){
			return {
				tabName:'list',
				toOrderProjectTotal:0,
				toOrderProjectLoading:true
			}
		},
		mounted(){
			this.getToOrderProjectTotal()
			this.$refs.orderList.initData()
		},
		methods:{
			getToOrderProjectTotal(){
				this.toOrderProjectLoading = true
				orderApi.getToOrderProjectTotal().then(res=>{
					this.toOrderProjectTotal = res.data
					this.toOrderProjectLoading = false
				})
			},
			openOrderSummaryDialog(){
				this.$refs.orderSummaryDialog.open({ noOrder:1 })
			},
			createOrder(){
				this.$refs.orderFormDialog.open()
			},
			createOrderByTodo({ row }){
				let data = this.$commonJs.obj.copyByKey(row,[
					'project_id','project_name','project_no',
					'contract_no','no_order_area','project_area','contract_id'
				])
				this.$refs.orderFormDialog.open(data)
			},
			editOrder({row}){
				this.$refs.orderFormDialog.open(row.id)
			},
			del({ row,$index }){
				let confirmText = '您确定要永久删除此订单？如果已关联其它部门的数据将无法删除'
				this.$confirm(confirmText,'提示',{
					type: 'warning'
				}).then(()=>{
					orderApi.del(row.id).then(res=>{
						this.$message.success('删除成功')
						this.reload()					
					})
				})
			},
			reload(){
				this.getToOrderProjectTotal()
				if(this.$refs.orderSummaryDialog.show){
					this.$refs.orderSummaryDialog.reload()
				}
				if(this.tabName==='list'){
					this.$refs.orderList.reload()
				}else{
					if(this.$refs.orderSummary.inited){
						this.$refs.orderSummary.reload()
					}else{
						this.$refs.orderSummary.initData()
					}
				}
			}
		}
	}
</script>