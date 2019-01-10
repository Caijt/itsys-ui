<template>
	<el-dialog 
		:title='title'
		class='c-dialog-fixed'
		:visible.sync='show'
		:append-to-body='inDialog'
		width='80%'
		@open='openDialog'>
		<purchase-form in-dialog ref='form' @saved='saved' />
		<span slot="footer">
	    <el-button @click="save" type="primary"  size='small' :loading='buttonLoading'>{{ buttonText }}</el-button>
	    <el-button @click="show=false" size='small'>关 闭</el-button>
	  </span>
	</el-dialog>
</template>
<script>
	import purchaseForm from './form'
	export default {
		components:{ purchaseForm },
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
				data:{}
			}
		},
		computed:{
			title(){
				return this.data.id?'编辑物料库存报告':'创建物料库存报告'
			},
			buttonText(){
				return this.data.id?'更 新':'创 建'
			}
		},
		methods:{
			selectOrder(row){
				this.$refs.form.selectOrder(row)
			},
			openDialog(){
				this.buttonLoading = false
				this.$nextTick(()=>{
					this.$refs.form.resetFields()
					this.$refs.form.assign(this.data)
				})
			},
			open(data={}){
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