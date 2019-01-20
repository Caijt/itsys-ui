<template>
	<div>
		<div style='margin-bottom: 10px'>
			<el-button type='primary' @click='create()'>创建资产类型</el-button>
		</div>
		<type-list ref='typeList'>
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
		</type-list>
		<edit-dialog ref='editDialog' @updated='reload'/>
	</div>
</template>
<script>
	import typeList from '@/components/it/asset/type/treeList'
	import editDialog from '@/components/it/asset/type/editDialog'
	export default {
		components:{ typeList, editDialog },
		data(){
			return {}
		},
		mounted(){
			this.$refs.typeList.initData()
		},
		methods:{
			create(data=null){
				this.$refs.editDialog.open().then(that=>{
					that.create().then(()=>{
						if(data){
							that.assign({
								parent_id:data.id,
								parent_type:data.name
							})
						}
					})
				})
			},
			edit(node,data){
				let editData = {...data}
				editData.parent_type = node.parent.data.name
				this.$refs.editDialog.open().then(that=>{
					that.initData(editData)
				})
			},
			del(node,data){
				this.$refs.typeList.del(node,data)
			},
			reload(){
				this.$refs.typeList.reload()
			}
		}
	}
</script>