<template>
	<div>
		<el-alert title='合同创建后，才可以进行项目立项操作' type='warning' style='margin-bottom: 10px'></el-alert>
		<el-alert
	    :title='"当前有 "+toFillContractTotal+" 个合同信息的需进行完善，请及时进行处理"'
	    type="error" 
	    :closable="false"
	    style='margin: 10px 0px'
	    v-show='toFillContractTotal>0'
	    ></el-alert>
		<div style='margin:10px 0px'>
			<el-button type='primary' @click='create'>合同录入</el-button>
			<el-badge :value='toFillContractTotal'>
				<el-button type='danger' :loading='toFillContractLoading' @click='openOrderSummaryDialog'>待完善合同</el-button>
				<list-dialog ref='listDialog'>
					<div slot='a'>
						<el-alert title='以下合同是在项目立项时创建的，只有一个合同编号，其它字段需要进行完善' type='warning' style='margin-bottom: 10px'></el-alert>
					</div>
					<el-table-column slot='column' label='操作' width='60' fixed='right' align='center'>
						<template slot-scope='scope'>
							<el-button size='mini' type='text' @click='edit(scope)'>完善</el-button>
						</template>
					</el-table-column>
				</list-dialog>
				 
			</el-badge>
			<el-button @click='exportExcel'>导出Excel</el-button>
		</div>
		<el-tabs v-model='tabName'>
			<el-tab-pane label='合同列表' name='list'>
				<list ref='list'>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='90'>
						<template slot-scope='scope'>
							<el-button  size='mini' type='text' @click='edit(scope)'>编辑</el-button>	
							<el-button  size='mini' type='text' @click='del(scope)'>删除</el-button>
						</template>
					</el-table-column>
				</list>
			</el-tab-pane>
		</el-tabs>
		<form-dialog ref='formDialog' @saved='reload'></form-dialog>
		
	</div>
</template>
<script>
	import list from '@/components/yyzx/contract/list'
	import listDialog from '@/components/yyzx/contract/listDialog'
	import formDialog from '@/components/yyzx/contract/formDialog'
	import contractApi from '@/api/yyzx/contract'
	export default {
		components:{
			list,
			listDialog,
			formDialog
		},
		data(){
			return {
				tabName:'list',
				toFillContractTotal:0,
				toFillContractLoading:true
			}
		},
		mounted(){
			this.getToFillContractTotal()
			this.$refs.list.initData()
		},
		methods:{
			getToFillContractTotal(){
				this.toFillContractLoading = true
				contractApi.getToFillContractTotal().then(res=>{
					this.toFillContractTotal = res.data
					this.toFillContractLoading = false
				})
			},
			openOrderSummaryDialog(){
				this.$refs.listDialog.open({ toFill:1 })
			},
			create(){
				this.$refs.formDialog.open()
			},
			edit({row}){
				this.$refs.formDialog.open(row.id)
			},
			del({ row,$index }){
				let confirmText = '确定删除？'
				this.$confirm(confirmText,'提示',{
					type: 'warning'
				}).then(()=>{
					contractApi.del(row.id).then(res=>{
						this.$message.success('删除成功')
						this.reload()					
					})
				})
			},
			reload(){				
				this.getToFillContractTotal()
				if(this.$refs.listDialog.show){
					this.$refs.listDialog.reload()
				}
				this.$refs.list.reload()
			},
			exportExcel(){
				this.$refs.list.exportExcel()
			}
		}
	}
</script>