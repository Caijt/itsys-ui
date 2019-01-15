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
				<qrcode-popover :qrcode-img='qrcodeImg' v-if='form.input_status>=0'/>
			</div>
			<div v-loading='loading'>
				<el-form 
					ref='form' label-width='85px' size='mini' class='c-form-text'>
					<divider title='IT资产交还信息' ></divider>
					<el-row :gutter='10'>					
						<el-col :span='8'>
							<el-form-item label='交还单编号'>
								<span>{{form.no}}</span>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter='10'>						
						<el-col :span='24'>
							<el-form-item label='所属公司'>
								<span>{{form.company_name}}</span>
							</el-form-item>
						</el-col>						
					</el-row>
					<el-row :gutter='10'>
						<el-col :span='8'>
							<el-form-item label='交还日期' >
								<span>{{form.record_date}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='24'>
							<el-form-item label='交还备注'>
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
							<el-form-item label='录入员'>
								<span>{{ form.create_user_name }}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='提交时间' >
								<span>{{ $commonJs.formatDate(form.submit_time) }}</span>
							</el-form-item>
						</el-col>	
						<el-col :span='8'>
							<el-form-item label='更新时间' >
								<span>{{ $commonJs.formatDate(form.update_time) }}</span>
							</el-form-item>
						</el-col>						
					</el-row>
				</el-form>
				<divider title='资产列表' style='margin-top:10px'></divider>
				<detail-list hide-record-fields no-page hide-query ref='assetList'/>
			</div>
			<template slot="footer">
				<slot name='footer' :data='form'></slot>
			</template>
		</el-dialog>		
	</div>
</template>
<script>
	import assetApi from '@/api/it/assetReturnRecord'
	import attachList from '@/components/common/attach/textList'
	import qrcodePopover from '@/components/common/qrcodePopover'
	import detailList from './detail/list'

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
			qrcodePopover,
			detailList
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
				show: false
			}
		},
		computed:{
			qrcodeImg(){
				if(this.form.id){
					return assetApi.getDetailsQrcode(this.form.id)
				}else{
					return ''
				}				
			},
			title(){
				let title='IT资产交还单详情 [ '+(this.form.no||'...')+' ]'
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
				this.$refs.taskAttachList.clear()
			},
			getDetails(id){
				this.loading = true
				this.form.id = id				
				assetApi.getDetails(id).then(res=>{
					this.initData(res.data)
					this.loading = false
				})
				return this
			},
			initData(data){
				this.form = { ...data }
				if(data.attach_ids){
					this.$refs.taskAttachList.initData({attach_ids:data.attach_ids})
				}
				this.$refs.assetList.initData({record_id:data.id})
			},
			open(){
				this.show = true
				return new Promise((resolve,reject)=>{
					this.resolve = resolve
				}) 
			},
			reload(){
				this.get(this.form.id)
			}
		}
	}
</script>