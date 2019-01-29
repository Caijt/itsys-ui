<template>
	<el-dialog 
		:title='title'
		class='c-dialog-fixed print'
		:visible.sync='show'
		:append-to-body='inDialog'
		@open='openDialog'
		@close='closeDialog'>
		<div v-loading='loading' style='position: relative;'>
			<el-alert class='no-print' title='为避免打印格式出现异常，请使用Firefox（火狐）浏览器打印' type='success' style='margin-bottom:10px'></el-alert>		
			<div class="window-qrcode-box" :class='{"no-print":selectMode&&!item.selected}' v-for='item in list' :key='item.code'>
				<el-checkbox class='no-print' size='mini' style="position: absolute;left:10px;top:8px;" v-model="item.selected" border v-show='selectMode'>选择</el-checkbox>
				<div style="position: absolute;text-align:center;border:1px solid black;width:10px;height:10px;line-height:10px;font-size:10px;right:8px;top:8px;font-weight: bold;border-radius:6px;">{{item.type}}</div>
				<div class="inside-box" >
					<!-- <img src='{$Think.IMG_PATH}common/sz.jpg' style='width:200px'/> -->
					<div style='margin-top:48px;'>
						<img class='qrcode' :src="getQrcodeImg(item.code)" style='width:60px;height:60px;float:right' v-on:load='imgLoad'/>
						<div style='margin-right:50px;padding-top:2px;font-size:12px;line-height:12px'>
							<div style="margin:0px;text-overflow:ellipsis;white-space:nowrap;overflow: hidden;">系列：{{item.model}}</div>
							<div style="margin:0px;text-overflow:ellipsis;padding-top:5px;white-space:nowrap;overflow: hidden;">项目：{{ item.project_name }}</div>
						</div>
					</div>
					<div style='clear: both'></div>
				</div>
			</div>
			<div style='clear: both'></div>
		</div>
		<span slot="footer">
			<el-progress v-show='list.length>0' :text-inside="true" :stroke-width="18" :percentage="getImgPercentage" style='margin-bottom:10px' :status="getImgPercentage==100?'success':''"></el-progress>
	    <el-button type='primary' @click="print" size='small' v-loading='getImgPercentage!=100' v-show='list.length>0'>打 印</el-button>
	    <el-tooltip content='开启后，可选择个别标签进行单独打印'>
	    	<el-checkbox v-model="selectMode" border>选择模式</el-checkbox>
	    </el-tooltip>	   
	    <el-button @click="show=false" size='small'>关 闭</el-button>
	  </span>
	</el-dialog>
</template>
<script>
	import windowApi from '@/api/sc/window'
	export default {
		components:{  },
		props:{
			inDialog:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return {
				selectMode:false,
				show:false,
				loading:true,
				list:[],
				imgLoadCount:0
			}
		},
		computed:{
			title(){
				return '门窗标签打印页面'
			},
			buttonText(){
				return this.isEdit?'更 新':'创 建'
			},
			getImgPercentage(){
				return this.$commonJs.getProgressPercentage(this.imgLoadCount/this.list.length)
			}
		},
		methods:{
			selectOrder(row){
				this.$refs.form.selectOrder(row)
			},			
			open(){
				this.show = true
			},
			get(params){
				this.loading = true
				this.imgLoadCount = 0
				this.list = []
				windowApi.getLabelList(params).then(res=>{
					this.loading = false
					this.list = res.data
				})
				return this
			},
			openDialog(){
				this.selectMode = false
			},
			closeDialog(){},
			save(){
				this.buttonLoading = true
				this.$refs.form.save().catch(()=>{
					this.buttonLoading = false
				})
			},
			getQrcodeImg(code){
				return windowApi.qrcodeImgUrl+'/code/'+code
			},
			imgLoad(){
				this.imgLoadCount++
			},
			print(){
				window.print()
			}
		}
	}
</script>
<style lang='less'>
	.window-qrcode-box{
		position: relative;
		font-size: 14px;
		width:50%;
		box-sizing: border-box;
		float:left;
		padding:3px 4px;
	}		
	.window-qrcode-box .inside-box{
		border-radius:4px;
		box-sizing: border-box;
		border:1px solid black;
		padding:4px 7px;
	}
	@media print{
		.window-qrcode-box .inside-box{
    	border:1px solid #fff;
    }
  	body{
  		width:500px;
  	}
	}
</style>