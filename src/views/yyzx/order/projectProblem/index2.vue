<template>
	<div>
		<el-alert
    title="各职能部门为保证其部门经办项目能够顺利有序的完成，在其负责范围内出现异常的情况或问题进行反馈上报。"
    type="success" :closable="false" style='margin-bottom: 15px'>
  	</el-alert>
		<el-tabs type="card" v-model='tabIndex'  @tab-click='tabClick'>
			<el-tab-pane label="问题处理记录" name="list">
		  	<!-- <list @click-project='clickProject'></list> -->
			</el-tab-pane>
	    <el-tab-pane label="项目汇总" name="summary">
	    	<summary-list @click-project='clickProject' ></summary-list>
	    </el-tab-pane>
	  </el-tabs>	
		<project-info ref='projectInfo'></project-info>
	</div>
</template>

<script>

// import List from './list'
import summaryList from './summaryList'
import projectInfo from '@/components/projectInfo'

export default {
	components:{ summaryList,projectInfo },
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