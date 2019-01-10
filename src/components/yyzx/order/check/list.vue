<!-- 
此组件初始化时不会自动加载数据，请在mounted中 this.$refs.[].initData() 初始化数据
如果放在dialog里面的吗，请在dialog的open事件中用this.$nextTick进行初始化数据
 -->
<template>
	<div>
		<!-- 查询条件 -->
		<div style='margin-bottom: 2px' v-show='!hideQuery'>
			<div style='float:right;margin-top: 1px'>
				<span><el-button type='primary' @click='query' size='mini'>查询</el-button></span>
				<span><el-button @click='resetQuery' size='mini'>重置</el-button ></span>
				<span><el-button @click='queryShowMore=!queryShowMore' size='mini' icon="">
					{{queryShowMore?"收起":"更多"}}
					<i :class="{'el-icon-arrow-up':queryShowMore,'el-icon-arrow-down':!queryShowMore}"></i>
				</el-button></span>
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
				<div v-show='queryShowMore'>
					<el-form-item label='订单类别' prop='order_type'>
						<el-input v-model='queryParams.order_type' clearable></el-input>
					</el-form-item>
					<el-form-item label='订单批次' prop='order_batch'>
						<el-input v-model='queryParams.order_batch' clearable></el-input>
					</el-form-item>
					<el-form-item label='安装方式' prop='install_method'>
						<el-select v-model='queryParams.install_method' clearable style='width:160px'>
							<el-option value='整窗安装'></el-option>
							<el-option value='非整窗安装'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label='合同下单' prop='is_contract'>
						<el-select v-model='queryParams.is_contract' clearable style='width:160px'>
							<el-option label='有' :value='1'></el-option>
							<el-option label='无' :value='0'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label='系列' prop='series'>
						<el-input v-model='queryParams.series' clearable></el-input>
					</el-form-item>
					<el-form-item label='窗型' prop='model'>
						<el-input v-model='queryParams.model' clearable></el-input>
					</el-form-item>
					<el-form-item label='闭窗器' prop='window_style'>
						<el-input v-model='queryParams.window_style' placeholder='闭窗器样式' clearable></el-input>
					</el-form-item>
					<el-form-item label='型材颜色' prop='color'>
						<el-input v-model='queryParams.color' clearable></el-input>
					</el-form-item>
					<el-form-item label='备注' prop='product_status'>
						<el-input v-model='queryParams.product_status' clearable></el-input>
					</el-form-item>
					<el-form-item label='订单状态' prop='is_finish'>
						<el-select v-model='queryParams.is_finish' clearable style='width:160px'>
							<el-option label='进行中' :value='0'></el-option>
							<el-option label='完成' :value='1'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label='玻璃加工' prop='glass_expect_delivery'>
						<el-input v-model='queryParams.glass_expect_delivery' clearable></el-input>
					</el-form-item>
					<el-form-item label='项目编号' prop='project_no'>
						<el-input v-model='queryParams.project_no' clearable></el-input>
					</el-form-item>
					<el-form-item label='合同编号' prop='contract_no'>
						<el-input v-model='queryParams.contract_no' clearable></el-input>
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
			<el-table-column prop='order_no' fixed label='订单编号' width='120' show-overflow-tooltip>
				<template slot-scope='{row}'>
					<span class='c-link' @click='$refs.orderInfo.open(row.id)'>{{ row.order_no||'（待生成）'}}</span>
				</template>
			</el-table-column>
			<el-table-column prop='project_no' label='项目编号' width='100'>
				<template slot-scope='scope'>
					<span @click='openProjectDetails(scope.row.project_id)' class='c-link'>{{ scope.row.project_no }}</span>					
				</template>
			</el-table-column>
			<el-table-column prop='project_name' label='项目名称' width='120' show-overflow-tooltip></el-table-column>
			<el-table-column prop='order_area' label='下单面积' sortable='custom' align='right' width='110'>
				<template slot-scope='scope'>
					<span>{{ scope.row.order_area }}㎡</span>
				</template>
			</el-table-column>
			<el-table-column prop='sc_finish_area_total' label='生产完成面积' sortable='custom' align='right' width='120'>
				<template slot-scope='{ row }'>
					<span>{{ row.sc_finish_area_total }}㎡</span>
				</template>
			</el-table-column>
			<el-table-column prop='sc_self_finish_area_total' label='车间生产面积' sortable='custom' align='right' width='120'>
				<template slot-scope='{ row }'>
					<span>{{ row.sc_self_finish_area_total }}㎡</span>
				</template>
			</el-table-column>
			<el-table-column prop='sc_out_finish_area_total' label='外协生产面积' sortable='custom' align='right' width='120'>
				<template slot-scope='{ row }'>
					<span>{{ row.sc_out_finish_area_total }}㎡</span>
				</template>
			</el-table-column>
			<el-table-column prop='order_amount' label='下单数量' sortable='custom' align='right' width='110'>
			</el-table-column>
			<el-table-column prop='order_type' label='订单类别' show-overflow-tooltip></el-table-column>
			<el-table-column prop='batch' label='订单批次' show-overflow-tooltip></el-table-column>
			<el-table-column prop='install_method' label='安装方式' show-overflow-tooltip></el-table-column>
			<el-table-column prop='is_contract' width='100' label='合同下单' sortable='custom' align='center'>
				<template slot-scope='{row}'>
					<el-tag size='mini' type="success" v-if='row.is_contract'>有</el-tag>
					<el-tag size='mini' type='info' v-else >无</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop='series' label='系列' show-overflow-tooltip></el-table-column>
			<el-table-column prop='model' label='窗型' show-overflow-tooltip></el-table-column>
			<el-table-column prop='window_style' label='闭窗器样式' width='100' show-overflow-tooltip></el-table-column>
			<el-table-column prop='color' label='型材颜色' show-overflow-tooltip></el-table-column>
			<el-table-column prop='product_status' label='备注' show-overflow-tooltip></el-table-column>
			<el-table-column prop='order_date' label='下单日期' sortable='custom' align='center' width='110'></el-table-column>
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
			<el-table-column prop='update_user_name' label='录入员' ></el-table-column>
			<el-table-column prop='create_time' label='创建时间' sortable='custom' width='140'>
				<template slot-scope='{ row }'>
					{{ $commonJs.formatDate(row.create_time) }}
				</template>
			</el-table-column>
			<el-table-column prop='update_time' label='更新时间' sortable='custom' width='140'>
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
		<el-pagination 
			v-if='!noPage'
			style='margin-top: 10px'
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
	  <order-info :in-dialog='inDialog' ref='orderInfo' />
	</div>
