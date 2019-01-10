<template>
	<el-dialog 
		class='c-dialog-fixed' 
		:title='title' 
		:width='width'
		top='0vh'
		:visible.sync='show'
		:append-to-body='inDialog'
		@open='openDialog'
		@close='closeDialog' >
		<list  
			:params='params' 
			in-dialog
			ref='list'>
			<slot name='column' slot='column'></slot>
		</list>
	</el-dialog>
</template>
<script>
	import list from './imgList'
	export default {
		components:{
			list
		},
		props:{
			title:{
				default:'签收图片列表'
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
				params:{ },
				resolve:null,
			}
		},
		methods:{
			openDialog(){
				this.$nextTick(()=>{
					if(this.resolve){
						this.resolve(this)
					}
				})
			},
			closeDialog(){
				this.$refs.list.clear()
			},
			open(){
				this.show = true
				return new Promise((resolve,reject)=>{
					this.resolve = resolve
				}) 
			},
			initData(params){
				this.$refs.list.initData(params)
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