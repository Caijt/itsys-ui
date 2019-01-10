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
				<el-alert type='warning' title='导入的发货任务会添加到编辑列表中' style='margin-bottom: 10px' />
				<attach-upload 
					single
					hide-upload-button
					:limit='1'
					ref='attachUpload'
					:url='attachUploadUrl'/>
			</div>
			<span slot="footer">
		    <el-button type='primary' @click="upload" v-loading='loading'>导 入</el-button>
		    <el-button type='success' @click="down('yyzx_delivery_task_import_template.xlsx')" >下载导入模板</el-button>
		    <el-button @click="show=false" >关 闭</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	import taskApi from '@/api/yyzx/deliveryTask'
	import attachUpload from '@/components/common/attach/upload'

	const formInit = {
		task_id:null
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
				attachUploadUrl:taskApi.excelUploadUrl,
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
				return 'EXCEL导入产品'
			},
		},
		mounted(){
			
		},
		methods:{
			openDialog(){
				this.updated = false
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
			closeDialog(){
				if(this.updated){
					this.$emit('updated')
				}
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
					this.$message.success('成功导入'+ res +'个发货任务')
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