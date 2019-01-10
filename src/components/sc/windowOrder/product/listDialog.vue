<template>
	<el-dialog 
		@open='openDialog' 
		class='c-dialog-fixed' 
		:title='title' 
		:width='width'
		:visible.sync='show'
		:append-to-body='inDialog'>
		<list 
			size='small'  
			max-height='300' 
			:params='params' 
			in-dialog
			ref='list'
			:hide-order-fields='hideOrderFields'>
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
				default:'门窗订单产品列表'
			},
			width:{
				default:'80%'
			},
			inDialog:{
				type:Boolean,
				default:false
			},
			hideOrderFields:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return {
				show:false,
				resolve:null,
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
			open(){
				this.show = true
				return new Promise((resolve,reject)=>{
					this.resolve = resolve
				}) 
			},
			initData(params = {}){
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