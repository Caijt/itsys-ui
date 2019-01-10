<!-- 
此组件初始化时不会自动加载数据，请在mounted中 this.$refs.[].initData() 初始化数据
如果放在dialog里面的吗，请在dialog的open事件中用this.$nextTick进行初始化数据
 -->
<template>
	<div>
		<!-- 查询条件 -->
		<div style='margin-bottom:2px' v-show='!hideQuery'>
			<div style='float:right;'>
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
					<el-form-item label='楼号' prop='floor_no'>
						<el-input v-model='queryParams.floor_no' clearable></el-input>
					</el-form-item>
					<el-form-item label='窗号' prop='window_no'>
						<el-input v-model='queryParams.window_no' clearable></el-input>
					</el-form-item>
					<el-form-item label='项目名称' prop='project_name'>
						<el-input v-model='queryParams.project_name' clearable></el-input>
					</el-form-item>
					<el-form-item label='客户名称' prop='customer_name'>
						<el-input v-model='queryParams.customer_name' clearable></el-input>
					</el-form-item>
					<el-form-item label='生产状态' prop='produce_status_remarks'>
						<el-input v-model='queryParams.produce_status_remarks' placeholder='生产状态描述' clearable></el-input>
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
					<el-form-item label='结算面积'>
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
			@selection-change='selectionChange'
			show-summary
			:summary-method='getSummaryData'>
			<el-table-column
				v-if='showSelection'
				type='selection'
				align='center'
				width='50'
			></el-table-column>
			<el-table-column v-if='!hideOrderFields' prop='order_no' fixed label='订单编号' width='130' show-overflow-tooltip>	</el-table-column>		
			<el-table-column v-if='!hideOrderFields' prop='project_name' label='项目名称' width='130' show-overflow-tooltip>	</el-table-column>
			<el-table-column v-if='!hideOrderFields' prop='customer_name' label='客户名称' width='130' show-overflow-tooltip>	</el-table-column>
			<el-table-column v-if='!hideOrderFields' prop='order_date' label='订单日期' width='100' sortable='custom' show-overflow-tooltip>	</el-table-column>
			<el-table-column prop='name' fixed label='品名' width='130' show-overflow-tooltip>	</el-table-column>			
			<el-table-column prop='floor_no' label='楼号' width='80' show-overflow-tooltip></el-table-column>
			<el-table-column prop='window_no' label='窗号' width='80' show-overflow-tooltip></el-table-column>				
			<el-table-column prop='size' label='产品尺寸' width='160' show-overflow-tooltip>
				<template slot-scope='{row}'>
					{{ Number(row.width) }}mm(W)*{{ Number(row.height) }}mm(H)
				</template>
			</el-table-column>
			<el-table-column prop='amount' label='数量' align='right' width='80' sortable='custom' show-overflow-tooltip>
				<template slot-scope='{row}'>
					{{row.amount}} {{row.unit}}
				</template>
			</el-table-column>		
			<el-table-column prop='area' label='总面积' align='right' sortable='custom' width='110' show-overflow-tooltip>
				<template slot-scope='{row}'>
					{{row.area}}㎡
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
          <el-tooltip placement='left' :content='row.sc_produce_area_total+"㎡（已生产面积） / "+row.area+"㎡（产品面积）"'>
            <el-progress 	
              text-inside 
              :stroke-width='16' 
              :status='Number(row.produce_progress)>=100?"success":""' 
              :percentage="Number(row.produce_progress)>=100?100:Number(row.produce_progress)"></el-progress>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column v-if='!hideProduceFields' prop='produce_status_remarks' label='生产状态' sortable='custom' width='110' show-overflow-tooltip />
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
			<el-table-column v-if='!hideProduceFields' prop='sc_produce_log_total' label='生产日志' sortable='custom' align='center' width='100'>
				<template slot-scope='{row}'>
					<span class='c-link' @click='openLogListDialog(row)'>{{ row.sc_produce_log_total }}</span>
				</template>
			</el-table-column>
			<el-table-column prop='size' label='洞口尺寸' width='160' show-overflow-tooltip>
				<template slot-scope='{row}'>
					{{ Number(row.hole_width) }}mm(W)*{{ Number(row.hole_height) }}mm(H)
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
			<el-table-column v-if='!hideEditFields' prop='create_user_name' label='录入员' ></el-table-column>
			<el-table-column v-if='!hideEditFields' prop='create_time' label='创建时间' sortable='custom' width='120'>
				<template slot-scope='{ row }'>
					{{ $commonJs.formatDate(row.create_time) }}
				</template>
			</el-table-column>
			<el-table-column v-if='!hideEditFields' prop='update_time' label='更新时间' sortable='custom' width='120'>
				<template slot-scope='{ row }'>
					{{ $commonJs.formatDate(row.update_time) }}
				</template>
			</el-table-column>
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
	  <order-info :in-dialog='inDialog' ref='orderInfo' />
	  <log-list-dialog :in-dialog='inDialog' ref='logListDialog' />
	</div>
</template>
<script>

import orderProductApi from '@/api/yyzx/orderProduct'
import orderInfo from '@/components/yyzx/order/info'
import logListDialog from '../log/listDialog'

export default {
	components:{ orderInfo, logListDialog },
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
		showSelection:{
			type:Boolean,
			default:false
		},
		hideOrderFields:{
			type:Boolean,
			default:false
		},
		hideEditFields:{
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
			summaryData:{},
			queryShowMore:false,
			selectionList:[],
			initParams:{},
			//查询条件字段
			queryParams:{
				order_no:'',//订单编号
				window_no:'',//
				product_name:'',
				origin_place:'',
				steel:'',
				hardware:'',
				glass:'',
				requirement:'',
				drawing:'',
				other:'',
				floor_no:'',
				project_name:'',
				customer_name:'',
				remarks:'',
				order_date_begin:'',
				order_date_end:'',
				amount_begin:'',
				amount_end:'',
				area_begin:'',
				area_end:''
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
			this.getData()
		}
	},
	methods:{
		reload(){
			this.getData()
		},	
		initData(params={}){
      this.inited = true
      this.initParams = {...params}
      this.resetQuery()
    },
		//分页容量大小发生变化时
		sizeChange(value){
			this.requestParams.pageSize=value
			this.getData()
		},
		selectionChange(valueArrary){
			this.selectionList = valueArrary
		},
		getSummaryData({columns,data}){
			let sum = []
			columns.forEach((column,i)=>{
				if(i==0){
					sum[i] = '合计'
				}else{
					sum[i] = this.summaryData[column.property]
				}				
			})
			return sum
		},
		//获取数据
		getData() {
			this.loading=true
			orderProductApi.getList({...this.requestParams,...this.params,...this.initParams}).then(res=>{
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
		reset(){
			this.$refs.formQuery.resetFields()
			this.requestParams.currentPage = 1
		},
		//重置并查询		
		resetQuery(){
			this.reset()
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
    del({ row,$index }){
			this.$confirm('确定删除？','提示',{
				type: 'warning'
			}).then(()=>{
				orderProductApi.del(row.id).then(res=>{
					this.list.splice($index,1)
					this.dataTotal--
					this.$message.success('删除成功')
					this.$emit('del')
				})
			})
		},
		exportExcel(){
      orderProductApi.exportExcel(this.requestParams)
    },
    openLogListDialog(row){
    	this.$refs.logListDialog.open().then(that=>{
    		that.initData({product_id:row.id})
    	})
    }
	}
}
</script>