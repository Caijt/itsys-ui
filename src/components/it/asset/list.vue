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
				<!-- <span><el-button type='primary' @click='query' icon='el-icon-search' size='mini'></el-button></span>
				<span><el-button @click='resetQuery' size='mini'>重置</el-button ></span>
				<el-tooltip content='导出Excel' placement='top'>
					<el-button @click='exportExcel' size='mini' icon='el-icon-download'></el-button>
				</el-tooltip>				 
        <el-tooltip content='显示更多查询条件' placement='top'>
          <el-button @click='queryShowMore=!queryShowMore' size='mini'>
          <i :class="{'el-icon-arrow-up':queryShowMore,'el-icon-arrow-down':!queryShowMore}"></i>
          </el-button>
        </el-tooltip> -->
			</div>
			<el-form ref='formQuery' :model='queryParams' class='c-form-condensed' label-width='68px' inline size='mini'>
				<el-form-item label='资产编号' prop='no'>
					<el-input v-model='queryParams.no' clearable></el-input>
				</el-form-item>
				<el-form-item label='资产类型' prop='type_id'>
					<el-input 
						v-model='queryParamsLabel.type_name' 
						readonly clearable
						placeholder='点击选择' 
						@click.native='openSelectTypeDialog'>
						<i 
							style='cursor: pointer;'
							v-show='queryParams.type_id' 
							slot="suffix" 
							class="el-input__icon el-icon-close" 
							@click.stop='queryParamsLabel.type_name="";queryParams.type_id=""'></i>
					</el-input>
				</el-form-item>
				<el-form-item label='子类型' prop='hasSubType'>
					<el-switch
					  v-model="queryParams.hasSubType"
					  :inactive-value="0"
					  :active-value="1">
					</el-switch>
				</el-form-item>
				<div v-show='queryShowMore'>
					<el-form-item label='购买日期'>
						<el-row style='width:300px'>
							<el-col :span="11">
								<el-form-item prop='buy_date_begin'>
					      	<el-date-picker v-model='queryParams.buy_date_begin' placeholder='开始日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
					    	</el-form-item>
					    </el-col>
					    <el-col :span="2">至</el-col>
					    <el-col :span="11">
					    	<el-form-item prop='buy_date_end'>
					    		<el-date-picker v-model='queryParams.buy_date_end' placeholder='结束日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
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
			<el-table-column prop='no' label='资产编号' width='100'>
				<template slot-scope='{row}'>
					<span class='c-link' @click='openDetails(row)'>{{row.no}}</span>
				</template>
			</el-table-column>
			<el-table-column label='资产状态' align='center' width='100'>
				<template slot-scope='{row}'>
					<status-tag :asset='row'/>
				</template>
			</el-table-column>
			<el-table-column 
				prop='model' 
				min-width='150' 
				label='资产型号' 
				show-overflow-tooltip />
			<el-table-column 
				prop='type_name' 
				width='100' 
				label='资产类型' 
				show-overflow-tooltip />
			<el-table-column prop='buy_date' label='购买日期' sortable='custom' width='100' />
			<el-table-column 
				prop='supplier_name' 
				label='供应商' 
				width='100' 
				show-overflow-tooltip />
			<el-table-column prop='price' label='金额' sortable='custom' width='100' align='right'>
				<template slot-scope='{row}'>
					<span>￥{{ row.price }}</span>
				</template>
			</el-table-column>
			<el-table-column 
				prop='remain' 
				label='库存量' 
				align='right'
				sortable='custom' 
				width='110'>
				<template slot-scope='{row}'>
					<span class='c-link' @click='openUseStatusDialog(row)'>{{row.remain}} / {{row.avaiable_amount}} / {{row.amount}}</span>
				</template>
			</el-table-column>
			<el-table-column prop='use_dep' label='最后领用人' sortable='custom' width='120' show-overflow-tooltip>
				<template slot-scope='{row}'>
					<span>{{row.use_dep_name}} / {{row.use_employee_name}}</span>
				</template>
			</el-table-column>
			<el-table-column prop='remarks' label='备注' width='120' show-overflow-tooltip />
			<el-table-column 
				prop='sn' 
				label='序列号' 
				width='100' 
				show-overflow-tooltip />
			<el-table-column 
				prop='company_name' 
				min-width='120' 
				label='资产所属公司' 
				show-overflow-tooltip />		
			<el-table-column 
				prop='create_user_name' 
				label='录入员' />
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
				label='最近更新时间' 
				width='120' 
				sortable='custom'>
				<template slot-scope='{row}'>
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
	  <asset-details :in-dialog='inDialog' ref='assetDetails' />
	  <asset-use-status-dialog :in-dialog='inDialog' hide-asset-fields ref='assetUseStatusDialog'/>
	  <type-dialog :in-dialog='inDialog' ref='typeDialog' show-select @select='selectType'/>
	</div>
</template>
<script>
import assetApi from '@/api/it/asset'
import assetDetails from '@/components/it/asset/details'
import assetUseStatusDialog from './useStatus/listDialog'
import statusTag from './statusTag'
import typeDialog from './type/treeDialog'
const initQueryParamsLabel = {
	type_name:''
}
export default {
	components:{ assetDetails, assetUseStatusDialog, statusTag, typeDialog },
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
			queryParamsLabel:{},
			//查询条件字段
			queryParams:{
				no:'',//项目编号

				remarks:'',
				hasSubType:1,
				buy_date_begin:'',
				buy_date_end:''
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
			this.queryParamsLabel = {...initQueryParamsLabel}
			// this.queryParams = {...this.queryParams,...this.params}
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
		del({ row,$index }){
			let confirmText = '确定删除此IT资产吗？'
			this.$confirm(confirmText,'提示',{
				type: 'warning'
			}).then(()=>{
				assetApi.del(row.id).then(res=>{
					// this.list.splice($index,1)
					this.reload()
					this.$message.success('删除成功')
					this.$emit('del')
				})
			})
		},
		openUseStatusDialog(row){
			this.$refs.assetUseStatusDialog.open().then(that=>{
				that.initData({asset_id:row.id})
			})
		},
		openSelectTypeDialog(){
			this.$refs.typeDialog.open().then(that=>{
				that.initData()
			})
		},
		selectType(data){
			this.queryParams.type_id = data.id
			this.queryParamsLabel.type_name = data.name
			this.$refs.typeDialog.close()
		}
	}
}
</script>