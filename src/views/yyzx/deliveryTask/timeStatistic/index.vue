<template>
	<div>
		<el-alert 
			type='warning'
			title='以发货任务提交日期为统计单位，对时段范围内的任务发货面积及任务数量进行统计'
			style='margin-bottom: 15px'
		/>
		<time-statistic ref='timeStatistic'/>
	</div>
</template>
<script>
	import timeStatistic from '@/components/yyzx/deliveryTask/statistic/time'
	export default {
		components:{
			timeStatistic
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