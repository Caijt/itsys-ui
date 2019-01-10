<template>
	<div>
		<el-alert
    title="根据已立项项目及时更新、创建采购计划，采购只要记录主要材料采购情况（型材和定制五金），通用材料不必记录"
    type="success" :closable="false" style='margin-bottom: 15px'>
  	</el-alert>
		<el-tabs type="card" v-model='tabIndex'  @tab-click='tabClick'>
	    <el-tab-pane label="采购计划列表" name="list">
	    	<el-alert
			    title="显示每个项目采购计划汇总情况，点击项目左侧展开按钮或计划明细按钮可以查看采购计划明细"
			    type="warning" 
			    :closable="false"
			    style='margin-bottom: 15px'>
		  	</el-alert>
	    	<el-form ref='formQuery' :model='queryParams' inline size='small'>
	    		<el-form-item prop='isTodo'>
    				<el-tooltip content='运营中心通知尽快更新采购计划的项目，该筛选功能未开发'>
    					<el-checkbox v-model="queryParams.isThisWeekTodo" label="催办项目" border></el-checkbox>
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
										<el-form-item label='下单编号' prop='order_no' >
											<el-input v-model='queryParams.order_no' clearable></el-input>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
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
										<el-form-item label='采购状态' prop='purchase_status'>
											<el-input v-model='queryParams.purchase_status' clearable></el-input>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='需求计划' prop='demand_plan'>
											<el-input v-model='queryParams.demand_plan' clearable></el-input>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='计划状态' prop='is_finish'>
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
	    			<el-button @click='exportExcel'>导出</el-button>
	    		</el-form-item>
	    	</el-form>
	    	<el-table 
	    		class='_productplan-table' 
	    		:data='list' 
	    		ref='tableList'
	    		v-loading='loading' border stripe
	    		@expand-change='tableExpand'>
	    		<el-table-column type='expand' width='30'>
    				<template slot-scope='scope'>
							<el-form class='c-form-text' label-width='100px'>
								<el-row>
									<el-col :span='8'>
										<el-form-item label='项目创建时间'>
											<span>{{$moment(scope.row.create_time).format('YYYY-MM-DD HH:mm')}}</span>
										</el-form-item>
									</el-col>
									<el-col :span='8'>
										<el-form-item label='合同编号'>
											<span>{{scope.row.contract_no}}</span>
										</el-form-item>
									</el-col>
									<el-col :span='16'>
										<el-form-item label='客户名称'>
											<span>{{scope.row.customer}}</span>
										</el-form-item>
									</el-col>
									<el-col :span='8'>
										<el-form-item label='客户类别'>
											<span>{{scope.row.customer_type}}</span>
										</el-form-item>
									</el-col>
									<el-col :span='8'>
										<el-form-item label='分公司'>
											<span>{{scope.row.company}}</span>
										</el-form-item>
									</el-col>
									<el-col :span='8'>
										<el-form-item label='区域'>
											<span>{{scope.row.area}}</span>
										</el-form-item>
									</el-col>
									<el-col :span='8'>
										<el-form-item label='业务员'>
											<span>{{scope.row.salesman}}</span>
										</el-form-item>
									</el-col>
								</el-row>
							</el-form>
							<el-table :data='scope.row.planList' v-loading='!scope.row.planList' border stripe >
								<el-table-column type='expand' width='25'>
									<template slot-scope='scope'>
										<el-form class='c-form-text' label-width='160px'>
											<el-row>
												<el-col :span='24'>
													<el-form-item label='资金需求计划'>
														<span v-html='convertTextarea(scope.row.demand_plan)'></span>
													</el-form-item>
												</el-col>
											</el-row>
										</el-form>
									</template>
								</el-table-column>
								<el-table-column type='index' width='40'></el-table-column>
								<el-table-column prop='order_no' label='下单编号'  width='100'></el-table-column>
								<el-table-column prop='order_date' label='下单日期' width='100'></el-table-column>
								<el-table-column prop='expect_price' label='预计采购金额' align='right' width='110'>
									<template slot-scope='scope'>
										<span>￥ {{ scope.row.expect_price || 0 }}</span>
									</template>
								</el-table-column>
								<el-table-column prop='purchase_status' label='采购状态' ></el-table-column>
								<el-table-column prop='expect_delivery_date' label='预计交期' width='100'></el-table-column>
								<el-table-column prop='demand_plan' label='资金需求计划' show-overflow-tooltip></el-table-column>
								<el-table-column prop='is_finish' label='计划状态' width='80' align='center'>
									<template slot-scope='scope'>
										<el-tooltip :content='"完成日期："+scope.row.finish_date' v-if='scope.row.is_finish'>
											<el-tag size='small' type='success' >完成</el-tag>		
										</el-tooltip>								 			
										<el-tag size='small' v-else>进行中</el-tag>										 				
									</template>
								</el-table-column>
								<el-table-column prop='update_time' label='更新时间' width='140'>
									<template slot-scope='scope'>
										<span>{{ scope.row.update_time | formatDate }}</span>
									</template>
								</el-table-column>
								<el-table-column label='操作' align='center' width='90'>
									<template slot-scope='planScope'>
										<el-button size='mini' type='text' @click='editPlan(scope,planScope)' v-if='!scope.row.is_submit'>编辑</el-button>
										<el-button size='mini' type='text' @click='del(scope,planScope)'>删除</el-button>
									</template>
								</el-table-column>
							</el-table>
						</template>
	    		</el-table-column>
					<el-table-column prop='project_no' label='项目编号' width='100'></el-table-column>
					<el-table-column prop='project_name' label='项目名称' show-overflow-tooltip></el-table-column>
					<el-table-column prop='admin' label='计划数量' width='80' align='center'>
						<template slot-scope='scope'>
							<span>{{ scope.row.total }}</span>
						</template>
					</el-table-column>
					<el-table-column prop='expect_price' label='预计采购总金额' align='right' width='120'>
						<template slot-scope='scope'>
							<span>￥ {{ scope.row.expect_price || 0 }}</span>
						</template>
					</el-table-column>
					<el-table-column prop='first_order_date' label='首次下单日期' width='110'></el-table-column>
					<el-table-column  label='下单天数' width='100' align='center'>
						<template slot-scope='scope'>
							<el-tooltip content='首次下单日期到采购计划完成的天数'>
								<el-tag size='small' v-if='scope.row.is_finish' type='success'>{{ getOrderDays(scope) }}天</el-tag>
								<el-tag size='mini'>已进行{{ getOrderDays(scope) }}天</el-tag>
							</el-tooltip>							
						</template>
					</el-table-column>
					<el-table-column  label='采购计划' width='80' align='center'>
						<template slot-scope='scope'>
							<el-tooltip :content='"完成日期："+scope.row.finish_date' v-if='scope.row.is_finish'>
								<el-tag size='small' type='success' >完成</el-tag>		
							</el-tooltip>								 			
							<el-tag size='small' v-else>进行中</el-tag>										 				
						</template>
					</el-table-column>
					<el-table-column prop='update_time' label='最近更新时间' width='140'>
						<template slot-scope='scope'>
							<span>{{scope.row.update_time | formatDate}}</span>
						</template>
					</el-table-column>
					<el-table-column label='操作' align='center' width='140'>
						<template slot-scope='scope'>
							<el-tooltip content='创建新计划' placement='left'>
								<el-button  size='mini' type='text' @click='createPlan(scope)'>创建计划</el-button>
							</el-tooltip>		
							<el-button  size='mini' type='text' @click='expandPlanList(scope)'>计划明细</el-button>						
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
	    </el-tab-pane>
	    <el-tab-pane name="todo">
	    	<el-badge class='_contract-badge' :value='newProjectLoading?"..":newProjectList.length' slot="label" >待办新项目</el-badge>
	    	<el-alert
		    title="未创建过采购计划的项目列表，请及时创建并提交！"
		    type="warning" 
		    :closable="false"
		    style='margin-bottom: 15px'>
		  	</el-alert>
	    	<el-table :data='newProjectList' v-loading='newProjectLoading' ref='tableTodo' border stripe>
	    		<el-table-column type='expand' class='asdfasdf'>
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
					<el-table-column type='index'></el-table-column>
					<el-table-column prop='no' label='项目编号'></el-table-column>
					<el-table-column prop='name' label='项目名称'></el-table-column>
					<el-table-column prop='contract_no' label='合同编号'></el-table-column>
					<el-table-column prop='area' label='区域'></el-table-column>
					<el-table-column prop='salesman' label='业务员'></el-table-column>
					<el-table-column prop='update_time' label='更新时间' width='140'>
						<template slot-scope='scope'>
							<span>{{$moment(scope.row.update).format('YYYY-MM-DD HH:mm')}}</span>
						</template>
					</el-table-column>
					<el-table-column label='操作' width='80'>
						<template slot-scope='scope'>
							<el-button size='mini' type='text' @click='createPlanByTodo(scope)'>创建计划</el-button>
						</template>
					</el-table-column>
				</el-table>
	    </el-tab-pane>
	  </el-tabs>	
		<el-dialog  class='c-full-fixed' :title='isFormEdit?"编辑计划":"创建计划"' :visible.sync='dialogShow' fullscreen @open='openDialog'>
			<el-form :model='form' :rules='formRules' ref='form' label-width='110px' status-icon>
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
						<el-form-item label='材料下单日期' prop='order_date'>
							<el-date-picker v-model='form.order_date' value-format='yyyy-MM-dd' style='width:100%'></el-date-picker>
						</el-form-item>
					</el-col>	
					<el-col :span='8'>
						<el-form-item label='预计采购金额' prop='expect_price'>
							<el-input v-model.number='form.expect_price'>
								<span slot="prefix">￥</span>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='16'>
						<el-form-item label='采购状态'  prop='purchase_status'>
							<el-input v-model='form.purchase_status'></el-input>
						</el-form-item>
					</el-col>	
					<el-col :span='8'>
						<el-form-item label='预计交期' prop='expect_delivery_date'>
							<el-date-picker v-model='form.expect_delivery_date' value-format='yyyy-MM-dd' style='width:100%'></el-date-picker>
						</el-form-item>
					</el-col>	
					<el-col :span='24'>
						<el-form-item label='资金需求计划' prop='demand_plan'>
							<el-input v-model='form.demand_plan' type='textarea' :rows='4'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='计划状态' prop='is_finish'>
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
		    <el-tooltip content='将采购计划情况提交到项目中更新项目信息'><el-button @click="save({isSubmit:true})" type="primary" :loading='formLoading'>{{isFormEdit?"更新并提交":"创建并提交"}}</el-button></el-tooltip>
		    <el-button @click="dialogShow=false">取 消</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
