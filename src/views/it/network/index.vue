<template>
	<div>
		<div style='margin-bottom: 10px'>
			<el-button type='primary' @click='create()'>创建网络节点</el-button>
		</div>		
		<el-row :gutter='20'>
			<el-col :span='16'>				
				<network-list height='500px' ref='networkList' @node-click='nodeClick'>
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
				    <span>网络节点详情</span>
				    <el-button style="float: right; padding: 3px 0" type="text" @click='onlyShow'>只显示此节点</el-button>
				  </div>
				  <el-form 
					ref='form' label-width='70px' size='mini' class='c-form-text'>
						<el-form-item label='节点名称'>
							<span>{{ nodeData.name}}</span>
						</el-form-item>
						<el-form-item label='节点类型'>
							<span>{{ nodeData.type }}</span>
						</el-form-item>
						<el-form-item label='所属公司'>
							<span>{{ nodeData.company_name}}</span>
						</el-form-item>		
						<el-form-item label='设备型号'>
							<span>{{ nodeData.model }}</span>
						</el-form-item>	
						<el-form-item label='安装位置'>
							<span>{{ nodeData.position }}</span>
						</el-form-item>
						<el-form-item label='IP信息'>
							<span>{{ nodeData.ip }}</span>
						</el-form-item>
						<el-form-item label='管理地址'>
							<span>{{ nodeData.admin_address }}</span>
						</el-form-item>
						<el-form-item label='管理账号'>
							<span>{{ nodeData.account }}</span>
						</el-form-item>
						<el-form-item label='账号密码'>
							<span>{{ nodeData.password }}</span>
						</el-form-item>
						<el-form-item label='备注'>
							<span>{{ nodeData.remarks }}</span>
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