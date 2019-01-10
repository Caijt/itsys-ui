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
					<el-form-item label='订单面积'>
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
					<el-form-item label='生产进度' v-if='!hideSubmitField'>
            <el-row style='width:300px'>
              <el-col :span="11">
                <el-form-item prop='produce_progress_begin'>
                  <el-input v-model='queryParams.produce_progress_begin' placeholder='最小值' clearable>
                    <span slot="suffix">%</span>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">至</el-col>
              <el-col :span="11">
                <el-form-item prop='produce_progress_end'>
                  <el-input v-model='queryParams.produce_progress_end' placeholder='最小值' clearable>
                    <span slot="suffix">%</span>
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
			<el-table-column prop='order_no' fixed label='订单编号' width='120' show-overflow-tooltip>
				<template slot-scope='{ row }'>
          <span class='c-link' @click='openOrderDetails(row.id)'>{{ row.order_no }}</span>
        </template>
			</el-table-column>
			<el-table-column prop='project_name' width='120' label='项目名称' show-overflow-tooltip></el-table-column>
			<el-table-column prop='contract_no' width='120' label='合同号' show-overflow-tooltip></el-table-column>
			<el-table-column prop='customer_name' width='120' label='客户名称' show-overflow-tooltip></el-table-column>
			<el-table-column 
				prop='order_type' 
				label='订单类型' 
				sortable='custom' 
				width='100' />
			<el-table-column 
				prop='order_date' 
				label='订单日期' 
				sortable='custom' 
				width='100' />
			<el-table-column prop='delivery_date' label='交货日期' sortable='custom' width='100'></el-table-column>
			<el-table-column 
				prop='domain' 
				label='地盘' 
				sortable='custom' 
				width='100'
				show-overflow-tooltip />
			<el-table-column 
				prop='remarks' 
				label='备注' 
				sortable='custom' 
				show-overflow-tooltip 
				width='100' />
			<el-table-column prop='amount_total' label='产品数量' sortable='custom' align='right' width='100'>
				<template slot-scope='{row}'>
					<span class='c-link' @click='$refs.productListDialog.open({order_id:row.id})'>{{row.amount_total}} 樘</span>
				</template>
			</el-table-column>
			<el-table-column prop='area_total' label='订单面积' sortable='custom' align='right' width='110'>
				<template slot-scope='{row}'>
					{{row.area_total}}㎡
				</template>
			</el-table-column>
			<el-table-column 
				v-if='!hideSubmitField'
        prop='produce_progress' 
        label='生产进度' 
        width='120' 
        sortable='custom' 
        align='center'>
        <template slot-scope='{ row }'>           
          <el-tooltip placement='left' :content='row.sc_produce_area_total+"㎡（已生产面积） / "+row.area_total+"㎡（订单面积）"'>
            <el-progress 
              text-inside 
              :stroke-width='16' 
              :status='Number(row.produce_progress)>=100?"success":""' 
              :percentage="Number(row.produce_progress)>=100?100:Number(row.produce_progress)"></el-progress>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column v-if='!hideSubmitField' prop='produce_status_remarks' label='生产状态' sortable='custom' width='110' show-overflow-tooltip />
      <el-table-column v-if='!hideSubmitField' prop='sc_produce_amount_total' label='已生产数量' align='right' width='110' sortable='custom' show-overflow-tooltip>
				<template slot-scope='{row}'>
					{{row.sc_produce_amount_total}} 樘
				</template>
			</el-table-column>
			<el-table-column v-if='!hideSubmitField' prop='no_produce_amount' label='未生产数量' align='right' width='110' sortable='custom' show-overflow-tooltip>
				<template slot-scope='{row}'>
					{{row.no_produce_amount}} 樘
				</template>
			</el-table-column>
			<el-table-column v-if='!hideSubmitField' prop='sc_produce_area_total' label='已生产面积' width='110' align='right'show-overflow-tooltip>
				<template slot-scope='{row}'>
					{{ row.sc_produce_area_total }}㎡
				</template>
			</el-table-column>
			<el-table-column v-if='!hideSubmitField' prop='no_produce_area' sortable='custom'  label='未生产面积' width='110' align='right' show-overflow-tooltip>
				<template slot-scope='{row}'>
					{{ row.no_produce_area }}㎡
				</template>
			</el-table-column>			
			<el-table-column v-if='!hideSubmitField' prop='sc_produce_log_total' label='生产日志' sortable='custom' align='center' width='100'>
				<template slot-scope='{row}'>
					<span class='c-link' @click='openLogListDialog(row)'>{{ row.sc_produce_log_total }}</span>
				</template>
			</el-table-column>
			<el-table-column prop='create_user_name' label='录入员'></el-table-column>
			<el-table-column v-if='!hideEditField' prop='create_time' label='创建时间' sortable='custom' width='130'>
				<template slot-scope='{ row }'>
					{{ $commonJs.formatDate(row.create_time) }}
				</template>
			</el-table-column>
			<el-table-column v-if='!hideEditField' prop='update_time' label='更新时间' sortable='custom' width='130'>
				<template slot-scope='{ row }'>
					{{ $commonJs.formatDate(row.update_time) }}
				</template>
			</el-table-column>
			<el-table-column v-if='!hideSubmitField' prop='submit_time' label='提交时间' sortable='custom' width='130'>
				<template slot-scope='{ row }'>
					{{ $commonJs.formatDate(row.submit_time) }}
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
	  <order-details :in-dialog='inDialog' ref='orderDetails' />
	  <product-list-dialog :in-dialog='inDialog' ref='productListDialog' />
	  <log-list-dialog :in-dialog='inDialog' ref='logListDialog'/>
	</div>
