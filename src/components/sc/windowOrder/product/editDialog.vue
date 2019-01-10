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
					:model='form' :rules='rules' ref='form' label-width='80px' size='mini' class='c-form-mini' status-icon>
						<divider title='产品信息'></divider>		
						<el-row :gutter='10'>						
							<el-col :span='24'>
								<el-form-item label='品名' prop='name'>
									<el-input v-model='form.name' placeholder='可以从历史产品中提取产品信息'>
										<el-button slot="append" @click='openProductDialog'>提取</el-button>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span='12'>
								<el-form-item label='楼号' prop='floor_no'>
									<el-input v-model='form.floor_no' placeholder=''>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span='12'>
								<el-form-item label='窗号' prop='window_no'>
									<el-input v-model='form.window_no' placeholder=''>
									</el-input>
								</el-form-item>
							</el-col>						
							<el-col :span='12'>						
								<el-form-item label='宽（W）' prop='width' >
									<el-input v-model.number='form.width' placeholder=''>
										<span slot="suffix">mm</span>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span='12'>
								<el-form-item label='高（H）' prop='height' >
									<el-input v-model.number='form.height' placeholder=''>
										<span slot="suffix">mm</span>
									</el-input>
								</el-form-item>
							</el-col>						
							<el-col :span='12'>
								<el-form-item label='单位面积' prop='unit_area'>
									<el-input v-model.number='form.unit_area' placeholder='填写宽高值得出单位面积值'>
										<el-button slot="prepend" @click='computeUnitArea'>计算</el-button>
										<span slot="suffix">㎡</span>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span='12'>
								<el-form-item label='计算公式' >
									<span style='color:#909399;font-size: 12px'>（宽 x 高 - 洞宽 x 洞高）/ 1000000</span>
								</el-form-item>						
							</el-col>			
						</el-row>
						<el-row :gutter='12'>			
							<el-col :span='12'>						
								<el-form-item label='数量单位' prop='unit' >
									<el-autocomplete v-model='form.unit' style='width:100%' :fetch-suggestions="getFieldList('unit')"></el-autocomplete>
								</el-form-item>
							</el-col>
							<el-col :span='12'>
								<el-form-item label='数量' prop='amount' >
									<el-input v-model.number='form.amount' placeholder=''>
										<span slot="suffix">{{form.unit}}</span>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span='12'>
								<el-form-item label='总面积' prop='area' >
									<el-input v-model.number='form.area' placeholder=''>
										<el-button slot="prepend" @click='computeAreaTotal'>计算</el-button>
										<span slot="suffix">㎡</span>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span='12'>
								<el-form-item label='计算公式' >
									<span style='color:#909399;font-size: 12px'>单位面积 x 数量</span>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter='10'>
							<el-col :span='12'>						
								<el-form-item label='洞口宽' prop='hole_width' >
									<el-input v-model.number='form.hole_width' placeholder=''>
										<span slot="suffix">mm</span>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span='12'>
								<el-form-item label='洞口高' prop='hole_height' >
									<el-input v-model.number='form.hole_height' placeholder=''>
										<span slot="suffix">mm</span>
									</el-input>
								</el-form-item>
							</el-col>						
						</el-row>
						<divider title='其它信息'></divider>		
						<el-row :gutter='10'>
							<el-col :span='12'>
								<el-form-item label='产地' prop='origin_place'>
									<el-input v-model='form.origin_place' placeholder=''>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span='12'>
								<el-form-item label='型材' prop='steel'>
									<el-input v-model='form.steel' placeholder=''>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span='12'>
								<el-form-item label='五金' prop='hardware'>
									<el-input v-model='form.hardware' placeholder=''>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span='12'>
								<el-form-item label='玻璃' prop='glass'>
									<el-input v-model='form.glass' placeholder=''>
									</el-input>
								</el-form-item>
							</el-col>							
							<el-col :span='12'>
								<el-form-item label='技术要求' prop='requirement'>
									<el-input v-model='form.requirement' placeholder=''>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span='12'>
								<el-form-item label='图纸' prop='drawing'>
									<el-input v-model='form.drawing' placeholder=''>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span='24'>
								<el-form-item label='其他' prop='other'>
									<el-input v-model='form.other' placeholder=''>
									</el-input>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>				
				</div>
			<span slot="footer">
	    	<el-button type='primary' @click="save" size='mini' :loading='loading'>提交</el-button>	
		    <el-button @click="show=false" size='mini'>关 闭</el-button>
		  </span>
		</el-dialog>
		<product-list-dialog ref='productListDialog' :in-dialog='inDialog'>
			<el-table-column slot='column' width='60' align='center' label='操作' fixed='right'>
				<template slot-scope='scope'>
					<el-button size='mini' type='text' @click='selectProduct(scope)'>选择</el-button></template>
			</el-table-column>
		</product-list-dialog>
	</div>
</template>

