<template>
	<div>
		<div style='margin:10px 0px'>
			<el-button-group>
				<el-button type='primary' @click='create' icon='el-icon-edit'>创建公司</el-button>
			</el-button-group>
		</div>
		<list ref='list' init show-selection>
    	<el-table-column slot='column' label='操作' fixed='right' align='center' width='70'>
				<template slot-scope='{row}'>
					<el-button  size='mini' type='text' icon='el-icon-edit' @click='edit(row)' />	
					<el-button  size='mini' type='text' icon='el-icon-delete' @click='del(row)'/>
				</template>
			</el-table-column>
  	</list>
		<edit-dialog ref='editDialog' @updated='reload'></edit-dialog>
	</div>
</template>

<script>
import list from '@/components/sys/company/list'
import editDialog from '@/components/sys/company/editDialog'

export default {
	components:{ 
		list, 
		editDialog
	},
	data(){
		return {
		
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
				
			})
		},
		edit(row){
			this.$refs.editDialog.open().then(that=>{
				that.initData(row)
			})
		},
		//删除
		del(row){
			this.$refs.list.del(row)
		},
		openSummaryListDialog(){
			this.$refs.summaryListDialog.open({ hasDelivery:1,toInvoice:1})
		},
		reload(){
			this.$refs.list.reload()
		},
		copy({row}){
			this.$refs.editDialog.open().then(that=>{
				that.create().then(res=>{
					let copyData = this.$commonJs.obj.copyByKey(row,['model','company_id','supplier_name','buy_date','price','amount','sn','remarks'])
					that.assign(copyData).clearValidate()
				})
			})
		}
	}
}
</script>