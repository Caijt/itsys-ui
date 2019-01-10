<template>
	<div>
		<el-alert style='margin-bottom:10px' title='列表为打样效果已通过客户确认的色样，以下色板色号将关联至运营下单的型材颜色中' type='warning'></el-alert>
		<color-list ref='list' init>			
		</color-list>		
		<progress-info ref='progressInfo'/>
		<progress-list-dialog hide-query ref='progressListDialog'/>
	</div>
</template>
<script>
	import colorList from '@/components/yyzx/colorSample/color/list'
	import todoDialog from '@/components/yyzx/colorSample/todoListDialog'
	import toDeliveryDialog from '@/components/yyzx/colorSample/toDeliveryListDialog'
	import summaryList from '@/components/yyzx/colorSample/summary/list'
	import progressInfo from '@/components/xs/colorSample/progressInfo'
	import progressListDialog from '@/components/xs/colorSample/progressListDialog'

	export default {
		components:{
			colorList,
			todoDialog,
			summaryList,
			toDeliveryDialog,
			progressInfo,
			progressListDialog
		},
		data(){
			return {
				tabName:'list'				
			}
		},
		mounted(){
			
		},
		methods:{
			create(){
				this.$refs.formDialog.open()
			},					
			details({row}){
				this.$refs.formDialog.open(row.id)
			},
			del(scope){
				this.$refs.list.del(scope)
			},		
			info({row}){
				this.$refs.progressInfo.open(row.sample_id)
			}
		}
	}
</script>