<template>
	<div>
		<el-dialog 
			:title='title'
			class='c-dialog-fixed'
			:visible.sync='show'
			:append-to-body='inDialog'
			@open='openDialog'
			width='80%'
			@close='closeDialog'>
			<div v-loading='loading'>
				<el-form 
					:model='form' :rules='rules' ref='form' class='c-form-mini' status-icon>
					<divider title='生产日志'></divider>
					<el-row :gutter='10'>
						<el-col :span='8'>
							<el-form-item label='生产日期' prop='produce_date'>
								<el-date-picker v-model='form.produce_date' value-format='yyyy-MM-dd' style='width:100%'></el-date-picker>
							</el-form-item>
						</el-col>
					</el-row>
					<el-form-item label='生产明细' prop='produce_list'>
							<product-list ref='productList' :params='productParams' hide-query hide-order-fields no-page>
								<template slot='column'>
									<el-table-column label='生产数量' width='100' fixed='right' >
										<template slot-scope='{row}'>
											<el-form-item style='margin-bottom: 0px' prop='produce_amount' :rules='getAmountRules(row)'>
												<el-tooltip placement="left" :content='"可生产最大数量："+row.no_produce_amount+" 樘"'>
													<el-input v-model.number='row.produce_amount'>
														<span slot="suffix">樘</span>
													</el-input>
												</el-tooltip>												
											</el-form-item>
										</template>
									</el-table-column>
									<el-table-column label='生产面积' width='180' fixed='right'>
										<template slot-scope='{row}'>
											<el-form-item style='margin-bottom: 0px' prop='produce_area' :rules='getAreaRules(row)'>
												<el-tooltip placement="right" :content='"可生产最大面积："+row.no_produce_area+"㎡"'>
													<el-input v-model.number='row.produce_area'>
														<el-button slot="prepend" @click='computeProduceArea(row)'>计算</el-button>
														<span slot="suffix">㎡</span>
													</el-input>
												</el-tooltip>
											</el-form-item>
										</template>
									</el-table-column>
									<el-table-column label='操作' align='center' width='60' fixed='right'>
										<template slot-scope='scope'>
											<el-button type='text' @click='delProduct(scope)'>移除</el-button>
										</template>
									</el-table-column>
								</template>
							</product-list>
						</el-form-item>
				</el-form>			
				<el-alert title='生产面积为0㎡的明细不会进行提交，不会创建对应的产品生产日志' type='warning'></el-alert>	
			</div>
			<span slot="footer">
		    <el-button type='primary' @click='submit' v-loading='loading'>提交</el-button>
		    <el-button @click="show=false">关 闭</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	import produceLogApi from '@/api/sc/produceLog'
	import orderListDialog from '@/components/yyzx/order/progress/listDialog'
	import logList from './list'
	import productSummaryList from '../product/summaryList'
	import productList from '../product/list'

	const formInit = {
		order_id:null,
		product_ids:'',
		produce_date:new Date(),
		produce_list:null
	}
	export default {
		components:{ 
			orderListDialog,
			logList,
			productSummaryList,
			productList
		},
		props:{
			inDialog:{
				type:Boolean,
				default:false
			}
		},
		data(){	
			return {
				tabName:'list',
				productList:[],
				changed:false,
				show:false,
				data:null,
				loading:false,
				form:{ ...formInit },
				rules:{					
					produce_date:[{	required:true,message:'请填写订单日期' }]
				}
			}
		},
		computed:{
			isEdit(){
				return this.form.id!=null
			},
			title(){
				return '生产日志录入'
			},
			productParams(){
				let order_id = this.form.order_id
				let product_ids = this.form.product_ids
				return {
					order_id,
					product_ids
				}
			}
		},
		mounted(){
		},
		methods:{			
			getAmountRules(row){
				let v = (rule,value,callback)=>{
					if(isNaN(row.produce_amount)){
						callback(new Error('请输入数字'))
					}else	if(Number(row.produce_amount) > Number(row.no_produce_amount)){
						callback(new Error('产品生产数量大于未生产数量'))
					}else{
						callback()
					}
				}
				return [				
					{ validator:v }
				]
			},
			getAreaRules(row){
				let v = (rule,value,callback)=>{
					if(isNaN(row.produce_area)){
						callback(new Error('请输入数字'))
					}else	if(Number(row.produce_area)<=0){
						callback(new Error('产品生产面积必须大于0'))
					}else if(Number(row.produce_area) > Number(row.no_produce_area)){
						callback(new Error('产品生产面积大于未生产面积'))
					}else{
						callback()
					}
				}
				return [					
					{ validator:v }
				]
			},
			openDialog(){
				this.changed = false
				this.loading = false
				this.tabName = 'list'
				this.$nextTick(()=>{
					this.clearValidate()
					this.$refs.productList.clear()
					this.$refs.productList.initData()
				})
			},
			closeDialog(){
				if(this.changed){
					this.$emit('changed')
				}
			},
			open(){
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
			},			
			//保存
			submit() {
				this.$refs.form.validate((vaild)=>{
					if(vaild){
						let produceList = []
						this.$refs.productList.list.forEach((item,i)=>{
							if(item.produce_area>0){
								produceList.push({
									product_id:item.id,
									order_id:item.order_id,
									produce_area:item.produce_area,
									produce_amount:item.produce_amount||0
								})
							}								
						})
						if(produceList.length==0){
							this.$message.error('至少填写1条生产面积大于0㎡的明细')
							return false
						}
						this.form.produce_list = produceList
						this.$confirm('确定提交生产日志吗？','提示',{
							type: 'warning'
						}).then(()=>{							
							this.loading = true
							produceLogApi.create(this.form).then(res=>{
								this.$message.success('提交成功')
								this.loading = false
								this.changed = true
								this.show = false
							})
						})												
					}else{
						return false
					}
				})
			},			
			editProduct(row){
				this.$refs.productFormDialog.assign(row).open()
			},
			delProduct({row,$index}){
				this.$refs.productList.list.splice($index,1)
			},
			computeProduceArea(row){
				let value = Number(row.unit_area*row.produce_amount)
				value = this.$commonJs.round(value)
				this.$set(row,'produce_area',value)
			},
		}
	}
</script>