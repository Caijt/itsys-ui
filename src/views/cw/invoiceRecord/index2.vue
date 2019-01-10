<template>
	<div>
		<el-alert
    title="财务部根据已立项项目的开票情况实时更新到项目信息中"
    type="success" :closable="false" style='margin-bottom: 15px'>
  	</el-alert>
		<el-tabs type="card" v-model='tabIndex'  @tab-click='tabClick'>
			<el-tab-pane label="开票记录" name="list">
		  	<list @click-project='clickProject'></list>
			</el-tab-pane>
	    <el-tab-pane label="项目汇总" name="summary">
	    	<summary-list @click-project='clickProject'></summary-list>
	    </el-tab-pane>
	  </el-tabs>	
		<project-info ref='projectInfo'></project-info>
	</div>
</template>
<script>
import SummaryList from './summaryList'
import ProjectInfo from '@/components/projectDetails'

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
	components:{ List, SummaryList,ProjectInfo },
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
				order_date:[{	required:true,message:'请填写下单日期' }],
				finish_date:[{	required:true,message:'请填写完成日期' }],
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
	methods:{
		tabClick({name}){
			// let ref=(name=='summary'?'tableList':'tableTodo')
			// setTimeout(()=>{
			// 	this.$refs[ref].doLayout()
			// },100)
		},
		sizeChange(value){
			this.requestParams.pageSize=value
			this.getData()
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
		
		clickProject(projectId){
			this.$refs.projectInfo.open(projectId)
		}
	}	
}
</script>