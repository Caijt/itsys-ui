<!-- 
此组件初始化时不会自动加载数据，请在mounted中 this.$refs.[].initData() 初始化数据
如果放在dialog里面的吗，请在dialog的open事件中用this.$nextTick进行初始化数据
 -->
<template>
	<div>
		<!-- 查询条件 -->
		<div style='margin-bottom: 2px' v-show='!hideQuery'>
			<div style='float:right;'>
				<span><el-button type='primary' @click='query' size='mini'>查询</el-button></span>
				<span><el-button @click='resetQuery' size='mini'>重置</el-button ></span>
				<span><el-button @click='queryShowMore=!queryShowMore' size='mini' icon="">
					{{queryShowMore?"收起":"更多"}}
					<i :class="{'el-icon-arrow-up':queryShowMore,'el-icon-arrow-down':!queryShowMore}"></i>
				</el-button></span>
			</div>
			<el-form ref='formQuery' :model='queryParams' label-width='68px' 
				class='c-form-condensed' inline size='mini'>
				<el-form-item label='合同编号' prop='contract_no'>
					<el-input v-model.trim='queryParams.contract_no' clearable></el-input>
				</el-form-item>
				<el-form-item label='客户名称' prop='customer_name'>
					<el-input v-model.trim='queryParams.customer_name' clearable></el-input>
				</el-form-item>
				<!-- 更多条件 -->
				<div v-show='queryShowMore'>
					<el-form-item label='签订公司' prop='company_name'>
						<el-input v-model.trim='queryParams.company_name' clearable></el-input>
					</el-form-item>
					<el-form-item label='业绩公司' prop='company_name'>
						<el-input v-model.trim='queryParams.company_name' clearable></el-input>
					</el-form-item>
					<el-form-item label='业务员' prop='salesman'>
						<el-input v-model.trim='queryParams.salesman' clearable></el-input>
					</el-form-item>
					<el-form-item label='合同内容' prop='content'>
						<el-input v-model.trim='queryParams.content' clearable></el-input>
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
			<el-table-column prop='contract_no' fixed label='合同编号' width='150' show-overflow-tooltip>
				<template slot-scope='{row}'>
					<span class='c-link' @click='$refs.contractInfo.open(row.id)'>{{ row.contract_no }}</span>
				</template>
			</el-table-column>
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
			<el-table-column prop='create_user_name' label='录入员' ></el-table-column>
			<el-table-column prop='create_time' label='创建时间' sortable='custom' width='120'>
				<template slot-scope='{ row }'>
					{{ $commonJs.formatDate(row.create_time) }}
				</template>
			</el-table-column>
			<el-table-column prop='update_time' label='更新时间' sortable='custom' width='120'>
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
	  <contract-info :in-dialog='inDialog' ref='contractInfo'/>
	</div>
</template>
<script>
import contractApi from '@/api/yyzx/contract'
import contractInfo from '@/components/yyzx/contract/info'

export default {
	components:{ contractInfo },
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
		}
	},
	data(){
		return {
			inited:false,
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
				sortOrder:'',
				noPage:this.noPage?1:0
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
			contractApi.getList(this.requestParams).then(res=>{
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
		exportExcel(){
			contractApi.exportExcel(this.requestParams)
		}
	}
}
</script>