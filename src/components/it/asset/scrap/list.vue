<!-- 
此组件初始化时不会自动加载数据，请在mounted中 this.$refs.[].initData()
如果放在dialog里面的吗，请在dialog的open事件中用this.$nextTick进行加载
 -->
<template>
	<div>
		<!-- 查询条件 -->
		<div style='margin-bottom: 2px' v-show='!hideQuery'>
			<div style='float:right;'>
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
			<el-form ref='formQuery' :model='queryParams' class='c-form-condensed' label-width='68px' inline size='mini'>
				<el-form-item label='资产编号' prop='asset_no'>
					<el-input v-model='queryParams.asset_no' clearable></el-input>
				</el-form-item>
				<div v-show='queryShowMore'>
					<el-form-item label='资产型号' prop='asset_model'>
						<el-input v-model='queryParams.asset_model' clearable></el-input>
					</el-form-item>
					<el-form-item label='报废日期'>
						<el-row style='width:300px'>
							<el-col :span="11">
								<el-form-item prop='scrap_date_begin'>
					      	<el-date-picker v-model='queryParams.scrap_date_begin' placeholder='开始日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
					    	</el-form-item>
					    </el-col>
					    <el-col :span="2">至</el-col>
					    <el-col :span="11">
					    	<el-form-item prop='scrap_date_end'>
					    		<el-date-picker v-model='queryParams.scrap_date_end' placeholder='结束日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
					      </el-form-item>
					    </el-col>
				  	</el-row>
					</el-form-item>
				</div>
			</el-form>
		</div> 
		<!--/ 查询条件 -->		
		<!-- 数据表格 -->
		<el-table 
			:data='list' 
			ref='tableList'
			v-loading='loading'
			highlight-current-row
			border 
			stripe
			row-key='id'
			:size='size'
			:max-height='maxHeight' 
			show-summary
			@selection-change='selectionChange'
			:summary-method='getSummaryData'
			@sort-change='sortChange'>			
			<el-table-column 
				fixed
				v-if='showSelection'
				type='selection' 
				align='center' 
				width='35' />
			<el-table-column 
				prop='scrap_date' 
				width='100' 
				sortable='custom' 
				label='报废日期' />
			<el-table-column 
				v-if='!hideAssetFields'
				prop='asset_no' 
				align='center'
				label='资产编号' 
				sortable='custom' 
				width='100'>
					<template slot-scope='{row}'>
						<span class='c-link' @click='openAssetDetails(row)'>{{row.asset_no}}</span>
					</template>
			</el-table-column>
			<el-table-column 
				v-if='!hideAssetFields'
				prop='asset_model' 
				min-width='150' 
				label='资产型号' 
				show-overflow-tooltip />
			<el-table-column prop='amount' label='报废数量' width='120' show-overflow-tooltip />
			<el-table-column prop='reason' label='报废原因' min-width='150' show-overflow-tooltip />
			<el-table-column 
				width='90' 
				prop='create_user_name' 
				label='录入员' 
				show-overflow-tooltip/>
			<el-table-column 
				prop='create_time' 
				width='120' 
				label='创建时间' 
				sortable='custom'>
				<template slot-scope='{ row }'>
					<span>{{ row.create_time | formatDate }}</span>
				</template>
			</el-table-column>
			<el-table-column 
				prop='update_time' 
				width='120' 
				label='更新时间' 
				sortable='custom'>
				<template slot-scope='{ row }'>
					<span>{{ row.update_time | formatDate }}</span>
				</template>
			</el-table-column>
			<!-- slot[column] -->
			<slot name='column'></slot>
			<!--/ slot[column]-->
		</el-table>
		<!-- 数据表格 -->
		<!-- 分页 -->
		<el-pagination style='margin-top: 10px'
			v-if='!noPage'
	    :page-sizes = "[10, 20, 50, 100]"
	    :page-size= "requestParams.pageSize"
	    :current-page.sync = "requestParams.currentPage"
	    layout="total, sizes, prev, pager, next, jumper"
	    :total="dataTotal"
	    @size-change='sizeChange'
	    @current-change='getData' />
	  <!--/ 分页 -->
	  <asset-details v-if='!hideAssetFields' :in-dialog='inDialog' ref='assetDetails'/>
	</div>
