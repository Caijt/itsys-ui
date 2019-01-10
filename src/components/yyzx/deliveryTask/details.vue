<template>
	<div>
		<el-dialog 
			class='c-dialog-fixed'
			:visible.sync="show" 
			:append-to-body='inDialog'
			@open='openDialog'
			width='80%'
			@close='closeDialog'>
			<div slot='title' class='el-dialog__title'>
				<span>{{title}}</span>
				<qrcode-popover :qrcode-img='qrcodeImg' v-if='form.input_status==1'/>
			</div>
			<div v-loading='loading'>
				<el-form 
					ref='form' label-width='85px' size='mini' class='c-form-text'>
					<divider title='发货任务信息' ></divider>
					<el-row :gutter='10'>					
						<el-col :span='8'>
							<el-form-item label='任务编号'>
								<span>{{form.no}}</span>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter='10'>
						<el-col :span='16'>
							<el-form-item label='项目名称'>
								<span>{{form.project}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='合同号'>
								<span>{{form.contract_no}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='16'>
							<el-form-item label='销售公司'>
								<span>{{form.salesman_unit}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='业务员'>
								<span>{{form.salesman_name}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='联系电话'>
								<span>{{form.salesman_tel}}</span>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter='10'>
						<el-col :span='8'>
							<el-form-item label='调拨单号'>
								<span>{{form.db_no}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='发货申请编号' label-width='100px'>
								<span>{{form.fh_no}}</span>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter='10'>
						<el-col :span='8'>
							<el-form-item label='发货工厂'>
								<span>{{form.area_name}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='计划发货日期' label-width='100px'>
								<span>{{form.plan_send_date}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='24'>
							<el-form-item label='发货订单'>
								<span>{{form.order_no}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='交付方式'>
								<span>{{form.method}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='24'>
							<el-form-item label='收货单位'>
								<span>{{form.receive_unit}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='24'>
							<el-form-item label='收货地址'>
								<span>{{form.receive_address}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='收货人'>
								<span>{{form.receive_name}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='联系电话'>
								<span>{{form.receive_tel}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='24'>
							<el-form-item label='注意事项'>
								<span>{{form.remarks}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='24'>
							<el-form-item label='附件'>
								<attach-list ref='taskAttachList' />
							</el-form-item>
						</el-col>		
					</el-row>
					<el-row :gutter='10'>	
						<el-col :span='8'>
							<el-form-item label='提交人'>
								<span>{{ form.create_user_name }}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='提交时间' >
								<span>{{ $commonJs.formatDate(form.submit_time) }}</span>
							</el-form-item>
						</el-col>						
					</el-row>
				</el-form>
				<divider title='发货产品' style='margin-top:10px'></divider>
				<product-list ref='productList' hide-edit-field max-height='250' sort-prop='index' hide-edit-field hide-query no-page></product-list>
				<divider title='发货进度' style='margin-top:10px'></divider>
				<el-row style='text-align: center;margin-top:10px'>					
					<el-col :span='8'>
						<div style='margin-bottom: 5px;color:#999'>发货进度</div>
						<el-tooltip :content='form.cy_delivery_area_total+"㎡（已发货面积） / "+form.cy_load_area_total+"㎡（装车面积）"'>
							<el-progress 
								type="circle" 
								:percentage="Number(form.delivery_progress)"
								:stroke-width='10'>
							</el-progress>
						</el-tooltip>
					</el-col>
					<el-col :span='8'>
						<div style='margin-bottom: 5px;color:#999'>签收进度</div>
						<el-tooltip :content='form.cy_receive_area_total+"㎡（已签收面积） / "+form.cy_load_area_total+"㎡（装车面积）"'>
							<el-progress 
								type="circle" 
								:percentage="Number(form.receive_progress)"
								:stroke-width='10'>
							</el-progress>
						</el-tooltip>
					</el-col>
					<el-col :span='8'>
						<div style='margin-bottom: 5px;color:#999'>完成进度</div>
						<el-tooltip :content='form.cy_finish_area_total+"㎡（已完成面积） / "+form.cy_load_area_total+"㎡（装车面积）"'>
							<el-progress 
								type="circle" 
								:percentage="Number(form.finish_progress)"
								:stroke-width='10'>
							</el-progress>
						</el-tooltip>
					</el-col>						
				</el-row>
				<divider title='发货车辆' style='margin-top:10px'></divider>
				<car-list in-dialog ref='carList' hide-task-field hide-edit-field max-height='250' hide-query no-page></car-list>				
			</div>
			<template slot="footer">
				<slot name='footer' :data='form'></slot>
			</template>
		</el-dialog>		
	</div>
</template>
<script>
	import taskApi from '@/api/yyzx/deliveryTask'
	import attachList from '@/components/common/attach/textList'
	import productList from '@/components/cy/deliveryTask/product/list'
	import carList from '@/components/cy/deliveryTask/car/list'
	import statusTag from './statusTag'
	import qrcodePopover from '@/components/common/qrcodePopover'

	const formInit = {
		id:null,
		input_status:0,
		order_no:'',
		project_name:'',
		customer_name:'',
		order_date:'',
		order_type:'',
		delivery_date:'',
		contract_no:'',
		domain:'',
		remarks:'',
		load_progress:0,
		delivery_progress:0,
		receive_progress:0,
		finish_progress:0,
	}
	export default {
		components:{ 
			attachList, 
			productList, 
			statusTag,
			carList,
			qrcodePopover
		},
		props:{
			inDialog:{
				type:Boolean,
				default:false
			},
			hideSampleField:{
				type:Boolean,
				default:false
			},
		},
		data(){
			return {
				resolve:null,
				loading: false,
				form: { ...formInit },
				show: false,
				tabName:'list'
			}
		},
		computed:{
			qrcodeImg(){
				if(this.form.id){
					return taskApi.getDetailsQrcode(this.form.id)
				}else{
					return ''
				}				
			},
			title(){
				let title='发货任务详情 [ '+this.form.no+' ]'
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
				this.tabName = 'list'
				this.form = {...formInit}
				this.$refs.productList.clear()
				this.$refs.taskAttachList.clear()
			},
			get(id){
				this.loading = true
				this.form.id = id				
				taskApi.getDetails(id).then(res=>{
					this.initData(res.data)
					this.loading = false
				})
				return this
			},
			initData(data){
				this.form = { ...data }
				this.$refs.productList.initData({task_id:data.id})
				this.$refs.carList.initData({task_id:data.id})
				if(data.attach_ids){
					this.$refs.taskAttachList.initData({attach_ids:data.attach_ids})
				}
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
			openSampleInfo(){
				this.$refs.sampleInfo.open().then(that=>{
					that.get(this.form.sample_id)
				})
			},
			openSupplyInfo(){
				this.$refs.supplyListDialog.open().then(that=>{
					that.form.apply_no = this.form.no
					that.initData({apply_id:this.form.id})
				})
			},
		}
	}
</script>