<template>
	<div>
		<el-dialog 
			:title='title'
			class='c-dialog-fixed'
			:visible.sync='show'
			:append-to-body='inDialog'
			@open='openDialog'
			@close='closeDialog'>
			<div v-loading='loading'>
				<el-form 
					:model='form' ref='form' :rules='rules' label-width='85px' size='mini' class='c-form-mini'>
					<el-form-item label='生产状态' prop='produce_status_remarks'>
						<el-input v-model='form.produce_status_remarks'></el-input>
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer">
		    <el-button type='primary' @click='save'>提交</el-button>
		    <el-button @click="show=false">关 闭</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	import produceLogApi from '@/api/sc/produceLog'

	const formInit = {
		id:null,
		produce_status_remarks:'',
	}
	export default {
		components:{ 
			
		},
		props:{
			inDialog:{
				type:Boolean,
				default:false
			}
		},
		data(){			
			return {
				updated:false,
				show:false,
				data:null,
				resolve:null,
				loading:false,
				form:{ ...formInit },
				rules:{					
					produce_status_remarks:[{	required:true,message:'请填写生产状态的描述' }]	
				}
			}
		},
		computed:{
			isEdit(){
				return this.form.id!=null
			},
			title(){
				return '订单生产日志'
			},
			productParams(){
				let order_id = this.form.id
				return {
					order_id
				}
			},
			attachParams(){
				let attach_ids = this.form.attach_ids
				return {
					attach_ids
				}
			}
		},
		mounted(){
		},
		methods:{
			openDialog(){
				this.updated = false
				this.loading = false
				this.$nextTick(()=>{
					this.clearValidate()
					if(this.resolve){
						this.resolve(this)
					}
				})
			},
			closeDialog(){
				if(this.updated){
					this.$emit('updated')
				}
				this.resolve = null
			},
			open(){
				this.show = true
				return new Promise((resolve,reject)=>{
					this.resolve = resolve
				}) 
			},
			//清除字段检验信息
			clearValidate(){
				this.$nextTick(()=>{
					this.$refs.form && this.$refs.form.clearValidate()
				})				
			},
			get(id){
				this.loading = true
				produceLogApi.getOrderForm(id).then(res=>{
					this.loading = false
					this.assign(res.data)
				})
			},
			//重置字段
			resetFields(){
				this.form = { ...formInit }
				this.clearValidate()
				return this
			},
			assign(data){
				this.form = { ...this.form, ...data }
				return this
			},
			save() {
				this.$refs.form.validate(vaild=>{
					if(vaild){
						this.loading = true			
						this.form.input_status = status
						produceLogApi.updateProduceStatus(this.form).then(res=>{
							this.$message.success('提交成功')
							this.loading = false
							this.updated = true
							this.show=false
						})
					}else{
						return false
					}
				})
			},			
		}
	}
</script>