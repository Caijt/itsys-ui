<template>
	<div>
		<div>测试版本号：<span >v20180318001</span></div>
		<div>测试版本号html：<span ref='version'>v20180320001</span></div>
		<div>测试版本号data：<span>{{ localVersion }}</span></div>
		<div>系统版本号remote：<span >{{ remoteVersion }}</span></div>
		<el-button @click='refresh' type='primary'>刷新</el-button>
		<el-button @click='getLocalVersion' type='primary'>得出本地版本号</el-button>
		<el-button @click='getRemoteVersion' type='primary' :loading='loading'>得出系统版本号</el-button>
		<upload url='\api\fh\Test\test1'></upload>
		<upload url='\api\fh\Test\test2'></upload>
	</div>
</template>
<script>
	import configApi from '@/api/sys/config'
	import upload from '@/components/common/attach/upload'
	export default {
		components:{
			upload
		},
		data:()=>({
			loading:false,
			remoteVersion:'',
			localVersion:'v20180317002'
		}),
		mounted(){
			configApi.getValue('version').then(res=>{
				this.remoteVersion = res.data
				if(this.remoteVersion !==this.$refs.version.innerText){
					this.$confirm('检测本地系统版本与服务器系统版本不一致，是否进行刷新加载更新内容？','更新提示',{
						type:'warning',
						confirmButtonText: '刷新',
					}).then(()=>{
						window.location.reload()
					})
				}
			})
		},
		methods:{
			refresh(){
				window.location.reload()
			},
			getLocalVersion(){
				alert(this.$refs.version.innerText)
			},
			getRemoteVersion(){
				this.loading = true
				configApi.getValue('version').then(res=>{
					this.loading = false
					alert(res.data)
				})
			}
		}
	}
</script>