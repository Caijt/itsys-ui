<template>
	<div>
		<el-alert 
	    title="这里能查询到某个部门或员工具体领用了哪些资产，以下明细中会出现多个重复的资产编号是正常的，因为同一个资产编号的入库数量不止1个，它们可能被不同的员工领用，也可能被同一个员工分多次领用"
	    type="success"
	    style='margin-bottom:10px'>	    
	  </el-alert>
		<use-status-list show-more init/>
	</div>
</template>
<script>
import useStatusList from '@/components/it/asset/useStatus/list'
export default {
	components:{
		useStatusList
	}
}
</script>