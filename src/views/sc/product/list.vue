<template>
	<div>
		<el-alert
	    title="查询生产日志记录列表，在当前页面可以创建生产日志及日志的更新、删除"
	    type="warning" 
	    :closable="false"
	    style='margin-bottom: 15px'>
  	</el-alert>
  	<el-row>
  		<el-col :span='8'>
  			<el-tooltip content='该按钮功能未开发' v-if='false'>
	  			<el-button type='primary' size='small'>创建生产日志</el-button>
	  		</el-tooltip>
  			<el-popover>
  				<el-alert
				    title="未创建生产日志的项目列表，请及时创建并提交！"
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
								<el-button size='mini' type='text' @click='createOrderByTodo(scope)'>生产</el-button>
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
						<el-tooltip content='生产时长已超出预期的计划，该筛选功能未开发'>
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
										<el-form-item label='生产状态' prop='product_status'>
											<el-input v-model='queryParams.product_status' clearable></el-input>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='系列' prop='series'>
											<el-input v-model='queryParams.series' clearable></el-input>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='窗型' prop='model'>
											<el-input v-model='queryParams.model' clearable></el-input>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='闭窗器' prop='window_style'>
											<el-input v-model='queryParams.window_style' clearable></el-input>
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
						<el-button @click='exportExcel'>导出</el-button>
					</el-form-item>
		</el-form>
  		</el-col>
  	</el-row>
		<el-table 
  		:data='list' 
  		ref='tableList'
  		v-loading='loading' border stripe
  		max-height='400'>
			<el-table-column prop='order_no' fixed label='下单编号' width='100'></el-table-column>
			<el-table-column prop='project_no' label='项目编号' width='100'>
				<template slot-scope='scope'>
					<span @click='clickProject(scope.row.project_id)' class='c-link'>{{ scope.row.project_no }}</span>					
				</template>
			</el-table-column>
			
			<el-table-column prop='project_name' label='项目名称' show-overflow-tooltip></el-table-column>
			<el-table-column prop='product_status' label='状态' width='110'></el-table-column>
			<el-table-column label='生产进度' width='120' align='center'>
				<template slot-scope='scope'>
					<el-progress text-inside :stroke-width='18' :status='scope.row.is_finish?"success":""' :percentage="getProgress(scope)"></el-progress>
				</template>
			</el-table-column>
			<el-table-column prop='product_date' label='生产日期' width='100' align='center'></el-table-column>
			<el-table-column label='完成日期' width='100' align='center'>
				<template slot-scope='scope'>
					<el-tooltip v-if='scope.row.is_finish' :content='"生产时长："+getOrderDays(scope)+"天"'>
						<el-tag type='success' size='mini'>{{ scope.row.finish_date }}</el-tag>
					</el-tooltip>
					<el-tag size='mini' v-else>已生产 {{ getOrderDays(scope) }} 天</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop='order_amount' label='订单数量' align='right' width='110'></el-table-column>
			<el-table-column prop='order_area' label='订单面积' align='right' width='110'>
				<template slot-scope='scope'>
					<span>{{ scope.row.order_area }}㎡</span>
				</template>
			</el-table-column>
			<el-table-column prop='unfinish_area' label='未完成面积' align='right' width='110'>
				<template slot-scope='scope'>
					<span>{{ scope.row.unfinish_area }}㎡</span>
				</template>
			</el-table-column>

			<el-table-column prop='series' label='系列' width='110'></el-table-column>
			<el-table-column prop='model' label='窗型' width='110'></el-table-column>
			<el-table-column prop='window_style' label='闭窗器样式' width='110'></el-table-column>
			
			<el-table-column prop='update_time' label='更新时间' align='center' width='140'>
				<template slot-scope='scope'>
					<span>{{scope.row.update_time | formatDate}}</span>
				</template>
			</el-table-column>
			<el-table-column label='操作' fixed='right' align='center' width='130'>
				<template slot-scope='scope'>
					<el-tooltip content='在该项目创建新生产日志' placement='left'>
						<el-button  size='mini' type='text' @click='createOrder(scope)'>生产</el-button>			 
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
    <el-dialog  :title='isFormEdit?"编辑生产日志":"创建生产日志"' top='5vh' width='60%' :visible.sync='dialogShow' @open='openDialog'>
			<el-form :model='form' :rules='formRules' ref='form' label-width='105px' status-icon>
				<el-row :gutter='20'>
					<el-col :span='24'>
						<el-form-item label='项目名称'>
							<el-input readonly :value='form.project_name'></el-input>
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
					<el-col :span='12'>
						<el-form-item label='下单编号' prop='order_no'>
							<el-input v-model='form.order_no' ></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='12'>
						<el-form-item label='订单数量' prop='order_amount'>
							<el-input v-model.number='form.order_amount'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='12'>
						<el-form-item label='订单面积' prop='order_area'>
							<el-input v-model.number='form.order_area'>
								<span slot="suffix">㎡</span>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='12'>
						<el-form-item label='未完成面积' prop='unfinish_area'>
							<el-input v-model.number='form.unfinish_area'>
								<span slot="suffix">㎡</span>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='12'>
						<el-form-item label='系列'  prop='series'>
							<el-input v-model='form.series'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='12'>
						<el-form-item label='窗型'  prop='model'>
							<el-input v-model='form.model'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='12'>
						<el-form-item label='闭窗器样式'  prop='window_style'>
							<el-input v-model='form.window_style'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='12'>
						<el-form-item label='生产日期' prop='product_date'>
							<el-date-picker v-model='form.product_date' value-format='yyyy-MM-dd' style='width:100%'></el-date-picker>
						</el-form-item>
					</el-col>	
					<el-col :span='24'>
						<el-form-item label='生产状态'  prop='product_status'>
							<el-input v-model='form.product_status'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='12'>
						<el-form-item label='计划状态' prop='is_finish'>
							<el-radio-group v-model="form.is_finish">
						    <el-radio :label='0'>进行中</el-radio>
						    <el-radio :label="1">完成</el-radio>
						  </el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span='12' v-if='form.is_finish'>
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
import productApi from '@/api/sc/product'
import commonJs from '@/utils/common'

