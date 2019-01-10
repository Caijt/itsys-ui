<template>
	<div>
		<el-alert
	    title="以项目为单位汇总各部门反馈的问题，点击问题明细可查看详情"
	    type="warning" 
	    :closable="false"
	    style='margin-bottom: 15px'>
		</el-alert>
		<el-form ref='formQuery' :model='queryParams' inline size='small'>
			<el-form-item prop='isTodo'>
				<el-tooltip content='显示有未解决问题的项目'>
					<el-badge :value='todoTotal'>
						<el-checkbox 
							v-model="requestParams.isTodo" 
							label="待解决" 
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
		<el-table 
			:data='list' 
			ref='tableList'
			v-loading='loading' border stripe :max-height='500' >
			<el-table-column prop='project_no' label='项目编号' fixed width='100'></el-table-column>
			<el-table-column prop='project_name' label='项目名称' show-overflow-tooltip>
				<template slot-scope='scope'>
					<span class='c-link' @click='viewProject(scope)'>{{ scope.row.project_name }}㎡</span>
				</template>
			</el-table-column>	
			<el-table-column prop='total' label='反馈问题数量'></el-table-column>	
			<el-table-column prop='resolve_total' label='已解决数量'></el-table-column>	
			<el-table-column label='问题解决率' min-width='120' align='center'>
				<template slot-scope='{row}'>
					<el-progress text-inside :stroke-width='18' :status='$commonJs.getProgress(row.resolve_total/row.total)>=100?"success":""' :percentage="$commonJs.getProgress(row.resolve_total/row.total)"></el-progress>
				</template>
			</el-table-column>
			<el-table-column prop='resolve_time' label='最近解决时间' width='140'>
				<template slot-scope='scope'>
					<span>{{scope.row.resolve_time | formatDate}}</span>
				</template>
			</el-table-column>
			<el-table-column label='操作' fixed='right' align='center' width='90'>
				<template slot-scope='scope'>
					<el-button  size='mini' type='text' @click='viewProblemList(scope)'>问题明细[{{scope.row.total}}]</el-button>	
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
	  <problem-list ref='problemList'></problem-list>
	</div>
</template>
<script>
import projectProblemApi from '@/api/yyzx/projectProblem'
import commonJs from '@/utils/common'
import ProblemList from './problemList'

const formInit = {
	id:null,
	project_id:null,
	project_name:'',
	contract_no:'',	
	order_no:'',
	order_area:0,
	order_date:'',
	is_finish:0,
	product_status:'',
	expect_delivery:'',
	glass_expect_delivery:'',
	finish_date:'',

}
export default {
	components:{ ProblemList },
	data(){
		return {
			tabIndex:'summary',
			loading: true,
			newProjectLoading: true,
			dialogShow:false,
			list:[],
			todoTotal:0,
			dataTotal:0,
			newProjectList:[],
			form:Object.assign({},formInit),
			formRules:{
				order_no:[{ required:true, message:'请填写下单编号' }],
				order_date:[{	required:true,message:'请填写下单日期' }],
				finish_date:[{	required:true,message:'请填写完成日期' }]
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
		tabClick({name}){
			let ref=(name=='summary'?'tableList':'tableTodo')
			setTimeout(()=>{
				this.$refs[ref].doLayout()
			},100)
		},
		sizeChange(value){
			this.requestParams.pageSize=value
			this.getData()
		},
		getData() {
			this.loading=true
			projectProblemApi.getSummaryList(this.requestParams).then(res=>{
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
		viewProject(scope){
			this.$emit('click-project',scope.row.project_id)
		},
		viewProblemList(scope){
			this.$refs.problemList.open(scope.row.project_id)
		},
		getProgress({row}){
			return commonJs.round(row.finish_area / row.order_area)
		}
	},
	filters:{
		point2(v){
			return (v||0).toFixed(2)
		}
	}
}
</script>