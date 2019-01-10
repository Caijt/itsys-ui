<template>
	<el-dialog 
		:title='title'
		:visible.sync='show'
		class='c-dialog-fixed print'
		append-to-body
		width='60%'
	>
		<div class='test2'>
			123
			<br/>
			123
			<br/>
			123
			<br/>
			123
			<br/>
			123
			<br/>
			123
			<br/>
			123
			<br/>
			123
			<br/>
			123
			<br/>
			123
			<br/>
			123
			<br/>
			123
			
		</div>
		<span slot="footer">
	    <el-button @click="save" type="primary"  size='small' :loading='buttonLoading'>{{ buttonText }}</el-button>
	    <el-button @click="show=false" size='small'>关 闭</el-button>
	  </span>
	</el-dialog>
</template>
<script>

	export default {
		components:{  },
		props:{
			inDialog:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return {
				show:false,
				buttonLoading:false,
				data:null,
				isEdit:false
			}
		},
		computed:{
			title(){
				return this.isEdit?'编辑发货车辆':'创建发货车辆'
			},
			buttonText(){
				return this.isEdit?'更 新':'创 建'
			}		
		},
		methods:{
			selectOrder(row){
				this.$refs.form.selectOrder(row)
			},
			
			open(data=null){
				this.data = data	
				this.show = true
			},
			save(){
				this.buttonLoading = true
				this.$refs.form.save().catch(()=>{
					this.buttonLoading = false
				})
			},
			saved(){
				this.show=false
				this.$emit('saved')
			}
		}
	}
</script>
<style lang='scss'>
	.test2{
		border:1px solid red;		
		 
	}
</style>