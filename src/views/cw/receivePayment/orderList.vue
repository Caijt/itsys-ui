<template>
	<el-dialog :visible.sync="dialogShow" width='80%'>
		<el-table 
  		:data='list' 
  		ref='tableList'
  		v-loading='loading' border stripe
  		max-height='500'
  		size='small'
  	>
			<el-table-column prop='no' fixed label='回款编号' width='120'></el-table-column>
			<el-table-column prop='payment_date' label='回款日期' align='center' width='110'></el-table-column>
			<el-table-column prop='receive_company_name' label='收款公司' show-overflow-tooltip></el-table-column>
			<el-table-column prop='payment_price' label='回款金额' width='120' align='right'>
				<template slot-scope='scope'>
					<span>￥{{ scope.row.payment_price }}</span>
				</template>
			</el-table-column>
			<el-table-column prop='payment_method' label='回款形式'></el-table-column>
			<el-table-column prop='update_user_name' label='录入员' width='80'></el-table-column>
			<el-table-column 
				prop='create_time' 
				label='创建时间' 			
				width='140' >
				<template slot-scope='{row}'>
					<span>{{ row.create_time | formatDate}}</span>
				</template>
			</el-table-column>
			<el-table-column prop='update_time' label='最新更新时间' width='140'>
				<template slot-scope='scope'>
					<span>{{scope.row.update_time | formatDate}}</span>
				</template>
			</el-table-column>
		</el-table>
	</el-dialog>
</template>
<script>
	import receivePaymentApi from '@/api/cw/receivePaymentRecord'
	
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
				receivePaymentApi.getListByProject(projectId).then(res=>{
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