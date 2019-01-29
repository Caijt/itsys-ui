<template>
	<div>
		<el-tabs value="summary">
			<el-tab-pane label="近期门窗订单统计" name="summary">
				<el-alert 
			    title="以下数据仅统计近半年门窗订单，如需更详细的统计数据，请到相关页面进行查询"
			    type="success"
			    style='margin-bottom:10px'>
			    <div>
			    	<el-button type='text' size='mini' @click='$router.push("/sc/windowOrder/query/timeStatistic")'>[ 时段统计 ]</el-button>
			    </div>
			  </el-alert>
	    	<div ref='chartContainer' style='width:100%;height:300px'></div>
	    </el-tab-pane>
	    <el-tab-pane name="near" >
	    	<span slot="label">
	    		<el-badge :hidden='!nearCarTotal' class='_my-bagde' :value='nearCarTotal'>
	    			近期订单
	    		</el-badge>
	    	</span>
	    	<el-alert 
			    title="以下仅显示近10天内提交的门窗订单，如需更详细的订单数据，请到相关页面进行查询"
			    type="success"
			    style='margin-bottom:10px'>
			    <div>
			    	<el-button type='text' size='mini' @click='$router.push("/sc/windowOrder/query/order")'>[ 订单查询 ]</el-button>
			    </div>
			  </el-alert>
	    	<order-list 
	    		:params='{isNear:1}' 
	    		hide-query init max-height='250' no-page 
	    		hide-edit-field
	    		sort-prop='submit_time'
	    		@loaded='({total})=>{nearCarTotal=total}'/>
	    </el-tab-pane>
	    <el-tab-pane name="toProduce" >
	    	<span slot="label"><el-badge :hidden='!toProduceTotal' class='_my-bagde' :value='toProduceTotal'>待生产订单</el-badge></span>
	    	<el-alert 
			    title="待生产的门窗订单，需要进行生产日志录入操作，请到相关页面进行处理"
			    type="warning"
			    show-icon
			    style='margin-bottom:10px'>
			    <div>
			    	<el-button type='text' size='mini' @click='$router.push("/sc/windowOrder/log")'>[ 生产日志录入 ]</el-button>
			    </div>
			  </el-alert>
	    	<order-list 
	    		:params='{toProduce:1}' 
	    		hide-query init max-height='250' no-page 
	    		hide-edit-field
	    		sort-prop='submit_time'
	    		@loaded='({total})=>{toProduceTotal=total}'/>
	    </el-tab-pane>
	  </el-tabs>
	</div>
</template>
<script>
	import orderList from '@/components/sc/windowOrder/list'
	import orderApi from '@/api/yyzx/windowOrder'
	import logApi from '@/api/sc/produceLog'

	export default {
		components:{
			orderList
		},
		data(){
			return {
				echarts:null,
				echarts2:null,
				nearCarTotal:'..',
				toProduceTotal:'..'
			}
		},
		mounted(){
			this.test()
			// this.test2()
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
		    	// grid:{ bottom:30 },
		    	// dataset:[{},{}],
		    	grid:[
		    		{ right:'55%'},{ left:'55%' }
		    	],
			     tooltip: {
			    	trigger:'axis'			    	
			    },
			    xAxis: [
			    	{
				    	type:'category',
				    	gridIndex:0
			    	},
			    	{
				    	type:'category',
				    	gridIndex:1
			    	}
			    ],
			    yAxis: [
				    {
	            type: 'value',		        
		          name: '面积',
		          gridIndex:0      
		        },
		        {
		          type: 'value',
		          name: '数量',
		          gridIndex:0,
		          splitLine:{
		          	show:false
		          }
		        },
		        {
	            type: 'value',		        
		          name: '面积',
		          gridIndex:1		          
		        },
		        {
		          type: 'value',
		          name: '数量',
		          gridIndex:1,
		          splitLine:{
		          	show:false
		          }
		        }
		      ],
			    series: [
			    	{
			        name: '订单面积',
			        type: 'bar',
			        xAxisIndex:0,
			        yAxisIndex:0
			    	},
			    	{
			        name: '订单数量',
			        type: 'line',	
			        xAxisIndex:0,
			        yAxisIndex: 1,	     
			    	},
			    	{
			        name: '生产面积',
			        type: 'bar',
			        xAxisIndex:1,
			        yAxisIndex:2,
			        datasetIndex:1
			        
			    	},
			    	{
			        name: '生产数量',
			        type: 'line',	
			        xAxisIndex:1,
			        yAxisIndex:3,			
			        datasetIndex:1        
			    	},
			    ]
				});
				this.echarts.showLoading()
				let orderData =	orderApi.getTimeStatistic()
				let logData =	logApi.getTimeStatistic()
				Promise.all([orderData,logData]).then(([o,l])=>{
					this.echarts.setOption({	
						dataset:[
							{
								source:o.data
							},
						  {
						  	source:l.data
						  }
						]
					})
					this.echarts.hideLoading()
				})
			},
			test2(){
				let echarts = require('echarts')
				this.echarts2 = echarts.init(this.$refs.chartContainer2)
				this.echarts2.setOption({			    
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
		          name: '面积'        
		        },
		        {
		          type: 'value',
		          name: '数量',
		          splitLine:{
		          	show:false
		          }
		        }
		      ],
			    series: [
			    	{
			        name: '生产面积',
			        type: 'bar',		     
			    	},
			    	{
			        name: '生产数量',
			        type: 'line',	
			        yAxisIndex: 1,	     
			    	},
			    ]
				});
				this.echarts2.showLoading()
				logApi.getTimeStatistic().then(res=>{
					this.echarts2.setOption({	
						dataset:{
				    	source:res.data
				    }
					})
					this.echarts2.hideLoading()
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