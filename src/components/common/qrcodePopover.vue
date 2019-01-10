<template>
	<el-popover
    trigger="hover">
  	<div><img :src='qrcodeImg'/></div>
  	<div style='text-align: center'>微信查看</div>
    <!-- <el-button type='success' circle icon='el-icon-mobile-phone' slot="reference"></el-button> -->
    <i class='el-icon-mobile-phone' style='cursor: pointer' slot="reference"></i>
  </el-popover>
</template>
<script>
	export default{
		props:{
			qrcodeImg:{
				default:''
			}
		}
	}
</script>