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
				<el-form-item label='品名' prop='product_name'>
					<el-input v-model='queryParams.product_name' clearable></el-input>
				</el-form-item>
				<!-- 更多条件 -->
				<template v-if='queryShowMore'>
					<el-form-item label='窗号' prop='window_no'>
						<el-input v-model='queryParams.window_no' clearable></el-input>
					</el-form-item>
					<el-form-item label='楼号' prop='floor_no'>
						<el-input v-model='queryParams.floor_no' clearable></el-input>
					</el-form-item>
					<el-form-item label='产地' prop='origin_place'>
						<el-input v-model='queryParams.origin_place' clearable></el-input>
					</el-form-item>
					<el-form-item label='型材' prop='steel'>
						<el-input v-model='queryParams.steel' clearable></el-input>
					</el-form-item>
					<el-form-item label='五金' prop='hardware'>
						<el-input v-model='queryParams.hardware' clearable></el-input>
					</el-form-item>
					<el-form-item label='玻璃' prop='glass'>
						<el-input v-model='queryParams.glass' clearable></el-input>
					</el-form-item>
					<el-form-item label='技术要求' prop='requirement'>
						<el-input v-model='queryParams.requirement' clearable></el-input>
					</el-form-item>
					<el-form-item label='图纸' prop='drawing'>
						<el-input v-model='queryParams.drawing' clearable></el-input>
					</el-form-item>
					<el-form-item label='其它' prop='other'>
						<el-input v-model='queryParams.other' clearable></el-input>
					</el-form-item>
					<el-form-item label='项目名称' prop='project_name'>
						<el-input v-model='queryParams.project_name' clearable></el-input>
					</el-form-item>
					<el-form-item label='客户名称' prop='customer_name'>
						<el-input v-model='queryParams.customer_name' clearable></el-input>
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
			:height='height'
			:max-height='maxHeight'
			@sort-change='sortChange'
			@selection-change='selectionChange'
			:show-summary='showSummary'
			:summary-method='getSummaryData'>
			<el-table-column
				v-if='showSelection'
	      type="selection"
	      align='center'
	      width="50">
	    </el-table-column>
	    <el-table-column prop='order_no' v-if='!hideOrderFields' fixed label='订单编号' width='130' show-overflow-tooltip>	</el-table-column>
			<el-table-column prop='name' fixed label='品名' width='130' show-overflow-tooltip>	</el-table-column>
			<el-table-column prop='floor_no' label='楼号' width='80' show-overflow-tooltip></el-table-column>
			<el-table-column prop='window_no' label='窗号' width='80' show-overflow-tooltip></el-table-column>
			<el-table-column label='生产进度' min-width='120' align='center'>
        <template slot-scope='{row}'>
          <el-progress 
            text-inside :stroke-width='16' 
            :status='$commonJs.getProgressPercentage(row.sc_produce_area_total/row.machining_area)>=100?"success":""' 
            :percentage="$commonJs.getProgressPercentage(row.sc_produce_area_total/row.machining_area)"/>
        </template>
      </el-table-column>
			<el-table-column prop='amount' label='产品数量' align='right' width='100' sortable='custom' show-overflow-tooltip>
				<template slot-scope='{row}'>
					{{row.amount}} 樘
				</template>
			</el-table-column>
			<el-table-column prop='sc_produce_amount_total' label='已生产数量' align='right' width='110' sortable='custom' show-overflow-tooltip>
				<template slot-scope='{row}'>
					{{row.sc_produce_amount_total}} 樘
				</template>
			</el-table-column>
			<el-table-column prop='no_produce_amount' label='未生产数量' align='right' width='110' sortable='custom' show-overflow-tooltip>
				<template slot-scope='{row}'>
					{{row.no_produce_amount}} 樘
				</template>
			</el-table-column>
			<el-table-column prop='machining_area'  sortable='custom' label='加工面积' width='100' align='right'show-overflow-tooltip>
				<template slot-scope='{row}'>
					{{ row.machining_area}}㎡
				</template>
			</el-table-column>
			<el-table-column prop='sc_produce_area_total' label='已生产面积' width='110' align='right'show-overflow-tooltip>
				<template slot-scope='{row}'>
					{{ row.sc_produce_area_total }}㎡
				</template>
			</el-table-column>
			<el-table-column prop='no_produce_area' sortable='custom'  label='未生产面积' width='110' align='right' show-overflow-tooltip>
				<template slot-scope='{row}'>
					{{ row.no_produce_area }}㎡
				</template>
			</el-table-column>			
      <el-table-column prop='sc_produce_log_total' label='生产日志' sortable='custom' align='center' width='100'>
				<template slot-scope='{row}'>
					<span class='c-link' @click='$refs.logListDialog.open({product_id:row.id})'>{{ row.sc_produce_log_total }}</span>
				</template>
			</el-table-column>
			<el-table-column prop='machining_size' label='加工尺寸' width='160' show-overflow-tooltip>
				<template slot-scope='{row}'>
					{{ Number(row.machining_width) }}mm(W)*{{ Number(row.machining_height) }}mm(H)
				</template>
			</el-table-column>
			<el-table-column prop='hole_size' label='洞口尺寸' width='160' show-overflow-tooltip>
				<template slot-scope='{row}'>
					{{ Number(row.hole_width)}}mm(W)*{{ Number(row.hole_height) }}mm(H)
				</template>
			</el-table-column>
			<el-table-column prop='hole_area' label='洞口面积' width='100' align='right'show-overflow-tooltip>
				<template slot-scope='{row}'>
					{{ row.hole_area}}㎡
				</template>
			</el-table-column>
			<el-table-column prop='origin_place' label='产地' show-overflow-tooltip></el-table-column>
			<el-table-column prop='steel' label='型材' show-overflow-tooltip></el-table-column>
			<el-table-column prop='hardware' label='五金' width='80' show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop='glass' label='玻璃' width='80' show-overflow-tooltip></el-table-column>
			<el-table-column prop='requirement' label='技术要求' width='80' show-overflow-tooltip></el-table-column>
			<el-table-column prop='drawing' label='图纸' width='80' show-overflow-tooltip></el-table-column>
			<el-table-column prop='other' label='其它' width='80' show-overflow-tooltip></el-table-column>
			<el-table-column v-if='!hideOrderFields' prop='project_name' label='项目名称' show-overflow-tooltip></el-table-column>
			<el-table-column v-if='!hideOrderFields' prop='customer_name' label='客户名称' show-overflow-tooltip></el-table-column>
			<el-table-column v-if='!hideOrderFields' prop='order_type' label='订单类型' show-overflow-tooltip></el-table-column>
			<el-table-column v-if='!hideOrderFields' prop='order_date' sortable='custom' width='100' label='订单日期' show-overflow-tooltip></el-table-column>
			<el-table-column v-if='!hideOrderFields' prop='delivery_date' sortable='custom' width='100' label='交货日期' show-overflow-tooltip></el-table-column>
			<!-- slot[column] -->
			<slot name='column'></slot>
			<!--/ slot[column]-->
		</el-table>
		<!-- 数据表格 -->
		<!-- 分页 -->
		<el-pagination 
			style='margin-top: 10px'
			v-show='!noPage'
	    :page-sizes = "[10, 20, 50, 100]"
	    :page-size= "requestParams.pageSize"
	    :current-page.sync = "requestParams.currentPage"
	    layout="total, sizes, prev, pager, next, jumper"
	    :total="dataTotal"
	    @size-change='sizeChange'
	    @current-change='getData'>
	  </el-pagination>
	  <!--/ 分页 -->
	  <log-list-dialog :in-dialog='inDialog' ref='logListDialog' />
	</div>
