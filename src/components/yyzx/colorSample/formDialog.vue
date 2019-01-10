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
				:model='form' :rules='rules' ref='form' label-width='85px' 
				size='mini' status-icon	class='c-form-mini' >
				<divider title='运营归档'></divider>
				<el-row :gutter='10'>
					<el-col :span='8'>
						<el-form-item label='归档编号' prop='file_no'>
							<el-input v-model='form.file_no' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='归档日期' prop='file_date'>
							<el-date-picker v-model='form.file_date' value-format='yyyy-MM-dd' style='width: 100%' ></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span='24'>
						<el-form-item label='归档说明' prop='file_remarks'>
							<el-input v-model='form.file_remarks' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='24'>
						<el-form-item label='附件管理'>
							<attach-upload 
								ref='attachUpload'
								:url='attachUploadUrl'
								:params='{sample_id:form.sample_id}' 
								hide-upload-button/>
						</el-form-item>
					</el-col>						
				</el-row>
				<divider title='打样申请流程'></divider>
			<el-steps :active="flowStep" finish-status="success">
			  <el-step title="色样提交" :description='$commonJs.formatDate(form.submit_time) '></el-step>
			  <el-step title="运营归档"></el-step>
			  <el-step title="采购打板"></el-step>
			  <el-step title="色样寄出"></el-step>
			  <el-step title="客户确认"></el-step>
			</el-steps>
				<divider title='色样申请信息'></divider>
				<el-row :gutter='10' class='c-input-readonly'>					
					<el-col :span='24'>
						<el-form-item label='项目名称' prop='project_name'>
							<el-input readonly :value='form.project_name' placeholder=''>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='客户名称'>
							<el-input readonly :value='form.customer_name' placeholder=''>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='销售公司'>
							<el-input readonly :value='form.company_name' placeholder=''>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='业务员'>
							<el-input readonly :value='form.salesman' placeholder=''>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='系列' prop='series'>
							<el-input readonly :value='form.series' >
							</el-input>
						</el-form-item>
					</el-col>			
					<el-col :span='8'>
						<el-form-item label='材料' prop='material'>
							<el-input readonly :value='form.material'>
							</el-input>
						</el-form-item>
					</el-col>			
					<el-col :span='8'>
						<el-form-item label='表面处理' prop='surface'>
							<el-input readonly :value='form.surface'>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='型材品牌' prop='xc_brand'>
							<el-input readonly :value='form.xc_brand'>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='五金品牌' prop='wj_brand'>
							<el-input readonly :value='form.wj_brand' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='温控' prop='temperature'>
							<el-input readonly :value='form.temperature'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='型材颜色' prop='xc_color'>
							<el-input readonly :value='form.xc_color'>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='五金颜色' prop='wj_color'>
							<el-input readonly :value='form.wj_color'>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='玻璃胶颜色' prop='glass_color'>
							<el-input readonly :value='form.glass_color'>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='色板色号' prop='color_no'>
							<el-input readonly :value='form.color_no'>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='色板数量' prop='amount'>
							<el-input readonly :value='form.amount'>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='24'>
						<el-form-item label='其它要求' prop='remarks'>
							<el-input readonly :value='form.remarks'>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='收件人' prop='receiver'>
							<el-input readonly :value='form.receiver' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='联系电话' prop='receive_tel'>
							<el-input readonly :value='form.receive_tel' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='24'>
						<el-form-item label='收件地址' prop='receive_address'>
							<el-input readonly :value='form.receive_address' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='24'>
						<el-form-item label='快递信息' prop='express'>
							<el-input readonly :value='form.express' >
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				
			</el-form>
		
		<divider title='历史打样记录'></divider>
		<delivery-list 
			:params='params' hide-query ref='deliveryList' size='mini' max-height='200'>
		</delivery-list>
	</div>
		<span slot="footer">
		 	<el-button type='primary' size='small' @click='save' :loading='loading'>提交归档</el-button>
	    <el-button @click="show=false" size='small'>关 闭</el-button>
	  </span>
	</el-dialog>
	<project-dialog ref='projectDialog' :in-dialog='inDialog'>
		<el-table-column slot='column' width='60' align='center' label='操作' fixed='right'>
			<template slot-scope='{row}'>
				<el-button size='mini' type='text' @click='selectProject(row)'>选择</el-button>
			</template>
		</el-table-column>
	</project-dialog>
	<form-dialog :in-dialog='inDialog' ref='formDialog' @saved='reload' />
	<contract-info :in-dialog='inDialog' ref='contractInfo' />
