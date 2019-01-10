<template>
	<span>
		<el-tag v-if='!status' type='info'>编辑中</el-tag>
		<el-tag v-if='status=="SUBMIT"' type='warning'>提交装车</el-tag>
		<el-tag v-if='status=="DELIVERY"'>司机发货</el-tag>
	  <el-tag v-if='status=="RECEIVE"' type='danger'>签收待审核</el-tag>
	  <el-tag v-if='status=="FINISH"' type='success'>发货完成</el-tag>
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