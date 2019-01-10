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
					<el-col :span='8'>
						<el-form-item label='打样工厂' prop='factory_id'>
							<el-select 
								v-model='form.factory_id' 
								style='width: 100%'
								:loading='factoryLoading'>
								<el-option 
									v-for='item in factoryList' 
									:value='item.id'
									:label='item.name'
									:key='item.id'>
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-alert title='50系列防火窗由汕头基地打样，汕头基地色样管理人员林佳丽' type='warning'></el-alert>
				<divider title='色板样品信息'></divider>				
				<el-row :gutter='10' >
					<el-col :span='8'>
						<el-form-item label='系列' prop='series'>
							<el-input v-model='form.series'>
							</el-input>
						</el-form-item>
					</el-col>			
					<el-col :span='8'>
						<el-form-item label='材料' prop='material'>
							<el-input v-model='form.material'>
							</el-input>
						</el-form-item>
					</el-col>			
					<el-col :span='8'>
						<el-form-item label='表面处理' prop='surface'>
							<el-input v-model='form.surface'>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='型材品牌' prop='xc_brand'>
							<el-input v-model='form.xc_brand'>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='五金品牌' prop='wj_brand'>
							<el-input v-model='form.wj_brand'>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='温控' prop='temperature'>
							<el-input v-model='form.temperature'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='型材颜色' prop='xc_color'>
							<el-input v-model='form.xc_color'>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='五金颜色' prop='wj_color'>
							<el-input v-model='form.wj_color'>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='玻璃胶颜色' prop='glass_color'>
							<el-input v-model='form.glass_color' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='24'>
						<el-form-item label='其它要求' prop='other'>
							<el-input v-model='form.other'>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
			<div slot="footer" v-loading='loading'>
				<el-dropdown split-button type="primary" @click='submit(true)'>
				  提交并打样
				  <el-dropdown-menu slot="dropdown">
				    <el-dropdown-item @click.native='submit(false)'>只提交</el-dropdown-item>
				  </el-dropdown-menu>
				</el-dropdown>
		    <el-button  @click='save(0)' :loading='loading'>保存</el-button>		    
		    <el-button @click="show=false">关 闭</el-button>
	  	</div>
		</el-dialog>
		<project-dialog ref='projectDialog' :in-dialog='inDialog'>
			<el-table-column slot='column' width='60' align='center' label='操作' fixed='right'>
				<template slot-scope='{row}'>
					<el-button size='mini' type='text' @click='selectProject(row)'>选择</el-button>
				</template>
			</el-table-column>
		</project-dialog>
		<apply-dialog ref='applyDialog' @updated='applyUpdated'></apply-dialog>
	</div>
</template>
<script>
	import colorSampleApi from '@/api/xs/colorSample'
	import projectDialog from '@/components/yyzx/project/listDialog'
	import companyApi from '@/api/yyzx/company'
	import factoryApi from '@/api/yyzx/factory'
	import applyDialog from '@/components/xs/colorSample/apply/applyDialog'

	const formInit = {
		project_id:null,
		project_no:'',
		project_name:'',
		salesman:'',
		company_id:'',

		id:null,
		no:'',
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
		other:''
	}
	export default {
		components:{ 
			projectDialog,
			applyDialog
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
				data:{ },				
				form:{ ...formInit },
				rules:{
					company_id:[{ required:true, message:'请选择销售公司' }],
					factory_id:[{ required:true, message:'请选择打样工厂' }],
					project_name:[{ required:true, message:'请填写项目名称' }],
					salesman:[{ required:true, message:'请填写业务员' }],
					amount:[{ type:'number',message:'请输入数字' },]
				},
				params:{
					no:null
				},
				updated:false,
				companyList:[],
				companyLoading:false,
				factoryList:[],
				factoryLoading:false,
				isApply:false
			}
		},
		computed:{
			isEdit(){
				return this.form.id? true:false
			},
			title(){
				let title = '色板样品信息'
				if(this.isEdit){
					title += ' [ '+this.form.no+' ]'
				}
				return title
			}
		},
		mounted(){
			this.getCompanyList()
			this.getFactoryList()
		},
		methods:{
			//获取公司类型列表
			getCompanyList(){
				this.companyLoading = true
				companyApi.getEnumList({ inUser:1}).then(res=>{
					this.companyList = res.data
					this.companyLoading = false
				})
			},
			//获取公司类型列表
			getFactoryList(){
				this.factoryLoading = true
				factoryApi.getEnumList().then(res=>{
					this.factoryList = res.data
					this.factoryLoading = false
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
				colorSampleApi.getForm(id).then(res=>{
					this.assign(res.data)
					this.loading = false
				})
			},
			submit(isApply){				
				this.isApply = isApply
				this.$confirm('确定提交色样？提交后色样信息将无法修改！','提示',{
					type: 'warning'
				}).then(()=>{
					this.save(1)
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
									if(this.isApply){
										this.apply(this.form)
									}
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
									if(this.isApply){
										this.apply(this.form)
									}
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
					this.$emit('updated')
				}
				this.resetFields()
			},
			assign(data){				
				this.form = { ...this.form, ...data }
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
			openProjectDialog(){
				this.$refs.projectDialog.open()
			},
			apply(row){
				this.$refs.applyDialog.open().then(that=>{
					that.loading = true
					factoryApi.getInfo(row.factory_id).then(res=>{
						that.assign({
							sample_no:row.no,
							sample_id:row.id,
							factory_name:res.data.name,
							factory_address:res.data.address
						})
						that.loading = false
					})
				})
			},
			applyUpdated(){
				this.$emit('updated')
			}
		}
	}
</script>