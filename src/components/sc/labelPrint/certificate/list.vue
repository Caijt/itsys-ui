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
				<el-form-item label='产品名称' prop='product_name'>
					<el-input v-model='queryParams.product_name' clearable></el-input>
				</el-form-item>
				<!-- 更多条件 -->
				<template v-if='queryShowMore'>
					<el-form-item label='产品编号' prop='product_no'>
						<el-input v-model='queryParams.product_no' clearable></el-input>
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
					<el-form-item label='订单日期'>
						<el-row style='width:300px'>
							<el-col :span="11">
								<el-form-item prop='product_date_begin'>
					      	<el-date-picker v-model='queryParams.product_date_begin' placeholder='开始日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
					    	</el-form-item>
					    </el-col>
					    <el-col :span="2">至</el-col>
					    <el-col :span="11">
					    	<el-form-item prop='product_date_end'>
					    		<el-date-picker v-model='queryParams.product_date_end' placeholder='结束日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
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
			<el-table-column
	      type="selection"
	      align='center'
	      width="50">
	    </el-table-column>
			<el-table-column v-if='!hideOrderFields' prop='order_no' fixed label='订单编号' width='130' show-overflow-tooltip>
				<template slot-scope='{ row }'>
          <span >{{ row.order_no }}</span>
        </template>
			</el-table-column>
			<el-table-column v-if='!hideOrderFields' prop='project_name' label='项目名称' show-overflow-tooltip></el-table-column>
			<el-table-column v-if='!hideOrderFields' prop='customer_name' label='客户名称' show-overflow-tooltip></el-table-column>
			<el-table-column v-if='!hideOrderFields' prop='order_date' label='订单日期' sortable='custom' width='110'></el-table-column>
			<el-table-column prop='product_name' label='产品名称' show-overflow-tooltip></el-table-column>
			<el-table-column prop='product_no' label='产品编号' show-overflow-tooltip></el-table-column>
			<el-table-column prop='width' label='规格尺寸' width='150' show-overflow-tooltip>
				<template slot-scope='{row}'>
					{{ Number(row.width)}}mm(W)*{{  Number(row.height) }}mm(H)
				</template>
			</el-table-column>
			<el-table-column prop='amount' label='数量' align='right' width='70' sortable='custom' show-overflow-tooltip></el-table-column>
			<el-table-column prop='remarks' label='备注' show-overflow-tooltip></el-table-column>			
			<el-table-column prop='create_user_name' label='录入员' ></el-table-column>
			<el-table-column prop='create_time' label='创建时间' sortable='custom' width='130'>
				<template slot-scope='{ row }'>
					{{ $commonJs.formatDate(row.create_time) }}
				</template>
			</el-table-column>
			<el-table-column prop='update_time' label='更新时间' sortable='custom' width='130'>
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
	  <order-info :in-dialog='inDialog' ref='orderInfo' />
	</div>
</template>
<script>
import certificateApi from '@/api/sc/certificate'
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
		hideOrderFields:{
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
			//查询条件字段
			queryParams:{
				order_no:'',//订单编号
				project_name:'',//项目名称
				customer_name:'',//客户单位	
				product_name:'',
				product_no:'',
				remarks:'',
				order_date_begin:'',
				order_date_end:''
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
		selectionChange(valueArrary){
			this.selectionList = valueArrary
		},
		//获取数据
		getData() {
			this.loading=true
			certificateApi.getList(this.requestParams).then(res=>{
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
    clear(){
    	this.list = []
    	return this
    },
    del({ row,$index }){
			this.$confirm('确定删除？','提示',{
				type: 'warning'
			}).then(()=>{
				certificateApi.del(row.id).then(res=>{
					this.list.splice($index,1)
					this.dataTotal--
					this.$message.success('删除成功')
					this.$emit('del')
				})
			})
		},
		exportExcel(){
      certificateApi.exportExcel(this.requestParams)
    },
	}
}
</script>