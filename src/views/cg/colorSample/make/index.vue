<template>
	<div>
		<el-alert title='业务人员进行项目产品色板样品信息的录入，提交后可进行打样申请' type='warning' style='margin-bottom: 10px'></el-alert>
		<el-tabs v-model='tabName' @tab-click='reload'>
			<el-tab-pane label='待打板申请' name='toMake'>
				<apply-list :params='toMakeListParams' ref='applyList' init hide-delivery-field hide-confirm-field>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='90'>
						<template slot-scope='{row}'>							
							<el-button  size='mini' type='text' @click='openApplyInfo(row.id)'>详情</el-button>
							<el-button  size='mini' type='text' @click='file(row)'>打板</el-button>
						</template>
					</el-table-column>
				</apply-list>
			</el-tab-pane>
			<el-tab-pane label='已打板完成申请' name='submit'>
				<apply-list ref='submitList' :params='submitListParams' hide-delivery-field hide-confirm-field sort-prop='make_time'>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='60'>
						<template slot-scope='scope'>
							<el-button  size='mini' type='text' @click='openApplyInfo(scope.row.id)'>详情</el-button>
							<!-- <el-button  size='mini' type='text' @click='undo(scope)'>撤回</el-button> -->
						</template>
					</el-table-column>
				</apply-list>
			</el-tab-pane>
		</el-tabs>	
		<file-dialog ref='fileDialog' @updated='reload'></file-dialog>
		<apply-info ref='applyInfo'>
			<div slot='footer' slot-scope='{data}' v-if='data.status=="FILE"||data.status=="MAKING"'>
				<el-button type='primary' @click='file(data)'>打板</el-button>
			</div>
		</apply-info>
	</div>
</template>
<script>
	import applyList from '@/components/xs/colorSample/query/applyList'
	import fileDialog from '@/components/cg/colorSample/make/editDialog'
	import applyInfo from '@/components/xs/colorSample/apply/info'

	export default {
		components:{
			applyList,
			fileDialog,
			applyInfo
		},
		data(){
			return {
				form:{
					content:'',
					sample_id:null
				},
				tabName:'toMake',
				toConfirmTotal:0,
				toOrderProjectLoading:true,
				rules:{
					content:[{required:true,message:'请填写补充内容'}]
				},
				toMakeListParams:{
					fixed_status:['FILE','MAKING'],
					inFactory:1,
					inCompany:0
				},
				submitListParams:{
					inFactory:1,
					fixed_status:['MAKE','DELIVERY','CONFIRM_Y','CONFIRM_N']
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
				if(this.tabName==='toMake'){
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
			file(row){
				this.$refs.fileDialog.open().then(that=>{
					if(row.make_id){
						that.getForm(row.make_id)
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