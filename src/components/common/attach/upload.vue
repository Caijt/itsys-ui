<template>
	<el-upload 
		style='margin-bottom: 3px'
		:list-type='type=="img"?"picture":"text"'
		ref='fileUpload'
		:headers="header"
		:data="{ attachGuid }"
	  :action='uploadUrl'
	  :auto-upload='false'
	  :limit='limit'
	  :multiple='!single'
	  :on-change='fileChange'
	  :before-upload="beforeUpload"
	  :disabled='disabled'>
	  <el-button slot="trigger" size="mini" type="primary" :disabled='disabled'>选择{{type=='img'?"图片":"文件"}}</el-button>
	  <el-button size="mini" style='margin-left:5px' type="success" @click="upload" :disabled='disabled' v-if='!hideUploadButton'>上传</el-button>
	  <span slot="tip" class="el-upload__tip">（请先修改好{{type=='img'?"图片":"文件"}}名再上传，大小不超过10MB）</span>
	</el-upload>
</template>
<script>
	import attachApi from '@/api/attach'
	import lrz from 'lrz'
	export default {
		props:{
			type:{
				type:String,
				default:'file'
			},
			url:{
				type:String,
				default:''
			},
			buttonText:{
				type:String,
				default:'选择文件'
			},
			limit:{
				type:Number
			},
			hideUploadButton:{
				type:Boolean,
				default:false
			},
			single:{
				type:Boolean,
				default:false
			},
			disabled:{
				type:Boolean,
				default:false
			},
			maxSize:{
				type:Number,
				default:10*1024*1024
			},
			imgCompress:{
				type:Boolean,
				default:false
			},
			attachGuid:{
				type:String,
				default:""
			}
		},
		data(){
			return {
				resolve:null
			}
		},
		computed:{
			uploadUrl(){
				if(this.url){
					return this.url
				}else{
					if(this.type=='file'){
						return attachApi.uploadUrl
					}else{
						return attachApi.uploadImgUrl
					}
				}
			},
			header(){
				let token = sessionStorage.getItem("token")
			  if (token) {
			  	return { Authorization: "Bearer " + token }
			  }
				return {}
			},
		},
		methods:{
			getUploadFiles(){
				return this.$refs.fileUpload.uploadFiles
			},
			upload(){
				return new Promise((resolve,reject)=>{
					if(this.getUploadFiles().length>0){
						this.$refs.fileUpload.submit()
						this.resolve = resolve
					}else{
						resolve()
					}
				}) 
			},
			clear(){
				this.$refs.fileUpload.clearFiles()
			},
			beforeUpload(file){
				if(this.imgCompress){
					return new Promise((resolve,reject)=>{
						lrz(file).then(res=>{            
	            resolve(res.file)
	          })
					})
				}else{
					return true
				}
			},
			fileChange(file,fileList){
				if(file.status=='ready'){
					if(file.size>this.maxSize){
						let index=fileList.indexOf(file);
						fileList.splice(index,1);
						this.$message.error('文件['+file.name+']大小已超过10mb，无法上传！')
					}
					if(this.type=='img'){
						if(file.raw.type.indexOf("image/")==-1){ 
							let index=fileList.indexOf(file);
							fileList.splice(index,1);
							this.$message.error('文件['+file.name+']不是图片，无法上传！')
						}
					}
				}else if(file.status){
					let index=fileList.indexOf(file);
					fileList.splice(index,1);
					if(file.status=='fail'||file.response.code!=0){
						this.$notify.error({
		          title: '上传失败',
		          message: '文件['+file.name+']上传失败，请稍候重新上传！'+file.response.message||'',
		          duration: 0
		        });
					}else{
						this.$emit('uploaded',file.response.data)
					}
					if(fileList.length==0){
						if(this.resolve){
							this.resolve(file.response.data)
							this.resolve = null
						}
						this.$emit('all-uploaded')
					}
				}
			},
		}
	}
</script>