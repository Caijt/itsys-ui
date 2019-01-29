<template>
	<div>
		<el-tabs value="summary">
			<el-tab-pane label="近期回款统计" name="summary">
				<el-alert 
			    title="以下数据仅统计近期回款，如需更详细的统计数据，请到相关页面进行查询"
			    type="success"
			    style='margin-bottom:10px'>
			    <div>
			    	<el-button type='text' size='mini' @click='$router.push("/cw/receivePayment/statistic/time")'>[ 时段统计 ]</el-button>
			    </div>
			  </el-alert>
	    	<time-statistic hide-query chart-height='300px' ref='timeStatistic'/>
	    </el-tab-pane>
	    <el-tab-pane name="near" >
	    	<span slot="label">
	    		<el-badge :hidden='!nearTotal' class='_my-bagde' :value='nearTotal'>
	    			近期回款
	    		</el-badge>
	    	</span>
	    	<el-alert 
			    title="以下仅显示近10天内提交的门窗订单，如需更详细的订单数据，请到相关页面进行查询"
			    type="success"
			    style='margin-bottom:10px'>
			    <div>
			    	<el-button type='text' size='mini' @click='$router.push("/cw/receivePayment/customerQuery")'>[ 回款查询 ]</el-button>
			    </div>
			  </el-alert>
	    	<payment-list 
	    		:params='{isNear:1}' 
	    		hide-query init max-height='250' no-page 
	    		hide-edit-field
	    		sort-prop='submit_time'
	    		@loaded='({total})=>{nearTotal=total}'/>
	    </el-tab-pane>
	    <el-tab-pane name="toProduce" >
	    	<span slot="label"><el-badge :hidden='!toWriteoffTotal' class='_my-bagde' :value='toWriteoffTotal'>待核销回款</el-badge></span>
	    	<el-alert 
			    title="以下回款记录还需进行项目货款核销，分配客户的回款是属于哪些项目货款，请到相关页面进行处理"
			    type="warning"
			    show-icon
			    style='margin-bottom:10px'>
			    <div>
			    	<el-button type='text' size='mini' @click='$router.push("/cw/receivePayment/loanWriteoff")'>[ 项目货款核销 ]</el-button>
			    </div>
			  </el-alert>
	    	<writeoff-list 
	    		:params='{toWriteoff:1}' 
	    		hide-query init max-height='250' no-page 
	    		hide-edit-field
	    		sort-prop='submit_time'
	    		@loaded='({total})=>{toWriteoffTotal=total}'/>
	    </el-tab-pane>
	  </el-tabs>
	</div>
</template>
<script>
	import paymentList from './edit/list'
	import writeoffList from './loanWriteoff/list'
	import timeStatistic from './statistic/time'
	export default {
		components:{
			writeoffList,
			paymentList,
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
<style lang='less'>
	._my-bagde{
		.el-badge__content{
			top:8px !important;
			right:2px !important;
		}
	}
		
</style>