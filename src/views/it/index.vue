<template>
	<div>		
		<asset-index v-if='hasPath("/it/asset")' style='margin-bottom: 10px'/>
		<contract-index v-if='hasPath("/it/contract")' style='margin-bottom: 10px'/>
	</div>
</template>
<script>
	import assetIndex from '@/components/it/asset/summaryIndex'
	import contractIndex from '@/components/it/contract/summaryIndex'

	export default {
		components:{
			assetIndex,
			contractIndex
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