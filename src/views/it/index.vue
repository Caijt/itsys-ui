<template>
	<div>		
		<asset-index v-if='hasPath("/it/asset")' style='margin-bottom: 10px'/>
	</div>
</template>
<script>
	import assetIndex from '@/components/it/asset/summaryIndex'

	export default {
		components:{
			assetIndex
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