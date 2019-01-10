<template>
	<div>
		<el-alert
    title="各职能部门为保证其部门经办项目能够顺利有序的完成，在其负责范围内出现异常的情况或问题进行反馈上报。"
    type="success" :closable="false" style='margin-bottom: 15px'>
  	</el-alert>
  	<el-row>
			<el-col :span='4'>
				<el-button type='primary' size='small' @click='createProblem'>反馈问题</el-button>
			</el-col>
			<el-col :span='20' style='text-align: right'>
				<el-form ref='formQuery' :model='queryParams' inline size='small'>
					<el-form-item prop='isTodo'>
						<el-tooltip content='只显示待处理的问题'>
							<el-badge :value='todoTotal'>
								<el-checkbox 
									v-model="requestParams.isTodo" 
									label="待处理" 
									border
									:true-label='1'
									:false-label='0'
									@change='getData'>
								</el-checkbox>
							</el-badge>
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
  		max-height='500'>
			<el-table-column prop='project_no' fixed label='项目编号' width='100'>
				<template slot-scope='scope'>
					<span @click='clickProject(scope.row.project_id)' class='c-link'>{{ scope.row.project_no }}</span>					
				</template>
			</el-table-column>
			<el-table-column prop='project_name' label='项目名称' show-overflow-tooltip></el-table-column>
			<el-table-column prop='level' label='问题级别' align='center' width='80'>
				<template slot-scope='{row}'>
					<problem-level-tag :level='row.level' size='mini'></problem-level-tag>
				</template>
			</el-table-column>
			<el-table-column prop='level' label='提出部门'>
				<template slot-scope='{ row }'>
					<span>{{ getDepText(row.dep) }}</span>
				</template>
			</el-table-column>
			<el-table-column prop='content' label='反馈内容' show-overflow-tooltip></el-table-column>
			<el-table-column prop='create_user_name' label='反馈人' align='center'>
			</el-table-column>
			<el-table-column prop='create_time' label='反馈时间' align='center' width='140'>
				<template slot-scope='scope'>
					<span>{{scope.row.create_time | formatDate}}</span>
				</template>
			</el-table-column>
			<el-table-column prop='is_resolve' label='状态' align='center' width='80'>
				<template slot-scope='{row}'>					
					<el-tag size='mini' :type='row.is_resolve?"success":"danger"'>{{row.is_resolve?'已处理':'待处理'}}</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop='resolve_time' label='处理时间' align='center' width='140'>
				<template slot-scope='{row}'>
					<span>{{row.resolve_time | formatDate}}</span>
				</template>
			</el-table-column>
			<el-table-column prop='resolve_user_name' label='处理人' align='center'>
			</el-table-column>
			<el-table-column prop='resolve_content' label='处理结果' show-overflow-tooltip>
			</el-table-column>
			<el-table-column label='操作' fixed='right' align='center' width='120'>
				<template slot-scope='scope'>
					<el-button  size='mini' type='text' @click='viewProblem(scope)' v-if='scope.row.is_resolve'>预览</el-button>
					<template v-else>
						<el-button  size='mini' type='text' @click='editProblem(scope)'>修改</el-button>
						<el-tooltip content='只能删除未处理的反馈问题'>
							<el-button  size='mini' type='text' @click='del(scope)'>删除</el-button>
						</el-tooltip>
					</template>
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
    <el-dialog 
    	:title='isFormEdit?"问题修改":"反馈问题"' 
    	:visible.sync='dialogShow' 
    	@open='openDialog'
    	top='1vh'>
			<el-form :model='form' size='small' :rules='formRules' ref='form' label-width='80px' status-icon>
				<el-row :gutter='20'>
					<el-col :span='24'>
						<el-form-item label='所属项目' prop='project_id'>
							<project-input 
								:label.sync='form.project_name'
								v-model='form.project_id'
								@change='i=>{form.project_no=i?i.no:"";form.contract_no=i?i.contract_no:""}'
							/>
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
						<el-form-item label='反馈人'>
							<el-input readonly :value='form.create_user_name'></el-input>
						</el-form-item>
					</el-col>	
					<el-col :span='12'>
						<el-form-item label='提出部门'>
							<el-input readonly :value='getDepText(form.dep)'></el-input>
						</el-form-item>
					</el-col>	
					<el-col :span='24'>
						<el-form-item prop='level' label='问题级别'>						
							<el-radio-group v-model="form.level" >
						    <el-radio :label="1">提醒级别</el-radio>
						    <el-radio :label="2">情况重要</el-radio>
						    <el-radio :label="3">情况紧急</el-radio>
						  </el-radio-group>
						</el-form-item>
					</el-col>	
					<el-col :span='24'>
						<el-form-item label='反馈问题' prop='content'>
							<el-input v-model='form.content' type='textarea' placeholder='简单填写项目问题' :rows='3'></el-input>
						</el-form-item>
					</el-col>	
				</el-row>
			</el-form>
			<span slot="footer">
		    <el-button @click="save" type="primary" :loading='formLoading' >{{isFormEdit?"修改":"反馈"}}</el-button>
		    <el-button @click="dialogShow=false">取 消</el-button>
		  </span>
		</el-dialog>
		<el-dialog 
			title='选择项目'
    	:visible.sync='dialogShow2' 
    	top='1vh'
    	width='60%'>
    	<el-form :model='queryParams2' inline size='mini'>
    		<el-form-item label='编号' prop='no'>
    			<el-input v-model='queryParams2.project_no' placeholder='填写项目编号' clearable></el-input>
    		</el-form-item>
    		<el-form-item label='项目名称'>
    			<el-input v-model='queryParams2.project_name' placeholder='填写项目名称' clearable></el-input>
    		</el-form-item>
    		<el-form-item>
    			<el-button type='primary' @click='query2'>查询</el-button>
    		</el-form-item>
    	</el-form>
    	<el-table :data='list2' size='small' border height='300'>
    		<el-table-column prop='no' fixed width='100' label='项目编号'></el-table-column>
    		<el-table-column prop='name' label='项目名称' show-overflow-tooltip></el-table-column>
    		<el-table-column prop='contract_no' label='合同编号' show-overflow-tooltip></el-table-column>
    		<el-table-column prop='customer_name' label='客户名称' show-overflow-tooltip></el-table-column>
    		<el-table-column prop='customer_type' label='客户类别'></el-table-column>
    		<el-table-column prop='company_name' label='业绩公司'></el-table-column>
    		<el-table-column prop='salesman' label='业务员'></el-table-column>
    		<el-table-column prop='update_time' label='更新时间' width='120'>
    			<template slot-scope='{row}'>
    				{{ $commonJs.formatDate(row.update_time) }}
    			</template>
    		</el-table-column>
    		<el-table-column label='操作' fixed='right' align='center' width='60'>
    			<template slot-scope='scope'>
    				<el-button type='text' size='mini' @click='selectProject(scope)'>选择</el-button>
    			</template>
    		</el-table-column>
    	</el-table>
    	<el-pagination style='margin-top: 10px'
	    	small
	      :current-page.sync = "requestParams2.currentPage"
	      :total="dataTotal2"
	      layout="prev, pager, next"
	      @current-change='getProjectData'
	      >
	    </el-pagination>
			<span slot='footer'>
				<span style='float:left' >
					已选：
					<transition name="fade" mode='out-in'>
					<el-tag :type='selectLabel?"":"info"' :closable='selectLabel?true:false' @close='close'>{{selectLabel?selectLabel:"无"}}</el-tag>
				</transition>
				</span>
				<el-button size='small' type='primary' @click='test2'>确定</el-button>
				<el-button size='small'  @click="dialogShow2=false">取消</el-button>
			</span>
		</el-dialog>
		<problem-info ref='problemInfo'></problem-info>
		<project-info ref='projectInfo'></project-info>
	</div>
