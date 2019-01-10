<template>
	<div>
		<el-alert title='业务人员进行项目产品色板样品信息的录入，提交后可进行打样申请' type='warning' style='margin-bottom: 10px'></el-alert>
		<el-tabs v-model='tabName' @tab-click='reload'>
			<el-tab-pane label='待归档申请' name='toFile'>
				<apply-list :params='toFileParams' ref='applyList' hide-file-field hide-make-field hide-delivery-field hide-confirm-field init>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='90'>
						<template slot-scope='{row}'>							
							<el-button  size='mini' type='text' @click='openApplyInfo(row.id)'>详情</el-button>
							<el-button  size='mini' type='text' @click='file(row)'>归档</el-button>
						</template>
					</el-table-column>
				</apply-list>
			</el-tab-pane>
			<el-tab-pane label='已归档申请' name='submit'>
				<apply-list ref='submitList' :params='submitListParams' hide-make-field hide-delivery-field hide-confirm-field sort-prop='file_time'>
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
			<div slot='footer' slot-scope='{data}' v-if='data.status=="APPLY"'>
				<el-button type='primary' @click='file(data)'>归档</el-button>
			</div>
		</apply-info>
	</div>
</template>
<script>
	import applyList from '@/components/xs/colorSample/query/applyList'
	import sampleInfo from '@/components/xs/colorSample/edit/info'
	import fileDialog from '@/components/yyzx/colorSample/file/fileDialog'
	import applyInfo from '@/components/xs/colorSample/apply/info'

	export default {
		components:{
			applyList,
			sampleInfo,			
			fileDialog,
			applyInfo
		},
		data(){
			return {
				form:{
					content:'',
					sample_id:null
				},
				tabName:'toFile',
				toConfirmTotal:0,
				toOrderProjectLoading:true,
				rules:{
					content:[{required:true,message:'请填写补充内容'}]
				},
				toFileParams:{
					fixed_status:["APPLY"],
					inFactory:1
				},
				submitListParams:{
					inFactory:1,
					fixed_status:["FILE",'MAKING','MAKE','DELIVERY','CONFIRM_N','CONFIRM_Y'],
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
				if(this.tabName==='toFile'){
					this.$refs.applyList.reload()
				}else{
					this.$refs.submitList.reload()
				}
			},
			openSampleInfo(row){
				this.$refs.sampleInfo.open().then(that=>{
					that.get(row.id)
				})
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
					if(row.file_id){
						that.getForm(row.file_id)
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