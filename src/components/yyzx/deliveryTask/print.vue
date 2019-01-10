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
			<div class='no-print'>
				<divider title='打印选项'></divider>
				<el-form label-width='85px'>
					<el-row>
						<el-col :span='12'>
							<el-form-item label='公司抬头'>
								<el-select v-model='companyName' style='width:100%' clearable>
									<el-option value='广东金刚玻璃科技股份有限公司'>
									</el-option>
									<el-option value='苏州金刚防火钢型材系统有限公司'>
									</el-option>
									<el-option value='吴江金刚玻璃科技有限公司'>
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span='12'>
							<el-form-item label='注意事项'>
								<el-input v-model='subTitle' placeholder='用于显示在标题下的文字'></el-input>
							</el-form-item>
						</el-col>
						<!-- <el-col :span='12'>
							<el-form-item label='打印产品'>
								<el-switch
							    v-model="productShow">
							  </el-switch>
							</el-form-item>
						</el-col> -->
						<el-col :span='12'>
							<el-form-item label='产品字段'>
								<el-select
									style='width: 100%'
							    v-model="productField"
							    multiple							   
							    placeholder="请选择">
							    <el-option value='类别'></el-option>
							    <el-option value='规格'></el-option>
							    <el-option value='编号'></el-option>
							    <el-option value='备注'></el-option>
							  </el-select>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
				<divider title='打印页面'></divider>
			</div>
			<div class='_order-print-page'>
				<div style='display: flex;border-bottom: 1px solid #777;line-height: 1.5;padding-bottom:5px'>
					<div style='width:80px;text-align: center;'>						 
						<img :src='getQrcodeImg' style='display: block;margin:0px auto;max-width:100%'/>
					</div>
					<div style='flex:1;margin-left:15px'>
						<div style='font-size: 20px;font-weight: 700'>
							用微信扫一扫左侧二维码，手机查看发货任务信息。
						</div>
						<div style='margin-top:10px;font-size: 12px'>
							<b>注意：</b>此发货任务打印页面只用于预览查看，或内部使用，不能用于发货单签收单使用，发货签收单请在储运中心的发货车辆中打印。
						</div>
					</div>
				</div>
				<div style='text-align: center;font-weight: blod'>
					<div style='font-size:24px;font-weight: bold;'>
						{{companyName}}
					</div>
					<div style='font-size:22px;font-weight: bold;'>发货任务单</div>
					<div style='font-size:18px;color:#303133' v-show='subTitle'>（{{subTitle}}）</div>
				</div>
				<el-row>
					<el-col :span='12'>
						<div>任务编号：{{data.no}}</div>
					</el-col>
					<el-col :span='12'>
					</el-col>
				</el-row>
				<table class='c-table' style='border:2px solid #000'>
					<tr>
						<td class='label' style='width:90px'>项目名称</td>
						<td colspan="3">{{ data.project }}</td>
					</tr>
					<tr>
						<td class='label' style='width:90px'>销售公司</td>
						<td colspan="3">{{ data.saelsman_unit }}</td>
					</tr>
					<tr>
						<td class='label'>业务员</td>
						<td style='width:35%'>{{ data.salesman_name }}</td>
						<td class='label' style='width:90px'>联系电话</td>
						<td style='width:35%'>{{ data.salesman_tel}}</td>
					</tr>
					<tr>
						<td class='label'>合同号</td>
						<td style='width:35%'>{{ data.contract_no }}</td>
						<td class='label' style='width:90px'>交付方式</td>
						<td style='width:35%'>{{ data.method}}</td>
					</tr>
					<tr>
						<td class='label'>发货工厂</td>
						<td style='width:35%'>{{ data.area_name }}</td>
						<td class='label' style='width:90px'>计划发货日期</td>
						<td style='width:35%'>{{ data.plan_send_date}}</td>
					</tr>
					<tr>
						<td class='label'>发货订单</td>
						<td colspan="3">{{ data.order_no}}</td>
					</tr>					
					<tr>
						<td class='label'>调拨单号</td>
						<td style='width:35%'>{{ data.db_no }}</td>
						<td class='label' style='width:90px'>发货申请编号</td>
						<td style='width:35%'>{{ data.fh_no}}</td>
					</tr>
					<tr style='background-color:#EBEEF5'>
						<td colspan="4">收货信息</td>
					</tr>
					<tr>
						<td class='label'>收货单位</td>
						<td colspan="3">{{ data.receive_unit }}</td>
					</tr>
					<tr>
						<td class='label'>收货地址</td>
						<td colspan="3">{{ data.receive_address }}</td>
					</tr>
					<tr>
						<td class='label'>收货人</td>
						<td >{{ data.receive_name}}</td>
						<td class='label' style='width:90px'>联系电话</td>
						<td >{{ data.receive_tel}}</td>
					</tr>
					<tr style='background-color:#EBEEF5' v-if='productShow'>
						<td colspan="4">装车产品</td>
					</tr>
					<tr v-if='productShow'>
						<td colspan="8" style='padding:0px;'>
							<table class='c-table' style='border-style:hidden;'>
								<tr class='label'>
									<td style='width:50px'>序号</td>
									<td v-if='hasProductField("类别")'>类别</td>
									<td>品名</td>
									<td v-if='hasProductField("规格")'>规格</td>
									<td v-if='hasProductField("编号")'>编号</td>
									<td v-if='hasProductField("备注")'>备注</td>
									<td style='width:60px'>单位</td>
									<td style='width:60px'>数量</td>
									<td style='width:90px'>面积(㎡)</td>
								</tr>									
								<tr v-for='item in productList'>
									<td style='text-align: center'>{{item.index}}</td>
									<td v-if='hasProductField("类别")'>{{item.type}}</td>
									<td >{{item.name}}</td>
									<td v-if='hasProductField("规格")'>{{item.size}}</td>
									<td v-if='hasProductField("编号")'>{{item.no}}</td>
									<td v-if='hasProductField("备注")'>{{item.remarks}}</td>
									<td>{{item.unit}}</td>
									<td style='text-align: right'>{{item.amount}}</td>
									<td style='text-align: right'>{{item.area}}</td>
								</tr>
								<tr>
									<td :colspan="productField.length+3" class='label'>合计</td>
									<td style='text-align: right'>{{ summary.amount }}</td>
									<td style='text-align: right'>{{ summary.area }}</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
				<div style='display: flex'>
					<div style='flex:1'>任务录入：{{data.create_user_name}}</div>
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
	const dataInit = {
		id:null
	}
	import taskApi from '@/api/yyzx/deliveryTask'
	import productApi from '@/api/cy/deliveryCarProduct'
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
				productField:[
					'类别',
					'规格',
					'编号',
					'备注'
				],
				productShow:false,
				companyName:'',
				subTitle:'请提前联系收货人再送货过去',
				data:{},
				summary:{},
				show:false,
				loading:false,
				productList:[],
				list:[],
				imgLoadCount:0
			}
		},
		computed:{
			title(){
				return '发货任务打印预览页面'
			},
			buttonText(){
				return this.isEdit?'更 新':'创 建'
			},
			getQrcodeImg(){
				if(this.data.id){
					return taskApi.getDetailsQrcode(this.data.id)
				}else{
					return ''
				}
			},
		},
		methods:{
			openDialog(){
				this.$nextTick(()=>{
					if(this.resolve){
						this.resolve(this)
					}
				})
			},			
			open(){
				this.show = true
				return new Promise((resolve,reject)=>{
					this.resolve = resolve
				})
			},
			get(id){
				this.loading = true
				taskApi.getPrint(id).then(res=>{
					this.initData(res.data)
					this.loading = false
				})
				return this
			},
			initData(data){
				this.data = { ...data }
				this.subTitle = data.remarks
				this.loading = true
				productApi.getList({noPage:1,task_id:data.id}).then(res=>{
					this.productList = res.data.list
					this.summary = res.data.summary
					this.loading = false
				})
			},
			closeDialog(){
				this.data = {...dataInit}
				this.productList = []
			},
			save(){
				this.buttonLoading = true
				this.$refs.form.save().catch(()=>{
					this.buttonLoading = false
				})
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
			},
			hasProductField(field){
				return this.productField.some(item=>{
					return item==field
				})
			}
		}
	}
</script>
<style lang='scss'>
	.c-table{
		.label{
			text-align:center;
		}
	}
</style>
<style lang='scss' scoped>
	._order-print-page{
		color:#000;
		font-family: 宋体;
		line-height: 1.5;
		padding:5px;
	}
	@media print{
  	.print{
  		/*width:1000px*/
  	}
	}
</style>