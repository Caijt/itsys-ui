<template>
	<div>
		<el-alert
    title="运营中心对已立项项目的运营过程中对各部门反馈的问题以及发现的问题及时处理，对问题的解决方案和结果选择性登记作为备忘记录，作为相关决策依据"
    type="success" :closable="false" style='margin-bottom: 15px'>
  	</el-alert>
		<el-tabs type="card" v-model='tabIndex'  @tab-click='tabClick'>
			<el-tab-pane label="问题处理记录" name="list">
		  	<list @click-project='clickProject'></list>
			</el-tab-pane>
	    <el-tab-pane label="项目汇总" name="summary">
	    	<summary-list @click-project='clickProject' ></summary-list>
	    </el-tab-pane>
	  </el-tabs>	
	  <project-details ref='projectDetails'></project-details>
	</div>
</template>

<script>
import List from './list'
import SummaryList from './summaryList'
import projectDetails from '@/components/projectDetails'

export default {
	components:{ List, SummaryList,projectDetails },
	data(){
		return {
			tabIndex:'list',
			loading: true
		}
	},

	methods:{
		tabClick({name}){
			// let ref=(name=='summary'?'tableList':'tableTodo')
			// setTimeout(()=>{
			// 	this.$refs[ref].doLayout()
			// },100)
		},	
		clickProject(projectId){
			this.$refs.projectDetails.open(projectId)
		}
	}
	
}
</script>
<style>
	._contract-badge .el-badge__content.is-fixed{
		top:10px;
		right:1px;
	}
	._productplan-table .el-table__expanded-cell{
		padding:15px 30px 20px;
	}
</style>