<script>
	import productApi from '@/api/yyzx/orderProduct'
	import productListDialog from './listDialog'

	const formInit = {
		id:null,
		order_id:'',
		name:'',
		origin_place:'',
		steel:'',
		hardware:'',
		glass:'',
		requirement:'',
		drawing:'',
		other:'',
		width:0,
		height:0,
		hole_width:0,
		hole_height:0,
		amount:0,
		unit_area:0,
		area:0,
		unit:'樘'
	}
	export default {
		components:{ 
			productListDialog
		},
		props:{
			inDialog:{
				type:Boolean,
				default:false
			}
		},
		data(){			
			return {		
				resolve:null,	
				detailsList:[],
				changed:false,
				show:false,
				data:null,
				loading:false,
				form:{ ...formInit },
				rules:{						
					name:[{	required:true,message:'请填写产品名称' }],				
					width:[{ type:'number',message:'请输入数字' }],
					height:[{ type:'number',message:'请输入数字' }],		
					hole_width:[{ type:'number',message:'请输入数字' }],
					hole_height:[{ type:'number',message:'请输入数字' }],							
					amount:[
						{ required:true,message:'请填写数量' },
						{ type:'number',message:'请输入数字' },
						{ 
							validator:(rule,value,callback)=>{
								if(value<=0){
									callback(new Error('必须大于0'))
								}else{
									callback()
								}
							}
						}
					],
					unit_area:[
						{ required:true,message:'请填写产品单位面积' },
						{ type:'number',message:'请输入数字' },
						{ 
							validator:(rule,value,callback)=>{
								if(value<=0){
									callback(new Error('必须大于0'))
								}else{
									callback()
								}
							}
						}
					],
					area:[
						{ required:true,message:'请填写总面积' },
						{ type:'number',message:'请输入数字' },
						{ 
							validator:(rule,value,callback)=>{
								if(value<=0){
									callback(new Error('必须大于0'))
								}else{
									callback()
								}
							}
						}
					],
				}
			}
		},
		computed:{
			isEdit(){
				return this.form.id!=null
			},
			title(){
				return '订单产品'
			}			
		},
		mounted(){
		},
		methods:{
			openDialog(){
				this.changed = false
				this.loading = false
				this.$nextTick(()=>{
					if(this.resolve){
						this.resolve(this)
					}
				})
			},
			closeDialog(){
				if(this.changed){
					this.$emit('changed')
				}
				this.resetFields()
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
			//重置字段
			resetFields(){
				this.form = { ...formInit }
				this.clearValidate()
				return this
			},
			initData(data){
				this.assign(data)
				this.clearValidate()
			},
			assign(data){
				this.form = { ...this.form, ...data }
				this.form.width = Number(this.form.width)
				this.form.height = Number(this.form.height)
				this.form.area = Number(this.form.area)
				this.form.unit_area = Number(this.form.unit_area)
				this.form.hole_width = Number(this.form.hole_width)
				this.form.hole_height = Number(this.form.hole_height)
				return this
			},
			//保存
			save() {
				this.$refs.form.validate(vaild=>{
					if(vaild){
						this.loading = true
						if(this.isEdit){						
							productApi.update(this.form).then(res=>{
								this.$message.success('提交成功')
								this.loading = false
								this.changed = true
								this.show = false
							})
						}else{
							productApi.create(this.form).then(res=>{
								this.form.id = res.data
								this.$message.success('保存成功')
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
			openProductDialog(){
				this.$refs.productListDialog.open().then(that=>{
					that.initData()
				})
			},
			selectProduct({ row }){
				let data = this.$commonJs.obj.copyByKey(row,[
					'name','origin_place','steel','hardware','glass','requirement','drawing','other','floor_no','window_no'])
				this.assign(data)	
				this.$refs.productListDialog.close()
			},			
			add(){
				this.$refs.productDetailsDialog.resetFields().open()
			},
			computeMachiningArea(){
				let value = Number(this.form.machining_width/1000*this.form.machining_height/1000*this.form.amount)
				value = this.$commonJs.round(value)
				this.form.machining_area = value
			},
			computeHoleArea(){
				let value = Number(this.form.hole_width/1000*this.form.hole_height/1000*this.form.amount)
				value = this.$commonJs.round(value)
				this.form.hole_area = value
			},
			computeUnitArea(){
				let value = this.form.width*this.form.height 
				if(this.form.has_hole){
					let holeArea = this.form.hole_width*this.form.hole_height 
					value = value - holeArea
				}
				value = this.$commonJs.round(value/1000000,6)
				this.form.unit_area = value
			},
			computeAreaTotal(){
				let value = this.form.unit_area * this.form.amount
				value = this.$commonJs.round(value)
				this.form.area = value
			},
			getFieldList(field){
				return (keyword,callback)=>{
					productApi.getFieldList({ field,keyword }).then(res=>{
						callback(res.data)
					})
				}
			},
		}
	}
</script>