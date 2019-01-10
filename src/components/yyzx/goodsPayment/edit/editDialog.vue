<template>
	<div>
	<el-dialog 
		:title='title'
		class='c-dialog-fixed'
		:visible.sync='show'
		:append-to-body='inDialog'
		@open='openDialog'
		width='75%'
		@close='closeDialog'>
		<div v-loading='loading'>
			<el-form class='c-form-text' label-width='85px' >
				<divider title='项目信息'></divider>	
				<el-row :gutter='10'>
					<el-col :span='16'>
						<el-form-item label='项目名称'>
							<span>{{form.project_name}}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='项目编号'>
							<span>{{form.project_no}}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='合同编号'>
							<span>{{form.contract_no}}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='合同面积'>
							<span>{{form.contract_area}}㎡</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='合同金额'>
							<span>￥ {{form.contract_price}}</span>
						</el-form-item>
					</el-col>
					<el-col :span='16'>
						<el-form-item label='业绩公司'>
							<span>{{form.company_name}}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='业务员'>
							<span>{{form.salesman}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label='客户名称'>
					<span>{{form.customer_name}}</span>
				</el-form-item>
				<el-row :gutter='10'>
					<el-col :span='8'>
						<el-form-item label='已结算面积'>
							<span>{{form.settlement_area_total}}㎡</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='已结算金额'>
							<span>￥ {{form.settlement_price_total}}</span>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<el-form 
				:model='form' :rules='rules' 
				ref='form' label-width='95px' 
				size='mini' status-icon 
				class='c-form-mini'>
				<divider title='本次项目货款信息'></divider>	
				<el-form-item label='项目选择' prop='project_id' class='no-border' :inline-message='true'>
					<el-button type='primary' @click='openProjectDialog'>{{ form.project_id?form.project_name:'选择'}}</el-button>
				</el-form-item>
				<el-row :gutter='10'>		
					<el-col :span='8'>
						<el-form-item label='结算面积' prop='settlement_area'>
							<el-input v-model.number='form.settlement_area' placeholder=''>
								<span slot="suffix">㎡</span>
							</el-input>
						</el-form-item>
					</el-col>		
					<el-col :span='8'>
						<el-form-item label='结算金额' prop='settlement_price'>
							<el-input v-model.number='form.settlement_price' placeholder=''>
								<span slot="prefix">￥</span>
							</el-input>
						</el-form-item>
					</el-col>	
					<el-col :span='24'>
						<el-form-item label='结算订单' prop='settlement_order'>
							<el-input v-model='form.settlement_order' placeholder=''>
							</el-input>
						</el-form-item>	
					</el-col>
				</el-row>			
				<el-form-item label='附件管理' >
					<attach-upload ref='attachUpload' :params='attachUploadParams' @uploaded='res=>{$refs.attachList.push(res)}'></attach-upload>
					<attach-list show-del ref='attachList'></attach-list>
				</el-form-item>	
			</el-form>
		</div>
			<span slot="footer">
			 	<el-button type='primary' @click='save(1)' :loading='loading'>提交</el-button>
			 	<el-button @click='save(0)' :loading='loading'>保存</el-button>
		    <el-button @click="show=false">关 闭</el-button>
	  	</span>
		</el-dialog>
		<project-list-dialog sort-prop='create_time' ref='projectListDialog'>
			<el-table-column slot='column' fixed='right' label='操作' align='center' width='60'>
				<template slot-scope='{row}'>
					<el-button type='text' @click='selectProject(row)'>选择</el-button>
				</template>
			</el-table-column>
		</project-list-dialog>
	</div>
</template>
<script>
	import paymentApi from '@/api/yyzx/goodsPayment'
	import attachUpload from '@/components/common/attach/upload'
	import attachList from '@/components/common/attach/textList'
	import projectListDialog from '@/components/yyzx/project/progress/listDialog'

	const formInit = {
		id:null,
		input_status:-1,
		project_id:null,
		project_name:'',
		project_no:'',
		contract_no:'',
		contract_price:0,
		customer_name:'',
		company_name:'',
		salesman:'',
		settlement_area_total:0,
		settlement_price_total:0,
		settlement_order:'',
		settlement_area:0,
		settlement_price:0
	}
	export default {
		components:{ 
			attachUpload,
			attachList,
			projectListDialog
		},
		props:{
			inDialog:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return {
				resolve:null,
				show:false,
				loading:false,
				updated:false,
				data: { },				
				form: { ...formInit },
				attachUploadParams: {
					table_name:'yyzx_goods_payment',
					table_id:null,
				},
				rules:{
					project_id:[{ required:true, message:'请选择项目' }],
					settlement_order:[{ required:true, message:'请填写结算的订单' }],
					settlement_area:[
						{ required:true, message:'请填写结算面积' },
						{ type:'number',message:'请输入数字' },
						{ validator:this.$commonJs.validateRules.et0 }
					],
					settlement_price:[
						{ required:true, message:'请填写结算金额' },
						{ type:'number',message:'请输入数字' },
						{ validator:this.$commonJs.validateRules.et0 }
					]
				}				
			}
		},
		computed:{
			isEdit(){
				return this.form.id? true:false
			},
			title(){
				let title = this.isEdit?'项目货款编辑':'项目货款录入'
				return title
			}
		},
		mounted(){
		},
		methods:{
			openDialog(){
				this.$nextTick(()=>{
					if(this.resolve){
						this.resolve(this)
					}
				})
			},
			open(){
				this.show = true
				return new Promise((resolve,reject)=>{
					this.resolve = resolve
				}) 
			},
			getForm(id){
				this.loading = true
				paymentApi.getForm(id).then(res=>{
					this.initData(res.data)
					this.loading = false
				})
			},
			create(params={}){
				this.loading = true
				paymentApi.create(params).then(res=>{
					this.initData(res.data)
					this.loading = false
				})
			},
			save(isSubmit=false){
				this.$refs.form.validate(valid=>{
					if(valid){
						this.form.input_status = isSubmit?1:0
						if(isSubmit){
							this.$confirm('确定提交吗？提交后信息无法修改','提示',{
								type: 'warning'
							}).then(()=>{
								this.update()
							})
						}else{
							this.update()
						}
					}else{
						return false
					}
				})
			},
			update(){
				this.loading = true
				let messageText = this.form.input_status?'提交成功':'保存成功'
				paymentApi.update(this.form).then(res=>{
					this.updated = true
					this.loading = false
					this.$message.success(messageText)
					if(this.form.input_status==1){
						this.show=false
					}
				}).catch(res=>{
					this.loading = false
					console.log(res)
				})
			},
			closeDialog(){	
				if(this.updated){
					this.$emit('updated')
				}
				this.resolve = null
				this.loading = false
				this.resetFields()			
				this.$refs.attachList.clear()
			},
			initData(data){
				this.assign(data)
				this.attachUploadParams.table_id = data.id
				if(data.attach_ids){
					this.$refs.attachList.initData({attach_ids:data.attach_ids})
				}
				this.clearValidate()
			},
			assign(data){				
				this.form = { ...this.form, ...data }
				this.form.settlement_area = Number(this.form.settlement_area)
				this.form.settlement_price = Number(this.form.settlement_price)
				return this
			},			
			clearValidate(){
				this.$nextTick(()=>{
					this.$refs.form && this.$refs.form.clearValidate()
				})
			},
			resetFields(){
				this.updated = false
				this.form = {...formInit}
				this.clearValidate()
				return this
			},
			productUpdated(){
				this.updated = true
				this.$refs.productList.reload()
			},
			remove(scope){
				this.$refs.productList.remove(scope)
			},
			openProjectDialog(){
				this.$refs.projectListDialog.open()
			},
			selectProject(row){
				this.form.project_no = row.no
				this.form.project_name = row.name
				this.form.project_id = row.id
				this.form.contract_no = row.contract_no
				this.form.contract_price = row.contract_price
				this.form.contract_area = row.contract_area
				this.form.customer_name = row.customer_name
				this.form.company_name = row.company_name
				this.form.salesman = row.salesman
				this.form.settlement_area_total = row.settlement_area_total
				this.form.settlement_price_total = row.settlement_price_total
				this.$refs.projectListDialog.close()
			}
		}
	}
</script>