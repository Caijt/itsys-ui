<template>
	<div  v-if='hasPath("/xs/colorSample")'>
		<el-tabs value="toApply">
	    <el-tab-pane name="toApply" >
	    	<span slot="label">
	    		<el-badge class='_my-bagde' :value='toApplyTotal'>待打样色样</el-badge>
	    	</span>
	    	<sample-list max-height='200' no-page :params='toApplyParams' hide-query hide-edit-field ref='sampleList' sort-prop='submit_time' init @loaded='({total})=>{toApplyTotal=total}'>
				</sample-list>	
	    </el-tab-pane>
	    <el-tab-pane name="toDelivery" >
	    	<span slot="label">
	    		<el-badge class='_my-bagde' :value='toConfirmTotal'>待确认色样</el-badge>
	    	</span>	    	
	    	<apply-list :params='toConfirmListParams' ref='applyList' hide-query hide-delivery-field hide-confirm-field init no-page @loaded='({total})=>{toConfirmTotal=total}'/>
	    </el-tab-pane>
	  </el-tabs>
	</div>
</template>
<script>
	import applyList from './query/applyList'
	import sampleList from './edit/list'

	export default {
		components:{
			applyList,
			sampleList
		},
		data(){
			return {
				toApplyParams:{
					status:["SUBMIT","CONFIRM_N"],
					inCompany:1
				},
				toConfirmListParams:{
					fixed_status:['DELIVERY'],
					inCompany:1
				},
				echarts:null,
				toApplyTotal:0,
				toConfirmTotal:0
			}
		},
		mounted(){
			//this.test()
		},
		beforeDestroy() {
	    if (!this.echarts) {
	      return
	    }
	    this.echarts.dispose();
	    this.echarts = null;
	  },
		methods:{
			hasPath(path){
				return this.$commonJs.hasUserPath(path)
			},
			test(){
				let echarts = require('echarts')
				this.echarts = echarts.init(this.$refs.chartContainer)
				this.echarts.setOption({			    
			    legend: {},
		    	grid:{ bottom:30 },
			    tooltip: {
			    	trigger:'axis'			    	
			    },
			    xAxis: [
			    	{
				    	type:'category'
			    	}
			    ],
			    yAxis: [
				    {
	            type: 'value',		        
		          name: '订单面积'        
		        },
		        {
		          type: 'value',
		          name: '订单数量',
		          splitLine:{
		          	show:false
		          }
		        }
		      ],
			    series: [
			    	{
			        name: '订单面积',
			        type: 'bar',		     
			        
			    	},
			    	{
			        name: '订单数量',
			        type: 'line',
            	yAxisIndex: 1,
            	
			    	},
			    ]
				});
				this.echarts.showLoading()
				orderApi.getNearMonthSummary().then(res=>{
					this.echarts.setOption({	
						dataset:{
				    	source:res.data
				    }
					})
					this.echarts.hideLoading()
				})
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