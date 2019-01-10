<!-- 
此组件初始化时不会自动加载数据，请在mounted中 this.$refs.[].initData() 初始化数据
如果放在dialog里面的吗，请在dialog的open事件中用this.$nextTick进行初始化数据
 -->
<template>
	<div>
		<!-- 查询条件 -->
		<div style='margin-bottom: 2px'>
			<div style='float:right'>
				<el-button-group>
				  <el-button type='primary' icon="el-icon-search" @click='query'></el-button>
				  <el-tooltip content='重置查询条件' placement='top'>
					  <el-button icon="el-icon-refresh" @click='resetQuery'></el-button>
					</el-tooltip>
				  <el-tooltip content='导出Excel' placement='top'>
				  	<el-button @click='exportExcel' size='mini' icon='el-icon-download'></el-button>
					</el-tooltip>
				  <el-tooltip content='显示更多查询条件' placement='top'>
					  <el-button @click='queryShowMore=!queryShowMore' size='mini'>
	          <i :class="{'el-icon-arrow-up':queryShowMore,'el-icon-arrow-down':!queryShowMore}"></i>
          	</el-button>
          </el-tooltip>
				</el-button-group>
			</div>
			<el-form ref='formQuery' :model='queryParams' label-width='68px' 
				class='c-form-condensed' inline size='mini'>
				<el-form-item label='合同编号' prop='contract_no'>
					<el-input v-model='queryParams.contract_no' clearable></el-input>
				</el-form-item>
				<el-form-item label='客户名称' prop='customer_name'>
					<el-input v-model='queryParams.customer_name' clearable></el-input>
				</el-form-item>
				<!-- 更多条件 -->
				<div v-show='queryShowMore'>
					<el-form-item label='签订公司' prop='company_name'>
						<el-input v-model='queryParams.company_name' clearable></el-input>
					</el-form-item>
					<el-form-item label='业绩公司' prop='company_name'>
						<el-input v-model='queryParams.company_name' clearable></el-input>
					</el-form-item>
					<el-form-item label='业务员' prop='salesman'>
						<el-input v-model='queryParams.salesman' clearable></el-input>
					</el-form-item>
					<el-form-item label='合同内容' prop='content'>
						<el-input v-model='queryParams.content' clearable></el-input>
					</el-form-item>
					<el-form-item label='合同金额'>
						<el-row style='width:300px'>
							<el-col :span="11">
								<el-form-item prop='contract_price_begin'>
					      	<el-input v-model='queryParams.contract_price_begin' clearable>
										<span slot="prefix">￥</span>
									</el-input>
					    	</el-form-item>
					    </el-col>
					    <el-col :span="2">至</el-col>
					    <el-col :span="11">
					    	<el-form-item prop='contract_price_end'>
					    		<el-input v-model='queryParams.contract_price_end' clearable>
										<span slot="prefix">￥</span>
									</el-input>
					      </el-form-item>
					    </el-col>
				  	</el-row>
					</el-form-item>
					<el-form-item label='合同面积'>
						<el-row style='width:300px'>
							<el-col :span="11">
								<el-form-item prop='contract_area_begin'>
					      	<el-input v-model='queryParams.contract_area_begin' clearable>
										<span slot="suffix">㎡</span>
									</el-input>
					    	</el-form-item>
					    </el-col>
					    <el-col :span="2">至</el-col>
					    <el-col :span="11">
					    	<el-form-item prop='contract_area_end'>
					    		<el-input v-model='queryParams.contract_area_end' clearable>
										<span slot="suffix">㎡</span>
									</el-input>
					      </el-form-item>
					    </el-col>
				  	</el-row>
					</el-form-item>
					<el-form-item label='签订日期'>
						<el-row style='width:300px'>
							<el-col :span="11">
								<el-form-item prop='contract_date_begin'>
					      	<el-date-picker v-model='queryParams.contract_date_begin' placeholder='开始日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
					    	</el-form-item>
					    </el-col>
					    <el-col :span="2">至</el-col>
					    <el-col :span="11">
					    	<el-form-item prop='contract_date_end'>
					    		<el-date-picker v-model='queryParams.contract_date_end' placeholder='结束日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
					      </el-form-item>
					    </el-col>
				  	</el-row>
					</el-form-item>
				</div>
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
			<el-table-column prop='contract_no' fixed label='合同编号' width='150' show-overflow-tooltip></el-table-column>
			<el-table-column prop='customer_name' label='客户名称' width='100' show-overflow-tooltip></el-table-column>
			<el-table-column prop='customer_type' label='客户类别' width='100' show-overflow-tooltip></el-table-column>
			<el-table-column prop='sign_company_name' label='签订公司' width='100' show-overflow-tooltip></el-table-column>
			<el-table-column prop='company_name' label='业绩归属公司' width='100' show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop='salesman' label='业务员' show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop='contract_price' label='合同金额' sortable='custom' align='right' width='120'>
				<template slot-scope='{row}'>
					￥{{ row.contract_price }}
				</template>
			</el-table-column>
			<el-table-column prop='contract_area' label='合同面积' sortable='custom' align='right' width='120'>
				<template slot-scope='scope'>
					<span>{{ scope.row.contract_area }}㎡</span>
				</template>
			</el-table-column>
			<el-table-column prop='contract_date' label='合同日期' sortable='custom' align='center' width='110'></el-table-column>
			<el-table-column prop='content' label='合同内容' width='110' show-overflow-tooltip></el-table-column>
			<el-table-column prop='project_total' label='项目数量' width='80' align='center'>
				<template slot-scope='{ row }'>
					<span class='c-link' @click='$refs.projectListDialog.open({contract_id:row.id})'>{{ row.project_total }}</span>
				</template>
			</el-table-column>
			<el-table-column prop='xd_order_area_total' label='已下单面积' width='120' align='right'>
				<template slot-scope='{ row }'>
					{{ row.xd_order_area_total }}㎡
				</template>
			</el-table-column>
			<el-table-column label='合同下单进度' width='120' align='center'>
				<template slot-scope='{ row }'>						
					<el-tooltip placement='left' :content='row.xd_order_area_total+"㎡（已下单面积） / "+row.contract_area+"㎡（合同面积）"'>
						<el-progress 
							text-inside 
							:stroke-width='16' 
							:status='$commonJs.getProgressPercentage(row.xd_order_area_total/row.contract_area)>=100?"success":""' 
							:percentage="$commonJs.getProgressPercentage(row.xd_order_area_total/row.contract_area)"></el-progress>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop='sc_finish_area_total' label='已生产面积' sortable='custom' align='right' width='120'>
				<template slot-scope='{row}'>
					{{ row.sc_finish_area_total }}㎡
				</template>
			</el-table-column>
			<el-table-column label='合同生产进度' width='120' align='center'>
				<template slot-scope='{ row }'>						
					<el-tooltip placement='left' :content='row.sc_finish_area_total+"㎡（已生产面积） / "+row.contract_area+"㎡（合同面积）"'>
						<el-progress 
							text-inside 
							:stroke-width='16' 
							:status='$commonJs.getProgressPercentage(row.sc_finish_area_total/row.contract_area)>=100?"success":""' 
							:percentage="$commonJs.getProgressPercentage(row.sc_finish_area_total/row.contract_area)"></el-progress>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop='cy_delivery_area_total' label='已发货面积' sortable='custom' align='right' width='120'>
				<template slot-scope='{row}'>
					{{ row.cy_delivery_area_total }}㎡
				</template>
			</el-table-column>
			<el-table-column label='合同发货进度' width='120' align='center'>
				<template slot-scope='{ row }'>						
					<el-tooltip placement='left' :content='row.cy_delivery_area_total+"㎡（已发货面积） / "+row.contract_area+"㎡（合同面积）"'>
						<el-progress 
							text-inside 
							:stroke-width='16' 
							:status='$commonJs.getProgressPercentage(row.cy_delivery_area_total/row.contract_area)>=100?"success":""' 
							:percentage="$commonJs.getProgressPercentage(row.cy_delivery_area_total/row.contract_area)"></el-progress>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop='cw_invoice_price_total' label='已开票金额' sortable='custom' align='right' width='120'>
				<template slot-scope='{row}'>
					￥{{ row.cw_invoice_price_total }}
				</template>
			</el-table-column>
			<el-table-column label='合同开票进度' width='120' align='center'>
				<template slot-scope='{ row }'>						
					<el-tooltip placement='left' :content='row.cw_invoice_price_total+"㎡（已开票金额） / "+row.contract_price+"㎡（合同金额）"'>
						<el-progress 
							text-inside 
							:stroke-width='16' 
							:status='$commonJs.getProgressPercentage(row.cw_invoice_price_total/row.contract_price)>=100?"success":""' 
							:percentage="$commonJs.getProgressPercentage(row.cw_invoice_price_total/row.contract_price)"></el-progress>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop='cw_payment_price_total' label='已回款金额' sortable='custom' align='right' width='120'>
				<template slot-scope='{row}'>
					￥{{ row.cw_payment_price_total }}
				</template>
			</el-table-column>
			<el-table-column label='回款进度' width='120' align='center'>
				<template slot-scope='{ row }'>						
					<el-tooltip placement='left' :content='row.cw_payment_price_total+"㎡（已回款金额） / "+row.cw_invoice_price_total+"㎡（合同金额）"'>
						<el-progress 
							text-inside 
							:stroke-width='16' 
							:status='$commonJs.getProgressPercentage(row.cw_payment_price_total/row.cw_invoice_price_total)>=100?"success":""' 
							:percentage="$commonJs.getProgressPercentage(row.cw_payment_price_total/row.cw_invoice_price_total)"></el-progress>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop='create_user_name' label='录入员' ></el-table-column>
			<el-table-column prop='create_time' label='创建时间' sortable='custom' width='140'>
				<template slot-scope='{ row }'>
					{{ $commonJs.formatDate(row.create_time) }}
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
	  <project-list-dialog ref='projectListDialog' :in-dialog='inDialog'></project-list-dialog>
	</div>
</template>
<script>
import contractApi from '@/api/yyzx/contract'
import projectListDialog from '@/components/yyzx/project/progress/listDialog'

export default {
	components:{ projectListDialog },
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
				contract_no:'',//订单编号
				customer_name:'',//客户单位
				sign_company_name:'',//业绩公司
				company_name:'',//业绩公司
				salesman:'',//业务员
				content:'',
				contract_price_begin:'',
				contract_price_end:'',
				contract_area_begin:'',
				contract_area_end:'',				
				contract_date_begin:'',
				contract_date_end:'',
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
			contractApi.getProgressList(this.requestParams).then(res=>{
				this.list = res.data.list
				this.dataTotal = res.data.total
				this.loading = false
				this.$emit('loaded',{ 
					total:this.dataTotal,
					list:this.list,
					params:{...this.requestParams} 
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
			contractApi.exportProgressExcel(this.requestParams)
		}
	}
}
</script>