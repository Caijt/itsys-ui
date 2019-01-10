<template>
	<el-dialog 
		:title='title'
		class='c-dialog-fixed'
		:visible.sync='show'
		:append-to-body='inDialog'
		@open='openDialog'>
		<div>
		<el-form 
			:model='form' :rules='rules' ref='form' label-width='85px' 
			size='mini' status-icon class='c-form-mini'>
			<divider title='回款信息'></divider>
			<el-alert
		    title="默认情况下回款客户与项目客户是一致，如有特殊情况，请手动选择其它客户，回款记录可以先不选择项目进行创建"
		    type="warning"
		    :closable="false" style='margin-bottom:10px'>
		  </el-alert>
			<el-form-item label='回款客户' prop='customer_id'>
				<el-select v-model='form.customer_id' filterable style='width:100%' clearable :loading='customerLoading'>
					<el-option 
						v-for='item in customerList' 
						:key='item.id'
						v-show='!item.is_disabled'
						:label='item.name'
						:value='item.id'>
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label='收款单位' prop='company_id'>
				<el-select v-model='form.company_id' filterable style='width:100%' clearable :loading='companyLoading'>
					<el-option 
						v-for='item in companyList' 
						:key='item.id'
						v-show='!item.is_disabled'
						:label='item.name'
						:value='item.id'>
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label='回款日期' prop='payment_date'>
				<el-date-picker 
					v-model='form.payment_date' 
					value-format='yyyy-MM-dd' 
					style='width: 100%'
					 :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item label='回款币种' prop='payment_currency'>
				<el-select v-model="form.payment_currency" placeholder="请选择" style='width:100%'>
		      <el-option label="人民币" value="CNY"></el-option>
		      <el-option label="美元" value="USD"></el-option>
		      <el-option label="欧元" value="EUR"></el-option>
		      <el-option label="港币" value="HKD"></el-option>
		      <el-option label="英镑" value="GBP"></el-option>
		      <el-option label="日元" value="JPY"></el-option>
		      <el-option label="韩元" value="KRW"></el-option>
		      <el-option label="澳元" value="AUD"></el-option>
		    </el-select>
			</el-form-item>
			<el-form-item label='外币金额' prop='currency_price' v-if='form.payment_currency!=="CNY"'>
				<el-input v-model.number='form.currency_price' >
					<span slot='suffix'>{{form.payment_currency}}</span>
				</el-input>
			</el-form-item>
			<el-form-item label='回款金额' prop='payment_price'>
				<el-input v-model.number='form.payment_price' >
					<span slot='prefix'>￥</span>
					<span slot='suffix'>人民币</span>
				</el-input>
			</el-form-item>
			<el-form-item label='回款形式' prop='payment_method'>
			  <el-select v-model='form.payment_method' style='width: 100%'>
			  	<el-option v-for='m in payment_method' :value='m' :key='m'></el-option>
			  </el-select>
			</el-form-item>
			<el-form-item label='备注' prop='remarks'>
			  <el-input v-model='form.remarks' ></el-input>
			</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</div>
		<span slot="footer">
	    <el-button @click="save" type="primary"  size='small' :loading='loading'>{{ buttonText }}</el-button>
	    <el-button @click="show=false" size='small'>关 闭</el-button>
	  </span>
	</el-dialog>
</template>
<script>
	import companyApi from '@/api/yyzx/company'
	import customerApi from '@/api/yyzx/customer'
	import receivePaymentRecordApi from '@/api/cw/receivePaymentRecord'

	const formInit = {
		project_id:null,//项目id		
		
		id:null,
		customer_id:'',
		company_id:'',
		payment_date:'',
		payment_price:0,
		payment_currency:'CNY',
		payment_method:'',
		currency_price:'',
		remarks:''
	}
	export default {
		props:{
			inDialog:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return {
				show:false,
				loading:false,
				data:{},
				pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
        },
				form:{...formInit},
				companyLoading:true,
				companyList:[],
				customerLoading:true,
				customerList:[],
				rules:{
					company_id:[{ required:true, message:'请选择收款单位' }],
					customer_id:[{ required:true, message:'请选择回款客户' }],
					payment_date:[{	required:true,message:'请填写回款日期' }],
					currency_price:[
					{	required:true,message:'请填写外币金额' },
					{ type:'number',message:'请输入数字' },
					{ 
						validator:(rule,value,callback)=>{
							if(value<=0){
								callback(new Error('金额必须大于0'))
							}else{
								callback()
							}
						}
					}],
					payment_price:[
					{	required:true,message:'请填写回款金额' },
					{ type:'number',message:'请输入数字' },
					{ 
						validator:(rule,value,callback)=>{
							if(value<=0){
								callback(new Error('回款金额必须大于0'))
							}else{
								callback()
							}
						}
					}],
				},
				payment_method:[
					'电汇','现金','银承','冲账','商承'
				]
			}
		},
		computed:{
			isEdit(){
				return this.form.id!=null
			},
			title(){
				return this.isEdit?'编辑回款记录':'创建回款记录'
			},
			buttonText(){
				return this.isEdit?'更 新':'创 建'
			}
		},
		mounted(){
			this.getCompanyList()
			this.getCustomerList()
		},
		methods:{
			openDialog(){
				this.loading = false
				this.$nextTick(()=>{
					this.resetFields()
					this.assign(this.data)
				})
			},
			open(data={}){
				this.data = data	
				this.show = true
			},
			//获取收款公司列表
			getCompanyList(){
				this.companyLoading = true
				companyApi.getEnumList().then(res=>{
					this.companyList = res.data
					this.companyLoading = false
				})
			},
			//获取回款客户列表
			getCustomerList(){
				this.customerLoading = true
				customerApi.getEnumList().then(res=>{
					this.customerList = res.data
					this.customerLoading = false
				})
			},
			assign(data){
				this.form = {...this.form,...data}
				this.form.payment_price = Number(this.form.payment_price)
				this.form.currency_price = Number(this.form.currency_price)
			},
			//保存
			save() {				
				this.$refs.form.validate(vaild=>{
					if(vaild){
						if(this.isEdit){						
							receivePaymentRecordApi.update(this.form).then(res=>{
								this.$message.success('更新成功')
								this.$emit('updated')
								this.$emit('saved')
								this.show = false
							})
						}else{						
							receivePaymentRecordApi.create(this.form).then(res=>{
								this.$message.success('创建成功')
								this.$emit('created')
								this.$emit('saved')
								this.show = false
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
				this.clearValidate()
			},
			querySearch(queryString,cb){
				console.log('12')
				cb(this.payment_method)
			}
		}
	}
</script>