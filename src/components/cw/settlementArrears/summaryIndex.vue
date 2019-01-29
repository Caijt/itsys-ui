<template>
	<div>
		<el-row :gutter='10' class='_info' v-loading='summaryLoading'>
			<el-col :span='12'>
				<el-card shadow='hover' style='cursor:text'>
					<div class='_card'>
						<div class='_main'>￥{{ arrearsPrice | formatPrice}}</div>
						<div class='_text'>在途物资金额</div>
					</div>
				</el-card>
			</el-col>
			<el-col :span='12'>
				<el-row :gutter='5'>
					<el-col :span='6'>
				<el-card shadow='hover'  @click.native='$router.push("/cw/settlementArrears/customer")'>
					<div class='_card'>
						<div class='_main'>{{ arrearsCustomerTotal}}</div>
						<div class='_text'>在途客户</div>
					</div>
				</el-card>
			</el-col>
			<el-col :span='6' >
				<el-card  shadow='hover' @click.native='$router.push("/cw/settlementArrears/project")'>
					<div class='_card'>
						<div class='_main'>{{ arrearsProjectTotal }}</div>
						<div class='_text'>在途项目</div>
					</div>
				</el-card>
			</el-col>
			<el-col :span='6' >
				<el-card shadow='hover' @click.native='$router.push("/cw/settlementArrears/company")'>
					<div class='_card'>
						<div class='_main'>{{ arrearsCompanyTotal }}</div>
						<div class='_text'>在途公司</div>
					</div>
				</el-card>
			</el-col>
			<el-col :span='6' >
				<el-card shadow='hover' @click.native='$router.push("/cw/settlementArrears/contract")'>
					<div class='_card'>
						<div class='_main'>{{ arrearsContractTotal }}</div>
						<div class='_text'>在途合同</div>
					</div>
				</el-card>
			</el-col>
				</el-row>
			</el-col>
			
		</el-row>
	</div>
</template>
<script>
	import arrearsApi from '@/api/cw/settlementArrears'
	export default {
		data(){
			return {
				summaryLoading:true,
				arrearsPrice:0,
				arrearsCustomerTotal:0,
				arrearsProjectTotal:0,
				arrearsContractTotal:0,
				arrearsCompanyTotal:0
			}
		},
		created(){
			this.getData()
		},
		methods:{
			getData(){
				this.summaryLoading = true
				arrearsApi.getArrearsSummaryData().then(res=>{
					this.arrearsPrice = res.data.arrears_price
					this.arrearsCustomerTotal = res.data.arrears_customer_total
					this.arrearsProjectTotal = res.data.arrears_project_total
					this.arrearsContractTotal = res.data.arrears_contract_total
					this.arrearsCompanyTotal = res.data.arrears_company_total
					this.summaryLoading = false
				})
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
	.el-card {
		cursor: pointer;
		-webkit-box-shadow: 0 2px 1px 0 rgba(0,0,0,.1);
		box-shadow: 0 2px 1px 0 rgba(0,0,0,.1);
	}

</style>