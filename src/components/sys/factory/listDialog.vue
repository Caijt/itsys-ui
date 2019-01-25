<template>
	<el-dialog 
		class='c-dialog-fixed'
		title='供应商列表' 
		width='80%'		
		:visible.sync='show'
		:append-to-body='inDialog'
		@open='openDialog'
		@close='closeDialog'>
		<list 
			:show-selection='showCheckbox'
			max-height='300' 
			:params='params' 
			in-dialog
			ref='list'>
			<el-table-column v-if='showSelect' slot='column' align='center' label='操作' fixed='right' width='60'>
				<template slot-scope='{row}'>
					<el-button type='text' @click='select(row)'>选择</el-button>
				</template>				
			</el-table-column>
			<slot name='column' slot='column'></slot>
		</list>
		<template slot="footer">
			<slot name='footer'></slot>
		</template>
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
			},
			showSelect:{
				type:Boolean,
				default:false
			},
			showCheckbox:{
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
			select(row){
				this.$emit('select',row)
			}
		}
	}
</script>