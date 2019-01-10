<template>
	<div>
		<el-alert title='业务人员进行项目产品色板样品信息的录入，提交后可进行打样申请' type='warning' style='margin-bottom: 10px'></el-alert>
		<el-tabs v-model='tabName' @tab-click='reload'>
			<el-tab-pane label='待寄出色样' name='toDelivery'>
				<apply-list :params='toDeliveryListParams' ref='applyList' hide-delivery-field hide-confirm-field init>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='90'>
						<template slot-scope='{row}'>
							<el-button  size='mini' type='text' @click='openApplyInfo(row.id)'>详情</el-button>
							<el-button  size='mini' type='text' @click='delivery(row)'>寄出</el-button>
						</template>
					</el-table-column>
				</apply-list>
			</el-tab-pane>
			<el-tab-pane label='已寄出色样' name='submit'>
				<apply-list ref='submitList' :params='submitListParams' hide-confirm-field sort-prop='delivery_time'>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='60'>
						<template slot-scope='scope'>							
							<el-button  size='mini' type='text' @click='openApplyInfo(scope.row.id)'>详情</el-button>
							<!-- <el-button  size='mini' type='text' @click='undo(scope)'>撤回</el-button> -->
						</template>
					</el-table-column>
				</apply-list>
			</el-tab-pane>
		</el-tabs>	
		<file-dialog ref='fileDialog' @updated='reload'></file-dialog>
		<apply-info ref='applyInfo'>
			<div slot='footer' slot-scope='{data}' v-if='data.status=="MAKE"'>
				<el-button type='primary' @click='delivery(data)'>寄出</el-button>
			</div>
		</apply-info>
	</div>
</template>
<script>
	import applyList from '@/components/xs/colorSample/query/applyList'
	import fileDialog from '@/components/yyzx/colorSample/delivery/editDialog'
	import applyInfo from '@/components/xs/colorSample/apply/info'

	export default {
		components:{
			applyList,
			fileDialog,
			applyInfo
		},
		data(){
			return {				
				tabName:'toDelivery',				
				toDeliveryListParams:{
					fixed_status:['MAKE'],
					inFactory:1
				},
				submitListParams:{					
					fixed_status:['DELIVERY','CONFIRM_Y','CONFIRM_N'],
					inFactory:1
				}
			}
		},
		mounted(){
			
		},
		methods:{			
			openSummaryDialog(){
				this.$refs.summaryDialog.open()
			},
			edit({row}){
				this.$refs.editDialog.open().then(that=>{
					that.assign(row)
				})
			},
			details({row}){
				this.$refs.editDialog.open(row.id)
			},
			del(scope){
				this.$refs.editList.del(scope)
			},
			reload(){				
				if(this.$refs.applyInfo.show){
					this.$refs.applyInfo.reload()
				}
				if(this.tabName==='toDelivery'){
					this.$refs.applyList.reload()
				}else{
					this.$refs.submitList.reload()
				}
			},
			openApplyInfo(id){
				this.$refs.applyInfo.open().then(that=>{
					that.get(id)
				})
			},
			undo(scope){
				this.$refs.submitList.undo(scope)
			},
			delivery(row){
				this.$refs.fileDialog.open().then(that=>{
					if(row.delivery_id){
						that.getForm(row.delivery_id)
					}else{
						that.assign({
							sample_id:row.sample_id,
							apply_id:row.id,
							apply_no:row.no,
							receiver:row.receiver,
							receive_tel:row.receive_tel,
							receive_address:row.receive_address
						}).create()
					}
				})
			},
		}
	}
</script>