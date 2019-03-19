<template>
	<div v-loading='loading'>
		<div style='margin-bottom: 5px'>
			<el-input
		  placeholder="输入部门关键字"
		  v-model="filterText">
			</el-input>
		</div>
		<div :style='treeStyle'>
			<el-tree 
				node-key="id"
				:show-checkbox='showCheckbox'
				:expand-on-click-node="false"
				highlight-current				
				:data='data' 
				:props='{label:"name"}' 
				ref='treeList'
				:filter-node-method="filterNode"
				@node-click='nodeClick'>
				<span class='_tree-node' slot-scope='{node,data}'>
					<span style='font-size:14px'>{{ node.label}}</span>
					<span>
						<slot name='right' :data='data' :node='node'></slot>
					</span>
				</span>
			</el-tree>
		</div>
	</div>

</template>
<script>
	import depApi from '@/api/hr/dep'
	export default {
		props:{
			showCheckbox:{
				type:Boolean,
				default:false
			},
			height:{
				type:String,
				default:'auto'
			}
		},
		data(){
			return {
				filterText:'',
				loading:false,
				data:[]
			}
		},
		computed:{
			treeStyle(){
				if(this.height=='auto'){
					return {}
				}else{
					return {
						height:this.height,
						paddingRight:'15px',
						overflow:'auto'
					}
				}
			}
		},
		watch: {
      filterText(val) {
        this.$refs.treeList.filter(val);
      }
    },
		methods:{
			getTreeList(){
				this.loading = true
				depApi.getTreeList().then(res=>{
					this.data = this.$commonJs.toTreeData(res.data.list)
					this.loading = false
				})
			},
			initData(){
				this.getTreeList()
			},
			filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
			nodeClick(data,node,component){
				//console.log(a,b,c)
				this.$emit('node-click',data,node,component)
			},
			clear(){
				this.data = []
			},
			reload(){
				this.getTreeList()
			},
			del(node,data){
				if(!node.isLeaf){
					this.$message.error('此部门下有子部门，无法删除！')
					return false
				}
				let confirmText = '确定删除此部门吗？'
				this.$confirm(confirmText,'提示',{
					type: 'warning'
				}).then(()=>{
					depApi.del(data.id).then(res=>{
						this.$refs.treeList.remove(node)
						this.$message.success('删除成功')
						this.$emit('del')
					})
				})
			 
			}
		}
	}
</script>
<style lang='less'>
	._tree-node{
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-grow: 1;
	}
</style>