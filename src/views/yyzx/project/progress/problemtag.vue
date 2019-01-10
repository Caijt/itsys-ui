<template>
	<span>
		<el-tooltip content='提醒级别' placement="top">
			<el-tag v-show='info!=0' size='mini'>{{info}}</el-tag>
		</el-tooltip>
		<el-tooltip content='情况重要' placement="top">
			<el-tag v-show='warning!=0' type='warning' size='mini'>{{warning}}</el-tag>
		</el-tooltip>
		<el-tooltip content='情况非常紧急重要' placement="top">
			<el-tag v-show='danger!=0' type='danger' size='mini'>{{danger}}</el-tag>
		</el-tooltip>
	</span>
</template>
<script>
export default {
	props:{
		list:{
			type:Array,
			default(){return []}
		}
	},
	computed:{
		info(){
			return this.list.filter(i=>{
				return i.problem_level=='INFO'
			}).length
		},
		warning(){
			return this.list.filter(i=>{
				return i.problem_level=='WARNING'
			}).length
		},
		danger(){
			return this.list.filter(i=>{
				return i.problem_level=='DANGER'
			}).length
		}
	}
}
</script>