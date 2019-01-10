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
		<divider title='玻璃标签列表'></divider>
		<el-alert title='创建标签后，必须得生成防伪二维码后才能打印' type='warning' style='margin-bottom: 10px'></el-alert>
		<window-list 
			:params='params' ref='windowList' size='mini' @del='reload' hide-order-fields show-summary no-page>
			<el-table-column slot='column' fixed='right' label='操作' align='center' width='90' v-if='form.sc_self_is_finish!=1'>
				<template slot-scope='scope'>
					<el-button size='mini' type='text' @click='edit(scope)' v-show='scope.row.is_code==0'>编辑</el-button>
					<el-button size='mini' type='text' @click='del(scope)' v-show='scope.row.is_code==0'>删除</el-button>
				</template>
			</el-table-column>
		</window-list>		
	</div>
		<span slot="footer">
	    <el-button type='primary' size='mini' @click='create'>添加标签</el-button>
	    <el-button type='primary' size='mini' @click='importExcel'>EXCEL导入</el-button>
	    <el-button type='danger' size='mini' @click='qrcode'>生成二维码</el-button>
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
	import glassApi from '@/api/sc/glass'
	import windowList from '@/components/sc/labelPrint/glass/list'
	import formDialog from '@/components/sc/labelPrint/glass/formDialog'
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
			windowList,
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
				return '订单玻璃防伪二维码标签'
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
					this.$refs.windowList.clear().initData()
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
				this.$refs.windowList.clear()
				this.clearValidate()
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
				this.$refs.windowList.reload()
				this.changed = true
			},
			del(scope){
				this.$refs.windowList.del(scope)
			},
			print(data){
				this.$refs.print.get(this.$refs.windowList.requestParams).open()
			},
			print2(data){
				if(this.$refs.windowList.selectionList.length==0){
					this.$message.error('未选择标签数据')
					return false
				}
				let ids = []
				this.$refs.windowList.selectionList.forEach(d=>{
					ids.push(d.id)
				})
				this.$refs.print.get({...this.$refs.windowList.requestParams,ids}).open()
			},
			importExcel(){
				this.$refs.importDialog.assign({order_id:this.form.id}).open()
			},
			qrcode(){
				if(this.$refs.windowList.selectionList.length==0){
					this.$message.error('未选择标签数据')
					return false
				}		
				this.$confirm('确定要生成标签的防伪二维码？生成防伪二维码后标签信息将无法修改及删除！','提示',{
					type: 'warning'
				}).then(()=>{
					let ids = []
					this.$refs.windowList.selectionList.forEach(d=>{
						if(d.is_code==0){
							ids.push(d.id)
						}						
					})
					if(ids.length==0){
						this.$message.error('您所选择的标签数据都已生成防伪二维码！')
						return false
					}
					glassApi.createCode({window_ids:ids}).then(res=>{
						this.$message.success('防伪二维码生成成功！')
						this.reload()
					})
				})
			}
		}
	}
</script>