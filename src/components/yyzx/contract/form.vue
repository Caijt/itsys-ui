<template>
	<div v-loading='loading'>
		<el-form 
			:model='form' :rules='rules' ref='form' label-width='85px' size='mini'  status-icon>
			<divider title='合同信息'></divider>
			<el-row :gutter='10' class='c-form-mini'>				
				<el-col :span='8'>
					<el-form-item label='合同编号' prop='contract_no'>
						<el-input v-model='form.contract_no' placeholder='合同的唯一编号'>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span='16'>
					<el-form-item label='客户名称' prop='customer_id'>
						<el-select 
							v-model='form.customer_id' 
							placeholder='选择客户'
							filterable
							style='width: 100%'
							:loading='customerLoading'
						>
							<el-option
								v-for='item in customerList'
								:key='item.id'
								:label='item.name'
								:value='item.id'
								v-show='item.is_disabled?false:true'
							>
								<span style="float: left">{{ item.name }}</span>
    						<span style="float: right; color: #8492a6; font-size: 13px">{{ item.type }}</span>		
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>	
				<el-col :span='8'>
					<el-form-item label='签订公司' prop='sign_company_id'>
						<el-select 
							v-model='form.sign_company_id' 
							placeholder='合同签订公司'
							filterable
							style='width: 100%'
							:loading='companyLoading'
						>
							<el-option
								v-for='item in companyList'
								:key='item.id'
								:label='item.name'
								:value='item.id'
								v-show='item.is_disabled?false:true'
							>
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span='8'>
					<el-form-item label='业绩公司' prop='company_id'>
							<el-select 
								v-model='form.company_id' 
								placeholder='合同业绩所属公司'
								filterable
								style='width: 100%'
								:loading='companyLoading'
							>
								<el-option
									v-for='item in companyList'
									:key='item.id'
									:label='item.name'
									:value='item.id'
									v-show='item.is_disabled?false:true'
								>
								</el-option>
							</el-select>
						</el-form-item>
				</el-col>
				<el-col :span='8'>
					<el-form-item label='主业务员' prop='salesman'>
						<el-input v-model='form.salesman' placeholder=''>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span='8'>
					<el-form-item label='合同日期' prop='contract_date'>
						<el-date-picker 
							v-model='form.contract_date' 
							value-format='yyyy-MM-dd' 
							style='width:100%'
							placeholder='合同签订日期'>
						</el-date-picker>
					</el-form-item>
				</el-col>		
				<el-col :span='8'>
					<el-form-item label='合同金额' prop='contract_price'>
						<el-input v-model.number='form.contract_price'>
							<span slot="prefix">￥</span>
						</el-input>
					</el-form-item>
				</el-col>			
				<el-col :span='8'>
					<el-form-item label='合同面积' prop='contract_area'>
						<el-input v-model.number='form.contract_area'>
							<span slot="suffix">㎡</span>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span='24'>
					<el-form-item label='合同内容' prop='content'>
						<el-input v-model='form.content' placeholder=''>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span='24'>
					<el-form-item label='付款方式' prop='payment'>
						<el-input v-model='form.payment' type='textarea' :rows='4'></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-form-item label='附件管理'>
				<attach-upload 
					ref='attachUpload'
					:url='attachUploadUrl'
					:params='{order_id:form.id}' 
					:hide-upload-button='!isEdit'
					@uploaded='(res)=>{$refs.attachList.insert(res)}'/>
				<attach-list hide-query v-show='isEdit' max-height='250' ref='attachList' size='mini' :params='params'>
					<el-table-column slot='column' label='操作'  width='80' align='center'>
						<template slot-scope='{row}'>
							<el-button type='text' size='mini' @click='delAttach(row)'>删除</el-button>
						</template>
					</el-table-column>
				</attach-list>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
	import customerApi from '@/api/yyzx/customer'
	import companyApi from '@/api/yyzx/company'
	import contractApi from '@/api/yyzx/contract'
	import attachList from '@/components/common/attach/list'
	import attachUpload from '@/components/common/attach/upload'

	const formInit = {
		id:null,
		contract_no:'',//合同编号
		customer_id:null,//项目id
		sign_company_id:null,
		company_id:null,
		salesman:'',
		contract_date:'',//合同日期
		contract_price:0,//合同金额		
		contract_area:0,//合同面积
		content:'',
		payment:'',
		attach_ids:'',//附件列表
	}
	export default {
		components:{
			attachList,
			attachUpload
		},
		props:{
			size:{
				default:'small'
			},
			inDialog:{
				type:Boolean,
				default:false
			}
		},
		data(){
			let validator = (rule,value,callback)=>{
				contractApi.checkNoUnique(value,this.form.id).then(res=>{
					if(res.data>0){
						callback(new Error('合同号已重复'))
					}else{
						callback()
					}
				})
			}
			return {
				loading:false,
				form:{...formInit},
				attachUploadUrl:contractApi.attachUploadUrl,
				rules:{
					contract_no:[
						{ required:true, message:'请填写合同编号' },
						{ 
							validator:validator ,trigger:'blur'
						}
					],
					customer_id:[{ required:true, message:'请选择客户' }],
					company_id:[{ required:true, message:'请选择合同业绩所属公司' }],
					sign_company_id:[{ required:true, message:'请选择合同签订公司' }],
					contract_date:[{	required:true,message:'请填写合同日期' }],
					contract_price:[{ type:'number',message:'请输入数字' }],
					contract_area:[{ type:'number',message:'请输入数字' }],
				},
				attachList:[],
				customerList:[],
				customerLoading:true,
				companyList:[],
				companyLoading:true,
				params:{
					
				}
			}
		},
		computed:{
			//表单是否是编辑状态
			isEdit(){
				return this.form.id!=null
			}
		},
		created(){
			this.getCustomerList()
			this.getCompanyList()
		},
		methods:{
			//获取客户类型列表
			getCustomerList(){
				this.customerLoading = true
				customerApi.getEnumList().then(res=>{
					this.customerList = res.data
					this.customerLoading = false
				})
			},
			//获取公司类型列表
			getCompanyList(){
				this.companyLoading = true
				companyApi.getEnumList().then(res=>{
					this.companyList = res.data
					this.companyLoading = false
				})
			},
			get(id){
				this.loading = true
				contractApi.getInfo(id).then(res=>{
					this.assign(res.data)
					this.loading = false
				})
			},
			assign(data){
				this.form = {...this.form,...data}
				this.params.attach_ids = this.form.attach_ids
				this.$refs.attachList.initData()
				this.form.contract_price = Number(this.form.contract_price)
				this.form.contract_area = Number(this.form.contract_area)
				this.clearValidate()
			},
			//保存
			save() {
				return new Promise(( resolve,reject )=>{
					this.$refs.form.validate(vaild=>{
						if(vaild){
							// this.loading = true
							if(this.isEdit){						
								contractApi.update(this.form).then(res=>{
									this.$message.success('更新成功')
									this.loading = false
									this.$emit('updated')
									this.$emit('saved')
									resolve('updated')
								})
							}else{						
								contractApi.create(this.form).then(res=>{
									this.$refs.attachUpload.params.order_id = res.data
									this.$refs.attachUpload.upload().then(res=>{
										this.$message.success('创建成功')
										this.$emit('created')
										this.$emit('saved')
										resolve('created')
									})				
								})
							}
							resolve()
						}else{
							reject()
						}
					})
				})
			},
			clearValidate(){
				this.$nextTick(()=>{
					this.$refs.form.clearValidate()
				})
			},
			resetFields(){
				this.form = {...formInit}
				this.$refs.attachUpload.clear()
				this.$refs.attachList.clear()
				this.clearValidate()
			},
			selectProject({row}){
				let data = this.$commonJs.obj.copyByKey(row,[
					'project_id','project_name','project_no',
					'contract_no','no_order_area','contract_area'])
				this.assign(data)	
				this.$refs.orderSummaryDialog.close()
			},
			
			submitUpload(){
				this.$refs.fileUpload.submit()
			},
			delAttach(row){
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        	contractApi.delAttach({order_id:this.form.id,attach_id:row.id}).then(res=>{
        		this.$refs.attachList.reload()
        		this.$message({
	            type: 'success',
	            message: '删除成功!'
	          });
        	})
          
        })
			}
		}
	}
</script>