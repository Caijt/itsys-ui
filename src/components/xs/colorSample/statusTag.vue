<template>
	<span>
		<el-tag v-if='status=="SUBMIT"' type='info'>待打样</el-tag>
		<el-tag v-if='status=="APPLY"'>已申请待归档</el-tag>
	  <el-tag v-if='status=="FILE"'>已归档待打板</el-tag>
	  <el-tag v-if='status=="MAKING"'>打板中</el-tag>
	  <el-tag v-if='status=="MAKE"'>已打板待寄出</el-tag>
	  <el-tag v-if='status=="DELIVERY"'>已寄出待确认</el-tag>
	  <el-tag v-if='status=="CONFIRM_Y"' type='success'>通过客户确认</el-tag>
	  <el-tag v-if='status=="CONFIRM_N"' type='danger'>未通过确认</el-tag>
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