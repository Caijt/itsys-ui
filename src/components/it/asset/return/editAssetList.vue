<template> 
	<div>
		<el-form 
			:model='form' ref='form' class='c-form-mini' status-icon>
			<div style='margin-bottom: 5px'>
				<el-button-group>
					<el-button type='primary' @click='openSelectAssetDiaog'>选择资产</el-button>
					<el-tooltip content='对勾选的资产填充最大交还数量'>
						<el-button @click='fillMax'>最大值</el-button>
					</el-tooltip>	
					<el-button @click='remove'>删除选中</el-button>
				</el-button-group>
			</div>
			<el-table 
	      :data='list' 
	      ref='tableList'
	      v-loading='loading'
	      border 
	      stripe
	      row-key='detail_id'    
	      :max-height='maxHeight'
	      @selection-change='selectionChange'>
	      <el-table-column
	        fixed
	        type="selection"
	        align="center"
	        width="35">
		      </el-table-column>
	      <el-table-column prop='asset_no' label='资产编号' width='110' show-overflow-tooltip />
	      <el-table-column prop='asset_model' label='资产型号' min-width='150' show-overflow-tooltip />
	      <el-table-column prop='asset_type_name' label='资产类型' width='100' show-overflow-tooltip />
	      <el-table-column prop='use_date' sortable label='领用日期' width='100' />
	      <el-table-column prop='dep_name' sortable label='领用部门' width='100' />
	      <el-table-column prop='employee_name' sortable label='领用人' width='100' />
	      <el-table-column prop='use_place' sortable label='使用地点' width='120' show-overflow-tooltip/>
	      <el-table-column prop='use_remarks' sortable label='领用备注' width='120' show-overflow-tooltip/>
	      <el-table-column prop='use_amount' fixed='right' align='right' sortable label='领用数量' width='100'>
	      </el-table-column>
	      <el-table-column prop='payment_price' label='交还数量' width='100' fixed='right'>
					<template slot-scope='{row}'>
						<el-form-item style='margin-bottom: 0px' prop='return_amount' :rules='getAmountRules(row)'>
							<el-input v-model.number='row.return_amount' :placeholder='row.used'>
							</el-input>
						</el-form-item>
					</template>
				</el-table-column>
	      <!-- slot[column] -->
	      <slot name='column'></slot>
	      <!--/ slot[column]-->
	    </el-table>
			</el-form>
			<asset-use-status-list-dialog show-selection :in-dialog='inDialog' ref='assetUseStatusListDialog'>
				<div slot='footer' >
					<el-button type='primary' @click='selectAsset'>选择</el-button>
				</div>
			</asset-use-status-list-dialog>
			<contract-info :in-dialog='inDialog' ref='contractInfo' />
	</div>
</template>

