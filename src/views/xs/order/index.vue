<template>
	<div>
		<list :params='{inCompany:1}' show-query ref='list'>
			
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