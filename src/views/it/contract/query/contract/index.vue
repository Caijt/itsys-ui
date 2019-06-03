<template>
	<div>
		<contract-list ref="list" show-query-more/>
	</div>
</template>
<script>
import contractList from '@/components/it/contract/list'
export default {
	components:{
		contractList
	},
	mounted(){
		this.$refs.list.reload();
	}
}
</script>