</div>
</template>
<script>
	import colorSampleApi from '@/api/yyzx/colorSample'
	import projectDialog from '@/components/yyzx/project/listDialog'
	import deliveryList from '@/components/xs/colorSample/progressList'
	import formDialog from '@/components/sc/product/formDialog'
	import contractInfo from '@/components/yyzx/contract/info'
	import attachUpload from '@/components/common/attach/upload'

	const formInit = {
		project_id:null,
		project_no:'',
		project_name:'',
		company_name:'',

		id:null,
		input_status:0,
		status:'EDIT',
		surface:'',
		series:'',
		material:'',
		wj_brand:'',
		xc_brand:'',
		xc_color:'',
		wj_color:'',
		glass_color:'',
		temperature:'',
		express:'',
		submit_time:'',
		file_no:'',
		file_date:'',
		file_remarks:''
	}
	export default {
		components:{ 
			projectDialog,
			deliveryList,
			formDialog,
			contractInfo,
			attachUpload
		},
		props:{
			inDialog:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return {
				attachUploadUrl:colorSampleApi.attachUploadUrl,
				show:false,
				loading:false,
				data:{ },				
				form:{ ...formInit },
				rules:{
					sample_id:[{ required:true, message:'请选择归档的色样申请' }],
					file_date:[{ required:true, message:'请填写归档日期' }],
					file_no:[{ required:true, message:'请填写归档编号' }],
				},
				params:{
					order_id:null
				},
				updated:false
			}
		},
		computed:{
			isEdit(){
				return this.form.id? true:false
			},
			title(){
				return '色样归档 ['+this.data.no+'] 第'+this.data.time+'次打样'
			},
			flowStep(){
				switch(this.form.status){
					case 'EDIT':
						return 0;
					case 'SUBMIT':
						return 1;
				}
			}
		},
		methods:{
			selectProject(row){
				let data = this.$commonJs.obj.copyByKey(row,[
					'customer_name','company_name'
				])
				data.project_no = row.no
				data.project_id = row.id
				data.project_name = row.name
				this.assign(data)
				this.$refs.projectDialog.close()
			},
			openDialog(){
				this.loading = false
				this.$nextTick(()=>{
					this.resetFields()
					if(this.data){
						if(typeof(this.data)==='object'){
							this.assign(this.data)
						}else{
							this.getForm(this.data)
						}
					}
				})
			},
			open(data={}){
				this.data = data	
				this.show = true
			},
			getForm(id){
				this.loading = true
				colorSampleApi.getForm(id).then(res=>{
					this.assign(res.data)
					this.loading = false
				})
				
			},
			save(){				
				this.$refs.form.validate(valid=>{
					if(valid){
						this.loading = true
						colorSampleApi.file(this.form).then(res=>{
							this.$refs.attachUpload.upload().then(res2=>{
								this.$message.success('归档成功')
								this.loading = false
								this.updated = true
								this.show = false
							})
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
			closeDialog(){
				if(this.updated){
					this.$emit('saved')
				}
			},
			assign(data){
				this.form = { ...this.form, ...data }
				if(data.no){
					this.params.no = data.no
					this.$refs.deliveryList.initData()
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
				this.$refs.deliveryList.clear()
				this.clearValidate()
			},
			openProjectDialog(){
				this.$refs.projectDialog.open()
			},
			create(){
				let data = this.$commonJs.obj.copyByKey(this.form,[
					'order_id','project_id','plan_id','contract_id','no_product_area'
				])
				this.$refs.formDialog.open( data )
			},
			edit({ row }){
				this.$refs.formDialog.open( row.id )
			},
			reload(){
				colorSampleApi.getSummary({order_id:this.form.order_id}).then(res=>{
					this.form.sc_self_finish_area_total = res.data.sc_self_finish_area_total
					this.form.no_product_area = (Number(this.form.self_area)-Number(this.form.sc_self_finish_area_total)).toFixed(2)
				})
				this.$refs.deliveryList.reload()
				this.updated = true
			},
			del(scope){
				this.$refs.deliveryList.del(scope)
			},
			productFinish(){
				this.$confirm('当前订单已生产完成？确定后此订单将无法增加或修改生产记录','提示',{
					type: 'warning'
				}).then(()=>{
					colorSampleApi.productFinish(this.form.order_id).then(res=>{
						this.$message.success('生产完成')
						this.form.sc_self_is_finish=1
						this.updated = true
					})
				})
			},
			openStatusDialog(){
				this.$refs.statusForm.open({
					order_id: this.form.order_id,
					product_status: this.form.sc_self_product_status
				})
			},
			statusSaved(data){
				this.form.sc_self_product_status = data.new_product_status
				this.updated = true
			}
		}
	}
</script>