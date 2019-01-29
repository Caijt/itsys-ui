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
				  <!-- <el-tooltip content='导出Excel' placement='top'>
				  	<el-button @click='exportExcel' size='mini' icon='el-icon-download'></el-button>
					</el-tooltip> -->
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
					<el-form-item label='领用部门' prop='dep_id'>
						<el-input v-model='queryParamsLabel.dep_name' placeholder='点击选择' readonly clearable @click.native='openSelectDepDialog'>
							<i 
								style='cursor: pointer;'
								v-show='queryParams.dep_id' 
								slot="suffix" 
								class="el-input__icon el-icon-close" 
								@click.stop='queryParamsLabel.dep_name="";queryParams.dep_id=""'></i>
						</el-input>
					</el-form-item>
					<el-form-item label='子部门' prop='hasSubDep'>
						<el-switch
						  v-model="queryParams.hasSubDep"
						  :inactive-value="0"
						  :active-value="1">
						</el-switch>
					</el-form-item>
					<el-form-item label='领用员工' prop='employee_name'>
						<el-input v-model='queryParams.employee_name' clearable></el-input>
					</el-form-item>
					<el-form-item label='使用地点' prop='place'>
						<el-input v-model='queryParams.place' clearable></el-input>
					</el-form-item>
					<el-form-item label='领用备注' prop='remarks'>
						<el-input v-model='queryParams.remarks' clearable></el-input>
					</el-form-item>
					<el-form-item label='领用日期'>
						<el-row style='width:300px'>
							<el-col :span="11">
								<el-form-item prop='use_date_begin'>
					      	<el-date-picker v-model='queryParams.use_date_begin' placeholder='开始日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
					    	</el-form-item>
					    </el-col>
					    <el-col :span="2">至</el-col>
					    <el-col :span="11">
					    	<el-form-item prop='use_date_end'>
					    		<el-date-picker v-model='queryParams.use_date_end' placeholder='结束日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
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
			row-key='detail_id'
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
			<el-table-column v-if='!hideAssetFields' prop='asset_no' label='资产编号' width='100'>
				<template slot-scope='{row}'>
					<span class='c-link' @click='openDetails(row)'>{{row.asset_no}}</span>
				</template>
			</el-table-column>
			<el-table-column 
				v-if='!hideAssetFields'
				prop='asset_model' 
				min-width='150' 
				label='资产型号' 
				show-overflow-tooltip />
			<el-table-column 
				v-if='!hideAssetFields'
				prop='asset_type_name' 
				width='100' 
				label='资产类型' 
				show-overflow-tooltip />		
			<el-table-column 
				v-if='!hideAssetFields'
				prop='company_name' 
				min-width='120' 
				label='资产所属公司' 
				show-overflow-tooltip />			
			<el-table-column prop='use_date' label='领用日期' sortable='custom' width='100' />			
			<el-table-column prop='dep_name' label='领用部门' sortable='custom' width='120' show-overflow-tooltip />
			<el-table-column prop='employee_name' label='领用员工' sortable='custom' width='120' show-overflow-tooltip />
			<el-table-column prop='use_place' label='使用地点' min-width='120' show-overflow-tooltip />
			<el-table-column prop='use_remarks' label='领用备注' min-width='120' show-overflow-tooltip />
			<el-table-column 
				prop='use_amount' 
				label='使用数量' 
				align='right'
				sortable='custom' 
				width='100' />				
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
	  <asset-details v-if='!hideAssetFields' :in-dialog='inDialog' ref='assetDetails' />
	  <dep-dialog :in-dialog='inDialog' ref='depDialog' show-select @select='selectDep' />
	</div>
</template>
<script>
import assetApi from '@/api/it/assetUseStatus'
import assetDetails from '@/components/it/asset/details'
import depDialog from '@/components/hr/dep/treeDialog'

const initQueryParamsLabel = {
	dep_name:''
}

export default {
	components:{ assetDetails,depDialog },
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
			queryParamsLabel:{...initQueryParamsLabel},
			//查询条件字段
			queryParams:{
				asset_no:'',//项目编号
				asset_model:'',//项目名称
				dep_id:'',
				hasSubDep:1,
				employee_name:'',
				place:'',
				remarks:'',
				employee_name:'',
				use_date_begin:'',
				use_date_end:''
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
			this.requestParams.currentPage=1
			this.getData()
		},
		//重置查询条件
		resetQuery(){
			this.$refs.formQuery.resetFields()
			this.queryParamsLabel = {...initQueryParamsLabel}
			this.query()
		},
		openDetails(row){
			this.$refs.assetDetails.open().then(that=>{
				that.getDetails(row.asset_id)
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
		openSelectDepDialog(){
			this.$refs.depDialog.open().then(that=>{
				that.initData()
			})
		},
		selectDep(data){
			this.queryParamsLabel.dep_name = data.name
			this.queryParams.dep_id = data.id
			this.$refs.depDialog.close()
		}
	}
}
</script>