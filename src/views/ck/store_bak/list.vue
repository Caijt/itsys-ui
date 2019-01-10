<template>
	<div>
		<el-alert
	    title="查询材料库存记录列表，在当前页面可以进行材料入库及记录的更新及删除"
	    type="warning" 
	    :closable="false"
	    style='margin-bottom: 15px'>
  	</el-alert>
  	<el-row>
  		<el-col :span='8'>
  			<el-tooltip content='该按钮功能未开发'  v-if='false'>
	  			<el-button type='primary' size='small'>材料入库</el-button>
	  		</el-tooltip>
  			<el-popover>
  				<el-alert
				    title="未创建库存记录的项目列表，请及时创建并提交！"
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
								<el-button size='mini' type='text' @click='createOrderByTodo(scope)'>入库</el-button>
							</template>
						</el-table-column>
					</el-table>
	  			<el-badge :value="newProjectList.length" slot='reference'>
	  				<el-button  size='small'>待办新项目</el-button>
	  			</el-badge>
	  		</el-popover>
  		</el-col>
  		<el-col :span='16' style='text-align: right'>
  			<el-form ref='formQuery' :model='queryParams' inline size='mini'>
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
										<el-form-item label='材料类型' prop='material_type'>
											<el-input v-model='queryParams.material_type' clearable></el-input>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='材料状态' prop='material_status'>
											<el-input v-model='queryParams.material_status' clearable></el-input>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='材料库存' prop='material_stock'>
											<el-input v-model='queryParams.material_stock' clearable></el-input>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='通用库存' prop='other_material_stock'>
											<el-input v-model='queryParams.other_material_stock' clearable></el-input>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='五金状态' prop='hardware_status'>
											<el-input v-model='queryParams.hardware_status' clearable></el-input>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='五金库存' prop='hardware_stock'>
											<el-input v-model='queryParams.hardware_stock' clearable></el-input>
										</el-form-item>
									</el-col>
								</el-row>								
							</el-form>
							<el-button slot='reference'>更多条件</el-button>
						</el-popover>
						<el-button @click='resetQuery'>重置</el-button>
					</el-form-item>
				</el-form>
  		</el-col>
  	</el-row>
		<el-table 
  		:data='list' 
  		ref='tableList'
  		v-loading='loading' border stripe
  		max-height='500'>
			<el-table-column prop='project_no' fixed label='项目编号' width='100'>
				<template slot-scope='scope'>
					<span @click='clickProject(scope.row.project_id)' class='c-link'>{{ scope.row.project_no }}</span>
				</template>
			</el-table-column>
			<el-table-column prop='project_name' label='项目名称' show-overflow-tooltip></el-table-column>
			<el-table-column prop='xc_storage_date' label='型材入库日期' align='center' width='110'></el-table-column>
			<el-table-column prop='material_type' label='材料类型' show-overflow-tooltip></el-table-column>
			<el-table-column prop='material_status' label='材料状态' show-overflow-tooltip></el-table-column>
			<el-table-column prop='material_stock' label='材料库存情况' show-overflow-tooltip></el-table-column>
			<el-table-column prop='other_material_stock' label='非通用材料情况' show-overflow-tooltip></el-table-column>
			<el-table-column prop='hardware_storage_date' label='五金入库日期' align='center' width='110'></el-table-column>
			<el-table-column prop='hardware_status' label='五金材料状态' show-overflow-tooltip></el-table-column>
			<el-table-column prop='hardware_stock' label='五金库存情况' show-overflow-tooltip></el-table-column>
			<el-table-column prop='update_time' label='更新时间' align='center' width='140'>
				<template slot-scope='scope'>
					<span>{{scope.row.update_time | formatDate}}</span>
				</template>
			</el-table-column>
			<el-table-column label='操作' fixed='right' align='center' width='130'>
				<template slot-scope='scope'>
					<el-tooltip content='在该项目创建新的库存记录' placement='left'>
						<el-button  size='mini' type='text' @click='createOrder(scope)'>入库</el-button>	
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
    <el-dialog class='c-full-fixed' fullscreen :title='isFormEdit?"编辑仓库日志":"创建仓库日志"' :visible.sync='dialogShow'>
			<el-form :model='form' :rules='formRules' ref='form' label-width='110px'>
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
						<el-form-item label='型材入库日期' prop='xc_storage_date'>
							<el-date-picker v-model='form.xc_storage_date' value-format='yyyy-MM-dd' style='width:100%'></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='材料类别' prop='material_type'>
							<el-input v-model='form.material_type'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='材料状态' prop='material_status'>
							<el-input v-model='form.material_status'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='24'>
						<el-form-item label='材料库存情况' prop='material_stock'>
							<el-input v-model='form.material_stock'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='24'>
						<el-form-item label='非通用材料情况' prop='other_material_stock'>
							<el-input v-model='form.other_material_stock'></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter='20'>
					<el-col :span='8'>
						<el-form-item label='五金入库日期' prop='hardware_storage_date'>
							<el-date-picker v-model='form.hardware_storage_date' value-format='yyyy-MM-dd'></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='五金材料状态' prop='hardware_status'>
							<el-input v-model='form.hardware_status'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='24'>
						<el-form-item label='五金库存情况' prop='hardware_stock'>
							<el-input v-model='form.hardware_stock'></el-input>
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
import storeApi from '@/api/ck/store'
import commonJs from '@/utils/common'

const formInit = {
	id:null,
	project_id:null,
	project_name:'',
	project_no:'',
	contract_no:'',	
	xc_storage_date:'',
	material_type:'',
	material_status:'',
	material_stock:'',
	other_material_stock:'',
	hardware_storage_date:'',
	hardware_status:'',
	hardware_stock:''
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
		sizeChange(value){
			this.requestParams.pageSize=value
			this.getData()
		},
		getData() {
			this.loading=true
			storeApi.getList(this.requestParams).then(res=>{
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
				xc_storage_date:row.xc_storage_date,
				material_type:row.material_type,
				material_status:row.material_status,
				material_stock:row.material_stock,
				other_material_stock:row.other_material_stock,
				hardware_storage_date:row.hardware_storage_date,
				hardware_status:row.hardware_status,
				hardware_stock:row.hardware_stock
			}
			this.form = Object.assign({},formInit,r)
			this.dialogShow = true
		},
		save({isSubmit}) {
			this.$refs.form.validate(vaild=>{
				if(vaild){
					this.formLoading=true
					this.form.is_submit = isSubmit?1:0
					if(this.isFormEdit){						
						storeApi.update(this.form).then(res=>{
							this.$message.success('记录更新成功')
							this.dialogShow = this.formLoading = false
							this.getData()
						})
					}else{						
						storeApi.create(this.form).then(res=>{
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
				storeApi.del(row.id).then(res=>{
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
			storeApi.getTodoProjectList().then(res=>{
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