import purchaseApi from '@/api/cg/purchase'
import commonJs from '@/utils/common'

const formInit = {
	id:null,
	project_id:null,
	project_name:'',
	contract_no:'',	
	order_no:'',
	order_date:'',
	expect_price:0,
	purchase_status:'',
	expect_delivery_date:'',
	demand_plan:'',
	is_finish:0,	
	finish_date:'',
}
export default {
	data(){
		return {
			tabIndex:'list',
			loading: true,
			newProjectLoading: true,
			dialogShow:false,
			list:[],
			dataTotal:0,
			newProjectList:[],
			form:Object.assign({},formInit),
			formRules:{
				order_no:[{ required:true, message:'请填写下单编号' }],
				order_date:[{	required:true,message:'请填写材料下单日期' }],
				finish_date:[{	required:true,message:'请填写完成日期' }],
				expect_price:[ { type:'number',message:'请输入数字' }],
			},
			formLoading:false,
			projectList:[],
			//查询字段
			queryParams:{
				contract_no:'',//合同编号
				project_no:'',//项目编号
				project_name:'',//项目名称
				order_no:'',//下单编号
				//下单天数
				order_days:{
					min:'',
					max:''
				},
				isTodo:false
			},
			//请求参数
			requestParams:{
				pageSize:10,//分页大小
				currentPage:1//当前页
			}
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
	},
	methods:{
		tabClick({name}){
			let ref=(name=='list'?'tableList':'tableTodo')
			setTimeout(()=>{
				this.$refs[ref].doLayout()
			},100)
		},
		expandPlanList({row}){
			this.$refs.tableList.toggleRowExpansion(row)
		},
		sizeChange(value){
			this.requestParams.pageSize=value
			this.getData()
		},
		getData() {
			this.loading=true
			purchaseApi.getList(this.requestParams).then(res=>{
				this.list = res.data.list
				this.dataTotal = res.data.total
				this.loading = false
			})
		},
		getTodoProject(){
			this.newProjectLoading = true
			purchaseApi.getTodoProjectList().then(res=>{
				this.newProjectList=res.data
				this.newProjectLoading = false
			})
		},
		save({isSubmit}) {
			this.$refs.form.validate(vaild=>{
				if(vaild){
					this.formLoading=true
					this.form.is_submit = isSubmit?1:0
					if(this.isFormEdit){						
						purchaseApi.update(this.form).then(res=>{
							this.$message.success('计划更新成功')
							this.dialogShow = this.formLoading = false
							this.getData()
						})
					}else{						
						purchaseApi.create(this.form).then(res=>{
							this.$message.success('计划创建成功')
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
		del({row},{row:subRow,$index}){
			console.log(subRow.id)
			let confirmText = '确定删除？'
			if(row.planList.length == 1){
				confirmText = '当前项目只有该采购计划，删除后项目将移至待办新项目中，确定删除吗？'
			}
			this.$confirm(confirmText,'提示',{
				type: 'warning'
			}).then(()=>{
				purchaseApi.del(subRow.id).then(res=>{
					row.planList.splice($index,1)
					if(row.planList.length == 0){
						this.getData()
						this.getTodoProject()
					}
					this.$message.success('删除成功')
				})
			})
		},
		createPlan({row}){
			let r = {
				project_no:row.project_no,
				project_name:row.project_name,
				project_id:row.project_id,
				contract_no:row.contract_no			
			}
			this.form = Object.assign({},formInit,r)
			this.dialogShow = true
		},
		createPlanByTodo({row}){
			let r = {
				project_no:row.no,
				project_name:row.name,
				project_id:row.id,
				contract_no:row.contract_no			
			}
			this.form = Object.assign({},formInit,r)
			this.dialogShow = true			
		},
		editPlan({row},{row:subRow}){
			let r = {
				project_no: row.project_no,
				project_name: row.project_name,
				project_id: row.project_id,
				contract_no: row.contract_no,

				id:subRow.id,
				order_no: subRow.order_no,
				order_date: subRow.order_date,
				expect_price: subRow.expect_price,
				purchase_status: subRow.purchase_status,
				expect_delivery_date: subRow.expect_delivery_date,
				demand_plan: subRow.demand_plan,
				is_finish: subRow.is_finish,
				finish_date: subRow.finish_date,
			}
			this.form = Object.assign({},formInit,r)
			this.form.expect_price = Number(this.form.expect_price)
			this.dialogShow = true
		},
		//打开窗口后清除字段验证信息
		openDialog(){
			this.$nextTick(()=>{
				this.$refs.form?this.$refs.form.clearValidate():''
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
		getOrderDays({row}){
			let finishDate 
			if(row.is_finish){
				finishDate = this.$moment(row.finish_date)
			}else{
				finishDate = this.$moment()
			}
			return finishDate.diff(this.$moment(row.first_order_date),'days') + 1
		},
		tableExpand(row,expandedRows,a){
			if(!row.planList){
				this.$set(row,'planList',null);
				purchaseApi.getListByProject(row.project_id).then(res=>{
					row.planList = res.data				
				})
			}			
		}
	},
	filters:{
		point2(v){
			return (v||0).toFixed(2)
		}
	}
}
</script>
<style>
	._contract-badge .el-badge__content.is-fixed{
		top:10px;
		right:1px;
	}
	._productplan-table .el-table__expanded-cell{
		padding:15px 30px 20px;
	}
</style>