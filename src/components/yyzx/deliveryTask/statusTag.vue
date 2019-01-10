<template>
	<span>
		<el-tag v-if='status=="SUBMIT"' type='info'>提交待装车</el-tag>
		<el-tag v-if='status=="LOAD"'>装车中</el-tag>
	  <el-tag v-if='status=="DELIVERY"'>发货中</el-tag>
	  <el-tag v-if='status=="RECEIVE"'>签收待审核</el-tag>
	  <el-tag v-if='status=="FINISH"'>发货完成</el-tag>
	</span>
</template>
<script>
	export default{
		props:{
	    status:{
	      type:String,
	      default:''
	    }
	  },
	}
</script>