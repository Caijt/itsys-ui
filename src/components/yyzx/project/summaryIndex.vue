<template>
	<div>
		<el-tabs value="summary">
			<el-tab-pane label="近期项目统计" name="summary">
	    	<div ref='chartContainer' style='width:100%;height:300px'></div>
	    </el-tab-pane>
	    <el-tab-pane name="near" >
	    	<span slot="label"><el-badge :hidden='!nearContractTotal' class='_my-bagde' :value='nearContractTotal'>近期新增项目</el-badge></span>
	    	<el-alert type='warning' title='最近10天内新增的项目' style='margin-bottom: 10px'></el-alert>
	    	<project-list :params='{isNear:1}' hide-query init max-height='200' no-page @loaded='({total})=>{nearContractTotal=total}'></project-list>
	    </el-tab-pane>
	  </el-tabs>
	</div>
</template>
<script>
	import projectList from '@/components/yyzx/project/list'
	import projectApi from '@/api/yyzx/project'
	export default {
		components:{
			projectList
		},
		data(){
			return {
				echarts:null,
				nearContractTotal:0
			}
		},
		mounted(){
			this.test()
		},
		beforeDestroy() {
	    if (!this.echarts) {
	      return
	    }
	    this.echarts.dispose();
	    this.echarts = null;
	  },
		methods:{
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
		          name: '项目面积'        
		        },
		        {
		          type: 'value',
		          name: '项目数量',
		          splitLine:{
		          	show:false
		          }
		        }
		      ],
			    series: [
			    	{
			        name: '项目面积',
			        type: 'bar',		     
			        
			    	},
			    	{
			        name: '项目数量',
			        type: 'line',
            	yAxisIndex: 1,
            	
			    	},
			    ]
				});
				this.echarts.showLoading()
				projectApi.getTimeStatistic().then(res=>{
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