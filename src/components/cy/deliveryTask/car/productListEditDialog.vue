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
					:model='form' ref='form' class='c-form-mini' status-icon>
					<divider title='安排装车产品'></divider>
					<div style='margin-bottom: 5px'>
						<el-tooltip content='对勾选的产品发货数量及面积填充最大值'>
							<el-button type='primary' @click='fillMax'>填充最大值</el-button>
						</el-tooltip>	
					</div>
					<product-list show-selection ref='productList' :params='productParams' hide-query hide-delivery-field no-page @selection-change='selectionChange' @loaded='productLoaded'>
						<template slot='column'>							
							<el-table-column label='安排装车数量' width='100' align='right' fixed='right' >
								<template slot-scope='{row}'>
									<el-form-item  v-if='row.checked' style='margin-bottom: 0px'  prop='car_amount' :rules='getAmountRules(row)'>
										<el-tooltip placement="left" :content='"可装车："+row.no_load_amount'>
											<el-input v-model.number='row.car_amount' :placeholder='row.no_load_amount' >
												<span slot="suffix">{{row.unit}}</span>
											</el-input>
										</el-tooltip>												
									</el-form-item>
								</template>
							</el-table-column>
							<el-table-column label='安排装车面积' width='180' fixed='right'>
								<template slot-scope='{row}'>
									<el-form-item v-if='row.checked' style='margin-bottom: 0px' prop='car_area' :rules='getAreaRules(row)'>
										<el-tooltip placement="right" :content='"可装车："+row.no_load_area+"㎡"'>
											<el-input v-model.number='row.car_area' :placeholder='row.no_load_area'>
												<el-button slot="prepend" @click='computeArea(row)'>计算</el-button>
												<span slot="suffix">㎡</span>
											</el-input>
										</el-tooltip>
									</el-form-item>
								</template>
							</el-table-column>							
						</template>
					</product-list>
				</el-form>
			</div>
			<span slot="footer">
		    <el-button type='primary' @click='submit' v-loading='loading'>提交</el-button>
		    <el-button @click="show=false">关 闭</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	import productList from './productList'
	import carProductApi from '@/api/cy/deliveryCarProduct'

	const formInit = {
		task_id:null,
		car_id:null
	}
	export default {
		components:{ 
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
				productList:[],
				updated:false,
				show:false,
				data:null,
				loading:false,
				form:{ ...formInit }
			}
		},
		computed:{
			isEdit(){
				return this.form.car_id==null
			},
			title(){
				return (this.isEdit?'编辑':'安排')+'装车产品'
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
					if(row.car_amount==null||row.car_amount==''){
						callback(new Error('请填写'))
					}else	if(isNaN(row.car_amount)){
						callback(new Error('请输入数字'))
					// }else	if(Number(row.car_amount) > Number(row.no_load_amount)){
					// 	callback(new Error('装车数量大于未安排装车数量'))
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
					if(isNaN(row.car_area)){
						callback(new Error('请输入数字'))
					// }else	if(Number(row.car_area)<=0){
					// 	callback(new Error('装车面积必须大于0'))
					// }else if(Number(row.car_area) > Number(row.no_load_area)){
					// 	callback(new Error('装车面积大于未安排装车面积'))
					}else{
						callback()
					}
				}
				return [					
					{ validator:v }
				]
			},
			closeDialog(){
				if(this.updated){
					this.$emit('updated')
				}
				this.updated = false
				this.loading = false
				this.resetFields()
				this.$refs.productList.clear()
			},
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
			initData(params={}){
				this.$refs.productList.initData(params)
				if(params.not_car_id){
					this.form.car_id = params.not_car_id
					this.form.task_id = params.task_id
				}				
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
			submit() {
				this.$refs.form.validate((vaild)=>{
					if(vaild){
						let productList = []
						this.$refs.productList.selectionList.forEach((item,i)=>{
							if(item.car_amount>0){
								productList.push({
									car_id:this.form.car_id,
									task_id:this.form.task_id,
									car_product_id:item.car_product_id,
									product_id:item.product_id,
									car_area:item.car_area,
									car_amount:item.car_amount||0
								})
							}								
						})
						if(productList.length==0){
							this.$message.error('至少选择一个产品！')
							return false
						}
						this.loading = true
						carProductApi.save(productList).then(res=>{
							this.$message.success('提交成功')
							this.loading = false
							this.updated = true
							this.show = false
						})												
					}else{
						return false
					}
				})
			},
			selectionChange(selection){
				this.$refs.productList.list.forEach(item=>{
					item.checked = false
				})
				selection.forEach(item=>{
					item.checked = true
				})
			},
			fillMax(){
				this.$refs.productList.selectionList.forEach(item=>{
					item.car_area=item.no_load_area
					item.car_amount=item.no_load_amount
				})
			},
			productLoaded(){
				this.$refs.productList.toggleAllSelection()
			},
			computeArea(row){
				let value = Number(Number(row.unit_area)*row.car_amount)
				value = this.$commonJs.round(value)
				this.$set(row,'car_area',value)
			},
		}
	}
</script>