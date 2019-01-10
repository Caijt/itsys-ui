<!-- 
此组件初始化时不会自动加载数据，请在 mounted 中 this.$refs.[].initData() 初始化
如果放在 dialog 里面的话，必须得在 dialog 的 open 事件中用 this.$nextTick 初始化
 -->
<template>
	<div>
		<!-- 查询条件 -->
		<el-row style='margin:3px 0px' v-show='!hideQuery'>
			<div style='float:right'>
				<span><el-button type='primary' @click='query' size='mini'>查询</el-button></span>
				<span><el-button @click='resetQuery' size='mini'>重置</el-button ></span>
				<span><el-button @click='queryShowMore=!queryShowMore' size='mini' icon="">
					{{queryShowMore?"收起":"更多"}}
					<i :class="{'el-icon-arrow-up':queryShowMore,'el-icon-arrow-down':!queryShowMore}"></i>
				</el-button></span>
			</div>
			<div >
				<el-form ref='formQuery' :model='queryParams' class='c-form-small' label-width='68px' inline size='mini'>
					<el-form-item prop='project_no' label='项目编号'>
						<el-input v-model.trim='queryParams.project_no' placeholder='项目编号' clearable></el-input>
					</el-form-item>
					<el-form-item label='项目名称' prop='project_name'>
						<el-input v-model.trim='queryParams.project_name' clearable></el-input>
					</el-form-item>
					<el-form-item label='回款编号' prop='payment_no'>
						<el-input v-model.trim='queryParams.payment_no' clearable></el-input>
					</el-form-item>
					<template v-if='queryShowMore'>
						<el-form-item label='收款单位' prop='receive_company_name'>
							<el-input v-model.trim='queryParams.receive_company_name' clearable></el-input>
						</el-form-item>
						<el-form-item label='回款形式' prop='payment_method'>
							<el-input v-model.trim='queryParams.payment_method' clearable></el-input>
						</el-form-item>
						<el-form-item label='合同编号' prop='contract_no'>
							<el-input v-model.trim='queryParams.contract_no' clearable></el-input>
						</el-form-item>
						<el-form-item label='回款客户' prop='customer_name'>
							<el-input v-model.trim='queryParams.customer_name' clearable></el-input>
						</el-form-item>
						<el-form-item label='业绩公司' prop='company_name'>
							<el-input v-model.trim='queryParams.company_name' clearable></el-input>
						</el-form-item>
						<el-form-item label='业务员' prop='salesman'>
							<el-input v-model.trim='queryParams.salesman' clearable></el-input>
						</el-form-item>
						<el-form-item label='回款日期'>
							<el-row style='width:300px'>
								<el-col :span="11">
									<el-form-item prop='payment_date_begin'>
						      	<el-date-picker v-model='queryParams.payment_date_begin' placeholder='开始日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
						    	</el-form-item>
						    </el-col>
						    <el-col :span="2">至</el-col>
						    <el-col :span="11">
						    	<el-form-item prop='payment_date_end'>
						    		<el-date-picker v-model='queryParams.payment_date_end' placeholder='结束日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
						      </el-form-item>
						    </el-col>
					  	</el-row>
						</el-form-item>
					</template>
				</el-form>
			</div>
			
		</el-row>
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
			<el-table-column prop='no' fixed label='回款编号' width='120'></el-table-column>
			<el-table-column prop='customer_name' label='回款客户' width='120' show-overflow-tooltip></el-table-column>
			<el-table-column prop='receive_company_name' label='收款单位' show-overflow-tooltip></el-table-column>
			<el-table-column prop='payment_date' label='回款日期' align='center' width='110'></el-table-column>
			<el-table-column prop='payment_price' label='回款金额' width='120' align='right'>
				<template slot-scope='scope'>
					<span>￥{{ scope.row.payment_price }}</span>
				</template>
			</el-table-column>
			<el-table-column prop='payment_method' label='回款形式' show-overflow-tooltip></el-table-column>
			<el-table-column prop='remarks' label='备注' show-overflow-tooltip></el-table-column>
			<el-table-column prop='project_no' label='项目编号' width='100'>
				<template slot-scope='{row}'>
					<span @click='openProjectDetails(row.project_id)' class='c-link'>{{ row.project_no }}</span>
				</template>
			</el-table-column>
			<el-table-column prop='project_name' label='项目名称' width='120' show-overflow-tooltip></el-table-column>
			<el-table-column prop='contract_no' label='合同编号' width='120' show-overflow-tooltip></el-table-column>
			<el-table-column prop='company_name' label='业绩公司' width='120' show-overflow-tooltip></el-table-column>
			<el-table-column prop='salesman' label='业务员' width='120' show-overflow-tooltip></el-table-column>
			
			<el-table-column prop='update_user_name' label='录入员' width='80'></el-table-column>
			<el-table-column 
				prop='create_time' 
				label='创建时间' 			
				width='140' 
				sortable='custom'>
				<template slot-scope='{row}'>
					<span>{{ row.create_time | formatDate}}</span>
				</template>
			</el-table-column>
			<el-table-column prop='update_time' label='最新更新时间' width='140' sortable='custom'>
				<template slot-scope='{row}'>
					<span>{{ row.update_time | formatDate}}</span>
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
	</div>
</template>
<script>
import receivePaymentRecordApi from '@/api/cw/receivePaymentRecord'

export default {
	components:{  },
	props:{
		size:{
			type:String,
			default:''
		},
		maxHeight:{
			default:450
		},
		params:{
			default:()=>({})
		},
		inDialog:{
			type:Boolean,
			default:false
		},
		showMore:{
			type:Boolean,
			default:false
		},
		hideQuery:{
			type:Boolean,
			default:false
		}
	},
	data(){
		return {
			loading: false,
			dialogShow:false,
			list:[],
			dataTotal:0,
			formLoading:false,
			projectList:[],
			queryShowMore:this.showMore,
			//查询条件字段
			queryParams:{
				payment_no:'',//回款编号
				project_no:'',//项目编号
				project_name:'',//项目名称
				contract_no:'',//合同编号
				customer_name:'',//客户单位				
				company_name:'',//业绩公司
				receive_company_name:'',//收款单位
				salesman:'',//业务员
				payment_method:'',//回款形式
				payment_date_begin:'',//回款日期开始
				payment_date_end:''//回款日期结束
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
		//获取数据
		getData() {
			this.loading=true
			receivePaymentRecordApi.getList(this.requestParams).then(res=>{
				this.list = res.data.list
				this.dataTotal = res.data.total
				this.loading = false
				this.$emit('loaded',{ 
					total:this.dataTotal,
					list:this.list,
					params:{...this.queryParams} 
				})
			})
		},
		//查询方法（有key值时，只针对查询条件对应key的value进行传参，没有时就全部查询条件传参）
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
			receivePaymentRecordApi.exportExcel(this.requestParams)
		},
		clear(){
			this.list = []
		}
	}
}
</script>