<template>
	<div>
		<el-dialog 
			class='c-dialog-fixed'
			:visible.sync="show" 
			:append-to-body='inDialog'
			@open='openDialog'
		
			@close='closeDialog'>
			<div slot='title' class='el-dialog__title'>
				<span>{{title}}</span>
			</div>
			<div v-loading='loading'>
				<el-form 
					ref='form' label-width='85px' size='mini' class='c-form-text'>
					<divider title='账号信息' ></divider>
					<el-form-item label='账号名称'>
						<span>{{form.name}}</span>
					</el-form-item>
					<el-form-item label='登录地址'>
						<span>{{form.login_address}}</span>
					</el-form-item>
					<el-form-item label='登录账号'>
						<span>{{form.account}}</span>
					</el-form-item>
					<el-form-item label='登录密码'>
						<span>{{form.password}}</span>
					</el-form-item>
					<el-form-item label='所属公司'>
						<span>{{form.company_name}}</span>
					</el-form-item>
					<el-row :gutter='10'>	
						<el-col :span='24'>
							<el-form-item label='录入员'>
								<span>{{ form.create_user_name }}</span>
							</el-form-item>
						</el-col>
						<el-col :span='12'>
							<el-form-item label='创建时间' >
								<span>{{ $commonJs.formatDate(form.create_time) }}</span>
							</el-form-item>
						</el-col>	
						<el-col :span='12'>
							<el-form-item label='更新时间' >
								<span>{{ $commonJs.formatDate(form.update_time) }}</span>
							</el-form-item>
						</el-col>						
					</el-row>
				</el-form>
			</div>
			<template slot="footer">
				<slot name='footer' :data='form'></slot>
			</template>
		</el-dialog>
	</div>
</template>
<script>
	import api from '@/api/it/account'
	import qrcodePopover from '@/components/common/qrcodePopover'

	const formInit = {
		id:null
	}
	export default {
		components:{ 
			qrcodePopover
		},
		props:{
			inDialog:{
				type:Boolean,
				default:false
			}
		},
		created(){
			
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
				let title='账号详情 [ '+(this.form.name||'...')+' ]'
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