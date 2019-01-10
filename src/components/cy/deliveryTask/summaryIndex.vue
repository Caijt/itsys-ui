<template>
	<div>
		<el-tabs value="summary">
			<el-tab-pane label="近期发货统计" name="summary">
	    	<el-alert 
			    title="以下数据仅统计近期发货车辆，如需更详细的统计数据，请到相关页面进行查询"
			    type="success"
			    style='margin-bottom:10px'>
			    <div>
			    	<el-button type='text' size='mini' @click='$router.push("/cy/deliveryTask/timeStatistic")'>[ 时段统计 ]</el-button>
			    </div>
			  </el-alert>
	    	<time-statistic chart-height='300px' ref='timeStatistic' hide-query/>
	    </el-tab-pane>
	    <el-tab-pane name="near" >
	    	<span slot="label"><el-badge :hidden='!nearCarTotal' class='_my-bagde' :value='nearCarTotal'>近期新增车辆</el-badge></span>
	    	<el-alert 
			    title="以下仅显示近10天内提交的发货车辆，如需更详细的车辆数据，请到相关页面进行查询"
			    type="success"
			    style='margin-bottom:10px'>
			    <div>
			    	<el-button type='text' size='mini' @click='$router.push("/cy/deliveryTask/carQuery")'>[ 发货车辆查询 ]</el-button>
			    </div>
			  </el-alert>
	    	<car-list 
	    		:params='{inFactory:1,isNear:1}' 
	    		hide-query init max-height='250' no-page 
	    		hide-edit-field
	    		sort-prop='submit_time'
	    		@loaded='({total})=>{nearCarTotal=total}'/>
	    </el-tab-pane>
	    <el-tab-pane name="toLoad" >
	    	<span slot="label">
	    		<el-badge :hidden='!toLoadTotal' class='_my-bagde' :value='toLoadTotal'>待装车任务</el-badge>
	    	</span>
	    	<el-alert 
			    title="装车面积小于发货产品面积的发货任务，需要进行装车操作，请到任务装车页面进行处理"
			    type="warning"
			    show-icon
			    style='margin-bottom:10px'>
			    <div>
			    	<el-button type='text' size='mini' @click='$router.push("/cy/deliveryTask/load")'>[ 任务装车 ]</el-button>
			    </div>
			  </el-alert>
	    	<task-list 
	    		:params='{ inFactory:1,toLoad:1 }' 
	    		sort-prop='submit_time'
	    		hide-edit-field hide-query init 
	    		max-height='250' 
	    		no-page 
	    		@loaded='({total})=>{toLoadTotal=total}'/>
	    </el-tab-pane>
	    <el-tab-pane name="toReview" >
	    	<span slot="label">
	    		<el-badge :hidden='!toReviewTotal' class='_my-bagde' :value='toReviewTotal'>待审核车辆</el-badge>
	    	</span>
	    	<el-alert 
			    title="发货车辆货物签收后，司机上传签收图片，仍需进行最后的审核操作，请到签收审核页面进行处理"
			    type="warning"
			    show-icon
			    style='margin-bottom:10px'>
			    <div>
			    	<el-button type='text' size='mini' @click='$router.push("/cy/deliveryTask/review")'>[ 签收审核 ]</el-button>
			    </div>
			  </el-alert>
	    	<car-list 
	    		:params='{ inFactory:1,status:["RECEIVE"] }' 
	    		hide-query init hide-edit-field
	    		sort-prop='receive_time'
	    		max-height='250' no-page 
	    		@loaded='({total})=>{toReviewTotal=total}'></car-list>
	    </el-tab-pane>
	  </el-tabs>
	</div>
</template>
<script>
	import carList from './car/list'
	import taskList from '@/components/yyzx/deliveryTask/edit/editList'
	import timeStatistic from './statistic/time'

	export default {
		components:{		
			carList,
			taskList,
			timeStatistic
		},
		data(){
			return {
				nearCarTotal:'..',
				toLoadTotal:'..',
				toReviewTotal:'..'
			}
		},
		mounted(){
			this.initData()
		},
		methods:{
			initData(){
				this.$refs.timeStatistic.initData()
			}
			// test(){
			// 	let echarts = require('echarts')
			// 	this.echarts = echarts.init(this.$refs.chartContainer)
			// 	this.echarts.setOption({			    
			//     legend: {},
		 //    	grid:{ bottom:30 },
			//     tooltip: {
			    	 
			//     },
			//     xAxis: [
			//     	{
			// 	    	type:'category'
			//     	}
			//     ],
			//     yAxis: [
			// 	    {
	  //           type: 'value',		        
		 //          name: '面积'        
		 //        }
		 //      ],
			//     series: [			    	
			//     	{
			//         name: '发货面积',
			//         type: 'bar',   
			//         itemStyle:{
			//         	color:'#409EFF'
			//         }         	
			//     	},
			//     	{
			//         name: '签收面积',
			//         type: 'bar',  
			//         itemStyle:{
			//         	color:'#F56C6C'
			//         }               	
			//     	},
			//     	{
			//         name: '完成面积',
			//         type: 'bar',   
			//         itemStyle:{
			//         	color:'#67c23a'
			//         }          	
			//     	},
			//     ]
			// 	});
			// 	this.echarts.showLoading()
			// 	carApi.getNearMonthSummary().then(res=>{
			// 		this.echarts.setOption({	
			// 			dataset:{
			// 	    	source:res.data
			// 	    }
			// 		})
			// 		this.echarts.hideLoading()
			// 	})
			// }
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