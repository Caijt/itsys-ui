<template>
	<div>
		<el-tabs value="summary">
			<el-tab-pane label="近期储运统计" name="summary">
				<el-alert 
			    title="以下数据仅统计近期入库发货数据，如需更详细的统计数据，请到相关页面进行查询"
			    type="success"
			    style='margin-bottom:10px'>
			    <div>
			    	<el-button type='text' size='mini' @click='$router.push("/cy/timeStatistic")'>[ 时段统计 ]</el-button>
			    </div>
			  </el-alert>
	    	<time-statistic ref='timeStatistic' chart-height='300px' hide-query />
	    </el-tab-pane>
	    <el-tab-pane name="toProduce" >
	    	<span slot="label">
	    		<el-badge :hidden='!toProduceTotal' class='_my-bagde' :value='toProduceTotal'>待入库订单</el-badge>
	    	</span>
	    	<el-alert 
			    title="待进行入库的订单，需要进行成品入库操作，请到相关页面进行处理"
			    type="warning"
			    show-icon
			    style='margin-bottom:10px'>
			    <div>
			    	<el-button type='text' size='mini' @click='$router.push("/cy/store")'>[ 成品入库 ]</el-button>
			    </div>
			  </el-alert>
	    	<store-list 
	    		:params='{ toStorage:1 }' 
	    		hide-query 
	    		init 
	    		max-height='200' 
	    		no-page 
	    		@loaded='({total})=>{toProduceTotal=total}' />
	    </el-tab-pane>
	    <el-tab-pane name="toOutProduce" >
	    	<span slot="label">
	    		<el-badge :hidden='!toOutProduceTotal' class='_my-bagde' :value='toOutProduceTotal'>待发货订单</el-badge>
	    	</span>
	    	<el-alert 
			    title="待进行发货的订单，需要进行成品发货操作，请到相关页面进行处理"
			    type="warning"
			    show-icon
			    style='margin-bottom:10px'>
			    <div>
			    	<el-button type='text' size='mini' @click='$router.push("/cy/delivery")'>[ 成品发货 ]</el-button>
			    </div>
			  </el-alert>
	    	<delivery-list 
	    		:params='{ toDelivery:1 }' 
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
	import storeList from '@/components/cy/store/summary/list'
	import deliveryList from '@/components/cy/delivery/summary/list'

	export default {
		components:{
			timeStatistic,
			storeList,
			deliveryList
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