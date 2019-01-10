<!-- 
此组件初始化时不会自动加载数据，请在mounted中 this.$refs.[].initData() 初始化数据
如果放在dialog里面的吗，请在dialog的open事件中用this.$nextTick进行初始化数据
 -->
<template>
	<div>
		<!-- 查询条件 -->
		<div style='margin-bottom: 3px'>
			 <div style='float:right;margin-top: 3px'>
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
					<!-- <el-form-item prop='toInvoice'>
						<el-tooltip content='只显示待开票项目（开票金额小于项目金额）'>
							<el-checkbox 
								v-model="queryParams.toInvoice" 
								label="待开票" 
								border
								:true-label='1'
								:false-label='0'
								@change='query({key:"toInvoice"})'
								>
							</el-checkbox>
						</el-tooltip>
					</el-form-item> -->
					<el-form-item prop='hasDelivery'>
						<el-tooltip content='只显示有发货项目（发货面积大于0）'>
							<el-checkbox 
								v-model="queryParams.hasDelivery" 
								label="有发货" 
								border
								:true-label='1'
								:false-label='0'
								@change='query({key:"hasDelivery"})'
								>
							</el-checkbox>
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
			<el-table-column prop='settlement_price_total' label='项目结算金额' min-width='120' align='right'>
				<template slot-scope='scope'>
					<span>￥{{ scope.row.settlement_price_total }}</span>
				</template>
			</el-table-column>
			<el-table-column 
				prop='invoice_price_total' label='已开票金额' width='120' align='right' sortable='custom'>
				<template slot-scope='scope'>
					<span>￥{{ scope.row.invoice_price_total }}</span>
				</template>
			</el-table-column>
			<el-table-column prop='invoice_record_total' align='center' label='开票记录'>
				<template slot-scope='{row}'>
					<span class='c-link' @click='openInvoiceRecord(row.project_id)'>{{ row.invoice_record_total }}</span>
				</template>
			</el-table-column>
			<el-table-column 
				prop='no_invoice_price' label='未开票金额' width='120' align='right' sortable='custom'>
				<template slot-scope='{ row }'>
					<span>￥{{ row.no_invoice_price }}</span>
				</template>
			</el-table-column>
			<el-table-column label='项目开票率' min-width='120' align='center'>
				<template slot-scope='{ row }'>
					<el-progress 
						text-inside :stroke-width='16' 
						:status='$commonJs.getProgressPercentage(row.invoice_price_total/row.settlement_price_total)>=100?"success":""' 
						:percentage="$commonJs.getProgressPercentage(row.invoice_price_total/row.settlement_price_total)"/>
				</template>
			</el-table-column>
			<el-table-column 
				prop='last_invoice_date' label='最近开票日期' width='130' sortable='custom'/>
				<el-table-column 
				prop='settlement_area_total' label='项目结算面积' width='120' align='right' sortable='custom'>
				<template slot-scope='scope'>
					<span>{{ scope.row.settlement_area_total }}㎡</span>
				</template>
			</el-table-column>
			<el-table-column 
				prop='delivery_area_total' label='已发货面积' width='120' align='right' sortable='custom'>
				<template slot-scope='{ row }'>
					<span>{{ row.delivery_area_total }}㎡</span>
				</template>
			</el-table-column>
			<el-table-column label='发货进度' min-width='120' align='center'>
				<template slot-scope='{ row }'>
					<el-progress 
						text-inside :stroke-width='16' 
						:status='$commonJs.getProgressPercentage(row.delivery_area_total/row.settlement_area_total)>=100?"success":""' 
						:percentage="$commonJs.getProgressPercentage(row.delivery_area_total/row.settlement_area_total)"/>
				</template>
			</el-table-column>
			
			<el-table-column prop='contract_no' label='合同编号' width='120' show-overflow-tooltip >
				<template slot-scope='{row}'>
					<span class='c-link' @click='$refs.contractInfo.open(row.contract_id)'>{{ row.contract_no }}</span>
				</template>
			</el-table-column>
			<el-table-column prop='project_customer' label='客户名称' width='110' show-overflow-tooltip />
			<el-table-column prop='company_name' label='业绩公司' width='110' show-overflow-tooltip />
			<el-table-column prop='salesman' label='业务员' width='80' show-overflow-tooltip />
			<el-table-column prop='place' label='项目地点' width='80' show-overflow-tooltip />			
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
	  <contract-info :in-dialog='inDialog' ref='contractInfo' />
	  <project-details :in-dialog='inDialog' ref='projectDetails' />
	  <invoice-record-dialog :in-dialog='inDialog' ref='invoiceRecordDialog' />
	  <receive-payment-record-dialog :in-dialog='inDialog' ref='receivePaymentRecordDialog' />
	</div>
</template>
<script>
import invoiceRecordApi from '@/api/cw/invoiceRecord'
import projectDetails from '@/components/projectDetails'
import invoiceRecordDialog from '@/components/cw/invoiceRecord/dialog'
import receivePaymentRecordDialog from '@/components/cw/receivePaymentRecord/dialog'
import contractInfo from '@/components/yyzx/contract/info'

export default {
	components:{ projectDetails, invoiceRecordDialog, receivePaymentRecordDialog, contractInfo },
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
				toInvoice:0,
				hasDelivery:0
			},
			//数据请求的参数
			requestParams:{
				pageSize:10,//分页大小
				currentPage:1,//当前页
				sortProp:'',
				sortOrder:''
			},
			invoiceParams:{
				project_id:null
			}
		}
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
			invoiceRecordApi.getSummaryListByProject(this.requestParams).then(res=>{
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
		openInvoiceRecord(project_id){
			this.$refs.invoiceRecordDialog.open( { project_id })
		},
		openReceivePaymentRecord(project_id){
			this.$refs.receivePaymentRecordDialog.open( { project_id })
		},
		exportExcel(){
			cwSummaryApi.exportExcelProjectSummary(this.requestParams)
		}
	}
}
</script>