<template>
	<el-dialog 
		class='c-dialog-fixed' 
		:title='title' 
		:width='width'
		:visible.sync='show'
		:append-to-body='inDialog'
		@open='openDialog'
		@close='closeDialog' >
		<list 
			size='small'  
			max-height='300' 
			:params='params' 
			:hide-car-fields='hideCarFields'
			hide-edit-fields
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
				default:'发货车辆产品列表'
			},
			width:{
				default:'80%'
			},
			inDialog:{
				type:Boolean,
				default:false
			},
			hideCarFields:{
				type:Boolean,
				default:false
			},
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