</template>
<script>
import assetApi from '@/api/it/assetScrapRecord'
import assetDetails from '../details'
export default {
	components:{ assetDetails },
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
		noPage:{
			type:Boolean,
			default:false
		},
		init:{
			type:Boolean,
			default:false
		},
		showMore:{
			type:Boolean,
			default:false
		},
		showSelection:{
			type:Boolean,
			default:false
		},
		hideAssetFields:{
			type:Boolean,
			default:false
		}
	},
	data(){
		return {
			inited:false,
			loading: false,
			dialogShow:false,
			list:[],
			dataTotal:0,
			formLoading:false,
			projectList:[],
			summaryData:{},
			selectionList:[],
			queryShowMore:this.showMore,
			initParams:{},
			//查询条件字段
			queryParams:{
				no:'',//项目编号
				project_name:'',//项目名称
				invoice_no:'',//开票号
				remarks:'',
				invoice_company_name:'',//开票号
				contract_no:'',//合同编号
				customer_name:'',//客户单位				
				company_name:'',//业绩公司
				salesman:'',//业务员
				invoice_date_begin:'',
				invoice_date_end:''
			},
			//数据请求的参数
			requestParams:{
				pageSize:10,//分页大小
				currentPage:1,//当前页
				sortProp:'',
				sortOrder:'',
				noPage:this.noPage?1:0,
				inCompany:1
			}
		}
	},
	created(){
		
	},
	mounted(){
    if(this.init){
      this.inited = true
      this.initData()
    }    
  },
	methods:{
		//初始化数据
		initData(params={}){
			this.initParams = {...params}
			this.resetQuery()
		},
		//刷新数据
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
		getSummaryData({columns,data}){
      let sum = []
      let labelIndex = this.showSelection?1:0
      columns.forEach((column,i)=>{
        if(i==labelIndex){
          sum[i]='合计'
        }else{
          sum[i] = this.summaryData[column.property]
        }       
      })
      return sum
    },
		//获取数据
		getData() {
			this.loading=true
			assetApi.getList({...this.requestParams,...this.params,...this.initParams}).then(res=>{
				this.list = res.data.list
				this.dataTotal = res.data.total
				this.summaryData = res.data.summary
				this.loading = false
				this.$emit('loaded',{ 
					total:this.dataTotal,
					list:this.list,
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
			this.requestParams.currentPage=1
			this.query()
		},
		openDetails(row){
			this.$refs.assetDetails.open().then(that=>{
				that.initData(row)
			})
		},
		sortChange({prop,order}){
			this.requestParams.sortProp = prop
			this.requestParams.sortOrder = order
			this.getData()
		},
		//导出excel
		exportExcel(){
			assetApi.exportExcel(this.requestParams)
		},
		clear(){
			this.list = []
		},
		openRecordDetailDialog(row){
			this.$refs.detailListDialog.open().then(that=>{
				that.initData({record_id:row.id})
			})
		},
		openDetailsDialog(row){
			this.$refs.recordDetails.open().then(that=>{
				that.initData(row)
			})
		},
		del({ row,$index }){
			let confirmText = '确定删除此IT资产维修记录吗？'
			this.$confirm(confirmText,'提示',{
				type: 'warning'
			}).then(()=>{
				assetApi.del(row.id).then(res=>{
					this.reload()
					this.$message.success('删除成功')
					this.$emit('del')
				})
			})
		},
		openAssetDetails(row){
			this.$refs.assetDetails.open().then(that=>{
				that.getDetails(row.asset_id)
			})
		}
	}
}
</script>