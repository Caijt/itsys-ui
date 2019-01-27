<template>
	<div>
		<el-row style='height:100vh' type='flex' align='middle' justify='center'>
			<el-col style='text-align: center;color:#303133'>
				<i class="el-icon-loading" style='font-size:70px'></i>
				<div style='margin-top: 15px'>微信认证中...</div>
			</el-col>
		</el-row>
		
	</div>
</template>
<script>
	import authApi from '@/api/auth'
	import Cookies from 'js-cookie'
	export default {
		props:{
			path:{
				type:String,
				default:'index/updateRecord'
			}
		},
		data(){
			return {}
		},
		created(){
			this.qywxAuth()
		},
		methods:{
			qywxAuth(){
				let last_url =window.location.origin + window.location.pathname+'#/'+this.path
        Cookies.set('last_url',last_url,{path:'/'})
        window.location.replace(authApi.qywxAuthUrl)
			}
		}
	}
</script>