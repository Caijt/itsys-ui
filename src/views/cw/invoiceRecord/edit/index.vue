<template>
	<div>
		<!-- <el-alert title='只有储运中心进行成品发货后，项目发货面积大于0，才可以进行项目开票登记' type='warning' style='margin-bottom: 10px'></el-alert> -->
		<!-- <el-alert
	    :title='"当前有 "+toInvoiceProjectTotal+" 个项目已发货待开票，请及时进行开票"'
	    type="error" 
	    :closable="false"
	    style='margin: 10px 0px'
	    v-show='toInvoiceProjectTotal>0'
	    ></el-alert> -->
		<div style='margin:10px 0px'>
			<el-button type='primary' @click='create'>开票登记</el-button>
			<!-- <el-badge :value='toInvoiceProjectTotal'>
				<el-button size='small' type='danger' :loading='toInvoiceProjectLoading' @click='openSummaryListDialog'>待开票项目</el-button>
			</el-badge> -->
		</div>
  	<el-tabs v-model='tabName' @tab-click='reload'>
			<el-tab-pane label='项目开票汇总' name='summary'>
				<summary-list ref='summaryList' init>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='60'>
						<template slot-scope='scope'>
							<el-button  size='mini' type='text' @click='createBySummary(scope)'>开票</el-button>	
						</template>
					</el-table-column>
				</summary-list>
			</el-tab-pane>
			<el-tab-pane label='开票记录明细' name='list'>
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
		<form-dialog ref='formDialog' @saved='reload'></form-dialog>
		<summary-form-dialog ref='summaryFormDialog' @saved='reload'></summary-form-dialog>
	</div>
</template>

<script>
import invoiceRecordApi from '@/api/cw/invoiceRecord'
import list from '@/components/cw/invoiceRecord/list'
import formDialog from '@/components/cw/invoiceRecord/formDialog'
import summaryFormDialog from '@/components/cw/invoiceRecord/summary/editDialog'
import summaryList from '@/components/cw/invoiceRecord/summary/list'

export default {
	components:{ 
		list, 
		formDialog, 
		summaryFormDialog,
		summaryList 
	},
	data(){
		return {
			tabName:'summary',
			toInvoiceProjectTotal:0,
			toInvoiceProjectLoading: true,
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
		
	},
	methods:{	
		getToInvoiceProjectTotal(){
			this.toInvoiceProjectLoading = true
			invoiceRecordApi.getToInvoiceProjectTotal().then(res=>{
				this.toInvoiceProjectTotal=res.data
				this.toInvoiceProjectLoading = false
			})
		},
		exportExcel(){
			this.$refs.list.exportExcel()
		},
		create(){
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
				invoiceRecordApi.del(row.id).then(res=>{
					// this.list.splice($index,1)
					this.reload()
					this.$message.success('删除成功')
				})
			})
		},
		openSummaryListDialog(){
			this.$refs.summaryListDialog.open({ hasDelivery:1,toInvoice:1})
		},
		createBySummary({row}){
			let data = this.$commonJs.obj.copyByKey(row,[
				'project_id','project_no','project_name','contract_no','contract_id','project_customer','project_area','delivery_area_total','settlement_price_total','invoice_price_total','no_invoice_price',
			])
			this.$refs.summaryFormDialog.open(data)
		},
		reload(){
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