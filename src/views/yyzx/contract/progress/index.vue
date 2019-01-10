<template>
	<div>
  	<el-row :gutter='30' class='_info' >
			<el-col :span='10'>
				<el-card v-loading='summaryLoading'>
					<div class='_card'>
						<div class='_main'>￥{{ contractPriceTotal }}</div>
						<div class='_text'>合计合同金额</div>
					</div>
				</el-card>
			</el-col>
			<el-col :span='8' >
				<el-card v-loading='summaryLoading'>
					<div class='_card'>
						<div class='_main'>{{ contractAreaTotal }}㎡</div>
						<div class='_text'>合计合同面积</div>
					</div>
				</el-card>
			</el-col>
			<el-col :span='6' >
				<el-card v-loading='summaryLoading'>
					<div class='_card'>
						<div class='_main'>{{ contractTotal }}</div>
						<div class='_text'>合计合同数量</div>
					</div>
				</el-card>
			</el-col>
		</el-row>
		<progress-list ref='progressList' @loaded='getData' show-more>
		</progress-list>
		<project-details ref='projectDetails'></project-details>
	</div>
</template>

<script>
import contractApi from '@/api/yyzx/contract'
import projectDetails from '@/components/projectDetails'
import progressList from '@/components/yyzx/contract/progress/list'

export default {
	components:{ projectDetails,progressList },
	data(){
		return {
			summaryLoading:false,
			contractAreaTotal:0,
			contractTotal:0,
			contractPriceTotal:0
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
			contractApi.getContractSummary( params ).then(res=>{
				this.contractPriceTotal = res.data.contract_price_total||0
				this.contractAreaTotal = res.data.contract_area_total ||0				
				this.contractTotal = total
				this.summaryLoading = false
			})
		},
		exportExcel(){
			this.$refs.progressList.exportExcel()
		}
	}
}
</script>
<style lang="scss" scoped>
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