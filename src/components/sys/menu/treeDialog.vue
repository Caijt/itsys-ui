<template>
	<el-dialog 
		class='c-dialog-fixed'
		title='菜单列表' 		
		:visible.sync='show'
		:append-to-body='inDialog'
		@open='openDialog'
		@close='closeDialog'>
		<tree-list 
			:show-checkbox='showCheckbox'
			max-height='300' 
			:params='params' 
			in-dialog
			ref='list'>
			<template slot='right' slot-scope='{data}'>
				<slot name='right' :data='data'>
					<el-button type='text' @click='select(data)' v-if='showSelect'>选择</el-button>
				</slot>
			</template>
		</tree-list>
		<template slot="footer">
			<slot name='footer'></slot>
		</template>
	</el-dialog>
</template>
<script>
	import treeList from './treeList'
	export default {
		components:{
			treeList
		},
		props:{
			inDialog:{
				type:Boolean,
				default:false
			},
			showCheckbox:{
				type:Boolean,
				default:false
			},
			showSelect:{
				type:Boolean,
				default:false
			},
			params:{
				default:()=>({})
			},
		},
		data(){
			return {
				resolve:null,
				show:false
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
			},
			select(data){
				this.$emit('select',data)
			}
		}
	}
</script>