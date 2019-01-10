<template>
	<div>
		<list ref='list' init hide-edit-field sort-prop='submit_time'>
			<el-table-column slot='column' fixed='right' align='center' label='操作' width='60'>
				<template slot-scope='{row}'>
					<el-button type='text' @click='openInfo(row)'>详情</el-button>
				</template>
			</el-table-column>
		</list>
	</div>
</template>
<script>
	import list from '@/components/yyzx/goodsPayment/edit/list'
	export default {
		components:{ list },
		data(){
			return {}
		},
		methods:{
			openInfo(row){
				this.$refs.list.openInfo(row.id)
			}
		}
	}
</script>