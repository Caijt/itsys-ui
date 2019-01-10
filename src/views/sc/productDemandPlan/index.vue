<template>
	<div>
		<el-alert title='运营下单后，生产中心对订单进行计划的填写，以决定订单，是否需物料采购（采购中心处理），车间生产、外协生产' type='warning' style='margin-bottom: 10px'></el-alert>
		<el-alert
	    :title='"当前有 "+toPlanOrderTotal+" 个订单需制定生产需求计划，请及时进行处理"'
	    type="error" 
	    :closable="false"
	    style='margin: 10px 0px'
	    v-show='toPlanOrderTotal>0'
    />
		<div style='margin:10px 0px'>
			<el-button type='primary' size='small' @click='createPlan'>创建生产计划</el-button>
			<el-badge :value='toPlanOrderTotal'>
				<el-button size='small' type='danger' :loading='toOrderProjectLoading' @click='openSummaryDialog'>待计划订单</el-button>
				<summary-dialog ref='summaryDialog'>
					<el-table-column slot='column' label='操作' width='60' fixed='right' align='center'>
						<template slot-scope='scope'>
							<el-button size='mini' type='text' @click='createPlanByTodo(scope)'>计划</el-button>
						</template>
					</el-table-column>
				</summary-dialog>
			</el-badge>
			<el-button size='small' @click='openListDialog' style='margin-left:10px'>订单回收站</el-button>
			<list-dialog ref='listDialog' title='被取消进行的订单列表'>
				<el-alert title='以下订单已被运营中心取消进行' slot='top' type='warning' style='margin-bottom:15px'></el-alert>
				<el-table-column slot='column' label='取消原因' prop='del_remarks' fixed width='120'>
				</el-table-column>
			</list-dialog>
		</div>
		<el-tabs value='list'>
			<el-tab-pane label='计划明细' name='list'>
				<plan-list ref='planList'>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='90'>
						<template slot-scope='scope'>
							<el-button  size='mini' type='text' @click='editPlan(scope)'>编辑</el-button>	
							<el-button  size='mini' type='text' @click='del(scope)'>删除</el-button>
						</template>
				</el-table-column>
				</plan-list>
			</el-tab-pane>
		</el-tabs>
		<plan-form-dialog ref='formDialog' @saved='reload'></plan-form-dialog>
	</div>
</template>
<script>
	import planList from '@/components/sc/productDemandPlan/list'
	import summaryDialog from '@/components/sc/productDemandPlan/summary/listDialog'
	import listDialog from '@/components/sc/productDemandPlan/listDialog'
	import planFormDialog from '@/components/sc/productDemandPlan/formDialog'
	import planApi from '@/api/sc/productDemandPlan'
	export default {
		components:{
			planList,
			summaryDialog,
			listDialog,
			planFormDialog
		},
		data(){
			return {
				toPlanOrderTotal:0,
				toOrderProjectLoading:true
			}
		},
		mounted(){
			this.getToPlanOrderTotal()
			this.$refs.planList.initData()
		},
		methods:{
			getToPlanOrderTotal(){
				this.toOrderProjectLoading = true
				planApi.getToPlanOrderTotal().then(res=>{
					this.toPlanOrderTotal = res.data
					this.toOrderProjectLoading = false
				})
			},
			openSummaryDialog(){
				this.$refs.summaryDialog.open({ toPlan:1 })
			},
			createPlan(){
				this.$refs.formDialog.open()
			},
			createPlanByTodo({ row }){
				let data = this.$commonJs.obj.copyByKey(row,[
					'order_id','order_no','order_type','order_batch','order_area','order_amount','order_date','delivery_date','ck_record_total',
					'project_id','project_name','project_no','contract_no','contract_id','attach_ids'
				])
				this.$refs.formDialog.open(data)
			},
			editPlan({row}){
				this.$refs.formDialog.open(row)
			},
			del({ row,$index }){
				let confirmText = '确定删除？'
				this.$confirm(confirmText,'提示',{
					type: 'warning'
				}).then(()=>{
					planApi.del(row.id).then(res=>{
						this.$message.success('删除成功')
						this.reload()					
					})
				})
			},
			reload(){
				this.getToPlanOrderTotal()
				this.$refs.planList.reload()
				if(this.$refs.summaryDialog.show){
					this.$refs.summaryDialog.reload()
				}
			},
			openListDialog(){
				this.$refs.listDialog.open({ isDel:1 })
			}
		}
	}
</script>