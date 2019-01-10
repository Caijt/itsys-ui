<template>
	<div>
		<el-tabs v-model='tabName' @tab-click='reload'>
			<el-tab-pane label='待核销回款' name='toWriteoff'>
				<payment-list ref='toWriteoffList' :params='{toWriteoff:1}' init>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='90'>
						<template slot-scope='scope'>
							<el-button  size='mini' type='text' @click='info(scope.row)'>查看</el-button>
							<el-button  size='mini' type='text' @click='writeoff(scope.row)'>核销</el-button>
						</template>
					</el-table-column>
				</payment-list>				
			</el-tab-pane>
			<el-tab-pane label='已核销回款' name='submit'>
				<payment-list ref='writeoffedList' :params='{writeoffed:1}' sort-prop='submit_time' hide-edit-field init>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='60'>
						<template slot-scope='scope'>
							<el-button  size='mini' type='text' @click='info(scope.row)'>详情</el-button>
						</template>
					</el-table-column>
				</payment-list>		
			</el-tab-pane>
		</el-tabs>
		<payment-info ref='paymentInfo'>
			<div slot='footer' slot-scope='{data}' v-show='data.to_writeoff_price > 0'>
				<el-button type='primary' @click='writeoff(data)'>核 销</el-button>
			</div>
		</payment-info>
		<edit-dialog ref='editDialog' @updated='reload'></edit-dialog>
	</div>
</template>
<script>
	import paymentList from '@/components/cw/receivePayment/loanWriteoff/list'
	import paymentInfo from '@/components/cw/receivePayment/info'
	import editDialog from '@/components/cw/receivePayment/loanWriteoff/editDialog'

	export default {
		components:{
			paymentList,
			paymentInfo,
			editDialog
		},
		data(){
			return {				
				tabName:'toWriteoff'
			}
		},
		mounted(){
		},
		methods:{				
			create(){
				this.$refs.paymentInfo.open().then(that=>{
					that.create()
				})
			},
			edit({row}){
				this.$refs.paymentInfo.open().then(that=>{
					that.getForm(row.id)
				})
			},
			details({row}){
				this.$refs.paymentInfo.open(row.id)
			},
			del(scope){
				this.$refs.toWriteoffList.del(scope)
			},
			reload(){
				if(this.$refs.paymentInfo.show){
					this.$refs.paymentInfo.reload()
				}
				if(this.tabName==='toWriteoff'){
					this.$refs.toWriteoffList.reload()
				}else{
					this.$refs.writeoffedList.reload()
				}
			},
			info({row}){
				this.$refs.taskInfo.open().then(that=>{
					that.get(row.id)
				})
			},
			undo(scope){
				this.$refs.writeoffedList.undo(scope)
			},
			info(row){
				this.$refs.paymentInfo.open().then(that=>{
					that.getInfo(row.id)
				}).catch(res=>{
					console.log(res)
				})
			},
			writeoff(row){
				this.$refs.editDialog.open().then(that=>{
					that.initData(row)
				}).catch(res=>{
					console.log(res)
				})
			}
		}
	}
</script>