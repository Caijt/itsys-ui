<template>
	<div>
  	<el-row>
			<el-col :span='4'>
				<el-button type='primary' size='small' @click='create'>创建客户</el-button>
			</el-col>
			<el-col :span='20' style='text-align: right'>
				<el-form ref='formQuery' :model='queryParams' inline size='small'>
					<el-form-item prop='name'>
						<el-input v-model='queryParams.name' placeholder='客户名称' clearable></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type='primary' @click='query'>查询</el-button>
						<el-button @click='resetQuery'>重置</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
		<el-table 
  		:data='list' 
  		ref='tableList'
  		v-loading='loading' stripe
  		max-height='500'>
			<el-table-column prop='name' label='客户名称' min-width='200px'></el-table-column>
			<el-table-column prop='type' label='客户类别' width='100px'></el-table-column>
			<el-table-column prop='is_disabled' label='状态' width='80' align='center'>
				<template slot-scope='{row}'>
					<el-tag size='small' type='success' v-if='row.is_disabled==0'>启用</el-tag>
					<el-tag size='small' type='info'  v-else>禁用</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop='create_time' label='创建时间' align='center' width='140'>
				<template slot-scope='scope'>
					<span>{{ scope.row.create_time | formatDate}}</span>
				</template>
			</el-table-column>
			<el-table-column prop='update_user_name' label='更新人员' width='80'></el-table-column>
			<el-table-column prop='update_time' label='更新时间' align='center' width='140'>
				<template slot-scope='scope'>
					<span>{{ scope.row.update_time | formatDate}}</span>
				</template>
			</el-table-column>
			<el-table-column label='操作' fixed='right' align='center' width='120'>
				<template slot-scope='scope'>
					<el-button  size='mini' type='text' @click='edit(scope)'>修改</el-button>
					<el-tooltip content='如果客户已关联其它数据（如项目），将无法删除！'>
						<el-button  size='mini' type='text' @click='del(scope)'>删除</el-button>
					</el-tooltip>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination style='margin-top: 10px'
      :page-sizes = "[10, 20, 50, 100]"
      :page-size= "requestParams.pageSize"
      :current-page.sync = "requestParams.currentPage"
      layout="total, sizes, prev, pager, next, jumper"
      :total="dataTotal"
      @size-change='sizeChange'
      @current-change='getData'
      >
    </el-pagination>
    <el-dialog 
    	:title='isFormEdit?"客户修改":"创建客户"' 
    	:visible.sync='dialogShow' 
    	@open='openDialog'
    >
			<el-form :model='form' size='small' :rules='formRules' ref='form' label-width='80px' status-icon>
				<el-row :gutter='20'>
					<el-form-item label='客户名称' prop='name'>
						<el-input v-model='form.name' ></el-input>
					</el-form-item>
					<el-form-item label='客户类别' prop='type'>
						<el-input v-model='form.type'></el-input>
					</el-form-item>
			 		<el-form-item label='启用' prop='is_disabled'>
						<el-switch v-model="form.is_disabled" :active-value='0' :inactive-value='1'></el-switch>
					</el-form-item>
				</el-row>
			</el-form>
			<span slot="footer">
		    <el-button @click="save" type="primary" :loading='formLoading' >{{isFormEdit?"修改":"创建"}}</el-button>
		    <el-button @click="dialogShow=false">取 消</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
import customerApi from '@/api/yyzx/customer'
import projectApi from '@/api/yyzx/project'
import commonJs from '@/utils/common'
import problemInfo from '@/components/problemInfo'
import projectInfo from '@/components/projectInfo'

//初始数据
const formInit = {
	id:null,
	name:'',
	is_disabled:0
}
export default {
	components:{ projectInfo,problemInfo },
	data(){
		let validator = (rule,value,callback)=>{
			customerApi.checkNameUnique(value,this.form.id).then(res=>{
				if(res.data>0){
					callback(new Error('客户名称已重复'))
				}else{
					callback()
				}
			})
		}
		return {
			loading: true,
			dialogShow:false,
			list:[],
			dataTotal:0,
			isEdit:false,
			form:{ ...formInit },
			formRules:{
				name:[
					{	required:true,message:'请填写客户名称' },
					{	validator:validator,trigger:'blur' },
				],
				type:[{	required:true,message:'请填写客户类别' }]
			},
			formLoading:false,
			projectList:[],
			//查询字段
			queryParams:{
				name:''
			},
			//请求参数
			requestParams:{
				pageSize:10,//分页大小
				currentPage:1//当前页
			}
		}
	},
	computed:{
		//表单是否是编辑状态
		isFormEdit(){
			return this.form.id!=null
		}
	},
	created(){
		this.getData()
	},
	methods:{		
		sizeChange(value){
			this.requestParams.pageSize=value
			this.getData()
		},
		getData() {
			this.loading=true
			customerApi.getList(this.requestParams).then(res=>{
				this.list = res.data.list
				this.dataTotal = res.data.total
				this.todoTotal = res.data.todoTotal
				this.loading = false
			})
		},		
		
		//查询方法
		query(){
			this.requestParams={...this.requestParams, ...this.queryParams}
			this.getData()
		},
		//重置查询条件
		resetQuery(){
			this.$refs.formQuery.resetFields()
			this.query()
		},
		//打开创建客户窗口		
		create(){
			this.form = { ...formInit }
			this.dialogShow = true
		},
		//打开修改客户窗口		
		edit({ row }){
			let r = this.$commonJs.obj.copyByKey(row,['id','name','type','is_disabled'])
			this.form = { ...formInit, ...r }
			this.dialogShow = true
		},
		//创建或修改客户信息
		save() {
			this.$refs.form.validate(vaild=>{
				if(vaild){
					this.formLoading=true
					if(this.isFormEdit){						
						customerApi.update(this.form).then(res=>{
							this.dialogShow = this.formLoading = false
							this.$message.success('修改成功')
							this.getData()							
						})
					}else{						
						customerApi.create(this.form).then(res=>{
							this.$message.success('客户创建成功')
							this.dialogShow = this.formLoading = false
							this.getData()							
						})
					}
				}else{
					return false
				}
			})
		},
		//删除
		del({row,$index}){
			let confirmText = '确定删除？'
			this.$confirm(confirmText,'提示',{
				type: 'warning'
			}).then((res)=>{
				if(res.code==1){
					this.$message.error(res.message)
				}else{
					customerApi.del(row.id).then(res=>{
						this.list.splice($index,1)
						this.dataTotal--
						this.$message.success('删除成功')
					})
				}
			})
		},
		//打开窗口后清除字段验证信息
		openDialog(){
			this.$nextTick(()=>{
				this.$refs.form?this.$refs.form.clearValidate():''
			})
		},
	}
}
</script>