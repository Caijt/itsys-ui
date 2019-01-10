<template>
	<el-dialog 
		@open='openDialog' 
		class='c-dialog-small' 
		:title='title' 
		:width='width'
		top='0'
		:visible.sync='show'
		:append-to-body='inDialog'>
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
	import list from './list'
	export default {
		components:{
			list
		},
		props:{
			title:{
				default:'项目列表'
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
			}
		}
	}
</script>