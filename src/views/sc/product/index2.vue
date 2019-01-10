<template>
	<div>
		<el-alert
    title="生产车间根据下单编号创建日志，对生产日志数据及时更新"
    type="success" :closable="false" style='margin-bottom: 15px'>
  	</el-alert>
		<el-tabs type="card" v-model='tabIndex'  @tab-click='tabClick'>
			<el-tab-pane label="生产日志列表" name="list">
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
import commonJs from '@/utils/common'
import List from './list'
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
		this.getTodoProject()
	},
	methods:{
		tabClick({name}){
			// let ref=(name=='summary'?'tableList':'tableTodo')
			// setTimeout(()=>{
			// 	this.$refs[ref].doLayout()
			// },100)
		},
		expandPlanList({row}){
			this.$refs.tableList.toggleRowExpansion(row)
		},
		sizeChange(value){
			this.requestParams.pageSize=value
			this.getData()
		},
		getTodoProject(){
			this.newProjectLoading = true
			productplanApi.getTodoProjectList().then(res=>{
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
		del({row},{row:subRow,$index}){
			console.log(subRow.id)
			let confirmText = '确定删除？'
			if(row.planList.length == 1){
				confirmText = '当前项目只有该下单记录，删除后项目将移至待办新项目中，确定删除吗？'
			}
			this.$confirm(confirmText,'提示',{
				type: 'warning'
			}).then(()=>{
				productplanApi.del(subRow.id).then(res=>{
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
				order_area: subRow.order_area,
				product_status: subRow.product_status,
				expect_delivery: subRow.expect_delivery,
				glass_expect_delivery: subRow.glass_expect_delivery,
				is_finish: subRow.is_finish,
				finish_date: subRow.finish_date,
			}
			this.form = Object.assign({},formInit,r)
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
				productplanApi.getListByProject(row.project_id).then(res=>{
					row.planList = res.data				
				})
			}			
		},
		clickProject(projectId){
			this.$refs.projectInfo.open(projectId)
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