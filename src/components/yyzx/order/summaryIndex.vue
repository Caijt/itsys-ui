<template>
	<div>
		<el-tabs value="summary">
			<el-tab-pane label="近期订单统计" name="summary">
				<el-alert 
			    title="以下数据仅统计近期订单，如需更详细的统计数据，请到相关页面进行查询"
			    type="success"
			    style='margin-bottom:10px'>
			    <div>
			    	<el-button type='text' size='mini' @click='$router.push("/yyzx/order/timeStatistic")'>[ 时段统计 ]</el-button>
			    </div>
			  </el-alert>
	    	<time-statistic ref='timeStatistic' chart-height='300px' hide-query />
	    </el-tab-pane>
	    <el-tab-pane name="near" >
	    	<span slot="label"><el-badge :hidden='!nearOrderTotal' class='_my-bagde' :value='nearOrderTotal'>近期新增订单</el-badge></span>
	    	<el-alert 
			    title="以下仅显示近10天内提交的订单，如需更详细的订单数据，请到相关页面进行查询"
			    type="success"
			    style='margin-bottom:10px'>
			    <div>
			    	<el-button type='text' size='mini' @click='$router.push("/yyzx/order/progress")'>[ 订单查询 ]</el-button>
			    </div>
			  </el-alert>
	    	<order-list 
	    		:params='{isDel:0,isNear:1}' 
	    		hide-query 
	    		init 
	    		max-height='200' 
	    		no-page 
	    		@loaded='({total})=>{nearOrderTotal=total}' />
	    </el-tab-pane>
	    <el-tab-pane name="check" >
	    	<span slot="label">
	    		<el-badge :hidden='!checkOrderTotal' class='_my-bagde' :value='checkOrderTotal'>待修正订单</el-badge>
	    	</span>
	    	<el-alert 
			    title="以下订单均已完成生产，但生产完成面积与订单下单面积不一致，需手动进行修正，请到相关页面进行处理"
			    type="warning"
			    show-icon
			    style='margin-bottom:10px'>
			    <div>
			    	<el-button type='text' size='mini' @click='$router.push("/yyzx/order/check")'>[ 订单生产修正 ]</el-button>
			    </div>
			  </el-alert>
	    	<order-check-list :params='{ isDel:0,toCheck:1 }' hide-query init max-height='200' no-page @loaded='({total})=>{checkOrderTotal=total}'></order-check-list>
	    </el-tab-pane>
	  </el-tabs>
	</div>
</template>
<script>
	import orderList from '@/components/yyzx/order/list'
	import orderCheckList from '@/components/yyzx/order/check/list'
	import timeStatistic from './statistic/time'

	export default {
		components:{
			orderList,
			orderCheckList,
			timeStatistic
		},
		data(){
			return {
				nearOrderTotal:'..',
				checkOrderTotal:'..'
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