<!-- 
此组件初始化时不会自动加载数据，请在mounted中 this.$refs.[].initData()
如果放在dialog里面的吗，请在dialog的open事件中用this.$nextTick进行加载
 -->
<template>
	<div>
		<!-- 查询条件 -->
		<div style='margin-bottom: 2px' v-show='!hideQuery'>			
			<div style='float:right;margin-top: 1px'>
				<span><el-button type='primary' @click='query' size='mini'>查询</el-button></span>
				<span><el-button @click='resetQuery' size='mini'>重置</el-button ></span>
				<span><el-button @click='exportExcel' size='mini'>导出</el-button ></span>
        <el-tooltip content='显示更多查询条件' placement='top'>
          <el-button @click='queryShowMore=!queryShowMore' size='mini'>
          <i :class="{'el-icon-arrow-up':queryShowMore,'el-icon-arrow-down':!queryShowMore}"></i>
          </el-button>
        </el-tooltip>
			</div>
			<el-form ref='formQuery' :model='queryParams' class='c-form-condensed' label-width='68px' inline size='mini'>
				<el-form-item label='项目名称' prop='project_name'>
					<el-input v-model='queryParams.project_name' clearable></el-input>
				</el-form-item>
				<el-form-item label='开票号' prop='invoice_no'>
					<el-input v-model='queryParams.invoice_no' clearable></el-input>
				</el-form-item>
				<span v-show='queryShowMore'>
					<el-form-item prop='project_no' label='项目编号'>
						<el-input v-model='queryParams.project_no' placeholder='项目编号' clearable></el-input>
					</el-form-item>
					<el-form-item label='开票单位' prop='invoice_company_name'>
						<el-input v-model='queryParams.invoice_company_name' clearable></el-input>
					</el-form-item>
					<el-form-item label='开票备注' prop='remarks'>
						<el-input v-model='queryParams.remarks' clearable></el-input>
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
					<el-form-item label='开票日期'>
						<el-row style='width:300px'>
							<el-col :span="11">
								<el-form-item prop='invoice_date_begin'>
					      	<el-date-picker v-model='queryParams.invoice_date_begin' placeholder='开始日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
					    	</el-form-item>
					    </el-col>
					    <el-col :span="2">至</el-col>
					    <el-col :span="11">
					    	<el-form-item prop='invoice_date_end'>
					    		<el-date-picker v-model='queryParams.invoice_date_end' placeholder='结束日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
					      </el-form-item>
					    </el-col>
				  	</el-row>
					</el-form-item>
				</span>
			</el-form>
		</div> 
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
			show-summary
			:summary-method='getSummaryData'
			@sort-change='sortChange'>			
			<el-table-column prop='invoice_no' fixed label='开票号' width='120'></el-table-column>
			<el-table-column 
				prop='invoice_company_name' min-width='100' label='开票单位' show-overflow-tooltip />
			<el-table-column prop='invoice_date' label='开票日期' sortable='custom' width='110' />
			<el-table-column prop='invoice_price' label='开票金额' width='120' align='right'>
				<template slot-scope='{row}'>
					<span>￥{{ row.invoice_price }}</span>
				</template>
			</el-table-column>
			<el-table-column prop='remarks' label='开票备注' width='120' show-overflow-tooltip />
			<el-table-column prop='project_no' label='项目编号' width='100'>
				<template slot-scope='{row}'>
					<span @click='openProjectDetails(row.project_id)' class='c-link'>{{ row.project_no }}</span>
				</template>
			</el-table-column>
			<el-table-column 
				prop='project_name' min-width='120' label='项目名称' show-overflow-tooltip />
				<el-table-column 
				prop='contract_no' min-width='120' label='合同编号' show-overflow-tooltip>
					<template slot-scope='{row}'>
						<span class='c-link' @click='$refs.contractInfo.open(row.contract_id)'>{{row.contract_no}}</span>
					</template>
				</el-table-column>
			<el-table-column 
				prop='project_customer' label='客户名称' min-width='120' show-overflow-tooltip />
			<el-table-column 
				prop='company_name' min-width='100' label='业绩公司' show-overflow-tooltip />
				<el-table-column 
				prop='salesman' min-width='80' label='业务员' show-overflow-tooltip />
		
			<el-table-column prop='update_user_name' label='录入员'></el-table-column>
			<el-table-column prop='create_time' width='140' label='创建时间' sortable='custom'>
				<template slot-scope='{ row }'>
					<span>{{ row.create_time | formatDate }}</span>
				</template>
			</el-table-column>
			<el-table-column prop='update_time' label='最近更新时间' width='140' sortable='custom'>
				<template slot-scope='{row}'>
					<span>{{ row.update_time | formatDate }}</span>
				</template>
			</el-table-column>
			<!-- slot[column] -->
			<slot name='column'></slot>
			<!--/ slot[column]-->
		</el-table>
		<!-- 数据表格 -->
		<!-- 分页 -->
		<el-pagination style='margin-top: 10px'
			v-if='!noPage'
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
	  <contract-info :in-dialog='inDialog' ref='contractInfo' />
	</div>
</template>
<script>
import invoiceRecordApi from '@/api/cw/invoiceRecord'
import contractInfo from '@/components/yyzx/contract/info'
// import projectDetails from '@/components/projectDetails'

export default {
	// name:'invoiceList',
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
		hideQuery:{
			type:Boolean,
			default:false
		},
		noPage:{
			type:Boolean,
			default:false
		},
		init:{
			type:Boolean,
			default:false
		},
		showMore:{
			type:Boolean,
			default:false
		}
	},
	data(){
		return {
			inited:false,
			loading: false,
			dialogShow:false,
			list:[],
			dataTotal:0,
			formLoading:false,
			projectList:[],
			summaryData:{},
			queryShowMore:this.showMore,
			//查询条件字段
			queryParams:{
				project_no:'',//项目编号
				project_name:'',//项目名称
				invoice_no:'',//开票号
				remarks:'',
				invoice_company_name:'',//开票号
				contract_no:'',//合同编号
				customer_name:'',//客户单位				
				company_name:'',//业绩公司
				salesman:'',//业务员
				invoice_date_begin:'',
				invoice_date_end:''
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
		this.$options.components.projectDetails = ()=>import('@/components/projectDetails')
		//this.getData()
	},
	mounted(){
    if(this.init){
      this.inited = true
      this.initData()
    }    
  },
	methods:{
		//初始化数据
		initData(){
			this.resetQuery()
		},
		//刷新数据
		reload(){
			this.getData()
		},
		//分页容量大小发生变化时
		sizeChange(value){
			this.requestParams.pageSize=value
			this.getData()
		},
		getSummaryData({columns,data}){
      let sum = []
      columns.forEach((column,i)=>{
        if(i==0){
          sum[i]='合计'
        }else{
          sum[i] = this.summaryData[column.property]
        }       
      })
      return sum
    },
		//获取数据
		getData() {
			this.loading=true
			invoiceRecordApi.getList(this.requestParams).then(res=>{
				this.list = res.data.list
				this.dataTotal = res.data.total
				this.summaryData = res.data.summary
				this.loading = false
				this.$emit('loaded',{ 
					total:this.dataTotal,
					list:this.list,
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
		test({columns,data}){
			console.log(columns,data)
			return [0,0,0]
		},
		//导出excel
		exportExcel(){
			invoiceRecordApi.exportExcel(this.requestParams)
		},
		clear(){
			this.list = []
		}
	}
}
</script>