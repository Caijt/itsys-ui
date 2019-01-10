<template>
	<div>
		<div style='margin:10px 0px'>
			<el-button type='primary' @click='create'>订单录入</el-button>
		</div>
		<el-tabs v-model='tabName' @tab-click='reload'>
			<el-tab-pane label='编辑' name='edit'>
				<list 
					ref='editList' 
					:params='{input_status:0,inUser:1}' 					
					hide-submit-field
					sort-prop='create_time'>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='90'>
						<template slot-scope='scope'>
							<el-button size='mini' type='text' @click='edit(scope)'>编辑</el-button>	
							<el-button size='mini' type='text' @click='del(scope)'>删除</el-button>	
						</template>
					</el-table-column>
				</list>
			</el-tab-pane>
			<el-tab-pane label='已提交' name='submit'>
				<list 
					ref='submitList' 
					:params='{input_status:1,inUser:1}' 
					sort-prop='submit_time'
					hide-edit-field>
					<el-table-column slot='column' label='操作' fixed='right' align='center' width='60'>
						<template slot-scope='scope'>
							<el-button size='mini' type='text' @click='undo(scope)'>撤销</el-button>
						</template>
					</el-table-column>
				</list>
			</el-tab-pane>
		</el-tabs>
		<edit-dialog ref='editDialog' @changed='reload'/>
	</div>
</template>
<script>
	import editDialog from '@/components/sc/windowOrder/editDialog'
	import list from '@/components/sc/windowOrder/list'

	export default {
		components:{		
			list,
			editDialog
		},
		data(){
			return {
				tabName:'submit'				
			}
		},
		mounted(){
			this.reload()
		},
		methods:{
			create(){
				this.$refs.editDialog.open().then(that=>{
					that.create()
				})
			},
			edit({row}){
				this.$refs.editDialog.open().then(that=>{
					that.initData(row)
				})
			},
			del(scope){
				this.$refs.editList.del(scope)
			},					
			reload(){
				this.$refs[this.tabName+'List'].reload()
			},
			undo(scope){
				this.$refs.submitList.undo(scope)
			}
		}
	}
</script>