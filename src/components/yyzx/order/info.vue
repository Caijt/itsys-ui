<template>
	<el-dialog 
		class='c-dialog-small' 
		:visible.sync="show" 
		top='0vh' 
		:append-to-body='inDialog'
		:title='title'>
		<el-form class='c-form-text' label-width='90px' v-loading='loading'>
			<el-row>
				<el-col :span='12'>
					<el-form-item label='订单编号'>
						<span>{{ data.order_no }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='12'>
					<el-form-item label='订单类别'>
						<span>{{ data.order_type }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='12'>
					<el-form-item label='合同下单'>
						<span>{{ data.is_contract?'有':'无' }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='12'>
					<el-form-item label='订单批次'>
						<span>{{ data.batch }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='12'>
					<el-form-item label='订单面积'>
						<span>{{ data.order_area }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='12'>
					<el-form-item label='订单数量'>
						<span>{{ data.order_amount }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='12'>
					<el-form-item label='安装方式'>
						<span>{{ data.install_method }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='12'>
					<el-form-item label='下单日期'>
						<span>{{ data.order_date }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='12'>
					<el-form-item label='交货日期'>
						<span>{{ data.delivery_date }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='12'>
					<el-form-item label='系列'>
						<span>{{ data.series }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='12'>
					<el-form-item label='窗型'>
						<span>{{ data.model }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='12'>
					<el-form-item label='闭窗器样式'>
						<span>{{ data.window_style }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='12'>
					<el-form-item label='型材颜色'>
						<span>{{ data.color }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='24'>
					<el-form-item label='备注'>
						<span>{{ data.product_status }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='24'>
					<el-form-item label='玻璃加工状态预计交期'>
						<span>{{ data.glass_expect_delivery }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='24'>
					<el-form-item label='附件'>
						<el-button size='mini' type='text' @click='openAttachListDialog'>查看[{{ attachTotal }}]</el-button>
					</el-form-item>
				</el-col>
				<el-col :span='12'>
					<el-form-item label='创建者'>
						<span>{{ data.create_user_name }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='12'>
					<el-form-item label='创建时间'>
						<span>{{ data.create_time | formatDate }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='12'>
					<el-form-item label='更新者'>
						<span>{{ data.update_user_name }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='12'>
					<el-form-item label='更新时间'>
						<span>{{ data.update_time | formatDate }}</span>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<attach-list-dialog in-dialog ref='attachListDialog' ></attach-list-dialog>
	</el-dialog>
</template>
<script>
	import orderApi from '@/api/yyzx/order'
	import attachListDialog from '@/components/attachListDialog'
	
	const dataInit = {

	}
	export default {
		components:{ attachListDialog },
		props:{
			inDialog:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return {
				loading: true,
				data: { ...dataInit },
				show: false,
				attachTotal:0,
				title:'订单信息'
			}
		},
		methods:{
			open(id){
				this.data = {...dataInit}
				this.show = true
				this.loading = true
				orderApi.getInfo(id).then(res=>{
					this.data = res.data
					this.attachTotal = this.data.attach_ids?this.data.attach_ids.split(',').length:0
					this.loading = false
				})
			},
			openAttachListDialog(){
				this.$refs.attachListDialog.open({attach_ids:this.data.attach_ids})
			}
		}
	}
</script>