<template>
	<div class='divider-container'>
		<div class='border' :style='borderStyle'></div>
		<div class='title' :style='titleStyle'><slot>{{title}}</slot></div>
		<div class='border' :style='borderStyle'></div>
	</div>
</template>
<script>
	export default {
		name:'divider',
		props:{
			title:{
				default:''
			},
			color:{
				default:''
			},
			borderColor:{
				default:''
			}
		},
		computed:{
			borderStyle(){
				let borderColor = this.color
				return {
					borderColor
				}
			},
			titleStyle(){
				let color = this.color
				return {
					color
				}
			}
		}
	}
</script>
<style lang='scss' scoped>
	.divider-container{
		display: flex;
		padding:12px 0px 8px;
		.border{
			border-top:1px solid #DCDFE6;
			flex:1
		}
		.title{
			font-size: 14px;
			padding:0px 15px;
			margin-top:-8px;
			color:#909399;
		}
	}
</style>