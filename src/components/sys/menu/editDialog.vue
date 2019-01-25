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
			<divider title='菜单信息'></divider>
			<el-form 
				:model='form' :rules='rules' 
				ref='form' label-width='85px' 
				size='mini' status-icon
				class='c-form-mini' >				
				<el-form-item label='上级菜单' prop='parent_id' :inline-message='true'>
					<el-input v-model='form.parent_menu' placeholder='点击选择，为空则为顶级节点' readonly @click.native='openSelectMenuDialog'>
						<i 
							style='cursor: pointer;'
							v-show='form.parent_id' 
							slot="suffix" 
							class="el-input__icon el-icon-close" 
							@click.stop='form.parent_menu="";form.parent_id=null'></i>
					</el-input>
				</el-form-item>				
				<el-form-item label='菜单名称' prop='title' >
					<el-input v-model.trim='form.title' placeholder=''>
					</el-input>
				</el-form-item>
				<el-form-item label='菜单路径' prop='path' >
					<el-input v-model.trim='form.path' placeholder=''>
					</el-input>
				</el-form-item>
				<el-form-item label='排序' prop='order' >
					<el-input v-model.number='form.order' style='width: 20%'>
					</el-input>
					<span style='font-size: 12px'>值越小排越前</span>
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
			<el-button :disabled='isDisable(data)' type='text' @click='selectType(data)'>选择</el-button>
		</template>
	</type-dialog>
</div>
</template>
<script>
	import api from '@/api/sys/menu'
	import typeDialog from './treeDialog'

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
					title:[{ required:true, message:'请填写菜单名称' }],
					path:[{ required:true, message:'请填写菜单路径' }],					
					order:[{ type:'number',message:'请输入数字' }]
				},
				updated:false
			}
		},
		computed:{
			isEdit(){
				return this.form.id? true:false
			},
			title(){
				let title = '菜单信息'
				if(this.isEdit){
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
					api.create().then(res=>{
						this.initData( res.data )
						this.loading = false
						resolve()
					})
				})
			},
			getForm(id){
				this.loading = true
				api.getForm(id).then(res=>{
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
				this.form.price = Number(this.form.price)
				return this
			},
			save(status=0){
				this.$refs.form.validate(valid=>{
					if(valid){
						this.form.action = status
						api.save(this.form).then(res=>{
							this.form.id = res.data.id
							this.loading = false
							this.$message.success('保存成功')
							this.updated = true
							if(this.form.action==1){
								this.show=false									
							}
						}).catch(res=>{
							this.loading = false
							console.log(res)
						})
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
			openSelectMenuDialog(){
				this.$refs.typeDialog.open().then(that=>{
					that.initData()
				})
			},
			selectType(data){
				this.form.parent_id = data.id
				this.form.parent_menu = data.title
				this.$refs.typeDialog.close()
			},
			isDisable(data){
				let parentIds = (data.parent_ids||'').split(',')
				return this.isEdit &&(data.id==this.form.id || parentIds.indexOf(this.form.id.toString())>=0)
			},
			getFieldList(field){
				return (keyword,callback)=>{
					api.getFieldList({ field,keyword }).then(res=>{
						callback( res.data )
					})
				}
			}
		}
	}
</script>