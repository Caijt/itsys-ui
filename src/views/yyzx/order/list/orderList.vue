<template>
	<el-dialog :visible.sync="dialogShow" width='80%'>
		<el-table 
  		:data='list' 
  		ref='tableList'
  		v-loading='loading' border stripe>
			<el-table-column prop='order_no' fixed label='下单编号' width='100'></el-table-column>
			<el-table-column prop='oroder_area' label='下单面积' align='right' width='90'>
				<template slot-scope='scope'>
					<span>{{ scope.row.order_area }}㎡</span>
				</template>
			</el-table-column>
			<el-table-column prop='order_amount' label='下单数量' align='right' width='80'>
			</el-table-column>
			<el-table-column prop='order_date' label='下单日期' align='center' width='110'></el-table-column>
			<el-table-column prop='product_status' label='生产状态' show-overflow-tooltip></el-table-column>
			<el-table-column prop='expect_delivery' label='预计交期' show-overflow-tooltip></el-table-column>
			<el-table-column prop='glass_expect_delivery' label='玻璃加工预计交期' show-overflow-tooltip></el-table-column>
			<el-table-column label='完成日期' width='100' align='center'>
				<template slot-scope='scope'>
					<el-tooltip v-if='scope.row.is_finish' :content='"下单时长："+getOrderDays(scope)+"天"'>
						<el-tag type='success' size='mini'>{{ scope.row.finish_date }}</el-tag>
					</el-tooltip>
					<el-tag size='mini' v-else>已下单 {{ getOrderDays(scope) }} 天</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop='update_time' label='更新时间' align='center' width='140'>
				<template slot-scope='scope'>
					<span>{{scope.row.update_time | formatDate}}</span>
				</template>
			</el-table-column>
		</el-table>
	</el-dialog>
</template>
<script>
	import productplanApi from '@/api/yyzx/order'
	
	export default {
		data(){
			return {
				list:[],
				loading:true,				
				dialogShow: false
			}
		},
		methods:{
			open(projectId){
				this.loading = true
				this.dialogShow = true
				productplanApi.getListByProject(projectId).then(res=>{
					this.list = res.data
					this.loading = false
				})
			},
			getOrderDays({row}){
				let finishDate 
				if(row.is_finish){
					finishDate = this.$moment(row.finish_date)
				}else{
					finishDate = this.$moment()
				}
				return finishDate.diff(this.$moment(row.order_date),'days') + 1
			}
		}
	}
</script>