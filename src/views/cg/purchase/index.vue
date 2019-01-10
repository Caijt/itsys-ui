<template>
	<div>
		<el-alert title='当订单开启了物料采购计划后，需在此对订单的物料采购情况进行填写' type='warning' style='margin-bottom: 10px'></el-alert>
		<el-alert
	    :title='"当前有 "+toPurchaseOrderTotal+" 个订单需进行物料采购，请及时进行处理"'
	    type="error" 
	    :closable="false"
	    style='margin: 10px 0px'
	    v-show='toPurchaseOrderTotal>0'
	   />
		<div style='margin:10px 0px'>
			<el-button type='primary' size='small' @click='createRecord'>物料采购</el-button>
			<el-badge :value='toPurchaseOrderTotal'>
				<el-button size='small' type='danger' :loading='toOrderProjectLoading' @click='openSummaryDialog'>待采购订单</el-button>
				<summary-dialog ref='summaryDialog'>
					<el-table-column slot='column' label='操作' width='60' fixed='right' align='center'>
						<template slot-scope='scope'>
							<el-button size='mini' type='text' @click='createRecordByTodo(scope)'>采购</el-button>
						</template>
					</el-table-column>
				</summary-dialog>
			</el-badge>
			<el-button size='small' @click='openRecycleDialog' style='margin-left:10px'>订单回收站</el-button>
			<list-dialog ref='recycleListDialog' title='被取消进行的订单列表'>
				<el-alert title='以下订单已被运营中心取消进行' slot='top' type='warning' style='margin-bottom:15px'></el-alert>
				<el-table-column slot='column' label='取消原因' prop='del_remarks' fixed width='120'>
				</el-table-column>
			</list-dialog>
		</div>
		<el-tabs v-model='tabName'>
			<el-tab-pane label='采购记录' name='list'>
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
	import list from '@/components/cg/purchase/list'
	import listDialog from '@/components/cg/purchase/listDialog'
	import summaryDialog from '@/components/cg/purchase/summary/listDialog'
	import formDialog from '@/components/cg/purchase/formDialog'
	import purchaseApi from '@/api/cg/purchase'
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
				toOrderProjectLoading:true
			}
		},
		mounted(){
			this.getToPurchaseOrderTotal()
			this.$refs.list.initData()
		},
		methods:{
			getToPurchaseOrderTotal(){
				this.toOrderProjectLoading = true
				purchaseApi.getToPurchaseOrderTotal().then(res=>{
					this.toPurchaseOrderTotal = res.data
					this.toOrderProjectLoading = false
				})
			},
			openSummaryDialog(){
				this.$refs.summaryDialog.open({ toPurchase:1 })
			},
			createRecord(){
				this.$refs.formDialog.open()
			},
			createRecordByTodo({ row }){
				let data = this.$commonJs.obj.copyByKey(row,[
					'order_id','order_no','order_type','order_batch','order_area','order_amount','order_date','order_delivery_date','purchase_type','purchase_oa',
					'project_id','project_name','project_no','contract_no','plan_id'
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
					purchaseApi.del(row.id).then(res=>{
						this.$message.success('删除成功')
						this.reload()					
					})
				})
			},
			reload(){
				this.getToPurchaseOrderTotal()
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
			},
			openRecycleDialog(){
				this.$refs.recycleListDialog.open({ isDel:1 })
			}
		}
	}
</script>