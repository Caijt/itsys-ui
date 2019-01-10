<template>
	<div>
		<!-- 查询条件 -->
		<el-row type='flex'>
			<div style='flex:1'>
				<el-form ref='formQuery' :model='queryParams' label-width='70px' class='c-form-condensed' inline size='mini'>
					<el-form-item label='项目名称' prop='project_name'>
						<el-input v-model='queryParams.project_name' clearable></el-input>
					</el-form-item>
					<el-form-item label='客户单位' prop='customer_name'>
						<el-input v-model='queryParams.customer_name' clearable></el-input>
					</el-form-item>
					<!-- 更多条件 -->
					<template v-if='queryShowMore'>
						<el-form-item label='项目编号' prop='project_no'>
							<el-input v-model='queryParams.project_no' clearable></el-input>
						</el-form-item>
						<el-form-item label='合同编号' prop='contract_no'>
							<el-input v-model='queryParams.contract_no' clearable></el-input>
						</el-form-item>
						<el-form-item label='业绩公司' prop='company_name'>
							<el-input v-model='queryParams.company_name' clearable></el-input>
						</el-form-item>
						<el-form-item label='业务员' prop='salesman'>
							<el-input v-model='queryParams.salesman' clearable></el-input>
						</el-form-item>
					</template>
					<!--/ 更多条件-->
				</el-form>
			</div>
			<div style='float:right'>
				<span><el-button type='primary' @click='query' size='mini'>查询</el-button></span>
				<span><el-button @click='resetQuery' size='mini'>重置</el-button ></span>
				<span><el-button @click='queryShowMore=!queryShowMore' size='mini' icon="">
					{{queryShowMore?"收起":"更多"}}
					<i v-bind:class="{'el-icon-arrow-up':queryShowMore,'el-icon-arrow-down':!queryShowMore}"></i>
				</el-button></span>
			</div>
		</el-row>
		<!--/ 查询条件 -->
		<!-- 数据表格 -->
		<el-table 
			:data='list' 
			ref='tableList'
			v-loading='loading'
			border 
			stripe
			:size='size'
			:max-height='maxHeight'
			@sort-change='sortChange'>
			
		</el-table>
		<!-- 数据表格 -->
		<!-- 分页 -->
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
	  <!--/ 分布 -->
	</div>
</template>
<script>

export default {
	props:{
		size:{
			type:String,
			default:'medium'
		},
		maxHeight:{
			default:500
		},
		params:{
			default:()=>({})
		}
	},
	data(){
		return {
			loading: true,
			dialogShow:false,
			list:[],
			dataTotal:0,
			formLoading:false,
			projectList:[],
			queryShowMore:false,
			//查询条件字段
			queryParams:{
				project_name:'',//项目名称
				customer_name:'',//客户单位
				project_no:'',//项目编号
				contract_no:'',//合同编号
				company_name:'',//业绩公司
				salesman:'',//业务员
			},
			//数据请求的参数
			requestParams:{
				pageSize:10,//分页大小
				currentPage:1,//当前页
				sortProp:'',
				sortOrder:''
			}
		}
	},
	created(){
		console.log('created')
		//this.getData()
	},
	methods:{
		//分页容量大小发生变化时
		sizeChange(value){
			this.requestParams.pageSize=value
			this.getData()
		},
		//获取数据
		getData() {
			this.loading=true
			invoiceRecordApi.getSummaryList({...this.requestParams,...this.params}).then(res=>{
				this.list = res.data.list
				this.dataTotal = res.data.total
				this.loading = false
			})
		},
		//查询方法
		query(){
			this.requestParams = {...this.requestParams,...this.queryParams}
			this.getData()
		},
		//重置查询条件
		resetQuery(){
			this.$refs.formQuery.resetFields()
			this.requestParams.currentPage=1
			this.query()
		},
		viewProject(scope){
			this.$emit('click-project',scope.row.project_id)
		},
		sortChange({prop,order}){
			this.requestParams.sortProp = prop
			this.requestParams.sortOrder = order
			this.getData()
		}
	}
}
</script>