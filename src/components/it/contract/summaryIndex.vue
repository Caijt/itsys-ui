<template>
	<div>
		<el-tabs value="near">
	    <el-tab-pane name="near" >
	    	<span slot="label">
	    		<el-badge :hidden='!nearTotal' class='_my-bagde' :value='nearTotal'>
	    			近期合同
	    		</el-badge>
	    	</span>
	    	<el-alert 
			    title="以下仅显示近10天内创建的合同记录，如需更详细的合同数据，请到相关页面进行查询"
			    type="success"
			    style='margin-bottom:10px'>
			    <div>
			    	<el-button type='text' size='mini' @click='$router.push("/it/contract")'>[ 合同管理 ]</el-button>
			    </div>
			  </el-alert>
	    	<contract-list 
	    		:params='{isNear:1}' 
	    		hide-query 
	    		init 
	    		max-height='250' 
	    		no-page 
	    		hide-edit-field
	    		sort-prop='create_time'
	    		@loaded='({total})=>{nearTotal=total}'/>
	    </el-tab-pane>
	    <el-tab-pane name="stockWarning" >
	    	<span slot="label">
	    		<el-badge :hidden='!stockWarningTotal' class='_my-bagde' :value='stockWarningTotal'>
	    			即将到期合同
	    		</el-badge>
	    	</span>
	    	<el-alert 
			    title="以下合同距离失效日期还不到一个月，请及时联系供应商签订新合同"
			    type="warning"
			    show-icon
			    style='margin-bottom:10px'>
			  </el-alert>
	    	<contract-list 
	    		:params='{toExpire:1}' 
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
	import contractList from './list'
	export default {
		components:{
			contractList,
		},
		data(){
			return {
				nearTotal:'..',
				stockWarningTotal:'..'
			}
		},
		mounted(){
			
		},
		methods:{
			initData(){
				
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