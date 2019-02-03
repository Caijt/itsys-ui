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
			<divider title='部门信息'></divider>
			<el-form 
				:model='form' :rules='rules' 
				ref='form' label-width='85px' 
				size='mini' status-icon
				class='c-form-mini' >
				<el-form-item label='所属部门' prop='dep_id' >
					<el-input v-model='form.dep_name' placeholder='点击选择' readonly @click.native='openSelectDepDialog'>
						<i 
							style='cursor: pointer;'
							v-show='form.dep_id' 
							slot="suffix" 
							class="el-input__icon el-icon-close" 
							@click.stop='form.dep_name="";form.dep_id=null'></i>
					</el-input>
				</el-form-item>
				<el-form-item label='员工姓名' prop='name' >
					<el-input v-model='form.name' placeholder='' style='width:30%'>
					</el-input>
				</el-form-item>
				
				<el-form-item label='性别' prop='sex' >
					<el-radio-group v-model='form.sex'>
						<el-radio :label='0'>男</el-radio>
						<el-radio :label='1'>女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label='工号' prop='no' >
					<el-input v-model='form.no' placeholder='' style='width:30%'>
					</el-input>
				</el-form-item>
				<el-form-item label='邮箱' prop='mail' >
					<el-input v-model='form.mail' placeholder='' style='width:30%'>
					</el-input>
				</el-form-item>
				<el-form-item label='状态' prop='is_disabled' >
					<el-radio-group v-model='form.is_disabled'>
						<el-radio :label='0'>在职</el-radio>
						<el-radio :label='1'>离职</el-radio>
					</el-radio-group>
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
	<dep-dialog :in-dialog='inDialog' ref='depDialog' show-select @select='selectDep' />
</div>
</template>
<script>
	import employeeApi from '@/api/hr/employee'
	import depDialog from '@/components/hr/dep/treeDialog'

	const formInit = {		
		id:null,
		input_status:-1	,
		order:99,
		remarks:'',
		dep_name:'',
		dep_id:null,
		sex:0,
		mail:''
	}
	export default {
		components:{ 
			depDialog
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
					name:[{ required:true, message:'请填写部门名称' }],
					dep_id:[{ required:true, message:'请选择部门' }],
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
				let title = '员工信息'
				if(this.form.input_status>=0){
					title += ' [ 修改 ]'
				}else{
					title += ' [ 新增 ]'
				}
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
					this.$emit('updated',this.form)
				}
				this.resetFields()
			},
			create(){
				this.loading = true
				return new Promise((resolve,reject)=>{
					employeeApi.create().then(res=>{
						this.initData( res.data )
						this.loading = false
						resolve()
					})
				})
			},
			getForm(id){
				this.loading = true
				employeeApi.getForm(id).then(res=>{
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
				this.form.sex = Number(this.form.sex)
				this.form.is_disabled = Number(this.form.is_disabled)
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
				employeeApi.update(this.form).then(res=>{
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