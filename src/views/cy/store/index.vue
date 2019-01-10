<template>
	<div>
		<el-alert title='当生产中心填写车间生产或外协生产报告后，订单生产完成面积大于0，才可以进行成品入库操作' type='warning' style='margin-bottom: 10px'></el-alert>
		<el-alert
	    :title='"当前有 "+toPurchaseOrderTotal+" 个订单需进行成品入库，请及时进行处理"'
	    type="error" 
	    :closable="false"
	    style='margin: 10px 0px'
	    v-show='toPurchaseOrderTotal>0'
	   />
		<div style='margin:10px 0px'>
			<el-button type='primary' size='small' @click='createRecord'>成品入库</el-button>
			<el-badge :value='toPurchaseOrderTotal'>
				<el-button size='small' type='danger' :loading='toOrderProjectLoading' @click='openSummaryDialog'>待入库订单</el-button>
				<summary-dialog ref='summaryDialog'>
					<el-table-column slot='column' label='操作' width='60' fixed='right' align='center'>
						<template slot-scope='scope'>
							<el-button size='mini' type='text' @click='createRecordByTodo(scope)'>入库</el-button>
						</template>
					</el-table-column>
				</summary-dialog>
			</el-badge>
			<el-button size='small' @click='openRecycleDialog' style='margin-left:10px'>订单回收站</el-button>
			<summary-dialog ref='recycleListDialog' title='被取消进行的订单列表'>
				<el-alert title='以下订单已被运营中心取消进行' slot='top' type='warning' style='margin-bottom:15px'></el-alert>
				<el-table-column slot='column' label='取消原因' prop='del_remarks' fixed width='120'>
				</el-table-column>
			</summary-dialog>
		</div>
		<el-tabs v-model='tabName' @tab-click='reload'>
			<el-tab-pane label='订单入库汇总' name='summary'>
				<summary-list ref='summaryList' init>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='60'>
						<template slot-scope='scope'>
							<el-button  size='mini' type='text' @click='createRecordByTodo(scope)'>入库</el-button>
						</template>
					</el-table-column>
				</summary-list>
			</el-tab-pane>
			<el-tab-pane label='成品入库明细' name='list'>
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
		<summary-form-dialog ref='summaryFormDialog' @saved='reload' />
	</div>
</template>
<script>
	import list from '@/components/cy/store/list'
	import summaryDialog from '@/components/cy/store/summary/listDialog'
	import summaryFormDialog from '@/components/cy/store/summary/formDialog'
	import formDialog from '@/components/cy/store/formDialog'
	import storeApi from '@/api/cy/store'
	import summaryList from '@/components/cy/store/summary/list'

	export default {
		components:{
			list,
			formDialog,
			summaryFormDialog,
			summaryDialog,
			summaryList	
		},
		data(){
			return {
				tabName:'summary',
				toPurchaseOrderTotal:0,
				toOrderProjectLoading:true
			}
		},
		mounted(){
			this.getToStorageOrderTotal()
		},
		methods:{
			getToStorageOrderTotal(){
				this.toOrderProjectLoading = true
				storeApi.getToStorageOrderTotal().then(res=>{
					this.toPurchaseOrderTotal = res.data
					this.toOrderProjectLoading = false
				})
			},
			openSummaryDialog(){
				this.$refs.summaryDialog.open({ toStorage:1 })
			},
			createRecord(){
				this.$refs.summaryFormDialog.open()
			},
			createRecordByTodo({ row }){
				let data = this.$commonJs.obj.copyByKey(row,[
					'order_id','order_no','contract_id','order_area','storage_area_total',
					'no_storage_area','order_date','project_id','project_name',
					'project_no','contract_no','plan_id','self_finish_area_total','out_finish_area_total','finish_area_total'
				])
				this.$refs.summaryFormDialog.open(data)
			},
			editRecord({row}){
				this.$refs.formDialog.open(row.id)
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
				if(this.$refs.summaryDialog.show){
					this.$refs.summaryDialog.reload()
				}
				if(this.tabName==='summary'){
					this.$refs.summaryList.reload()
				}else{
					if(this.$refs.list.inited){
						this.$refs.list.reload()
					}else{
						this.$refs.list.initData()
					}
				}
			},
			openRecycleDialog(){
				this.$refs.recycleListDialog.open({ isDel:1 })
			}
		}
	}
</script>