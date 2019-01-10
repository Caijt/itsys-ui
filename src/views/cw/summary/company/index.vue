<template>
	<div>
		<el-alert
	    title="以业绩公司为单位汇总欠款情况"
	    type="warning" 
	    :closable="false"
	    style='margin-bottom: 10px'>
		</el-alert>
		<div style='margin:5px 0px'>
			<el-button @click='exportExcel' size='small'>导出Excel</el-button>
		</div>
		<el-row type='flex' style='margin:3px 0px'>
			<div style='flex:1'>
				<el-form ref='formQuery' :model='queryParams' class='c-form-small' inline size='mini'>
					<el-form-item prop='company_name' label='公司名称'>
						<el-input v-model='queryParams.company_name' placeholder='公司名称' clearable></el-input>
					</el-form-item>
					<el-form-item prop='hasArrear'>
						<el-tooltip content='只统计欠款项目（回款金额小于开票金额）'>
							<el-badge>
								<el-checkbox 
									v-model="queryParams.hasArrear" 
									label="欠款" 
									border
									:true-label='1'
									:false-label='0'
									@change='query({key:"hasArrear"})'
									>
								</el-checkbox>
							</el-badge>
						</el-tooltip>
					</el-form-item>
					<template v-if='false'>
					<el-form-item label='欠款金额' prop='order_days'>
						<el-col :span="11">
							<el-form-item prop='order_days_min'>
				      	<el-input v-model='queryParams.order_days_min' placeholder='金额下限' clearable></el-input>
				    	</el-form-item>
				    </el-col>
				    <el-col :span="1">-</el-col>
				    <el-col :span="11">
				    	<el-form-item prop='order_days.max'>
				      	<el-input v-model='queryParams.order_days.max' placeholder='金额上限' clearable></el-input>
				      </el-form-item>
				    </el-col>
					</el-form-item>
					<el-form-item label='项目金额' prop='order_days'>
						<el-col :span="11">
							<el-form-item prop='order_days_min'>
				      	<el-input v-model='queryParams.order_days_min' placeholder='金额下限' clearable></el-input>
				    	</el-form-item>
				    </el-col>
				    <el-col :span="1">-</el-col>
				    <el-col :span="11">
				    	<el-form-item prop='order_days.max'>
				      	<el-input v-model='queryParams.order_days.max' placeholder='金额上限' clearable></el-input>
				      </el-form-item>
				    </el-col>
					</el-form-item>
					<el-form-item label='回款进度' prop='order_days'>
						<el-col :span="11">
							<el-form-item prop='order_days_min'>
				      	<el-input v-model='queryParams.order_days_min' placeholder='进度下限' clearable></el-input>
				    	</el-form-item>
				    </el-col>
				    <el-col :span="1">-</el-col>
				    <el-col :span="11">
				    	<el-form-item prop='order_days.max'>
				      	<el-input v-model='queryParams.order_days.max' placeholder='进度上限' clearable></el-input>
				      </el-form-item>
				    </el-col>
					</el-form-item>
					</template>
				</el-form>
			</div>
			<div>
				<el-button type='primary' @click='query' size='mini'>查询</el-button>
				<span><el-button @click='resetQuery' size='mini'>重置</el-button></span>
				<el-button size='mini' v-if='false' @click='showMore=!showMore'>{{showMore?"收起":"更多"}}</el-button>
			</div>
		</el-row>		
		<el-table 
			:data='list' 
			ref='tableList'
			v-loading='loading' 
			border stripe
			max-height='500'
			@sort-change='sortChange'>
			<el-table-column prop='company_name' label='业绩公司' fixed width='120'show-overflow-tooltip></el-table-column>
			<el-table-column prop='project_total' label='项目数量' width='80' align='center'>
				<template slot-scope='{row}'>
					<span class='c-link' @click='openProjectList(row.company_id)'>{{ row.project_total }}</span>
				</template>
			</el-table-column>
			<el-table-column 
				prop='settlement_price_total' label='项目结算金额' sortable='custom' width='120' align='right'>
				<template slot-scope='{row}'>
					<span>￥{{ row.settlement_price_total }}</span>
				</template>
			</el-table-column>
			<el-table-column 
				prop='total_invoice_price' label='已开票金额' sortable='custom' min-width='120' align='right'>
				<template slot-scope='{row}'>
					<span>￥{{ row.invoice_price_total }}</span>
				</template>
			</el-table-column>
			<el-table-column 
				prop='no_invoice_price' label='未开票金额' min-width='120' align='right'>
				<template slot-scope='{row}'>
					<span>￥{{ row.no_invoice_price }}</span>
				</template>
			</el-table-column>
			<el-table-column label='项目开票率' min-width='120' align='center'>
				<template slot-scope='{row}'>
					<el-progress 
						text-inside 
						:stroke-width='16' 
						:status='$commonJs.getProgressPercentage(row.invoice_price_total/row.settlement_price_total)>=100?"success":""' 
					:percentage="$commonJs.getProgressPercentage(row.invoice_price_total/row.settlement_price_total)">
					</el-progress>
				</template>
			</el-table-column>
			<el-table-column prop='last_invoice_date' label='最近开票日期' width='140' sortable='custom'></el-table-column>
			<el-table-column 
				prop='total_payment_price' label='已回款金额' min-width='120' align='right'>
				<template slot-scope='{row}'>
					<span>￥{{ row.payment_price_total }}</span>
				</template>
			</el-table-column>
			<el-table-column 
				prop='total_arrear_price' label='应收欠款金额' width='130' align='right' sortable='custom'>
				<template slot-scope='{row}'>
					<span>￥{{ row.arrear_price_total }}</span>
				</template>
			</el-table-column>
			<el-table-column label='开票回款进度' min-width='120' align='center'>
				<template slot-scope='{row}'>
					<el-progress 
						text-inside 
						:stroke-width='16' 
						:status='$commonJs.getProgressPercentage(row.payment_price_total/row.invoice_price_total)>=100?"success":""' 
					:percentage="$commonJs.getProgressPercentage(row.payment_price_total/row.invoice_price_total)">
					</el-progress>
				</template>
			</el-table-column>
			
			<el-table-column prop='last_payment_date' label='最近回款日期' width='140' sortable='custom'></el-table-column>
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
	  <project-dialog ref='projectDialog'></project-dialog>
	</div>
</template>
<script>
import cwSummaryApi from '@/api/cw/summary'
import projectDialog from '@/components/cw/summary/projectListDialog'

export default {
	components:{ projectDialog },
	data(){
		return {
			loading: true,
			list:[],
			dataTotal:0,
			newProjectList:[],
			//查询字段
			queryParams:{
				company_name:'',//公司名称
				hasArrear:1
			},
			//请求参数
			requestParams:{
				pageSize:10,//分页大小
				currentPage:1,//当前页
				sortProp:'',
				sortOrder:'',
				hasArrear:1
			},
			showMore:false
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
			cwSummaryApi.getCompanySummaryList(this.requestParams).then(res=>{
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
			this.query()
		},
		exportExcel(){
			this.$message('功能未开发')
		},		
		openProjectList(company_id){
			this.$refs.projectDialog.open({
				company_id,
				hasArrear:this.queryParams.hasArrear
			})
		},
		sortChange({prop,order}){
			this.requestParams.sortProp = prop
			this.requestParams.sortOrder = order
			this.getData()
		},
		exportExcel(){
			cwSummaryApi.exportExcelCompanySummary(this.requestParams)
		}
	}
}
</script>