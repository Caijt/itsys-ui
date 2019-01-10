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
				<el-row :gutter='10'>
					<el-col :span='16'>
						<el-form-item label='项目名称' prop='project_name'>
							<el-input v-model='form.project_name' placeholder=''>
								<el-button slot="append" @click='openProjectDialog' :disabled='isEdit'>提取</el-button>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='客户名称' prop='customer_name' >
							<el-input v-model='form.customer_name' placeholder=''>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='16'>
						<el-form-item label='销售公司' prop='company_id'>
							<el-select 
								v-model='form.company_id' 
								placeholder='选择销售公司'
								filterable
								style='width: 100%'
								:loading='companyLoading'>
								<el-option
									v-for='item in companyList'
									:key='item.id'
									:label='item.name'
									:value='item.id'
									v-show='item.is_disabled?false:true'
								></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='业务员' prop='salesman'>
							<el-input v-model='form.salesman' placeholder=''>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<divider title='色板样品信息'></divider>
				<el-row :gutter='10' class='c-input-readonly'>
					<el-col :span='8'>
						<el-form-item label='打样编号' prop='no'>
							<el-input :value='form.no' readonly placeholder='创建后自动生成'>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='打样次数' prop='time'>
							<el-input :value='"第 "+form.time+" 次"' readonly>
							</el-input>
						</el-form-item>
					</el-col>	
				</el-row>
				<el-row :gutter='10' :class='{ "c-input-readonly":form.input_status!=0}'>
					<el-col :span='8'>
						<el-form-item label='系列' prop='series'>
							<el-input v-model='form.series' :readonly='form.input_status!=0'>
							</el-input>
						</el-form-item>
					</el-col>			
					<el-col :span='8'>
						<el-form-item label='材料' prop='material'>
							<el-input v-model='form.material' :readonly='form.input_status!=0'>
							</el-input>
						</el-form-item>
					</el-col>			
					<el-col :span='8'>
						<el-form-item label='表面处理' prop='surface'>
							<el-input v-model='form.surface' :readonly='form.input_status!=0'>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='型材品牌' prop='xc_brand'>
							<el-input v-model='form.xc_brand' :readonly='form.input_status!=0'>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='五金品牌' prop='wj_brand'>
							<el-input v-model='form.wj_brand' :readonly='form.input_status!=0'>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='温控' prop='temperature'>
							<el-input v-model='form.temperature' :readonly='form.input_status!=0'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='型材颜色' prop='xc_color'>
							<el-input v-model='form.xc_color' :readonly='form.input_status!=0'>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='五金颜色' prop='wj_color'>
							<el-input v-model='form.wj_color' :readonly='form.input_status!=0'>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='玻璃胶颜色' prop='glass_color'>
							<el-input v-model='form.glass_color' :readonly='form.input_status!=0'>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='色板数量' prop='amount'>
							<el-input v-model.number='form.amount' :readonly='form.input_status!=0'>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='24'>
						<el-form-item label='其它要求' prop='remarks'>
							<el-input v-model='form.remarks' :readonly='form.input_status!=0'>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='24'>
						<el-form-item label='快递信息' prop='express'>
							<el-input v-model='form.express' placeholder='填写发出的快递信息' :readonly='form.input_status!=0'>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='收件人' prop='receiver'>
							<el-input v-model='form.receiver' placeholder='填写色样寄回的联系收件人' :readonly='form.input_status!=0'>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='联系电话' prop='receive_tel'>
							<el-input v-model='form.receive_tel' placeholder='填写色样寄回的联系电话' :readonly='form.input_status!=0'>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='24'>
						<el-form-item label='收件地址' prop='receive_address'>
							<el-input v-model='form.receive_address' placeholder='填写色样寄回的联系地址' :readonly='form.input_status!=0'>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		<divider title='打样申请流程'></divider>
		<el-steps :active="flowStep" finish-status="success">
		  <el-step title="色样提交" :description='$commonJs.formatDate(form.submit_time) '></el-step>
		  <el-step title="运营归档"></el-step>
		  <el-step title="采购打板"></el-step>
		  <el-step title="色样寄出"></el-step>
		  <el-step title="客户确认"></el-step>
		</el-steps>
		<divider title='历史打样记录'></divider>
		<delivery-list 
			:params='params' hide-query ref='deliveryList' size='mini' max-height='200'>
		</delivery-list>
	</div>
		<span slot="footer">
		 	<el-button type='primary'  @click='save(1)' :loading='loading' v-show='form.input_status==0'>提交申请</el-button>
	    <el-button  @click='save(0)' :loading='loading' v-show='form.input_status==0'>保存</el-button>
	    <el-button @click="show=false">关 闭</el-button>
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
	import colorSampleApi from '@/api/xs/colorSample'
	import projectDialog from '@/components/yyzx/project/listDialog'
	import deliveryList from '@/components/xs/colorSample/progressList'
	import formDialog from '@/components/sc/product/formDialog'
	import contractInfo from '@/components/yyzx/contract/info'
	import companyApi from '@/api/yyzx/company'
	const formInit = {
		project_id:null,
		project_no:'',
		project_name:'',
		salesman:'',
		company_id:'',

		id:null,
		no:'',
		time:1,
		input_status:0,
		status:'EDIT',
		color_no:'',
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
		amount:1,
		remarks:'',
		receive_address:'',
		receive_tel:'',
		receiver:'',
		submit_time:''
	}
	export default {
		components:{ 
			projectDialog,
			deliveryList,
			formDialog,
			contractInfo
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
				loading:false,
				data:{ },				
				form:{ ...formInit },
				rules:{
					company_id:[{ required:true, message:'请选择销售公司' }],
					project_name:[{ required:true, message:'请填写项目名称' }],
					salesman:[{ required:true, message:'请填写业务员' }],
					amount:[{ type:'number',message:'请输入数字' },]
				},
				params:{
					no:null
				},
				updated:false,
				companyList:[],
				companyLoading:false
			}
		},
		computed:{
			isEdit(){
				return this.form.id? true:false
			},
			title(){
				let title = '色板样品申请'
				return title
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
		mounted(){
			this.getCompanyList()
		},
		methods:{
			//获取公司类型列表
			getCompanyList(){
				this.companyLoading = true
				companyApi.getEnumList(1).then(res=>{
					this.companyList = res.data
					this.companyLoading = false
				})
			},
			selectProject(row){
				let data = this.$commonJs.obj.copyByKey(row,[
					'customer_name','salesman'
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
			save(status=0){			
				let messageText = status==0?'保存成功':'提交成功'
				this.$refs.form.validate(valid=>{
					if(valid){
						this.form.input_status = status
						this.loading = true
						if(this.isEdit){
							colorSampleApi.update(this.form).then(res=>{
								this.loading = false
								this.$message.success(messageText)
								this.updated = true
								if(this.form.input_status==1){
									this.show=false
								}
							})
						}else{
							colorSampleApi.create(this.form).then(res=>{
								this.form.id = res.data.id
								this.form.no = res.data.no
								this.loading = false
								this.$message.success(messageText)
								this.updated = true
								if(this.form.input_status==1){
									this.show=false
								}
							})
						}
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
				if(this.form.no){
					this.params.no = this.form.no
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
			selectOrder(row){
				
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