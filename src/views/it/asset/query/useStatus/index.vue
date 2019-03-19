<template>
	<div>
		<el-alert 
	    title="这里能查询到某个部门或员工具体领用了哪些资产，以下明细中会出现多个重复的资产编号是正常的，因为同一个资产编号的入库数量不止1个，它们可能被不同的员工领用，也可能被同一个员工分多次领用"
	    type="success"
	    style='margin-bottom:10px'>	    
	  </el-alert>
	  <div style='margin:10px 0px'>
			<el-button @click='printBatch' icon='el-icon-printer'>打印标签</el-button>
		</div>
		<use-status-list ref='list' show-checkbox show-more init/>
		<print-label ref='printLabel'/>
	</div>
</template>
<script>
import useStatusList from '@/components/it/asset/useStatus/list'
import printLabel from '@/components/it/asset/printLabel'

export default {
	components:{
		useStatusList,
		printLabel
	},
	methods:{
		printBatch(){
			if(this.$refs.list.selectionList.length==0){
				this.$message.warning('未选择资产数据')
				return false
			}
			let ids = this.$refs.list.selectionList.map(d=>{
				return d.asset_id
			})
			this.$refs.printLabel.open().then(that=>{
				that.getData({ids:ids.join(',')})
			})
		}
	}
}
</script>