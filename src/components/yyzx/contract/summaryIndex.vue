<template>
	<div>
		<el-tabs value="summary">
			<el-tab-pane label="近期合同统计" name="summary">
				<el-alert 
			    title="以下数据仅统计近期合同，如需更详细的统计数据，请到相关页面进行查询"
			    type="success"
			    style='margin-bottom:10px'>
			    <div>
			    	<el-button type='text' size='mini' @click='$router.push("/yyzx/contract/timeStatistic")'>[ 时段统计 ]</el-button>
			    </div>
			  </el-alert>
	    	<time-statistic chart-height='300px' ref='timeStatistic' hide-query/>
	    </el-tab-pane>
	    <el-tab-pane name="near" >
	    	<span slot="label">
	    		<el-badge :hidden='!nearContractTotal' class='_my-bagde' :value='nearContractTotal'>近期合同</el-badge>
	    	</span>
	    	<el-alert 
			    title="以下仅显示近10天内新增的合同，如需更详细的订单数据，请到相关页面进行查询"
			    type="success"
			    style='margin-bottom:10px'>
			    <div>
			    	<el-button type='text' size='mini' @click='$router.push("/yyzx/contract/progress")'>[ 合同进度查询 ]</el-button>
			    </div>
			  </el-alert>
	    	<contract-list ref='nearContractList' :params='{isNear:1}' hide-query init max-height='200' no-page @loaded='({total})=>{nearContractTotal=total}'></contract-list>
	    </el-tab-pane>
	    <el-tab-pane name="fill">
	    	<span slot="label">
	    		<el-badge :hidden='!fillContractTotal' class='_my-bagde' :value='fillContractTotal'>待完善合同</el-badge>
	    	</span>
	    	<el-alert 
			    title="以下合同是在项目立项时创建的，只有一个合同编号，其它字段需要合同专员进行完善，请到相关页面进行处理"
			    type="warning"
			    show-icon
			    style='margin-bottom:10px'>
			    <div>
			    	<el-button type='text' size='mini' @click='$router.push("/yyzx/contract/list")'>[ 合同录入 ]</el-button>
			    </div>
			  </el-alert>
	    	<contract-list ref='fillContractList' :params='{toFill:1}'' hide-query init max-height='200' no-page @loaded='({total})=>{fillContractTotal=total}'></contract-list>
	    </el-tab-pane>
	  </el-tabs>
	</div>
</template>
<script>
	import contractList from './list'
	import timeStatistic from './statistic/time'
	export default {
		components:{
			contractList,
			timeStatistic
		},
		data(){
			return {
				nearContractTotal:0,
				fillContractTotal:0
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