<template>
	<div>
		<el-alert title='统计项目发货货款金额并进行录入，同一项目可分多次录入，提交后生成项目发货应收款' type='warning' style='margin-bottom: 10px'></el-alert>
		<div style='margin:10px 0px'>
			<el-button type='primary' @click='create'>货款录入</el-button>
		</div>
		<el-tabs v-model='tabName' @tab-click='reload'>
			<el-tab-pane label='编辑中' name='edit'>
				<payment-list ref='editList' :params='{input_status:0,inUser:1}' hide-submit-field>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='90'>
						<template slot-scope='scope'>
							<el-button  size='mini' type='text' @click='edit(scope)'>编辑</el-button>
							<el-button  size='mini' type='text' @click='del(scope)'>删除</el-button>
						</template>
					</el-table-column>
				</payment-list>				
			</el-tab-pane>
			<el-tab-pane label='已提交货款' name='submit'>
				<payment-list ref='submitList' :params='{input_status:1,inUser:1}' sort-prop='submit_time' hide-edit-field init>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='60'>
						<template slot-scope='scope'>
							<el-button  size='mini' type='text' @click='openInfo(scope)'>详情</el-button>						
						</template>
					</el-table-column>
				</payment-list>		
			</el-tab-pane>			
		</el-tabs>
		<edit-dialog ref='editDialog' @updated='reload' />		
	</div>
</template>
<script>
	import paymentList from '@/components/yyzx/goodsPayment/edit/list'
	import editDialog from '@/components/yyzx/goodsPayment/edit/editDialog'

	export default {
		components:{
			paymentList,
			editDialog
		},
		data(){
			return {				
				tabName:'submit'
			}
		},
		mounted(){
		},
		methods:{				
			create(){
				this.$refs.editDialog.open().then(that=>{
					that.create()
				})
			},
			edit({row}){
				this.$refs.editDialog.open().then(that=>{
					that.getForm(row.id)
				})
			},
			details({row}){
				this.$refs.editDialog.open(row.id)
			},
			del(scope){
				this.$refs.editList.del(scope)
			},
			reload(){
				if(this.tabName==='edit'){
					this.$refs.editList.reload()
				}else{
					this.$refs.submitList.reload()
				}
			},
			openInfo({row}){
				this.$refs.submitList.openInfo(row.id)
			},
			undo(scope){
				this.$refs.submitList.undo(scope)
			}			
		}
	}
</script>