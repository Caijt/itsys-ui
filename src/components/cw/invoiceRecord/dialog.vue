<template>
	<el-dialog 
		@open='openDialog' 
		class='c-dialog-fixed'  
		width='80%' 
		:visible.sync='dialogShow'
		:append-to-body='inDialog'
		title='开票记录'>
		<invoice-record-list in-dialog
			size='small' max-height='300' :params='params' ref='invoiceRecordList' />
	</el-dialog>
</template>
<script>
	import invoiceRecordList from './list'
	export default {
		props:{
			inDialog:{
				type:Boolean,
				default:false
			}
		},
		components:{
			invoiceRecordList
		},
		data(){
			return {
				dialogShow:false,
				params:{ }
			}
		},
		methods:{
			openDialog(){
				this.$nextTick(()=>{
					this.$refs.invoiceRecordList.initData()
				})
			},
			open( params = {} ){
				this.params = params
				this.dialogShow = true
			}
		}
	}
</script>