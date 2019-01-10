<template>
	<div>
		<el-alert title='当订单开启了车间生产计划后，需在此对订单的生产完成情况进行填写' type='warning' style='margin-bottom: 10px'></el-alert>
		<el-alert
	    :title='"当前有 "+toPurchaseOrderTotal+" 个订单需进行生产，请及时进行处理"'
	    type="error" 
	    :closable="false"
	    style='margin: 10px 0px'
	    v-show='toPurchaseOrderTotal>0'
	   />
		<div style='margin:10px 0px'>
			<el-button type='primary' size='small' @click='createRecord'>订单生产</el-button>
			<el-badge :value='toPurchaseOrderTotal'>
				<el-button size='small' type='danger' :loading='toOrderProjectLoading' @click='openSummaryDialog'>待生产订单</el-button>
				<summary-dialog ref='summaryDialog'>
					<el-table-column slot='column' label='操作' width='60' fixed='right' align='center'>
						<template slot-scope='scope'>
							<el-button size='mini' type='text' @click='createBySummary(scope)'>生产</el-button>
						</template>
					</el-table-column>
				</summary-dialog>
			</el-badge>
			<el-button size='small' @click='openRecycleDialog' style='margin-left:10px'>订单回收站</el-button>
			<summary-dialog ref='recycleSummaryDialog' title='被取消进行的订单列表'>
				<el-alert title='以下订单已被运营中心取消进行' slot='top' type='warning' style='margin-bottom:15px'></el-alert>
				<el-table-column slot='column' label='取消原因' prop='del_remarks' fixed width='120'>
				</el-table-column>
			</summary-dialog>
			
		</div>
		<el-tabs v-model='tabName' @tab-click='reload'>
			<el-tab-pane label='订单生产汇总' name='summary'>
				<summary-list ref='summaryList' init>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='60'>
						<template slot-scope='scope'>
							<el-button  size='mini' type='text' @click='createBySummary(scope)'>生产</el-button>	
						</template>
					</el-table-column>
				</summary-list>
			</el-tab-pane>
			<el-tab-pane label='车间生产明细' name='list'>
				<list ref='list' @del='reload'>
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
		<summary-form-dialog ref='summaryFormDialog' @saved='reload'/>
	</div>
</template>
<script>
	import list from '@/components/sc/product/list'
	import summaryDialog from '@/components/sc/product/summary/listDialog'
	import formDialog from '@/components/sc/product/formDialog'
	import summaryFormDialog from '@/components/sc/product/summary/formDialog'
	import summaryList from '@/components/sc/product/summary/list'
	import productApi from '@/api/sc/product'
	export default {
		components:{
			list,
			formDialog,
			summaryDialog,
			summaryFormDialog,
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
			this.getToProductOrderTotal()
		},
		methods:{
			getToProductOrderTotal(){
				this.toOrderProjectLoading = true
				productApi.getToProductOrderTotal().then(res=>{
					this.toPurchaseOrderTotal = res.data
					this.toOrderProjectLoading = false
				})
			},
			openSummaryDialog(){
				this.$refs.summaryDialog.open({ toProduct:1 })
			},
			createRecord(){
				this.$refs.summaryFormDialog.open()
			},
			createBySummary({ row }){
				let data = this.$commonJs.obj.copyByKey(row,[
					'order_id','order_no','contract_id','order_area','sc_self_finish_area_total',
					'no_product_area','order_date','project_id','project_name','self_area','sc_self_is_finish','project_no','contract_no','plan_id','sc_self_product_status'
				])
				this.$refs.summaryFormDialog.open(data)
			},
			editRecord({row}){
				this.$refs.formDialog.open(row.id)
			},
			del(scope){
				this.$refs.list.del(scope)
			},
			reload(){
				this.getToProductOrderTotal()
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
				this.$refs.recycleSummaryDialog.open({ isDel:1 })
			}
		}
	}
</script>