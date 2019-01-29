<template>
	<el-dialog 
		:title='title'
		class='c-dialog-fixed print'
		:visible.sync='show'
		:append-to-body='inDialog'
		width='60%'
		@open='openDialog'
		@close='closeDialog'>
		<div v-loading='loading' style='position: relative;'>
			<el-alert class='no-print' title='为避免打印格式出现异常，请使用Firefox（火狐）浏览器打印' type='success' style='margin-bottom:10px'></el-alert>		
				<div 
					class="record-box" 
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
					<div>
						<div style='font-size:22px;text-align: center;font-weight: bold'>IT资产领用单</div>
						<div style='margin: 5px 0px'>
							<div style='display: flex'>
								<div style='flex:1'>领用编号：{{item.no}}</div>
								<div style='flex:1'>录入员：{{item.create_user_name}}</div>
								<div style='flex:1'>打印时间：{{$commonJs.formatDate(new Date())}}</div>
							</div>
							<div style='display: flex'>
								<div style='flex:1'>领用日期：{{item.record_date}}</div>
								<div style='flex:1'>领用部门：{{item.dep_name}}</div>
								<div style='flex:1'>领用员工：{{item.employee_name}}</div>
							</div>
							<div>使用地点：{{item.place}}</div>
							<div>领用备注：{{item.remarks}}</div>
						</div>						
						<table class='c-table' style='border:2px solid #000'>
							<tr class='label'>
								<td style='width:40px'>序号</td>
								<td style='width:80px'>资产编号</td>
								<td>资产型号</td>
								<td>资产类型</td>
								<td style='width:60px'>领用数量</td>
							</tr>							
							<tr v-for='(a,index) in item.asset_list'>
								<td style='text-align: center'>{{index+1}}</td>
								<td>{{a.asset_no}}</td>
								<td>{{a.asset_model}}</td>
								<td>{{a.asset_type_name}}</td>
								<td style='text-align: center'>{{Number(a.amount)}}</td>								
							</tr>
						</table>
						<div style='display:flex;margin:5px 0px'>
							<div style='flex:1'>领用人签字：</div>
							<div style='flex:1;text-align: right;padding-right: 150px'>签字时间：</div>					
						</div>
					</div>
				</div>
			</div>
			<!-- <div style='clear: both'></div> -->
		</div>
		<span slot="footer">
	    <el-button type='primary' @click="print">打 印</el-button>
	    <el-tooltip content='开启后，可选择个别标签进行单独打印'>
	    	<el-checkbox v-model="selectMode" border>选择模式</el-checkbox>
	    </el-tooltip>	 
	    <el-button @click="show=false">关 闭</el-button>
	  </span>
	</el-dialog>
</template>
<script>
	import assetApi from '@/api/it/assetUseRecord'
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
				resolve:null
			}
		},
		computed:{
			title(){
				return 'IT资产领用单打印'
			},
			buttonText(){
				return this.isEdit?'更 新':'创 建'
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
				assetApi.getPrintRecordList(params).then(res=>{
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
			print(){
				window.print()
			}
		}
	}
</script>
<style lang='less' scoped>	
	.record-box{
		color:#000;
		line-height:1.5;
		font-family: '宋体';
		position: relative;
		font-size: 14px;
		padding:10px;
		border-radius:4px;
		border:1px solid black;
		margin-bottom: 10px;
	}
	@media print{
		.record-box{
    	border:1px solid #fff;
    }
  	.print{
  		width:800px
  	}
	}
</style>