<template>
	<div>
		<el-alert 
			type='warning'
			title='以合同签订日期为统计单位对时段范围内的签订的合同金额及数量进行统计'
			style='margin-bottom: 15px'
		/>
		<time-statistic ref='timeStatistic'/>
	</div>
</template>
<script>
	import timeStatistic from '@/components/it/contract/statistic/time'
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