<template>
	<div>
		<div style='margin:10px 0'>
			<el-button @click='exportExcel' size='small' type='primary'>导出Excel</el-button>
		</div>
		<list ref='list'>
			
		</list>
	</div>
</template>
<script>
	import list from '@/components/yyzx/order/progress/list'
	export default {
		components:{ list },
		mounted(){
			this.$refs.list.initData()
		},
		methods:{
			exportExcel(){
				this.$refs.list.exportExcel()
			}
		}
	}
</script>