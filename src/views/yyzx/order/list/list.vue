<template>
	<div>
		<el-alert
	    title="查询生产下单记录列表，在当前页面可以进行回款登记及记录的更新及删除"
	    type="warning" 
	    :closable="false"
	    style='margin-bottom: 15px'>
  	</el-alert>
  	<el-row>
  		<el-col :span='8'>
  			<el-tooltip content='该按钮功能未开发' v-if='false'>
	  			<el-button type='primary' size='small'>生产下单</el-button>
	  		</el-tooltip>
  			<el-popover>
  				<el-alert
				    title="未下单的项目列表，请及时创建并提交！"
				    type="error" 
				    :closable="false"
				    style='margin-bottom: 15px'>
				  </el-alert>
  				<el-table 
  					:data='newProjectList' 
  					v-loading='newProjectLoading' 
  					ref='tableTodo' border stripe 
  					height='300' size='small' width='100%'>
		    		<el-table-column type='expand' width='20'>
		    			<template slot-scope='scope'>
								<el-form class='c-form-text' label-width='100px'>
									<el-row>
										<el-col :span='12'>
											<el-form-item label='项目创建时间'>
												<span>{{scope.row.create_time}}</span>
											</el-form-item>
										</el-col>
										<el-col :span='12'>
											<el-form-item label='客户名称'>
												<span>{{scope.row.customer}}</span>
											</el-form-item>
										</el-col>
										<el-col :span='12'>
											<el-form-item label='客户类别'>
												<span>{{scope.row.customer_type}}</span>
											</el-form-item>
										</el-col>
										<el-col :span='12'>
											<el-form-item label='分公司'>
												<span>{{scope.row.company}}</span>
											</el-form-item>
										</el-col>
									</el-row>
								</el-form>
							</template>
		    		</el-table-column>
						<el-table-column type='index' width='40'></el-table-column>
						<el-table-column prop='no' label='项目编号' width='100'>
							<template slot-scope='scope'>
								<span @click='clickProject(scope.row.id)' class='c-link'>{{ scope.row.no }}</span>					
							</template>
						</el-table-column>
						<el-table-column prop='name' label='项目名称'>
						</el-table-column>
						<el-table-column prop='contract_no' label='合同编号'></el-table-column>
						<el-table-column prop='area' label='区域'></el-table-column>
						<el-table-column prop='salesman' label='业务员'></el-table-column>
						<el-table-column prop='update_time' label='更新时间' width='140'>
							<template slot-scope='scope'>
								<span>{{$moment(scope.row.update).format('YYYY-MM-DD HH:mm')}}</span>
							</template>
						</el-table-column>
						<el-table-column label='操作' width='50'>
							<template slot-scope='scope'>
								<el-button size='mini' type='text' @click='createOrderByTodo(scope)'>下单</el-button>
							</template>
						</el-table-column>
					</el-table>
	  			<el-badge :value="newProjectList.length" slot='reference'>
	  				<el-button  size='small'>待办新项目</el-button>
	  			</el-badge>
	  		</el-popover>
  		</el-col>
  		<el-col :span='16' style='text-align: right'>
  			<el-form ref='formQuery' :model='queryParams' inline size='small'>
  				<el-form-item prop='isTodo' v-if='false'>
						<el-tooltip content='下单时长已超出预期的计划，该筛选功能未开发'>
							<el-checkbox v-model="queryParams.isThisWeekTodo" label="超期" border></el-checkbox>
						</el-tooltip>
					</el-form-item>
					<el-form-item prop='project_no'>
						<el-input v-model='queryParams.project_no' placeholder='项目编号' clearable></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type='primary' @click='query'>查询</el-button>
						<el-popover>
							<el-form ref='formQueryMore' size='small' class='c-form-condensed' :model='queryParams' label-width='90px' style='max-width:600px'>
								<el-row :gutter='10'>
									<el-col :span='12'>
										<el-form-item label='项目名称' prop='project_name'>
											<el-input v-model='queryParams.project_name' clearable></el-input>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='合同编号' prop='contract_no'>
											<el-input v-model='queryParams.contract_no' clearable></el-input>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='下单编号' prop='order_no'>
											<el-input v-model='queryParams.order_no' clearable></el-input>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='订单类别' prop='order_type'>
											<el-input v-model='queryParams.order_type' clearable></el-input>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='批次' prop='batch'>
											<el-input v-model='queryParams.batch' clearable></el-input>
										</el-form-item>
									</el-col>
									<el-col :span='12' v-if='false'>
										<el-form-item label='下单天数' prop='order_days'>
											<el-col :span="11">
												<el-form-item prop='order_days_min'>
									      	<el-input v-model='queryParams.order_days_min' clearable></el-input>
									    	</el-form-item>
									    </el-col>
									    <el-col class="line" :span="2">-</el-col>
									    <el-col :span="11">
									    	<el-form-item prop='order_days.max'>
									      	<el-input v-model='queryParams.order_days.max' clearable></el-input>
									      </el-form-item>
									    </el-col>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='生产状态' prop='product_status'>
											<el-input v-model='queryParams.product_status' clearable></el-input>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='预计交期' prop='expect_delivery'>
											<el-input v-model='queryParams.expect_delivery' clearable></el-input>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='玻璃加工' prop='glass_expect_delivery'>
											<el-input v-model='queryParams.glass_expect_delivery' clearable></el-input>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='状态' prop='is_finish'>
											<el-select  v-model='queryParams.is_finish' clearable style='width:100%'>
												<el-option label='完成' :value='1'></el-option>
												<el-option label='进行中'' :value='0'></el-option>
											</el-select>
										</el-form-item>
									</el-col>
								</el-row>								
							</el-form>
							<el-button slot='reference'>更多条件</el-button>
						</el-popover>
						<el-button @click='resetQuery'>重置</el-button>
						<el-button @click='exportExcel' v-if='false'>导出</el-button>
					</el-form-item>
		</el-form>
  		</el-col>
  	</el-row>
		<el-table 
  		:data='list' 
  		ref='tableList'
  		v-loading='loading'
  		border stripe
  		max-height='500'
  	>
			<el-table-column prop='order_no' fixed label='下单编号' width='130'></el-table-column>
			<el-table-column prop='project_no' label='项目编号' width='100'>
				<template slot-scope='scope'>
					<span @click='clickProject(scope.row.project_id)' class='c-link'>{{ scope.row.project_no }}</span>					
				</template>
			</el-table-column>
			<el-table-column prop='project_name' label='项目名称' show-overflow-tooltip></el-table-column>
			<el-table-column prop='order_type' label='订单类别' show-overflow-tooltip></el-table-column>
			<el-table-column prop='batch' label='订单批次' show-overflow-tooltip></el-table-column>
			<el-table-column prop='oroder_area' label='下单面积' align='right' width='90'>
				<template slot-scope='scope'>
					<span>{{ scope.row.order_area }}㎡</span>
				</template>
			</el-table-column>
			<el-table-column prop='order_amount' label='下单数量' align='right' width='80'>
			</el-table-column>
			<el-table-column prop='order_date' label='下单日期' align='center' width='110'></el-table-column>
			<el-table-column prop='product_status' label='生产状态' show-overflow-tooltip></el-table-column>
			<el-table-column prop='expect_delivery' label='预计交期' show-overflow-tooltip></el-table-column>
			<el-table-column prop='glass_expect_delivery' label='玻璃加工预计交期' show-overflow-tooltip></el-table-column>
			<el-table-column label='完成日期' width='100' align='center'>
				<template slot-scope='scope'>
					<el-tooltip v-if='scope.row.is_finish' :content='"下单时长："+getOrderDays(scope)+"天"'>
						<el-tag type='success' size='mini'>{{ scope.row.finish_date }}</el-tag>
					</el-tooltip>
					<el-tag size='mini' v-else>已下单 {{ getOrderDays(scope) }} 天</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop='update_user_name' label='更新人员'></el-table-column>
			<el-table-column prop='update_time' label='更新时间' align='center' width='140'>
				<template slot-scope='scope'>
					<span>{{scope.row.update_time | formatDate}}</span>
				</template>
			</el-table-column>
			<el-table-column label='操作' fixed='right' align='center' width='130'>
				<template slot-scope='scope'>
					<el-tooltip content='在该项目下单' placement='left'>
						<el-button  size='mini' type='text' @click='createOrder(scope)'>下单</el-button>			 
					</el-tooltip>
					<el-button  size='mini' type='text' @click='editOrder(scope)'>编辑</el-button>	
					<el-button  size='mini' type='text' @click='del(scope)'>删除</el-button>						
				</template>
			</el-table-column>
		</el-table>
		<el-pagination style='margin-top: 10px'
      :page-sizes = "[10, 20, 50, 100]"
      :page-size= "requestParams.pageSize"
      :current-page.sync = "requestParams.currentPage"
      layout="total, sizes, prev, pager, next, jumper"
      :total="dataTotal"
      @size-change='sizeChange'
      @current-change='getData'
      >
    </el-pagination>
    <el-dialog  class='c-full-fixed' :title='isFormEdit?"编辑生产下单记录":"创建生产下单记录"' :visible.sync='dialogShow' fullscreen @open='openDialog'>
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
	data(){
		return {
			loading: true,
			dialogShow:false,
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