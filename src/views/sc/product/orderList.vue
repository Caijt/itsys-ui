<template>
	<el-dialog :visible.sync="dialogShow" width='80%'>
		<el-table 
  		:data='list' 
  		ref='tableList'
  		v-loading='loading' border stripe>
			<el-table-column prop='order_no' fixed label='下单编号' width='100'></el-table-column>
			<el-table-column prop='product_status' label='状态' width='110'></el-table-column>
			<el-table-column label='生产进度' width='120' align='center'>
				<template slot-scope='scope'>
					<el-progress text-inside :stroke-width='18' :status='scope.row.is_finish?"success":""' :percentage="getProgress(scope)"></el-progress>
				</template>
			</el-table-column>
			<el-table-column prop='product_date' label='生产日期' width='100' align='center'></el-table-column>
			<el-table-column label='完成日期' width='100' align='center'>
				<template slot-scope='scope'>
					<el-tooltip v-if='scope.row.is_finish' :content='"生产时长："+getOrderDays(scope)+"天"'>
						<el-tag type='success' size='mini'>{{ scope.row.finish_date }}</el-tag>
					</el-tooltip>
					<el-tag size='mini' v-else>已下单 {{ getOrderDays(scope) }} 天</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop='order_amount' label='订单数量' align='right' width='110'></el-table-column>
			<el-table-column prop='order_area' label='订单面积' align='right' width='110'>
				<template slot-scope='scope'>
					<span>{{ scope.row.order_area }}㎡</span>
				</template>
			</el-table-column>
			<el-table-column prop='unfinish_area' label='未完成面积' align='right' width='110'>
				<template slot-scope='scope'>
					<span>{{ scope.row.unfinish_area }}㎡</span>
				</template>
			</el-table-column>

			<el-table-column prop='series' label='系列' width='110'></el-table-column>
			<el-table-column prop='model' label='窗型' width='110'></el-table-column>
			<el-table-column prop='window_style' label='闭窗器样式' width='110'></el-table-column>
			
			<el-table-column prop='update_time' label='更新时间' align='center' width='140'>
				<template slot-scope='scope'>
					<span>{{scope.row.update_time | formatDate}}</span>
				</template>
			</el-table-column>
		</el-table>
	</el-dialog>
</template>
<script>
	import productApi from '@/api/sc/product'
	import commonJs from '@/utils/common'
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
				productApi.getListByProject(projectId).then(res=>{
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
			},
			getProgress({row}){
			if(row.unfinish_area > row.order_area) return 0
			return commonJs.round((row.order_area-row.unfinish_area) / row.order_area) 
		}
		}
	}
</script>