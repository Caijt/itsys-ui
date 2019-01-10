<template>
	<div>
		<el-alert title='业务人员对刚提交的色样或者打样效果客户不满意的色样进行打样申请' type='warning' style='margin-bottom: 10px'></el-alert>
		<el-tabs v-model='tabName' @tab-click='reload'>
			<el-tab-pane label='待打样色样' name='toApply'>
				<sample-list :params='{status:["SUBMIT","CONFIRM_N"]}' hide-edit-field ref='sampleList' sort-prop='submit_time' init>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='90'>
						<template slot-scope='{row}'>							
							<el-button  size='mini' type='text' @click='openSampleInfo(row)'>详情</el-button>
							<el-button  size='mini' type='text' @click='apply(row)'>打样</el-button>
						</template>
					</el-table-column>
				</sample-list>	
			</el-tab-pane>
			<el-tab-pane label='已提交申请' name='submit'>
				<submit-list ref='submitList' sort-prop='submit_time' hide-file-field hide-make-field hide-delivery-field hide-confirm-field>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='90'>
						<template slot-scope='{row}'>							
							<el-button  size='mini' type='text' @click='openApplyInfo(row)'>详情</el-button>
							<el-button  size='mini' type='text' @click='supply(row)' :disabled='row.status=="CONFIRM_N" || row.status=="CONFIRM_Y"'>补充</el-button>
							<!-- <el-button  size='mini' type='text' @click='undo(scope)'>撤回</el-button> -->
						</template>
					</el-table-column>
				</submit-list>
			</el-tab-pane>
		</el-tabs>
		<sample-info ref='sampleInfo'>
			<div slot='footer' slot-scope='{data}'>
				<el-button type='primary' @click='apply(data)'>打样申请</el-button>
			</div>
		</sample-info>
		<apply-dialog ref='applyDialog' @updated='reload' />
		<apply-info ref='applyInfo'>
			<div slot='footer' slot-scope='{data}' v-if='data.status!=="CONFIRM_N" && data.status!=="CONFIRM_Y"'>
				<el-button type='primary' @click='supply(data)'>补充说明</el-button>
			</div>
		</apply-info>
		<supply-dialog ref='supplyDialog' @updated='supplyUpdated' />
	</div>
</template>
<script>
	import sampleList from '@/components/xs/colorSample/edit/list'
	import submitList from '@/components/xs/colorSample/query/applyList'
	import sampleInfo from '@/components/xs/colorSample/edit/info'
	import progressSummaryList from '@/components/xs/colorSample/progressSummaryList'
	import attachUpload from '@/components/common/attach/upload'
	import colorSampleSupplyApi from '@/api/xs/colorSampleSupply'
	import applyDialog from '@/components/xs/colorSample/apply/applyDialog'
	import factoryApi from '@/api/yyzx/factory'
	import applyInfo from '@/components/xs/colorSample/apply/info'
	import supplyDialog from '@/components/xs/colorSample/apply/supplyDialog'

	export default {
		components:{
			sampleList,
			submitList,
			sampleInfo,
			progressSummaryList,
			attachUpload,
			applyDialog,
			applyInfo,
			supplyDialog
		},
		data(){
			return {
				form:{
					content:'',
					sample_id:null
				},
				attachUploadUrl:colorSampleSupplyApi.attachUploadUrl,
				tabName:'toApply',
				toConfirmTotal:0,
				toOrderProjectLoading:true,
				rules:{
					content:[{required:true,message:'请填写补充内容'}]
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
			reload(){				
				if(this.$refs.sampleInfo.show){
					this.$refs.sampleInfo.show = false
				}
				if(this.tabName==='toApply'){
					this.$refs.sampleList.reload()
				}else{
					this.$refs.submitList.reload()
				}
			},
			openSampleInfo(row){
				this.$refs.sampleInfo.open().then(that=>{
					that.get(row.id)
				})
			},
			openApplyInfo(row){
				this.$refs.applyInfo.open().then(that=>{
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
			supply(data){
				this.$refs.supplyDialog.open().then(that=>{
					that.assign({
						apply_id:data.id,
						sample_id:data.sample_id,
						apply_no:data.no
					})
				})				
			},
			supplyUpdated(){
				if(this.$refs.applyInfo.show){
					this.$refs.applyInfo.reload()
				}
			}
		}
	}
</script>