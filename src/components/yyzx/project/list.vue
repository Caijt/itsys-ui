<!-- 
此组件初始化时不会自动加载数据，请在mounted中 this.$refs.[].initData() 初始化数据
如果放在dialog里面的吗，请在dialog的open事件中用this.$nextTick进行初始化数据
 -->
<template>
	<div>
		<!-- 查询条件 -->
		<div style='margin-bottom: 2px' v-show='!hideQuery'>
			<div style='float:right;margin-top: 1px'>
				<span><el-button type='primary' @click='query' size='mini'>查询</el-button></span>
				<span><el-button @click='resetQuery' size='mini'>重置</el-button ></span>
				<span><el-button @click='queryShowMore=!queryShowMore' size='mini' icon="">
					{{queryShowMore?"收起":"更多"}}
					<i :class="{'el-icon-arrow-up':queryShowMore,'el-icon-arrow-down':!queryShowMore}"></i>
				</el-button></span>
			</div>
			<el-form ref='formQuery' :model='queryParams' label-width='68px' 
				class='c-form-condensed' inline size='mini'>
				<el-form-item label='项目编号' prop='project_no'>
					<el-input v-model='queryParams.project_no' clearable></el-input>
				</el-form-item>
				<el-form-item label='项目名称' prop='project_name'>
					<el-input v-model='queryParams.project_name' clearable></el-input>
				</el-form-item>
				<!-- 更多条件 -->
				<div v-show='queryShowMore'>
					<el-form-item label='合同编号' prop='contract_no'>
						<el-input v-model='queryParams.contract_no' clearable></el-input>
					</el-form-item>
					<el-form-item label='客户名称' prop='customer_name'>
						<el-autocomplete v-model='queryParams.customer_name'  :fetch-suggestions="getFieldList('customer_name')"></el-autocomplete>
					</el-form-item>
					<el-form-item label='客户类别' prop='customer_type'>
						<el-autocomplete v-model='queryParams.dev' clearable :fetch-suggestions="getFieldList('dev')"></el-autocomplete>
					</el-form-item>
					<el-form-item label='开发商' prop='dev'>
						<el-autocomplete v-model='queryParams.dev' clearable :fetch-suggestions="getFieldList('dev')"></el-autocomplete>
					</el-form-item>
					<el-form-item label='业绩公司' prop='company_name'>
						<el-autocomplete v-model='queryParams.company_name'  :fetch-suggestions="getFieldList('company_name')"></el-autocomplete>
					</el-form-item>
					<el-form-item label='业务员' prop='salesman'>
						<el-autocomplete v-model='queryParams.salesman' clearable :fetch-suggestions="getFieldList('salesman')"></el-autocomplete>
					</el-form-item>
					<el-form-item label='项目地点' prop='place'>
						<el-autocomplete v-model='queryParams.place' clearable :fetch-suggestions="getFieldList('place')"></el-autocomplete>
					</el-form-item>
				</div>
				<!--/ 更多条件-->
			</el-form>
		</div>
		<!--/ 查询条件 -->
		<slot name='button'></slot>
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
			<el-table-column prop='no' label='项目编号'  fixed width='100'></el-table-column>
			<el-table-column prop='name' label='项目名称' show-overflow-tooltip min-width='150'></el-table-column>
			<el-table-column prop='contract_no' label='合同编号' min-width='150' show-overflow-tooltip>
				<template slot-scope='{row}'>
					<span class='c-link' @click='$refs.contractInfo.open(row.contract_id)'>{{ row.contract_no}}</span>
				</template>
			</el-table-column>			
			<el-table-column prop='customer_name' label='客户名称' min-width='150' show-overflow-tooltip></el-table-column>
			<el-table-column prop='customer_type' label='客户类别' width='100' show-overflow-tooltip></el-table-column>
			<el-table-column prop='dev' label='开发商' width='100' show-overflow-tooltip></el-table-column>
			<el-table-column prop='place' label='项目地点' width='80'></el-table-column>
			<el-table-column prop='company_name' label='业绩公司' min-width='150' show-overflow-tooltip></el-table-column>
			<el-table-column prop='salesman' label='业务员' width='80'></el-table-column>
			<el-table-column prop='create_user_name' label='录入员' width='80'></el-table-column>
			<el-table-column prop='update_time' label='创建时间' width='135' sortable='custom'>
				<template slot-scope='{row}'>
					<span>{{$moment(row.create_time).format('YYYY-MM-DD HH:mm')}}</span>
				</template>
			</el-table-column>
			<el-table-column prop='update_time' label='更新时间' width='135' sortable='custom'>
				<template slot-scope='{row}'>
					<span>{{$moment(row.update_time).format('YYYY-MM-DD HH:mm')}}</span>
				</template>
			</el-table-column>
			<!-- slot[column] -->
			<slot name='column'></slot>
			<!--/ slot[column]-->
		</el-table>
		<!-- 数据表格 -->
		<!-- 分页 -->
		<el-pagination 
			v-if='!noPage'
			style='margin-top: 10px'
	    :page-sizes = "[10, 20, 50, 100]"
	    :page-size= "requestParams.pageSize"
	    :current-page.sync = "requestParams.currentPage"
	    layout="total, sizes, prev, pager, next, jumper"
	    :total="dataTotal"
	    @size-change='sizeChange'
	    @current-change='getData'
	    >
	  </el-pagination>
	  <!--/ 分页 -->
	  <contract-info ref='contractInfo' :in-dialog='inDialog'></contract-info>
	</div>
