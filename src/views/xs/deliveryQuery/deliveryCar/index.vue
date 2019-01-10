<template>
	<div>
		<list init :params='params' hide-edit-field/>
	</div>
</template>
<script>
	import list from '@/components/cy/deliveryTask/car/list'	

	export default {
		components:{
			list
		},
		data(){
			return {
				params:{
					inCompany:1
				}
			}
		},
		methods:{
		}
	}
</script>