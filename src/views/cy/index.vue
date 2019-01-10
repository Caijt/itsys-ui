<template>
	<div>		
		<delivery-index v-if='hasPath("/cy/store")||hasPath("/cy/delivery")' style='margin-bottom: 10px'/>
		<delivery-task-index v-if='hasPath("/cy/deliveryTask")' style='margin-bottom: 10px'/>
	</div>
</template>
<script>
	import deliveryIndex from '@/components/cy/delivery/summaryIndex'
	import deliveryTaskIndex from '@/components/cy/deliveryTask/summaryIndex'

	export default {
		components:{
			deliveryTaskIndex,
			deliveryIndex
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