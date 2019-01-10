<template>
	<el-dialog 
		@open='openDialog' 
		class='c-dialog-fixed' 
		:title='title' 
		:width='width'
		:visible.sync='show'
		:append-to-body='inDialog'>
		<list  
			max-height='300' 
			:params='params' 
			in-dialog
			ref='list'>
			<slot name='column' slot='column'></slot>
		</list>
	</el-dialog>
</template>
<script>
	import list from './list'
	export default {
		components:{
			list
		},
		props:{
			title:{
				default:'门窗标签列表'
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