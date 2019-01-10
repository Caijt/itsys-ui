<template>
	<el-dialog 
		:title='title'
		class='c-dialog-fixed'
		:visible.sync='show'
		top='1vh'
		:append-to-body='inDialog'
		@open='openDialog'>
		<el-form 
			:model='form' :rules='rules' ref='form' label-width='100px' size='mini' class='c-form-mini' status-icon>
			<divider title='订单信息'></divider>
			<el-alert title='请填写订单修正面积' type='warning' style='margin-bottom: 10px'></el-alert>
			<div class='c-input-readonly'>
				<el-form-item label='订单编号' prop='order_no'>
					<el-input :value='form.order_no' readonly placeholder='此订单编号可以由生产部修改'></el-input>
				</el-form-item>
				<el-form-item label='下单日期' prop='order_date'>
					<el-input :value='form.order_date' readonly></el-input>
				</el-form-item>
				<el-form-item label='原下单面积' prop='order_area'>
					<el-input v-model='form.order_area' readonly>
						<span slot="suffix">㎡</span>
					</el-input>
				</el-form-item>
				<el-form-item label='生产完成面积' prop='sc_finish_area_total'>
					<el-input v-model='form.sc_finish_area_total' readonly>
						<span slot="suffix">㎡</span>
					</el-input>
				</el-form-item>
			</div>

			<el-form-item label='下单修正面积' prop='check_order_area'>
				<el-input v-model.number='form.check_order_area'>
					<span slot="suffix">㎡</span>
				</el-input>
			</el-form-item>
		</el-form>
		<span slot="footer">
	    <el-button @click="check" type="primary"  size='small' :loading='buttonLoading'>修正</el-button>
	    <el-button @click="show=false" size='small'>关 闭</el-button>
	  </span>
	</el-dialog>
</template>
<script>
	import orderApi from '@/api/yyzx/order'
	const formInit = {
		id:null,
		order_area:0,
		check_order_area:0,//下单修正面积	
		order_date:'',//下单日期
		sc_finish_area_total:0		
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
				form:{ ...formInit },
				show:false,
				buttonLoading:false,
				data:null,
				isEdit:false,
				rules:{
					check_order_area:[
					{ type:'number',message:'请输入数字' }],
				},
			}
		},
		computed:{
			title(){
				return '订单下单面积修正'
			}
		},
		methods:{
			openDialog(){
				this.buttonLoading = false
				this.$nextTick(()=>{
					this.$refs.form.resetFields()
					if(this.data){
						this.assign(this.data)
						this.isEdit = false
					}else{
						this.isEdit=false
					}
				})
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
				this.show = false
				this.$emit('saved')
			},
			assign(data){
				this.form = { ...this.form, ...data }
				this.form.check_order_area = Number(this.form.sc_finish_area_total)
				this.clearValidate()
			},
			clearValidate(){
				this.$nextTick(()=>{
					this.$refs.form.clearValidate()
				})				
			},
			resetFields(){
				this.form = { ...formInit }				
				this.clearValidate()
			},
			//保存
			check() {
				this.$refs.form.validate(vaild=>{
					if(vaild){			
						orderApi.check(this.form).then(res=>{
							this.$message.success('修正成功')
							this.loading = false
							this.$emit('updated')
							this.saved()
						})
					}else{
						return false
					}
				})
			},
		}
	}
</script>