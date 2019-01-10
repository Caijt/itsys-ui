<template>
	<div>
		<el-alert title='业务人员进行项目产品色板样品信息的录入，提交后到打样申请菜单中进行打样申请' type='warning' style='margin-bottom: 10px'></el-alert>
		<div style='margin:10px 0px'>
			<el-button type='primary' @click='create'>创建色样</el-button>
		</div>
		<el-tabs v-model='tabName' @tab-click='reload'>
			<el-tab-pane label='编辑中' name='edit'>
				<edit-list ref='editList' :params='{input_status:0}' hide-submit-field>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='90'>
						<template slot-scope='scope'>
							<el-button  size='mini' type='text' @click='edit(scope)'>编辑</el-button>
							<el-button  size='mini' type='text' @click='del(scope)'>删除</el-button>
						</template>
					</el-table-column>
				</edit-list>				
			</el-tab-pane>
			<el-tab-pane label='已提交色样' name='submit'>
				<submit-list ref='submitList' :params='{input_status:1}' sort-prop='submit_time' hide-edit-field init>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='90'>
						<template slot-scope='scope'>
							<el-button  size='mini' type='text' @click='info(scope)'>详情</el-button>
							<el-button  size='mini' type='text' @click='undo(scope)'>撤回</el-button>
						</template>
					</el-table-column>
				</submit-list>		
			</el-tab-pane>			
		</el-tabs>
		<edit-dialog ref='editDialog' @updated='reload' />
		<info ref='info'>
			<div slot='footer' slot-scope='{data}' v-if='data.status=="SUBMIT"||data.status=="CONFIRM_N"'>
				<el-button type='primary' @click='apply(data)'>打样申请</el-button>
			</div>
		</info>
		<apply-dialog ref='applyDialog' @updated='reload'></apply-dialog>
	</div>
</template>
<script>
	import editList from '@/components/xs/colorSample/edit/list'
	import submitList from '@/components/xs/colorSample/edit/list'
	import confirmList from '@/components/xs/colorSample/confirmList'
	import summaryDialog from '@/components/xs/colorSample/toConfirmListDialog'
	import editDialog from '@/components/xs/colorSample/edit/editDialog'
	import summaryList from '@/components/xs/colorSample/toConfirmList'
	import colorSampleApi from '@/api/xs/colorSample'
	import info from '@/components/xs/colorSample/edit/info'
	import attachUpload from '@/components/common/attach/upload'
	import applyDialog from '@/components/xs/colorSample/apply/applyDialog'
	import factoryApi from '@/api/yyzx/factory'

	export default {
		components:{
			editList,
			submitList,
			editDialog,
			summaryDialog,
			summaryList,
			confirmList,
			info,
			attachUpload,
			applyDialog
		},
		data(){
			return {				
				tabName:'submit'
			}
		},
		mounted(){
		},
		methods:{				
			create(){
				this.$refs.editDialog.resetFields().open()
			},
			edit({row}){
				this.$refs.editDialog.open().then(that=>{
					that.assign(row)
				})
			},
			details({row}){
				this.$refs.editDialog.open(row.id)
			},
			del(scope){
				this.$refs.editList.del(scope)
			},
			reload(){
				if(this.$refs.info.show){
					this.$refs.info.reload()
				}
				if(this.tabName==='edit'){
					this.$refs.editList.reload()
				}else{
					this.$refs.submitList.reload()
				}
			},
			info({row}){
				this.$refs.info.open().then(that=>{
					that.get(row.id)
				})
			},
			undo(scope){
				this.$refs.submitList.undo(scope)
			},
			apply(row){
				this.$refs.applyDialog.open().then(that=>{
					that.loading = true
					factoryApi.getInfo(row.factory_id).then(res=>{
						that.assign({
							sample_no:row.no,
							sample_id:row.id,
							factory_name:row.factory_name,
							factory_address:res.data.address
						})
						that.loading = false
					})
				})
			},
		}
	}
</script>