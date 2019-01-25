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
			<divider title='网络节点信息'></divider>
			<el-form 
				:model='form' :rules='rules' 
				ref='form' label-width='85px' 
				size='mini' status-icon
				class='c-form-mini' >				
				<el-form-item label='上级节点' prop='parent_id' :inline-message='true'>
					<el-input v-model='form.parent_node' placeholder='点击选择，为空则为顶级节点' readonly @click.native='openSelectTypeDialog'>
						<i 
							style='cursor: pointer;'
							v-show='form.parent_id' 
							slot="suffix" 
							class="el-input__icon el-icon-close" 
							@click.stop='form.parent_node="";form.parent_id=null'></i>
					</el-input>
				</el-form-item>
				<el-form-item label='所属公司' prop='company_id' v-if='!form.parent_id'>
					<el-select 
						v-model='form.company_id' 
						placeholder='只有顶级节点才需要选择所属公司'
						filterable
						style='width: 100%'
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
				<el-form-item label='节点名称' prop='name' >
					<el-input v-model='form.name' placeholder=''>
					</el-input>
				</el-form-item>
				<el-form-item label='节点类型' prop='type' >
					<el-autocomplete v-model='form.type' clearable :fetch-suggestions="getFieldList('type')"></el-autocomplete>
				</el-form-item>
				<el-form-item label='排序' prop='order' >
					<el-input v-model.number='form.order' style='width: 20%'>
					</el-input>
					<span style='font-size: 12px'>值越小排越前</span>
				</el-form-item>
				<el-form-item label='设备型号' prop='model' >
					<el-input v-model='form.model' placeholder='节点设备的具体型号'>
					</el-input>
				</el-form-item>
				<el-form-item label='安装位置' prop='position' >
					<el-input v-model='form.position' placeholder='节点设备所安装的位置'>
					</el-input>
				</el-form-item>
				<el-form-item label='IP信息' prop='ip' >
					<el-input v-model='form.ip' placeholder='节点的ip信息'>
					</el-input>
				</el-form-item>
				<el-form-item label='管理地址' prop='admin_address' >
					<el-input v-model='form.admin_address' placeholder=''>
					</el-input>
				</el-form-item>
				<el-form-item label='管理账号' prop='account' >
					<el-input v-model='form.account' placeholder=''>
					</el-input>
				</el-form-item>
				<el-form-item label='账号密码' prop='password' >
					<el-input v-model='form.password' placeholder=''>
					</el-input>
				</el-form-item>
				<el-form-item label='备注' prop='remarks' >
					<el-input v-model='form.remarks' placeholder=''>
					</el-input>
				</el-form-item>
			</el-form>
		</div>
		<div slot="footer" v-loading='loading'>
	    <el-button type='primary'  @click='save(0)' :loading='loading'>保存</el-button>
	    <el-button @click="show=false">关 闭</el-button>
  	</div>
	</el-dialog>
	<type-dialog :in-dialog='inDialog' ref='typeDialog'>
		<template slot='right' slot-scope='{node,data}'>
			<el-button :disabled='isSelect(data)' type='text' @click='selectType(data)'>选择</el-button>
		</template>
	</type-dialog>
</div>
</template>
<script>
	import networkApi from '@/api/it/network'
	import typeDialog from './treeDialog'
	import companyApi from '@/api/sys/company'

	const formInit = {		
		model:'',		
		parent_id:null,
		id:null,
		input_status:-1	,
		order:99,
		remarks:''
	}
	export default {
		components:{ 
			typeDialog
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
					name:[{ required:true, message:'请填写节点名称' }],
					type:[{ required:true, message:'请填写节点类型' }],
					company_id:[{ required:true, message:'请选择节点所属公司' }],
					order:[{ type:'number',message:'请输入数字' }],
					amount:[
						{ required:true,message:'请填写资产数量'},
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
					table_name:'it_asset',
					table_id:null
				}
			}
		},
		computed:{
			isEdit(){
				return this.form.id? true:false
			},
			title(){
				let title = '网络节点信息'
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
			},
			create(){
				this.loading = true
				return new Promise((resolve,reject)=>{
					networkApi.create().then(res=>{
						this.initData( res.data )
						this.loading = false
						resolve()
					})
				})
			},
			getCompanyList(){
				this.companyLoading = true
				companyApi.getList({inCompany:1,noPage:1}).then(res=>{
					this.companyList = res.data.list
					this.companyLoading = false
				})
			},
			getForm(id){
				this.loading = true
				networkApi.getForm(id).then(res=>{
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
				networkApi.update(this.form).then(res=>{
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
			openSelectTypeDialog(){
				this.$refs.typeDialog.open().then(that=>{
					that.initData()
				})
			},
			selectType(data){
				this.form.parent_id = data.id
				this.form.parent_node = data.name
				this.$refs.typeDialog.close()
			},
			clearParentDep(){
				this.form.parent_id = null
				this.form.parent_node = ''
			},
			isSelect(data){
				let parentIds = (data.parent_ids||'').split(',')
				return data.id==this.form.id || parentIds.indexOf(this.form.id.toString())>=0
			},
			getFieldList(field){
				return (keyword,callback)=>{
					networkApi.getFieldList({ field,keyword }).then(res=>{
						callback(res.data)
					})
				}
			}
		}
	}
</script>