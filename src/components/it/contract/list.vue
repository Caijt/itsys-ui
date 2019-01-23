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
				<el-form-item label='合同编号' prop='no'>
					<el-input v-model='queryParams.no' clearable></el-input>
				</el-form-item>
				<el-form-item label='合同名称' prop='name'>
					<el-input v-model='queryParams.name' clearable></el-input>
				</el-form-item>				
				<div v-show='queryShowMore'>
					<el-form-item label='签订日期'>
						<el-row style='width:300px'>
							<el-col :span="11">
								<el-form-item prop='sign_date_begin'>
					      	<el-date-picker v-model='queryParams.sign_date_begin' placeholder='开始日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
					    	</el-form-item>
					    </el-col>
					    <el-col :span="2">至</el-col>
					    <el-col :span="11">
					    	<el-form-item prop='sign_date_end'>
					    		<el-date-picker v-model='queryParams.sign_date_end' placeholder='结束日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
					      </el-form-item>
					    </el-col>
				  	</el-row>
					</el-form-item>
					<el-form-item label='生效日期'>
						<el-row style='width:300px'>
							<el-col :span="11">
								<el-form-item prop='begin_date_begin'>
					      	<el-date-picker v-model='queryParams.begin_date_begin' placeholder='开始日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
					    	</el-form-item>
					    </el-col>
					    <el-col :span="2">至</el-col>
					    <el-col :span="11">
					    	<el-form-item prop='begin_date_end'>
					    		<el-date-picker v-model='queryParams.begin_date_end' placeholder='结束日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
					      </el-form-item>
					    </el-col>
				  	</el-row>
					</el-form-item>
					<el-form-item label='失效日期'>
						<el-row style='width:300px'>
							<el-col :span="11">
								<el-form-item prop='end_date_begin'>
					      	<el-date-picker v-model='queryParams.end_date_begin' placeholder='开始日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
					    	</el-form-item>
					    </el-col>
					    <el-col :span="2">至</el-col>
					    <el-col :span="11">
					    	<el-form-item prop='begin_date_end'>
					    		<el-date-picker v-model='queryParams.end_date_end' placeholder='结束日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
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
			@selection-change='selectionChange'
			show-summary
			:summary-method='getSummaryData'
			@sort-change='sortChange'>			
			<el-table-column 
				fixed
				v-if='showSelection'
				type='selection' 
				align='center' 
				width='35' />
			<el-table-column prop='no' label='合同编号' width='110' show-overflow-tooltip/>
			<el-table-column prop='name' label='合同名称' min-width='120' show-overflow-tooltip/>			
			<el-table-column prop='supplier_name' label='供应合作商' min-width='120' show-overflow-tooltip/>			
			<el-table-column prop='price' label='金额' sortable='custom' width='100' align='right'>
				<template slot-scope='{row}'>
					<span>￥{{ row.price }}</span>
				</template>
			</el-table-column>
			<el-table-column prop='sign_date' label='签订日期' sortable='custom' width='100' />
			<el-table-column prop='begin_date' label='生效日期' sortable='custom' width='100' />
			<el-table-column prop='end_date' label='失效日期' sortable='custom' width='100' />
			<el-table-column prop='is_remind' label='失效提醒' align='center' width='80'>
				<template slot-scope='{row}'>
					<el-tag v-if='row.is_remind==1' type='success'>是</el-tag>
					<el-tag v-else type='info'>否</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop='company_name' label='合同所属公司' min-width='120' show-overflow-tooltip/>
			<el-table-column 
				prop='create_user_name' 
				width='90' 
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
	  <dep-dialog :in-dialog='inDialog' ref='depDialog' show-select @select='selectDep' />
	</div>
</template>
<script>
import contractApi from '@/api/it/contract'
import assetDetails from '@/components/it/asset/details'
import depDialog from '@/components/hr/dep/treeDialog'

const initQueryParamsLabel = {
	dep_name:''
}
export default {
	components:{ assetDetails, depDialog },
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
			queryParamsLabel:{
				dep_name:''
			},
			//查询条件字段
			queryParams:{
				no:'',//项目编号				
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
			contractApi.getList({...this.requestParams,...this.params,...this.initParams}).then(res=>{
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
			// this.queryParams = {...this.queryParams,...this.params}
			this.requestParams.currentPage = 1
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
			contractApi.exportExcel(this.requestParams)
		},
		clear(){
			this.list = []
		},
		del(row){
			let confirmText = '确定删除此合同吗？'
			this.$confirm(confirmText,'提示',{
				type: 'warning'
			}).then(()=>{
				contractApi.del(row.id).then(res=>{
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