<template>
	<div>
		<div style='margin:10px 0px'>
			<el-button type='primary' @click='create'>回款录入</el-button>
			<el-button type='success' @click='import2'>Excel导入</el-button>
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
			<el-tab-pane label='已提交回款' name='submit'>
				<payment-list ref='submitList' :params='{input_status:1,inUser:1}' sort-prop='submit_time' hide-edit-field init>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='90'>
						<template slot-scope='scope'>
							<el-button  size='mini' type='text' @click='info(scope)'>详情</el-button>
							<el-button  size='mini' type='text' @click='undo(scope)'>撤销</el-button>
						</template>
					</el-table-column>
				</payment-list>		
			</el-tab-pane>			
		</el-tabs>
		<edit-dialog ref='editDialog' @updated='reload' />		
		<info ref='info' @updated='reload' />
		<import-dialog ref='importDialog' @updated='reload'/>
	</div>
</template>
<script>
	import paymentList from '@/components/cw/receivePayment/edit/list'
	import editDialog from '@/components/cw/receivePayment/edit/editDialog'
	import info from '@/components/cw/receivePayment/info'
	import importDialog from '@/components/cw/receivePayment/edit/import'

	export default {
		components:{
			paymentList,
			editDialog,
			info,
			importDialog
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
				}).catch(res=>{
					console.log(res)
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
			info({row}){
				this.$refs.info.open().then(that=>{
					that.getInfo(row.id)
				})
			},
			undo(scope){
				this.$refs.submitList.undo(scope)
			},
			import2(){
				this.$refs.importDialog.open()
			}
		}
	}
</script>