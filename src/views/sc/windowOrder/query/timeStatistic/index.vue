<template>
	<div>
		<el-alert 
			type='warning'
			title='以订单日期及生产日期为统计单位对时段范围内的订单面积、订单数量、生产面积、生产数量进行统计'
			style='margin-bottom: 15px'
		/>
		<time-statistic ref='timeStatistic'/>
	</div>
</template>
<script>
	import timeStatistic from '@/components/sc/windowOrder/statistic/time'
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