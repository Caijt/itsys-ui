<template>
	<div>
		<el-alert
	    title="以项目为单位汇总应收欠款情况"
	    type="warning" 
	    :closable="false"
	    style='margin-bottom: 10px'>
		</el-alert>
		<div style='margin:5px 0px' >
			<el-button @click='exportExcel'  size='small'>导出Excel</el-button>
		</div>
		<project-summary-list ref='projectSummaryList' >
			
		</project-summary-list>
	</div>
</template>
<script>
import projectSummaryList from '@/components/cw/summary/projectList'
import cwSummaryApi from '@/api/cw/summary'

export default {
	components:{ projectSummaryList },
	mounted(){
		this.$refs.projectSummaryList.initData()
	},
	methods:{
		exportExcel(){
			this.$refs.projectSummaryList.exportExcel()
		}
	}
}
</script>