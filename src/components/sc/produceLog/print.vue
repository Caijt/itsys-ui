<template>
	<el-dialog 
		:title='title'
		class='c-dialog-fixed print'
		:visible.sync='show'
		:append-to-body='inDialog'
		@open='openDialog'
		width='800px'
		@close='closeDialog'>
		<div v-loading='loading' style='position: relative;'>
			<el-alert class='no-print' title='为避免打印格式出现异常，请使用Firefox（火狐）浏览器打印' type='success' style='margin-bottom:10px'></el-alert>
			<div class='_order-print-page'>
				<h2 style='text-align: center'>苏州金刚防火钢型材系统有限公司</h2>
				<h3 style='text-align: center'>汕头防火窗加工部 <span style='font-size: 19px'>生产订单</span></h3>
				<div>地址：广东省汕头市大学路叠金工业区</div>
				<table class='c-table'>
					<tr>
						<td class='label' style='max-width:90px'>合同号</td>
						<td>{{ data.contract_no }}</td>
						<td class='label'>订单号</td>
						<td>{{ data.order_no }}</td>
						<td class='label'>订单日期</td>
						<td>{{ data.order_date }}</td>
						<td class='label'>交货日期</td>
						<td>{{ data.delivery_date }}</td>
					</tr>
					<tr>
						<td class='label'>客户名称</td>
						<td colspan="5">{{ data.customer_name }}</td>
						<td class='label'>订单类型</td>
						<td>{{ data.order_type }}</td>
					</tr>
					<tr>
						<td class='label'>工程名称</td>
						<td colspan="7">{{ data.project_name }}</td>
					</tr>
					<tr>
						<td class='label'>地盘</td>
						<td colspan="7">{{ data.domain}}</td>
					</tr>
					<tr>
						<td class='label'>备注</td>
						<td colspan="7">{{ data.remarks }}</td>
					</tr>
					<template v-if='data.productList' v-for='(item,i) in data.productList'>
						<tr>
							<td class='label'>产品（{{i+1}}）</td>
							<td colspan="7">
								<div>品名：{{item.name}}</div>
								<div>产地：{{item.origin_place}}</div>
								<div>型材：{{item.steel}}</div>
								<div>五金：{{item.hardware}}</div>
								<div>玻璃：{{item.glass}}</div>
								<div>技术要求：{{item.requirement}}</div>
								<div>图纸：{{item.drawing}}</div>
								<div>其他：{{item.other}}</div>
							</td>
						</tr>
						<tr>
							<td colspan="8" style='padding:0px;'>
								<table class='c-table' style='border-style:hidden;'>
									<tr class='label'>
										<td rowspan="2">序号</td>
										<td rowspan="2">楼号</td>
										<td rowspan="2">窗号</td>
										<td colspan="2">洞口尺寸</td>
										<td colspan="2">加工尺寸</td>
										<td rowspan="2">数量<br/>面积(樘)</td>
										<td rowspan="2">结算<br/>面积(㎡)</td>
										<td rowspan="2">洞口<br/>面积(㎡)</td>
										<td rowspan="2">加工<br/>面积(㎡)</td>
									</tr>
									<tr class='label'>
										<td>W(mm)</td>
										<td>H(mm)</td>
										<td>W(mm)</td>
										<td>H(mm)</td>
									</tr>
									<tr v-for='(a,index) in item.detailsList'>
										<td style='text-align: center'>{{index+1}}</td>
										<td>{{a.floor_no}}</td>
										<td>{{a.window_no}}</td>
										<td>{{Number(a.hole_width)}}</td>
										<td>{{Number(a.hole_height)}}</td>
										<td>{{Number(a.machining_width)}}</td>
										<td>{{Number(a.machining_height)}}</td>
										<td style='text-align: right'>{{a.amount}}</td>
										<td style='text-align: right'>{{Number(a.settlement_area)}}</td>
										<td style='text-align: right'>{{Number(a.hole_area)}}</td>
										<td style='text-align: right'>{{Number(a.machining_area)}}</td>
									</tr>
									<tr>
										<td colspan="7" class='label'>小计</td>
										<td style='text-align: right'>{{ getSummaryTotal(item.detailsList,'amount')}}</td>
										<td style='text-align: right'>{{ getSummaryTotal(item.detailsList,'settlement_area')}}</td>
										<td style='text-align: right'>{{ getSummaryTotal(item.detailsList,'hole_area')}}</td>
										<td style='text-align: right'>{{ getSummaryTotal(item.detailsList,'machining_area')}}</td>
									</tr>
								</table>
							</td>
						</tr>
					</template>
				</table>
				<div style='display: flex'>
					<div style='flex:1'>下单人：{{data.submit_user_name}}</div>
					<div style='flex:1;text-align: center'>打印人：{{$store.state.user.name}}</div>
					<div style='flex:1;text-align: right'>打印时间：{{$commonJs.formatDate(new Date())}}</div>					
				</div>
			</div>
		</div>
		<span slot="footer">
	    <el-button type='primary' @click="print" v-loading='loading'>打 印</el-button>
	    <el-button @click="show=false" >关 闭</el-button>
	  </span>
	</el-dialog>
</template>
<script>
	import produceLogApi from '@/api/sc/produceLog'
	export default {
		components:{  },
		props:{
			inDialog:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return {
				data:{},
				show:false,
				loading:true,
				list:[],
				imgLoadCount:0
			}
		},
		computed:{
			title(){
				return '订单生产打印页面'
			},
			buttonText(){
				return this.isEdit?'更 新':'创 建'
			},
			getImgPercentage(){
				return this.$commonJs.getProgressPercentage(this.imgLoadCount/this.list.length)
			}
		},
		methods:{
			selectOrder(row){
				this.$refs.form.selectOrder(row)
			},			
			open(){
				this.show = true
			},
			get(params){
				this.loading = true
				produceLogApi.getOrderPrint(params).then(res=>{
					this.loading = false
					this.data = res.data
				})
				return this
			},
			openDialog(){
				this.selectMode = false
			},
			closeDialog(){},
			save(){
				this.buttonLoading = true
				this.$refs.form.save().catch(()=>{
					this.buttonLoading = false
				})
			},
			getQrcodeImg(code){
				return windowApi.qrcodeImgUrl+'/code/'+code
			},
			imgLoad(){
				this.imgLoadCount++
			},
			print(){
				window.print()
			},
			getSummaryTotal(list,field){
				let total = 0;
				list.forEach((item,i)=>{
					total += Number(item[field])
				})
				return total
			}
		}
	}
</script>
<style lang='scss' scoped>
	._order-print-page{
		color:#000;
		font-family: 宋体;
		line-height: 1.5;
	}
	@media print{
  	.print{
  		/*width:1000px*/
  	}
		.window-qrcode-box .inside-box{
    	border:1px solid #fff;
    }
	}
</style>