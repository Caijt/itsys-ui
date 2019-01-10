<template>
	<el-dialog 
		@open='openDialog' 
		class='c-dialog-small' 
		:title='title' 
		:width='width'
		top='0vh'
		:visible.sync='show'
		:append-to-body='inDialog'>
		<list 
			size='small'  
			max-height='300' 
			:params='params' 
			:hide-query='hideQuery'
			in-dialog
			ref='list'>
			<slot name='column' slot='column'></slot>
		</list>
	</el-dialog>
</template>
<script>
	import list from './progressList'
	export default {
		components:{
			list
		},
		props:{
			title:{
				default:'色板打样记录'
			},
			width:{
				default:'80%'
			},
			inDialog:{
				type:Boolean,
				default:false
			},
			hideQuery:{
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