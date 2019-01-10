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
				<el-form-item label='发货编号' prop='no'>
					<el-input v-model='queryParams.no' order_no></el-input>
				</el-form-item>
				<el-form-item label='订单编号' prop='order_no'>
					<el-input v-model='queryParams.order_no' clearable></el-input>
				</el-form-item>
				<el-form-item label='项目名称' prop='project_name'>
					<el-input v-model='queryParams.project_name' clearable></el-input>
				</el-form-item>
				<!-- 更多条件 -->
				<div v-show='queryShowMore'>
					<el-form-item label='编号' prop='no'>
						<el-input v-model='queryParams.no' ></el-input>
					</el-form-item>
					<el-form-item label='发货状态' prop='status'>
						<el-select  v-model='queryParams.status' collapse-tags multiple>
							<el-option label='未提交' :value='0'></el-option>
							<el-option label='已提交' :value='1'></el-option>
							<el-option label='被撤回' :value='2'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label='收货单位' prop='receive_unit'>
						<el-input  v-model='queryParams.receive_unit'></el-input>
					</el-form-item>
					<el-form-item label='收货地址' prop='receive_address'>
						<el-input  v-model='queryParams.receive_address'></el-input>
					</el-form-item>
					<el-form-item label='收货人' prop='receive_name'>
						<el-input  v-model='queryParams.receive_name'></el-input>
					</el-form-item>
					<el-form-item label='收货电话' prop='receive_tel'>
						<el-input  v-model='queryParams.receive_tel'></el-input>
					</el-form-item>
					<el-form-item label='合同号' prop='contract_no'>
						<el-input  v-model='queryParams.contract_no'></el-input>
					</el-form-item>
					<el-form-item label='调拨单号' prop='db_no'>
						<el-input  v-model='queryParams.db_no'></el-input>
					</el-form-item>
					<el-form-item label='发货申请' prop='fh_no'>
						<el-input  v-model='queryParams.fh_no' placeholder='发货申请编号'></el-input>
					</el-form-item>
					<el-form-item label='订单号' prop='order_no'>
						<el-input  v-model='queryParams.order_no'></el-input>
					</el-form-item>
					<el-form-item label='业务单位' prop='salesman_unit'>
						<el-input  v-model='queryParams.salesman_unit'></el-input>
					</el-form-item>
					<el-form-item label='业务员' prop='salesman_name'>
						<el-input  v-model='queryParams.salesman_name'></el-input>
					</el-form-item>
					<el-form-item label='业务电话' prop='salesman_tel'>
						<el-input  v-model='queryParams.salesman_tel'></el-input>
					</el-form-item>
					<el-form-item label='交付方式' prop='method'>
						<el-input  v-model='queryParams.method'></el-input>
					</el-form-item>
					<el-form-item label='项目编号' prop='project_no'>
						<el-input v-model='queryParams.project_no' clearable></el-input>
					</el-form-item>
					<el-form-item label='客户名称' prop='customer_name'>
						<el-input v-model='queryParams.customer_name' clearable></el-input>
					</el-form-item>
					<el-form-item label='业绩公司' prop='company_name'>
						<el-input v-model='queryParams.company_name' clearable></el-input>
					</el-form-item>
					<el-form-item label='业务员' prop='salesman'>
						<el-input v-model='queryParams.salesman' clearable></el-input>
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
			<el-table-column prop='sign' fixed label='发货车辆编号' width='120' show-overflow-tooltip>
				<template slot-scope='{row}'>
					{{ row.sign }}
				</template>
			</el-table-column>
			<el-table-column prop='state' label='发货状态' width='80' align='center'>
			</el-table-column>
			<el-table-column prop='no' label='车牌号码' width='120' show-overflow-tooltip />
			<el-table-column prop='name' label='司机姓名' width='120' show-overflow-tooltip />
			<el-table-column prop='tel' label='司机手机' width='120' show-overflow-tooltip />
			<el-table-column prop='unit' label='车辆单位' width='120' show-overflow-tooltip />
			<el-table-column prop='orders' label='发货订单号' width='120' show-overflow-tooltip />
			<el-table-column prop='task_no' label='任务编号' width='120' show-overflow-tooltip>
				<template slot-scope='{row}'>
					<span class='c-link'>{{ row.task_no }}</span>
				</template>
			</el-table-column>
			<el-table-column prop='project' label='项目名称' width='120' show-overflow-tooltip></el-table-column>
			<el-table-column prop='contract_no' label='合同编号' width='120' show-overflow-tooltip></el-table-column>
			<el-table-column prop='db_no' label='调拨单号' width='120' show-overflow-tooltip></el-table-column>
			<el-table-column prop='task_order' label='任务订单号' width='120' show-overflow-tooltip></el-table-column>
			<el-table-column prop='fh_no' label='发货申请编号' width='120' show-overflow-tooltip></el-table-column>
			<el-table-column prop='salesman_unit' label='业务单位' width='120' show-overflow-tooltip></el-table-column>
			<el-table-column prop='salesman_name' label='业务员' width='80' show-overflow-tooltip></el-table-column>
			<el-table-column prop='salesman_tel' label='业务员联系电话' width='120' show-overflow-tooltip></el-table-column>
			<el-table-column prop='plan_send_date' label='计划送货日期' width='120' sortable='custom'></el-table-column>
			<el-table-column prop='receive_unit' label='收货单位' width='120' show-overflow-tooltip></el-table-column>
			<el-table-column prop='method' label='交付方式' width='80' show-overflow-tooltip></el-table-column>
			<el-table-column prop='receive_address' label='收货单位' width='120' show-overflow-tooltip></el-table-column>
			<el-table-column prop='receive_name' label='收货人' width='80' show-overflow-tooltip></el-table-column>
			<el-table-column prop='receive_tel' label='收货人电话' width='120' show-overflow-tooltip></el-table-column>		
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
	</div>
</template>
<script>
import deliveryCarApi from '@/api/cy/deliveryCar'

export default {
	components:{  },
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
			loading: false,			
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
				is_finish:'',//订单状态
				isDelay:0,//超期订单
				order_date_begin:'',
				order_date_end:'',
				delivery_date_begin:'',
				delivery_date_end:'',
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
			this.loading=true
			deliveryCarApi.getList(this.requestParams).then(res=>{
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
			this.requestParams.currentPage = 1
			this.query()
		},
		sortChange({prop,order}){
			this.requestParams.sortProp = prop
			this.requestParams.sortOrder = order
			this.getData()
		},
		del({ row,$index }){
			let confirmText = '确定删除？'
			this.$confirm(confirmText,'提示',{
				type: 'warning'
			}).then(()=>{
				deliveryCarApi.del(row.id).then(res=>{
					this.$message.success('删除成功')
					this.reload()
				})
			})
		},
		clear(){
			this.list = []
		}
	}
}
</script>