<template>
	<div>
		<el-alert title='发货车辆的货物被客户签收后，司机上传签收图，储运中心对上传的签收图进行审核。' type='warning' style='margin-bottom: 10px'></el-alert>
		<el-tabs v-model='tabName' @tab-click='reload'>
			<el-tab-pane label='签收待审核' name='toReview'>
				<car-list ref='toReviewList' :params='toReviewListParams' sort-prop='receive_time' init hide-edit-field>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='90'>
						<template slot-scope='{row}'>
							<el-button  size='mini' type='text' @click='details(row)'>详情</el-button>
							<el-button  size='mini' type='text' @click='review(row)'>审核</el-button>
						</template>
					</el-table-column>
				</car-list>
			</el-tab-pane>
			<el-tab-pane label='已通过审核' name='finish'>
				<car-list ref='finishList' :params='finishListParams' sort-prop='review_time' init hide-edit-field @undo='reload'>
					<el-table-column align='center' width='60' slot='column' fixed='right' label='操作'>
						<template slot-scope='scope'>
							<el-button type='text' @click='undoReview(scope)'>撤销</el-button>
						</template>
					</el-table-column>
				</car-list>
			</el-tab-pane>
		</el-tabs>
		<car-details ref='carDetails'>
			<div v-if='data.status=="RECEIVE"' slot='footer' slot-scope='{data}'>
				<el-button type='primary' @click='review(data)'>审核</el-button>
			</div>
		</car-details>
		<review-dialog ref='reviewDialog' @updated='reload'></review-dialog>
	</div>
</template>
<script>
	import list from '@/components/cy/deliveryTask/list'	
	import deliveryApi from '@/api/cy/deliveryCar'	
	import carList from '@/components/cy/deliveryTask/car/list'
	import reviewDialog from '@/components/cy/deliveryTask/car/review'
	import carDetails from '@/components/cy/deliveryTask/car/details'

	export default {
		components:{
			list,
			carList,
			reviewDialog,
			carDetails
		},
		data(){
			return {
				tabName:'toReview',
				toPurchaseOrderTotal:0,
				toOrderProjectLoading:true,
				toReviewListParams:{
					status:[
						'RECEIVE'
					],
					inFactory:1
				},
				finishListParams:{
					status:[
						'FINISH'
					],
					inFactory:1
				}
			}
		},
		mounted(){
			
		},
		methods:{
			create(){
				this.$refs.summaryFormDialog.open()
			},			
			editRecord({row}){
				this.$refs.formDialog.open(row.id)
			},
			del({ row,$index }){
				let confirmText = '确定删除？'
				this.$confirm(confirmText,'提示',{
					type: 'warning'
				}).then(()=>{
					deliveryApi.del(row.id).then(res=>{
						this.$message.success('删除成功')
						this.reload()					
					})
				})
			},
			reload(){
				this.$refs.carDetails.show && this.$refs.carDetails.reload()
				this.$refs[this.tabName+'List'].reload()
			},
			undoReview(scope){
				this.$refs.finishList.undoReview(scope)
			},
			review(row){
				this.$refs.reviewDialog.open().then(that=>{
					that.initData(row)
				})
			},
			details(row){
				this.$refs.carDetails.open().then(that=>{
					that.initData(row)
				})
			}
		}
	}
</script>