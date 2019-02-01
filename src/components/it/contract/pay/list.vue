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
				 	<!--  <el-tooltip content='导出Excel' placement='top'>
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
				<el-form-item label='合同编号' prop='contract_no'>
					<el-input v-model.trim='queryParams.contract_no' clearable></el-input>
				</el-form-item>
				<el-form-item label='合同名称' prop='contract_name'>
					<el-input v-model.trim='queryParams.contract_name' clearable></el-input>
				</el-form-item>
				<div v-show='queryShowMore'>
					<el-form-item label='供应商' prop='supplier_name'>
						<el-input v-model.trim='queryParams.supplier_name' clearable></el-input>
					</el-form-item>
					<el-form-item label='备注' prop='remarks'>
						<el-input v-model.trim='queryParams.remarks' clearable></el-input>
					</el-form-item>
					<el-form-item label='付款金额'>
            <el-row style='width:300px'>
              <el-col :span="11">
                <el-form-item prop='pay_price_begin'>
                  <el-input v-model.trim='queryParams.pay_price_begin' placeholder='最小值' clearable>
                    <span slot="prefix">￥</span>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">至</el-col>
              <el-col :span="11">
                <el-form-item prop='pay_price_end'>
                  <el-input v-model.trim='queryParams.pay_price_end' placeholder='最小值' clearable>
                    <span slot="prefix">￥</span>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
					<el-form-item label='付款日期'>
						<el-row style='width:300px'>
							<el-col :span="11">
								<el-form-item prop='pay_date_begin'>
					      	<el-date-picker v-model.trim='queryParams.pay_date_begin' placeholder='开始日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
					    	</el-form-item>
					    </el-col>
					    <el-col :span="2">至</el-col>
					    <el-col :span="11">
					    	<el-form-item prop='pay_date_end'>
					    		<el-date-picker v-model.trim='queryParams.pay_date_end' placeholder='结束日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
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
			:max-height='tableMaxHeight' 			
			@selection-change='selectionChange'
			show-summary
			:summary-method='getSummaryData'
			@sort-change='sortChange'>			
			<el-table-column 
				fixed
				v-if='showCheckbox'
				type='selection' 
				align='center' 
				width='35' />
			<el-table-column v-if='!hideContractFields' prop='contract_no' label='合同编号' width='110' show-overflow-tooltip>
				<template slot-scope='{row}'>
					<span class='c-link' @click='openContractDetails(row)'>{{row.contract_no}}</span>
				</template>
			</el-table-column>
			<el-table-column v-if='!hideContractFields' prop='contract_name' label='合同名称' min-width='120' show-overflow-tooltip/>
			<el-table-column v-if='!hideContractFields' prop='supplier_name' label='供应合作商' min-width='120' show-overflow-tooltip>
				<template slot-scope='{row}'>
					<span class='c-link' @click='openSupplierDetails(row)'>{{row.supplier_name}}</span>
				</template>
			</el-table-column>			
			<el-table-column prop='pay_date' label='付款日期' sortable='custom' width='100' />
			<el-table-column prop='pay_price' label='付款金额' sortable='custom' width='100' align='right'>
				<template slot-scope='{row}'>
					<span>￥{{ row.pay_price }}</span>
				</template>
			</el-table-column>
			<el-table-column prop='remarks' label='备注' min-width='120' show-overflow-tooltip/>
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
	  <contract-details :in-dialog='inDialog' ref='contractDetails' />
	  <supplier-details :in-dialog='inDialog' ref='supplierDetails' />
	</div>
</template>
<script>
import api from '@/api/it/contractPayRecord'
import contractDetails from '@/components/it/contract/details'
import supplierDetails from '@/components/it/supplier/details'

export default {
	components:{ contractDetails, supplierDetails },
	props:{
		size:{
			type:String,
			default:''
		},
		maxHeight:{
			default:null
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
		showCheckbox:{
			type:Boolean,
			default:false
		},
		hideContractFields:{
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
			summaryData:{},
			selectionList:[],
			queryShowMore:this.showMore,
			initParams:{},
			//查询条件字段
			queryParams:{
				contract_no:'',//
				contract_name:'',
				supplier_name:'',
				pay_price_begin:'',
				pay_price_end:'',
				pay_date_begin:'',
				pay_date_end:'',
			},
			//数据请求的参数
			requestParams:{
				pageSize:this.$store.state.sys.pageSize,//分页大小
				currentPage:1,//当前页
				sortProp:'',
				sortOrder:'',
				noPage:this.noPage?1:0,
				inCompany:1
			}
		}
	},
	computed:{
		tableMaxHeight(){
			return this.maxHeight?this.maxHeight:this.$store.state.sys.tableMaxHeight
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
			api.getList({...this.requestParams,...this.params,...this.initParams}).then(res=>{
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
			this.requestParams.currentPage = 1
			this.getData()
		},
		//重置查询条件
		resetQuery(){
			this.$refs.formQuery.resetFields()
			// this.queryParams = {...this.queryParams,...this.params}
			this.query()
		},
		openContractDetails(row){
			this.$refs.contractDetails.open().then(that=>{
				that.getDetails( row.id )
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
			let confirmText = '确定删除此付款记录吗？'
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
		openSupplierDetails(row){
			this.$refs.supplierDetails.open().then(that=>{
				that.getDetails(row.supplier_id)
			})
		}
	}
}
</script>