<template>
	<div v-loading='loading'>
		<el-form 
			:model='form' 
			ref='form' 
			label-width='85px'
			class='c-form-text' >
			<divider title='项目信息'></divider>
			<el-row :gutter='20'>
				<el-col :span='18'>
					<el-row :gutter='20'>
						<el-col :span='12'>
							<el-form-item label='选择项目' prop='project_id' class='no-border'>
								<el-button type='primary' @click='openSummaryListDialog'>{{buttonText}}</el-button>
							</el-form-item>
						</el-col>	
						<el-col :span='24'>
							<el-form-item label='项目名称' prop='project_name'>
								<span>{{form.project_name}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='24'>
							<el-form-item label='客户名称' prop='project_customer'>
								<span>{{form.project_customer}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='12'>
							<el-form-item label='合同编号'>
								<span>{{form.contract_no}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='12'>
							<el-form-item label='已对账金额' prop='settlement_price_total'>
								<span>￥ {{form.settlement_price_total}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='12'>
							<el-form-item label='已开票金额' prop='invoice_price_total'>
								<span>￥ {{form.invoice_price_total}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='12'>
							<el-form-item label='未开票金额' prop='no_invoice_price'>
								<span>￥ {{form.no_invoice_price}}</span>
							</el-form-item>
						</el-col>
					</el-row>
				</el-col>
				<el-col :span='6' style='text-align: center'>
					<div style='margin-bottom: 5px'>开票进度</div>
					<el-progress 
						type="circle" 
						:percentage="$commonJs.getProgressPercentage(form.invoice_price_total/form.settlement_price_total)" 
						:stroke-width='10'></el-progress>
				</el-col>
			</el-row>
		</el-form>
		<divider title='开票列表'></divider>
		<div style='margin-bottom:10px'>
			<el-button type='primary' @click='create' :disabled='!form.project_id'>添加开票</el-button>
		</div>
		<invoice-record-list 
			:params='params' 
			ref='invoiceRecordList' 
			hide-query
			no-page
			max-height='200'>
			<el-table-column slot='column' fixed='right' label='操作' align='center' width='90'>
				<template slot-scope='scope'>
					<el-button size='mini' type='text' @click='edit(scope)'>编辑</el-button>
					<el-button size='mini' type='text' @click='del(scope)'>删除</el-button>
				</template>
			</el-table-column>
		</invoice-record-list>
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
	import invoiceRecordApi from '@/api/cw/invoiceRecord'
	import summaryListDialog from '@/components/cw/invoiceRecord/summary/listDialog'
	import invoiceRecordList from '@/components/cw/invoiceRecord/list'
	import formDialog from '@/components/cw/invoiceRecord/formDialog'
	import contractInfo from '@/components/yyzx/contract/info'
	import projectDetails from '@/components/projectDetails'

	const formInit = {
		order_no:'',
		order_id:null,
		project_id:null,//项目id
		project_name:'',//项目名称
		project_customer:'',
		project_no:'',
		contract_no:'',	//合同编号
		project_area:'',
		delivery_area_total:'',
		project_price:'',
		invoice_price_total:'',
		no_invoice_price:''
	}
	export default {
		components:{
			summaryListDialog,
			invoiceRecordList,
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
				updated:false,
				loading:false,
				form:{ ...formInit },
				rules:{
					project_id:[{ required:true, message:'请选择项目' }]
				},
				params:{
					project_id:null
				},
				updated:false
			}
		},
		computed:{
			//表单是否是编辑状态
			isEdit(){
				return this.form.project_id!=null
			},
			buttonText(){
				if(this.isEdit){
					return this.form.project_no
				}else{
					return '选择'
				}
			}
		},
		created(){
			
		},
		methods:{			
			assign(data){
				this.form = { ...this.form, ...data }
				if(data.project_id){
					this.params.project_id = data.project_id
					this.$refs.invoiceRecordList.initData()
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
				this.$refs.invoiceRecordList.clear()
				this.clearValidate()
			},
			openSummaryListDialog(){
				//this.$refs.summaryListDialog.open( { hasDelivery:1,toInvoice:1} )
				this.$refs.summaryListDialog.open( )
			},
			selectOrder(row){
				let data = this.$commonJs.obj.copyByKey(row,[
					'project_id','project_no','project_name','contract_no','contract_id','project_customer',
					'project_area','delivery_area_total','invoice_price_total','no_invoice_price','settlement_price_total'
				])
				this.assign(data)
				this.$refs.summaryListDialog.close()
			},
			create(){
				let data = this.$commonJs.obj.copyByKey(this.form,[
					'project_id','contract_id','no_invoice_price'
				])
				this.$refs.formDialog.open(data)
			},
			edit({row}){
				this.$refs.formDialog.open(row.id)
			},
			reload(){
				invoiceRecordApi.getSummary({project_id:this.form.project_id}).then(res=>{
					this.form.invoice_price_total = res.data.invoice_price_total
					this.form.no_invoice_price = (Number(this.form.project_price)-Number(this.form.invoice_price_total)).toFixed(2)
				})
				this.$refs.invoiceRecordList.reload()
				this.updated = true
			},
			del({ row, $index }){
				let confirmText = '确定删除？'
				this.$confirm(confirmText,'提示',{
					type: 'warning'
				}).then(()=>{
					invoiceRecordApi.del(row.id).then(res=>{
						this.$message.success('删除成功')
						this.reload()					
					})
				})
			},
		}
	}
</script>