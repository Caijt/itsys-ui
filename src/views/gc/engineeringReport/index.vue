<template>
	<div>
		<el-alert title='对应项目的跟单业务员根据项目情况每周汇报对应内容，每周提交更新' type='warning' style='margin-bottom: 10px'></el-alert>
		<el-alert
	    :title='"当前有 "+toPurchaseOrderTotal+" 个新项目需填写销售计划报告，请及时进行处理"'
	    type="error" 
	    :closable="false"
	    style='margin: 10px 0px'
	    v-show='toPurchaseOrderTotal>0'
	   />
		<div style='margin:10px 0px'>
			<el-button type='primary' size='small' @click='createRecord'>填写报告</el-button>
			<el-badge :value='toPurchaseOrderTotal'>
				<el-button size='small' type='danger' :loading='toOrderProjectLoading' @click='openSummaryDialog'>待办新项目</el-button>
				<summary-dialog ref='summaryDialog'>
					<el-table-column slot='column' label='操作' width='60' fixed='right' align='center'>
						<template slot-scope='scope'>
							<el-button size='mini' type='text' @click='createBySummary(scope)'>填写</el-button>
						</template>
					</el-table-column>
				</summary-dialog>
			</el-badge>
		</div>
		<el-tabs v-model='tabName' @tab-click='reload'>
			<el-tab-pane label='项目报告' name='summary'>
				<summary-list ref='summaryList' init>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='60'>
						<template slot-scope='scope'>
							<el-button  size='mini' type='text' @click='createBySummary(scope)'>查看</el-button>	
						</template>
					</el-table-column>
				</summary-list>
			</el-tab-pane>
			<el-tab-pane label='历史报告明细' name='list'>
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
	import list from '@/components/gc/report/list'
	import summaryDialog from '@/components/gc/report/summary/listDialog'
	import formDialog from '@/components/gc/report/formDialog'
	import summaryFormDialog from '@/components/gc/report/summary/formDialog'
	import summaryList from '@/components/gc/report/summary/list'
	import reportApi from '@/api/gc/report'

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
				reportApi.getNewProjectTotal().then(res=>{
					this.toPurchaseOrderTotal = res.data
					this.toOrderProjectLoading = false
				})
			},
			openSummaryDialog(){
				this.$refs.summaryDialog.open({ isGcNew:1 })
			},
			createRecord(){
				this.$refs.summaryFormDialog.open()
			},
			createBySummary({ row }){
				let data = this.$commonJs.obj.copyByKey(row,[
					'order_id','order_no','contract_id','order_area','sc_self_finish_area_total',
					'no_product_area','order_date','project_id','project_name','self_area',
					'project_no','contract_no','plan_id'
				])
				this.$refs.summaryFormDialog.open(row)
			},
			editRecord({row}){
				if(row.is_submit){
					this.$message.error('已提交的报告无法删除！')
					return
				}
				this.$refs.formDialog.open(row)
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
			}
		}
	}
</script>