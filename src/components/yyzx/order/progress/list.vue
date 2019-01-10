<!-- 
此组件初始化时不会自动加载数据，请在mounted中 this.$refs.[].initData() 初始化数据
如果放在dialog里面的吗，请在dialog的open事件中用this.$nextTick进行初始化数据
 -->
<template>
	<div>
		<!-- 查询条件 -->
		<div style='margin-bottom: 2px'>
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
			<el-form ref='formQuery' :model='queryParams' label-width='68px' 
				class='c-form-condensed' inline size='mini'>
				<el-form-item label='订单编号' prop='order_no'>
					<el-input v-model='queryParams.order_no' clearable></el-input>
				</el-form-item>
				<el-form-item label='项目名称' prop='project_name'>
					<el-input v-model='queryParams.project_name' clearable></el-input>
				</el-form-item>
				<el-form-item prop='isDelay'>
					<el-tooltip content='超过交货日期未完成的订单'>
						<el-checkbox 
							v-model="queryParams.isDelay" 
							label="超期" 
							border
							:true-label='1'
							:false-label='0'
							@change='query({key:"isDelay"})'
							>
						</el-checkbox>
					</el-tooltip>
				</el-form-item>
				<!-- 更多条件 -->
				<template v-if='queryShowMore'>
					<el-form-item label='订单类别' prop='order_type'>
						<el-autocomplete v-model='queryParams.order_type' clearable :fetch-suggestions="getFieldList('order_type')"></el-autocomplete>
					</el-form-item>
					<el-form-item label='订单批次' prop='order_batch'>
						<el-autocomplete v-model='queryParams.order_batch' clearable :fetch-suggestions="getFieldList('batch')"></el-autocomplete>
					</el-form-item>
					<el-form-item label='合同下单' prop='is_contract'>
						<el-select v-model='queryParams.is_contract' clearable style='width:160px'>
							<el-option label='有' :value='1'></el-option>
							<el-option label='无' :value='0'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label='安装方式' prop='install_method'>
						<el-select v-model='queryParams.install_method' clearable style='width:160px'>
							<el-option value='整窗安装'></el-option>
							<el-option value='非整窗安装'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label='系列' prop='series'>
						<el-autocomplete v-model='queryParams.series' clearable :fetch-suggestions="getFieldList('series')"></el-autocomplete>
					</el-form-item>
					<el-form-item label='窗型' prop='model'>
						<el-autocomplete v-model='queryParams.model' clearable :fetch-suggestions="getFieldList('model')"></el-autocomplete>
					</el-form-item>
					<el-form-item label='闭窗器' prop='window_style'>
						<el-autocomplete v-model='queryParams.window_style' clearable :fetch-suggestions="getFieldList('window_style')"></el-autocomplete>
					</el-form-item>
					<el-form-item label='型材颜色' prop='color'>
						<el-autocomplete v-model='queryParams.color' clearable :fetch-suggestions="getFieldList('color')"></el-autocomplete>
					</el-form-item>
					<el-form-item label='备注' prop='product_status'>
						<el-autocomplete v-model='queryParams.product_status' clearable :fetch-suggestions="getFieldList('product_status')"></el-autocomplete>
					</el-form-item>
					<el-form-item label='订单状态' prop='is_finish'>
						<el-select v-model='queryParams.is_finish' clearable style='width:160px'>
							<el-option label='进行中' :value='0'></el-option>
							<el-option label='完成' :value='1'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label='玻璃加工' prop='glass_expect_delivery'>
						<el-autocomplete v-model='queryParams.glass_expect_delivery' clearable :fetch-suggestions="getFieldList('glass_expect_delivery')"></el-autocomplete>
					</el-form-item>
					<el-form-item label='项目编号' prop='project_no'>
						<el-input v-model='queryParams.project_no' clearable></el-input>
					</el-form-item>
					<el-form-item label='合同编号' prop='contract_no'>
						<el-input v-model='queryParams.contract_no' clearable></el-input>
					</el-form-item>
					<el-form-item label='客户名称' prop='customer_name'>
						<el-autocomplete v-model='queryParams.customer_name' clearable :fetch-suggestions="getProjectFieldList('customer_name')"></el-autocomplete>
					</el-form-item>
					<el-form-item label='业绩公司' prop='company_name'>
						<el-autocomplete v-model='queryParams.company_name' clearable :fetch-suggestions="getProjectFieldList('company_name')"></el-autocomplete>
					</el-form-item>
					<el-form-item label='业务员' prop='salesman'>
						<el-autocomplete v-model='queryParams.salesman' clearable :fetch-suggestions="getProjectFieldList('salesman')"></el-autocomplete>
					</el-form-item>
					<el-form-item label='防火时间'>
						<el-row style='width:300px'>
							<el-col :span="11">
								<el-form-item prop='fire_time_begin'>
					      	<el-input v-model='queryParams.fire_time_begin' placeholder='最小值' clearable>
					      		<span slot="suffix">小时</span>
					      	</el-input>
					    	</el-form-item>
					    </el-col>
					    <el-col :span="2">至</el-col>
					    <el-col :span="11">
					    	<el-form-item prop='fire_time_end'>
					    		<el-input v-model='queryParams.fire_time_end' placeholder='最大值' >
					    			<span slot="suffix">小时</span>
					    		</el-input>
					      </el-form-item>
					    </el-col>
				  	</el-row>
					</el-form-item>
					<el-form-item label='下单日期'>
						<el-row style='width:300px'>
							<el-col :span="11">
								<el-form-item prop='order_date_begin'>
					      	<el-date-picker v-model='queryParams.order_date_begin' placeholder='开始日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
					    	</el-form-item>
					    </el-col>
					    <el-col :span="2">至</el-col>
					    <el-col :span="11">
					    	<el-form-item prop='order_date_end'>
					    		<el-date-picker v-model='queryParams.order_date_end' placeholder='结束日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
					      </el-form-item>
					    </el-col>
				  	</el-row>
					</el-form-item>
					<el-form-item label='交货日期'>
						<el-row style='width:300px'>
							<el-col :span="11">
								<el-form-item prop='delivery_date_begin'>
					      	<el-date-picker v-model='queryParams.delivery_date_begin' placeholder='开始日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
					    	</el-form-item>
					    </el-col>
					    <el-col :span="2">至</el-col>
					    <el-col :span="11">
					    	<el-form-item prop='delivery_date_end'>
					    		<el-date-picker v-model='queryParams.delivery_date_end' placeholder='结束日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
					      </el-form-item>
					    </el-col>
				  	</el-row>
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
			<el-table-column prop='order_no' fixed label='订单编号' width='100' show-overflow-tooltip></el-table-column>
			<el-table-column prop='project_name' fixed label='项目名称' width='120' show-overflow-tooltip></el-table-column>
			<el-table-column prop='customer_name' label='客户名称'  width='100' show-overflow-tooltip></el-table-column>
			<el-table-column prop='company_name' label='业绩公司'  width='100' show-overflow-tooltip></el-table-column>
			<el-table-column prop='dev' label='开发商'  width='100' show-overflow-tooltip></el-table-column>
			<el-table-column prop='order_type' label='订单类别' show-overflow-tooltip></el-table-column>
			<el-table-column prop='batch' label='订单批次' show-overflow-tooltip></el-table-column>
			<el-table-column prop='area_name' label='生产基地' sortable='custom' show-overflow-tooltip width='110'>
			</el-table-column>
			<el-table-column prop='order_area' label='已下单面积' sortable='custom' align='right' width='110'>
				<template slot-scope='scope'>
					<span>{{ scope.row.order_area }}㎡</span>
				</template>
			</el-table-column>
			<el-table-column prop='sc_finish_area_total' label='已生产面积' sortable='custom' align='right' width='120'>
				<template slot-scope='{ row }'>
					<span>{{ row.sc_finish_area_total }}㎡</span>
				</template>
			</el-table-column>
			<el-table-column prop='cy_storage_area_total' label='已入库面积' sortable='custom' align='right' width='120'>
				<template slot-scope='{ row }'>
					<span>{{ row.cy_storage_area_total }}㎡</span>
				</template>
			</el-table-column>
			<el-table-column prop='order_amount' label='已下单数量' sortable='custom' align='right' width='110'>
			</el-table-column>
			<el-table-column prop='is_contract' width='100' label='合同下单' sortable='custom' align='center'>
				<template slot-scope='{row}'>
					<el-tag size='mini' type="success" v-if='row.is_contract'>有</el-tag>
					<el-tag size='mini' type='info' v-else >无</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop='install_method' label='安装方式' width='100' show-overflow-tooltip></el-table-column>
			<el-table-column prop='series' label='系列' show-overflow-tooltip></el-table-column>
			<el-table-column prop='model' label='窗型' show-overflow-tooltip></el-table-column>
			<el-table-column prop='window_style' label='闭窗器样式' width='100' show-overflow-tooltip></el-table-column>
			<el-table-column prop='color' label='型材颜色' show-overflow-tooltip></el-table-column>
			<el-table-column prop='fire_time' label='防火时间' sortable='custom' align='right' width='100'>
				<template slot-scope='{ row }'>
					{{ row.fire_time }} 小时
				</template>
			</el-table-column>
			<el-table-column prop='product_status' label='备注' show-overflow-tooltip></el-table-column>
			<el-table-column prop='order_date' label='下单日期' sortable='custom' width='110'></el-table-column>
			<el-table-column prop='delivery_date' label='交货日期' width='110' sortable='custom'></el-table-column>
			<el-table-column prop='is_finish' label='订单状态' width='80' align='center'>
				<template slot-scope='{row}'>
					<el-tag v-if='row.is_finish' size='mini' type='success'>完成</el-tag>
					<el-tag v-else size='mini'>进行中</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop='finish_date' label='完成日期' sortable='custom' width='110'>
				<template slot-scope='{row}'>
					<span v-if='row.is_finish'>{{ row.finish_date }}</span>
				</template>
			</el-table-column>
			<el-table-column prop='finish_date' label='完成时长' align='center' width='100'>
				<template slot-scope='{row}'>
					<el-tag size='mini' v-if='row.is_finish' type='success'>{{ getOrderDays(row) }}天</el-tag>
					<el-tag size='mini' v-else>已进行{{ getOrderDays(row) }}天</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop='glass_expect_delivery' label='玻璃加工预计交期' show-overflow-tooltip></el-table-column>
			<el-table-column prop='saleplan_delivery_plan' label='销售交货计划' width='110'show-overflow-tooltip></el-table-column>
			<el-table-column prop='scjh_is_self' label='车间生产' align='center' width='80'>
				<template slot-scope='{row}'>
					<i class="el-icon-check" v-if='row.scjh_is_self' type='success' style='color:#67C23A' ></i>
					<i class="el-icon-close" v-else type='success' style='color:#F56C6C' ></i>
				</template>
			</el-table-column>
			<el-table-column prop='scjh_is_out' label='外协生产' align='center' width='80'>
				<template slot-scope='{row}'>
					<i class="el-icon-check" v-if='row.scjh_is_out' type='success' style='color:#67C23A' ></i>
					<i class="el-icon-close" v-else type='success' style='color:#F56C6C' ></i>
				</template>
			</el-table-column>
			<el-table-column prop='sc_self_product_record_total' label='车间日志' sortable='custom' align='center' width='100'>
				<template slot-scope='{ row }'>
					<span class='c-link' @click='$refs.productListDialog.open({order_id:row.id})'>{{ row.sc_self_product_record_total }}</span>
				</template>
			</el-table-column>
			<el-table-column prop='sc_out_product_record_total' label='外协日志' sortable='custom' align='center' width='100'>
				<template slot-scope='{ row }'>
					<span class='c-link' @click='$refs.outProductListDialog.open({order_id:row.id})'>{{ row.sc_out_product_record_total }}</span>
				</template>
			</el-table-column>
			<el-table-column label='生产进度' width='120' align='center'>
				<template slot-scope='{ row }'>						
					<el-tooltip placement='left' :content='row.sc_finish_area_total+"㎡（生产面积） / "+row.order_area+"㎡（下单面积）"'>
						<el-progress 
							text-inside 
							:stroke-width='16' 
							:status='$commonJs.getProgressPercentage(row.sc_finish_area_total/row.order_area)>=100?"success":""' 
							:percentage="$commonJs.getProgressPercentage(row.sc_finish_area_total/row.order_area)"></el-progress>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop='sc_self_product_status' label='车间生产状态' width='120' show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop='sc_out_product_status' label='外协生产状态' width='120' show-overflow-tooltip>
			</el-table-column >
			<el-table-column prop='sc_out_product_unit' label='外协生产单位' width='120' show-overflow-tooltip>
			</el-table-column >
			<el-table-column prop='cg_wj_delivery_date' label='五金采购到货日期' sortable='custom' width='150'>
			</el-table-column >
			<el-table-column prop='cg_xc_delivery_date' label='型材采购到货日期' sortable='custom' width='150'>
			</el-table-column >
			<el-table-column prop='cy_first_storage_date' label='入库日期' sortable='custom'  width='110'></el-table-column>
			
			<el-table-column prop='cy_storage_record_total' label='入库记录' sortable='custom' align='center' width='100'>
				<template slot-scope='{ row }'>
					<span class='c-link' @click='$refs.storageListDialog.open({order_id:row.id})'>{{ row.cy_storage_record_total }}</span>
				</template>
			</el-table-column>
			<el-table-column label='成品入库进度' width='120' align='center'>
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
			<el-table-column prop='cy_first_delivery_date' label='发货日期' sortable='custom' width='110'></el-table-column>
			<el-table-column prop='cy_delivery_area_total' label='已发货面积' sortable='custom' align='right' width='120'>
				<template slot-scope='{ row }'>
					<span>{{ row.cy_delivery_area_total }}㎡</span>
				</template>
			</el-table-column>
			<el-table-column prop='cy_delivery_record_total' label='发货记录' sortable='custom' align='center' width='100'>
				<template slot-scope='{ row }'>
					<span class='c-link' @click='$refs.deliveryListDialog.open({order_id:row.id})'>{{ row.cy_delivery_record_total }}</span>
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
			<el-table-column prop='project_no' label='项目编号' width='100'>
				<template slot-scope='scope'>
					<span @click='clickProject(scope.row.project_id)' class='c-link'>{{ scope.row.project_no }}</span>					
				</template>
			</el-table-column>
			
			<el-table-column prop='contract_no' label='合同编号' width='100' show-overflow-tooltip>
				<template slot-scope='{row}'>
					<span class='c-link' @click='$refs.contractInfo.open(row.contract_id)'>{{ row.contract_no}}</span>
				</template>
			</el-table-column>
			
			<el-table-column prop='salesman' label='业务员' width='80'></el-table-column>
			<el-table-column prop='create_time' label='订单创建时间' sortable='custom' width='140'>
				<template slot-scope='{ row }'>
					{{ $commonJs.formatDate(row.create_time) }}
				</template>
			</el-table-column>
			<el-table-column prop='progress_update_time' label='进度更新时间' sortable='custom' width='140'>
				<template slot-scope='{ row }'>
					{{ $commonJs.formatDate(row.progress_update_time) }}
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
	  <contract-info ref='contractInfo' :in-dialog='inDialog'></contract-info>
	  <product-list-dialog ref='productListDialog' :in-dialog='inDialog'/>
	  <out-product-list-dialog ref='outProductListDialog' :in-dialog='inDialog'/>
	  <storage-list-dialog ref='storageListDialog' :in-dialog='inDialog' />
	  <storage-list-dialog ref='deliveryListDialog' :in-dialog='inDialog' />
	</div>
