<template>
	<div>
		<el-alert title='内勤人员对订单产品进行发货申请，提交后由储运部进行装车操作' type='warning' style='margin-bottom: 10px'></el-alert>
		<div style='margin:10px 0px'>
			<el-button type='primary' @click='create'>创建任务</el-button>
			<el-button type='success' @click='openImportDialog'>EXCEL导入</el-button>
		</div>
		<el-tabs v-model='tabName' @tab-click='reload'>
			<el-tab-pane label='编辑中' name='edit'>
				<task-list ref='editList' :params='{input_status:0,inUser:1}' hide-submit-field>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='130'>
						<template slot-scope='scope'>
							<el-button  size='mini' type='text' @click='edit(scope)'>编辑</el-button>
							<el-button size='mini' type='text' @click='copy(scope)'>复制</el-button>
							<el-button  size='mini' type='text' @click='del(scope)'>删除</el-button>
						</template>
					</el-table-column>
				</task-list>				
			</el-tab-pane>
			<el-tab-pane label='已提交任务' name='submit'>
				<task-list ref='submitList' :params='{input_status:1,inUser:1}' sort-prop='submit_time' hide-edit-field init>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='130'>
						<template slot-scope='scope'>
							<el-button size='mini' type='text' @click='print(scope)'>打印</el-button>
							<el-button size='mini' type='text' @click='copy(scope)'>复制</el-button>
							<el-button size='mini' type='text' @click='undo(scope)'>撤销</el-button>
						</template>
					</el-table-column>
				</task-list>		
			</el-tab-pane>			
		</el-tabs>
		<edit-dialog ref='editDialog' @updated='reload' />
		<import-dialog ref='importDialog' @updated='reload'/>
		<print-dialog ref='printDialog'/>
	</div>
</template>
<script>
	import taskList from '@/components/yyzx/deliveryTask/edit/editList'
	import editDialog from '@/components/yyzx/deliveryTask/edit/editDialog'
	import importDialog from '@/components/yyzx/deliveryTask/edit/import'
	import printDialog from '@/components/yyzx/deliveryTask/print'

	export default {
		components:{
			taskList,
			editDialog,
			importDialog,
			printDialog
		},
		data(){
			return {				
				tabName:'submit'
			}
		},
		mounted(){
		},
		methods:{				
			create(){
				this.$refs.editDialog.open().then(that=>{
					that.create()
				})
			},
			edit({row}){
				this.$refs.editDialog.open().then(that=>{
					that.getForm(row.id)
				})
			},
			details({row}){
				this.$refs.editDialog.open(row.id)
			},
			del(scope){
				this.$refs.editList.del(scope)
			},
			reload(){
				if(this.tabName==='edit'){
					this.$refs.editList.reload()
				}else{
					this.$refs.submitList.reload()
				}
			},
			undo(scope){
				this.$refs.submitList.undo(scope)
			},
			copy({row}){
				this.$refs.editDialog.open().then(that=>{
					that.create().then(res=>{
						let copyData = this.$commonJs.obj.copyByKey(row,['project','contract_no','company_id','salesman_name','salesman_tel','db_no','fh_no','area_id','plan_send_date','order_no','method','receive_unit','receive_address','receive_name','receive_tel','remarks'])
						that.assign(copyData).clearValidate()
					})
				})
			},
			openImportDialog(){
				this.$refs.importDialog.open()
			},
			print({row}){
				this.$refs.printDialog.open().then(that=>{
					that.get(row.id)
				})
			}
		}
	}
</script>