<template>
	<div>
		<div style='margin:10px 0px'>
			<el-badge :value='toFileTotal'>
				<el-button size='small' type='danger' :loading='toFileTotalLoading' @click='openTodoDialog'>待归档色样</el-button>
				<todo-dialog ref='todoDialog'>
					<el-table-column slot='column' label='操作' width='60' fixed='right' align='center'>
						<template slot-scope='scope'>
							<el-button size='mini' type='text' @click='createByTodo(scope)'>归档</el-button>
						</template>
					</el-table-column>
				</todo-dialog>
			</el-badge>
			<el-badge :value='toDeliveryTotal'>
				<el-button size='small' type='success' :loading='toDeliveryTotalLoading' @click='openToDeliveryDialog' style='margin-left: 10px'>待寄出色样</el-button>
				<to-delivery-dialog ref='toDeliveryDialog'>
					<el-table-column slot='column' label='操作' width='60' fixed='right' align='center'>
						<template slot-scope='scope'>
							<el-button size='mini' type='text' @click='createByToDelivery(scope)'>寄出</el-button>
						</template>
					</el-table-column>
				</to-delivery-dialog>
			</el-badge>
		</div>
		<el-tabs v-model='tabName' @tab-click='reload'>
			<el-tab-pane label='色样归档记录' name='list'>
				<list ref='list' @del='reload' init>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='60'>
						<template slot-scope='scope'>
							<el-button  size='mini' type='text' @click='info(scope)'>详情</el-button>
						</template>
					</el-table-column>
				</list>
			</el-tab-pane>
			<el-tab-pane label='色样寄出记录' name='delivery'>
				<delivery-list ref='deliveryList'>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='60'>
						<template slot-scope='scope'>
							<el-button  size='mini' type='text' @click='info(scope)'>详情</el-button>
						</template>
					</el-table-column>
				</delivery-list>
			</el-tab-pane>
		</el-tabs>
		<form-dialog ref='formDialog' @saved='reload'></form-dialog>
		<delivery-form-dialog ref='deliveryFormDialog' @saved='reload'></delivery-form-dialog>
		<progress-info ref='progressInfo'/>
	</div>
</template>
<script>
	import list from '@/components/yyzx/colorSample/list'
	import deliveryList from '@/components/yyzx/colorSample/deliveryList'
	import todoDialog from '@/components/yyzx/colorSample/todoListDialog'
	import toDeliveryDialog from '@/components/yyzx/colorSample/toDeliveryListDialog'
	import summaryList from '@/components/yyzx/colorSample/summary/list'
	import colorSampleApi from '@/api/yyzx/colorSample'
	import formDialog from '@/components/yyzx/colorSample/formDialog'
	import deliveryFormDialog from '@/components/yyzx/colorSample/deliveryFormDialog'
	import progressInfo from '@/components/xs/colorSample/progressInfo'
	export default {
		components:{
			list,
			deliveryList,
			todoDialog,
			summaryList,
			formDialog,
			toDeliveryDialog,
			deliveryFormDialog,
			progressInfo
		},
		data(){
			return {
				tabName:'list',
				toFileTotal:0,
				toDeliveryTotal:0,
				toFileTotalLoading:true,
				toDeliveryTotalLoading:true
			}
		},
		mounted(){
			this.getToFileTotal()
			this.getToDeliveryTotal()
		},
		methods:{
			getToFileTotal(){
				this.toFileTotalLoading = true
				colorSampleApi.getToFileTotal().then(res=>{
					this.toFileTotal = res.data
					this.toFileTotalLoading = false
				})
			},
			getToDeliveryTotal(){
				this.toDeliveryTotalLoading = true
				colorSampleApi.getToDeliveryTotal().then(res=>{
					this.toDeliveryTotal = res.data
					this.toDeliveryTotalLoading = false
				})
			},
			openTodoDialog(){
				this.$refs.todoDialog.open()
			},
			openToDeliveryDialog(){
				this.$refs.toDeliveryDialog.open()
			},
			create(){
				this.$refs.formDialog.open()
			},
			createByTodo({ row }){
				let data = this.$commonJs.obj.copyByKey(row,[
					'sample_id','project_name','customer_name','company_name','no','time',
					'color_no','amount','series','material','surface','xc_brand','wj_brand','temperature','receiver','receive_address','receive_tel','remarks',
					'xc_color','wj_color','glass_color','express','status','submit_time','file_time','make_time','salesman'
				])
				this.$refs.formDialog.open(data)
			},
			createByToDelivery({ row }){
				let data = this.$commonJs.obj.copyByKey(row,[
					'sample_id','project_no','project_name','customer_name','company_name','series','material',
					'surface','xc_brand','wj_brand','temperature','xc_color','wj_color','glass_color','express','status','submit_time'
				])
				this.$refs.deliveryFormDialog.open(row)
			},
			edit({row}){
				this.$refs.formDialog.open(row.id)
			},
			details({row}){
				this.$refs.formDialog.open(row.id)
			},
			del(scope){
				this.$refs.list.del(scope)
			},
			reload(){
				this.getToFileTotal()
				this.getToDeliveryTotal()
				this.$refs.todoDialog.show && this.$refs.todoDialog.reload()
				this.$refs.toDeliveryDialog.show && this.$refs.toDeliveryDialog.reload()
				if(this.tabName==='list'){
					this.$refs.list.reload()
				}else{
					if(this.$refs.deliveryList.inited){
						this.$refs.deliveryList.reload()
					}else{
						this.$refs.deliveryList.initData()
					}
				}
			},
			info({row}){
				this.$refs.progressInfo.open(row.sample_id)
			}
		}
	}
</script>