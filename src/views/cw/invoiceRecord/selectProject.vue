<template>
	<span>
		<el-button type='primary' size='small' @click='selectProject'>开票登记</el-button>
		<el-badge :value="toInvoiceProjectTotal" >
			<el-button type='danger' size='small' @click='selectProject'>待开票项目</el-button>
		</el-badge>
  	<el-dialog 
  		class='c-dialog-small' title='选择项目进行开票' :visible.sync='dialogShow' 
			width='80%' top='2vh' @open='openDialog' >
			<project-summary-list 
				ref='projectSummaryList' in-dialog size='small' :params='params' max-height='300'>
				<el-table-column slot='column' label='操作' fixed='right' width='60' align='center'>
					<template slot-scope='scope'>
						<el-button size='mini' type='text' @click='createRecord(scope)'>开票</el-button>
					</template>
				</el-table-column>
			</project-summary-list>
		</el-dialog>
	</span>
</template>
<script>
	import projectSummaryList from '@/components/cw/summary/projectList'
	import invoiceRecordApi from '@/api/cw/invoiceRecord'
	import qs from 'qs'
	export default {
		components:{ projectSummaryList },
		data:()=>({
			loading:true,
			toInvoiceProjectTotal:0,
			dialogShow:false,
			params:{
				toInvoice:1,
				hasArrear:0
			}
		}),
		created(){
			this.getToInvoiceProjectTotal()
		},
		methods:{
			getToInvoiceProjectTotal(){
				this.loading = true
				invoiceRecordApi.getToInvoiceProjectTotal().then(res=>{
					this.toInvoiceProjectTotal=res.data
					this.loading = false
				})
			},
			openDialog(){
				this.$nextTick(()=>{
					this.$refs.projectSummaryList.initData()
				})
			},
			selectProject({ noInvoice = 0 }){
				this.params.noInvoice = noInvoice
				this.dialogShow = true
			},
			createRecord({row}){
				this.$emit('create-record',{row})
			},
			reload(){
				this.getToInvoiceProjectTotal()
				this.$refs.projectSummaryList.reload()
			},
			exportExcel(){
				this.$emit('export-excel')
			}
		}
	}
</script>