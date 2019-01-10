<template>
	<div>
		<el-alert
	    title="根据查询条件对回票记录进行统计开票，合计得累计开票金额和开票数量"
	    type="success"
	    :closable="false">
	  </el-alert>
		<el-row :gutter='30' class='_info'>
			<el-col :span='16'>
				<el-card v-loading='loading'>
					<div class='_card'>
						<div class='_main'>￥{{ totalPrice }}</div>
						<div class='_text'>累计回款金额</div>
					</div>
				</el-card>
			</el-col>
			<el-col :span='8' >
				<el-card v-loading='loading'>
					<div class='_card'>
						<div class='_main'>{{ totalRecord }}</div>
						<div class='_text'>累计回款记录</div>
					</div>
				</el-card>
			</el-col>
		</el-row>
		<div style='margin-bottom: 10px'>
			<el-button @click='exportExcel' size='small'>导出Excel</el-button>
		</div>
		<receive-payment-record-list size='small' ref='receivePaymentRecordList' show-more @loaded='getTotal' >
		</receive-payment-record-list>
	</div>
</template>
<script>
	import receivePaymentRecordList from '@/components/cw/receivePaymentRecord/list'
	import receivePaymentRecordApi from '@/api/cw/receivePaymentRecord'
	export default {
		components:{ receivePaymentRecordList },
		data:()=>({
			loading:true,
			totalPrice:'0.00',
			totalRecord:0
		}),
		mounted(){
			this.$refs.receivePaymentRecordList.initData()
		},
		methods:{
			getTotal({ total,params }){
				this.totalRecord = total
				this.loading = true
				receivePaymentRecordApi.getTotalPrice(params).then(res=>{
					this.totalPrice = res.data.toFixed(2)
					this.loading = false
				})
			},
			exportExcel(){
				this.$refs.receivePaymentRecordList.exportExcel()
			}
		}
	}
</script>
<style lang="scss" scoped>
	._info{
		margin:20px 0px;
		text-align: center;
		._card{
			margin:10px 0px;
			._main{
				font-size: 45px;
				color:#409EFF;
			}
			._text{
				font-size: 14px;
				color:#909399;
			}
		}
	}
</style>