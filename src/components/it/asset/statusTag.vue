<template>
	<span>
		<el-tag  type="warning" v-show='asset.remain>0'>闲</el-tag>
		<el-tag  type="danger" v-show='asset.is_repair==1'>修</el-tag>
		<el-tag  type="info" v-show='asset.scrap_amount>0'>废</el-tag>
		<span v-show='asset.remain<=0&&asset.is_repair==0&&asset.scrap_amount==0'>-</span>
	</span>
</template>
<script>
	export default{
		props:{
	    asset:{
	      type:Object,
	      default:()=>({})
	    }
	  },
	}
</script>