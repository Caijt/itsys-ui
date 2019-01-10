<!-- 
此组件初始化时不会自动加载数据，请在mounted中 this.$refs.[].initData() 初始化数据
如果放在dialog里面的吗，请在dialog的open事件中用this.$nextTick进行初始化数据
 -->
<template>
	<div>
		<!-- 查询条件 -->
		<div style='margin-bottom:2px' v-show='!hideQuery'>
			<div style='float:right;margin-top:1px'>
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
				<!-- 更多条件 -->
				<template v-if='queryShowMore'>
					<el-form-item label='订单状态' prop='order_status'>
						<el-select v-model='queryParams.order_status' clearable>
							<el-option value='1' label='待生产'></el-option>
							<el-option value='2' label='生产中'></el-option>
							<el-option value='3' label='已完成'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label='订单类型' prop='order_type'>
						<el-input v-model='queryParams.order_type' clearable></el-input>
					</el-form-item>
					<el-form-item label='客户名称' prop='customer_name'>
						<el-input v-model='queryParams.customer_name' clearable></el-input>
					</el-form-item>
					<el-form-item label='合同号' prop='contract_no'>
						<el-input v-model='queryParams.contract_no' clearable></el-input>
					</el-form-item>
					<el-form-item label='地盘' prop='domain'>
						<el-input v-model='queryParams.domain' clearable></el-input>
					</el-form-item>
					<el-form-item label='备注' prop='remarks'>
						<el-input v-model='queryParams.remarks' clearable></el-input>
					</el-form-item>
					<el-form-item label='生产备注' prop='produce_status_remarks'>
						<el-input v-model.trim='queryParams.produce_status_remarks' clearable></el-input>
					</el-form-item>
					<el-form-item label='订单日期'>
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
					<el-form-item label='产品数量'>
						<el-row style='width:300px'>
							<el-col :span="11">
								<el-form-item prop='amount_begin'>
					      	<el-input v-model='queryParams.amount_begin' placeholder='最小值' clearable>
										<span slot="suffix">樘</span>
									</el-input>
					    	</el-form-item>
					    </el-col>
					    <el-col :span="2">至</el-col>
					    <el-col :span="11">
					    	<el-form-item prop='amount_end'>
					    		<el-input v-model='queryParams.amount_end' placeholder='最小值' clearable>
										<span slot="suffix">樘</span>
									</el-input>
					      </el-form-item>
					    </el-col>
				  	</el-row>
					</el-form-item>
					<el-form-item label='加工面积'>
						<el-row style='width:300px'>
							<el-col :span="11">
								<el-form-item prop='area_begin'>
					      	<el-input v-model='queryParams.area_begin' placeholder='最小值' clearable>
										<span slot="suffix">㎡</span>
									</el-input>
					    	</el-form-item>
					    </el-col>
					    <el-col :span="2">至</el-col>
					    <el-col :span="11">
					    	<el-form-item prop='area_end'>
					    		<el-input v-model='queryParams.area_end' placeholder='最小值' clearable>
										<span slot="suffix">㎡</span>
									</el-input>
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
			@sort-change='sortChange'
			show-summary
			:summary-method='getSummaryData'>
			<el-table-column prop='order_no' fixed label='订单编号' width='130' show-overflow-tooltip>
				<template slot-scope='{ row }'>
          <span class='c-link' @click='openOrderInfo(row.id)'>{{ row.order_no }}</span>
        </template>
			</el-table-column>
			<el-table-column width='80' label='订单状态' align='center'>
				<template slot-scope='{ row }'>
					<el-tag type='info' v-if='Number(row.sc_produce_area_total)==0'>待生产</el-tag>
					<el-tag v-else-if='Number(row.sc_produce_area_total)>0&&Number(row.sc_produce_area_total)<Number(row.machining_area_total)'>生产中</el-tag>
					<el-tag type='success' v-else-if='Number(row.sc_produce_area_total)>=Number(row.machining_area_total)&&Number(row.sc_produce_area_total)!=0'>已完成</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop='project_name' label='项目名称' width='110' show-overflow-tooltip></el-table-column>
			<el-table-column prop='contract_no' label='合同号' width='110' show-overflow-tooltip></el-table-column>
			<el-table-column prop='customer_name' label='客户名称' width='110' show-overflow-tooltip></el-table-column>
			<el-table-column prop='domain' label='地盘' width='110' show-overflow-tooltip></el-table-column>
			<el-table-column prop='order_type' label='订单类别' show-overflow-tooltip></el-table-column>
			<el-table-column prop='order_date' label='订单日期' sortable='custom' width='110'></el-table-column>	
			<el-table-column prop='delivery_date' label='交货日期' sortable='custom' width='110'></el-table-column>
			<el-table-column label='生产进度' sortable='custom' width='110' align='right'>
				<template slot-scope='{row}'>
          <el-progress 
            text-inside :stroke-width='16' 
            :status='$commonJs.getProgressPercentage(row.sc_produce_area_total/row.machining_area_total)>=100?"success":""' 
            :percentage="$commonJs.getProgressPercentage(row.sc_produce_area_total/row.machining_area_total)"/>
        </template>
			</el-table-column>
			<el-table-column prop='produce_status_remarks' width='120' label='生产状态备注' show-overflow-tooltip></el-table-column>
			<el-table-column prop='amount_total' label='订单数量' sortable='custom' width='110' align='right'>
				<template slot-scope='{row}'>
					<span class='c-link' @click='$refs.productListDialog.open({order_id:row.id})'>{{ row.amount_total }} 樘</span>
				</template>
			</el-table-column>
			<el-table-column prop='sc_produce_amount_total' label='已生产数量' sortable='custom' width='110' align='right'>
				<template slot-scope='{row}'>
					{{ row.sc_produce_amount_total }} 樘
				</template>
			</el-table-column>
			<el-table-column prop='no_produce_amount' label='未生产数量' sortable='custom' width='110' align='right'>
				<template slot-scope='{row}'>
					{{ row.no_produce_amount }} 樘
				</template>
			</el-table-column>
			<el-table-column prop='machining_area_total' label='加工面积' sortable='custom' width='110' align='right'>
				<template slot-scope='{row}'>
					{{ row.machining_area_total }}㎡
				</template>
			</el-table-column>
			<el-table-column prop='sc_produce_area_total' label='已生产面积' sortable='custom' width='110' align='right'>
				<template slot-scope='{row}'>
					{{ row.sc_produce_area_total }}㎡
				</template>
			</el-table-column>
			<el-table-column prop='no_produce_area' label='未生产面积' sortable='custom' width='110' align='right'>
				<template slot-scope='{row}'>
					{{ row.no_produce_area }}㎡
				</template>
			</el-table-column>
			<el-table-column prop='sc_log_total' label='生产日志' sortable='custom' align='center' width='110'>
				<template slot-scope='{row}'>
					<span class='c-link' @click='$refs.logListDialog.open({order_id:row.id})'>{{ row.sc_produce_log_total }}</span>
				</template>
			</el-table-column>
			<el-table-column prop='sc_create_time' label='录入时间' sortable='custom' width='130'>
				<template slot-scope='{ row }'>
					{{ $commonJs.formatDate(row.sc_create_time) }}
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
	  <order-info :in-dialog='inDialog' ref='orderInfo' />
	  <log-list-dialog :in-dialog='inDialog' ref='logListDialog' />
	  <product-list-dialog :in-dialog='inDialog' ref='productListDialog' />
	</div>
