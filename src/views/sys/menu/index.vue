<template>
	<div>
		<el-alert
	    title="警告"
	    type="warning"
	    description="以下为系统菜单数据，非系统开发人员请不要随意修改菜单信息，否则会导致系统无法打开！"
	    show-icon>
	  </el-alert>
		<div style='margin:10px 0px'>
			<el-button type='primary' @click='create()'>创建菜单</el-button>
		</div>		
		<el-row :gutter='20'>
			<el-col :span='16'>
				<menu-list show-path height='400px' ref='menuList' @node-click='nodeClick'>
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
				</menu-list>				
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
							<span>{{ nodeData.title}}</span>
						</el-form-item>
						<el-form-item label='菜单路径'>
							<span>{{ nodeData.path }}</span>
						</el-form-item>
						<el-form-item label='排序'>
							<span>{{ nodeData.order }}</span>
						</el-form-item>
						<el-form-item label='API'>
							<span v-html='$commonJs.textareaToHtml(nodeData.api)'></span>
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
	import menuList from '@/components/sys/menu/treeList'
	import editDialog from '@/components/sys/menu/editDialog'

	export default {
		components:{ menuList, editDialog },
		data(){
			return {
				form:{},
				nodeData:{}
			}
		},
		mounted(){
			this.$refs.menuList.initData()
		},
		methods:{
			create(data = null){
				this.$refs.editDialog.open().then(that=>{
					if(data){
						that.assign({
							parent_id:data.id,
							parent_menu:data.title
						})
					}
				})
			},
			edit(node,data){
				let editData = {...data}
				editData.parent_menu = node.parent.data.title
				this.$refs.editDialog.open().then(that=>{
					that.initData(editData)
				})
			},
			del(node,data){
				this.$refs.menuList.del(node,data)
			},
			reload(){
				this.$refs.menuList.reload()
			},	
			nodeClick(data){
				this.nodeData = data
			},
			onlyShow(){
				this.$refs.menuList.filter(this.nodeData.title)
			}
		}
	}
</script>