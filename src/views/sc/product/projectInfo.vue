<template>
	<el-dialog :visible.sync="dialogShow">
		<el-form class='c-form-text' label-width='100px'>
			<el-row>
				<el-col :span='12'>
					<el-form-item label='创建时间'>
						<span>{{ project.create_time | formatDate }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='12'>
					<el-form-item label='更新时间'>
						<span>{{ project.update_time | formatDate }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='24'>
					<el-form-item label='项目名称'>
						<span>{{ project.name }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='12'>
					<el-form-item label='项目编号'>
						<span>{{ project.no }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='12'>
					<el-form-item label='终端合同编号'>
						<span>{{ project.contract_no }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='24'>
					<el-form-item label='客户名称'>
						<span>{{ project.customer }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='12'>
					<el-form-item label='客户类别'>
						<span>{{ project.customer_type }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='12'>
					<el-form-item label='分公司'>
						<span>{{ project.company }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='12'>
					<el-form-item label='区域'>
						<span>{{ project.area }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='12'>
					<el-form-item label='业务员'>
						<span>{{ project.salesman }}</span>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</el-dialog>
</template>
<script>
	import projectApi from '@/api/yyzx/project'
	const projectInit = {

	}
	export default {
		data(){
			return {
				project:Object.assign({},projectInit),
				dialogShow: false
			}
		},
		methods:{
			open(id){
				this.dialogShow = true
				projectApi.get(id).then(res=>{
					this.project = res.data
				})
			}
		}
	}
</script>