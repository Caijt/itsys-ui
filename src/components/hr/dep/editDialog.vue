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
				<el-form-item label='上级部门' prop='parent_id'>
					<el-input v-model='form.parent_dep' placeholder='点击选择，为空则为顶级部门' readonly @click.native='openSelectDepDialog'>
						<i 
							style='cursor: pointer;'
							v-show='form.parent_id' 
							slot="suffix" 
							class="el-input__icon el-icon-close" 
							@click.stop='form.parent_dep="";form.parent_id=null'></i>
					</el-input>
				</el-form-item>
				<el-form-item label='部门名称' prop='name' >
					<el-input v-model='form.name' placeholder=''>
					</el-input>
				</el-form-item>
				<el-form-item label='排序' prop='order' >
					<el-input v-model.number='form.order' style='width: 30%'>
					</el-input>
					<span style='font-size: 12px'>值越小排越前</span>
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
	<dep-dialog :in-dialog='inDialog' ref='depDialog'>
		<template slot='right' slot-scope='{node,data}'>
			<el-button :disabled='isSelect(data)' type='text' @click='selectDep(data)'>选择</el-button>
		</template>
	</dep-dialog>
</div>
</template>
<script>
	import depApi from '@/api/hr/dep'
	import depDialog from './treeDialog'

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
					price:[{ type:'number',message:'请输入数字' }],
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
				let title = '部门信息'
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
					depApi.create().then(res=>{
						this.initData( res.data )
						this.loading = false
						resolve()
					})
				})
			},
			getForm(id){
				this.loading = true
				depApi.getForm(id).then(res=>{
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
				depApi.update(this.form).then(res=>{
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
				this.form.parent_id = data.id
				this.form.parent_dep = data.name
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