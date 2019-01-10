<template>
	<div>
		<el-alert 
			type='warning'
			title='以车辆发货时间为统计单位，对时段范围内的发货面积及车辆数量进行统计'
			style='margin-bottom: 15px'
		/>
		<time-statistic ref='timeStatistic'/>
	</div>
</template>
<script>
	import timeStatistic from '@/components/cy/deliveryTask/statistic/time'
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