<template>
	<div>
		<list ref='list' :params='params' hide-edit-field></list>
	</div>
</template>
<script>
	import list from '@/components/yyzx/deliveryTask/edit/editList'
	export default {
		components:{ list },
		data(){
			return {
				params:{
					inFactory:1
				}
			}
		},
		mounted(){
			this.$refs.list.initData()
		}
	}
</script>