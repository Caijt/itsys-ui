<template>
	<el-dialog 
		class='c-dialog-fixed'
		:visible.sync="show" 
		:append-to-body='inDialog'
		:title='title'
		@open='openDialog'
		width='80%'
		@close='closeDialog'>
		<div v-loading='loading'>
			<el-form 
				ref='form' label-width='85px' size='mini' class='c-form-text'>
				<divider title='项目信息'></divider>
				<el-row :gutter='10'>					
					<el-col :span='16'>
						<el-form-item label='项目名称'>
							<span>{{form.project_name}}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='打样工厂'>
							<span>{{form.factory_name}}</span>
						</el-form-item>
					</el-col>
					<el-col :span='16'>
						<el-form-item label='销售公司'>
							<span>{{form.company_name}}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='业务员'>
							<span>{{form.salesman}}</span>
						</el-form-item>
					</el-col>
					<el-col :span='16'>
						<el-form-item label='客户名称'>
							<span>{{form.customer_name}}</span>
						</el-form-item>
					</el-col>					
				</el-row>
				<divider title='色样信息' style='margin-top:10px'></divider>
					<el-row :gutter='10'>					
						<el-col :span='8'>
							<el-form-item label='色样编号'>
								<span>{{form.no}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='打样次数' >
								<span>{{form.apply_total}} 次</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='色板色号' >
								<span>{{form.color_no}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='系列'>
								<span>{{form.series}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='材料'>
								<span>{{form.material}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='表面处理'>
								<span>{{form.surface}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='型材品牌'>
								<span>{{form.xc_brand}}</span>
							</el-form-item>
						</el-col>	
						<el-col :span='8'>
							<el-form-item label='五金品牌'>
								<span>{{form.wj_brand}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='温控' >
								<span>{{form.temperature}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='型材颜色'>
								<span>{{form.xc_color}}</span>
							</el-form-item>
						</el-col>									
						<el-col :span='8'>
							<el-form-item label='五金颜色'>
								<span>{{form.wj_color}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='玻璃胶颜色' >
								<span>{{form.glass_color}}</span>
							</el-form-item>
						</el-col>
						
						<el-col :span='24'>
							<el-form-item label='其它要求' >
								<span>{{form.other}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='提交人'>
								<span>{{ form.submit_user_name }}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='提交时间' >
								<span>{{ $commonJs.formatDate(form.submit_time) }}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='打样状态' class='no-border'>
								<status-tag :status='form.status'></status-tag>
							</el-form-item>
						</el-col>
					</el-row>
			</el-form>
			<div v-show='form.apply_total'>
				<divider title='打样申请记录' style='margin-top:10px'></divider>
				<apply-list ref='applyList' in-dialog hide-sample-field hide-query no-page></apply-list>
			</div>
		</div>
		<template slot="footer">
			<slot name='footer' :data='form'></slot>
		</template>
	</el-dialog>
</template>
<script>
	import colorSampleApi from '@/api/xs/colorSample'
	import attachListDialog from '@/components/attachListDialog'
	import attachList from '@/components/common/attach/textList'
	import statusTag from '../statusTag'

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
		components:{ attachListDialog,attachList,statusTag },
		props:{
			inDialog:{
				type:Boolean,
				default:false
			}
		},
		created(){
      this.$options.components.applyList = ()=>import('../query/applyList')
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
				let title='色样信息 ['+this.form.no+']'
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
				this.$refs.applyList.clear()
			},
			get(id){
				this.loading = true
				this.form.id = id				
				colorSampleApi.getInfo(id).then(res=>{
					this.initData(res.data)
					this.loading = false
				})
				return this
			},
			initData(data){
				this.form = {...data}
				if(data.apply_total){
					this.$refs.applyList.initData({sample_id:data.id})
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
			tabClick(){
				if(this.tabName=='list'){
					this.$refs.productList.reload()
				}else if(this.tabName=='summary'){
					this.$refs.productSummaryList.reload()				
				}else if(this.tabName=='log'){
					this.$refs.logList.reload()
				}
			}
		}
	}
</script>