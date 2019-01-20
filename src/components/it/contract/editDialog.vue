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
			<divider title='合同信息'></divider>
			<el-form 
				:model='form' :rules='rules' 
				ref='form' label-width='85px' 
				size='mini' status-icon
				class='c-form-mini' >
				<el-form-item label='所属公司' prop='company_id'>
					<el-select 
						v-model='form.company_id' 
						placeholder='选择合同所属公司'
						filterable
						style='width: 80%'
						:loading='companyLoading'>
						<el-option
							v-for='item in companyList'
							:key='item.id'
							:label='item.name'
							:value='item.id'
							v-show='item.is_disabled?false:true'
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label='合同编号' prop='no' >
					<el-input v-model='form.no' placeholder='' style='width:30%'>
					</el-input>
				</el-form-item>
				<el-form-item label='合同名称' prop='name' >
					<el-input v-model='form.name' placeholder=''>
					</el-input>
				</el-form-item>
				<el-form-item label='合同金额' prop='price' >
					<el-input v-model.number='form.price' style='width: 30%'>
						<span slot="prefix">￥</span>
					</el-input>
				</el-form-item>
				<el-form-item label='签订日期' prop='sign_date'>
					<el-date-picker 
						v-model='form.sign_date' 
						value-format='yyyy-MM-dd' 
						style='width: 30%' />
				</el-form-item>
				<el-form-item label='生效日期' prop='begin_date'>
					<el-date-picker 
						v-model='form.begin_date' 
						value-format='yyyy-MM-dd' 
						style='width: 30%' />
				</el-form-item>
				<el-form-item label='失效日期' prop='end_date'>
					<el-date-picker 
						v-model='form.end_date' 
						value-format='yyyy-MM-dd' 
						style='width: 30%' />
				</el-form-item>
				<el-form-item label='失效提醒' prop='is_remind'>
					<el-switch 
						v-model='form.is_remind' 
						:active-value="1"
    				:inactive-value="0"
					/>
					<span style='font-size: 12px'>在合同失效日期前一个月内在IT中心主页上进行提醒显示</span>
				</el-form-item>
				<el-form-item label='备注' prop='remarks' >
					<el-input v-model='form.remarks' placeholder=''>
					</el-input>
				</el-form-item>
				<el-form-item label='附件' prop='remarks'>
					<attach-upload ref='attachUpload' :params='attachParams' @uploaded='uploaded'></attach-upload>
					<attach-list ref='attachList' show-del @del='updated=true'></attach-list>
				</el-form-item>
			</el-form>
		</div>
		<div slot="footer" v-loading='loading'>
	    <el-button type='primary'  @click='save(0)' :loading='loading'>保存</el-button>
	    <el-button @click="show=false">关 闭</el-button>
  	</div>
	</el-dialog>
</div>
</template>
<script>
	import contractApi from '@/api/it/contract'
	import companyApi from '@/api/yyzx/company'
	import attachUpload from '@/components/common/attach/upload'
	import attachList from '@/components/common/attach/textList'

	const formInit = {		
		id:null,
		input_status:-1,
		company_id:null,
		no:'',
		name:'',
		price:0,
		sign_date:new Date(),
		begin_date:new Date(),
		end_date:'',
		is_remind:0,
		remarks:''		
	}
	export default {
		components:{ 
			attachUpload,
			attachList
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
					no:[{ required:true, message:'请填写合同编号' }],
					name:[{ required:true, message:'请填写合同名称' }],
					company_id:[{ required:true, message:'请选择所属公司' }],
					sign_date:[{ required:true, message:'请填写合同签订日期' }],
					begin_date:[{ required:true, message:'请填写合同生效日期' }],
					price:[{ type:'number',message:'请输入数字' }],
					price2:[
						{ required:true,message:'请填写资产数量' },
						{ validator:this.$commonJs.validateRules.et0}
					]
				},
				params:{
					no:null
				},
				updated:false,
				companyList:[],
				companyLoading:false,
				attachParams:{
					table_name:'it_contract',
					table_id:null
				}
			}
		},
		computed:{
			isEdit(){
				return this.form.id? true:false
			},
			title(){
				let title = '合同信息'
				if(this.form.input_status>=0){
					title += ' [ 修改 ]'
				}else{
					title += ' [ 新增 ]'
				}
				return title
			}
		},
		mounted(){
			this.getCompanyList()
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
					this.$emit('updated',this.form)
				}
				this.resetFields()
				this.$refs.attachUpload.clear()
				this.$refs.attachList.clear()
			},
			getCompanyList(){
				this.companyLoading = true
				companyApi.getEnumList().then(res=>{
					this.companyList = res.data
					this.companyLoading = false
				})
			},
			create(){
				this.loading = true
				return new Promise((resolve,reject)=>{
					contractApi.create().then(res=>{
						this.initData( res.data )
						this.loading = false
						resolve()
					})
				})
			},
			getForm(id){
				this.loading = true
				contractApi.getForm(id).then(res=>{
					this.initData(res.data)
					this.loading = false
				})
			},
			initData(data){
				this.assign(data)
				this.attachParams.table_id = data.id
				if(data.attach_ids){
					this.$refs.attachList.initData({ attach_ids:data.attach_ids})
				}
				this.clearValidate()
			},
			assign(data){
				this.form = { ...this.form, ...data }
				this.form.price = Number(this.form.price)
				return this
			},
			save(status=0){
				this.$refs.form.validate(valid=>{
					if(valid){
						this.form.action = status
						this.update()
					}else{
						return false
					}
				})
			},
			update(){
				this.loading = true
				let messageText = this.form.action?'提交成功':'保存成功'
				contractApi.update(this.form).then(res=>{
					this.form.input_status = res.data.input_status
					this.loading = false
					this.$message.success(messageText)
					this.updated = true
					if(this.form.action==1){
						this.show=false									
					}
				}).catch(res=>{
					this.loading = false
					console.log(res)
				})
			},
			uploaded(res){
				this.updated = true
				this.$refs.attachList.push(res)
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
			openSelectDepDialog(){
				this.$refs.depDialog.open().then(that=>{
					that.initData()
				})
			},
			selectDep(data){
				this.form.dep_id = data.id
				this.form.dep_name = data.name
				this.$refs.depDialog.close()
			},
			clearParentDep(){
				this.form.parent_id = null
				this.form.parent_dep = ''
			},
			isSelect(data){
				let parentIds = (data.parent_ids||'').split(',')
				return data.id==this.form.id || parentIds.indexOf(this.form.id.toString())>=0
			}
		}
	}
</script>