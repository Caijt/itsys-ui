<template>
	<el-dialog 
		class='c-dialog-fixed' 
		:visible.sync="show" 
		width='80%'
		:append-to-body='inDialog'
		:title='title'>
		<div v-loading='loading'>
			<el-steps :active="flowStep" finish-status="success">
			  <el-step title="色样提交" :description='$commonJs.formatDate(data.submit_time)'></el-step>
			  <el-step title="运营归档" :description='$commonJs.formatDate(data.file_time)'></el-step>
			  <el-step title="采购打板" :description='$commonJs.formatDate(data.make_time)'></el-step>
			  <el-step title="色样寄出" :description='$commonJs.formatDate(data.delivery_time)'></el-step>
			  <el-step title="客户确认" :description='$commonJs.formatDate(data.confirm_time)'></el-step>
			</el-steps>
			<el-form class='c-form-text' label-width='85px' v-loading='loading'>
				<divider title='色样申请信息'></divider>
				<el-row>
					<el-col :span='8'>
						<el-form-item label='打样编号'>
							<span>{{ data.no }}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='打样次数'>
							<span>第 {{ data.time }} 次</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='16'>
						<el-form-item label='项目名称'>
							<span>{{ data.project_name }}</span>
						</el-form-item>
					</el-col>
					<el-col :span='16'>
						<el-form-item label='销售公司'>
							<span>{{ data.company_name }}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='客户名称'>
							<span>{{ data.customer_name }}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='系列'>
							<span>{{ data.series }}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='表面处理'>
							<span>{{ data.surface }}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='温控'>
							<span>{{ data.temperature }}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='型材颜色'>
							<span>{{ data.xc_color }}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='五金颜色'>
							<span>{{ data.wj_color }}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='型材品牌'>
							<span>{{ data.xc_brand }}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='五金品牌'>
							<span>{{ data.wj_brand }}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='玻璃胶颜色'>
							<span>{{ data.glass_color }}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='材料'>
							<span>{{ data.material }}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='色板色号'>
							<span>{{ data.color_no }}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='色板数量'>
							<span>{{ data.amount }}</span>
						</el-form-item>
					</el-col>
					<el-col :span='24'>
						<el-form-item label='其它要求'>
							<span>{{ data.amount }}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='收件人'>
							<span>{{ data.receiver }}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='联系电话'>
							<span>{{ data.receive_tel }}</span>
						</el-form-item>
					</el-col>
					<el-col :span='24'>
						<el-form-item label='收件地址'>
							<span>{{ data.receive_address }}</span>
						</el-form-item>
					</el-col>
					<el-col :span='24'>
						<el-form-item label='快递信息'>
							<span>{{ data.express }}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='录入员'>
							<span>{{ data.create_user_name }}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='提交时间'>
							<span>{{ data.submit_time | formatDate }}</span>
						</el-form-item>
					</el-col>
					<el-col :span='24'>
						<el-form-item label='补充说明'>
							<supply-list size='mini' in-dialog ref='supplyList' hide-query :params='supplyParams'></supply-list>
						</el-form-item>
					</el-col>
				</el-row>
				<div v-show='data.file_time!=null'>
					<divider title='运营归档'></divider>
					<el-row>
						<el-col :span='8'>
							<el-form-item label='归档编号'>
								<span>{{ data.file_no }}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='归档日期'>
								<span>{{ data.file_date }}</span>
							</el-form-item>
						</el-col>
						<el-col :span='24'>
							<el-form-item label='归档说明'>
								<span>{{ data.file_remarks }}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='归档员'>
								<span>{{ data.file_user_name }}</span>
							</el-form-item>
						</el-col>				
						<el-col :span='8'>
							<el-form-item label='提交时间'>
								<span>{{ data.file_time | formatDate}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='24'>
							<el-form-item label='相关附件'>
								<attach-list size='mini' ref='fileAttachList' hide-query :params='fileAttachParams'></attach-list>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
				<template v-if='data.make_time!=null'>
					<divider title='采购打板'></divider>
					<el-row>
						<el-col :span='8'>
							<el-form-item label='打板厂家'>
								<span>{{ data.supplier }}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='完成日期'>
								<span>{{ data.finish_date }}<span v-show='data.is_finish==0'>（预计）</span></span>
							</el-form-item>
						</el-col>
						<el-col :span='24'>
							<el-form-item label='单板说明'>
								<span>{{ data.sample_remarks }}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='采购员'>
								<span>{{ data.make_user_name }}</span>
							</el-form-item>
						</el-col>				
						<el-col :span='8'>
							<el-form-item label='提交时间'>
								<span>{{ data.make_time | formatDate}}</span>
							</el-form-item>
						</el-col>
					</el-row>
				</template>
				<template v-if='data.delivery_time!=null'>
					<divider title='色样寄出'></divider>
					<el-row>
						<el-col :span='8'>
							<el-form-item label='快递信息'>
								<span>{{ data.delivery_express }}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='寄出日期'>
								<span>{{ data.delivery_date }}</span>
							</el-form-item>
						</el-col>
						<el-col :span='24'>
							<el-form-item label='发出说明'>
								<span>{{ data.delivery_remarks }}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='录入员'>
								<span>{{ data.delivery_user_name }}</span>
							</el-form-item>
						</el-col>				
						<el-col :span='8'>
							<el-form-item label='提交时间'>
								<span>{{ data.delivery_time }}</span>
							</el-form-item>
						</el-col>
					</el-row>
				</template>
				<div v-show='data.confirm_time!=null'>
					<divider title='客户确认'></divider>
					<el-row>
						<el-col :span='8'>
							<el-form-item label='确认结果'>
								<el-tag type='success' size='mini' v-show='data.is_confirm==1'>通过</el-tag>
								<el-tag type='danger' size='mini' v-show='data.is_confirm==0'>未通过</el-tag>
							</el-form-item>
						</el-col>
						<el-col :span='16'>
							<el-form-item label='确认说明'>
								<span>{{ data.confirm_remarks }}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='确认员'>
								<span>{{ data.confirm_user_name }}</span>
							</el-form-item>
						</el-col>				
						<el-col :span='8'>
							<el-form-item label='提交时间'>
								<span>{{ data.confirm_time }}</span>
							</el-form-item>
						</el-col>
						<el-col :span='24'>
							<el-form-item label='相关附件'>
								<attach-list size='mini' hide-query ref='attachList' :params='attachParams'></attach-list>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
			</el-form>
			<divider title='历史打样记录'></divider>
			<details-list 
				:params='params' in-dialog hide-query ref='detailsList' size='mini' max-height='200'>
			</details-list>
		</div>	
		<template slot="footer">
			<slot name='footer' :data='data'></slot>
		</template>
	</el-dialog>
</template>
<script>
	import contractApi from '@/api/xs/colorSample'
	import detailsList from '@/components/xs/colorSample/progressList'
	import attachList from '@/components/common/attach/list'
	import supplyList from '@/components/xs/colorSample/supplyList'

	const dataInit = {
		id:null
	}
	export default {
		components:{ detailsList, attachList, supplyList },
		props:{
			inDialog:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return {
				params:{
					no:''
				},
				attachParams:{},
				fileAttachParams:{},
				supplyParams:{},
				loading: true,
				data: { ...dataInit },
				show: false,
				attachTotal:0				
			}
		},		
		computed:{
			flowStep(){
				switch(this.data.status){
					case 'EDIT':
						return 0;
					case 'SUBMIT':
						return 1;
					case 'FILE':
						return 2;
					case 'MAKE':
						return 3
					case 'DELIVERY':
						return 4
					case 'FINISH':
						return 5
				}
			},
			title(){
				return '色样申请 ['+this.data.no+'] 第'+this.data.time+'次打样进度'
			}
		},
		methods:{
			open(id){
				this.data = {...dataInit}
				this.show = true
				this.getData(id)
			},
			getData(id){
				this.loading = true
				contractApi.getProgressInfo(id).then(res=>{
					this.data = res.data
					this.attachTotal = this.data.attach_ids?this.data.attach_ids.split(',').length:0
					this.params.no = this.data.no
					this.attachParams.attach_ids = this.data.attach_ids
					this.fileAttachParams.attach_ids = this.data.file_attach
					this.supplyParams.sample_id = this.data.id
					this.$refs.supplyList.initData()
					this.$refs.attachList.initData()
					this.$refs.fileAttachList.initData()
					this.$refs.detailsList.initData()
					this.loading = false
				})
			},
			reload(){
				this.getData(this.data.id)
			},
			openAttachListDialog(){
				this.$refs.attachListDialog.open({attach_ids:this.data.attach_ids})
			},
			
		}
	}
</script>