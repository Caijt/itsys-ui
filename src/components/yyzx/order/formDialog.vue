<template>
	<div>
		<el-dialog 
			:title='title'
			class='c-dialog-fixed'
			:visible.sync='show'
			top='1vh'
			:append-to-body='inDialog'
			width='80%'
			@open='openDialog'
			@close='closeDialog'>
			<div v-loading='loading'>
				<el-form 
					:model='form' :rules='rules' ref='form' label-width='85px' size='mini'  status-icon>
						<div class='c-form-mini'>
						<divider title='项目信息'></divider>
						<el-alert title='订单创建后，所属项目将无法修改' type='warning' style='margin-bottom: 10px'></el-alert>
						<el-row :gutter='10' class='c-input-readonly '>				
							<el-col :span='16'>
								<el-form-item label='所属项目' prop='project_id'>
									<el-input readonly :value='form.project_name' placeholder='选择项目自动加载'>
										<el-button slot="append" @click='openOrderSummaryDialog' :disabled='isEdit'>选择</el-button>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span='8'>
								<el-form-item label='项目编号'>
									<el-input readonly :value='form.project_no' placeholder='选择项目自动加载'></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter='10' class='c-input-readonly'>
							<el-col :span='8'>
								<el-form-item label='合同编号'>
									<el-input readonly :value='form.contract_no' placeholder='选择项目自动加载'>
										<el-button slot="prepend" @click='$refs.contractInfo.open(form.contract_id)' v-if='form.contract_id'>查看</el-button>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span='8' >
								<el-form-item label='项目面积'>
									<el-input readonly :value='form.project_area' placeholder='选择项目自动加载'>
										<span slot="suffix">㎡</span>
									</el-input>
								</el-form-item>
							</el-col>	
							<el-col :span='8' >
								<el-form-item label='未下单面积'>
									<el-input readonly :value='form.no_order_area' placeholder='选择项目自动加载'>
										<span slot="suffix">㎡</span>
									</el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<divider title='订单信息'></divider>
						<el-alert title='订单编号可以为空，由生产部在ERP系统生成后在生产需求计划中进行填写' type='warning' style='margin-bottom: 10px'></el-alert>
						<el-row :gutter='10'>
							<el-col :span='8'>
								<el-form-item label='订单编号' prop='order_no'>
									<el-input v-model='form.order_no' placeholder='此订单编号可以由生产部修改'></el-input>
								</el-form-item>
							</el-col>
							<el-col :span='8'>
								<el-form-item label='订单类别' prop='type_id'>
									<el-select v-model='form.type_id' :loading='orderTypeLoading' style='width: 100%'>
										<el-option 
											v-for='item in orderTypeList' 
											:value='item.id'
											:label='item.name'
											:key='item.id'>
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>	
							<el-col :span='8'>
								<el-form-item label='订单批次' prop='batch'>
									<el-input v-model='form.batch' ></el-input>
								</el-form-item>
							</el-col>	
							<el-col :span='8'>
								<el-form-item label='生产工厂'  prop='area_id'>
									<el-select v-model='form.area_id' style='width: 100%'>
										<el-option 
											v-for='item in areaList' 
											:value='item.id'
											:label='item.name'
											:key='item.id'>
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span='8'>
								<el-form-item label='合同下单'  prop='is_contract'>
									<el-radio-group v-model="form.is_contract">
								    <el-radio :label="1">有</el-radio>
								    <el-radio :label="2">无</el-radio>
								  </el-radio-group>
								</el-form-item>
							</el-col>
							<el-col :span='8'>
								<el-form-item label='下单日期' prop='order_date'>
									<el-date-picker v-model='form.order_date' value-format='yyyy-MM-dd' style='width:100%'></el-date-picker>
								</el-form-item>
							</el-col>			
							<el-col :span='8'>
								<el-form-item label='交货日期'  prop='delivery_date'>
									<el-date-picker 
										v-model='form.delivery_date' value-format='yyyy-MM-dd' 
										placeholder='填写预计交货日期' style='width:100%'></el-date-picker>
								</el-form-item>
							</el-col>			
							<el-col :span='8'>
								<el-form-item label='下单面积' prop='order_area'>
									<el-input v-model.number='form.order_area'>
										<span slot="suffix">㎡</span>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span='8'>
								<el-form-item label='下单数量'  prop='order_amount'>
									<el-input v-model.number='form.order_amount'></el-input>
								</el-form-item>
							</el-col>
							<el-col :span='8'>
								<el-form-item label='安装方式'  prop='install_method'>
									<el-select v-model='form.install_method' style='width:100%'>
										<el-option value='整窗安装'></el-option>
										<el-option value='非整窗安装'></el-option>
									</el-select>
								</el-form-item>
							</el-col>	
							
							<el-col :span='8'>
								<el-form-item label='系列'  prop='series'>
									<el-input v-model='form.series'></el-input>
								</el-form-item>
							</el-col>
							<el-col :span='8'>
								<el-form-item label='窗型'  prop='model'>
									<el-input v-model='form.model'></el-input>
								</el-form-item>
							</el-col>
							<el-col :span='8'>
								<el-form-item label='闭窗器'  prop='window_style'>
									<el-input v-model='form.window_style' placeholder='闭窗器样式'></el-input>
								</el-form-item>
							</el-col>
							<el-col :span='8'>
								<el-form-item label='型材颜色'  prop='color'>
									<el-input v-model='form.color'>
										<el-button slot="append" @click='$refs.colorListDialog.open()'>提取</el-button>
									</el-input>
								</el-form-item>
							</el-col>							
							<el-col :span='8' >
								<el-form-item label='防火时间' prop='fire_time'>
									<el-input v-model.number = 'form.fire_time'>
										<span slot="suffix">小时</span>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span='24'>
								<el-form-item label='备注'  prop='product_status'>
									<el-input v-model='form.product_status'></el-input>
								</el-form-item>
							</el-col>
							<el-col :span='24'>
								<el-form-item label='玻璃加工状态预计交期' prop='glass_expect_delivery'>
									<el-input v-model='form.glass_expect_delivery' type='textarea' :rows='3'></el-input>
								</el-form-item>
							</el-col>
							<el-col :span='12'>
								<el-form-item label='订单状态' prop='is_finish'>
									<el-radio-group v-model ="form.is_finish">
								    <el-radio :label = '0'>进行中</el-radio>
								    <el-radio :label = "1">完成</el-radio>
								  </el-radio-group>
								</el-form-item>
							</el-col>
							<el-col :span='12' v-if='form.is_finish'>
								<el-form-item label='完成日期' prop='finish_date'>
									<el-date-picker v-model='form.finish_date' v-if='form.is_finish' value-format='yyyy-MM-dd' style='width:100%'></el-date-picker>
								</el-form-item>
							</el-col>
						</el-row>
					</div>
					<el-form-item label='附件管理'>
						<attach-upload 
							ref='attachUpload'
							:url='attachUploadUrl'
							:params='{order_id:form.id}' 
							:hide-upload-button='!isEdit'
							@uploaded='(res)=>{$refs.attachList.insert(res)}'/>
						<attach-list v-show='isEdit'  max-height='250' ref='attachList' no-page hide-query :params='attachParams'>
							<el-table-column slot='column' label='操作'  width='80' align='center'>
								<template slot-scope='{row}'>
									<el-button type='text' size='mini' @click='delAttach(row)'>删除</el-button>
								</template>
							</el-table-column>
						</attach-list>
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer">
		    <el-button @click="save" type="primary"  size='small' :loading='buttonLoading'>{{ buttonText }}</el-button>
		    <el-button @click="cancel" type="danger"  size='small' v-show='isEdit' :loading='buttonLoading'> 取消订单</el-button>
		    <el-button @click="show=false" size='small'>关 闭</el-button>
		  </span>
		</el-dialog>
		<order-summary-dialog ref='orderSummaryDialog' :in-dialog='inDialog'>
			<el-table-column slot='column' width='60' align='center' label='操作' fixed='right'>
				<template slot-scope='scope'>
					<el-button size='mini' type='text' @click='selectProject(scope)'>选择</el-button></template>
			</el-table-column>
		</order-summary-dialog>
		<contract-info ref='contractInfo' :in-dialog='inDialog'></contract-info>
		<color-list-dialog ref='colorListDialog' :in-dialog='inDialog'>
			<el-table-column slot='column' fixed='right' label='操作' width='60' align='center'>
				<template slot-scope='{row}'>
					<el-button type='text' size='mini' @click='selectColor(row)'>选择</el-button>
				</template>
			</el-table-column>
		</color-list-dialog>
	</div>
