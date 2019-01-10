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
		    <el-button type='primary' @click="upload" size='small' v-loading='loading'>导 入</el-button>
		    <el-button type='success' @click="down('sc_glass_import_template.xlsx')" size='small'>下载导入模板</el-button>
		    <el-button @click="show=false" size='small'>关 闭</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	import glassApi from '@/api/sc/glass'
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
				attachUploadUrl:glassApi.excelUploadUrl,
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
				return 'EXCEL导入合格证'
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
			},			
			openOrderDialog(){
				this.$refs.orderDialog.open()
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
					this.$message.success('成功导入'+ res +'个玻璃标签信息')
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