<template>
	<div>		
		<contract-index v-if='hasPath("/yyzx/contract")' style='margin-bottom: 10px'/>
		<project-index v-if='hasPath("/yyzx/project")' style='margin-bottom: 10px'/>
		<order-index v-if='hasPath("/yyzx/order")' style='margin-bottom: 10px'/>
		<color-sample-index v-if='hasPath("/yyzx/colorSample")' style='margin-bottom: 10px'/>
		<delivery-task-index v-if='hasPath("/yyzx/deliveryTask")' style='margin-bottom: 10px'/>
	</div>
</template>
<script>
	import contractIndex from '@/components/yyzx/contract/summaryIndex'
	import projectIndex from '@/components/yyzx/project/summaryIndex'
	import orderIndex from '@/components/yyzx/order/summaryIndex'
	import colorSampleIndex from '@/components/yyzx/colorSample/summaryIndex'
	import deliveryTaskIndex from '@/components/yyzx/deliveryTask/summaryIndex'

	export default {
		components:{
			contractIndex,
			projectIndex,
			orderIndex,
			colorSampleIndex,
			deliveryTaskIndex
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