</template>
<script>
import orderApi from '@/api/yyzx/order'
import projectApi from '@/api/yyzx/project'
import projectDetails from '@/components/projectDetails'
import contractInfo from '@/components/yyzx/contract/info'
import productListDialog from '@/components/sc/product/listDialog'
import outProductListDialog from '@/components/sc/outProduct/listDialog'
import storageListDialog from '@/components/cy/store/listDialog'
import deliveryListDialog from '@/components/cy/delivery/listDialog'

export default {
	components:{ 
		projectDetails,
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
				order_no:'',//订单编号
				project_name:'',//项目名称
				customer_name:'',//客户单位
				project_no:'',//项目编号
				contract_no:'',//合同编号
				company_name:'',//业绩公司
				salesman:'',//业务员
				order_type:'',//订单类型
				order_batch:'',//订单批次
				glass_expect_delivery:'',
				product_status:'',//生产状态
				is_contract:'',//有无合同下单
				color:'',//型材颜色
				series:'',
				model:'',
				window_style:'',
				is_finish:'',//订单状态
				isDelay:0,//超期订单
				order_date_begin:'',
				order_date_end:'',
				delivery_date_begin:'',
				delivery_date_end:'',
				fire_time_begin:'',
				fire_time_end:'',
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
			orderApi.getProgressList(this.requestParams).then(res=>{
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
		exportExcel(){
			orderApi.exportProgressExcel(this.requestParams)
		},
		getOrderDays(row){
			let finishDate 
			if(row.is_finish){
				finishDate = this.$moment(row.finish_date)
			}else{
				finishDate = this.$moment()
			}
			return finishDate.diff(this.$moment(row.order_date),'days')+1
		},
		getFieldList(field){
			return (keyword,callback)=>{
				orderApi.getFieldList({ field,keyword }).then(res=>{
					callback(res.data)
				})
			}
		},
		getProjectFieldList(field){
			return (keyword,callback)=>{
				projectApi.getFieldList({ field,keyword }).then(res=>{
					callback(res.data)
				})
			}
		}
	}
}
</script>