<script>
	import paymentProjectApi from '@/api/cw/receivePaymentProject'
	import assetUseStatusListDialog from '@/components/it/asset/useStatus/listDialog'
	import contractInfo from '@/components/yyzx/contract/info'

	const formInit = {
		task_id:null,
		car_id:null
	}
	export default {
		components:{ 
			assetUseStatusListDialog,
			contractInfo
		},
		props:{
			paymentForm:{
      	
    	},
			maxHeight:{
      	default:350
    	},
			inDialog:{
				type:Boolean,
				default:false
			}
		},
		data(){	
			return {
				projectList:[],
				updated:false,
				show:false,
				data:null,
				loading:false,
				form:{ ...formInit },
				inited:false,
	      loading: false,      
	      list:[],
	      dataTotal:0,  
	      initParams:{},
	      queryShowMore:false,
	      summaryData:{},
	      removeList:[],
	      selectionList:[],
	      //查询条件字段
	      queryParams:{
	        
	      },
	      //数据请求的参数
	      requestParams:{

	      }     
			}
		},
		computed:{
			isEdit(){
				return this.form.car_id==null
			},
			productParams(){
				let order_id = this.form.order_id
				let product_ids = this.form.product_ids
				return {
					order_id,
					product_ids
				}
			},

		},
		mounted(){
		},
		methods:{		
			getSummaryData({columns,data}){
	      let sum = []
	      columns.forEach((column,i)=>{
	        if(i==0){
	          sum[i]='合计'
	        }else{
	          sum[i] = this.summaryData[column.property]
	        }       
	      })
	      return sum
	    },
	    selectionChange(selection){
	      this.selectionList = selection
	    },
	    clear(){
	    	this.list = []
	    	this.removeList = []
	    },
	    reload(){
	    	this.getData()
	    	this.removeList = []
	    },
			//获取数据
	    getData() {
	      this.loading=true
	      paymentProjectApi.getList({...this.requestParams,...this.initParams}).then(res=>{
	        this.list = res.data.list
	        this.dataTotal = res.data.total
	        this.summaryData = res.data.summary ||{}
	        this.loading = false
	        this.$emit('loaded',{ 
	          total:res.data.total,
	          list:res.data.list,
	          params:{...this.queryParams} 
	        })
	      })
	    },
			getAmountRules(row){
				let v = (rule,value,callback)=>{
					if(isNaN(row.return_amount)){
						callback(new Error('请输入数字'))
					}else	if(Number(row.return_amount)<=0){
						callback(new Error('交还数量必须大于0'))
					}else if(Number(row.return_amount) > Number(row.use_amount)){
						callback(new Error('交还数量大于领用数量'))
					}else{
						callback()
					}
				}
				return [					
					{ validator:v }
				]
			},
			initData(params={}){
	      this.inited = true
	      this.initParams = {...params}
	      this.getData()
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
			validate(){
				let v = null
				this.$refs.form.validate((vaild)=>{
					v =  vaild
				})
				return v
			},
			submit() {
				this.$refs.form.validate((vaild)=>{
					if(vaild){
						let projectList = []
						this.list.forEach((item,i)=>{
							if(item.car_area>0){
								projectList.push({
									car_id:this.form.car_id,
									task_id:this.form.task_id,
									car_product_id:item.car_product_id,
									product_id:item.product_id,
									amount:item.use_amount
								})
							}								
						})
						if(projectList.length==0){
							this.$message.error('至少选择一个项目！')
							return false
						}
						this.loading = true
						paymentProjectApi.save(projectList).then(res=>{
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
			fillMax(){
				this.selectionList.forEach(item=>{
					item.return_amount = item.use_amount
				})
			},
			openSelectAssetDiaog(){
				let selectedIds = this.list.map(item=>{
					return item.detail_id
				})
				this.$refs.assetUseStatusListDialog.open().then(that=>{
					that.$refs.list.initData({
						not_detail_ids:selectedIds.join(',')
					})
				})
			},
			selectAsset(row){
				let selectionList = this.$refs.assetUseStatusListDialog.$refs.list.selectionList
				if(selectionList.length==0){
					this.$message.warning('未选择资产')
					return false
				}
				let toPushList = selectionList.map(item=>{
					return {
						detail_id:item.detail_id,
						asset_id:item.asset_id,
						asset_no:item.asset_no,
						asset_model:item.asset_model,
						asset_type_name:item.asset_type_name,
						use_date:item.use_date,
						use_amount:item.use_amount,
						use_place:item.use_place,
						use_remarks:item.use_remarks,
						return_amount:item.use_amount,
						dep_name:item.dep_name,
						employee_name:item.employee_name,
						dep_id:item.dep_id,
						employee_id:item.employee_id
					}
				})
				this.list.push(...toPushList)
				this.$refs.assetUseStatusListDialog.close()				
			},
			remove(){
				this.selectionList.forEach(item=>{
					this.list.forEach((l,i)=>{
						if(l===item){
							if(item.payment_project_id){
								this.removeList.push(item)
							}
							this.list.splice(i,1)
						}
					})
				})
				this.$refs.tableList.clearSelection()
			}
		}
	}
</script>