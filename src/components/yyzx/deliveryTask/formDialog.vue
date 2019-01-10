<template>
	<el-dialog 
		:title='title'
		class='c-dialog-fixed'
		:visible.sync='show'
		:append-to-body='inDialog'
		width='80%'
		@open='openDialog'
		@close='closeDialog'>
		<div v-loading='loading'>
			<el-form 
				:model='form' :rules='rules' ref='form' label-width='105px' size='mini' class='c-form-mini' status-icon>
				<divider title='发货信息'></divider>
				<el-row :gutter='10'>
					<el-col :span='8'>
						<el-form-item label='合同编号' prop='contract_no'>
							<el-input v-model='form.contract_no' placeholder=''></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='调拨单号' prop='db_no'>
							<el-input v-model='form.db_no' placeholder=''></el-input>
						</el-form-item>
					</el-col>	
					<el-col :span='8'>
						<el-form-item label='发货申请编号' prop='fh_no'>
							<el-input v-model='form.fh_no' ></el-input>
						</el-form-item>
					</el-col>	
					<el-col :span='24'>
						<el-form-item label='订单号' prop='order_no'>
							<el-input v-model='form.order_no' ></el-input>
						</el-form-item>
					</el-col>	
					<el-col :span='8'>
						<el-form-item label='项目名称' prop='project'>
							<el-input v-model='form.project' ></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='交付方式' prop='method'>
							<el-input v-model='form.method' ></el-input>
						</el-form-item>
					</el-col>	
					<el-col :span='8'>
						<el-form-item label='计划发货日期' prop='plan_send_date'>
							<el-date-picker v-model='form.plan_send_date' value-format='yyyy-MM-dd' style='width:100%'></el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<divider>业绩所属</divider>
				<el-row :gutter='10'>
					<el-col :span='8'>
						<el-form-item label='业绩所属公司' prop='salesman_unit'>
							<el-input v-model='form.salesman_unit' ></el-input>
						</el-form-item>
					</el-col>	
					<el-col :span='8'>
						<el-form-item label='业务员' prop='salesman_name'>
							<el-input v-model='form.salesman_name' ></el-input>
						</el-form-item>
					</el-col>	
					<el-col :span='8'>
						<el-form-item label='联系电话' prop='salesman_tel'>
							<el-input v-model='form.salesman_tel' ></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<divider title='收货信息'></divider>
				<el-row :gutter='10'>
					<el-col :span='8'>
						<el-form-item label='收货单位' prop='receive_unit'>
							<el-input v-model='form.receive_unit' ></el-input>
						</el-form-item>
					</el-col>	
					<el-col :span='8'>
						<el-form-item label='收货人' prop='receive_name'>
							<el-input v-model='form.receive_name' ></el-input>
						</el-form-item>
					</el-col>	
					<el-col :span='8'>
						<el-form-item label='联系电话' prop='receive_tel'>
							<el-input v-model='form.receive_tel' ></el-input>
						</el-form-item>
					</el-col>	
					<el-col :span='24'>
						<el-form-item label='收货地址' prop='receive_address'>
							<el-input v-model='form.receive_address' ></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			
			<contract-info ref='contractInfo' :in-dialog='inDialog'></contract-info>
		</div>
		<span slot="footer">
	    <el-button @click="submit" type="primary"  size='small' :loading='buttonLoading'>{{ buttonText }}</el-button>
	    <el-button @click="save" size='small' :loading='buttonLoading'>暂存</el-button>
	    <el-button @click="show=false" size='small'>关 闭</el-button>
	  </span>
	</el-dialog>
