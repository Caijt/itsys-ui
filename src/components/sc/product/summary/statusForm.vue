<template>
	<el-dialog 
		:title='title'
		class='c-dialog-fixed'
		:visible.sync='show'
		:append-to-body='inDialog'
		@open='openDialog'>
		<el-form 
			:model='form' :rules='rules' 
			ref='form' 
			size='mini' status-icon
			class='c-form-mini' >
			<el-form-item label='原生产状态' prop='product_status' class='c-input-readonly'>
				<el-input :value='form.product_status' readonly></el-input>
			</el-form-item>
			<el-form-item label='生产状态' prop='new_product_status'>
				<el-input v-model='form.new_product_status'></el-input>
			</el-form-item>
		</el-form>
		<span slot="footer">
			<el-button type='primary' @click="save" size='small' :loading='buttonLoading'>修 改</el-button>
	    <el-button @click="show=false" size='small'>关 闭</el-button>
	  </span>
	</el-dialog>
</template>
<script>
	import productApi from '@/api/sc/product'
	const formInit = {
		order_id:null,
		product_status:'',
		new_product_status:''
	}
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
				data:{},
				form:{},
				rules:{
					new_product_status:[{ required:true, message:'请填写生产状态' }]
				},
			}
		},
		computed:{
			title(){
				return '生产状态修改'
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
					this.form = {...this.form, ...this.data}
				})
			},
			open(data={}){
				this.data = data	
				this.show = true
			},
			save(){
				this.$refs.form.validate(vaild=>{
					if(vaild){
						this.buttonLoading = true
						productApi.editStatus(this.form).then(res=>{
							this.$message.success('状态修改成功')
							this.show = false
							this.buttonLoading = false
							this.$emit('saved',this.form)
						})
					}else{
						return false
					}
				})
			},
		}
	}
</script>