<template>
	<div>
	<el-dialog 
		:title='title'
		class='c-dialog-fixed'
		:visible.sync='show'
		:append-to-body='inDialog'
		width='80%'
		@open='openDialog'
		@close='closeDialog'>
		<div v-loading='loading'>
			<el-form 
				:model='form' :rules='rules' 
				ref='form' label-width='85px' 
				size='mini' status-icon
				class='c-form-mini' >
				<divider title='项目信息'></divider>
				<el-row :gutter='20' class='c-input-readonly'>
					<el-col :span='19'>
						<el-row :gutter='10'>
							<el-col :span='12'>
								<el-form-item label='所属项目' prop='project_id'>
									<el-input readonly :value='form.project_no' placeholder='请选择项目'>
										<el-button slot="prepend" v-if='form.project_id' 
											icon='el-icon-document'
											@click='$refs.projectDetails.open(form.project_id)'></el-button>
										<el-button slot="append" @click='openSummaryListDialog'>选择</el-button>
									</el-input>
								</el-form-item>
							</el-col>	
							<el-col :span='12'>
								<el-form-item label='项目名称' prop='project_name'>
									<el-input readonly :value='form.project_name' placeholder='选择项目自动加载'>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span='12'>
								<el-form-item label='客户名称' prop='project_customer'>
									<el-input readonly :value='form.project_customer' placeholder='选择项目自动加载'>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span='12'>
								<el-form-item label='合同编号'>
									<el-input readonly :value='form.contract_no' placeholder='选择项目自动加载'>
										<el-button 
											slot="prepend" 
											icon='el-icon-document' 
											v-if='form.contract_id'
											@click='$refs.contractInfo.open(form.contract_id)'
											></el-button>
									</el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter='20'>
							<el-col :span='12'>
								<el-form-item label='项目金额' prop='project_price'>
									<el-input readonly :value='form.project_price'>
										<span slot="prefix">￥</span>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span='12'>
								<el-form-item label='已开票金额' prop='cw_invoice_price_total'>
									<el-input readonly :value='form.cw_invoice_price_total'>
										<span slot="prefix">￥</span>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span='12'>
								<el-form-item label='已回款金额' prop='cw_payment_price_total'>
									<el-input readonly :value='form.cw_payment_price_total'>
										<span slot="prefix">￥</span>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span='12'>
								<el-form-item label='应收欠款' prop='no_payment_price'>
									<el-input readonly :value='form.no_payment_price'>
										<span slot="prefix">￥</span>
									</el-input>
								</el-form-item>
							</el-col>
				 		</el-row>
					</el-col>
					<el-col :span='5' style='text-align: center'>
						<div style='margin-bottom: 10px'>回款进度</div>
						<el-progress 
							type="circle" 
							:percentage="$commonJs.getProgressPercentage(form.cw_payment_price_total/form.cw_invoice_price_total)" 
							:stroke-width='10'></el-progress>
					</el-col>
				</el-row>
			</el-form>
			<divider title='回款记录列表'></divider>
			<receive-payment-list :params='params' ref='receivePaymentList' size='mini' max-height='200' hide-query>
				<el-table-column slot='column' fixed='right' label='操作' align='center' width='90'>
					<template slot-scope='scope'>
						<el-button size='mini' type='text' @click='edit(scope)'>编辑</el-button>
						<el-button size='mini' type='text' @click='del(scope)'>删除</el-button>
					</template>
				</el-table-column>
			</receive-payment-list>
			
		</div>
		<span slot="footer">
			<el-button type='primary' size='small' @click='create' :disabled='!form.project_id'>添加回款</el-button>
	    <el-button @click="show=false" size='small'>关 闭</el-button>
	  </span>
	</el-dialog>
		<summary-list-dialog ref='summaryListDialog' :in-dialog='inDialog'>
			<el-table-column slot='column' width='60' align='center' label='操作' fixed='right'>
				<template slot-scope='{row}'>
					<el-button size='mini' type='text' @click='selectOrder(row)'>选择</el-button>
				</template>
			</el-table-column>
		</summary-list-dialog>
		<form-dialog :in-dialog='inDialog' ref='formDialog' @saved='reload' />
		<contract-info :in-dialog='inDialog' ref='contractInfo' />
		<project-details :in-dialog='inDialog' ref='projectDetails' />
	</div>
