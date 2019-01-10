<!-- 
此组件初始化时不会自动加载数据，请在mounted中 this.$refs.[].initData() 初始化数据
如果放在dialog里面的吗，请在dialog的open事件中用this.$nextTick进行初始化数据
 -->
<template>
	<div>
		<!-- 查询条件 -->
		<div style='margin-bottom:2px '>
			<div style='float:right;'>
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
				<!-- <el-form-item prop='hasProblem'>
					<el-tooltip content='反馈问题待处理的项目'>
						<el-badge :value='problemTotal'>
							<el-checkbox 
								v-model="queryParams.hasProblem" 
								label="待处理" 
								border
								:true-label='1'
								:false-label='0'
								@change='query({key:"hasProblem"})'></el-checkbox>
							</el-badge>
						</el-tooltip>					
					</el-form-item> -->
					<el-form-item prop='hasUpdate'>
						<el-tooltip content='信息有更新的项目'>
							<el-badge :value='updateTotal'>
								<el-checkbox 
									v-model="queryParams.hasUpdate" 
									label="有更新" 
									border
									:true-label='1'
									:false-label='0'
									@change='query({key:"hasUpdate"})'></el-checkbox>
							</el-badge>
						</el-tooltip>
					</el-form-item>
				<!-- 更多条件 -->
				<template v-if='queryShowMore'>
					<el-form-item label='合同编号' prop='contract_no'>
						<el-input v-model='queryParams.contract_no' clearable></el-input>
					</el-form-item>
					<el-form-item label='客户名称' prop='customer_name'>
						<el-autocomplete v-model='queryParams.customer_name'  :fetch-suggestions="getFieldList('customer_name')"></el-autocomplete>
					</el-form-item>
					<el-form-item label='客户类别' prop='customer_type'>
						<el-autocomplete v-model='queryParams.customer_type'  :fetch-suggestions="getFieldList('customer_type')"></el-autocomplete>
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
			<el-table-column prop='no' label='项目编号'  fixed width='100'></el-table-column>
			<el-table-column prop='name' label='项目名称' fixed show-overflow-tooltip min-width='130'></el-table-column>
			<el-table-column label='信息完善进度' width='120' align='center'>
				<template slot-scope='scope'>						
					<el-popover width='250' trigger="hover" placement='left' :disabled='!hasTodoStatus(scope)'>
						<span v-html='getTodoStatusText(scope)'></span>	
						<el-progress text-inside :stroke-width='16' slot='reference' :status='getProjectInfoPercentage(scope)>=100?"success":""' :percentage="getProjectInfoPercentage(scope)"></el-progress>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column prop='todoProblem' label='待处理问题' width='95' align='center'>
				<template slot-scope='{row}'>
					<el-tag type='danger' size='mini' v-if='row.todoProblem'>{{row.todoProblem}}</el-tag>
					<el-tag type='info'  size='mini' v-else>无</el-tag>
				</template>
			</el-table-column>
			<el-table-column label='信息更新' width='80' align='center'>
				<template slot-scope='scope'>
					<el-popover trigger="hover" width='250' v-if='hasUpdateStatus(scope)' placement='left'>
						<span v-html='getUpdateStatusText(scope)'></span>
						<el-tag size='mini' slot='reference'>有更新</el-tag>
					</el-popover>
					<span v-else><el-tag size='mini' type='info'>无</el-tag></span>
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
			<!-- <el-table-column prop='project_price' label='项目金额' width='120' align='right' sortable='custom'>
				<template slot-scope='{row}'>
					￥{{ row.project_price }}
				</template>
			</el-table-column>
			<el-table-column prop='project_area' label='项目面积' width='110' align='right' show-overflow-tooltip>
				<template slot-scope='{row}'>
					{{ row.project_area }}㎡
				</template>
			</el-table-column> -->
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
					<span class='c-link' @click='openOrderListDialog(row.id)'>{{ row.xd_order_total }}</span>
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
			<el-table-column prop='sc_self_product_record_total' label='车间日志' sortable='custom' align='center' width='100'>
				<template slot-scope='{ row }'>
					<span class='c-link' @click='$refs.productListDialog.open({project_id:row.id})'>{{ row.sc_self_product_record_total }}</span>
				</template>
			</el-table-column>
			<el-table-column prop='sc_out_product_record_total' label='外协日志' sortable='custom' align='center' width='100'>
				<template slot-scope='{ row }'>
					<span class='c-link' @click='$refs.outProductListDialog.open({project_id:row.id})'>{{ row.sc_out_product_record_total }}</span>
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
			<el-table-column prop='cy_storage_record_total' label='入库记录' sortable='custom' align='center' width='100'>
				<template slot-scope='{ row }'>
					<span class='c-link' @click='$refs.storageListDialog.open({project_id:row.id})'>{{ row.cy_storage_record_total }}</span>
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
			<el-table-column prop='cy_delivery_record_total' label='发货记录' sortable='custom' align='center' width='100'>
				<template slot-scope='{ row }'>
					<span class='c-link' @click='$refs.deliveryListDialog.open({project_id:row.id})'>{{ row.cy_delivery_record_total }}</span>
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
					<span class='c-link' @click='openInvoiceListDialog(row.id)'>{{ row.cw_invoice_record_total }}</span>
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
					<span class='c-link' @click='openPaymentListDialog(row.id)'>{{ row.cw_payment_record_total }}</span>
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
					<span>{{ $commonJs.formatDate(row.create_time) }}</span>
				</template>
			</el-table-column>
			<el-table-column prop='progress_update_time' label='进度更新时间' width='135' sortable='custom'>
				<template slot-scope='{ row }'>
					<span>{{ $commonJs.formatDate(row.progress_update_time) }}</span>
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
		<order-list-dialog ref='orderListDialog' :in-dialog='inDialog'></order-list-dialog>
		<invoice-list-dialog ref='invoiceListDialog' :in-dialog='inDialog'></invoice-list-dialog>
		<payment-list-dialog ref='paymentListDialog' :in-dialog='inDialog'></payment-list-dialog>
		<contract-info ref='contractInfo' :in-dialog='inDialog'></contract-info>
		 <product-list-dialog ref='productListDialog' :in-dialog='inDialog'/>
	  <out-product-list-dialog ref='outProductListDialog' :in-dialog='inDialog'/>
	  <storage-list-dialog ref='storageListDialog' :in-dialog='inDialog' />
	  <delivery-list-dialog ref='deliveryListDialog' :in-dialog='inDialog' />
	</div>
