<template>
	<el-dialog 
		@open='openDialog' 
		class='c-dialog-small' 
		title='回款记录' 
		width='80%'
		top='0'
		:visible.sync='dialogShow'
		:append-to-body='inDialog'>
		<receive-payment-record-list 
			size='small'  
			max-height='300' 
			:params='params' 
			in-dialog
			ref='receivePaymentRecordList'/>
	</el-dialog>
</template>
<script>
	import receivePaymentRecordList from './list'
	export default {
		components:{
			receivePaymentRecordList
		},
		props:{
			inDialog:{
				type:Boolean,
				default:false
			}
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
					this.$refs.receivePaymentRecordList.initData()
				})
			},
			open(params={}){
				this.params = params
				this.dialogShow = true
			}
		}
	}
</script>