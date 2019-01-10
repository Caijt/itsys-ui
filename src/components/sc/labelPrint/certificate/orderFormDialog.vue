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
					:model='form' :rules='rules' ref='form' label-width='85px' size='mini'  status-icon>
					<div class='c-form-mini'>
						<divider title='订单信息'></divider>
						<el-form-item label='订单编号' prop='order_no'>
							<el-input v-model='form.order_no' placeholder='可以从系统中提取订单信息'>
								<el-button slot="append" @click='openOrderDialog'>提取</el-button>
							</el-input>
						</el-form-item>
						<el-form-item label='项目名称' prop='project_name'>
							<el-input v-model='form.project_name' placeholder=''>
							</el-input>
						</el-form-item>
						<el-form-item label='客户名称' prop='customer_name'>
							<el-input v-model='form.customer_name' placeholder=''>
							</el-input>
						</el-form-item>
						<el-form-item label='订单日期' prop='order_date'>
							<el-date-picker v-model='form.order_date' value-format='yyyy-MM-dd' style='width:100%'></el-date-picker>
						</el-form-item>
						<el-form-item label='生产基地'  prop='area_id'>
							<el-select v-model='form.area_id' style='width: 100%'>
								<el-option 
									v-for='item in areaList' 
									:value='item.id'
									:label='item.name'
									:key='item.id'>
								</el-option>
							</el-select>
						</el-form-item>
					</div>
				</el-form>
			</div>
			<span slot="footer">
		    <el-button @click="save" type="primary"  size='small' :loading='loading'>{{ buttonText }}</el-button>		   
		    <el-button @click="show=false" size='small'>关 闭</el-button>
		  </span>
		</el-dialog>
		<order-list-dialog ref='orderDialog' :in-dialog='inDialog'>
			<el-table-column slot='column' width='60' align='center' label='操作' fixed='right'>
				<template slot-scope='scope'>
					<el-button size='mini' type='text' @click='selectOrder(scope)'>选择</el-button></template>
			</el-table-column>
		</order-list-dialog>
	</div>
</template>

<script>
	import orderApi from '@/api/yyzx/order'
	import certificateOrderApi from '@/api/sc/certificateOrder'
	import orderListDialog from '@/components/yyzx/order/progress/listDialog'

	const formInit = {
		order_no:'',
		project_name:'',
		customer_name:'',
		order_date:'',
		area_id:''
	}
	export default {
		components:{ 
			orderListDialog
		},
		props:{
			inDialog:{
				type:Boolean,
				default:false
			}
		},
		data(){			
			return {
				changed:false,
				show:false,
				data:null,
				loading:false,
				form:{ ...formInit },
				rules:{					
					area_id:[{ required:true, message:'请选择订单生产基地' }],
					order_date:[{	required:true,message:'请填写订单日期' }],			
					order_no:[{		required:true,message:'请填写订单编号' }]	,					
					project_name:[{		required:true,message:'请填写项目名称' }]	,					
					customer_name:[{		required:true,message:'请填写客户名称' }]
				},
				areaList:[]
			}
		},
		computed:{
			isEdit(){
				return this.form.id!=null
			},
			title(){
				return this.isEdit?'编辑订单':'创建订单'
			},
			buttonText(){
				return this.isEdit?'更新':'创建'
			}			
		},
		mounted(){
			this.getAreaList()
		},
		methods:{
			openDialog(){
				this.changed = false
				this.loading = false
				this.$nextTick(()=>{
					this.clearValidate()
				})
			},
			open(data=null){
				// this.data = data
				this.show = true
			},
			//清除字段检验信息
			clearValidate(){
				this.$nextTick(()=>{
					this.$refs.form && this.$refs.form.clearValidate()
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
				// this.clearValidate()
			},
			//获取基地列表
			getAreaList(){
				orderApi.getAreaList().then(res=>{
					this.areaList = res.data
				})
			},
			//保存
			save() {
				this.$refs.form.validate(vaild=>{
					if(vaild){
						this.loading = true
						if(this.isEdit){						
							certificateOrderApi.update(this.form).then(res=>{
								this.$message.success('更新成功')
								this.loading = false
								this.changed = true
								this.show = false
							})
						}else{
							certificateOrderApi.create(this.form).then(res=>{
								this.$message.success('创建成功')
								this.loading = false
								this.changed = true
								this.show = false
							})
						}
					}else{
						return false
					}
				})
			},			
			openOrderDialog(){
				this.$refs.orderDialog.open()
			},
			selectOrder({ row }){
				let data = this.$commonJs.obj.copyByKey(row,[
					'order_no','project_name','customer_name','order_date'])
				this.assign(data)	
				this.$refs.orderDialog.close()
			},			
			closeDialog(){
				if(this.changed){
					this.$emit('changed')
				}
			}			
		}
	}
</script>