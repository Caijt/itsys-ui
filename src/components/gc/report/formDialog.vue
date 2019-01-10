<template>
	<el-dialog 
		:title='title'
		class='c-dialog-fixed'
		:visible.sync='show'
		:append-to-body='inDialog'
		
		@open='openDialog'>
		<purchase-form in-dialog ref='form' @saved='saved' />
		<span slot="footer">
	    <el-button @click="save(true)" type="primary"  size='small' :loading='buttonLoading'>提交</el-button>
	    <el-button @click="save(false)" size='small' :loading='buttonLoading'>暂存</el-button>
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
				data:null,
				isEdit:false
			}
		},
		computed:{
			title(){
				return this.isEdit?'编辑工程进度报告':'创建工程进度报告'
			},
			buttonText(){
				return this.isEdit?'更 新':'创 建'
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
					if(this.data){
						if(typeof(this.data)==='object'){
							this.$refs.form.assign(this.data)
							this.isEdit = this.data.id?true:false
						}else{
							this.$refs.form.get(this.data)
							this.isEdit = true
						}
					}
				})
			},
			open(data=null){
				this.data = data	
				this.show = true
			},
			save(isSubmit=false){
				console.log(isSubmit)
				this.buttonLoading = true
				this.$refs.form.save(isSubmit).catch(()=>{
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