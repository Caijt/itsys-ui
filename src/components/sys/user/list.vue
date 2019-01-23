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
				<el-form-item label='登录用户' prop='login_name'>
					<el-input v-model='queryParams.login_name' clearable></el-input>
				</el-form-item>
				<el-form-item label='用户名称' prop='name'>
					<el-input v-model='queryParams.name' clearable></el-input>
				</el-form-item>		
				<div v-show='queryShowMore'>
					<el-form-item label='企业号ID' prop='qywx_user'>
						<el-input v-model='queryParams.qywx_user' clearable></el-input>
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
			:summary-method='getSummaryData'
			@sort-change='sortChange'>			
			<el-table-column 
				fixed
				v-if='showSelection'
				type='selection' 
				align='center' 
				width='35' />
			<el-table-column prop='login_name' label='登录用户名' min-width='120' show-overflow-tooltip/>
			<el-table-column prop='name' label='用户名称' min-width='120' show-overflow-tooltip/>			
			<el-table-column prop='qywx_user' label='企业号ID' sortable='custom' width='120' show-overflow-tooltip/>
			<el-table-column prop='factory_names' label='管理工厂' sortable='custom' width='150' show-overflow-tooltip/>
			<el-table-column prop='company_names' label='管理公司' sortable='custom' width='150' show-overflow-tooltip/>
			<el-table-column prop='role_names' label='所属角色' sortable='custom' width='150' show-overflow-tooltip/>
			<el-table-column 
				prop='last_login_time' 
				width='130' 
				label='最近登录时间' 
				sortable='custom'>
				<template slot-scope='{ row }'>
					<span>{{ row.last_login_time | formatDate }}</span>
				</template>
			</el-table-column>
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
	</div>
</template>
<script>
import api from '@/api/sys/user'

export default {
	components:{  },
	props:{
		size:{
			type:String,
			default:''
		},
		maxHeight:{
			default:400
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
			api.getList({...this.requestParams,...this.params,...this.initParams}).then(res=>{
				this.list = res.data.list
				this.dataTotal = res.data.total
				this.summaryData = res.data.summary || {}
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
			// this.queryParamsLabel = { ...initQueryParamsLabel }
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
			api.exportExcel(this.requestParams)
		},
		clear(){
			this.list = []
		},
		del(row){
			let confirmText = '确定删除此用户吗？'
			this.$confirm(confirmText,'提示',{
				type: 'warning'
			}).then(()=>{
				api.del(row.id).then(res=>{
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