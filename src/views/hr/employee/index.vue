<template>
	<div>
		<div style='margin:10px 0px'>
			<el-button-group>
				<el-button type='primary' @click='create' icon='el-icon-edit' >员工录入</el-button>
			</el-button-group>
		</div>
		<el-row :gutter='10'>
			<el-col :span='6'>
				<dep-list height='400px' ref='depList' @node-click='nodeClick'/>
			</el-col>
			<el-col :span='18'>
				<employee-list show-checkbox ref='employeeList'>
					<el-table-column fixed='right' label='操作' align='center' width='70' slot='column'>
						<template slot-scope='{row}'>
							<el-button  size='mini' type='text' icon='el-icon-edit' @click='edit(row)' />	
							<el-button  size='mini' type='text' icon='el-icon-delete' @click='del(row)'/>
						</template>
					</el-table-column>
				</employee-list>
			</el-col>
		</el-row>
		<edit-dialog ref='editDialog' @updated='reload'/>
	</div>
</template>
<script>
	import employeeList from '@/components/hr/employee/list'
	import depList from '@/components/hr/dep/treeList'
	import editDialog from '@/components/hr/employee/editDialog'

	export default {
		components:{ depList, employeeList, editDialog },
		data(){
			return {}
		},
		mounted(){
			this.$refs.depList.initData()
			this.$refs.employeeList.initData()
		},
		methods:{
			nodeClick(data){
				this.$refs.employeeList.queryParams.dep_id = data.id
				this.$refs.employeeList.queryParamsLabel.dep_name = data.name
				this.$refs.employeeList.query()
			},
			create(){
				this.$refs.editDialog.open().then(that=>{
					that.create()
				})
			},
			edit(row){
				this.$refs.editDialog.open().then(that=>{
					that.initData(row)
				})
			},
			del(row){
				this.$refs.employeeList.del(row)
			},
			reload(){
				this.$refs.employeeList.reload()
			}
		}
	}
</script>