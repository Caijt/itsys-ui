<template>
	<div>
		<div style='margin:10px 0px'>
			<el-badge :value='toPurchaseOrderTotal'>
				<el-button size='small' type='danger' :loading='toOrderProjectLoading' @click='openTodoDialog'>待打板色样</el-button>
				<todo-dialog ref='todoDialog'>
					<el-table-column slot='column' label='操作' width='60' fixed='right' align='center'>
						<template slot-scope='scope'>
							<el-button size='mini' type='text' @click='createByTodo(scope)'>打板</el-button>
						</template>
					</el-table-column>
				</todo-dialog>
			</el-badge>
		</div>
		<el-tabs v-model='tabName' @tab-click='reload'>
			<el-tab-pane label='色样打板记录' name='list'>
				<list ref='list' @del='reload' init>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='90'>
						<template slot-scope='scope'>
							<el-button size='mini' type='text' @click='edit(scope)' v-show='scope.row.is_finish==0'>编辑</el-button>	
							<el-button size='mini' type='text' @click='info(scope)'>详情</el-button>
						</template>
					</el-table-column>
				</list>
			</el-tab-pane>
			<!-- <el-tab-pane label='打样历史明细' name='list2'>
				<summary-list ref='summaryList' init>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='90'>
						<template slot-scope='scope'>
							<el-button  size='mini' type='text' @click='details(scope)'>详情</el-button>
							<el-button  size='mini' type='text' @click='details(scope)' v-show='scope.row.status=="SUBMIT"'>归档</el-button>
						</template>
					</el-table-column>
				</summary-list>
			</el-tab-pane> -->
		</el-tabs>
		<form-dialog ref='formDialog' @saved='reload'></form-dialog>
		<progress-info ref='progressInfo'/>
	</div>
</template>
<script>
	import list from '@/components/cg/colorSample/list'
	import todoDialog from '@/components/cg/colorSample/todoListDialog'
	import summaryList from '@/components/cg/colorSample/summary/list'
	import colorSampleApi from '@/api/cg/colorSample'
	import formDialog from '@/components/cg/colorSample/formDialog'
	import progressInfo from '@/components/xs/colorSample/progressInfo'
	export default {
		components:{
			list,
			todoDialog,
			summaryList,
			formDialog,
			progressInfo
		},
		data(){
			return {
				tabName:'list',
				toPurchaseOrderTotal:0,
				toOrderProjectLoading:true
			}
		},
		mounted(){
			this.getTodoTotal()
		},
		methods:{
			getTodoTotal(){
				this.toOrderProjectLoading = true
				colorSampleApi.getTodoTotal().then(res=>{
					this.toPurchaseOrderTotal = res.data
					this.toOrderProjectLoading = false
				})
			},
			openTodoDialog(){
				this.$refs.todoDialog.open()
			},
			create(){
				this.$refs.formDialog.open()
			},
			createByTodo({ row }){
				let data = this.$commonJs.obj.copyByKey(row,[
					'sample_id','project_id','project_name','customer_name','company_name','no','time',
					'series','material','file_no','file_date','file_remarks',
					'surface','xc_brand','wj_brand','temperature','xc_color','wj_color','glass_color','express','status','submit_time','file_time','make_time'
				])
				this.$refs.formDialog.open(data)
			},
			edit({row}){
				this.$refs.formDialog.open(row)
			},
			details({row}){
				this.$refs.formDialog.open(row.id)
			},
			del(scope){
				this.$refs.list.del(scope)
			},
			reload(){
				this.getTodoTotal()
				if(this.$refs.todoDialog.show){
					this.$refs.todoDialog.reload()
				}
				if(this.tabName==='list'){
					this.$refs.list.reload()
				}else{
					if(this.$refs.summaryList.inited){
						this.$refs.summaryList.reload()
					}else{
						this.$refs.summaryList.initData()
					}
				}
			},
			info({row}){
				this.$refs.progressInfo.open(row.sample_id)
			}
		}
	}
</script>