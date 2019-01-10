<template>
	<div>
		<sample-list init sort-prop='submit_time'></sample-list>
	</div>
</template>
<script>
	import sampleList from '@/components/xs/colorSample/query/sampleList'
	export default {
		components:{
			sampleList
		},
		data(){
			return {}
		}
	}
</script>