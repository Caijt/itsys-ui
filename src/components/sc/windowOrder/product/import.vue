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
		    <el-button type='success' @click="down('sc_order_product_import_template.xlsx')" >下载导入模板</el-button>
		    <el-button @click="show=false" >关 闭</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	import orderProductApi from '@/api/yyzx/orderProduct'
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
				attachUploadUrl:orderProductApi.excelUploadUrl,
				changed:false,
				show:false,
				buttonLoading:false,
				data:null,
				loading:false,
				form:{ ...formInit },
			}
		},
		computed:{
			title(){
				return 'EXCEL导入产品'
			},
		},
		mounted(){
			
		},
		methods:{
			openDialog(){
				this.changed = false
				this.buttonLoading = false
				this.$nextTick(()=>{
					this.$refs.attachUpload.clear()
					this.clearValidate()
				})
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
			openOrderDialog(){
				this.$refs.orderDialog.open()
			},
			selectOrder({ row }){
				let data = this.$commonJs.obj.copyByKey(row,[
					'order_no','project_name','area_id','customer_name','order_date'])
				this.assign(data)	
				this.$refs.orderDialog.close()
			},
			closeDialog(){
				if(this.changed){
					this.$emit('changed')
				}
			},
			down(fileName){
				window.open('static/' + fileName)
			},
			uploaded(){
				this.changed = true
			},			
			upload(){
				if(this.$refs.attachUpload.getUploadFiles().length==0){
					this.$message.error('请选择上传文件')
					return false
				}
				this.loading = true
				this.$refs.attachUpload.upload().then(res=>{
					this.$message.success('成功导入'+ res +'个产品信息')
					this.changed = true
					this.show = false
					this.loading = false
				}).catch(res=>{
					this.loading = false
				})
			}	
		}
	}
</script>