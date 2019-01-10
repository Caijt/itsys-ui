<template>
	<el-dialog :visible.sync="dialogShow" width='80%'>
		<el-table 
  		:data='list' 
  		ref='tableList'
  		v-loading='loading' border stripe>
			<el-table-column prop='order_no' fixed label='下单编号' width='120'></el-table-column>
			<el-table-column label='发货进度' min-width='120' align='center'>
				<template slot-scope='scope'>
					<el-progress text-inside :stroke-width='18' :status='getProgress(scope)>=100?"success":""' :percentage="getProgress(scope)"></el-progress>
				</template>
			</el-table-column>
			<el-table-column prop='first_storage_date' label='首次入库日期' align='center' width='110'>
			</el-table-column>
			<el-table-column prop='storage_area' label='累计入库面积' align='right' width='110'>
				<template slot-scope='scope'>
					<span>{{ scope.row.storage_area}}㎡</span>
				</template>
			</el-table-column>
			<el-table-column prop='storage_date' label='最近入库日期' align='center' width='110'>
			</el-table-column>
			<el-table-column prop='first_delivery_date' label='首次发货日期' align='center' width='110'>
			</el-table-column>
			<el-table-column prop='delivery_area' label='累计发货面积' align='right' width='110'>
				<template slot-scope='scope'>
					<span>{{ scope.row.delivery_area}}㎡</span>
				</template>
			</el-table-column>
			<el-table-column prop='delivery_date' label='最近发货日期' align='center' width='110'>
			</el-table-column>
			<el-table-column prop='delivery_content' label='发货内容描述' show-overflow-tooltip></el-table-column>
			
			<el-table-column prop='update_time' label='更新时间' align='center' width='140'>
				<template slot-scope='scope'>
					<span>{{scope.row.update_time | formatDate}}</span>
				</template>
			</el-table-column>
		</el-table>
	</el-dialog>
</template>
<script>
	import deliveryApi from '@/api/cy/delivery'
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
				deliveryApi.getListByProject(projectId).then(res=>{
					this.list = res.data
					this.loading = false
				})
			},
			getProgress({row}){
				let delivery_area = Number(row.delivery_area)
				let storage_area = Number(row.storage_area)
				if(delivery_area > storage_area ) return 100
				return commonJs.round(delivery_area / storage_area||0)
			}
		}
	}
</script>