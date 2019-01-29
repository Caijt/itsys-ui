<template>
	<div>
		<el-tabs value="summary">
			<el-tab-pane label="近期资产统计" name="summary">
				<el-alert 
			    title="以下数据仅统计近期入库的资产，如需更详细的统计数据，请到相关页面进行查询"
			    type="success"
			    style='margin-bottom:10px'>
			    <div>
			    	<el-button type='text' size='mini' @click='$router.push("/it/asset/statistic/time")'>[ 时段统计 ]</el-button>
			    </div>
			  </el-alert>
	    	<time-statistic hide-query chart-height='300px' ref='timeStatistic'/>
	    </el-tab-pane>
	    <el-tab-pane name="near" v-if='hasPath("/it/asset/query/asset")'>
	    	<span slot="label">
	    		<el-badge :hidden='!nearTotal' class='_my-bagde' :value='nearTotal'>
	    			近期资产
	    		</el-badge>
	    	</span>
	    	<el-alert 
			    title="以下仅显示近10天内提交的资产录入记录，如需更详细的资产数据，请到相关页面进行查询"
			    type="success"
			    style='margin-bottom:10px'>
			    <div>
			    	<el-button type='text' size='mini' @click='$router.push("/it/asset/query/asset")'>[ 资产查询 ]</el-button>
			    </div>
			  </el-alert>
	    	<asset-list 
	    		:params='{isNear:1}' 
	    		hide-query 
	    		init 
	    		max-height='250' 
	    		no-page 
	    		hide-edit-field
	    		sort-prop='create_time'
	    		@loaded='({total})=>{nearTotal=total}'/>
	    </el-tab-pane>
	    <el-tab-pane name="useReturn" v-if='hasPath("/it/asset/query/useReturn")'>
	    	<span slot="label">
	    		<el-badge :hidden='!useReturnTotal' class='_my-bagde' :value='useReturnTotal'>
	    			近期领用
	    		</el-badge>
	    	</span>
	    	<el-alert 
			    title="以下仅显示近10天内提交的资产领用交还记录，如需更详细的数据，请到相关页面进行查询"
			    type="success"
			    show-icon
			    style='margin-bottom:10px'>
			    <div>
			    	<el-button type='text' size='mini' @click='$router.push("/it/asset/stockWarning")'>[ 领用交还明细 ]</el-button>
			    </div>
			  </el-alert>
	    	<use-return-list 
	    		:params='{isNear:1}' 
	    		hide-query 
	    		init 
	    		max-height='250' 
	    		no-page 
	    		@loaded='({total})=>{useReturnTotal=total}'/>
	    </el-tab-pane>
	    <el-tab-pane name="repair" v-if='hasPath("/it/asset/repair")'>
	    	<span slot="label">
	    		<el-badge :hidden='!repairTotal' class='_my-bagde' :value='repairTotal'>
	    			资产维修
	    		</el-badge>
	    	</span>
	    	<el-alert 
			    title="以下资产仍在维修中，请及时跟进维修进度"
			    type="warning"
			    show-icon
			    style='margin-bottom:10px'>
			    <div>
			    	<el-button type='text' size='mini' @click='$router.push("/it/asset/repair")'>[ 资产维修 ]</el-button>
			    </div>
			  </el-alert>
	    	<repair-list 
	    		:params='{status:0}' 
	    		hide-query 
	    		init 
	    		max-height='250' 
	    		no-page 
	    		@loaded='({total})=>{repairTotal=total}'/>
	    </el-tab-pane>
	    <el-tab-pane name="stockWarning" v-if='hasPath("/it/asset/stockWarning")'>
	    	<span slot="label">
	    		<el-badge :hidden='!stockWarningTotal' class='_my-bagde' :value='stockWarningTotal'>
	    			库存预警
	    		</el-badge>
	    	</span>
	    	<el-alert 
			    title="以下资产库存数量已到达或低于预警值，请及时进行资产采购补充库存"
			    type="warning"
			    show-icon
			    style='margin-bottom:10px'>
			    <div>
			    	<el-button type='text' size='mini' @click='$router.push("/it/asset/stockWarning")'>[ 库存预警 ]</el-button>
			    </div>
			  </el-alert>
	    	<stock-warning-list 
	    		:params='{status:1}' 
	    		hide-query 
	    		init 
	    		max-height='250' 
	    		no-page 
	    		hide-edit-fields
	    		@loaded='({total})=>{stockWarningTotal=total}'/>
	    </el-tab-pane>	    
	  </el-tabs>		
	</div>
</template>
<script>
	import assetList from './list'
	import timeStatistic from './statistic/time'
	import stockWarningList from './stockWarning/list'
	import useReturnList from './useReturn/list'
	import repairList from './repair/list'

	export default {
		components:{
			assetList,
			timeStatistic,
			stockWarningList,
			useReturnList,
			repairList
		},
		data(){
			return {
				nearTotal:'..',
				stockWarningTotal:'..',
				useReturnTotal:'..',
				repairTotal:'..',
			}
		},
		mounted(){
			this.initData()
		},
		methods:{
			initData(){
				this.$refs.timeStatistic.initData()
			},
			hasPath(path){
				return this.$commonJs.hasUserPath(path)
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