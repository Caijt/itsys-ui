<!-- 
此组件初始化时不会自动加载数据，请在mounted中 this.$refs.[].initData() 初始化数据
如果放在dialog里面的吗，请在dialog的open事件中用this.$nextTick进行初始化数据
 -->
<template>
	<div>
		<!-- 查询条件 -->
		<div style='margin-bottom:3px '>
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
				<el-form-item label='项目编号' prop='project_no'>
					<el-input v-model='queryParams.project_no' clearable></el-input>
				</el-form-item>
				<el-form-item label='项目名称' prop='project_name'>
					<el-input v-model='queryParams.project_name' clearable></el-input>
				</el-form-item>
				<el-form-item prop='isXsNew'>
					<el-tooltip content='新项目'>
						<el-checkbox 
							v-model="queryParams.isXsNew" 
							label="新项目" 
							border
							:true-label='1'
							:false-label='0'
							@change='query({key:"isXsNew"})'
							>
						</el-checkbox>
					</el-tooltip>
				</el-form-item>
				<!-- 更多条件 -->
				<template v-if='queryShowMore'>
					<el-form-item label='合同编号' prop='contract_no'>
						<el-input v-model='queryParams.contract_no' clearable></el-input>
					</el-form-item>
					<el-form-item label='客户名称' prop='customer_name'>
						<el-input v-model='queryParams.customer_name' clearable></el-input>
					</el-form-item>
					<el-form-item label='客户类别' prop='customer_type'>
						<el-input v-model='queryParams.customer_type' clearable></el-input>
					</el-form-item>
					<el-form-item label='开发商' prop='dev'>
						<el-input v-model='queryParams.dev' clearable></el-input>
					</el-form-item>
					<el-form-item label='业绩公司' prop='company_name'>
						<el-input v-model='queryParams.company_name' clearable></el-input>
					</el-form-item>
					<el-form-item label='业务员' prop='salesman'>
						<el-input v-model='queryParams.salesman' clearable></el-input>
					</el-form-item>
					<el-form-item label='项目地点' prop='place'>
						<el-input v-model='queryParams.place' clearable></el-input>
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
			<el-table-column prop='project_no' label='项目编号'  fixed width='100'></el-table-column>
			<el-table-column prop='project_name' label='项目名称' show-overflow-tooltip min-width='150'></el-table-column>
			<el-table-column prop='saleplan_order_content' label='下单描述' show-overflow-tooltip min-width='150'></el-table-column>
			<el-table-column prop='saleplan_delivery_plan' label='交货计划' show-overflow-tooltip min-width='150'></el-table-column>
			<el-table-column prop='saleplan_return_plan' label='回款计划' show-overflow-tooltip min-width='150'></el-table-column>
			<el-table-column prop='xs_update_time' label='报告更新时间' width='135' sortable='custom'>
				<template slot-scope='{ row }'>
					<span>{{row.xs_update_time?$moment(row.xs_update_time).format('YYYY-MM-DD HH:mm'):"（未填写）"}}</span>
				</template>
			</el-table-column>
			<el-table-column prop='contract_no' label='合同编号' width='100' show-overflow-tooltip>
				<template slot-scope='{row}'>
					<span class='c-link' @click='$refs.contractInfo.open(row.contract_id)'>{{ row.contract_no}}</span>
				</template>
			</el-table-column>
			<el-table-column prop='contract_price' label='合同金额' width='120' align='right' sortable='custom'>
				<template slot-scope='{row}'>
					￥{{ row.contract_price }}
				</template>
			</el-table-column>
			<el-table-column prop='contract_area' label='合同面积' width='110' align='right' show-overflow-tooltip>
				<template slot-scope='{row}'>
					{{ row.contract_area }}㎡
				</template>
			</el-table-column>
			<el-table-column prop='project_price' label='项目金额' width='120' align='right' sortable='custom'>
				<template slot-scope='{row}'>
					￥{{ row.project_price }}
				</template>
			</el-table-column>
			<el-table-column prop='project_area' label='项目面积' width='110' align='right' show-overflow-tooltip>
				<template slot-scope='{row}'>
					{{ row.project_area }}㎡
				</template>
			</el-table-column>
			<el-table-column prop='xd_first_order_date' label='下单日期' width='110' sortable='custom'/>
			<el-table-column prop='xd_order_area_total' label='已下单面积' width='110' align='right'>
				<template slot-scope='{row}'>
					{{ row.xd_order_area_total }}㎡
				</template>
			</el-table-column>
			<el-table-column prop='xd_order_amount_total' label='已下单数量' width='110'  align='right'>
			</el-table-column>
			<el-table-column prop='xd_order_total' label='订单数量' align='center'>
				<template slot-scope='{row}'>
					<span class='c-link' @click='openOrderListDialog(row.project_id)'>{{ row.xd_order_total }}</span>
				</template>
			</el-table-column>
			
			<el-table-column label='下单进度' width='120' align='center'>
				<template slot-scope='{ row }'>						
					<el-tooltip placement='left' :content='(row.xd_order_area_total||0)+"㎡（下单面积） / "+(row.project_area||0)+"㎡（合同面积）"'>
						<el-progress text-inside :stroke-width='16' :status='$commonJs.getProgressPercentage(row.xd_order_area_total/row.project_area)>=100?"success":""' :percentage="$commonJs.getProgressPercentage(row.xd_order_area_total/row.project_area)"></el-progress>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop='sc_finish_area_total' label='已生产面积' width='110' align='right'>
				<template slot-scope='{row}'>
					{{ row.sc_finish_area_total }}㎡
				</template>
			</el-table-column>
			<el-table-column label='生产进度' width='120' align='center'>
				<template slot-scope='{ row }'>						
					<el-tooltip placement='left' :content='row.sc_finish_area_total+"㎡（生产面积） / "+row.xd_order_area_total+"㎡（下单面积）"'>
						<el-progress 
							text-inside 
							:stroke-width='16' 
							:status='$commonJs.getProgressPercentage(row.sc_finish_area_total/row.xd_order_area_total)>=100?"success":""' 
							:percentage="$commonJs.getProgressPercentage(row.sc_finish_area_total/row.xd_order_area_total)"></el-progress>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop='cy_first_storage_date' label='入库日期' width='110' sortable='custom'/>
			<el-table-column prop='cy_storage_area_total' label='已入库面积' width='110' align='right'>
				<template slot-scope='{row}'>
					{{ row.cy_storage_area_total }}㎡
				</template>
			</el-table-column>
			<el-table-column label='入库进度' width='120' align='center'>
				<template slot-scope='{ row }'>						
					<el-tooltip 
						placement='left' 
						:content='row.cy_storage_area_total+"㎡（入库面积） / "+row.sc_finish_area_total+"㎡（生产面积）"'>
						<el-progress 
							text-inside 
							:stroke-width='16' 
							:status='$commonJs.getProgressPercentage(row.cy_storage_area_total/row.sc_finish_area_total)>=100?"success":""' 
							:percentage="$commonJs.getProgressPercentage(row.cy_storage_area_total/row.sc_finish_area_total)"></el-progress>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop='cy_first_delivery_date' label='发货日期' width='110' sortable='custom'/>
			<el-table-column prop='cy_delivery_area_total' label='已发货面积' width='110' align='right'>
				<template slot-scope='{row}'>
					{{ row.cy_delivery_area_total }}㎡
				</template>
			</el-table-column>
			<el-table-column label='发货进度' width='120' align='center'>
				<template slot-scope='{ row }'>						
					<el-tooltip 
						placement='left' 
						:content='row.cy_delivery_area_total+"㎡（发货面积） / "+row.cy_storage_area_total+"㎡（成品库存面积）"'>
						<el-progress 
							text-inside 
							:stroke-width='16' 
							:status='$commonJs.getProgressPercentage(row.cy_delivery_area_total/row.cy_storage_area_total)>=100?"success":""' 
							:percentage="$commonJs.getProgressPercentage(row.cy_delivery_area_total/row.cy_storage_area_total)"></el-progress>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop='cw_first_invoice_date' label='开票日期' width='110' sortable='custom'/>
			<el-table-column prop='cw_invoice_price_total' label='已开票金额' width='120' align='right'>
				<template slot-scope='{row}'>
					￥{{ row.cw_invoice_price_total }}
				</template>
			</el-table-column>
			<el-table-column prop='cw_invoice_record_total' label='开票记录' width='80' align='center'>
				<template slot-scope='{row}'>
					<span class='c-link' @click='openInvoiceListDialog(row.project_id)'>{{ row.cw_invoice_record_total }}</span>
				</template>
			</el-table-column>
			<el-table-column prop='cw_first_payment_date' label='回款日期' width='110' sortable='custom'/>
			<el-table-column prop='cw_payment_price_total' label='已回款金额' width='120' align='right'>
				<template slot-scope='{row}'>
					￥{{ row.cw_payment_price_total }}
				</template>
			</el-table-column>
			<el-table-column prop='cw_payment_record_total' label='回款记录' width='80' align='center'>
				<template slot-scope='{row}'>
					<span class='c-link' @click='openPaymentListDialog(row.project_id)'>{{ row.cw_payment_record_total }}</span>
				</template>
			</el-table-column>
			<el-table-column label='回款进度' width='120' align='center'>
				<template slot-scope='{ row }'>						
					<el-tooltip placement='left' :content='"￥"+row.cw_payment_price_total+"（回款金额） / ￥"+row.cw_invoice_price_total+"（开票金额）"'>
						<el-progress 
							text-inside 
							:stroke-width='16' 
							:status='$commonJs.getProgressPercentage(row.cw_payment_price_total/row.cw_invoice_price_total)>=100?"success":""' 
							:percentage="$commonJs.getProgressPercentage(row.cw_payment_price_total/row.cw_invoice_price_total)"></el-progress>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop='company_name' label='业绩公司'  show-overflow-tooltip></el-table-column>
			<el-table-column prop='salesman' label='业务员' width='80'></el-table-column>
			<el-table-column prop='dev' label='开发商' width='80'></el-table-column>
			<el-table-column prop='customer_name' label='客户名称' show-overflow-tooltip></el-table-column>
			<el-table-column prop='customer_type' label='客户类别'></el-table-column>
			<el-table-column prop='place' label='项目地点' width='80'></el-table-column>
			<el-table-column prop='create_time' label='项目创建时间' width='135' sortable='custom'>
				<template slot-scope='{ row }'>
					<span>{{ $moment(row.create_time).format('YYYY-MM-DD HH:mm') }}</span>
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
	  <project-details ref='projectDetails' :in-dialog='inDialog'></project-details>
		<contract-info ref='contractInfo' :in-dialog='inDialog'></contract-info>
	</div>
