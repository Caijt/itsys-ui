<template>
	<div>
		<el-alert title='项目开票后，根据客户回款情况对项目进行回款登记' type='warning' style='margin-bottom: 10px'></el-alert>
		<el-alert
	    :title='"当前有 "+arrearProjectTotal+" 个项目已开票待回款，请及时进行收款"'
	    type="error" 
	    :closable="false"
	    style='margin: 10px 0px'
	    v-show='arrearProjectTotal>0'
	    ></el-alert>
		<div style='margin:10px 0px'>
			<el-button type='primary' size='small' @click='createRecord'>回款登记</el-button>
			<el-badge :value='arrearProjectTotal'>
				<el-button size='small' type='danger' :loading='arrearProjectLoading' @click='openProjectListDialog'>待回款项目</el-button>
			</el-badge>
		</div>
  	<el-tabs v-model='tabName' @tab-click='reload'>
  		<el-tab-pane label='项目回款汇总' name='summary'>
				<summary-list ref='summaryList' init>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='60'>
						<template slot-scope='scope'>
							<el-button  size='mini' type='text' @click='createBySummary(scope)'>回款</el-button>	
						</template>
					</el-table-column>
				</summary-list>
			</el-tab-pane>
			<el-tab-pane label='回款记录明细' name='list'>
				<list ref='list' >
		    	<el-table-column slot='column' label='操作' fixed='right' align='center' width='100'>
						<template slot-scope='scope'>
							<el-button  size='mini' type='text' @click='editRecord(scope)'>编辑</el-button>	
							<el-button  size='mini' type='text' @click='del(scope)'>删除</el-button>	
						</template>
					</el-table-column>
	    	</list>
			</el-tab-pane>
		</el-tabs>
		<summary-form-dialog ref='summaryFormDialog' @saved='reload'></summary-form-dialog>
		<form-dialog ref='formDialog' @saved='reload'></form-dialog>
		<summary-list-dialog ref='projectListDialog'>
			<el-table-column slot='column' label='操作' width='60' fixed='right' align='center'>
				<template slot-scope='scope'>
					<el-button size='mini' type='text' @click='createBySummary(scope)'>回款</el-button>
				</template>
			</el-table-column>
		</summary-list-dialog>
	</div>
</template>

<script>
import receivePaymentRecordApi from '@/api/cw/receivePaymentRecord'
import list from '@/components/cw/receivePaymentRecord/list'
import formDialog from '@/components/cw/receivePaymentRecord/formDialog'
import projectListDialog from '@/components/cw/summary/projectListDialog'
import summaryList from '@/components/cw/receivePaymentRecord/summary/list'
import summaryListDialog from '@/components/cw/receivePaymentRecord/summary/listDialog'
import summaryFormDialog from '@/components/cw/receivePaymentRecord/summary/formDialog'

export default {
	components:{ 
		list, 
		formDialog, 
		projectListDialog, 
		summaryList,
		summaryFormDialog,
		summaryListDialog
 	},
	data(){
		return {
			tabName:'summary',
			arrearProjectTotal:0,
			arrearProjectLoading: true,
			companyList:[],
			companyLoading:true
		}
	},
	computed:{
		//表单是否是编辑状态
		isFormEdit(){
			return this.form.id!=null
		}
	},
	mounted(){
		this.getArrearProjectTotal()
		this.$refs.list.initData()
	},
	methods:{	
		getArrearProjectTotal(){
			this.arrearProjectLoading = true
			receivePaymentRecordApi.getArrearProjectTotal().then(res=>{
				this.arrearProjectTotal=res.data
				this.arrearProjectLoading = false
			})
		},
		exportExcel(){
			receivePaymentRecordApi.exportExcel(this.$refs.list.requestParams)
		},
		createRecord( ){
			this.$refs.summaryFormDialog.open()
		},
		editRecord({row}){
			this.$refs.formDialog.open( row )
		},
		//删除
		del({ row,$index }){
			let confirmText = '确定删除？'
			this.$confirm(confirmText,'提示',{
				type: 'warning'
			}).then(()=>{
				receivePaymentRecordApi.del(row.id).then(res=>{
					this.reload()
					this.$message.success('删除成功')
				})
			})
		},
		openProjectListDialog(){
			this.$refs.projectListDialog.open({ hasArrear:1})
		},
		createRecordByTodo({row}){
			let data = this.$commonJs.obj.copyByKey(row,[
					'project_id','project_name','project_no','customer_name','company_name','project_customer',
					'salesman','project_price','invoice_price_total','arrear_price','customer_id',
					'contract_no','contract_id'])
			this.$refs.formDialog.open(data)
		},
		reload(){
			this.getArrearProjectTotal()
			if(this.$refs.projectListDialog.show){
				this.$refs.projectListDialog.reload()
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
		createBySummary({row}){
			let data = this.$commonJs.obj.copyByKey(row,[
				'project_id','project_no','project_name','contract_no','contract_id','customer_id','project_customer','project_area','project_price','cw_invoice_price_total','cw_payment_price_total','no_payment_price'
			])
			this.$refs.summaryFormDialog.open(data)
		},
	}
}
</script>