<template>
	<div  v-if='hasPath("/cg/colorSample")'>
		<el-tabs value="toMake">
	    <el-tab-pane name="toMake" >
	    	<span slot="label"><el-badge class='_my-bagde' :value='toMakeTotal'>待打板申请</el-badge></span>	    	
	    	<apply-list :params='toMakeListParams' ref='applyList' hide-query hide-delivery-field hide-confirm-field init no-page @loaded='({total})=>{toMakeTotal=total}'/>
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
				toMakeListParams:{
					fixed_status:['FILE','MAKING'],
					inFactory:1
				},
				echarts:null,
				toMakeTotal:0
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