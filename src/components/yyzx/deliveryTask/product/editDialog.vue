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
			<divider title='产品信息'></divider>			
			<el-form 
				:model='form' :rules='rules' 
				ref='form' label-width='85px' 
				size='mini' status-icon
				class='c-form-mini'>
				<el-row :gutter='10'>
					<el-col :span='12'>
						<el-form-item label='序号' prop='index' >
							<el-input v-model.number='form.index' placeholder='产品会根据序号由低到高排序'>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='12'>
						<el-form-item label='类别' prop='type' >
							<el-autocomplete v-model='form.type' style='width:100%' :fetch-suggestions="getFieldList('type')"></el-autocomplete>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label='品名' prop='name' >
					<el-input v-model='form.name' placeholder=''>
					</el-input>
				</el-form-item>
				<el-form-item label='编号' prop='no' >
					<el-input v-model='form.no' placeholder=''>
						</el-input>
				</el-form-item>				
				<el-form-item label='规格/尺寸' prop='size' >
					<el-input v-model='form.size' placeholder=''>
					</el-input>
				</el-form-item>
				<el-row :gutter='10'>
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
				</el-row>
				<el-form-item label='洞口'>
					<el-tooltip content='单位面积是否还得除去洞口面积'>
						<el-switch 
							:active-value='1'
							:inactive-value='0'
						  v-model="form.has_hole">
					</el-switch>
					</el-tooltip>
				</el-form-item>
				<el-row :gutter='10' v-if='form.has_hole'>
					<el-col :span='12'>						
						<el-form-item label='洞宽（W）' prop='hole_width' >
							<el-input v-model.number='form.hole_width' placeholder=''>
								<span slot="suffix">mm</span>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='12'>
						<el-form-item label='洞高（H）' prop='hole_height' >
							<el-input v-model.number='form.hole_height' placeholder=''>
								<span slot="suffix">mm</span>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter='10'>
					<el-col :span='12'>
						<el-form-item label='单位面积'>
							<el-input v-model='form.unit_area' placeholder='填写宽高值得出单位面积值'>
								<el-button slot="prepend" @click='computeUnitArea()'>计算</el-button>
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
				<el-row :gutter='10'>
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
								<el-button slot="prepend" @click='computeAreaTotal()'>计算</el-button>
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
				<el-form-item label='备注' prop='remarks' >
					<el-input v-model='form.remarks' placeholder=''>
					</el-input>
				</el-form-item>
			</el-form>
		</div>
			<div slot="footer" v-loading='loading'>
		    <el-button type='primary' @click='save' :loading='loading'>提交</el-button>  
		    <el-button @click="show=false">关 闭</el-button>
	  	</div>
		</el-dialog>
	</div>
</template>
<script>
	import productApi from '@/api/yyzx/deliveryTaskProduct'
	import colorSampleApi from '@/api/xs/colorSample'
	import projectDialog from '@/components/yyzx/project/listDialog'
	import companyApi from '@/api/yyzx/company'
	import factoryApi from '@/api/yyzx/factory'

	const formInit = {
		id:null,
		index:'',
		name:'',
		size:'',
		area:0,
		amount:0,
		unit:'',
		unit_area:0,
		remarks:'',
		has_hole:0,
		width:0,
		height:0,
		hole_width:0,
		hole_height:0
	}
	export default {
		components:{ 
			projectDialog,
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
				show:false,
				loading:false,
				updated:false,
				data:{ },				
				form:{ ...formInit },
				rules:{
					index:[
						{ required:true, message:'请填写序号' },
						{ type:'number',message:'请输入数字' },
					],
					name:[{ required:true, message:'请填写产品名称' }],
					area:[
						{ type:'number',message:'请输入数字' },
						// { validator:(rule,value,callback)=>{
						// 		if(value<=0){
						// 			callback(new Error('必须大于0'))
						// 		}else{
						// 			callback()
						// 		}
						// 	}	
						// },
						{	required:true,message:'请填写面积' },
					],
					amount:[
						{ type:'number',message:'请输入数字' },
						// { validator:(rule,value,callback)=>{
						// 		if(value<=0){
						// 			callback(new Error('必须大于0'))
						// 		}else{
						// 			callback()
						// 		}
						// 	}	
						// },
						{	required:true,message:'请填写数量' },
					],
				},
				params:{
					no:null
				},
				updated:false
			}
		},
		computed:{
			isEdit(){
				return this.form.id? true:false
			},
			title(){
				let title = '发货产品信息'
				return title
			}
		},
		mounted(){
			
		},
		methods:{
			openDialog(){
				this.$nextTick(()=>{
					if(this.resolve){
						this.resolve(this)
					}
				})
			},
			open(){
				this.show = true
				return new Promise((resolve,reject)=>{
					this.resolve = resolve
				}) 
			},
			closeDialog(){				
				if(this.updated){
					this.$emit('updated')
				}
				this.loading = false
				this.resetFields()
			},
			create(){
				this.loading = true
				productApi.create().then(res=>{
					this.initData( res.data )
					this.loading = false
					this.updated = true
					this.$message.success('已保存到编辑列表中')
				})
			},
			getForm(id){
				this.loading = true
				productApi.getForm(id).then(res=>{
					this.initData(res.data)
					this.loading = false
				})
			},
			initData(data){
				this.assign(data)
				this.clearValidate()
			},
			assign(data){				
				this.form = { ...this.form, ...data }
				this.form.area = Number(this.form.area)
				this.form.unit_area = Number(this.form.unit_area)
				return this
			},			
			save(){
				this.$refs.form.validate(valid=>{
					if(valid){
						this.form.input_status = status
						this.loading = true
						if(this.isEdit){
							productApi.update(this.form).then(res=>{
								this.loading = false
								this.$message.success('提交成功')
								this.updated = true
								this.show=false
							})
						}else{
							productApi.create(this.form).then(res=>{
								this.loading = false
								this.$message.success('提交成功')
								this.updated = true
								this.show=false
							})
						}
					}else{
						return false
					}
				})
			},						
			clearValidate(){
				this.$nextTick(()=>{
					this.$refs.form && this.$refs.form.clearValidate()
				})
			},
			resetFields(){				
				this.updated = false
				this.form = { ...formInit }
				this.clearValidate()			
				return this
			},
			getFieldList(field){
				return (keyword,callback)=>{
					productApi.getFieldList({ field,keyword }).then(res=>{
						callback(res.data)
					})
				}
			},
			computeUnitArea(){
				let value = this.form.width*this.form.height 
				if(this.form.has_hole){
					let holeArea = this.form.hole_width*this.form.hole_height 
					value = value - holeArea
				}
				value = this.$commonJs.round(value/1000000)
				this.form.unit_area = value
			},
			computeAreaTotal(){
				let value = this.form.unit_area * this.form.amount
				value = this.$commonJs.round(value)
				this.form.area = value
			},
		}
	}
</script>