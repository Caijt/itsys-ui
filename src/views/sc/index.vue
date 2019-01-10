<template>
	<div>		
		<produce-index v-if='hasPath("/sc/product")||hasPath("/sc/outProduct")' style='margin-bottom: 10px'/>
		<window-order-index v-if='hasPath("/sc/windowOrder")' style='margin-bottom: 10px'/>
	</div>
</template>
<script>
	import produceIndex from '@/components/sc/product/summaryIndex'
	import windowOrderIndex from '@/components/sc/windowOrder/summaryIndex'

	export default {
		components:{
			produceIndex,
			windowOrderIndex,
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