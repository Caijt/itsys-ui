<template>
	<div>		
		<color-sample-index />
	</div>
</template>
<script>
	import colorSampleIndex from '@/components/cg/colorSample/summaryIndex'

	export default {
		components:{
			colorSampleIndex
		},
		data(){
			return {
				
			}
		},
		mounted(){
			
		},
		methods:{
			hasPath(path){
				return this.$commonJs.hasUserPath(path)
			}
		}
	}
</script>