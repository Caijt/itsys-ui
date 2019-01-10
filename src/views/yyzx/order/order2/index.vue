<template>
	<div>
		<el-button @click='dialogShow=true'>open</el-button>
		<el-dialog 
    	class='c-full-fixed' title='创建订单' :visible.sync='dialogShow' 
    	fullscreen @open='openDialog'>
				<el-form :model='form' :rules='formRules' ref='form' label-width='80px' 
			size='small' status-icon>
				<el-row :gutter='10'>
					<el-col :span='6'>
						<el-form-item label='项目名称'>
							<el-input readonly :value='form.project_name'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='6'>
						<el-form-item label='项目编号'>
							<el-input readonly :value='form.project_no'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='6'>
						<el-form-item label='合同编号'>
							<el-input readonly :value='form.contract_no'></el-input>
						</el-form-item>
					</el-col>	
					<el-col :span='6'>
						<el-form-item label='订单编号' prop='order_no'>
							<el-input v-model='form.order_no' ></el-input>
						</el-form-item>
					</el-col>	
					<el-col :span='6'>
						<el-form-item label='订单类别' prop='type_id'>
							<el-select v-model='form.type_id' style='width: 100%'>
								<el-option 
									v-for='item in orderTypeList' 
									:value='item.id'
									:label='item.name'
									:key='item.id'>
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>	
					<el-col :span='6'>
						<el-form-item label='订单批次' prop='batch'>
							<el-input v-model='form.batch' ></el-input>
						</el-form-item>
					</el-col>	
					<el-col :span='6'>
						<el-form-item label='下单日期' prop='order_date'>
							<el-date-picker v-model='form.order_date' value-format='yyyy-MM-dd' style='width:100%'></el-date-picker>
						</el-form-item>
					</el-col>	
					<el-col :span='6'>
						<el-form-item label='下单面积' prop='order_area'>
							<el-input v-model.number='form.order_area'>
								<span slot="suffix">㎡（平方米）</span>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='6'>
						<el-form-item label='下单数量'  prop='order_amount'>
							<el-input v-model.number='form.order_amount'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='6'>
						<el-form-item label='生产状态'  prop='product_status'>
							<el-input v-model='form.product_status'></el-input>
						</el-form-item>
					</el-col>	
					<el-col :span='6'>
						<el-form-item label='交货日期'  prop='expect_delivery'>
							<el-input v-model='form.expect_delivery' ></el-input>
						</el-form-item>
					</el-col>	
					<el-col :span='24'>
						<el-form-item label='玻璃加工状态预计交期' prop='glass_expect_delivery'>
							<el-input v-model='form.glass_expect_delivery' type='textarea' :rows='3'></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<el-tabs type='border-card' value='1'>
				<el-tab-pane label='订单产品' name='1'>
					<order-list ref='orderList' max-height='350'></order-list>
				</el-tab-pane>
				<el-tab-pane label='项目信息' name='2'>
				
				</el-tab-pane>
			</el-tabs>
    	<span slot="footer">
		    <el-tooltip content='将生产计划情况提交到项目中更新项目信息'><el-button @click="save({isSubmit:true})" type="primary" :loading='formLoading'>{{isFormEdit?"更新并提交":"创建并提交"}}</el-button></el-tooltip>
		    <el-button @click="dialogShow=false">取 消</el-button>
		  </span>
		</el-dialog>
	</div>
</template>
<script>
	import orderList from '@/components/yyzx/order/list'
	import orderTypeApi from '@/api/yyzx/orderType'
	export default {
		components:{ orderList },
		data(){
			return {
				form:{},
				orderTypeList:[],
				formRules:{},
				dialogShow:false,
				formLoading:false
			}
		},
		computed:{
			isFormEdit(){
				return false
			}
		},
		mounted(){
			this.getOrderTypeList()
		},
		methods:{
			getOrderTypeList(){
				orderTypeApi.getEnumList().then(res=>{
					this.orderTypeList = res.data
				})
			},
			openDialog(){
				this.$nextTick(()=>{
					this.$refs.orderList.initData()
				})
			}
		}
	}
</script>