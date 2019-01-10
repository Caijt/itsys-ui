<template>
	<div style='text-align: center'>
		<div style='color:#d3d3d3;font-size:40px;margin:10px'>信息尚未完善</div>
		<notice>
			<el-button type='primary'>通知相关人员</el-button>
		</notice>
	</div>
</template>
<script>
	import Notice from './notice'
	export default {
		components:{
			Notice
		},
		data(){
			return {
				noticeMethods:[]
			}
		},
		methods:{
			notice(){}
		}
	}
</script>