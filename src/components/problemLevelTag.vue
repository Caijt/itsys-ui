<template>
	<el-tag :type='type' :size='size' >{{ text }}</el-tag>
</template>
<script>
	export default {
		props:{
			level:{
				type:Number
			},
			size:{
				default:''
			}
		},
		computed:{
			text(){
				let text=''
				if(this.level==1){
					text = '提醒级别'
				}else if(this.level==2){
					text = '情况重要'
				}else if(this.level==3){
					text = '情况紧急'
				}
				return text
			},
			type(){
				let text=''
				if(this.level==1){
					text = ''
				}else if(this.level==2){
					text = 'warning'
				}else if(this.level==3){
					text = 'danger'
				}
				return text
			}
		}
	}
</script>