</template>
<script>
	import receivePaymentRecordApi from '@/api/cw/receivePaymentRecord'
	import summaryListDialog from '@/components/cw/receivePaymentRecord/summary/listDialog'
	import receivePaymentList from '@/components/cw/receivePaymentRecord/list'
	import formDialog from '@/components/cw/receivePaymentRecord/formDialog'
	import contractInfo from '@/components/yyzx/contract/info'
	import projectDetails from '@/components/projectDetails'

	const formInit = {
		project_id:null,//项目id
		project_no:'',
		contract_no:'',	//合同编号
		project_area:'',
		delivery_area_total:'',
		project_price:'',
		invoice_price_total:'',
	}

	export default {
		components:{ 
			summaryListDialog,
			receivePaymentList,
			formDialog,
			contractInfo,
			projectDetails 
		},
		props:{
			inDialog:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return {
				show:false,
				data:{},
				updated:false,
				loading:false,
				form:{ ...formInit },
				rules:{
					project_id:[{ required:true, message:'请选择项目' }]
				},
				params:{
					project_id:null
				}				
			}
		},
		computed:{
			title(){
				return '项目回款登记'
			},
			isEdit(){
				return this.form.id!=null
			}
		},		
		methods:{			
			openDialog(){
				this.buttonLoading = false
				this.$nextTick(()=>{
					this.resetFields()
					this.assign(this.data)
				})
			},
			open(data={}){
				this.data = data	
				this.show = true
			},			
			closeDialog(){
				if(this.updated){
					this.$emit('saved')
				}
			},
			assign(data){
				this.form = { ...this.form, ...data }
				if(data.project_id){
					this.params.project_id = data.project_id
					this.$refs.receivePaymentList.initData()
				}
				this.clearValidate()
			},			
			clearValidate(){
				this.$nextTick(()=>{
					this.$refs.form.clearValidate()
				})
			},
			resetFields(){
				this.updated = false
				this.form = {...formInit}
				this.$refs.receivePaymentList.clear()
				this.clearValidate()
			},
			openSummaryListDialog(){
				//this.$refs.summaryListDialog.open( { hasDelivery:1,toInvoice:1} )
				this.$refs.summaryListDialog.open( )
			},
			selectOrder(row){
				let data = this.$commonJs.obj.copyByKey(row,[
					'project_id','project_no','project_name','contract_no','contract_id','customer_id','project_customer','project_area','project_price','cw_invoice_price_total','cw_payment_price_total','no_payment_price'
				])
				this.assign(data)
				this.$refs.summaryListDialog.close()
			},
			create(){
				let data = this.$commonJs.obj.copyByKey(this.form,[
					'project_id','contract_id','customer_id'
				])
				this.$refs.formDialog.open(data)
			},
			edit({row}){
				this.$refs.formDialog.open(row)
			},
			reload(){
				receivePaymentRecordApi.getSummary({project_id:this.form.project_id}).then(res=>{
					this.form.cw_payment_price_total = res.data.payment_price_total
					this.form.no_payment_price = (Number(this.form.cw_invoice_price_total)-Number(this.form.cw_payment_price_total)).toFixed(2)
				})
				this.$refs.receivePaymentList.reload()
				this.updated = true
			},
			del({ row, $index }){
				let confirmText = '确定删除？'
				this.$confirm(confirmText,'提示',{
					type: 'warning'
				}).then(()=>{
					receivePaymentRecordApi.del(row.id).then(res=>{
						this.$message.success('删除成功')
						this.reload()
					})
				})
			},
		}
	}
</script>