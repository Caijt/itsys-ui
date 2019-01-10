<template>
	<div>
		<el-alert
	    :title='"当前有 "+toPurchaseOrderTotal+" 个订单采购的物料需入库，请及时进行处理"'
	    type="error" 
	    :closable="false"
	    style='margin: 10px 0px'
	    v-show='toPurchaseOrderTotal>0'
	   />
		<div style='margin:10px 0px'>
			<el-button type='primary' size='small' @click='createRecord'>物料入库</el-button>
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
		</div>
		<el-tabs v-model='tabName'>
			<el-tab-pane label='物料入库报告' name='list'>
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
	import summaryDialog from '@/components/ck/store/summary/listDialog'
	import formDialog from '@/components/ck/store/formDialog'
	import storeApi from '@/api/ck/store'
	export default {
		components:{
			list,
			formDialog,
			summaryDialog			
		},
		data(){
			return {
				tabName:'list',
				toPurchaseOrderTotal:0,
				toOrderProjectLoading:true
			}
		},
		mounted(){
			this.getToStorageOrderTotal()
			this.$refs.list.initData()
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
				this.$refs.formDialog.open()
			},
			createRecordByTodo({ row }){
				let data = this.$commonJs.obj.copyByKey(row,[
					'order_id','order_no','order_type','order_batch','order_area','order_amount',
					'order_date','order_delivery_date','project_id','project_name','project_no',
					'contract_no','plan_id'
				])
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
				if(this.$refs.summaryDialog.show){
					this.$refs.summaryDialog.reload()
				}
				if(this.tabName==='list'){
					this.$refs.list.reload()
				}else{
					if(this.$refs.summaryList.inited){
						this.$refs.summaryList.reload()
					}else{
						this.$refs.summaryList.initData()
					}
				}
			}
		}
	}
</script>