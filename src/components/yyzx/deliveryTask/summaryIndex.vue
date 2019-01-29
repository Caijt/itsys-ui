<template>
	<div>
		<el-tabs value="summary">
			<el-tab-pane label="近期发货任务统计" name="summary">
				<el-alert 
			    title="以下数据仅统计近期发货任务，如需更详细的统计数据，请到相关页面进行查询"
			    type="success"
			    style='margin-bottom:10px'>
			    <div>
			    	<el-button type='text' size='mini' @click='$router.push("/yyzx/deliveryTask/timeStatistic")'>[ 时段统计 ]</el-button>
			    </div>
			  </el-alert>
	    	<time-statistic chart-height='300px' ref='timeStatistic' hide-query/>
	    </el-tab-pane>
	    <el-tab-pane name="near" >
	    	<span slot="label"><el-badge :hidden='!nearCarTotal' class='_my-bagde' :value='nearCarTotal'>近期发货任务</el-badge></span>
	    	<el-alert 
			    title="以下仅显示近10天内提交的发货任务，如需更详细的任务数据，请到相关页面进行查询"
			    type="success"
			    style='margin-bottom:10px'>
			    <div>
			    	<el-button type='text' size='mini' @click='$router.push("/yyzx/deliveryTask/progress")'>[ 发货进度查询 ]</el-button>
			    </div>
			  </el-alert>
	    	<task-list 
	    		:params='{inFactory:1,isNear:1}' 
	    		hide-query init max-height='250' no-page 
	    		hide-edit-field
	    		sort-prop='submit_time'
	    		@loaded='({total})=>{nearCarTotal=total}'/>
	    </el-tab-pane>
	  </el-tabs>
	</div>
</template>
<script>
	import taskList from './edit/editList'
	import timeStatistic from './statistic/time'

	export default {
		components:{
			taskList,
			timeStatistic
		},
		data(){
			return {
				nearCarTotal:'..',
				toConfirmTotal:'..'
			}
		},
		mounted(){
			this.initData()
		},
		methods:{
			initData(){
				this.$refs.timeStatistic.initData()
			}
		}
	}
</script>
<style lang='less'>
	._my-bagde{
		.el-badge__content{
			top:8px !important;
			right:2px !important;
		}
	}
		
</style>