</template>
<script>
import orderApi from '@/api/yyzx/order'
import orderInfo from '@/components/yyzx/order/info'

export default {
	components:{ orderInfo },
	props:{
		size:{
			type:String,
			default:''
		},
		maxHeight:{
			default:350
		},
		params:{
			default:()=>({
				
			})
		},
		inDialog:{
			type:Boolean,
			default:false
		},
		init:{
			type:Boolean,
			default:false
		},
		hideQuery:{
			type:Boolean,
			default:false
		},
		noPage:{
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
				install_method:'',
				is_contract:'',//有无合同下单
				color:'',//型材颜色
				series:'',
				model:'',
				window_style:'',
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
				sortOrder:'',
				noPage:this.noPage?1:0
			}			
		}
	},
	created(){
		this.$options.components.projectDetails = ()=>import('@/components/projectDetails')
		//this.getData()
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
			orderApi.getProgressList(this.requestParams).then(res=>{
				this.list = res.data.list
				this.dataTotal = res.data.total
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
		del({ row,$index }){
			let confirmText = '确定删除？删除后的订单可以在订单回收站进行恢复'
			this.$confirm(confirmText,'提示',{
				type: 'warning'
			}).then(()=>{
				orderApi.del(row.id).then(res=>{
					this.$message.success('删除成功')
					this.reload()					
				})
			})
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
	}
}
</script>