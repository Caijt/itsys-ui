<template>
	<el-dialog 
		:title='title'
		class='c-dialog-fixed'
		:visible.sync='show'
		:append-to-body='inDialog'
		width='80%'
		@open='openDialog'>
		<order-form in-dialog ref='form' @saved='saved'></order-form>
		<span slot="footer">
	    <el-button @click="save" type="primary"  :loading='buttonLoading'>{{ buttonText }}</el-button>
	    <el-button @click="show=false" >关 闭</el-button>
	  </span>
	</el-dialog>
</template>
<script>
	import orderForm from './form'
	export default {
		components:{ orderForm },
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
				id:null
			}
		},
		computed:{
			title(){
				return this.id?'编辑合同':'创建合同'
			},
			buttonText(){
				return this.id?'更 新':'创 建'
			}
		},
		methods:{
			openDialog(){
				this.buttonLoading = false
				this.$nextTick(()=>{
					this.$refs.form.resetFields()
					if(this.id){
						this.$refs.form.get(this.id)
					}					
				})
			},
			open(id=null){
				this.id = id	
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