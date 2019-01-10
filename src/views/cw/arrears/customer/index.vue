<template>
	<div>
		<customer-list ref='customerList'></customer-list>
	</div>
</template>
<script>
	import customerList from '@/components/cw/arrears/customerList'
	export default{
		components:{
			customerList
		},
		data(){
			return {}
		},
		mounted(){
			this.$refs.customerList.initQueryParams.isArrears = 1
			this.$refs.customerList.initData()
		}
	}
</script>