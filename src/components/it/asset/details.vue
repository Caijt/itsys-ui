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
					<divider title='IT资产信息' ></divider>
					<el-row :gutter='10'>					
						<el-col :span='8'>
							<el-form-item label='资产编号'>
								<span>{{form.no}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='异常状态' class='no-border'>
								<status-tag :asset='form'/>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='标识号'>
								<span>{{form.diy_no}}</span>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter='10'>
						<el-col :span='24'>
							<el-form-item label='资产型号'>
								<span>{{form.model}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='24'>
							<el-form-item label='所属公司'>
								<span>{{form.company_name}}</span>
							</el-form-item>
						</el-col>						
					</el-row>
					<el-row :gutter='10'>
						<el-col :span='8'>
							<el-form-item label='入库日期' >
								<span>{{form.inbound_date}}</span>
							</el-form-item>
						</el-col>	
						<el-col :span='8'>
							<el-form-item label='来源方式' >
								<span>{{form.source}}</span>
							</el-form-item>
						</el-col>						
						<el-col :span='8' v-if='form.stock_warning_id'>
							<el-form-item label='库存种类'>
								<span>{{form.stock_warning_name}}</span>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter='10' >
						<el-col :span='8'>
							<el-form-item label='入库数量'>
								<span>{{form.amount}}</span>
							</el-form-item>
						</el-col>						
						<el-col :span='8'>
							<el-form-item label='可用量'>
								<span>{{form.avaiable_amount}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='库存量'>
								<span>{{form.remain}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='供应商'>
								<span class='c-link no-line' @click='openSupplierDetails(form)'>{{form.supplier_name}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='资产价格'>
								<span>￥{{form.price}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='序列号'>
								<span>{{form.sn}}</span>
							</el-form-item>
						</el-col>
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
				<el-tabs v-model='tabName'>
					<el-tab-pane label='领用状态'  name='useStatus'>
						<asset-use-status-list in-dialog hide-query no-page hide-asset-fields ref='assetUseStatusList'/>
					</el-tab-pane>
					<el-tab-pane label='领用记录' name='use'>
						<asset-use-return-list in-dialog sort-prop='submit_time' hide-asset-fields hide-query no-page ref='assetUseReturnList'/>
					</el-tab-pane>
					<el-tab-pane label='维修记录' name='repair'>
						<asset-repair-list in-dialog hide-asset-fields sort-prop='repair_date' hide-query no-page ref='assetRepairList' />
					</el-tab-pane>
					<el-tab-pane label='报废记录' name='scrap'>
						<asset-scrap-list in-dialog hide-asset-fields sort-prop='scrap_date' hide-query no-page ref='assetScrapList' />
					</el-tab-pane>
				</el-tabs>
			</div>
			<template slot="footer">
				<slot name='footer' :data='form'></slot>
			</template>
		</el-dialog>
		<supplier-details :in-dialog='inDialog' ref='supplierDetails'/>
	</div>
</template>
<script>
	import assetApi from '@/api/it/asset'
	import attachList from '@/components/common/attach/textList'
	import qrcodePopover from '@/components/common/qrcodePopover'
	import statusTag from './statusTag'
	import supplierDetails from '@/components/it/supplier/details'

	const formInit = {
		id:null
	}
	export default {
		components:{ 
			attachList,
			qrcodePopover,
			statusTag,
			supplierDetails
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
		created(){
			this.$options.components.assetUseStatusList = ()=>import('./useStatus/list')
			this.$options.components.assetUseReturnList = ()=>import('./useReturn/list')
			this.$options.components.assetRepairList = ()=>import('./repair/list')
			this.$options.components.assetScrapList = ()=>import('./scrap/list')
		},
		data(){
			return {
				tabName:'useStatus',
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
				let title='IT资产详情 [ '+(this.form.no||'...')+' ]'
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
				this.tabName = 'useStatus'
				this.form = {...formInit}
				this.$refs.attachList.clear()
				this.$refs.assetUseStatusList.clear()
				this.$refs.assetUseReturnList.clear()
				this.$refs.assetRepairList.clear()
				this.$refs.assetScrapList.clear()
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
					this.$refs.attachList.initData({attach_ids:data.attach_ids})
				}
				this.$refs.assetUseStatusList.initData({asset_id:data.id})
				this.$refs.assetUseReturnList.initData({asset_id:data.id})
				this.$refs.assetRepairList.initData({asset_id:data.id})
				this.$refs.assetScrapList.initData({asset_id:data.id})
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