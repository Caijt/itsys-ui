<template>
	
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
				return this.form.id!=null
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
					'project_area','delivery_area_total','project_price','invoice_price_total','no_invoice_price'
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