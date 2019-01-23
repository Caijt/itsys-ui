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
					:url='attachUploadUrl'/>
			</div>
			<span slot="footer">
		    <el-button type='primary' @click="upload" v-loading='loading'>导 入</el-button>
		    <el-button type='success' @click="down('it_asset_import_template.xlsx')" >下载导入模板</el-button>
		    <el-button @click="show=false" >关 闭</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	import api from '@/api/it/asset'
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
				attachUploadUrl:api.excelUploadUrl,
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
				return 'EXCEL导入IT资产'
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
					this.$message.success('成功导入'+ res +'个IT资产信息')
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