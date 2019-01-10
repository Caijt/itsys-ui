<template>
	<el-dialog 
		class='c-dialog-fixed'
		title='货款回款列表' 
		width='80%'
		:visible.sync='show'
		:append-to-body='inDialog'
		@open='openDialog'
		@close='closeDialog'>
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
			inDialog:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return {
				resolve:null,
				show:false,
				params:{ }
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
			close(){
				this.show = false
			},
			reload(){
				this.$refs.list.reload()
			},
			initData(params={}){
				this.$refs.list.initData(params)
			}
		}
	}
</script>