<template>
	<div>
		<el-alert title='业务人员进行项目产品色样的申请，填写好信息后提交至经营进行处理' type='warning' style='margin-bottom: 10px'></el-alert>
		<div style='margin:10px 0px'>
			<el-button type='primary' size='small' @click='create'>色样申请</el-button>
			<el-badge :value='toConfirmTotal'>
				<el-button size='small' type='danger' :loading='toOrderProjectLoading' @click='openSummaryDialog'>待确认色样</el-button>
				<summary-dialog ref='summaryDialog'>
					<el-table-column slot='column' label='操作' width='60' fixed='right' align='center'>
						<template slot-scope='scope'>
							<el-button size='mini' type='text' @click='createByToConfirm(scope)'>确认</el-button>
						</template>
					</el-table-column>
				</summary-dialog>
			</el-badge>
		</div>
		<el-tabs v-model='tabName' @tab-click='reload'>
			<el-tab-pane label='色样申请记录' name='list'>
				<list ref='list' @del='reload' init>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='90'>
						<template slot-scope='scope'>
							<el-button  size='mini' type='text' @click='edit(scope)' v-show='scope.row.input_status==0'>编辑</el-button>	
							<el-button  size='mini' type='text' @click='del(scope)' v-show='scope.row.input_status==0'>删除</el-button>	
							<el-button  size='mini' type='text' @click='info(scope)' v-show='scope.row.input_status==1'>详情</el-button>
						</template>
					</el-table-column>
				</list>				
			</el-tab-pane>
			<el-tab-pane label='色样确认记录' name='confirm'>
				<confirm-list ref='confirmList' @del='reload'>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='60'>
						<template slot-scope='scope'>
							<el-button  size='mini' type='text' @click='info(scope)'>详情</el-button>
						</template>
					</el-table-column>
				</confirm-list>
			</el-tab-pane>
			<el-tab-pane label='色样汇总' name='summary'>
				<progress-summary-list ref='progressSummaryList'>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='90'>
						<template slot-scope='scope'>
							<el-button size='mini' type='text' @click='reSubmit(scope)' :disabled='scope.row.is_confirm!=0'>重新打样</el-button>
						</template>
					</el-table-column>
				</progress-summary-list>
			</el-tab-pane>
		</el-tabs>
		<form-dialog ref='formDialog' @saved='reload' />
		<confirm-form-dialog ref='confirmFormDialog' @saved='reload' />
		<supply-form-dialog ref='supplyFormDialog' @saved='reload' />
		<progress-info ref='progressInfo'>
			<div slot='footer' slot-scope='{data}'>
				<el-popover placement="top">
				  <el-form :model='form' size='mini' ref='supplyForm' :rules='rules'>
				  	<el-form-item label='补充内容' prop='content'>
				  		<el-input v-model='form.content'></el-input>
				  	</el-form-item>
				  	<el-form-item label='附件管理'>
							<attach-upload 
								ref='attachUpload'
								:url='attachUploadUrl'
								:params='{}'
								hide-upload-button/>
						</el-form-item>
				  </el-form>
				  <div style="text-align: right; margin: 0">				    
				    <el-button type="primary" size="mini" @click='supply(data)'>提交</el-button>
				  </div>
				  <el-button type='primary' slot="reference" size='small' >补充说明</el-button>
				</el-popover>
			</div>
		</progress-info>
	</div>
</template>
<script>
	import list from '@/components/xs/colorSample/list'
	import confirmList from '@/components/xs/colorSample/confirmList'
	import summaryDialog from '@/components/xs/colorSample/toConfirmListDialog'
	import formDialog from '@/components/xs/colorSample/formDialog'
	import confirmFormDialog from '@/components/xs/colorSample/confirmFormDialog'
	import summaryList from '@/components/xs/colorSample/toConfirmList'
	import colorSampleApi from '@/api/xs/colorSample'
	import progressInfo from '@/components/xs/colorSample/progressInfo'
	import progressSummaryList from '@/components/xs/colorSample/progressSummaryList'
	import supplyFormDialog from '@/components/xs/colorSample/supplyFormDialog'
	import attachUpload from '@/components/common/attach/upload'
	import colorSampleSupplyApi from '@/api/xs/colorSampleSupply'

	export default {
		components:{
			list,
			formDialog,
			summaryDialog,
			summaryList,
			confirmFormDialog,
			confirmList,
			progressInfo,
			progressSummaryList,
			supplyFormDialog,
			attachUpload
		},
		data(){
			return {
				form:{
					content:'',
					sample_id:null
				},
				attachUploadUrl:colorSampleSupplyApi.attachUploadUrl,
				tabName:'list',
				toConfirmTotal:0,
				toOrderProjectLoading:true,
				rules:{
					content:[{required:true,message:'请填写补充内容'}]
				}
			}
		},
		mounted(){
			this.getToConfirmTotal()
		},
		methods:{
			getToConfirmTotal(){
				this.toOrderProjectLoading = true
				colorSampleApi.getToConfirmTotal().then(res=>{
					this.toConfirmTotal = res.data
					this.toOrderProjectLoading = false
				})
			},
			openSummaryDialog(){
				this.$refs.summaryDialog.open()
			},
			create(){
				this.$refs.formDialog.open()
			},
			createByToConfirm({ row }){
				let data = this.$commonJs.obj.copyByKey(row,[
					'id','project_no','project_name','customer_name','company_name','series','material',
					'surface','xc_brand','wj_brand','temperature','xc_color','wj_color','glass_color','express','status','submit_time'
				])
				this.$refs.confirmFormDialog.open(row)
			},
			edit({row}){
				this.$refs.formDialog.open(row.id)
			},
			details({row}){
				this.$refs.formDialog.open(row.id)
			},
			del(scope){
				this.$refs.list.del(scope)
			},
			reload(){
				this.getToConfirmTotal()
				if(this.$refs.summaryDialog.show){
					this.$refs.summaryDialog.reload()
				}
				if(this.tabName==='list'){
					this.$refs.list.reload()
				}else if(this.tabName ==='confirm'){
					if(this.$refs.confirmList.inited){
						this.$refs.confirmList.reload()
					}else{
						this.$refs.confirmList.initData()
					}
				}else if(this.tabName ==='summary'){
					if(this.$refs.progressSummaryList.inited){
						this.$refs.progressSummaryList.reload()
					}else{
						this.$refs.progressSummaryList.initData()
					}
				}
			},
			info({row}){
				this.$refs.progressInfo.open(row.id)
			},
			reSubmit({row}){
				let data = this.$commonJs.obj.copyByKey(row,[
					'no','time','project_no','project_id','project_name','customer_name','company_id',
					'color_no','series','material','surface','xc_brand','wj_brand','temperature','xc_color','wj_color','glass_color'
				])
				data.time++
				this.$refs.formDialog.open(data)
			},
			supply(data){
				this.$refs.supplyForm.validate(v=>{
					if(v){
						this.form.sample_id=data.id
						colorSampleSupplyApi.create(this.form).then(res=>{
							this.$refs.attachUpload.params.supply_id = res.data
							this.$refs.attachUpload.upload().then(res=>{
								this.$message.success('提交成功')
								this.$refs.progressInfo.reload()
								this.$refs.supplyForm.resetFields()
							})
						})
					}else{
						return false
					}
				})
			}
		}
	}
</script>