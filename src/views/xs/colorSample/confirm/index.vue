<template>
	<div>
		<el-alert title='业务人员进行项目产品色板样品信息的录入，提交后可进行打样申请' type='warning' style='margin-bottom: 10px'></el-alert>
		<el-tabs v-model='tabName' @tab-click='reload'>
			<el-tab-pane label='待确认色样' name='toConfirm'>
				<apply-list :params='toConfirmListParams' ref='applyList' hide-confirm-field init>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='90'>
						<template slot-scope='{row}'>
							<el-button  size='mini' type='text' @click='openApplyInfo(row.id)'>详情</el-button>
							<el-button  size='mini' type='text' @click='confirm(row)'>确认</el-button>
						</template>
					</el-table-column>
				</apply-list>
			</el-tab-pane>
			<el-tab-pane label='已确认色样' name='submit'>
				<apply-list ref='submitList' :params='submitListParams' sort-prop='confirm_time'>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='60'>
						<template slot-scope='scope'>							
							<el-button  size='mini' type='text' @click='openApplyInfo(scope.row.id)'>详情</el-button>
							<!-- <el-button  size='mini' type='text' @click='undo(scope)'>撤回</el-button> -->
						</template>
					</el-table-column>
				</apply-list>
			</el-tab-pane>
		</el-tabs>	
		<edit-dialog ref='editDialog' @updated='reload'></edit-dialog>
		<apply-info ref='applyInfo'>
			<div slot='footer' slot-scope='{data}' v-if='data.status=="DELIVERY"'>
				<el-button type='primary' @click='confirm(data)'>确认</el-button>
			</div>
		</apply-info>
	</div>
</template>
<script>
	import applyList from '@/components/xs/colorSample/query/applyList'
	import editDialog from '@/components/xs/colorSample/confirm/editDialog'
	import applyInfo from '@/components/xs/colorSample/apply/info'

	export default {
		components:{
			applyList,
			editDialog,
			applyInfo
		},
		data(){
			return {
				tabName:'toConfirm',
				toConfirmListParams:{
					fixed_status:['DELIVERY'],
					inCompany:1
				},
				submitListParams:{
					inCompany:1,
					fixed_status:[
						'CONFIRM_Y',
						'CONFIRM_N',
					]
				}
			}
		},
		mounted(){
			
		},
		methods:{			
			openSummaryDialog(){
				this.$refs.summaryDialog.open()
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
				if(this.$refs.applyInfo.show){
					this.$refs.applyInfo.reload()
				}
				if(this.tabName==='toConfirm'){
					this.$refs.applyList.reload()
				}else{
					this.$refs.submitList.reload()
				}
			},
			openApplyInfo(id){
				this.$refs.applyInfo.open().then(that=>{
					that.get(id)
				})
			},
			undo(scope){
				this.$refs.submitList.undo(scope)
			},
			confirm(row){
				this.$refs.editDialog.open().then(that=>{
					if(row.confirm_id){
						that.getForm(row.confirm_id)
					}else{
						that.assign({
							sample_id:row.sample_id,
							apply_id:row.id,
							apply_no:row.no							
						}).create()
					}
				})
			},
		}
	}
</script>