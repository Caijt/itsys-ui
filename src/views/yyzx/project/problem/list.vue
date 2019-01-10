<template>
	<div>
		<el-alert
	    title="项目反馈问题列表，可在此页面对各部门反馈的问题做处理记录"
	    type="warning" 
	    :closable="false"
	    style='margin-bottom: 15px'>
  	</el-alert>
  	<el-row>
			<el-col :span='4'>
				<el-button type='primary' size='small' @click='createProblem'>问题记录</el-button>
			</el-col>
			<el-col :span='20' style='text-align: right'>
				<el-form ref='formQuery' :model='queryParams' inline size='small'>
					<el-form-item prop='isTodo'>
						<el-tooltip content='只显示未处理的问题'>
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
					<el-button  size='mini' type='text' @click='viewProblem(scope)'>预览</el-button>
					<el-tooltip content='处理该问题' placement='left' v-if='!scope.row.is_resolve'>
						<el-button  size='mini' type='text' @click='resolveDialog(scope)'>处理</el-button>
					</el-tooltip>
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
    	:title='isFormEdit?"项目问题处理":"项目问题处理记录"' 
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
								>
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
							<el-tag size='small' type='danger' v-if='isFormEdit'>情况紧急</el-tag>
							<el-radio-group v-model="form.level" v-else>
						    <el-radio :label="1">提醒级别</el-radio>
						    <el-radio :label="2">情况重要</el-radio>
						    <el-radio :label="3">情况紧急</el-radio>
						  </el-radio-group>
						</el-form-item>
					</el-col>	
					<el-col :span='24'>
						<el-form-item label='反馈问题' prop='content'>
							<el-input :readonly='isFormEdit' v-model='form.content' type='textarea' placeholder='简单填写项目问题' :rows='3'></el-input>
						</el-form-item>
					</el-col>	
					<el-col :span='24'>
						<el-form-item label='处理结果' prop='resolve_content'>
							<el-input v-model='form.resolve_content' type='textarea' placeholder='简单填写下处理内容' :rows='3'></el-input>
						</el-form-item>
					</el-col>	
				</el-row>
			</el-form>
			<span slot="footer">
		    <el-button @click="save" type="primary" :loading='formLoading'>处理</el-button>
		    <el-button @click="dialogShow=false">取 消</el-button>
		  </span>
		</el-dialog>
		<problem-info ref='problemInfo'></problem-info>
	</div>
</template>

<script>
import projectProblemApi from '@/api/yyzx/projectProblem'
import projectApi from '@/api/yyzx/project'
import commonJs from '@/utils/common'
import ProblemInfo from '@/components/problemInfo'
import ProblemLevelTag from '@/components/problemLevelTag'
import projectInput from '@/components/projectInput'

const formInit = {
	id:null,
	project_id:null,
	project_name:'',
	contract_no:'',	
	level:1,
}
export default {
	components:{ ProblemInfo,ProblemLevelTag, projectInput },
	data(){
		return {
			todoTotal:0,
			loading: true,
			dialogShow:false,
			list:[],
			dataTotal:0,
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
				isTodo:0,
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
		createProblem(){
			let r = {
				create_user_name:this.$store.state.user.name,
				dep:'YYZX'
			}
			this.form = {...formInit,...r}
			this.dialogShow = true
		},
		resolveDialog({row}){
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
						projectProblemApi.resolve(this.form).then(res=>{
							this.dialogShow = false
							this.$message.success('已处理')
							this.getData()
							this.formLoading = false
						})
					}else{						
						projectProblemApi.create(this.form).then(res=>{
							this.$message.success('记录创建成功')
							this.dialogShow = this.formLoading = false
							this.getData()							
						})
					}
				}else{
					return false
				}
			})
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