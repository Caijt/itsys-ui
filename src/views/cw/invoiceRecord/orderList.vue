<template>
	<el-dialog :visible.sync="dialogShow" width='80%'>
		<el-table 
  		:data='list' 
  		ref='tableList'
  		v-loading='loading' border stripe
  		max-height='500'
  		size='small'
  	>
			<el-table-column prop='invoice_no' fixed label='开票号' width='120'></el-table-column>
			<el-table-column prop='invoice_company_name' min-width='100' label='开票单位' show-overflow-tooltip></el-table-column>
			<el-table-column prop='invoice_date' label='开票日期' align='center' width='110'></el-table-column>
			<el-table-column prop='invoice_price' label='开票金额' width='120' align='right'>
				<template slot-scope='{row}'>
					<span>￥{{ row.invoice_price }}</span>
				</template>
			</el-table-column>
			<el-table-column prop='update_user_name' label='录入员'></el-table-column>
			<el-table-column prop='create_time' width='140' label='创建时间' >
				<template slot-scope='{ row }'>
					<span>{{ row.create_time | formatDate }}</span>
				</template>
			</el-table-column>
			<el-table-column prop='update_time' label='最近更新时间' width='140' >
				<template slot-scope='{row}'>
					<span>{{ row.update_time | formatDate }}</span>
				</template>
			</el-table-column>
		</el-table>
	</el-dialog>
</template>
<script>
	import invoiceRecordApi from '@/api/cw/invoiceRecord'
	
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
				invoiceRecordApi.getListByProject(projectId).then(res=>{
					this.list = res.data
					this.loading = false
				})
			}
		}
	}
</script>