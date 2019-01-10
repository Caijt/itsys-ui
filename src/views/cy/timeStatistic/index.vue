<template>
	<div>
		<el-alert 
			type='warning'
			title='以入库日期及发货日期为统计单位对时段范围内的入库、发货面积进行统计'
			style='margin-bottom: 15px'
		/>
		<time-statistic ref='timeStatistic'/>
	</div>
</template>
<script>
	import timeStatistic from '@/components/cy/statistic/time'
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