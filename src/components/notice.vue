<template> 
	<el-popover>
		<el-form label-width='70px' size='small'>
			<el-form-item label='相关人员'>
				<span><b>测试员</b></span>
			</el-form-item>
			<el-form-item label='通知方式'>
				<el-checkbox-group v-model='noticeMethods'>
					<el-checkbox label="钉钉" border></el-checkbox>
					<el-checkbox label="微信" border></el-checkbox>
					<el-checkbox label="短信" border></el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			<el-form-item label='附言'>
				<el-input placeholder='请您尽快填写项目信息！'></el-input>
			</el-form-item>
			<el-form-item label-width='0px'>
				<el-button style='width: 100%' type='primary' @click='notice'>发送通知</el-button>
			</el-form-item>
		</el-form>
		<slot slot='reference'></slot>
	</el-popover>	 
</template>
<script>
	export default {
		data(){
			return {
				noticeMethods:[]
			}
		},
		methods:{
			notice(){
				this.$message('功能未开发')
			}
		}
	}
</script>