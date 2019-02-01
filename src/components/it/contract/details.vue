<template>
	<div>
		<el-dialog 
			class='c-dialog-fixed'
			:visible.sync="show" 
			:append-to-body='inDialog'
			@open='openDialog'
			width='70%'
			@close='closeDialog'>
			<div slot='title' class='el-dialog__title'>
				<span>{{title}}</span>
				<qrcode-popover :qrcode-img='qrcodeImg' v-if='form.input_status>=0'/>
			</div>
			<div v-loading='loading'>
				<el-form 
					ref='form' label-width='85px' size='mini' class='c-form-text'>
					<divider title='IT部门合同信息' ></divider>
					<el-row :gutter='10'>					
						<el-col :span='8'>
							<el-form-item label='合同编号'>
								<span>{{form.no}}</span>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter='10'>
						<el-col :span='24'>
							<el-form-item label='合同名称'>
								<span>{{form.name}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='24'>
							<el-form-item label='所属公司'>
								<span>{{form.company_name}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='24'>
							<el-form-item label='供应合作商'>
								<span class='c-link no-line' @click='openSupplierDetails(form)'>{{form.supplier_name}}</span>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter='10'>
						<el-col :span='8'>
							<el-form-item label='签订日期' >
								<span>{{form.sign_date}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='生效日期' >
								<span>{{form.begin_date}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='失效日期' >
								<span>{{form.end_date}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='合同金额'>
								<span>￥{{form.price}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='已付金额'>
								<span>￥{{form.pay_price_total}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='未付金额'>
								<span>￥{{form.unpay}}</span>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter='10' >
						<el-col :span='24'>
							<el-form-item label='备注'>
								<span v-html='$commonJs.textareaToHtml(form.remarks)'></span>
							</el-form-item>
						</el-col>
						<el-col :span='24'>
							<el-form-item label='附件'>
								<attach-list ref='attachList' />
							</el-form-item>
						</el-col>		
					</el-row>
					<el-row :gutter='10'>	
						<el-col :span='8'>
							<el-form-item label='录入员'>
								<span>{{ form.create_user_name }}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='创建时间' >
								<span>{{ $commonJs.formatDate(form.create_time) }}</span>
							</el-form-item>
						</el-col>	
						<el-col :span='8'>
							<el-form-item label='更新时间' >
								<span>{{ $commonJs.formatDate(form.update_time) }}</span>
							</el-form-item>
						</el-col>						
					</el-row>
				</el-form>
				<divider title='合同付款信息' ></divider>
				<pay-list in-dialog hide-query no-page hide-contract-fields ref='payList'/>
			</div>
			<template slot="footer">
				<slot name='footer' :data='form'></slot>
			</template>
		</el-dialog>
		<supplier-details :in-dialog='inDialog' ref='supplierDetails'/>
	</div>
</template>
<script>
	import api from '@/api/it/contract'
	import attachList from '@/components/common/attach/textList'
	import qrcodePopover from '@/components/common/qrcodePopover'
	import supplierDetails from '@/components/it/supplier/details'

	const formInit = {
		id:null
	}
	export default {
		components:{ 
			attachList,
			qrcodePopover,
			supplierDetails
		},
		props:{
			inDialog:{
				type:Boolean,
				default:false
			}
		},
		created(){
			this.$options.components.payList = ()=>import('./pay/list')
		},
		data(){
			return {
				resolve:null,
				loading: false,
				form: { ...formInit },
				show: false
			}
		},
		computed:{
			qrcodeImg(){
				if(this.form.id){
					return api.getDetailsQrcode(this.form.id)
				}else{
					return ''
				}				
			},
			title(){
				let title='IT部门合同详情 [ '+(this.form.no||'...')+' ]'
				return title
			}
		},
		methods:{
			openDialog(){
				this.$nextTick(()=>{
					if(this.resolve){
						this.resolve(this)
					}
				})
			},
			closeDialog(){
				this.form = {...formInit}
				this.$refs.attachList.clear()
				this.$refs.payList.clear()
			},
			getDetails(id){
				this.loading = true
				this.form.id = id				
				api.getDetails(id).then(res=>{
					this.initData(res.data)
					this.loading = false
				})
				return this
			},
			initData(data){
				this.form = { ...data }
				if(data.attach_ids){
					this.$refs.attachList.initData({attach_ids:data.attach_ids})
				}
				this.$refs.payList.initData({contract_id:data.id})
			},
			open(){
				this.show = true
				return new Promise((resolve,reject)=>{
					this.resolve = resolve
				}) 
			},
			reload(){
				this.get(this.form.id)
			},
			openSupplierDetails(row){
				this.$refs.supplierDetails.open().then(that=>{
					that.getDetails(row.supplier_id)
				})
			}
		}
	}
</script>