</template>
<script>
import produceLogApi from '@/api/sc/produceLog'
import logListDialog from './logListDialog'

export default {
	components:{ logListDialog },
	props:{
		size:{
			type:String,
			default:''
		},
		maxHeight:{
			default:350
		},
		height:{},
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
		},
		noPage:{
			type:Boolean,
			default:false
		},
		showSummary:{
			type:Boolean,
			default:true
		},
		showSelection:{
			type:Boolean,
			default:false
		},
		hideOrderFields:{
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
			selectionList:[],
			summaryData:{},
			//查询条件字段
			queryParams:{
				order_no:'',//订单编号
				window_no:'',//项目名称
				window_model:'',//客户单位	
				product_name:'',
				product_no:'',
				remarks:'',
				produce_date_begin:'',
				produce_date_end:''
			},
			//数据请求的参数
			requestParams:{
				pageSize:10,//分页大小
				currentPage:1,//当前页
				sortProp:'',
				sortOrder:'',
				noPage:this.noPage?1:''
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
		selectionChange(valueArrary){
			this.selectionList = valueArrary
		},
		//获取数据
		getData() {
			this.loading=true
			produceLogApi.getProductList(this.requestParams).then(res=>{
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
		sortChange({prop,order}){
			this.requestParams.sortProp = prop
			this.requestParams.sortOrder = order
			this.getData()
		},
    clear(){
    	this.list = []
    	return this
    },
		exportExcel(){
      produceLogApi.exportProductExcel(this.requestParams)
    },
	}
}
</script>