</template>
<script>
import orderApi from '@/api/yyzx/windowOrder'
import productListDialog from './product/listDialog'
import orderDetails from './details'
import logListDialog from './log/listDialog'

export default {
	components:{ orderDetails, productListDialog, logListDialog },
	props:{
		size:{
			type:String,
			default:''
		},
		sortProp:{
			type:String,
			default:'submit_time'
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
		hideEditField:{
			type:Boolean,
			default:false
		},
		hideSubmitField:{
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
				input_status:1,
				order_no:'',//订单编号
				project_name:'',//项目名称
				customer_name:'',//客户单位
				contract_no:'',
				domain:'',
				remarks:'',
				order_type:'',
				order_date_begin:'',
				order_date_end:'',
				delivery_date_begin:'',
				delivery_date_end:'',
				amount_begin:'',
				amount_end:'',
				area_begin:'',
				area_end:''
			},
			//数据请求的参数
			requestParams:{
				pageSize:10,//分页大小
				currentPage:1,//当前页
				sortProp:this.sortProp,
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
					sum[i] = '合计'
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
			orderApi.getList({...this.requestParams,...this.params}).then(res=>{
				this.list = res.data.list
				this.dataTotal = res.data.total
				this.summaryData = res.data.summary
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
		sortChange({prop,order}){
			this.requestParams.sortProp = prop
			this.requestParams.sortOrder = order
			this.getData()
		},
		openOrderDetails(id){
      this.$refs.orderDetails.open().then(that=>{
      	that.get(id)
      })
    },
    clear(){
    	this.list = []
    },
    del({ row,$index }){
			this.$confirm('确定删除此订单吗？','提示',{
				type: 'warning'
			}).then(()=>{
				orderApi.del(row.id).then(res=>{
					this.list.splice($index,1)
					this.dataTotal--
					this.$message.success('删除成功')
					this.reload()
					this.$emit('del')
				})
			})
		},
		undo({ row,$index }){
			this.$confirm('确定撤销此订单吗？撤销后订单将回到待提交订单列表中。（已产生生产日志的订单无法撤销）','提示',{
				type: 'warning'
			}).then(()=>{				
				orderApi.undo(row.id).then(res=>{
					this.list.splice($index,1)
					this.dataTotal--
					this.$message.success('撤销成功')
					this.reload()
					this.$emit('undo')
				})
			})
		},
		exportExcel(){
      orderApi.exportExcel(this.requestParams)
    },
    openLogListDialog(row){
    	this.$refs.logListDialog.open().then(that=>{
    		that.initData({order_id:row.id})
    	})
    }
	}
}
</script>