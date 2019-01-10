<!-- 
此组件初始化时不会自动加载数据，请在mounted中 this.$refs.[].initData() 初始化数据
如果放在dialog里面的吗，请在dialog的open事件中用this.$nextTick进行初始化数据
 -->
<template>
	<div>
		<!-- 查询条件 -->
		<div style='margin-bottom:3px' v-show='!hideQuery'>
			<div style='float:right;margin-top:3px'>
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
				<el-form-item label='窗号' prop='window_no'>
					<el-input v-model='queryParams.window_no' clearable></el-input>
				</el-form-item>
				<!-- 更多条件 -->
				<template v-if='queryShowMore'>
					<el-form-item label='窗型' prop='window_model'>
						<el-input v-model='queryParams.window_model' clearable></el-input>
					</el-form-item>
					<el-form-item label='备注' prop='remarks'>
						<el-input v-model='queryParams.remarks' clearable></el-input>
					</el-form-item>
					<el-form-item label='项目名称' prop='project_name'>
						<el-input v-model='queryParams.project_name' clearable></el-input>
					</el-form-item>
					<el-form-item label='客户名称' prop='customer_name'>
						<el-input v-model='queryParams.customer_name' clearable></el-input>
					</el-form-item>
					<el-form-item label='生产日期'>
						<el-row style='width:300px'>
							<el-col :span="11">
								<el-form-item prop='produce_date_begin'>
					      	<el-date-picker v-model='queryParams.produce_date_begin' placeholder='开始日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
					    	</el-form-item>
					    </el-col>
					    <el-col :span="2">至</el-col>
					    <el-col :span="11">
					    	<el-form-item prop='produce_date_end'>
					    		<el-date-picker v-model='queryParams.produce_date_end' placeholder='结束日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
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
			@selection-change='selectionChange'
			:show-summary='showSummary'>			
			<el-table-column prop='name' fixed label='品名' width='130' show-overflow-tooltip>	</el-table-column>
			<el-table-column prop='amount_total' label='数量' align='right' width='80' sortable='custom' show-overflow-tooltip>
				<template slot-scope='{row}'>
					<span class='c-link' @click='openProductListDialog(row)'>{{row.amount_total}} 樘</span>
				</template>
			</el-table-column>
			<el-table-column prop='area_total' label='产品面积' width='100' align='right'show-overflow-tooltip>
				<template slot-scope='{row}'>
					{{ row.area_total}}㎡
				</template>
			</el-table-column>			
			<el-table-column 
				v-if='!hideProduceFields'
        prop='produce_progress' 
        label='生产进度' 
        width='120' 
        sortable='custom' 
        align='center'>
        <template slot-scope='{ row }'>           
          <el-tooltip placement='left' :content='row.sc_produce_area_total+"㎡（已生产面积） / "+row.area_total+"㎡（产品面积）"'>
            <el-progress 
              text-inside 
              :stroke-width='16' 
              :status='Number(row.produce_progress)>=100?"success":""' 
              :percentage="Number(row.produce_progress)>=100?100:Number(row.produce_progress)"></el-progress>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column v-if='!hideProduceFields' prop='sc_produce_amount_total' label='已生产数量' align='right' width='110' sortable='custom' show-overflow-tooltip>
				<template slot-scope='{row}'>
					{{row.sc_produce_amount_total}} 樘
				</template>
			</el-table-column>
			<el-table-column v-if='!hideProduceFields' prop='no_produce_amount' label='未生产数量' align='right' width='110' sortable='custom' show-overflow-tooltip>
				<template slot-scope='{row}'>
					{{row.no_produce_amount}} 樘
				</template>
			</el-table-column>
			<el-table-column v-if='!hideProduceFields' prop='sc_produce_area_total' label='已生产面积' width='110' align='right'show-overflow-tooltip>
				<template slot-scope='{row}'>
					{{ row.sc_produce_area_total }}㎡
				</template>
			</el-table-column>
			<el-table-column v-if='!hideProduceFields' prop='no_produce_area' sortable='custom'  label='未生产面积' width='110' align='right' show-overflow-tooltip>
				<template slot-scope='{row}'>
					{{ row.no_produce_area }}㎡
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
			<!-- slot[column] -->
			<slot name='column'></slot>
			<!--/ slot[column]-->
		</el-table>
		<!-- 数据表格 -->
		<!-- 分页 -->
		<el-pagination style='margin-top: 10px'
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
	  <product-list-dialog :in-dialog='inDialog' ref='productListDialog' />
	</div>
</template>
<script>
import orderProductApi from '@/api/yyzx/orderProduct'
import productListDialog from './listDialog'

export default {
	components:{ productListDialog },
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
		},
		noPage:{
			type:Boolean,
			default:false
		},
		showSummary:{
			type:Boolean,
			default:false
		},
		hideProduceFields:{
			type:Boolean,
			default:false
		},
	},
	data(){
		return {
			inited:false,
			loading: false,			
			list:[],
			dataTotal:0,		
			queryShowMore:false,
			selectionList:[],
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
				sortOrder:''
			}			
		}
	},
	created(){
		//this.getData()
	},
	mounted(){
		if(this.init){
			this.getData()
		}
	},
	methods:{
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
			orderProductApi.getSummaryList({...this.requestParams,...this.params}).then(res=>{
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
			return this
		},
		//重置查询条件
		reset(){
			this.$refs.formQuery.resetFields()
			this.requestParams.currentPage=1
			return this
		},
		resetQuery(){
			this.reset()
			this.query()
			return this
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
      windowApi.exportExcel(this.requestParams)
    },
    openProductListDialog(row){
    	this.$refs.productListDialog.open().then(that=>{
    		that.initData({product_ids:row.product_ids})
    	})
    }
	}
}
</script>