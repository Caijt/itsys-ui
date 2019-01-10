<template>
	<el-dialog 
		@open='openDialog' 
		class='c-dialog-small' 
		:title='title' 
		:width='width'
		top='0vh'
		:visible.sync='show'
		:append-to-body='inDialog'>
		<el-alert title='色样已打样完成，并寄回客户或销售人员，请进行确认' type='warning' style='margin-bottom: 10px'></el-alert>
		<list 
			size='small'  
			max-height='300' 
			:params='params' 
			in-dialog
			ref='list'>
			<slot name='column' slot='column'></slot>
		</list>
	</el-dialog>
</template>
<script>
	import list from './toConfirmList'
	export default {
		components:{
			list
		},
		props:{
			title:{
				default:'待确认色样'
			},
			width:{
				default:'80%'
			},
			inDialog:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return {
				show:false,
				params:{ }
			}
		},
		methods:{
			openDialog(){
				this.$nextTick(()=>{
					this.$refs.list.initData()
				})
			},
			open(params={}){
				this.params = params
				this.show = true
			},
			close(){
				this.show = false
			},
			reload(){
				this.$refs.list.reload()
			}
		}
	}
</script>