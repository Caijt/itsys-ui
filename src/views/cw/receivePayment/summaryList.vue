<template>
	<div>
		<el-alert
	    title="以项目为单位汇总回款记录情况，点击回款记录可查看明细"
	    type="warning" 
	    :closable="false"
	    style='margin-bottom: 15px'>
		</el-alert>
		<el-form ref='formQuery' :model='queryParams' inline size='small'>
			<el-form-item prop='project_no'>
				<el-input v-model='queryParams.project_no' placeholder='项目编号' clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type='primary' @click='query'>查询</el-button>
				<el-popover>
					<el-form ref='formQueryMore' size='small' class='c-form-condensed' :model='queryParams' label-width='90px' style='max-width:600px'>
						<el-row :gutter='10'>
							<el-col :span='12'>
								<el-form-item label='项目名称' prop='project_name'>
									<el-input v-model='queryParams.project_name' clearable></el-input>
								</el-form-item>
							</el-col>
							<el-col :span='12'>
								<el-form-item label='合同编号' prop='contract_no'>
									<el-input v-model='queryParams.contract_no' clearable></el-input>
								</el-form-item>
							</el-col>
							<el-col :span='12'>
								<el-form-item label='客户名称' prop='customer_name'>
									<el-input v-model='queryParams.customer_name' clearable></el-input>
								</el-form-item>
							</el-col>
							<el-col :span='12' v-if='false'>
								<el-form-item label='回款金额' >
									<el-col :span="11">
										<el-form-item prop='order_days_min'>
							      	<el-input placeholder='金额下限' clearable></el-input>
							    	</el-form-item>
							    </el-col>
							    <el-col class="line" :span="2">-</el-col>
							    <el-col :span="11">
							    	<el-form-item >
							      	<el-input  placeholder='金额上限' clearable></el-input>
							      </el-form-item>
							    </el-col>
								</el-form-item>
							</el-col>
							<el-col :span='12' v-if='false'>
								<el-form-item label='回款进度' prop='order_days'>
									<el-col :span="11">
										<el-form-item prop='order_days_min'>
							      	<el-input v-model='queryParams.order_days_min' placeholder='进度下限' clearable></el-input>
							    	</el-form-item>
							    </el-col>
							    <el-col class="line" :span="2">-</el-col>
							    <el-col :span="11">
							    	<el-form-item prop='order_days.max'>
							      	<el-input v-model='queryParams.order_days.max' placeholder='进度上限' clearable></el-input>
							      </el-form-item>
							    </el-col>
								</el-form-item>
							</el-col>
						</el-row>								
					</el-form>
					<el-button slot='reference'>更多条件</el-button>
				</el-popover>
				<el-button @click='resetQuery'>重置</el-button>
				<el-button @click='exportExcel'>导出</el-button>
			</el-form-item>
		</el-form>
		<el-table 
			:data='list' 
			ref='tableList'
			v-loading='loading' border stripe>
			<el-table-column prop='project_no' label='项目编号' fixed width='100'></el-table-column>
			<el-table-column prop='project_name' label='项目名称' width='120' show-overflow-tooltip>
				<template slot-scope='scope'>
					<span class='c-link' @click='viewProject(scope)'>{{ scope.row.project_name }}㎡</span>
				</template>
			</el-table-column>
			<el-table-column prop='customer_name' label='客户名称' width='110' show-overflow-tooltip></el-table-column>
			<el-table-column prop='last_payment_date' label='最近回款日期' align='center' width='110'></el-table-column>
			<el-table-column prop='payment_price' label='累计回款金额' width='120' align='right'>
				<template slot-scope='scope'>
					<span>￥{{ scope.row.payment_price }}</span>
				</template>
			</el-table-column>
			<el-table-column prop='contract_price' label='项目合同款' min-width='120' align='right'>
				<template slot-scope='scope'>
					<span>￥{{ scope.row.contract_price }}</span>
				</template>
			</el-table-column>
			<el-table-column label='回款进度' min-width='120' align='center'>
				<template slot-scope='scope'>
					<el-progress text-inside :stroke-width='18' :status='scope.row.is_finish?"success":""' :percentage="getProgress(scope)"></el-progress>
				</template>
			</el-table-column>
			<el-table-column prop='update_time' label='最近更新时间' width='140'>
				<template slot-scope='scope'>
					<span>{{scope.row.update_time | formatDate}}</span>
				</template>
			</el-table-column>
			<el-table-column label='操作' fixed='right' align='center' width='90'>
				<template slot-scope='scope'>
					<el-button  size='mini' type='text' @click='orderList(scope)'>回款记录[{{scope.row.record_total}}]</el-button>	
				</template>
			</el-table-column>
		</el-table>
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
	  <order-list ref='orderList'></order-list>
	</div>
</template>
<script>
import receiveRecordApi from '@/api/cw/receivePaymentRecord'
import commonJs from '@/utils/common'
import OrderList from './orderList'

export default {
	components:{ OrderList },
	data(){
		return {
			tabIndex:'summary',
			loading: true,
			newProjectLoading: true,
			dialogShow:false,
			list:[],
			dataTotal:0,
			newProjectList:[],
			formLoading:false,
			projectList:[],
			//查询字段
			queryParams:{
				contract_no:'',//合同编号
				project_no:'',//项目编号
				project_name:'',//项目名称
				customer_name:''
			},
			//请求参数
			requestParams:{
				pageSize:10,//分页大小
				currentPage:1//当前页
			}
		}
	},
	computed:{
		//表单是否是编辑状态
		isFormEdit(){
			return this.form.id!=null
		}
	},
	created(){
		this.getData()
	},
	methods:{
		tabClick({name}){
			let ref=(name=='summary'?'tableList':'tableTodo')
			setTimeout(()=>{
				this.$refs[ref].doLayout()
			},100)
		},
		expandPlanList({row}){
			this.$refs.tableList.toggleRowExpansion(row)
		},
		sizeChange(value){
			this.requestParams.pageSize=value
			this.getData()
		},
		getData() {
			this.loading=true
			receiveRecordApi.getSummaryList(this.requestParams).then(res=>{
				this.list = res.data.list
				this.dataTotal = res.data.total
				this.loading = false
			})
		},
		//查询方法
		query(){
			Object.assign(this.requestParams,this.queryParams)
			this.getData()
		},
		resetQuery(){
			this.$refs.formQuery.resetFields()
			this.$refs.formQueryMore.resetFields()
			this.query()
		},
		exportExcel(){
			this.$message('功能未开发')
		},
		convertTextarea(text){
			return commonJs.convertTextarea(text)
		},
		getOrderDays({row}){
			let finishDate 
			if(row.is_finish){
				finishDate = this.$moment(row.finish_date)
			}else{
				finishDate = this.$moment()
			}
			return finishDate.diff(this.$moment(row.first_order_date),'days') + 1
		},
		viewProject(scope){
			this.$emit('click-project',scope.row.project_id)
		},
		orderList(scope){
			this.$refs.orderList.open(scope.row.project_id)
		},
		getProgress({row}){
			if(Number(row.payment_price) > Number(row.contract_price)) return 100
			return commonJs.round(row.payment_price / row.contract_price||0)
		}
	},
	filters:{
		point2(v){
			return (v||0).toFixed(2)
		}
	}
}
</script>