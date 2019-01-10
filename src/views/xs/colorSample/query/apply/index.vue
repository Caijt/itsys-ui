<template>
	<div>
		<apply-list init sort-prop='submit_time'></apply-list>
	</div>
</template>
<script>
	import applyList from '@/components/xs/colorSample/query/applyList'
	export default {
		components:{
			applyList
		},
		data(){
			return {}
		}
	}
</script>