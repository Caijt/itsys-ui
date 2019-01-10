<template>
	<div>
		<el-tabs v-model='tabName'>
			<el-tab-pane label='色样申请记录' name='list'>
				<progress-list init>
					<el-table-column slot='column' label='操作' width='60' fixed='right' align='center'>
						<template slot-scope='{row}'>
							<el-button size='mini' type='text' @click='info(row)'>详情</el-button>
						</template>
					</el-table-column>
				</progress-list>
			</el-tab-pane>
			<el-tab-pane label='色样申请汇总' name='summary'>
				<progress-summary-list init></progress-summary-list>
			</el-tab-pane>
		</el-tabs>		
		<progress-info ref='progressInfo'/>
	</div>
</template>
<script>
	import progressList from '@/components/xs/colorSample/progressList'
	import progressSummaryList from '@/components/xs/colorSample/progressSummaryList'
	import progressInfo from '@/components/xs/colorSample/progressInfo'

	export default {
		components:{
			progressList,
			progressSummaryList,
			progressInfo
		},
		data(){
			return {
				tabName:'list'
			}
		},
		methods:{
			info(row){
				this.$refs.progressInfo.open(row.id)
			},
			reload(){				
				if(this.tabName==='list'){
					this.$refs.list.reload()
				}else if(this.tabName ==='confirm'){
					if(this.$refs.confirmList.inited){
						this.$refs.confirmList.reload()
					}else{
						this.$refs.confirmList.initData()
					}
				}
			},
		}
	}
</script>