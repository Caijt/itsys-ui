<template>
	<div>
		<!-- <el-row :gutter='30' class='_info' >
			<el-col :span='16'>
				<el-card v-loading='loading'>
					<div class='_card'>
						<div class='_main'>￥{{ totalPrice }}</div>
						<div class='_text'>累计开票金额</div>
					</div>
				</el-card>
			</el-col>
			<el-col :span='8' >
				<el-card v-loading='loading'>
					<div class='_card'>
						<div class='_main'>{{ totalRecord }}</div>
						<div class='_text'>累计开票记录</div>
					</div>
				</el-card>
			</el-col>
		</el-row> -->
		<invoice-record-list ref='invoiceRecordList' show-more @loaded='getTotal' />
	</div>
</template>
<script>
	import invoiceRecordList from '@/components/cw/invoiceRecord/list'
	import invoiceRecordApi from '@/api/cw/invoiceRecord'
	export default {
		components:{ invoiceRecordList },
		data:()=>({
			loading:true,
			totalPrice:'0.00',
			totalRecord:0
		}),
		mounted(){
			this.$refs.invoiceRecordList.initData()
		},
		methods:{
			getTotal({ total,params }){
				this.totalRecord = total
				this.loading = true
				invoiceRecordApi.getTotalPrice(params).then(res=>{
					this.totalPrice = res.data.toFixed(2)
					this.loading = false
				})
			},
			exportExcel(){
				this.$refs.invoiceRecordList.exportExcel()
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