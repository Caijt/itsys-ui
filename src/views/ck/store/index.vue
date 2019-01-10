<template>
	<div>
		<el-alert title='运营下单后，仓库需对订单所需的物料库存情况进行填写' type='warning' style='margin-bottom: 10px'></el-alert>
		<el-alert
	    :title='"当前有 "+toPurchaseOrderTotal+" 个订单需填写物料库存报告，请及时进行处理"'
	    type="error" 
	    :closable="false"
	    style='margin: 10px 0px'
	    v-show='toPurchaseOrderTotal>0'
	   />
		<div style='margin:10px 0px'>
			<el-button type='primary' size='small' @click='createRecord'>库存报告</el-button>
			<el-badge :value='toPurchaseOrderTotal'>
				<el-button size='small' type='danger' :loading='toOrderProjectLoading' @click='openSummaryDialog'>待办订单</el-button>
				<summary-dialog ref='summaryDialog'>
					<el-table-column slot='column' label='操作' width='60' fixed='right' align='center'>
						<template slot-scope='scope'>
							<el-button size='mini' type='text' @click='createRecordByTodo(scope)'>报告</el-button>
						</template>
					</el-table-column>
				</summary-dialog>
			</el-badge>
			<el-badge :value='toReturnOrderTotal' style='margin-left:15px'>
				<el-button size='small' type='success' :loading='toReturnOrderLoading' @click='openListDialog'>退料订单</el-button>
				<list-dialog :params='{toReturn:1}' ref='listDialog' title='退料订单' >
					<el-alert slot='top' title='以下是已完成生产的订单，仓库需进行结算库存型材、五金余料数量' type='warning' style='margin-bottom:15px'></el-alert>
					<el-table-column slot='column' label='操作' width='60' fixed='right' align='center'>
						<template slot-scope='scope'>
							<el-button size='mini' type='text' @click='editRecord(scope)'>退料</el-button>
						</template>
					</el-table-column>
				</list-dialog>
			</el-badge>
			<el-button size='small' @click='openRecycleDialog' style='margin-left:10px'>订单回收站</el-button>
			<list-dialog ref='recycleListDialog' title='被取消进行的订单列表'>
				<el-alert title='以下订单已被运营中心取消进行' slot='top' type='warning' style='margin-bottom:15px'></el-alert>
				<el-table-column slot='column' label='取消原因' prop='del_remarks' fixed width='120'>
				</el-table-column>
			</list-dialog>
		</div>
		<el-tabs v-model='tabName'>
			<el-tab-pane label='物料库存报告' name='list'>
				<list ref='list'>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='90'>
						<template slot-scope='scope'>
							<el-button  size='mini' type='text' @click='editRecord(scope)'>编辑</el-button>
							<el-button  size='mini' type='text' @click='del(scope)'>删除</el-button>
						</template>
					</el-table-column>
				</list>
			</el-tab-pane>
		</el-tabs>
		<form-dialog ref='formDialog' @saved='reload' />
	</div>
</template>
<script>
	import list from '@/components/ck/store/list'
	import listDialog from '@/components/ck/store/listDialog'
	import summaryDialog from '@/components/ck/store/summary/listDialog'
	import formDialog from '@/components/ck/store/formDialog'
	import storeApi from '@/api/ck/store'
	export default {
		components:{
			list,
			listDialog,
			formDialog,
			summaryDialog			
		},
		data(){
			return {
				tabName:'list',
				toPurchaseOrderTotal:0,
				toOrderProjectLoading:true,
				toReturnOrderTotal:0,
				toReturnOrderLoading:true
			}
		},
		mounted(){
			this.getToStorageOrderTotal()
			this.getToReturnOrderTotal()
			this.$refs.list.initData()
		},
		methods:{
			getToStorageOrderTotal(){
				this.toOrderProjectLoading = true
				storeApi.getTotal({ toStorage:1}).then(res=>{
					this.toPurchaseOrderTotal = res.data
					this.toOrderProjectLoading = false
				})
			},
			getToReturnOrderTotal(){
				this.toReturnOrderLoading = true
				storeApi.getTotal({ toReturn:1}).then(res=>{
					this.toReturnOrderTotal = res.data
					this.toReturnOrderLoading = false
				})
			},
			openSummaryDialog(){
				this.$refs.summaryDialog.open({ toStorage:1 })
			},
			openListDialog(){
				this.$refs.listDialog.open({ toReturn:1 })
			},
			createRecord(){
				this.$refs.formDialog.open()
			},
			createRecordByTodo({ row }){
				let data = this.$commonJs.obj.copyByKey(row,[
					'order_id','order_no','order_type','order_batch','order_area','order_amount',
					'order_date','order_delivery_date','project_id','project_name','project_no',
					'contract_no','contract_id','contract_id'
				])
				console.log(data.contract_id)
				this.$refs.formDialog.open(data)
			},
			editRecord({row}){
				this.$refs.formDialog.open(row)
			},
			del({ row,$index }){
				let confirmText = '确定删除？'
				this.$confirm(confirmText,'提示',{
					type: 'warning'
				}).then(()=>{
					storeApi.del(row.id).then(res=>{
						this.$message.success('删除成功')
						this.reload()					
					})
				})
			},
			reload(){
				this.getToStorageOrderTotal()
				this.getToReturnOrderTotal()
				if(this.$refs.summaryDialog.show){
					this.$refs.summaryDialog.reload()
				}
				console.log(this.$refs.listDialog.show)
				if(this.$refs.listDialog.show){
					console.log('123')
					this.$refs.listDialog.reload()
				}
				this.$refs.list.reload()
			},
			openRecycleDialog(){
				this.$refs.recycleListDialog.open({ isDel:1 })
			}
		}
	}
</script>