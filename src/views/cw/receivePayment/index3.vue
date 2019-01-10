<template>
	<div>
		<!-- <el-alert
	    title="查询回款记录列表，在当前页面可以进行回款登记及记录的更新及删除"
	    type="warning" 
	    :closable="false"
	    style='margin-bottom: 10px'>
  	</el-alert> -->
  	<div style='margin: 10px 0px' slot='button'>  
				<select-project @create-record='createRecord' @export-excel='exportExcel'	ref='selectProject'	/>
			</div>
			<el-tabs value='1'>
				<el-tab-pane label='回款记录' name='1'>
					<receive-payment-record-list ref='receivePaymentRecordList'>
			    	<el-table-column slot='column' label='操作' fixed='right' align='center' width='100'>
							<template slot-scope='scope'>
								<el-button  size='mini' type='text' @click='editRecord(scope)'>编辑</el-button>	
								<el-button  size='mini' type='text' @click='del(scope)'>删除</el-button>	
							</template>
						</el-table-column>
			    </receive-payment-record-list>
				</el-tab-pane>
			</el-tabs>
    
    <el-dialog
    	class='c-dialog-small'
    	:title='isFormEdit?"编辑回款记录":"创建回款单记录"' 
    	:visible.sync='dialogShow' 
    	@open='openDialog'>
			<el-form 
				:model='form' 
				:rules='formRules' 
				ref='form' 
				size='small' 
				label-width='80px' 
				status-icon>
				<el-row :gutter='20'>
					<el-col :span='24'>
						<el-form-item prop='project_id' label='项目名称'>
							<project-input 
								:label.sync='form.project_name' 
								v-model='form.project_id'
								@change='i=>{form.project_no=i?i.no:"";form.contract_no=i?i.contract_no:""}'>
							</project-input>
						</el-form-item>
					</el-col>
					<el-col :span='12'>
						<el-form-item label='项目编号'>
							<el-input readonly :value='form.project_no'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='12'>
						<el-form-item label='合同编号'>
							<el-input readonly :value='form.contract_no'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='24'>
						<el-form-item label='客户名称'>
							<el-input readonly :value='form.customer_name'></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter='20'>
					<el-col :span='24'>
						<el-form-item label='收款公司' prop='company_id'>
							<el-select v-model='form.company_id' style='width:100%' :loading='companyLoading'>
								<el-option 
									v-for='item in companyList' 
									:key='item.id'
									v-show='!item.is_disabled'
									:label='item.name'
									:value='item.id'>
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span='12'>
						<el-form-item label='回款日期' prop='payment_date'>
							<el-date-picker v-model='form.payment_date' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span='12'>
						<el-form-item label='回款金额' prop='payment_price'>
							<el-input v-model.number='form.payment_price' >
								<span slot='prefix'>￥</span>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='12'>
						<el-form-item label='回款形式' prop='payment_method'>
							<el-input v-model='form.payment_method'></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<span slot="footer">
	    	<el-button 
	    		@click="save" 
	    		type="primary" 
	    		:loading='formLoading'
	    		size='small'>
	    		{{isFormEdit?"更 新":"创 建"}}
	    	</el-button>		     
		    <el-button @click="dialogShow=false" size='small'>取 消</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
import receivePaymentApi from '@/api/cw/receivePaymentRecord'
import commonJs from '@/utils/common'
import projectInput from '@/components/projectInput'
import companyApi from '@/api/yyzx/company'
import selectProject from './selectProject'
import receivePaymentRecordList from '@/components/cw/receivePaymentRecord/list'

const formInit = {
	id:null,
	project_id:null,
	project_name:'',
	contract_no:'',	
	payment_unit:'',
	payment_price:0,
	payment_method:'',
	payment_date:''
}
export default {
	components:{ 
		projectInput, 
		selectProject, 
		receivePaymentRecordList 
	},
	data(){
		return {
			loading: true,
			dialogShow:false,
			list:[],
			dataTotal:0,
			form:Object.assign({},formInit),
			formRules:{
				project_id:[{ required:true, message:'请选择项目' }],
				company_id:[{ required:true, message:'请选择收款公司' }],
				payment_price:[{	type:'number',message:'请输入数字' }],
				payment_date:[{ required:true, message:'请填写回款日期' }]
			},
			formLoading:false,
			projectList:[],
			//查询字段
			queryParams:{
				contract_no:'',//合同编号
				project_no:'',//项目编号
				project_name:'',//项目名称
				customer_name:'',
				payment_no:''
			},
			//请求参数
			requestParams:{
				pageSize:10,//分页大小
				currentPage:1,//当前页
				sortProp:'',
				sortOrder:''
			},
			companyList:[],
			companyLoading:true,
		}
	},
	computed:{
		//表单是否是编辑状态
		isFormEdit(){
			return this.form.id!=null
		}
	},
	created(){
		this.getCompanyList()
	},
	mounted(){
		this.$refs.receivePaymentRecordList.initData()
	},
	methods:{		
		getCompanyList(){
			this.companyLoading = true
			companyApi.getEnumList().then(res=>{
				this.companyList = res.data
				this.companyLoading = false
			})
		},
		exportExcel(){
			receivePaymentApi.exportExcel(this.$refs.receivePaymentRecordList.requestParams)
		},
		createRecord({row}){
			let r = null
			if(row){
				r = this.$commonJs.obj.copyByKey(row,[
					'project_no',
					'project_name',
					'project_id',
					'contract_no',
					'customer_name'
				])
			}
			this.form = {...formInit,...r}
			this.dialogShow = true
		},
		editRecord({row}){
			this.form = {...row}
			this.form.payment_price = Number(this.form.payment_price)
			this.dialogShow = true
		},
		save() {
			this.$refs.form.validate(vaild=>{
				if(vaild){
					this.formLoading=true
					if(this.isFormEdit){						
						receivePaymentApi.update(this.form).then(res=>{
							this.$message.success('记录更新成功')
							this.dialogShow = this.formLoading = false
							this.$refs.receivePaymentRecordList.reload()
						})
					}else{						
						receivePaymentApi.create(this.form).then(res=>{
							this.$message.success('记录创建成功')
							this.dialogShow = this.formLoading = false
							this.$refs.selectProject.reload()
							this.$refs.receivePaymentRecordList.reload()					
						})
					}
				}else{
					return false
				}
			})
		},
		del({ row,$index }){
			let confirmText = '确定删除？'
			this.$confirm(confirmText,'提示',{
				type: 'warning'
			}).then(()=>{
				receivePaymentApi.del(row.id).then(res=>{
					this.list.splice($index,1)
					this.$message.success('删除成功')
				})
			})
		},
		//打开窗口后清除字段验证信息
		openDialog(){
			this.$nextTick(()=>{
				this.$refs.form?this.$refs.form.clearValidate():''
			})
		}
	}
}
</script>