</template>
<script>
	import deliveryTaskApi from '@/api/yyzx/deliveryTask'
	import contractInfo from '@/components/yyzx/contract/info'
	const formInit = {
		id:null,
		status:0,
		contract_no:'',
		db_no:'',
		fh_no:'',
		order_no:'',
		project:'',
		method:'',
		plan_send_date:'',
		salesman_unit:'',
		salesman_name:'',
		salesman_tel:'',
		receive_unit:'',
		receive_name:'',
		receive_tel:'',
		receive_address:''
	}
	export default {
		components:{ contractInfo },
		props:{
			inDialog:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return {
				updated: false,
				show: false,
				buttonLoading: false,
				data: null,
				loading: false,
				form:{ ...formInit },
				maxOrderArea:0,
				rules:{
					salesman_unit:[{ required:true, message:'请填写业务单位' }],
					salesman_name:[{ required:true, message:'请填写业务员' }],
					salesman_tel:[{ required:true, message:'请填写业务员联系电话' }],
					plan_send_date:[{	required:true,message:'请填写计划发货日期' }],
					method:[{ required:true, message:'请填写业务员联系电话' }],
					receive_unit:[{	required:true,message:'请填写收货单位' }],
					receive_address:[{	required:true,message:'请填写收货地址' }],
					receive_name:[{	required:true,message:'请填写收货地址' }],
					receive_tel:[{	required:true,message:'请填写收货地址' }]
					
				},
				orderTypeLoading:true,
			}
		},
		computed:{
			//表单是否是编辑状态
			isEdit(){
				return this.form.id!=null
			},
			title(){
				return this.isEdit?'编辑发货任务':'创建发货任务'
			},
			buttonText(){
				return '提交'
			}
		},
		methods:{
			openDialog(){
				this.updated = false
				this.buttonLoading = false
				this.$nextTick(()=>{
					this.$refs.form.resetFields()
					if(this.data){
						if(typeof(this.data)==='object'){
							this.$refs.form.assign(this.data)
							this.isEdit=this.data.id?true:false
						}else{
							this.$refs.form.get(this.data)
							this.isEdit = true
						}
					}
				})
			},
			closeDialog(){
				if(this.updated){
					this.$emit('saved')
				}
			},
			open(data){
				this.data = data
				this.show = true
			},
			submit(){
				let confirmText = '确定删除？'
				this.$confirm('任务提交后，任务信息将无法修改，并提交至储运中心进行发货的操作，你确定提交吗？','提示',{
					type: 'warning'
				}).then(()=>{
					this.save(true)
				})
			},
			saved(){
				this.show = false
				this.$emit('saved')
			},
			get(id){
				this.loading = true
				deliveryTaskApi.getInfo(id).then(res=>{
					this.assign(res.data)
					this.loading = false
				})
			},
			assign(data){
				this.form = {...this.form,...data}
			
				this.clearValidate()
			},
			//保存
			save(isSubmit=false) {
				return new Promise(( resolve,reject )=>{
					this.$refs.form.validate(vaild=>{
						if(vaild){
							this.form.status=isSubmit?1:0
							if(this.isEdit){							
								deliveryTaskApi.update(this.form).then(res=>{
									this.$message.success('更新成功')
									this.$emit('updated')
									this.$emit('saved')
									resolve('updated')
								})
							}else{						
								deliveryTaskApi.create(this.form).then(res=>{
									this.$message.success('创建成功')
									this.$emit('created')
									this.$emit('saved')
									resolve('created')
								})
							}
							resolve()
						}else{
							reject()
						}
					})
				})
			},
			clearValidate(){
				this.$nextTick(()=>{
					this.$refs.form.clearValidate()
				})				
			},
			resetFields(){
				this.form = {...formInit}
				this.clearValidate()
			},
			openOrderSummaryDialog(){
				this.$refs.orderSummaryDialog.open({noOrder:1})
			},
			selectProject({row}){
				let data = this.$commonJs.obj.copyByKey(row,[
					'project_id','project_name','project_no',
					'contract_no','no_order_area','project_area','contract_id'])
				this.assign(data)	
				this.$refs.orderSummaryDialog.close()
			},
		}
	}
</script>