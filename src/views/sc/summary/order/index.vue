<template>
	<div>
		<order-list :params='{hasProduce:0}' init></order-list>
	</div>
</template>
<script>
	import orderList from '@/components/sc/produceLog/orderList'
	export default {
		components:{
			orderList
		},
		data(){
			return {

			}
		}
	}
</script>