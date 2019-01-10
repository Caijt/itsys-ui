<template>
	<div>
    <el-tabs type="border-card" value='first'>
	    <el-tab-pane label="项目列表" name="first">
	    	<el-alert
			    title="当前有20个项目需要下单，请及时进行处理！"
			    type="error" 
			    :closable="false"
			    style='margin-bottom: 15px'>
		  	</el-alert>
				<order-summary ref='orderSummary' size='mini' max-height='200'>
					<el-table-column slot='column' fixed='right' label='操作'>
						<template slot-scope='{row}'>
							<el-button type='text' size='mini'>订单列表</el-button>
						</template>
					</el-table-column>
				</order-summary>
	    </el-tab-pane>
	  </el-tabs>
	  <el-tabs type="border-card" value='first'>
	    <el-tab-pane label="生产下单" name="first">
		    <order-list ref='orderList'>
		    	<el-table-column label='操作' slot='column' fixed='right' align='center' width='130'>
						<template slot-scope='scope'>
							<el-button  size='mini' type='text' @click='editOrder(scope)'>编辑</el-button>	
							<el-button  size='mini' type='text' @click='del(scope)'>删除</el-button>						
						</template>
					</el-table-column>
		    </order-list>
		  </el-tab-pane>
		</el-tabs>		
    <el-dialog 
    	class='c-full-fixed' :title='isFormEdit?"编辑生产下单记录":"创建生产下单记录"' :visible.sync='dialogShow' fullscreen @open='openDialog'>
			<el-form 
				:model='form' :rules='formRules' ref='form' label-width='100px' 
				 status-icon>
				<el-row :gutter='20'>
					<el-col :span='8'>
						<el-form-item label='项目名称'>
							<el-input readonly :value='form.project_name'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='项目编号'>
							<el-input readonly :value='form.project_no'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='合同编号'>
							<el-input readonly :value='form.contract_no'></el-input>
						</el-form-item>
					</el-col>	
					<el-col :span='8'>
						<el-form-item label='下单编号' prop='order_no'>
							<el-input v-model='form.order_no' ></el-input>
						</el-form-item>
					</el-col>	
					<el-col :span='8'>
						<el-form-item label='订单类别' prop='type_id'>
							<el-select v-model='form.type_id' style='width: 100%'>
								<el-option 
									v-for='item in orderTypeList' 
									:value='item.id'
									:label='item.name'
									:key='item.id'>
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>	
					<el-col :span='8'>
						<el-form-item label='订单批次' prop='batch'>
							<el-input v-model='form.batch' ></el-input>
						</el-form-item>
					</el-col>	
					<el-col :span='8'>
						<el-form-item label='下单日期' prop='order_date'>
							<el-date-picker v-model='form.order_date' value-format='yyyy-MM-dd' style='width:100%'></el-date-picker>
						</el-form-item>
					</el-col>	
					<el-col :span='8'>
						<el-form-item label='下单面积' prop='order_area'>
							<el-input v-model.number='form.order_area'>
								<span slot="suffix">㎡（平方米）</span>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='下单数量'  prop='order_amount'>
							<el-input v-model.number='form.order_amount'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='16'>
						<el-form-item label='生产状态'  prop='product_status'>
							<el-input v-model='form.product_status'></el-input>
						</el-form-item>
					</el-col>	
					<el-col :span='24'>
						<el-form-item label='预计交期时间'  prop='expect_delivery'>
							<el-input v-model='form.expect_delivery' type='textarea' :rows='4'>></el-input>
						</el-form-item>
					</el-col>	
					<el-col :span='24'>
						<el-form-item label='玻璃加工状态预计交期' prop='glass_expect_delivery'>
							<el-input v-model='form.glass_expect_delivery' type='textarea' :rows='4'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='下单状态' prop='is_finish'>
							<el-radio-group v-model="form.is_finish">
						    <el-radio :label='0'>进行中</el-radio>
						    <el-radio :label="1">完成</el-radio>
						  </el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span='8' v-if='form.is_finish'>
						<el-form-item label='完成日期' prop='finish_date'>
							<el-date-picker v-model='form.finish_date' v-if='form.is_finish' value-format='yyyy-MM-dd' style='width:100%'></el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<span slot="footer">
		    <el-tooltip content='将生产计划情况提交到项目中更新项目信息'><el-button @click="save({isSubmit:true})" type="primary" :loading='formLoading'>{{isFormEdit?"更新并提交":"创建并提交"}}</el-button></el-tooltip>
		    <el-button @click="dialogShow=false">取 消</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
import productplanApi from '@/api/yyzx/order'
import commonJs from '@/utils/common'
import orderTypeApi from '@/api/yyzx/orderType'
import orderSummary from '@/components/yyzx/order/summary/list'
import orderList from '@/components/yyzx/order/list'

