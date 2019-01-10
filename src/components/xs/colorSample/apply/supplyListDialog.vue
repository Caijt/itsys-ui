<template>
	<div>
		<el-dialog 
			class='c-dialog-fixed'
			:visible.sync="show" 
			:append-to-body='inDialog'
			:title='title'
			@open='openDialog'
			@close='closeDialog'>
			<div v-loading='loading'>
				<el-form 
					ref='form' label-width='85px' size='mini' class='c-form-text'>
					<template v-for='(item,index) in list'>
						<divider :title='"补充内容（"+(index+1)+"）"' style='margin-top:10px'></divider>
						<el-form-item label='补充内容'>
							<span>{{item.content}}</span>
						</el-form-item>
						<el-form-item label='附件'>
							<attach-list :params='{attach_ids:item.attach_ids}' ref='attachList' init/>
						</el-form-item>
						<el-row :gutter='10'>
							<el-col :span='12'>
								<el-form-item label='提交人'>
									<span>{{ item.create_user_name }}</span>
								</el-form-item>	
							</el-col>
							<el-col :span='12'>
								<el-form-item label='提交时间' >
									<span>{{ $commonJs.formatDate(item.create_time) }}</span>
								</el-form-item>	
							</el-col>
						</el-row>
					</template>
				</el-form>
			</div>
			<template slot="footer">
				<slot name='footer' :data='form'></slot>
			</template>
		</el-dialog>
	</div>
</template>
<script>
	import supplyApi from '@/api/xs/colorSampleSupply'
	import attachList from '@/components/common/attach/textList'
	import sampleInfo from '../edit/info'

	const formInit = {
		id:null,
		apply_no:''		
	}
	export default {
		components:{ attachList,sampleInfo },
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
				list:[],
				resolve:null,
				loading: false,
				form: { ...formInit },
				show: false,
				requestParams:{
					sortProp:'create_time',
					sortOrder:'ascending',
				}
			}
		},
		computed:{
			title(){
				let title = '补充说明列表 [ '+this.form.apply_no+' ]'
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
				this.loading = false
				this.list = []
				this.form = { ...formInit }
			},			
			initData(data){
				this.loading = true
				supplyApi.getList({...this.requestParams,...data}).then(res=>{
					this.list = res.data.list
					this.dataTotal = res.data.total
					this.loading = false
					this.$nextTick(()=>{
						this.$refs.attachList.forEach(item=>{
							item.initData()
						})
					})
				})
			},
			open(){
				this.show = true
				return new Promise((resolve,reject)=>{
					this.resolve = resolve
				}) 
			}
		}
	}
</script>