<template>
	<div>
		<el-dialog :visible.sync="dialogShow" width='80%'>
			<el-table 
	  		:data='list' 
	  		ref='tableList'
	  		v-loading='loading' border stripe
	  		max-height='500'>
				<el-table-column prop='level' label='问题级别' align='center' width='80'>
					<template slot-scope='{row}'>
						<problem-level-tag :level='row.level' size='mini'></problem-level-tag>
					</template>
				</el-table-column>
				<el-table-column prop='level' label='提出部门'>
					<template slot-scope='scope'>
						<span>{{ getDepText(scope) }}</span>
					</template>
				</el-table-column>
				<el-table-column prop='content' label='反馈内容' show-overflow-tooltip></el-table-column>
				<el-table-column prop='create_user_name' label='反馈人' align='center'>
				</el-table-column>
				<el-table-column prop='create_time' label='反馈时间' align='center' width='140'>
					<template slot-scope='scope'>
						<span>{{scope.row.create_time | formatDate}}</span>
					</template>
				</el-table-column>
				<el-table-column prop='is_resolve' label='状态' align='center' width='80'>
					<template slot-scope='{row}'>					
						<el-tag size='mini' :type='row.is_resolve?"success":"danger"'>{{row.is_resolve?'已解决':'待解决'}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop='resolve_time' label='解决时间' align='center' width='140'>
					<template slot-scope='{row}'>
						<span>{{row.resolve_time | formatDate}}</span>
					</template>
				</el-table-column>
				<el-table-column prop='resolve_user_name' label='解决人' align='center'>
				</el-table-column>
				<el-table-column prop='resolve_content' label='处理结果' show-overflow-tooltip>
				</el-table-column>
				<el-table-column label='操作' fixed='right' align='center' width='120'>
					<template slot-scope='scope'>
						<el-button  size='mini' type='text' @click='viewProblem(scope)'>预览</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-dialog>
		<problem-info ref='problemInfo'></problem-info>
	</div>
</template>
<script>
	import projectProblemApi from '@/api/yyzx/projectProblem'
	import problemLevelTag from '@/components/problemLevelTag'
	import problemInfo from '@/components/problemInfo'
	
	export default {
		components:{ problemLevelTag ,problemInfo},
		data(){
			return {
				list:[],
				loading:true,				
				dialogShow: false
			}
		},
		methods:{
			open(projectId){
				this.loading = true
				this.dialogShow = true
				projectProblemApi.getListByProject(projectId).then(res=>{
					this.list = res.data
					this.loading = false
				})
			},
			getDepText({row}){
				return projectProblemApi.getDepText(row.dep)
			},
			viewProblem({row}){
				this.$refs.problemInfo.open(row.id)
			}
		}
	}
</script>