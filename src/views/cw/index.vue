<template>
	<div>		
		<arrears-index v-if='hasPath("/cw/arrears")' style='margin-bottom: 10px'/>
		
		<invoice-index v-if='hasPath("/cw/invoiceRecord")' style='margin-bottom: 10px'/>
		<receive-payment-index v-if='hasPath("/cw/receivePayment")' style='margin-bottom: 10px'/>
		<settlement-arrears-index v-if='hasPath("/cw/settlementArrears")' style='margin-bottom: 10px'/>
	</div>
</template>
<script>
	import arrearsIndex from '@/components/cw/arrears/summaryIndex'
	import settlementArrearsIndex from '@/components/cw/settlementArrears/summaryIndex'
	import invoiceIndex from '@/components/cw/invoiceRecord/summaryIndex'
	import receivePaymentIndex from '@/components/cw/receivePayment/summaryIndex'

	export default {
		components:{
			arrearsIndex,
			settlementArrearsIndex,
			invoiceIndex,
			receivePaymentIndex,
		},
		data(){
			return {
				
			}
		},
		mounted(){
			
		},
		methods:{
			hasPath(path){
				return this.$commonJs.hasUserPath(path)
			}
		}
	}
</script>