<template>
	<div>
		<el-tabs value="summary">
			<el-tab-pane label="近期生产统计" name="summary">
				<el-alert 
			    title="以下数据仅统计近期订单，如需更详细的统计数据，请到相关页面进行查询"
			    type="success"
			    style='margin-bottom:10px'>
			    <div>
			    	<el-button type='text' size='mini' @click='$router.push("/sc/timeStatistic")'>[ 时段统计 ]</el-button>
			    </div>
			  </el-alert>
	    	<time-statistic ref='timeStatistic' chart-height='300px' hide-query />
	    </el-tab-pane>
	    <el-tab-pane name="toProduce" >
	    	<span slot="label">
	    		<el-badge :hidden='!toProduceTotal' class='_my-bagde' :value='toProduceTotal'>车间待生产订单</el-badge>
	    	</span>
	    	<el-alert 
			    title="待进行生产的订单，需要进行生产日志录入操作，请到相关页面进行处理"
			    type="warning"
			    show-icon
			    style='margin-bottom:10px'>
			    <div>
			    	<el-button type='text' size='mini' @click='$router.push("/sc/product")'>[ 车间生产任务 ]</el-button>
			    </div>
			  </el-alert>
	    	<produce-order-list 
	    		:params='{ toProduct:1 }' 
	    		hide-query 
	    		init 
	    		max-height='200' 
	    		no-page 
	    		@loaded='({total})=>{toProduceTotal=total}' />
	    </el-tab-pane>
	    <el-tab-pane name="toOutProduce" >
	    	<span slot="label">
	    		<el-badge :hidden='!toOutProduceTotal' class='_my-bagde' :value='toOutProduceTotal'>外协待生产订单</el-badge>
	    	</span>
	    	<el-alert 
			    title="待进行生产的订单，需要进行生产日志录入操作，请到相关页面进行处理"
			    type="warning"
			    show-icon
			    style='margin-bottom:10px'>
			    <div>
			    	<el-button type='text' size='mini' @click='$router.push("/sc/outProduct")'>[ 外协生产任务 ]</el-button>
			    </div>
			  </el-alert>
	    	<produce-out-order-list 
	    		:params='{ toProduct:1 }' 
	    		hide-query 
	    		init 
	    		max-height='200' 
	    		no-page 
	    		@loaded='({total})=>{toOutProduceTotal=total}' />
	    </el-tab-pane>
	  </el-tabs>
	</div>
</template>
<script>
	import timeStatistic from '../statistic/time'
	import produceOrderList from '@/components/sc/product/summary/list'
	import produceOutOrderList from '@/components/sc/outProduct/summary/list'

	export default {
		components:{
			timeStatistic,
			produceOrderList,
			produceOutOrderList
		},
		data(){
			return {
				nearOrderTotal:'..',
				toProduceTotal:'..',
				toOutProduceTotal:'..'
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