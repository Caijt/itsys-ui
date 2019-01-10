<template>
	<div>
		<el-alert
	    title="以客户为单位统计回款数据，如果客户数量比较多，图表只统计回款金额前10位的客户"
	    type="warning" 
	    :closable="false"
	    style='margin-bottom: 15px'>
		</el-alert>
		<divider title='统计图表'></divider>
		<customer-chart ref='customerChart'/>
		<divider title='统计列表'></divider>
		<customer-list ref='customerList' />
	</div>
</template>
<script>
import customerChart from '@/components/cw/receivePayment/statistic/customer'
import customerList from '@/components/cw/receivePayment/statistic/customerList'

export default {
	components:{ customerList,customerChart },
	mounted(){
		this.$refs.customerList.initData()
		this.$refs.customerChart.initData()
	},
	methods:{
	}
}
</script>