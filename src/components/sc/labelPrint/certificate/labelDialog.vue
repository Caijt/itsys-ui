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
				:model='form' ref='form' label-width='85px' size='mini' status-icon
				class='c-form-text' >
				<divider title='订单信息'></divider>
				<el-row :gutter='10'>
					<el-col :span='8'>
						<el-form-item label='订单编号'>
							<span>{{form.order_no}}</span>
						</el-form-item>
					</el-col>
					<el-col :span='16'>
						<el-form-item label='项目名称'>
							<span>{{ form.project_name }}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='订单日期'>
							<span>{{ form.order_date }}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='客户名称'>
							<span>{{ form.customer_name }}</span>
						</el-form-item>
					</el-col>					
					<el-col :span='8'>
						<el-form-item label='生产基地'>
							<span>{{ form.area_name }}</span>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		<divider title='合格证列表'></divider>
		<certificate-list 
			:params='params' hide-query ref='certificateList' size='mini' no-page hide-order-fields show-summary @del='reload'>
			<el-table-column slot='column' fixed='right' label='操作' align='center' width='90' v-if='form.sc_self_is_finish!=1'>
				<template slot-scope='scope'>
					<el-button size='mini' type='text' @click='edit(scope)'>编辑</el-button>
					<el-button size='mini' type='text' @click='del(scope)'>删除</el-button>
				</template>
			</el-table-column>
		</certificate-list>		
	</div>
		<span slot="footer">
	    <el-button type='primary' size='mini' @click='create'>添加合格证</el-button>
	    <el-button type='primary' size='mini' @click='importExcel'>EXCEL导入</el-button>
	    <el-button type='success' size='mini' @click='print'>全部打印</el-button>
	    <el-button type='success' size='mini' @click='print2'>打印选择部分</el-button>
	  </span>
	</el-dialog>
	<form-dialog :in-dialog='inDialog' ref='formDialog' @changed='reload' />
	<print :in-dialog='inDialog' ref='print'/>
	<import-dialog :in-dialog='inDialog' ref='importDialog' @changed='reload'/>
</div>
</template>
<script>
	import certificateApi from '@/api/sc/certificate'
	import certificateList from '@/components/sc/labelPrint/certificate/list'
	import formDialog from '@/components/sc/labelPrint/certificate/formDialog'
	import print from './print'
	import importDialog from './import'

	const formInit = {
		order_no:'',
		order_id:null,	
		project_name:'',//项目名称
		customer_name:'',	
		order_date:''
	}
	export default {
		components:{ 
			certificateList,
			formDialog,
			print,
			importDialog
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
				buttonLoading:false,
				data:{},
				loading:false,
				form:{ ...formInit },
				rules:{
					order_id:[{ required:true, message:'请选择订单' }]
				},
				params:{
					order_id:null
				},
				changed:false
			}
		},
		computed:{
			title(){
				return '订单合格证'
			},
			buttonText(){
				return this.data.id?'更 新':'创 建'
			}
		},
		methods:{
			selectOrder(row){
				this.$refs.form.selectOrder(row)
			},
			openDialog(){
				this.changed = false
				this.buttonLoading = false
				this.$nextTick(()=>{
					this.clearValidate()
					this.$refs.certificateList.clear().initData()
				})
			},
			open(){
				this.show = true
			},
			closeDialog(){
				if(this.changed){
					this.$emit('changed')
				}
			},
			assign(data){
				this.form = { ...this.form, ...data }
				if(data.id){
					this.params.order_id = data.id
				}
				return this
			},
			clearValidate(){
				this.$nextTick(()=>{
					this.$refs.form&&this.$refs.form.clearValidate()
				})
			},
			resetFields(){
				this.form = {...formInit}
				this.$refs.certificateList.clear()
				this.clearValidate()
			},
			save(){				
				this.$refs.form.validate(valid=>{
					if(valid){
						this.buttonLoading = true
						certificateApi.updateInfo({
							order_id:this.form.order_id,
							product_status:this.form.sc_self_product_status,
						}).then(res=>{
							this.$message.success('生产信息更新成功')
							this.buttonLoading = false
							this.changed = true
						})
					}else{
						return false
					}
				})
			},
			saved(){
				this.show=false
				this.$emit('saved')
			},			
			create(){
				this.$refs.formDialog.resetFields().assign({order_id:this.form.id}).open()
			},
			edit({row}){
				this.$refs.formDialog.assign(row).open()
			},
			reload(){
				this.$refs.certificateList.reload()
				this.changed = true
			},
			del(scope){
				this.$refs.certificateList.del(scope)
			},
			print(data){
				this.$refs.print.get(this.$refs.certificateList.requestParams).open()
			},
			print2(data){
				if(this.$refs.certificateList.selectionList.length==0){
					this.$message.error('未选择合格证数据')
					return false
				}
				let ids = []
				this.$refs.certificateList.selectionList.forEach(d=>{
					ids.push(d.id)
				})
				this.$refs.print.get({...this.$refs.certificateList.requestParams,ids}).open()
			},
			importExcel(){
				this.$refs.importDialog.assign({order_id:this.form.id}).open()
			}
		}
	}
</script>