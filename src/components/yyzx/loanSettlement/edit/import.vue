<template>
	<div>
		<el-dialog 
			:title='title'
			class='c-dialog-fixed'
			:visible.sync='show'
			:append-to-body='inDialog'
			@open='openDialog'
			@close='closeDialog'>
			<div v-loading='loading'>
				<attach-upload 
					single
					hide-upload-button
					:limit='1'
					ref='attachUpload'
					:url='attachUploadUrl'
					:params='{order_id:form.order_id}'/>
			</div>
			<span slot="footer">
		    <el-button type='primary' @click="upload" v-loading='loading'>导 入</el-button>
		    <el-button type='success' @click="down('cw_receive_payment_template.xlsx')" >下载导入模板</el-button>
		    <el-button @click="show=false" >关 闭</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	import paymentApi from '@/api/cw/receivePaymentRecord'
	import attachUpload from '@/components/common/attach/upload'

	const formInit = {
		order_id:null
	}
	export default {
		components:{ 
			attachUpload
		},
		props:{
			inDialog:{
				type:Boolean,
				default:false
			}
		},
		data(){			
			return {
				attachUploadUrl:paymentApi.excelUploadUrl,
				updated:false,
				show:false,
				buttonLoading:false,
				data:null,
				loading:false,
				form:{ ...formInit },
			}
		},
		computed:{
			title(){
				return 'EXCEL导入回款'
			},
		},
		mounted(){
			
		},
		methods:{
			openDialog(){
				
			},
			open(){
				this.show = true
			},
			//清除字段检验信息
			clearValidate(){
				this.$nextTick(()=>{
					this.$refs.form && this.$refs.form.clearValidate()
				})				
			},
			//重置字段
			resetFields(){
				this.form = { ...formInit }
				this.clearValidate()
				return this
			},
			assign(data){
				this.form = { ...this.form, ...data }
				return this
				// this.clearValidate()
			},					
			closeDialog(){
				if(this.updated){
					this.$emit('updated')
				}
				this.updated = false
				this.buttonLoading = false
				this.$refs.attachUpload.clear()
			},
			down(fileName){
				window.open('static/' + fileName)
			},
			uploaded(){
				this.updated = true
			},			
			upload(){
				if(this.$refs.attachUpload.getUploadFiles().length==0){
					this.$message.error('请选择上传文件')
					return false
				}
				this.loading = true
				this.$refs.attachUpload.upload().then(res=>{
					this.$message.success('成功导入'+ res +'个回款记录')
					this.updated = true
					this.show = false
					this.loading = false
				}).catch(res=>{
					this.loading = false
				})
			}	
		}
	}
</script>