<template>
	<el-dialog 
		class='c-dialog-fixed' 
		:visible.sync="show" 
		:append-to-body='inDialog'
		width='70%'
		:title='title'>
		<el-form class='c-form-text' label-width='80px' v-loading='loading'>
			<el-row>
				<el-col :span='24'>
					<el-form-item label='合同编号'>
						<span>{{ data.contract_no }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='16'>
					<el-form-item label='签订公司'>
						<span>{{ data.sign_company_name }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='8'>
					<el-form-item label='合同日期'>
						<span>{{ data.contract_date }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='16'>
					<el-form-item label='业绩公司'>
						<span>{{ data.company_name }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='8'>
					<el-form-item label='业务员'>
						<span>{{ data.salesman }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='16'>
					<el-form-item label='客户名称'>
						<span>{{ data.customer_name }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='8'>
					<el-form-item label='客户类别'>
						<span>{{ data.customer_type }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='8'>
					<el-form-item label='合同面积'>
						<span>{{ data.contract_area }}㎡</span>
					</el-form-item>
				</el-col>
				<el-col :span='8'>
					<el-form-item label='合同金额'>
						<span>￥{{ data.contract_price }}</span>
					</el-form-item>
				</el-col>
				
				<el-col :span='24'>
					<el-form-item label='合同内容'>
						<span>{{ data.content }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='24'>
					<el-form-item label='付款方式'>
						<span v-html='$commonJs.textareaToHtml(data.payment)'></span>
					</el-form-item>
				</el-col>
				<el-col :span='24'>
					<el-form-item label='附件'>
						<attach-list ref='attachList'></attach-list>
						<el-button size='mini' type='text' @click='openAttachListDialog'>查看[{{ attachTotal }}]</el-button>
					</el-form-item>
				</el-col>
				<el-col :span='8'>
					<el-form-item label='创建者'>
						<span>{{ data.create_user_name }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='8'>
					<el-form-item label='创建时间'>
						<span>{{ data.create_time | formatDate }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='8'>
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
	import contractApi from '@/api/yyzx/contract'
	import attachListDialog from '@/components/attachListDialog'
	import attachList from '@/components/common/attach/textList'

	const dataInit = {

	}
	export default {
		components:{ attachListDialog, attachList },
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
				title:'合同信息'
			}
		},
		methods:{
			open(id){
				this.data = {...dataInit}
				this.show = true
				this.loading = true
				contractApi.getInfo(id).then(res=>{
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