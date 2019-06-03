<template>
	<div>
		<!-- <div style='margin:10px 0px'>
			<el-button-group>
				<el-button type='primary' @click='create' icon='el-icon-edit'>创建参数</el-button>
			</el-button-group>
		</div> -->
		<list ref='list'>
    	<el-table-column slot='column' label='操作' fixed='right' align='center' width='60'>
				<template slot-scope='{row}'>
					<el-button  size='mini' type='text' icon='el-icon-edit' @click='edit(row)' />	
				</template>
			</el-table-column>
  	</list>
		<edit-dialog ref='editDialog' @updated='reload'></edit-dialog>
	</div>
</template>

<script>
import list from '@/components/sys/config/list'
import editDialog from '@/components/sys/config/editDialog'

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

	},
	mounted(){
		this.reload()
	},
	methods:{	
		edit(row){
			this.$refs.editDialog.open().then(that=>{
				that.initData({...row,isEdit:1})
			})
		},
		reload(){
			this.$refs.list.reload()
		}
	}
}
</script>