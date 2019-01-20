<template>
	<div v-loading='loading'>
		<div style='margin-bottom: 5px'>
			<el-input
		  placeholder="输入类型关键字"
		  v-model="filterText">
			</el-input>
		</div>
		<el-tree 
			node-key="id"
			:show-checkbox='showCheckbox'
			:expand-on-click-node="false"
			highlight-current 
			default-expand-all 
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

</template>
<script>
	import typeApi from '@/api/it/assetType'
	export default {
		props:{
			showCheckbox:{
				type:Boolean,
				defalut:false
			}
		},
		data(){
			return {
				filterText:'',
				loading:false,
				data:[]
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
				typeApi.getTreeList().then(res=>{
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
					this.$message.error('此类型下有子类型，无法删除！')
					return false
				}
				let confirmText = '确定删除此类型吗？'
				this.$confirm(confirmText,'提示',{
					type: 'warning'
				}).then(()=>{
					typeApi.del(data.id).then(res=>{
						this.$refs.treeList.remove(node)
						this.$message.success('删除成功')
						this.$emit('del')
					})
				})
			 
			}
		}
	}
</script>
<style lang='scss'>
	._tree-node{
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-grow: 1;
	}
</style>