</template>
<script>
import projectApi from '@/api/xs/report'
import projectDetails from '@/components/projectDetails'
import contractInfo from '@/components/yyzx/contract/info'

export default {
	components:{ 
		projectDetails,
		contractInfo
	},
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
		},
		showMore:{
			type:Boolean,
			default:false
		}
	},
	data(){
		return {
			loading:false,
			summaryLoading:true,
			dialogShow:false,
			queryShowMore:this.showMore,
			list:[],
			dataTotal:0,
			updateTotal:0,
			problemTotal:0,
			totalOrderArea:0,
			totalRecord:0,
			totalOrderAmount:0,
			//查询参数
			queryParams:{
				project_name:'',
				project_no:'',
				contract_no:'',
				customer_name:'',
				customer_type:'',
				company_name:'',
				place:'',
				dev:'',
				salesman:''

			},
			//请求参数
			requestParams:{
				pageSize:10,//分页大小
				currentPage:1,//当前页
				sortProp:'',
				sortOrder:''
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
			this.loading = true
			projectApi.getSummaryList( this.requestParams ).then(res=>{
				this.list=res.data.list
				this.dataTotal = res.data.total
				this.updateTotal = res.data.updateTotal
				this.problemTotal = res.data.problemTotal
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
		exportExcel(){
			projectApi.exportProgressExcel(this.requestParams)
		},
		openOrderListDialog(projectId){
			this.$refs.orderListDialog.open({project_id:projectId})
		},
		openInvoiceListDialog(projectId){
			this.$refs.invoiceListDialog.open({project_id:projectId})
		},
		openPaymentListDialog(projectId){
			this.$refs.paymentListDialog.open({project_id:projectId})
		}
	}
}
</script>