<template>
	<div>
		<div style='margin-bottom: 10px'>
			<el-button type='primary' @click='create()'>创建菜单</el-button>
		</div>		
		<el-row :gutter='20'>
			<el-col :span='16'>
				<network-list ref='networkList' @node-click='nodeClick'>
					<template slot='right' slot-scope='{node,data}'>
						<span>
		          <el-button
		            type="text"
		            icon='el-icon-plus'
		            @click='create(data)'>
		          </el-button>
		          <el-button
		            type="text"
		            icon='el-icon-edit'
		            @click='edit(node,data)'>
		          </el-button>
		          <el-button
		            type="text"
		            icon='el-icon-delete'
		            @click='del(node,data)'>
		          </el-button>
		        </span>
					</template>
				</network-list>
			</el-col>
			<el-col :span='8' style='height:100%'>
				<el-card class="box-card" shadow='hover'>
				  <div slot="header" class="clearfix">
				    <span>菜单详情</span>
				    <el-button style="float: right; padding: 3px 0" type="text" @click='onlyShow'>只显示此菜单</el-button>
				  </div>
				  <el-form 
					ref='form' label-width='70px' size='mini' class='c-form-text'>
						<el-form-item label='菜单名称'>
							<span>{{ nodeData.name}}</span>
						</el-form-item>
						<el-form-item label='菜单路径'>
							<span>{{ nodeData.path }}</span>
						</el-form-item>
						<el-form-item label='排序'>
							<span>{{ nodeData.order }}</span>
						</el-form-item>
						<el-form-item label='录入员'>
							<span>{{ nodeData.create_user_name }}</span>
						</el-form-item>
						<el-form-item label='创建时间' >
							<span>{{ nodeData.create_time }}</span>
						</el-form-item>
						<el-form-item label='更新时间' >
							<span>{{ nodeData.update_time }}</span>
						</el-form-item>					
					</el-form>
				</el-card>
			</el-col>
		</el-row>
		<edit-dialog ref='editDialog' @updated='reload'/>
	</div>
</template>
<script>
	import networkList from '@/components/it/network/treeList'
	import editDialog from '@/components/it/network/editDialog'

	export default {
		components:{ networkList, editDialog },
		data(){
			return {
				form:{},
				nodeData:{}
			}
		},
		mounted(){
			this.$refs.networkList.initData()
		},
		methods:{
			create(data=null){
				this.$refs.editDialog.open().then(that=>{
					that.create().then(()=>{
						if(data){
							that.assign({
								parent_id:data.id,
								parent_node:data.name
							})
						}
					})
				})
			},
			edit(node,data){
				let editData = {...data}
				editData.parent_node = node.parent.data.name
				this.$refs.editDialog.open().then(that=>{
					that.initData(editData)
				})
			},
			del(node,data){
				this.$refs.networkList.del(node,data)
			},
			reload(){
				this.$refs.networkList.reload()
			},	
			nodeClick(data){
				this.nodeData = data
			},
			onlyShow(){
				this.$refs.networkList.filter(this.nodeData.name)
			}
		}
	}
</script>