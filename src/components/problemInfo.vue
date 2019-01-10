<template>
	<el-dialog :visible.sync="dialogShow">
		<el-form class='c-form-text' label-width='100px' v-loading='loading'>
			<el-row>
				<el-col :span='12'>
					<el-form-item label='创建时间'>
						<span>{{ data.create_time | formatDate }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='12'>
					<el-form-item label='问题级别'>
						<problem-level-tag :level='data.level' size='small'></problem-level-tag>
					</el-form-item>
				</el-col>
				<el-col :span='12'>
					<el-form-item label='反馈人'>
						<span>{{ data.create_user_name }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='12'>
					<el-form-item label='反馈部门'>
						<span>{{ getDepText(data.dep) }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='24'>
					<el-form-item label='反馈内容'>
						<span v-html='$commonJs.textareaToHtml(data.content)'></span>
					</el-form-item>
				</el-col>
				
				<el-col :span='12'>
					<el-form-item label='处理人'>
						<span>{{ data.resolve_user_name }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='12'>
					<el-form-item label='处理时间'>
						<span>{{ data.resolve_time | formatDate }}</span>
					</el-form-item>
				</el-col>
				<el-col :span='24'>
					<el-form-item label='处理结果'>
						<span v-html="$commonJs.textareaToHtml(data.resolve_content)"></span>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</el-dialog>
</template>
<script>
	import projectProblemApi from '@/api/yyzx/projectProblem'
	import ProblemLevelTag from '@/components/problemLevelTag'
	const dataInit = {

	}
	export default {
		components:{ ProblemLevelTag },
		data(){
			return {
				loading:true,
				data:Object.assign({},dataInit),
				dialogShow: false
			}
		},
		methods:{
			open(id){
				this.dialogShow = true
				this.loading = true
				projectProblemApi.getInfo(id).then(res=>{
					this.data = res.data
					this.loading = false
				})
			},
			getDepText(dep){
				return projectProblemApi.getDepText(dep)
			}
		}
	}
</script>