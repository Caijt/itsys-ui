<template>
	<div>
		<el-alert
	    title="以业绩公司为单位统计开票数据"
	    type="warning" 
	    :closable="false"
	    style='margin-bottom: 15px'>
		</el-alert>
		<divider title='统计图表'></divider>
		<company-chart ref='companyChart'/>
		<divider title='统计列表'></divider>
		<company-list ref='companyList' />
	</div>
</template>
<script>
import companyChart from '@/components/cw/invoiceRecord/statistic/company'
import companyList from '@/components/cw/invoiceRecord/statistic/companyList'

export default {
	components:{ companyList,companyChart },
	mounted(){
		this.$refs.companyList.initData()
		this.$refs.companyChart.initData()
	},
	methods:{
	}
}
</script>