<!-- 
此组件初始化时不会自动加载数据，请在mounted中 this.$refs.[].initData() 初始化数据
如果放在dialog里面的吗，请在dialog的open事件中用this.$nextTick进行初始化数据
 -->
<template>
	<div>
		<!-- 查询条件 -->
		<div style='margin-bottom: 3px'>
			<div style='float:right'>
				<span><el-button type='primary' @click='query' size='mini'>查询</el-button></span>
				<span><el-button @click='resetQuery' size='mini'>重置</el-button ></span>
				<span><el-button @click='queryShowMore=!queryShowMore' size='mini' icon="">
					{{queryShowMore?"收起":"更多"}}
					<i :class="{'el-icon-arrow-up':queryShowMore,'el-icon-arrow-down':!queryShowMore}"></i>
				</el-button></span>
			</div>
			<el-form ref='formQuery' :model='queryParams' label-width='68px' 
				class='c-form-condensed' inline size='mini'>
				<el-form-item label='项目名称' prop='project_name'>
					<el-input v-model='queryParams.project_name' clearable></el-input>
				</el-form-item>
				<el-form-item label='客户单位' prop='customer_name'>
					<el-input v-model='queryParams.customer_name' clearable></el-input>
				</el-form-item>
				<el-form-item prop='toOrder'>
					<el-tooltip content='只显示待下单项目（下单面积小于合同面积）'>
						<el-badge>
							<el-checkbox 
								v-model="queryParams.toOrder" 
								label="待下单" 
								border
								:true-label='1'
								:false-label='0'
								@change='query({key:"toOrder"})'
								>
							</el-checkbox>
						</el-badge>
					</el-tooltip>
				</el-form-item>
				<el-form-item prop='hasOrder'>
					<el-tooltip content='只显示有下过单项目'>
						<el-badge>
							<el-checkbox 
								v-model="queryParams.hasOrder" 
								label="有下单" 
								border
								:true-label='1'
								:false-label='0'
								@change='query({key:"hasOrder"})'
								>
							</el-checkbox>
						</el-badge>
					</el-tooltip>
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
			<el-table-column prop='project_no' label='项目编号' fixed width='100' >
				<template slot-scope='{row}'>
					<span class='c-link' @click='openProjectDetails(row.project_id)'>{{ row.project_no }}</span>
				</template>
			</el-table-column>
			<el-table-column prop='project_name' label='项目名称' width='120' show-overflow-tooltip />
			<el-table-column prop='contract_no' label='合同编号' width='120' show-overflow-tooltip />
			<el-table-column prop='contract_area' label='项目合同面积' min-width='120' align='right'>
				<template slot-scope='scope'>
					<span>{{ scope.row.contract_area }}㎡</span>
				</template>
			</el-table-column>
			<el-table-column prop='order_area_total' sortable='custom' label='已下单面积' min-width='120' align='right'>
				<template slot-scope='scope'>
					<span>{{ scope.row.order_area_total }}㎡</span>
				</template>
			</el-table-column>
			<el-table-column prop='order_area_total' label='下单记录' min-width='80' align='center'>
				<template slot-scope='{ row }'>
					<span class='c-link' @click='openOrderDialog(row.project_id)'>{{ row.order_total }}</span>
				</template>
			</el-table-column>
			<el-table-column prop='no_order_area' sortable='custom' label='未下单面积' min-width='120' align='right'>
				<template slot-scope='scope'>
					<span>{{ scope.row.no_order_area }}㎡</span>
				</template>
			</el-table-column>
			<el-table-column label='下单进度' min-width='120' align='center'>
				<template slot-scope='{row}'>
					<el-progress 
						text-inside :stroke-width='16' 
						:status='$commonJs.getProgressPercentage(row.order_area_total/row.contract_area)>=100?"success":""' 
						:percentage="$commonJs.getProgressPercentage(row.order_area_total/row.contract_area)"/>
				</template>
			</el-table-column>
			<el-table-column 
				prop='last_order_date' label='最近下单日期' width='130'	sortable='custom'/>
			
			<el-table-column prop='customer_name' label='客户名称' width='110' show-overflow-tooltip />
			<el-table-column prop='company_name' label='业绩公司' width='110' show-overflow-tooltip />
			<el-table-column prop='salesman' label='业务员' width='80' show-overflow-tooltip />
			<el-table-column prop='area' label='项目地点' width='80' show-overflow-tooltip />
			
			<el-table-column prop='project_create_time' label='项目创建时间' width='140' sortable='custom'>
				<template slot-scope='{row}'>
					<span>{{ row.project_create_time | formatDate }}</span>
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
	  <order-dialog :in-dialog='inDialog' ref='orderDialog'></order-dialog>
	</div>
</template>
<script>
import orderApi from '@/api/yyzx/order'
import projectDetails from '@/components/projectDetails'
import orderDialog from '@/components/yyzx/order/listDialog'

export default {
	components:{ projectDetails, orderDialog },
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
		}
	},
	data(){
		return {
			inited:false,
			loading: true,
			list:[],
			dataTotal:0,
			queryShowMore:false,
			//查询条件字段
			queryParams:{
				project_name:'',//项目名称
				customer_name:'',//客户单位
				project_no:'',//项目编号
				contract_no:'',//合同编号
				company_name:'',//业绩公司
				salesman:'',//业务员
				toOrder:0,//待下单
				hasOrder:0//有下单
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
		//this.getData()
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
			orderApi.getProjectSummaryList(this.requestParams).then(res=>{
				this.list = res.data.list
				this.dataTotal = res.data.total
				this.loading = false
				this.inited = true
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
		openOrderDialog(project_id){
			this.$refs.orderDialog.open( { project_id })
		}
	}
}
</script>