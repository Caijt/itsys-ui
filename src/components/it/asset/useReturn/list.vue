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
				<el-form-item label='记录编号' prop='record_no'>
					<el-input v-model='queryParams.record_no' clearable></el-input>
				</el-form-item>
				<el-form-item label='记录类型' prop='record_type'>
					<el-select v-model='queryParams.record_type' clearable>
						<el-option label='领用' value='USE'></el-option>
						<el-option label='交还' value='RETURN'></el-option>
					</el-select>
				</el-form-item>
				<div v-show='queryShowMore'>
					<el-form-item label='资产编号' prop='asset_no'>
						<el-input v-model='queryParams.asset_no' clearable></el-input>
					</el-form-item>
					<el-form-item label='资产型号' prop='asset_model'>
						<el-input v-model='queryParams.asset_model' clearable></el-input>
					</el-form-item>
					<el-form-item label='部门' prop='dep_id'>
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
					<el-form-item label='员工' prop='employee_name'>
						<el-input v-model='queryParams.employee_name' clearable></el-input>
					</el-form-item>
					<el-form-item label='地点' prop='place'>
						<el-input v-model='queryParams.place' clearable></el-input>
					</el-form-item>
					<el-form-item label='备注' prop='remarks'>
						<el-input v-model='queryParams.remarks' clearable></el-input>
					</el-form-item>
					<el-form-item label='记录日期'>
						<el-row style='width:300px'>
							<el-col :span="11">
								<el-form-item prop='record_date_begin'>
					      	<el-date-picker v-model='queryParams.record_date_begin' placeholder='开始日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
					    	</el-form-item>
					    </el-col>
					    <el-col :span="2">至</el-col>
					    <el-col :span="11">
					    	<el-form-item prop='record_date_end'>
					    		<el-date-picker v-model='queryParams.record_date_end' placeholder='结束日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
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
				v-if='showCheckbox'
				type='selection' 
				align='center' 
				width='35' />
			<el-table-column align='center' prop='no' label='记录类型' width='80'>
				<template slot-scope='{row}'>
					<el-tag v-show='row.record_type=="USE"' type="danger">领用</el-tag>
					<el-tag v-show='row.record_type=="RETURN"' type="success">交还</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop='no' label='记录编号' width='110'>
				<template slot-scope='{row}'>
					<span class='c-link' @click='openDetailsDialog(row)'>{{row.no}}</span>
				</template>
			</el-table-column>
			<el-table-column 
				prop='record_date' 
				width='100' 
				sortable='custom' 
				label='记录日期' />	
			<el-table-column 
				v-if='!hideAssetFields'
				prop='asset_no' 
				width='100' 
				label='资产编号' 
				show-overflow-tooltip>
				<template slot-scope='{row}'>
					<span class='c-link' @click='openAssetDetails(row)'>{{row.asset_no}}</span>
				</template>	
			</el-table-column>
			<el-table-column 
				v-if='!hideAssetFields'
				prop='asset_model' 
				width='150' 
				label='资产型号' 
				show-overflow-tooltip />		
			<el-table-column 
				prop='dep_name' 
				width='100' 
				label='部门' 
				show-overflow-tooltip />
			<el-table-column 
				prop='employee_name' 
				width='90' 
				label='员工' 
				show-overflow-tooltip />			
			<el-table-column 
				prop='amount' 
				align='right'
				label='数量' 
				sortable='custom' 
				width='70'>					
			</el-table-column>		
			<el-table-column prop='place' label='使用/归还地点' width='120' show-overflow-tooltip />	
			<el-table-column prop='remarks' label='备注' width='120' show-overflow-tooltip />		
			<el-table-column 
				width='90' 
				prop='create_user_name' 
				label='录入员' 
				show-overflow-tooltip/>
			<el-table-column 
				prop='submit_time' 
				width='120' 
				label='提交时间' 
				sortable='custom'>
				<template slot-scope='{ row }'>
					<span>{{ row.submit_time | formatDate }}</span>
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
	  <use-record-details :in-dialog='inDialog' ref='useRecordDetails'/>
		<return-record-details :in-dialog='inDialog' ref='returnRecordDetails'/>
		<dep-dialog :in-dialog='inDialog' ref='depDialog' show-select @select='selectDep' />
		<asset-details v-if='!hideAssetFields' :in-dialog='inDialog' ref='assetDetails' />
	</div>
</template>
<script>
import assetApi from '@/api/it/assetUseRecordDetail'
import useRecordDetails from '../use/details'
import returnRecordDetails from '../return/details'
import depDialog from '@/components/hr/dep/treeDialog'
import assetDetails from '../details'

const initQueryParamsLabel = {
	dep_name:''
}
export default {
	components:{ useRecordDetails, returnRecordDetails, depDialog, assetDetails },
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
		hideAssetFields:{
			type:Boolean,
			default:false
		},
		showCheckbox:{
			type:Boolean,
			default:false
		},
		sortProp:{
			type:String,
			default:'submit_time'
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
				record_no:'',//
				record_type:'',
				asset_no:'',//
				asset_model:'',//
				remarks:'',
				dep_id:null,
				hasSubDep:1,
				employee_name:'',
				record_date_begin:'',
				record_date_end:''
			},
			//数据请求的参数
			requestParams:{
				pageSize:10,//分页大小
				currentPage:1,//当前页
				sortProp:this.sortProp,
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
      let labelIndex = this.showCheckbox?1:0
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
			this.queryParamsLabel = { ...initQueryParamsLabel }
			this.requestParams.currentPage=1
			this.query()
		},
		openAssetDetails(row){
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
		openDetailsDialog(row){
			let name = row.record_type=='USE'?'useRecordDetails':'returnRecordDetails'
			this.$refs[name].open().then(that=>{
				that.getDetails(row.record_id)
			})			
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