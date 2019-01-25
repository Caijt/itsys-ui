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
				<div 
					class="asset-label-box" 
					:class='{"no-print":selectMode&&!item.selected}' 
					v-for='item in list' 
					:key='item.id'>	
					<el-checkbox 
						class='no-print' 
						size='mini' 
						style="position: absolute;right:10px;top:8px;z-index: 99" 
						v-model="item.selected" 
						border 
						v-show='selectMode'>
						选择
					</el-checkbox>
					<div class="inside-box">
						<div style='display: flex'>
							<div>
								<img class='qrcode' :src="getQrcodeImg(item.id)" v-on:load='imgLoad'/>
							</div>
							<div style='margin-left:5px;flex:1;height:90px;overflow: hidden;'>
								<div style='font-weight: 16px;text-align: center;font-weight: bold;margin-bottom: 5px'>金刚玻璃IT资产</div>
								<dl style='font-size: 12px'>
									<dt>编号：</dt>
									<dd>{{item.no}}</dd>
									<dt>型号：</dt>
									<dd>{{item.model}}</dd>
								</dl>
							</div>
						</div>
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
	import assetApi from '@/api/it/asset'
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
				loading:false,
				list:[],
				imgLoadCount:0,
				resolve:null
			}
		},
		computed:{
			title(){
				return 'IT资产标签打印页面'
			},
			buttonText(){
				return this.isEdit?'更 新':'创 建'
			},
			getImgPercentage(){
				return this.$commonJs.getProgressPercentage(this.imgLoadCount/this.list.length)
			}
		},
		methods:{		
			open(){
				this.show = true
				return new Promise((resolve,reject)=>{
					this.resolve = resolve
				}) 
			},
			getData(params){
				this.loading = true				
				assetApi.getList(params).then(res=>{
					this.loading = false
					this.list = res.data.list
				})
				return this
			},
			openDialog(){
				this.$nextTick(()=>{
					if(this.resolve){
						this.resolve(this)
					}
				})
			},
			closeDialog(){
				this.selectMode = false
				this.imgLoadCount = 0
				this.list = []
			},
			save(){
				this.buttonLoading = true
				this.$refs.form.save().catch(()=>{
					this.buttonLoading = false
				})
			},
			getQrcodeImg(id){
				return assetApi.getPrintQrcode(id)
			},
			imgLoad(){
				this.imgLoadCount ++
			},
			print(){
				window.print()
			}
		}
	}
</script>
<style lang='scss' scoped>	
	.asset-label-box{
		position: relative;
		font-size: 14px;
		color:#000;
		width:50%;
		box-sizing: border-box;
		float:left;
		padding:3px;
		.inside-box{
			border-radius:4px;
			box-sizing: border-box;
			border:1px solid #DCDFE6;
			padding:10px;
			.qrcode{

			}
		}
	}
	dl{
		margin:0px;
	}
	dt{
		font-weight: bold;
		text-align: right;
		float:left;
	}
	@media print{
		.asset-label-box .inside-box{
    	border:1px solid #fff;
    }
  	.print{
  		width:500px
  	}
	}
</style>