</template>
<script>
import projectApi from '@/api/yyzx/project'
import projectDetails from '@/components/projectDetails'
import orderListDialog from '@/components/yyzx/order/listDialog'
import invoiceListDialog from '@/components/cw/invoiceRecord/dialog'
import paymentListDialog from '@/components/cw/receivePaymentRecord/dialog'
import contractInfo from '@/components/yyzx/contract/info'
import productListDialog from '@/components/sc/product/listDialog'
import outProductListDialog from '@/components/sc/outProduct/listDialog'
import storageListDialog from '@/components/cy/store/listDialog'
import deliveryListDialog from '@/components/cy/delivery/listDialog'

export default {
	components:{ 
		projectDetails,
		orderListDialog,
		invoiceListDialog,
		paymentListDialog,
		contractInfo,
		productListDialog,
		outProductListDialog,
		storageListDialog,
		deliveryListDialog
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
		showMore:{
			type:Boolean,
			default:false
		},
		sortProp:{
			default:''
		},
		sortOrder:{
			default:''
		}
	},
	data(){
		return {
			loading:true,
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
				salesman:'',
				hasUpdate:0,
				hasProblem:0,

			},
			//请求参数
			requestParams:{
				pageSize:10,//分页大小
				currentPage:1,//当前页
				sortProp:this.sortProp,
				sortOrder:this.sortOrder
			},
			areas:{
				'ht':'合同情况',
				'xs':'销售计划情况',
				'xd':'下单情况',
				'cg':'采购情况',
				'sc':'生产情况',
				'ck':'物料库存情况',
				'cy':'储运情况',
				'gc':'工程情况',
				// 'business':'商务报价情况',
				'cw':'回款情况'
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
			this.loading = true
			projectApi.getProgressList( this.requestParams ).then(res=>{
				this.list=res.data.list
				this.dataTotal = res.data.total
				this.updateTotal = res.data.updateTotal
				this.problemTotal = res.data.problemTotal
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
			projectApi.exportProgressExcel(this.requestParams)
		},
		hasTodoStatus({ row }){
			let hasTodo = false
			for(let key in this.areas){
				if(row[key+'_update_time']==null){
					hasTodo = true
					break
				}
			}
			return hasTodo
		},
		getTodoStatusText({ row }){
			let a=[]
			for(let key in this.areas){
				if(row[key+'_update_time']==null){
					a.push('<b>'+this.areas[key]+'</b>')
				}
			}
			return a.join('、')+' 信息未完善，请提醒相关人员进行完善'
		},
		hasUpdateStatus({ row }){
			let hasUpdate = false
			for(let key in this.areas){
				if(this.$moment(row[key+'_update_time']||0).isAfter(this.$moment(row[key+'_view_time']||0))){
					hasUpdate = true
					break
				}
			}
			return hasUpdate
		},
		getUpdateStatusText({ row }){
			let a=[]
			for(let key in this.areas){
				if(this.$moment(row[key+'_update_time']||0).isAfter(this.$moment(row[key+'_view_time']||0))){
					a.push('<b>'+this.areas[key]+'</b>')
				}
			}			
			return a.join('、')+' 信息有更新，请及时查看'
		},
		//项目信息完善进度
		getProjectInfoPercentage({row}){
			let hasInfoTotal = 0
			for(let key in this.areas){
				if(row[ key + '_update_time']!=null){
					hasInfoTotal += 1
				}
			}
			return Math.round(hasInfoTotal / Object.keys(this.areas).length*100*100)/100||0
		},
		openOrderListDialog(projectId){
			this.$refs.orderListDialog.open({project_id:projectId,isDel:0})
		},
		openInvoiceListDialog(projectId){
			this.$refs.invoiceListDialog.open({project_id:projectId})
		},
		openPaymentListDialog(projectId){
			this.$refs.paymentListDialog.open({project_id:projectId})
		},
		getDevList(key,callback){
			projectApi.getDevList(key).then(res=>{
				callback(res.data)
			})
		},
		getPlaceList(key,callback){
			projectApi.getPlaceList(key).then(res=>{
				callback(res.data)
			})
		},
		getCompanyList(key,callback){
			projectApi.getCompanyList(key).then(res=>{
				callback(res.data)
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