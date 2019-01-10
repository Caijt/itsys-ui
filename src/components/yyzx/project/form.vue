<template>
	<div v-loading='loading'>
		<el-form 
			:model='form' :rules='rules' ref='form' label-width='85px' size='mini' class='c-form-mini' status-icon>
			<divider title='合同信息'></divider>
			<el-alert title='创建后，项目所属合同将无法修改！' type='warning' style='margin-bottom: 10px'></el-alert>
			<el-form-item label="合同关联" v-if='!isEdit'>
		    <el-radio-group v-model="form.is_new_contract">
		      <el-radio :label="0">已有合同</el-radio>
		      <el-tooltip placement='top' content='创建一个只有合同编号的新合同，并提醒合同专员进行其它合同字段的完善'>
		      	<el-radio :label="1">新合同</el-radio>
		      </el-tooltip>		      
		    </el-radio-group>
		  </el-form-item>
			<template v-else v-if='isEdit||form.is_new_contract==0'>
				<el-row :gutter='10' class='c-input-readonly'>
					<el-col :span='8'>
						<el-form-item label='所属合同' prop='contract_id'>
							<el-input readonly :value='form.contract_no' placeholder='选择合同'>
								<el-button slot="prepend" @click='$refs.contractInfo.open(form.contract_id)' v-if='form.contract_id'>查看</el-button>
								<el-button slot="append" @click='openContractListDialog' :disabled='isEdit'>选择</el-button>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='客户名称' prop='customer_name'>
							<el-input readonly :value='form.customer_name' placeholder='选择合同' />
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='客户类别' prop='customer_type'>
							<el-input readonly :value='form.customer_type' placeholder='选择合同' />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter='10' :span='8' class='c-input-readonly'>
					<el-col :span='8'>
						<el-form-item label='签订公司' prop='sign_company_name'>
							<el-input readonly :value='form.sign_company_name' placeholder='选择合同' />
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='业绩公司' prop='company_name'>
							<el-input readonly :value='form.company_name' placeholder='选择合同' />
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='主业务员' prop='salesman'>
							<el-input readonly :value='form.salesman' placeholder='选择合同' />
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='合同日期' prop='contract_date'>
							<el-input readonly :value='form.contract_date' placeholder='选择合同' />
						</el-form-item>
					</el-col>		
					<el-col :span='8'>
						<el-form-item label='合同金额' prop='contract_price'>
							<el-input readonly :value='form.contract_price' placeholder='选择合同' />
						</el-form-item>
					</el-col>			
					<el-col :span='8'>
						<el-form-item label='合同面积' prop='contract_area'>
							<el-input readonly :value='form.contract_area' placeholder='选择合同' />
						</el-form-item>
					</el-col>
				</el-row>
			</template>
			<el-form-item label='合同编号' prop='contract_no' v-else>
				<el-input v-model='form.contract_no' placeholder='合同编号'></el-input>
			</el-form-item>
			<divider title='项目信息'></divider>
			<el-form-item label='项目名称' prop='name'>
				<el-input v-model='form.name'></el-input>
			</el-form-item>
			<el-row :gutter='10'>
				<el-col :span='8'>
					<el-form-item label='项目地点' prop='place'>
						<el-input v-model='form.place' placeholder='项目地点'></el-input>
					</el-form-item>		
				</el-col>
				<el-col :span='8'>
					<el-form-item label='开发商' prop='dev'>
						<el-input v-model='form.dev' placeholder='开发商'></el-input>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<contract-list-dialog ref='contractListDialog' :in-dialog='inDialog'>
			<el-table-column slot='column' width='60' align='center' label='操作' fixed='right'>
				<template slot-scope='scope'>
					<el-button size='mini' type='text' @click='selectContract(scope)'>选择</el-button>
				</template>
			</el-table-column>
		</contract-list-dialog>
		<contract-info :in-dialog='inDialog' ref='contractInfo'></contract-info>
	</div>
</template>
<script>
	import projectApi from '@/api/yyzx/project'
	import contractApi from '@/api/yyzx/contract'
	import contractListDialog from '@/components/yyzx/contract/listDialog'
	import contractInfo from '@/components/yyzx/contract/info'

	const formInit = {
		id:null,
		contract_id:null,
		is_new_contract:0,
		contract_no:'',
		name:'',
		area:'',
		project_area:0,
		project_price:0,
		dev:''
	}
	export default {
		components:{
			contractListDialog,contractInfo
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
				projectApi.checkNameUnique(value,this.form.id).then(res=>{
					if(res.data>0){
						callback(new Error('项目名称已重复'))
					}else{
						callback()
					}
				})
			}
			let contractValidator = (rule,value,callback)=>{
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
				contractRel:1,
				rules:{
					name:[
						{ required:true, message:'请输入项目名称' },
						{ validator:validator, trigger:'blur' }
					],
					contract_id:[{ required:true, message:'请选择合同' }],
					contract_no:[
						{ required:true, message:'请填写合同编号' },
						{ 
							validator:contractValidator ,trigger:'blur'
						}
					],
					project_area:[{ type:'number', message:'请输入数字' }],
					project_price:[{ type:'number', message:'请输入数字' }]	
				},
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
			
		},
		methods:{
			get($id){
				this.loading = true
				projectApi.getInfo($id).then(res=>{
					this.assign(res.data)
					this.loading = false
				})
			},
			assign(data){
				this.form = {...this.form,...data}
				this.form.project_area = 	Number(this.form.project_area)
				this.form.project_price = 	Number(this.form.project_price)
				this.clearValidate()
			},
			//保存
			save() {
				return new Promise(( resolve,reject )=>{
					this.$refs.form.validate(vaild=>{
						if(vaild){
							// this.loading = true
							if(this.isEdit){						
								projectApi.update(this.form).then(res=>{
									this.$message.success('更新成功')
									this.loading = false
									this.$emit('updated')
									this.$emit('saved')
									resolve('updated')
								})
							}else{						
								projectApi.create(this.form).then(res=>{
									this.$message.success('创建成功')
									this.$emit('created')
									this.$emit('saved')
									resolve('created')																
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
				this.form = { ...formInit }
				this.clearValidate()
			},
			openContractListDialog(){
				this.$refs.contractListDialog.open()
			},
			selectContract({ row }){
				let data = this.$commonJs.obj.copyByKey(row,[
					'contract_no','customer_name','customer_type','sign_company_name','company_name','salesman','contract_date','contract_price','contract_area'])
				data.contract_id = row.id
				this.assign(data)	
				this.$refs.contractListDialog.close()
			}
		}
	}
</script>