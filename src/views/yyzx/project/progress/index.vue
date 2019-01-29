<template>
	<div>
		<el-alert
    title="查看各个项目总体进度报告"
    type="success" :closable="false" style='margin-bottom: 15px'>
  	</el-alert>
  	<el-row :gutter='30' class='_info' >
			<el-col :span='8'>
				<el-card v-loading='summaryLoading'>
					<div class='_card'>
						<div class='_main'>{{ totalOrderArea }}㎡</div>
						<div class='_text'>合计订单面积</div>
					</div>
				</el-card>
			</el-col>
			<el-col :span='6'>
				<el-card v-loading='summaryLoading'>
					<div class='_card'>
						<div class='_main'>{{ toProductArea }}㎡</div>
						<div class='_text'>待产面积</div>
					</div>
				</el-card>
			</el-col>
			<el-col :span='5' >
				<el-card v-loading='summaryLoading'>
					<div class='_card'>
						<div class='_main'>{{ totalOrderAmount }}</div>
						<div class='_text'>合计下单数量</div>
					</div>
				</el-card>
			</el-col>
			<el-col :span='5' >
				<el-card v-loading='summaryLoading'>
					<div class='_card'>
						<div class='_main'>{{ totalRecord }}</div>
						<div class='_text'>合计订单数量</div>
					</div>
				</el-card>
			</el-col>
		</el-row>
		<div style='margin:10px 0px'>
	  	<el-button @click='exportExcel' size='small'>导出Excel</el-button>
	  </div>
		<progress-list ref='progressList' @loaded='getData' show-more>
			<el-table-column slot='column' label='操作' fixed='right' width='80' align='center'>
				<template slot-scope='scope'>					
					<el-button size='mini' type='text' @click='details(scope.row)'>进度详情</el-button>
				</template>
			</el-table-column>
		</progress-list>
		<project-details ref='projectDetails'></project-details>
	</div>
</template>

<script>
import projectApi from '@/api/yyzx/project'
import projectDetails from '@/components/projectDetails'
import progressList from '@/components/yyzx/project/progress/list'

export default {
	components:{ projectDetails,progressList },
	data(){
		return {
			summaryLoading:false,
			totalOrderArea:0,
			totalRecord:0,
			totalOrderAmount:0,
			toProductArea:0
		}
	},
	mounted(){
		this.$refs.progressList.initData()
	},
	methods:{
		details(row){
			this.$refs.projectDetails.open(row.id)
		},
		getData({total,list,params}) {
			this.summaryLoading = true
			projectApi.getProjectSummary( params ).then(res=>{
				this.totalOrderArea = res.data.order_area_total ||0
				this.totalRecord = res.data.order_total ||0
				this.totalOrderAmount = res.data.order_amount_total||0
				this.toProductArea = res.data.to_product_area||0
				this.summaryLoading = false
			})
		},
		exportExcel(){
			this.$refs.progressList.exportExcel()
		}
	}
}
</script>
<style lang="less" scoped>
	.point .el-table__row{
		cursor: pointer;
	}
	._info{
		margin:15px 0px;
		text-align: center;
		._card{
			margin:5px 0px;
			._main{
				font-size: 35px;
				color:#409EFF;
			}
			._text{
				font-size: 12px;
				color:#909399;
			}
		}
	}
</style>