<template>
	<div>
		<div style='margin-bottom: 10px'>
			<el-button type='primary' @click='create()'>创建部门</el-button>
		</div>
		<dep-list ref='depList'>
			<template slot='right' slot-scope='{node,data}'>
				<span>
          <el-button
            type="text"
            @click='create(data)'>
            添加
          </el-button>
          <el-button
            type="text"
            @click='edit(node,data)'>
            修改
          </el-button>
          <el-button
            type="text"
            @click='del(node,data)'>
            删除
          </el-button>
        </span>
			</template>
		</dep-list>
		<edit-dialog ref='editDialog' @updated='reload'/>
	</div>
</template>
<script>
	import depList from '@/components/hr/dep/treeList'
	import editDialog from '@/components/hr/dep/editDialog'
	export default {
		components:{ depList, editDialog },
		data(){
			return {}
		},
		mounted(){
			this.$refs.depList.initData()
		},
		methods:{
			create(data=null){
				this.$refs.editDialog.open().then(that=>{
					that.create().then(()=>{
						if(data){
							that.assign({
								parent_id:data.id,
								parent_dep:data.name
							})
						}
					})
				})
			},
			edit(node,data){
				let editData = {...data}
				editData.parent_dep = node.parent.data.name
				this.$refs.editDialog.open().then(that=>{
					that.initData(editData)
				})
			},
			del(node,data){
				this.$refs.depList.del(node,data)
			},
			reload(){
				this.$refs.depList.reload()
			}
		}
	}
</script>