<template>
	<div>
		<div style='margin:10px 0px'>
			<el-button-group>
				<el-button type='primary' @click='create' icon='el-icon-edit'>创建维修记录</el-button>
			</el-button-group>
		</div>
		<list ref='list' init>
    	<el-table-column slot='column' label='操作' fixed='right' align='center' width='80'>
				<template slot-scope='scope'>
					<el-button  size='mini' type='text' icon='el-icon-edit' @click='edit(scope)' />	
					<el-button  size='mini' type='text' icon='el-icon-delete' @click='del(scope)'/>
				</template>
			</el-table-column>
  	</list>
		<edit-dialog ref='editDialog' @updated='reload'></edit-dialog>
	</div>
</template>

<script>
import list from '@/components/it/asset/repair/list'
import editDialog from '@/components/it/asset/repair/editDialog'

export default {
	components:{ 
		list, 
		editDialog
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
		reload(){
			this.$refs.list.reload()
		},
		del(scope){
			this.$refs.list.del(scope)
		},
	}
}
</script>