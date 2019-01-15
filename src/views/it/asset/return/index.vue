<template>
	<div>
		<div style='margin:10px 0px'>
			<el-button-group>
				<el-button type='primary' @click='create' icon='el-icon-edit'>创建交还单</el-button>
				<el-button @click='printBatch' icon='el-icon-printer'>批量打印</el-button>
			</el-button-group>
			
			<!-- <el-badge :value='toInvoiceProjectTotal'>
				<el-button size='small' type='danger' :loading='toInvoiceProjectLoading' @click='openSummaryListDialog'>待开票项目</el-button>
			</el-badge> -->
		</div>
		<list ref='list' init show-selection>
    	<el-table-column slot='column' label='操作' fixed='right' align='center' width='80'>
				<template slot-scope='scope'>
					<el-button  size='mini' type='text' icon='el-icon-edit' @click='edit(scope)' />	
					<el-button  size='mini' type='text' icon='el-icon-printer' @click='print(scope)'/>
				</template>
			</el-table-column>
  	</list>
		<edit-dialog ref='editDialog' @updated='reload'></edit-dialog>
		<print-record ref='printRecord' />
	</div>
</template>

<script>
import list from '@/components/it/asset/return/list'
import editDialog from '@/components/it/asset/return/editDialog'
import printRecord from '@/components/it/asset/return/printRecord'

export default {
	components:{ 
		list, 
		editDialog,
		printRecord
	},
	data(){
		return {
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
		exportExcel(){
			this.$refs.list.exportExcel()
		},
		create(){
			this.$refs.editDialog.open().then(that=>{
				that.create()
			})
		},
		edit({row}){
			this.$refs.editDialog.open().then(that=>{
				that.initData(row)
			})
		},
		openSummaryListDialog(){
			this.$refs.summaryListDialog.open({ hasDelivery:1,toInvoice:1})
		},
		reload(){
			this.$refs.list.reload()
		},
		print({row}){
			this.$refs.printRecord.open().then(that=>{
				that.getData({ids:row.id})
			})
		},
		printBatch(){
			if(this.$refs.list.selectionList.length==0){
				this.$message.warning('未选择交还单')
				return false
			}
			let ids = this.$refs.list.selectionList.map(d=>{
				return d.id
			})
			this.$refs.printRecord.open().then(that=>{
				that.getData({ids:ids.join(',')})
			})
		}
	}
}
</script>