</template>

<script>
import projectProblemApi from '@/api/yyzx/projectProblem'
import projectApi from '@/api/yyzx/project'
import commonJs from '@/utils/common'
import problemInfo from '@/components/problemInfo'
import problemLevelTag from '@/components/problemLevelTag'
import projectInfo from '@/components/projectDetails'
import projectInput from '@/components/projectInput'

const formInit = {
	id:null,
	project_id:null,
	project_name:'',
	contract_no:'',	
	level:1,
}
export default {
	components:{ projectInfo,problemInfo,problemLevelTag, projectInput },
	props:{
		dep:{
			type:String
		}
	},
	data(){
		return {
			todoTotal:0,
			loading: true,
			dialogShow:false,
			list:[],
			dataTotal:0,

			dialogShow2:false,
			select:null,
			list2:[],
			dataTotal2:0,
			isEdit:false,
			selectLabel:'',
			
			newProjectList:[],
			form:Object.assign({},formInit),
			formRules:{
				project_id:[{	required:true,message:'请选择项目' }],
				content:[{	required:true,message:'请填写反馈问题' }],
				resolve_content:[{	required:true,message:'请填写处理结果' }]
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
				}
			},
			//请求参数
			requestParams:{
				dep:this.dep.toUpperCase(),
				isTodo:0,
				pageSize:10,//分页大小
				currentPage:1//当前页
			},
			queryParams2:{
				project_no:'',//项目编号
				project_name:'',//项目名称
			},
			requestParams2:{
				currentPage:1
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
	},
	methods:{		
		sizeChange(value){
			this.requestParams.pageSize=value
			this.getData()
		},
		getData() {
			this.loading=true
			projectProblemApi.getList(this.requestParams).then(res=>{
				this.list = res.data.list
				this.dataTotal = res.data.total
				this.todoTotal = res.data.todoTotal
				this.loading = false
			})
		},
		getProjectData(){
			projectApi.getList(this.requestParams2).then(res=>{
				this.list2 = res.data.list
				this.dataTotal2 = res.data.total
			})
		},
		selectProject({row}){
			this.isEdit = true
			this.selectLabel = row.no
			this.select = Object.assign({},row)
		},
		test(){
			this.isEdit=false
			this.selectLabel=this.form.project_no
			this.getProjectData()
			this.dialogShow2=true
		},
		test2(){
			if(this.isEdit){
				this.form.project_id = this.select?this.select.id:null
				this.form.project_no = this.select?this.select.no:''
				this.form.project_name = this.select?this.select.name:''
				this.form.contract_no = this.select?this.select.contract_no:''
			}			
			this.dialogShow2=false
		},
		close(){
			this.isEdit = true
			this.selectLabel = ''
			this.select = null
		},
		//查询方法
		query(){
			Object.assign(this.requestParams,this.queryParams)
			this.getData()
		},
		query2(){
			Object.assign(this.requestParams2,this.queryParams2)
			this.getProjectData()
		},
		resetQuery(){
			this.$refs.formQuery.resetFields()
			this.$refs.formQueryMore.resetFields()
			this.query()
		},
		exportExcel(){
			this.$message('功能未开发')
		},	
		createProblem(){
			let r = {
				create_user_name:this.$store.state.user.name,
				dep:this.dep.toUpperCase()
			}
			this.form = Object.assign({},formInit,r)
			this.dialogShow = true
		},
		editProblem({row}){
			let r = {
				project_no: row.project_no,
				project_name: row.project_name,
				project_id: row.project_id,
				contract_no: row.contract_no,

				id:row.id,
				create_user_name:row.create_user_name,
				level:row.level,
				content:row.content,
				dep:row.dep
			}
			this.form = Object.assign({},formInit,r)
			this.dialogShow = true
		},
		save() {
			this.$refs.form.validate(vaild=>{
				if(vaild){
					this.formLoading=true
					if(this.isFormEdit){						
						this.formLoading = true
						projectProblemApi.updateByDep(this.form).then(res=>{
							this.dialogShow = false
							this.$message.success('修改成功')
							this.getData()
							this.formLoading = false
						})
					}else{						
						projectProblemApi.createByDep(this.form).then(res=>{
							this.$message.success('反馈问题创建成功')
							this.dialogShow = this.formLoading = false
							this.getData()							
						})
					}
				}else{
					return false
				}
			})
		},
		del({row,$index}){
			let confirmText = '确定删除？'
			this.$confirm(confirmText,'提示',{
				type: 'warning'
			}).then(()=>{
				projectProblemApi.del(row.id).then(res=>{
					this.list.splice($index,1)
					this.dataTotal--
					this.todoTotal--
					this.$message.success('删除成功')
				})
			})
		},
		//打开窗口后清除字段验证信息
		openDialog(){
			this.$nextTick(()=>{
				this.$refs.form?this.$refs.form.clearValidate():''
			})
		},
		clickProject(projectId){
			this.$refs.projectInfo.open(projectId)
		},
		viewProblem({row}){
			this.$refs.problemInfo.open(row.id)
		},
		getDepText(dep){
			return projectProblemApi.getDepText(dep)
		}
	},
	filters:{
		point2(v){
			return (v||0).toFixed(2)
		}
	}
}
</script>