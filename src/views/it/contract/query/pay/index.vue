<template>
	<div>
		<pay-list ref="list" show-query-more/>
	</div>
</template>
<script>
import payList from '@/components/it/contract/pay/list'
export default {
	components:{
		payList
	},
	mounted(){
		this.$refs.list.reload();
	}
}
</script>