const formInit = {
	id:null,
	project_id:null,
	project_name:'',
	project_no:'',
	contract_no:'',	
	order_no:'',
	order_amount:0,
	order_area:0,
	unfinish_area:0,
	series:'',
	product_status:'',
	product_date:'',
	model:'',
	window_style:'',
	finish_date:'',
	is_finish:0
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
				finish_date:[{	required:true,message:'请填写完成日期' }],
				order_amount:[{	type:'number',message:'请输入数字' }],
				order_area:[{	type:'number',message:'请输入数字' }],
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
		sizeChange(value){
			this.requestParams.pageSize=value
			this.getData()
		},
		getData() {
			this.loading=true
			productApi.getList(this.requestParams).then(res=>{
				this.list = res.data.list
				this.dataTotal = res.data.total
				this.loading = false
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
			let r = null
			if(row){
				r = {
					project_no: row.project_no,
					project_name: row.project_name,
					project_id: row.project_id,
					contract_no: row.contract_no
				}
			}
			this.form = Object.assign({},formInit,r)
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
			let r = {
				project_no: row.project_no,
				project_name: row.project_name,
				project_id: row.project_id,
				contract_no: row.contract_no,

				id:row.id,
				order_no: row.order_no,
				order_amount:row.order_amount,
				order_area:row.order_area,
				unfinish_area:row.unfinish_area,
				series:row.series,
				product_status:row.product_status,
				product_date:row.product_date,
				model:row.model,
				window_style:row.window_style,
				finish_date:row.finish_date,
				is_finish:row.is_finish
			}
			this.form = Object.assign({},formInit,r)
			this.dialogShow = true
			this.form.expect_price = Number(this.form.expect_price)
		},
		save({isSubmit}) {
			this.$refs.form.validate(vaild=>{
				if(vaild){
					this.formLoading=true
					this.form.is_submit = isSubmit?1:0
					if(this.isFormEdit){						
						productApi.update(this.form).then(res=>{
							this.$message.success('记录更新成功')
							this.dialogShow = this.formLoading = false
							this.getData()
						})
					}else{						
						productApi.create(this.form).then(res=>{
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
				productApi.del(row.id).then(res=>{
					this.list.splice($index,1)
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
			return finishDate.diff(this.$moment(row.product_date),'days') + 1
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
			productApi.getTodoProjectList().then(res=>{
				this.newProjectList=res.data
				this.newProjectLoading = false
			})
		},
		getProgress({row}){
			if(row.unfinish_area > row.order_area) return 0
			return commonJs.round((row.order_area-row.unfinish_area) / row.order_area) 
		}
	},
	filters:{
		point2(v){
			return (v||0).toFixed(2)
		}
	}
}
</script>