</template>

<script>
	import orderTypeApi from '@/api/yyzx/orderType'
	import orderApi from '@/api/yyzx/order'
	import orderSummaryDialog from '@/components/yyzx/order/summary/listDialog'
	import contractInfo from '@/components/yyzx/contract/info'
	import attachUpload from '@/components/common/attach/upload'
	import attachList from '@/components/common/attach/list'
	import colorListDialog from '@/components/yyzx/colorSample/color/listDialog'

	const formInit = {
		id:null,
		project_id:null,//项目id
		type_id:null,//订单类型id
		project_name:'',//项目名称
		contract_no:'',	//合同编号
		project_no:'',
		no_order_area:'',

		order_no:'',//订单编号
		order_area:0,//订单面积		
		batch:'',//订单批次
		is_contract:'',//有无合同下单
		color:'',//型材颜色
		install_method:'',
		order_date:'',//下单日期
		order_amount:0,//订单数量
		is_finish:0,//
		product_status:'',
		expect_delivery:'',
		glass_expect_delivery:'',
		finish_date:'',
		attach_ids:'',
		delivery_date:'',
		fire_time:0,
		area_id:'',
	}
	export default {
		components:{ 
			attachUpload,
			orderSummaryDialog,
			attachList,
			contractInfo,
			colorListDialog
		},
		props:{
			inDialog:{
				type:Boolean,
				default:false
			}
		},
		data(){
			let validator = (rule,value,callback)=>{
				if(value){
					orderApi.checkNoUnique(value,this.form.id).then(res=>{
						if(res.data>0){
							callback(new Error('订单号已重复'))
						}else{
							callback()
						}
					})
				}else{
					callback()
				}
			}
			return {
				updated:false,
				show:false,
				buttonLoading:false,
				data:null,
				attachUploadUrl:orderApi.attachUploadUrl,
				loading:false,
				form:{ ...formInit },
				maxOrderArea:0,
				rules:{
					type_id:[{ required:true, message:'请选择订单类型' }],
					project_id:[{ required:true, message:'请选择订单所属项目' }],
					area_id:[{ required:true, message:'请选择订单生产基地' }],
					order_date:[{	required:true,message:'请填写下单日期' }],
					finish_date:[{	required:true,message:'请填写完成日期' }],
					is_contract:[{	required:true,message:'请选择有无合同下单' }],
					order_no:[
					{
						validator:validator, trigger:'blur'
					}],
					order_area:[
					{ type:'number',message:'请输入数字' },
					{ 
						validator:(rule,value,callback)=>{
							if(value<=0){
								callback(new Error('下单面积必须大于0'))
							}else{
								callback()
							}
						}
					}],
					fire_time:[{ type:'number', message:'请输入数字' }]
				},
				orderTypeList:[],
				orderTypeLoading:true,
				attachParams:{},
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
			this.getOrderTypeList()
			this.getAreaList()
		},
		methods:{
			openDialog(){
				this.updated = false
				this.buttonLoading = false
				this.$nextTick(()=>{
					this.resetFields()
					if(this.data){
						if(typeof(this.data)==='object'){
							this.assign(this.data)							
						}else{
							this.get(this.data)							
						}
					}
				})
			},
			open(data=null){
				this.data = data
				this.show = true
			},
			cancel(){
				this.$confirm('您确定取消此订单？取消后的订单可以在订单回收站进行恢复','订单取消',{
					type: 'warning'
				}).then(()=>{
					 this.$prompt('填写订单取消原因', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	        }).then(({ value }) => {
	          orderApi.remove({id:this.form.id,del_remarks:value}).then(res=>{
							this.updated = true
							this.show = false
							this.$message.success('关闭成功')
						})
	        })
					
				})
			},
			//获取订单类型列表
			getOrderTypeList(){
				this.orderTypeLoading = true
				orderTypeApi.getEnumList().then(res=>{
					this.orderTypeList = res.data
					this.orderTypeLoading = false
				})
			},
			//
			getAreaList(){
				//this.orderTypeLoading = true
				orderApi.getAreaList().then(res=>{
					this.areaList = res.data
					//this.orderTypeLoading = false
				})
			},
			get(id){
				this.loading = true
				orderApi.getForm(id).then(res=>{
					this.assign(res.data)
					this.loading = false
				})
			},
			assign(data){
				this.form = { ...this.form, ...data }
				this.attachParams.attach_ids = this.form.attach_ids				
				this.$refs.attachList.initData()
				this.form.order_area = Number(this.form.order_area)
				this.form.fire_time = Number(this.form.fire_time)
				this.form.order_amount = Number(this.form.order_amount)
				this.maxOrderArea = Number(this.form.no_order_area) + Number(this.form.order_area)
				this.clearValidate()
			},
			//保存
			save(status=0) {
				this.$refs.form.validate(vaild=>{
					if(vaild){
						this.loading = true
						if(this.isEdit){						
							orderApi.update(this.form).then(res=>{
								this.$message.success('更新成功')
								this.loading = false
								this.updated = true
							})
						}else{
							orderApi.create(this.form).then(res=>{
								this.form.id = res.data
								this.$refs.attachUpload.params.order_id = res.data
								this.$refs.attachUpload.upload().then(res=>{
									this.$message.success('创建成功')
									this.loading = false
									this.updated = true
								})
							})
						}
					}else{
						return false
					}
				})
			},
			clearValidate(){
				this.$nextTick(()=>{
					this.$refs.form.clearValidate()
				})				
			},
			resetFields(){
				this.form = { ...formInit }
				this.$refs.attachUpload.clear()
				this.$refs.attachList.clear()
				this.clearValidate()
			},
			openOrderSummaryDialog(){
				this.$refs.orderSummaryDialog.open({ noOrder:1 })
			},
			selectProject({ row }){
				let data = this.$commonJs.obj.copyByKey(row,[
					'project_id','project_name','project_no',
					'contract_no','no_order_area','project_area','contract_id'])
				this.assign(data)	
				this.$refs.orderSummaryDialog.close()
			},
			delAttach(row){
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        	orderApi.delAttach({order_id:this.form.id,attach_id:row.id}).then(res=>{
        		this.$refs.attachList.reload()
        		this.$message({
	            type: 'success',
	            message: '删除成功!'
	          });
        	})
        })
			},
			closeDialog(){
				if(this.updated){
					this.$emit('saved')
				}
			},
			selectColor(row){
				this.form.color = row.color_no
				this.$refs.colorListDialog.close()
			}
		}
	}
</script>