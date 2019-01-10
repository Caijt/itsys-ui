<template>
	<div>
		<el-alert title='以下订单均已完成生产，但生产完成面积与订单下单面积不一致，需手动在此页面进行修正' type='warning' style='margin-bottom: 10px'></el-alert>
		<order-list init :params='{ isDel:0,toCheck:1 }' ref='orderList'>
			<el-table-column slot='column' label='操作' fixed='right' align='center' width='70'>
				<template slot-scope='scope'>
					<el-button  size='mini' type='text' @click='check(scope)'>修正</el-button>	
				</template>
		</el-table-column>
		</order-list>
		<order-form-dialog ref='orderFormDialog' @saved='reload'></order-form-dialog>
	</div>
</template>
<script>
	import orderList from '@/components/yyzx/order/check/list'
	import orderFormDialog from '@/components/yyzx/order/check/formDialog'
	import orderApi from '@/api/yyzx/order'
	export default {
		components:{
			orderList,			
			orderFormDialog
		},
		data(){
			return {
				tabName:'list',
				toOrderProjectTotal:0,
				toOrderProjectLoading:true
			}
		},
		methods:{
			check({row}){
				this.$refs.orderFormDialog.open(row)
			},
			reload(){
				this.$refs.orderList.reload()
			}
		}
	}
</script>