</template>
<script>
import produceLogApi from '@/api/sc/produceLog'
import orderInfo from '@/components/sc/windowOrder/details'
import logListDialog from './logListDialog'
import productListDialog from './productListDialog'

export default {
	components:{ orderInfo, logListDialog,productListDialog },
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
			summaryData:{},
			dataTotal:0,		
			queryShowMore:false,
			//查询条件字段
			queryParams:{
				order_no:'',//订单编号
				project_name:'',//项目名称
				customer_name:'',//客户单位
				contract_no:'',
				domain:'',
				remarks:'',
				order_status:'',
				order_type:'',
				order_date_begin:'',
				order_date_end:'',
				delivery_date_begin:'',
				delivery_date_end:'',
				amount_begin:'',
				amount_end:'',
				area_begin:'',
				area_end:'',
				hasProduce:1
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
	mounted(){
		if(this.init){
			this.initData()
		}
	},
	methods:{
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
			produceLogApi.getOrderList(this.requestParams).then(res=>{
				this.list = res.data.list
				this.dataTotal = res.data.total
				this.summaryData = res.data.summary
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
      this.$refs.orderInfo.get(id).open()
    },
    clear(){
    	this.list = []
    },    
		exportExcel(){
      produceLogApi.exportOrderExcel(this.requestParams)
    },
	}
}
</script>