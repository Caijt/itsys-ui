<template>
	<div>
		<el-alert
	    title="以项目为单位统计回款数据，如果项目数量比较多，图表只统计回款金额前10位的项目"
	    type="warning" 
	    :closable="false"
	    style='margin-bottom: 15px'>
		</el-alert>
		<divider title='统计图表'></divider>
		<project-chart ref='projectChart'/>
		<divider title='统计列表'></divider>
		<project-list ref='projectList' />
	</div>
</template>
<script>
import projectChart from '@/components/cw/receivePayment/statistic/project'
import projectList from '@/components/cw/receivePayment/statistic/projectList'

export default {
	components:{ projectList,projectChart },
	mounted(){
		this.$refs.projectList.initData()
		this.$refs.projectChart.initData()
	},
	methods:{
	}
}
</script>