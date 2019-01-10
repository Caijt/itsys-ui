<template>
	<div>
		<list init hide-edit-field :params='params'>
		</list>
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
		}
	}
</script>