<template>
	<el-dialog 
		:title='title'
		class='c-dialog-fixed print'
		:visible.sync='show'
		:append-to-body='inDialog'
		@open='openDialog'
		@close='closeDialog'>
		<div v-loading='loading'>
			<el-alert class='no-print' title='为避免打印格式出现异常，请使用Firefox（火狐）浏览器打印' type='success' style='margin-bottom:10px'></el-alert>
			<template v-for='item in list'>
				<div class='certificate-box' :class='{"no-print":selectMode&&!item["selected"+i],"mini-mode":miniMode}' v-for='i in item.amount' :key='item.id+"."+i'>
					<el-checkbox class='no-print' size='mini' style="position: absolute;left:10px;top:8px;" v-model="item['selected'+i]" border v-show='selectMode'>选择</el-checkbox>	
					<div class='certificate-title'>
						<div><strong>苏州金刚防火钢型材系统有限公司</strong></div>
						<div><strong>合格证</strong></div>
					</div>
					<table class='c-table' style='border-color: #000;margin-bottom: 0px;'>
						<tr>
							<td style='width:80px'><strong>工程</strong></td>
							<td colspan="3" style='max-width:200px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;'>{{ item.project_name }}</td>
						</tr>
						<tr>
							<td><strong>产品名称</strong></td>
							<td colspan="3">{{ item.product_name }}</td>
						</tr>
						<tr>
							<td><strong>产品编号</strong></td>
							<td colspan="3">{{ item.product_no }}</td>
						</tr>
						<tr v-show='!miniMode'>
							<td><strong>规格</strong></td>
							<td colspan="3">W*H={{  Number(item.width) }}*{{  Number(item.height) }}</td>
						</tr>
						<tr v-show='!miniMode'>
							<td><strong>编号｜总数</strong></td>
							<td colspan="3">{{ i }}｜{{ item.amount }}</td>
						</tr>
						<tr v-show='miniMode'>
							<td><strong>规格</strong></td>
							<td style='width:30%'>W*H={{  Number(item.width) }}*{{  Number(item.height) }}</td>
							<td style='width:80px'><strong>编号｜总数</strong></td>
							<td style='width:30%'>{{ i }}｜{{ item.amount }}</td>
						</tr>
						<tr>
							<td><strong>备注</strong></td>
							<td colspan="3">{{ item.remarks }}</td>
						</tr>
						<tr v-show='!miniMode'>
							<td><strong>检查人员</strong></td>
							<td colspan="3"></td>
						</tr>
						<tr v-show='!miniMode'>
							<td><strong>生产日期</strong></td>
							<td colspan="3"></td>
						</tr>
						<tr v-show='miniMode'>
							<td><strong>检查人员</strong></td>
							<td></td>
							<td style='width:80px'><strong>生产日期</strong></td>
							<td></td>
						</tr>
					</table>
				</div>
			</template>
		</div>
		<span slot="footer">
			<el-button type='primary' @click="print" v-show='list.length>0'>打 印</el-button>
			<el-tooltip content='开启后，可选择个别标签进行单独打印'>
	    	<el-checkbox v-model="selectMode" border>选择模式</el-checkbox>
	    </el-tooltip>	 
	    <el-tooltip content='以80mmX45mm的小标签规格进行打印'>
	    	<el-checkbox v-model="miniMode" border>小规格</el-checkbox>
	    </el-tooltip>	 
	    <el-button @click="show=false" >关 闭</el-button>
	  </span>
	</el-dialog>
</template>
<script>
	import certificateApi from '@/api/sc/certificate'
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
				miniMode:false,
				selectMode:false,
				show:false,
				loading:true,
				list:[],
			}
		},
		computed:{
			title(){
				return '合格证标签打印页面'
			},
			buttonText(){
				return this.isEdit?'更 新':'创 建'
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
				this.list = []
				certificateApi.getLabelList(params).then(res=>{
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
			print(){
				window.print()
			}
		}
	}
</script>
<style lang='scss'>
	.certificate-box{
		position: relative;
		color:#000;
		font-size: 14px;
		font-family: 宋体;
		box-sizing: border-box;
		padding:5px 6px;
		border-radius:4px;
		border:1px solid #ddd;
		margin-bottom: 4px;
		text-align: center;
		font-weight: bold;
		line-height:1.6;
	}
	.mini-mode{
		font-size: 16px;
		padding:10px 5px;
		line-height:1.8;
	}
	@media print{
		.certificate-box{
  		border:1px solid #fff;
  	}
  	.print{
  		width:500px
  	}
	}
</style>