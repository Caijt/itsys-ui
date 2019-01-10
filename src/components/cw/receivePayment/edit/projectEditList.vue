<template>
 
		<div>
			<el-form 
				:model='form' ref='form' class='c-form-mini' status-icon>
				<div style='margin-bottom: 5px'>
					<el-button type='primary' @click='addProject'>添加项目</el-button>
					<el-tooltip content='对勾选的项目回款金额填充最大值'>
						<el-button @click='fillMax'>填充最大值</el-button>
					</el-tooltip>	
					<el-button type='danger' @click='remove'>移除</el-button>
				</div>
				<el-table 
		      :data='list' 
		      ref='tableList'
		      v-loading='loading'
		      border 
		      stripe
		      row-key='product_id'    
		      :max-height='maxHeight'      
		      show-summary
		      @selection-change='selectionChange'>
		      <el-table-column
		        fixed
		        type="selection"
		        align="center"
		        width="50">
			      </el-table-column>
	      <el-table-column prop='project_no' label='项目编号' width='110' show-overflow-tooltip />
	      <el-table-column prop='project_name' label='项目名称' min-width='150' show-overflow-tooltip />
	      <el-table-column prop='settlement_price_total' sortable align='right' label='项目结算货款' width='120'>
	        <template slot-scope='{row}'>
	          ￥ {{row.settlement_price_total}}
	        </template>
	      </el-table-column>
	      <el-table-column prop='cw_payment_price_total' sortable align='right' label='已回款金额' width='120'>
	        <template slot-scope='{row}'>
	          ￥ {{row.cw_payment_price_total}}
	        </template>
	      </el-table-column>
	      <el-table-column label='回款进度' width='120' align='center'>
	        <template slot-scope='{ row }'>           
	          <el-tooltip placement='left' :content='row.cw_payment_price_total+"㎡（已回款金额） / "+row.settlement_price_total+"㎡（项目结算货款）"'>
	            <el-progress 
	              text-inside 
	              :stroke-width='16' 
	              :status='$commonJs.getProgressPercentage(row.cw_payment_price_total/row.settlement_price_total)>=100?"success":""' 
	              :percentage="$commonJs.getProgressPercentage(row.cw_payment_price_total/row.settlement_price_total)"></el-progress>
	          </el-tooltip>
	        </template>
	      </el-table-column>
	      <el-table-column prop='arrears_price' fixed='right' sortable align='right' label='应收款' width='120'>
	        <template slot-scope='{row}'>
	          ￥ {{row.arrears_price}}
	        </template>
	      </el-table-column>
	      <el-table-column prop='payment_price' label='回款核销金额' width='150' fixed='right'>
					<template slot-scope='{row}'>
						<el-form-item style='margin-bottom: 0px' prop='payment_price' :rules='getPriceRules(row)'>
							<el-input v-model.number='row.payment_price' :placeholder='row.arrears_price'>
								<span slot="prefix">￥</span>
							</el-input>
						</el-form-item>
					</template>
				</el-table-column>	

	      <!-- slot[column] -->
	      <slot name='column'></slot>
	      <!--/ slot[column]-->
	    </el-table>
			</el-form>
			<project-list-dialog :in-dialog='inDialog' ref='projectListDialog'>
				<el-table-column slot='column' fixed='right' align='center' label='操作' width='60'>
					<template slot-scope='{row}'>
						<el-button type='text' @click='selectProject(row)' :disabled='isSelected(row)'>添加</el-button>
					</template>
				</el-table-column>
			</project-list-dialog>
	</div>
</template>

<script>
	import paymentProjectApi from '@/api/cw/receivePaymentProject'
	import projectListDialog from '@/components/cw/arrears/projectListDialog'

	const formInit = {
		task_id:null,
		car_id:null
	}
	export default {
		components:{ 
			projectListDialog
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
			}
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
			getPriceRules(row){
				let v = (rule,value,callback)=>{
					if(isNaN(row.payment_price)){
						callback(new Error('请输入数字'))
					}else	if(Number(row.payment_price)<=0){
						callback(new Error('回款金额必须大于0'))
					}else if(Number(row.payment_price) > Number(row.arrears_price)){
						callback(new Error('回款金额大于项目应收款'))
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
									car_area:item.car_area,
									car_amount:item.car_amount||0
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
					item.payment_price=item.arrears_price
				})
			},
			addProject(){
				if(!this.paymentForm.customer_id){
					this.$message.error('请先选择回款客户！')
					return false
				}
				this.$refs.projectListDialog.open().then(that=>{
					that.$refs.list.initData({
						customer_id:this.paymentForm.customer_id
					})
				})
			},
			isSelected(row){
				return this.list.some(item=>{
					return item.project_id == row.id
				})
			},
			selectProject(row){				
				let data = {
					payment_project_id:null,
					project_id:row.id,
					customer_id:row.customer_id,
					project_name:row.name,
					project_no:row.no,
					settlement_price_total:row.settlement_price_total,
					cw_payment_price_total:row.cw_payment_price_total,
					arrears_price:row.arrears_price,
					payment_price:''
				}
				this.list.push(data)
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