const formInit = {
	id:null,
	project_id:null,
	project_name:'',
	contract_no:'',	
	order_no:'',
	order_area:0,
	type_id:null,
	batch:'',
	order_date:'',
	order_amount:0,
	is_finish:0,
	product_status:'',
	expect_delivery:'',
	glass_expect_delivery:'',
	finish_date:''
}
export default {
	components:{ orderSummary,orderList },
	data(){
		return {
			loading: true,
			dialogShow:false,
			activeNames:['1','2'],
			list:[],
			dataTotal:0,
			newProjectList:[],
			form:Object.assign({},formInit),
			formRules:{
				order_no:[{ required:true, message:'请填写下单编号' }],
				type_id:[{ required:true, message:'请选择订单类型' }],
				order_date:[{	required:true,message:'请填写下单日期' }],
				finish_date:[{	required:true,message:'请填写完成日期' }],
				order_amount:[
				{
					type:'number',message:'请输入数字'
				}],
				order_area:[
				{
					type:'number',message:'请输入数字'
				},
				{ 
					validator(rule,value,callback){
						if(value>0){
							callback()
						}else{
							callback(new Error('下单面积必须大于0'))
						}
					},
				
				}],
			},
			formLoading:false,
			projectList:[],
			//查询字段
			queryParams:{
				contract_no:'',//合同编号
				project_no:'',//项目编号
				project_name:'',//项目名称
				order_no:'',//下单编号
				is_finish:''
			},
			//请求参数
			requestParams:{
				pageSize:10,//分页大小
				currentPage:1//当前页
			},
			orderTypeList:[]
		}
	},
	computed:{
		//表单是否是编辑状态
		isFormEdit(){
			return this.form.id!=null
		}
	},
	created(){
		this.getData()
		this.getTodoProject()
		this.getOrderTypeList()
	},
	mounted(){
		this.$refs.orderSummary.initData()
		this.$refs.orderList.initData()
	},
	methods:{		
		sizeChange(value){
			this.requestParams.pageSize=value
			this.getData()
		},
		getData() {
			this.loading=true
			productplanApi.getList(this.requestParams).then(res=>{
				this.list = res.data.list
				this.dataTotal = res.data.total
				this.loading = false
			})
		},
		getOrderTypeList(){
			orderTypeApi.getEnumList().then(res=>{
				this.orderTypeList = res.data
			})
		},
		//查询方法
		query(){
			Object.assign(this.requestParams,this.queryParams)
			this.getData()
		},
		resetQuery(){
			this.$refs.formQuery.resetFields()
			this.$refs.formQueryMore.resetFields()
			this.query()
		},
		exportExcel(){
			this.$message('功能未开发')
		},
		convertTextarea(text){
			return commonJs.convertTextarea(text)
		},
		createOrder({row}){
			let r = this.$commonjs.obj.copyByKey(row,[
				'project_no',
				'project_name',
				'project_id',
				'contract_no'
			])
			this.form = {...formInit,...r}
			this.dialogShow = true
		},
		createOrderByTodo({row}){
			let r = {
				project_no:row.no,
				project_name:row.name,
				project_id:row.id,
				contract_no:row.contract_no			
			}
			this.form = Object.assign({},formInit,r)
			this.dialogShow = true			
		},
		editOrder({row}){
			this.form = {...row}
			this.form.order_area = Number(this.form.order_area)
			this.dialogShow = true
		},
		save({isSubmit}) {
			this.$refs.form.validate(vaild=>{
				if(vaild){
					this.formLoading=true
					this.form.is_submit = isSubmit?1:0
					if(this.isFormEdit){						
						productplanApi.update(this.form).then(res=>{
							this.$message.success('记录更新成功')
							this.dialogShow = this.formLoading = false
							this.getData()
						})
					}else{						
						productplanApi.create(this.form).then(res=>{
							this.$message.success('记录创建成功')
							this.dialogShow = this.formLoading = false
							this.getTodoProject()
							this.getData()							
						})
					}
				}else{
					return false
				}
			})
		},
		del({ row,$index }){
			let confirmText = '确定删除？'
			// if(row.planList.length == 1){
			// 	confirmText = '当前项目只有该下单记录，删除后项目将移至待办新项目中，确定删除吗？'
			// }
			this.$confirm(confirmText,'提示',{
				type: 'warning'
			}).then(()=>{
				productplanApi.del(row.id).then(res=>{
					this.list.splice($index,1)
					this.dataTotal--
					this.getTodoProject()
					this.$message.success('删除成功')
				})
			})
		},
		getOrderDays({row}){
			let finishDate 
			if(row.is_finish){
				finishDate = this.$moment(row.finish_date)
			}else{
				finishDate = this.$moment()
			}
			return finishDate.diff(this.$moment(row.order_date),'days') + 1
		},
		//打开窗口后清除字段验证信息
		openDialog(){
			this.$nextTick(()=>{
				this.$refs.form?this.$refs.form.clearValidate():''
			})
		},
		clickProject(projectId){
			this.$emit('click-project',projectId)
		},
		getTodoProject(){
			this.newProjectLoading = true
			productplanApi.getTodoProjectList().then(res=>{
				this.newProjectList=res.data
				this.newProjectLoading = false
			})
		},
	},
	filters:{
		point2(v){
			return (v||0).toFixed(2)
		}
	}
}
</script>