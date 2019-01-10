<template>
	<div>
		<el-dialog 
			class='c-dialog-fixed'
			:visible.sync="show" 
			:append-to-body='inDialog'
			:title='title'
			@open='openDialog'
			width='80%'
			@close='closeDialog'>
			<div v-loading='loading'>
				<el-steps  :active="flowStep" finish-status="success">
				  <el-step title="打样申请" :description='$commonJs.formatDate(form.submit_time)'></el-step>
				  <el-step title="打样归档" :description='$commonJs.formatDate(form.file_time)'></el-step>
				  <el-step title="采购打板" :description='$commonJs.formatDate(form.make_time)'></el-step>
				  <el-step title="色样寄出" :description='$commonJs.formatDate(form.delivery_time)'></el-step>
				  <el-step title="客户确认" :description='$commonJs.formatDate(form.confirm_time)' :status='form.status=="CONFIRM_N"?"error":""'></el-step>
				</el-steps>
				<el-form 
					ref='form' label-width='85px' size='mini' class='c-form-text'>
					<divider title='打样申请信息' style='margin-top:10px'></divider>
					<el-row :gutter='10'>					
						<el-col :span='8'>
							<el-form-item label='打样编号'>
								<span>{{form.no}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8' v-if='!hideSampleField'>
							<el-form-item label='色样编号' class='no-border' >
								<span class='c-link' @click='openSampleInfo'>{{form.sample_no}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='打样次数'>
								<span>第 {{form.apply_total}} 次打样</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='申请数量'>
								<span>{{form.amount}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='16'>
							<el-form-item label='寄出快递'>
								<span>{{form.express}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='24'>
							<el-form-item label='申请备注'>
								<span>{{form.remarks}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='24'>
							<el-form-item label='寄回地址'>
								<span>{{form.receive_address}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='收件人'>
								<span>{{form.receiver}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='联系手机'>
								<span>{{form.receive_tel}}</span>
							</el-form-item>
						</el-col>				
					</el-row>
					<el-row :gutter='10'>	
						<el-col :span='8'>
							<el-form-item label='申请人'>
								<span>{{ form.submit_user_name }}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='申请时间' >
								<span>{{ $commonJs.formatDate(form.submit_time) }}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8' v-if='form.supply_total'>
							<el-form-item label='补充内容' class='no-border'>
								<el-badge :value='form.supply_total'>
									<el-button @click='openSupplyInfo'>查看</el-button>
								</el-badge>								
							</el-form-item>
						</el-col>
					</el-row>
					<div v-show='form.file_time'>
						<divider title='归档信息' style='margin-top:10px'></divider>
						<el-row :gutter='10'>
							<el-col :span='8'>
								<el-form-item label='归档编号'>
									<span>{{ form.file_no }}</span>
								</el-form-item>
							</el-col>
							<el-col :span='8'>
								<el-form-item label='归档日期'>
									<span>{{ form.file_date }}</span>
								</el-form-item>
							</el-col>
							<el-col :span='24'>
								<el-form-item label='归档说明'>
									<span>{{ form.file_remarks }}</span>
								</el-form-item>
							</el-col>
							<el-col :span='24'>
								<el-form-item label='附件'>
									<attach-list ref='fileAttachList' />
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter='10'>
							<el-col :span='8'>
								<el-form-item label='归档人'>
									<span>{{ form.file_user_name }}</span>
								</el-form-item>
							</el-col>
							<el-col :span='8'>
								<el-form-item label='归档时间' >
									<span>{{ $commonJs.formatDate(form.file_time) }}</span>
								</el-form-item>
							</el-col>
						</el-row>
					</div>
					<div v-show='form.make_time'>
						<divider title='打板信息' style='margin-top:10px'></divider>
						<el-row :gutter='10'>
							<el-col :span='8'>
								<el-form-item label='打板厂家'>
									<span>{{ form.make_supplier }}</span>
								</el-form-item>
							</el-col>
							<el-col :span='8' v-if='form.make_is_finish'>
								<el-form-item label='完成日期'>
									<span>{{ form.make_finish_date }}</span>
								</el-form-item>
							</el-col>
							<el-col :span='8' v-else>
								<el-form-item label='预计完成日期' label-width='100px'>
									<span>{{ form.make_finish_date }}</span>
								</el-form-item>
							</el-col>
							<el-col :span='24'>
								<el-form-item label='单板说明'>
									<span>{{ form.make_remarks }}</span>
								</el-form-item>
							</el-col>
							<el-col :span='24'>
								<el-form-item label='附件'>
									<attach-list ref='makeAttachList' />
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter='10'>
							<el-col :span='8'>
								<el-form-item label='打板人'>
									<span>{{ form.make_user_name }}</span>
								</el-form-item>
							</el-col>
							<el-col :span='8'>
								<el-form-item label='打板时间' >
									<span>{{ $commonJs.formatDate(form.make_time) }}</span>
								</el-form-item>
							</el-col>
						</el-row>
					</div>
					<div v-show='form.delivery_time'>
						<divider title='寄出信息' style='margin-top:10px'></divider>
						<el-row :gutter='10'>
							<el-col :span='8'>
								<el-form-item label='快递信息'>
									<span>{{ form.delivery_express }}</span>
								</el-form-item>
							</el-col>							
							<el-col :span='8'>
								<el-form-item label='寄出日期' >
									<span>{{ form.delivery_date }}</span>
								</el-form-item>
							</el-col>
							<el-col :span='24'>
								<el-form-item label='寄出说明'>
									<span>{{ form.delivery_remarks }}</span>
								</el-form-item>
							</el-col>
							<el-col :span='24'>
								<el-form-item label='附件'>
									<attach-list ref='deliveryAttachList' />
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter='10'>
							<el-col :span='8'>
								<el-form-item label='寄出人'>
									<span>{{ form.delivery_user_name }}</span>
								</el-form-item>
							</el-col>
							<el-col :span='8'>
								<el-form-item label='寄出时间' >
									<span>{{ $commonJs.formatDate(form.delivery_time) }}</span>
								</el-form-item>
							</el-col>
						</el-row>
					</div>
					<div v-show='form.confirm_time'>
						<divider title='客户确认信息' style='margin-top:10px'></divider>
						<el-row :gutter='10'>
							<el-col :span='8'>
								<el-form-item label='客户确认' class='no-border'>
									<el-tag type='success' v-if='form.confirm_is_pass'>通过</el-tag>
									<el-tag type='danger' v-else>未通过</el-tag>
								</el-form-item>
							</el-col>							
							<el-col :span='24'>
								<el-form-item label='确认说明'>
									<span>{{ form.confirm_remarks }}</span>
								</el-form-item>
							</el-col>
							<el-col :span='24'>
								<el-form-item label='附件'>
									<attach-list ref='confirmAttachList' />
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter='10'>
							<el-col :span='8'>
								<el-form-item label='确认人'>
									<span>{{ form.confirm_user_name }}</span>
								</el-form-item>
							</el-col>
							<el-col :span='8'>
								<el-form-item label='确认时间' >
									<span>{{ $commonJs.formatDate(form.confirm_time) }}</span>
								</el-form-item>
							</el-col>
						</el-row>
					</div>
				</el-form>
			</div>
			<template slot="footer">
				<slot name='footer' :data='form'></slot>
			</template>
		</el-dialog>
		<sample-info v-if='!hideSampleField' :in-dialog='inDialog' ref='sampleInfo'></sample-info>
		<supply-list-dialog ref='supplyListDialog'/>
	</div>
</template>
<script>
	import applyApi from '@/api/xs/colorSampleApply'
	import attachListDialog from '@/components/attachListDialog'
	import attachList from '@/components/common/attach/textList'
	import sampleInfo from '../edit/info'
	import supplyListDialog from './supplyListDialog'

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
		remarks:''
	}
	export default {
		components:{ attachListDialog,attachList,sampleInfo,supplyListDialog },
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
			productParams(){
				let order_id = this.form.id
				return {
					order_id
				}
			},
			title(){
				let title='打样申请进度 ['+this.form.no+']'
				return title
			},
			flowStep(){
				let step = 0;
				switch(this.form.status){
					case 'APPLY':
						step = 1
						break;
					case 'FILE':
					case 'MAKING':
						step = 2
						break;					
					case 'MAKE':
						step = 3
						break;
					case 'DELIVERY':
						step = 4
						break;
					case 'CONFIRM_Y':
					case 'CONFIRM_N':
						step = 5
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
				this.$refs.fileAttachList.clear()
				this.$refs.makeAttachList.clear()
				this.$refs.deliveryAttachList.clear()
			},
			get(id){
				this.loading = true
				this.form.id = id				
				applyApi.getInfo(id).then(res=>{
					this.initData(res.data)
					this.loading = false
				})
				return this
			},
			initData(data){
				this.form = { ...data }
				if(data.file_time){
					this.$refs.fileAttachList.initData({attach_ids:data.file_attach_ids})
				}
				if(data.make_time){
					this.$refs.makeAttachList.initData({attach_ids:data.make_attach_ids})
				}
				if(data.delivery_time){
					this.$refs.deliveryAttachList.initData({attach_ids:data.delivery_attach_ids})
				}
				if(data.confirm_time){
					this.$refs.confirmAttachList.initData({attach_ids:data.confirm_attach_ids})
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