</template>
<script>
import projectApi from '@/api/yyzx/project'
import contractInfo from '@/components/yyzx/contract/info'

export default {
	components:{ contractInfo },
	props:{
		size:{
			type:String,
			default:''
		},
		maxHeight:{
			default:350
		},
		params:{
			default:()=>({})
		},
		inDialog:{
			type:Boolean,
			default:false
		},
		noPage:{
			type:Boolean,
			default:false
		},
		hideQuery:{
			type:Boolean,
			default:false
		},
		init:{
			type:Boolean,
			default:false
		}
	},
	data(){
		return {
			loading: true,			
			list:[],
			dataTotal:0,		
			queryShowMore:false,
			//查询条件字段
			queryParams:{
				project_name:'',
				project_no:'',
				contract_no:'',
				customer_name:'',
				customer_type:'',
				company_name:'',
				place:'',
				salesman:'',
				hasUpdate:0,
				hasTodo:0,
				hasProblem:0
			},
			//数据请求的参数
			requestParams:{
				pageSize:10,//分页大小
				currentPage:1,//当前页
				sortProp:'',
				sortOrder:'',
				noPage:this.noPage?1:0
			}			
		}
	},
	created(){
		//this.getData()
	},
	mounted(){
		if(this.init){
			this.initData()
		}
	},
	methods:{
		initData(){
			this.resetQuery()
		},
		reload(){
			this.getData()
		},
		//分页容量大小发生变化时
		sizeChange(value){
			this.requestParams.pageSize=value
			this.getData()
		},
		//获取数据
		getData() {
			this.loading=true
			projectApi.getList(this.requestParams).then(res=>{
				this.list = res.data.list
				this.dataTotal = res.data.total
				this.loading = false
				this.$emit('loaded',{ 
					total:res.data.total,
					list:res.data.list,
					params:{...this.queryParams} 
				})
			})
		},
		//查询方法
		query({ key }={}){
			if(key){
				let value = this.queryParams[key]
				this.requestParams = {...this.requestParams,[key]:value}
			}else{
				this.requestParams = {...this.requestParams,...this.queryParams}
			}			
			this.getData()
		},
		//重置查询条件
		resetQuery(){
			this.$refs.formQuery.resetFields()
			this.queryParams = {...this.queryParams,...this.params}
			this.requestParams.currentPage=1
			this.query()
		},
		openProjectDetails(projectId){
			this.$refs.projectDetails.open(projectId)
		},
		sortChange({prop,order}){
			this.requestParams.sortProp = prop
			this.requestParams.sortOrder = order
			this.getData()
		},
		exportExcel(){
			projectApi.exportExcel(this.requestParams)
		},
		del({ row,$index }){
			let confirmText = '确定删除？'
			this.$confirm(confirmText,'提示',{
				type: 'warning'
			}).then(()=>{
				projectApi.del(row.id).then(res=>{
					this.$message.success('删除成功')
					this.reload()					
				})
			})
		},
		getFieldList(field){
			return (keyword,callback)=>{
				projectApi.getFieldList({ field,keyword }).then(res=>{
					callback(res.data)
				})
			}
		}
	}
}
</script>