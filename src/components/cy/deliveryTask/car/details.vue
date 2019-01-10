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
				<el-steps  :active="flowStep" finish-status="success">
				  <el-step title="提交装车" :description='$commonJs.formatDate(form.submit_time)'></el-step>
				  <el-step title="司机发货" :description='$commonJs.formatDate(form.delivery_time)'></el-step>
				  <el-step title="签收待审核" :description='$commonJs.formatDate(form.receive_time)'></el-step>
				  <el-step title="发货完成" :description='$commonJs.formatDate(form.review_time)'></el-step>
				</el-steps>
				<el-form 
					ref='form' label-width='85px' size='mini' class='c-form-text'>
					<divider title='发货车辆信息' ></divider>
					<el-row :gutter='10'>					
						<el-col :span='8'>
							<el-form-item label='车辆编号'>
								<span>{{form.no}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='任务编号' class='no-border'>
								<span class='c-link' @click='openTaskDetails'>{{form.task_no}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='车辆状态' class='no-border'>
								<status-tag :status='form.status'></status-tag>
							</el-form-item>
						</el-col>
						<el-col :span='24'>
							<el-form-item label='发货订单'>
								<span>{{form.orders}}</span>
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
						<el-col :span='8' v-if='form.status=="FINISH"'>
							<el-form-item label='审核人员' >
								<span>{{ form.review_user_name }}</span>
							</el-form-item>
						</el-col>							
					</el-row>
					<divider title='司机信息' style='margin-top:10px'></divider>
					<el-row :gutter='10'>
						<el-col :span='24'>
							<el-form-item label='司机单位'>
								<span>{{form.driver_unit}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='司机车牌'>
								<span>{{form.driver_no}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='司机姓名'>
								<span>{{form.driver_name}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='联系电话'>
								<span>{{form.driver_tel}}</span>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
				<divider title='发货产品' style='margin-top:10px'></divider>
				<product-list 
					ref='productList' 
					max-height='250' 
					sort-prop='index' 
					hide-edit-field 
					hide-car-fields
					hide-query 
					no-page></product-list>
				<div v-show='form.receive_time'>
					<divider title='签收图片' style='margin-top:10px'></divider>
					<img-list ref='imgList'></img-list>
				</div>
				
			</div>
			<template slot="footer">
				<slot name='footer' :data='form'></slot>
			</template>
		</el-dialog>		
		<task-details :in-dialog='inDialog' ref='taskDetails'></task-details>
	</div>
</template>
<script>
	import carApi from '@/api/cy/deliveryCar'
	import attachList from '@/components/common/attach/textList'
	import imgList from '@/components/common/attach/imgList'
	import productList from '../product/list'
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
			imgList,
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
		created(){
      this.$options.components.taskDetails = ()=>import('@/components/yyzx/deliveryTask/details')
  	},
		computed:{
			title(){
				let title='发货车辆详情 [ '+this.form.no+' ]'
				return title
			},
			qrcodeImg(){
				if(this.form.id){
					return carApi.getDetailsQrcode(this.form.id)
				}else{
					return ''
				}				
			},
			flowStep(){
				let step = 0;
				switch(this.form.status){
					case 'SUBMIT':
						step = 1
						break;
					case 'DELIVERY':
						step = 2
						break;					
					case 'RECEIVE':
						step = 3
						break;
					case 'FINISH':
						step = 4
						break;
				}
				return step
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
				carApi.getDetails(id).then(res=>{
					this.initData(res.data)
					this.loading = false
				})
				return this
			},
			initData(data){
				this.form = { ...data }
				this.$refs.productList.initData({car_id:data.id})
				if(data.attach_ids){
					this.$refs.taskAttachList.initData({attach_ids:data.attach_ids})
				}
				if(data.img_attach_ids){
					this.$refs.imgList.initData({attach_ids:data.img_attach_ids})
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
			openTaskDetails(){
				this.$refs.taskDetails.open().then(that=>{
					that.get(this.form.task_id)
				})
			}
		}
	}
</script>