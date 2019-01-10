<!-- 
此组件初始化时不会自动加载数据，请在mounted中 this.$refs.[].initData() 初始化数据
如果放在dialog里面的吗，请在dialog的open事件中用this.$nextTick进行初始化数据
 -->
<template>
	<div>
		<!-- 查询条件 -->
		<div style='margin-bottom:3px'>
			<div style='float:right;margin-top:3px'>
				<span><el-button type='primary' @click='query' size='mini'>查询</el-button></span>
				<span><el-button @click='resetQuery' size='mini'>重置</el-button ></span>
				<span><el-button @click='queryShowMore=!queryShowMore' size='mini' icon="">
					{{queryShowMore?"收起":"更多"}}
					<i :class="{'el-icon-arrow-up':queryShowMore,'el-icon-arrow-down':!queryShowMore}"></i>
				</el-button></span>
			</div>
			<el-form ref='formQuery' :model='queryParams' label-width='68px' 
				class='c-form-condensed' inline size='mini'>
				<el-form-item label='管理人员' prop='admin'>
					<el-input v-model='queryParams.admin' clearable></el-input>
				</el-form-item>
				<el-form-item label='安装计划' prop='install_plan'>
					<el-input v-model='queryParams.install_plan' clearable></el-input>
				</el-form-item>
				<el-form-item label='提供安装' prop='is_install'>
					<el-select v-model='queryParams.is_install' clearable>
						<el-option :value='1' label='是'></el-option>
						<el-option :value='0' label='否'></el-option>
					</el-select>
				</el-form-item>				
				<!-- 更多条件 -->
				<template v-if='queryShowMore'>
					<el-form-item label='安装进度' prop='install_progress'>
						<el-input v-model='queryParams.install_progress' clearable></el-input>
					</el-form-item>
					<el-form-item label='劳务合同' prop='contract_status'>
						<el-input v-model='queryParams.contract_status' placeholder='劳务合同执行情况' clearable></el-input>
					</el-form-item>
					<el-form-item label='项目编号' prop='project_no'>
						<el-input v-model='queryParams.project_no' clearable></el-input>
					</el-form-item>
					<el-form-item label='项目名称' prop='project_name'>
						<el-input v-model='queryParams.project_name' clearable></el-input>
					</el-form-item>
					<el-form-item label='合同编号' prop='contract_no'>
						<el-input v-model='queryParams.contract_no' clearable></el-input>
					</el-form-item>
					<el-form-item label='客户名称' prop='customer_name'>
						<el-input v-model='queryParams.customer_name' clearable></el-input>
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
			<el-table-column prop='project_no' fixed label='项目编号' width='130' show-overflow-tooltip>
				<template slot-scope='{ row }'>
          <span class='c-link' @click='openOrderInfo(row.project_id)'>{{ row.project_no }}</span>
        </template>
			</el-table-column>
			<el-table-column prop='is_submit' label='录入状态'>
				<template slot-scope='{row}'>
					<el-tag size='mini' v-if='row.is_submit' type='success'>已提交</el-tag>
					<el-tag size='mini' v-else type='info'>未提交</el-tag>
				</template>
			</el-table-column>		
			<el-table-column prop='is_install' label='提供安装' show-overflow-tooltip>
				<template slot-scope='{row}'>
					{{row.is_install?'是':'否'}}
				</template>
			</el-table-column>			
			<el-table-column prop='admin' label='管理人员' show-overflow-tooltip></el-table-column>
			<el-table-column prop='install_plan' label='安装计划' show-overflow-tooltip></el-table-column>	
			<el-table-column prop='install_progress' label='安装进度' width='110' show-overflow-tooltip></el-table-column>
			<el-table-column prop='contract_status' label='劳务合同执行情况' width='150' show-overflow-tooltip></el-table-column>
			<el-table-column prop='create_user_name' label='录入员' ></el-table-column>
			<el-table-column prop='create_time' label='创建时间' sortable='custom' width='140'>
				<template slot-scope='{ row }'>
					{{ $commonJs.formatDate(row.create_time) }}
				</template>
			</el-table-column>
			<el-table-column prop='update_time' label='更新时间' sortable='custom' width='140'>
				<template slot-scope='{ row }'>
					{{ $commonJs.formatDate(row.update_time) }}
				</template>
			</el-table-column>
			<!-- slot[column] -->
			<slot name='column'></slot>
			<!--/ slot[column]-->
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
	  <!--/ 分页 -->
	  <project-details :in-dialog='inDialog' ref='projectDetails' />
	  <order-info :in-dialog='inDialog' ref='orderInfo' />
	</div>
</template>
<script>
import productApi from '@/api/gc/report'
import orderInfo from '@/components/yyzx/order/info'

export default {
	components:{ orderInfo },
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
		init:{
			type:Boolean,
			default:false
		}
	},
	data(){
		return {
			inited:false,
			loading: false,			
			list:[],
			dataTotal:0,		
			queryShowMore:false,
			//查询条件字段
			queryParams:{
				order_no:'',//订单编号
				project_name:'',//项目名称
				customer_name:'',//客户单位
				project_no:'',//项目编号
				contract_no:'',//合同编号
				company_name:'',//业绩公司
				salesman:'',//业务员
				admin:'',
				install_plan:'',
				return_plan:'',
				is_install:'',
				install_progress:'',
				contract_status:''
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
		this.$options.components.projectDetails = ()=>import('@/components/projectDetails')
		//this.getData()
	},
	mounted(){
		if(this.init){
			this.initData()
		}
	},
	methods:{
		initData(){
			this.inited = true
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
			productApi.getList(this.requestParams).then(res=>{
				this.list = res.data.list
				this.dataTotal = res.data.total
				this.loading = false
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
		openOrderInfo(id){
      this.$refs.orderInfo.open(id)
    },
    clear(){
    	this.list = []
    },
    del({ row,$index }){
    	if(row.is_submit){
    		this.$message.error('已提交的报告无法删除！')
    		return
    	}
			this.$confirm('确定删除？','提示',{
				type: 'warning'
			}).then(()=>{
				productApi.del(row.id).then(res=>{
					this.$message.success('删除成功')
					this.list.splice($index,1)
					this.$emit('del')
				})
			})
		},
	}
}
</script>