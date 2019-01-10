<template>
	<div>
		<el-alert
	    title="以项目为单位汇总生产日志记录情况，点击生产日志可查看明细"
	    type="warning" 
	    :closable="false"
	    style='margin-bottom: 15px'>
		</el-alert>
		<el-form ref='formQuery' :model='queryParams' inline size='mini'>
			<el-form-item prop='isTodo' v-if='false'>
				<el-tooltip content='生产时长已超出预期的项目，该筛选功能未开发'>
					<el-checkbox v-model="queryParams.isThisWeekTodo" label="超期项目" border></el-checkbox>
				</el-tooltip>
			</el-form-item>
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
						</el-row>								
					</el-form>
					<el-button slot='reference'>更多条件</el-button>
				</el-popover>
				<el-button @click='resetQuery'>重置</el-button>
			</el-form-item>
		</el-form>
		<el-table 
			:data='list' 
			ref='tableList'
			v-loading='loading' border stripe>
			<el-table-column prop='project_no' label='项目编号' fixed width='100'>
				<template slot-scope='scope'>
					<span class='c-link' @click='viewProject(scope)'>{{ scope.row.project_no }}</span>
				</template>
			</el-table-column>
			<el-table-column prop='project_name' label='项目名称' show-overflow-tooltip>
			</el-table-column>		
			<el-table-column prop='first_product_date' align='center' label='投产日期' width='110'></el-table-column>
			<el-table-column label='生产进度' width='120' align='center'>
				<template slot-scope='scope'>
					<el-progress text-inside :stroke-width='18' :status='scope.row.is_finish?"success":""' :percentage="getProgress(scope)"></el-progress>
				</template>
			</el-table-column>
			<el-table-column label='完成日期' width='100' align='center'>
				<template slot-scope='scope'>
					<el-tooltip v-if='scope.row.is_finish' :content='"生产时长："+getOrderDays(scope)+"天"'>
						<el-tag type='success' size='mini'>{{ scope.row.finish_date }}</el-tag>
					</el-tooltip>
					<el-tag size='mini' v-else>已下单 {{ getOrderDays(scope) }} 天</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop='order_amount' label='订单数量' align='right' width='110'></el-table-column>
			<el-table-column prop='order_area' label='订单面积' align='right' width='110'>
				<template slot-scope='scope'>
					<span>{{ scope.row.order_area }}㎡</span>
				</template>
			</el-table-column>
			<el-table-column prop='unfinish_area' label='未完成面积' align='right' width='110'>
				<template slot-scope='scope'>
					<span>{{ scope.row.unfinish_area }}㎡</span>
				</template>
			</el-table-column>
			
			<el-table-column prop='update_time' label='最近更新时间' width='140'>
				<template slot-scope='scope'>
					<span>{{scope.row.update_time | formatDate}}</span>
				</template>
			</el-table-column>
			<el-table-column label='操作' fixed='right' align='center' width='90'>
				<template slot-scope='scope'>
					<el-button  size='mini' type='text' @click='orderList(scope)'>生产日志[{{scope.row.record_total}}]</el-button>	
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
import productApi from '@/api/sc/product'
import commonJs from '@/utils/common'
import OrderList from './orderList'

const formInit = {
	id:null,
	project_id:null,
	project_name:'',
	contract_no:'',	
	order_no:'',
	order_area:0,
	order_date:'',
	is_finish:0,
	product_status:'',
	expect_delivery:'',
	glass_expect_delivery:'',
	finish_date:'',

}
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
			form:Object.assign({},formInit),
			formRules:{
				order_no:[{ required:true, message:'请填写下单编号' }],
				order_date:[{	required:true,message:'请填写下单日期' }],
				finish_date:[{	required:true,message:'请填写完成日期' }],
				order_area:[
				{
					type:'number',message:'请输入数字'
				},
				{ 
					validator(rule,value,callback){
						if(value>0){
							callback()
						}else{
							callback(new Error('下单面积必须大于0'))
						}
					},
				
				}],
			},
			formLoading:false,
			projectList:[],
			//查询字段
			queryParams:{
				contract_no:'',//合同编号
				project_no:'',//项目编号
				project_name:'',//项目名称
				order_no:'',//下单编号
				//下单天数
				order_days:{
					min:'',
					max:''
				},
				isTodo:false
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
		sizeChange(value){
			this.requestParams.pageSize=value
			this.getData()
		},
		getData() {
			this.loading=true
			productApi.getSummaryList(this.requestParams).then(res=>{
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
			if(row.unfinish_area > row.order_area) return 0
			return commonJs.round((row.order_area-row.unfinish_area) / row.order_area) 
		}
	},
	filters:{
		point2(v){
			return (v||0).toFixed(2)
		}
	}
}
</script>