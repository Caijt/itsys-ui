<template>
	<el-dialog 
		@open='openDialog' 
		class='c-dialog-small' 
		title='项目列表' 
		width='80%'
		top='0vh'
		:visible.sync='show'
		:append-to-body='inDialog'>
		<project-list 
			size='small'  
			max-height='300' 
			:params='params' 
			in-dialog
			ref='projectList'>
			<slot name='column' slot='column'></slot>
		</project-list>
	</el-dialog>
</template>
<script>
	import projectList from './projectList'
	export default {
		components:{
			projectList
		},
		props:{
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
					this.$refs.projectList.initData()
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
				this.$refs.projectList.reload()
			}
		}
	}
</script>