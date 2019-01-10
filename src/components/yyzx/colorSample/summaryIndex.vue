<template>
	<div  v-if='hasPath("/yyzx/colorSample")'>
		<el-tabs value="toFile">
	    <el-tab-pane name="toFile" >
	    	<span slot="label">
	    		<el-badge class='_my-bagde' :hidden='!toFileTotal' :value='toFileTotal'>待归档打样申请</el-badge></span>
	    	<apply-list max-height='200' :params='toFileParams' ref='applyList' hide-query hide-file-field hide-make-field hide-delivery-field hide-confirm-field no-page init @loaded='({total})=>{toFileTotal=total}' />
	    </el-tab-pane>
	    <el-tab-pane name="toDelivery" >
	    	<span slot="label">
	    		<el-badge :hidden='!toDeliveryTotal' class='_my-bagde' :value='toDeliveryTotal'>待寄出色样</el-badge>
	    	</span>	    	
	    	<apply-list :params='toDeliveryListParams' ref='applyList' hide-query hide-delivery-field hide-confirm-field init no-page @loaded='({total})=>{toDeliveryTotal=total}'/>
	    </el-tab-pane>
	  </el-tabs>
	</div>
</template>
<script>
	import applyList from '@/components/xs/colorSample/query/applyList'
	export default {
		components:{
			applyList
		},
		data(){
			return {
				toFileParams:{
					fixed_status:["APPLY"],
					inFactory:1
				},
				toDeliveryListParams:{
					fixed_status:['MAKE'],
					inFactory:1
				},
				echarts:null,
				toFileTotal:0,
				toDeliveryTotal:0
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
<style lang='scss'>
	._my-bagde{
		.el-badge__content{
			top:8px !important;
			right:2px !important;
		}
	}
		
</style>