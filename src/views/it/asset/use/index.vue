<template>
	<div>
		<div style='margin:10px 0px'>
			<el-button-group>
				<el-button type='primary' @click='create' icon='el-icon-edit'>创建领用单</el-button>
				<el-button @click='printBatch' icon='el-icon-printer'>打印标签</el-button>
			</el-button-group>
			
			<!-- <el-badge :value='toInvoiceProjectTotal'>
				<el-button size='small' type='danger' :loading='toInvoiceProjectLoading' @click='openSummaryListDialog'>待开票项目</el-button>
			</el-badge> -->
		</div>
		<list ref='list' init show-selection>
    	<el-table-column slot='column' label='操作' fixed='right' align='center' width='100'>
				<template slot-scope='scope'>
					<el-button  size='mini' type='text' icon='el-icon-edit' @click='edit(scope)' />	
					<el-button  size='mini' type='text' icon='el-icon-delete' @click='del(scope)'/>
					<el-dropdown style='margin-left:10px'>
					  <el-button type="text" icon='el-icon-more'/>
					  <el-dropdown-menu slot="dropdown">
					  	<el-dropdown-item @click.native='copy(scope)' >复制</el-dropdown-item>
					    <el-dropdown-item @click.native='print(scope)' divided>打印标签</el-dropdown-item>
					    <el-dropdown-item>领用交还</el-dropdown-item>
					    <el-dropdown-item>维修</el-dropdown-item>
					  </el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
  	</list>
		<edit-dialog ref='editDialog' @updated='reload'></edit-dialog>
		<label-print ref='labelPrint' />
	</div>
</template>

<script>
import list from '@/components/it/asset/use/list'
import editDialog from '@/components/it/asset/use/editDialog'
import labelPrint from '@/components/it/asset/labelPrint'

export default {
	components:{ 
		list, 
		editDialog,
		labelPrint
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
		//删除
		del(scope){
			this.$refs.list.del(scope)
		},
		openSummaryListDialog(){
			this.$refs.summaryListDialog.open({ hasDelivery:1,toInvoice:1})
		},
		reload(){
			this.$refs.list.reload()
		},
		print({row}){
			this.$refs.labelPrint.open().then(that=>{
				that.getData({ids:row.id})
			})
		},
		printBatch(){
			if(this.$refs.list.selectionList.length==0){
				this.$message.warning('未选择资产数据')
				return false
			}
			let ids = this.$refs.list.selectionList.map(d=>{
				return d.id
			})
			this.$refs.labelPrint.open().then(that=>{
				that.getData({ids:ids.join(',')})
			})
		},
		copy({row}){
			this.$refs.editDialog.open().then(that=>{
				that.create().then(res=>{
					let copyData = this.$commonJs.obj.copyByKey(row,['model','company_id','supplier_name','buy_date','price','amount','sn','remarks'])
					that.assign(copyData).clearValidate()
				})
			})
		},
		test2(){
			this.$refs.list.$refs.tableList.clearSelection()
		}
	}
}
</script>