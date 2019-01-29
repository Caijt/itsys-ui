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
				<div class="glass-label-box" :class='{"no-print":selectMode&&!item.selected}' v-for='item in list' :key='item.code'>
					<el-checkbox class='no-print' size='mini' style="position: absolute;left:10px;top:8px;" v-model="item.selected" border v-show='selectMode'>选择</el-checkbox>		
					<div style="position: absolute;border:1px solid black;width:20px;height:20px;line-height:18px;font-size:12px;right:20px;top:20px;border-radius:50%;">{{item.sn}}</div>
					<div class="inside-box" style="padding:30px;">
						<p style="margin:0px 0px 5px;font-size:17px;font-family:'微软雅黑'">金刚玻璃防伪查询</p>
						<img class='qrcode' :src="getQrcodeImg(item.code)" v-on:load='imgLoad'/>
						<p style="margin:0px;font-size:10px;line-height: 8px">{{item.code}}</p>
					</div>				
				</div>
			</div>
			<!-- <div style='clear: both'></div> -->
		</div>
		<span slot="footer">
			<el-progress v-show='list.length>0' :text-inside="true" :stroke-width="18" :percentage="getImgPercentage" style='margin-bottom:10px' :status="getImgPercentage==100?'success':''"></el-progress>
	    <el-button type='primary' @click="print" v-loading='getImgPercentage!=100' v-show='list.length>0'>打 印</el-button>
	    <el-tooltip content='开启后，可选择个别标签进行单独打印'>
	    	<el-checkbox v-model="selectMode" border>选择模式</el-checkbox>
	    </el-tooltip>	 
	    <el-button @click="show=false">关 闭</el-button>
	  </span>
	</el-dialog>
</template>
<script>
	import glassApi from '@/api/sc/glass'
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
				return '玻璃标签打印页面'
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
				glassApi.getLabelList(params).then(res=>{
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
				return glassApi.qrcodeImgUrl+'/code/'+code
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
<style lang='less' scoped>	
	.glass-label-box{
		position: relative;
		font-size: 14px;
		width:50%;
		box-sizing: border-box;
		text-align:center;
		float:left;
		padding:3px;
	}
	.glass-label-box .inside-box{
		border-radius:4px;
		box-sizing: border-box;
		border:1px solid black;
		padding-top:10px;
		padding-bottom:10px;
		padding:10px;
	}
	@media print{
		.glass-label-box .inside-box{
    	border:1px solid #fff;
    }
  	.print{
  		width:500px
  	}
	}
</style>