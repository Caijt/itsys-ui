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
								<el-input v-model='subTitle' placeholder='用于显示在标题下的文字' clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :span='12'>
							<el-form-item label='订单产品'>
								<el-switch
							    v-model="productShow">
							  </el-switch>
							</el-form-item>
						</el-col>
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
				<div style='display: flex;border-bottom: 1px solid #777;line-height: 1.5'>
					<div style='width:80px;text-align: center;'>						 
						<img :src='getQrcodeImg' style='display: block;margin:0px auto;max-width:100%'/>
						<div style='font-size: 12px'><b>验证码：{{data.code}}</b></div>
					</div>
					<div style='flex:1;margin-left:15px'>
						<div style='font-size: 17px;font-weight: 700'>
							发货司机请于接单、签收时用手机扫描左侧二维码，及时提交任务状态及上传收货签收图。
						</div>
						<div style='margin-top:5px;font-size: 12px'>
							<b>注意：</b>本任务书由送货司机将发货单一并签收后带回我司，请在签收当场清点单物品数量规格，如有异常，请在发货回单中注明，并于三个工作日内以邮件或其它书面形式反馈给我司业务人员，超过时限，我司概不负责。
						</div>
					</div>
				</div>
				<div style='text-align: center;font-weight: blod'>
					<div style='font-size:24px;font-weight: bold;'>
						{{companyName}}
					</div>
					<div style='font-size:22px;font-weight: bold;'>发货签收单</div>
					<div style='font-size:18px;color:#303133' v-show='subTitle'>（{{subTitle}}）</div>
				</div>
				<el-row>
					<el-col :span='12'>
						<div>任务编号：{{data.task_no}}</div>
					</el-col>
					<el-col :span='12'>
						<div style='text-align: right'>车辆编号：{{data.no}}</div>
					</el-col>
				</el-row>
				<table class='c-table' style='border:2px solid #000'>
					<tr>
						<td class='label' style='width:90px'>项目名称</td>
						<td colspan="3">{{ data.project }}</td>
					</tr>
					<tr>
						<td class='label'>合同号</td>
						<td style='width:35%'>{{ data.contract_no }}</td>
						<td class='label' style='width:90px'>发货申请编号</td>
						<td style='width:35%'>{{ data.fh_no}}</td>
					</tr>
					<tr>
						<td class='label'>业务员</td>
						<td >{{ data.salesman_name}}</td>
						<td class='label' style='width:90px'>联系电话</td>
						<td >{{ data.salesman_tel}}</td>
					</tr>
					<tr v-if='productShow'>
						<td class='label'>发货订单</td>
						<td colspan="3">{{ data.orders}}</td>
					</tr>
					<tr>
						<td class='label'>交付方式</td>
						<td colspan="3">{{ data.method }}</td>
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
					<tr style='background-color:#EBEEF5'>
						<td colspan="4">发货车辆信息</td>
					</tr>
					<tr>
						<td class='label'>承运单位</td>
						<td>{{data.driver_unit}}</td>
						<td class='label'>车辆车牌</td>
						<td>{{data.driver_no}}</td>
					</tr>
					<tr>
						<td class='label'>司机姓名</td>
						<td>{{data.driver_name}}</td>
						<td class='label'>联系电话</td>
						<td>{{data.driver_tel}}</td>
					</tr>
					<tr style='background-color:#EBEEF5'>
						<td colspan="4">以下由储运部填写</td>
					</tr>
					<tr style='height:35px'>
						<td class='label'>储运负责人</td>
						<td colspan="3"></td>
					</tr>					
					<tr style='background-color:#EBEEF5'>
						<td colspan="4">收货签收</td>
					</tr>
					<tr style='height:35px'>
						<td class='label'>签收人</td>
						<td></td>
						<td class='label'>签收时间</td>
						<td></td>
					</tr>
					<tr>
						<td class='label' style='height: 50px'>意见反馈</td>
						<td colspan="3"></td>
					</tr>
				</table>
				<div style='display: flex'>
					<div style='flex:1'>任务录入：{{data.task_user_name}}</div>
					<div style='flex:1;text-align: center'>车辆录入：{{data.create_user_name}}</div>
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
	import carApi from '@/api/cy/deliveryCar'
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
				return '车辆发货任务单打印页面'
			},
			buttonText(){
				return this.isEdit?'更 新':'创 建'
			},
			getQrcodeImg(){
				if(this.data.id){
					return carApi.getPrintQrcode(this.data.id)
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
				carApi.getPrint(id).then(res=>{
					this.initData(res.data)
					this.loading = false
				})
				return this
			},
			initData(data){
				this.data = { ...data }
				this.subTitle = data.task_remarks
				this.loading = true
				productApi.getList({noPage:1,car_id:data.id}).then(res=>{
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