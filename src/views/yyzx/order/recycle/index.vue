<template>
	<div>
		<order-list :params='{isDel:1}' ref='orderList'>
			<template slot='column'>
				<el-table-column label='取消原因' fixed width='120' prop='del_remarks' show-overflow-tooltip>
				</el-table-column>
				<el-table-column label='操作' fixed='right' align='center' width='90'>
					<template slot-scope='scope'>
						<el-button  size='mini' type='text' @click='recovery(scope)'>恢复</el-button>
						<el-button  size='mini' type='text' @click='del(scope)'>删除</el-button>
					</template>
				</el-table-column>
			</template>
		</order-list>
	</div>
</template>
<script>
	import orderList from '@/components/yyzx/order/list'	
	import orderApi from '@/api/yyzx/order'
	export default {
		components:{
			orderList		
		},
		data(){
			return {
				
			}
		},
		mounted(){
			this.$refs.orderList.initData()
		},
		methods:{
			recovery({ row,$index }){
				let confirmText = '确定要恢复？'
				this.$confirm(confirmText,'提示',{
					type: 'warning'
				}).then(()=>{
					orderApi.recovery(row.id).then(res=>{
						this.$message.success('恢复成功')
						this.reload()					
					})
				})
			},
			del({ row,$index }){
				let confirmText = '确定要永久删除？删除后就无法恢复！'
				this.$confirm(confirmText,'提示',{
					type: 'warning'
				}).then(()=>{
					orderApi.del(row.id).then(res=>{
						this.$message.success('删除成功')
						this.reload()					
					})
				})
			},
			reload(){
				this.$refs.orderList.reload()
			}
		}
	}
</script>