<template>
	<div>
		<div style='margin:10px 0px'>
			<el-button type='primary' size='small' @click='createOrder'>创建订单</el-button>
		</div>
		<el-tabs v-model='tabName' @tab-click='reload'>
			<el-tab-pane label='订单列表' name='order'>
				<order-list ref='orderList' init>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='140'>
						<template slot-scope='scope'>
							<el-button  size='mini' type='text' @click='editOrder(scope)'>编辑</el-button>	
							<el-button  size='mini' type='text' @click='openLabel(scope)'>标签</el-button>	
							<el-button  size='mini' type='text' @click='delOrder(scope)'>删除</el-button>	
						</template>
					</el-table-column>
				</order-list>
			</el-tab-pane>
			<el-tab-pane label='门窗标签明细' name='certificate'>
				<list ref='list' @del='reload'>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='90'>
						<template slot-scope='scope' v-if='scope.row.is_code==0'>
							<el-button  size='mini' type='text' @click='edit(scope)'>编辑</el-button>	
							<el-button  size='mini' type='text' @click='del(scope)'>删除</el-button>
						</template>
					</el-table-column>
				</list>
			</el-tab-pane>
		</el-tabs>
		<order-form-dialog ref='orderFormDialog' @changed='reload'/>
		<label-dialog ref='labelDialog' @changed='reload'/>
		<form-dialog ref='formDialog' @changed='reload'/>
	</div>
</template>
<script>
	import list from '@/components/sc/labelPrint/window/list'
	import orderFormDialog from '@/components/sc/labelPrint/window/orderFormDialog'
	import orderList from '@/components/sc/labelPrint/window/orderList'
	import labelDialog from '@/components/sc/labelPrint/window/labelDialog'
	import formDialog from '@/components/sc/labelPrint/window/formDialog'

	export default {
		components:{
			list,
			orderFormDialog,		
			orderList,
			labelDialog,
			formDialog
		},
		data(){
			return {
				tabName:'order',
				toPurchaseOrderTotal:0,
				toOrderProjectLoading:true
			}
		},
		mounted(){
			
		},
		methods:{
			createOrder(){
				this.$refs.orderFormDialog.resetFields().open()
			},
			openLabel({ row }){
				this.$refs.labelDialog.assign(row).open()
			},
			editOrder({row}){
				this.$refs.orderFormDialog.assign(row).open()
			},
			delOrder(scope){
				this.$refs.orderList.del(scope)
			},
			edit({row}){
				this.$refs.formDialog.assign(row).open()
			},
			del(scope){
				this.$refs.list.del(scope)
			},
			reload(){
				if(this.tabName==='order'){
					this.$refs.orderList.reload()
				}else{
					if(this.$refs.list.inited){
						this.$refs.list.reload()
					}else{
						this.$refs.list.initData()
					}
				}
			}
		}
	}
</script>