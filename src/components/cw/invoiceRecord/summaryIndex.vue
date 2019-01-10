<template>
	<div>
		<el-tabs value="summary">
			<el-tab-pane label="近期开票统计" name="summary">
				<el-alert 
			    title="以下数据仅统计近期开票，如需更详细的统计数据，请到相关页面进行查询"
			    type="success"
			    style='margin-bottom:10px'>
			    <div>
			    	<el-button type='text' size='mini' @click='$router.push("/cw/invoiceRecord/statistic/time")'>[ 时段统计 ]</el-button>
			    </div>
			  </el-alert>
	    	<time-statistic hide-query chart-height='300px' ref='timeStatistic'/>
	    </el-tab-pane>
	    <el-tab-pane name="near" >
	    	<span slot="label">
	    		<el-badge :hidden='!nearTotal' class='_my-bagde' :value='nearTotal'>
	    			近期开票
	    		</el-badge>
	    	</span>
	    	<el-alert 
			    title="以下仅显示近10天内提交的开票记录，如需更详细的开票数据，请到相关页面进行查询"
			    type="success"
			    style='margin-bottom:10px'>
			    <div>
			    	<el-button type='text' size='mini' @click='$router.push("/cw/invoiceRecord/query")'>[ 开票查询 ]</el-button>
			    </div>
			  </el-alert>
	    	<invoice-list 
	    		:params='{isNear:1}' 
	    		hide-query 
	    		init 
	    		max-height='250' 
	    		no-page 
	    		hide-edit-field
	    		sort-prop='update_time'
	    		@loaded='({total})=>{nearTotal=total}'/>
	    </el-tab-pane>
	  </el-tabs>
	</div>
</template>
<script>
	import invoiceList from './list'
	import timeStatistic from './statistic/time'
	export default {
		components:{
			invoiceList,
			timeStatistic
		},
		data(){
			return {
				nearTotal:'..',
				toWriteoffTotal:'..'
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
<style lang='scss'>
	._my-bagde{
		.el-badge__content{
			top:8px !important;
			right:2px !important;
		}
	}
		
</style>