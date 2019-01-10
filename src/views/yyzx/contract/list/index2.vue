<template>
	<div>
		<el-alert
    title="说明：合同专员根据立项项目的已签订合同内容填报，未签订合同填无合同即可。"
    type="success" :closable="false">
  	</el-alert>
		<el-tabs type="card" v-model='tabIndex' style='margin-top: 15px' @tab-click='tabClick'>
	    <el-tab-pane label="合同列表" name="contract" >
	    	<el-form ref='formQuery' :model='queryParams' inline size='small'>
	    		<el-form-item prop='contract_no'>
	    			<el-input v-model='queryParams.contract_no' placeholder='合同编号' clearable></el-input>
	    		</el-form-item>
	    		<el-form-item>
	    			<el-button type='primary' @click='query'>查询</el-button>
	    			<el-popover>
	    				<el-form ref='formQueryMore' size='small' class='c-form-condensed' :model='queryParams' label-width='80px' style='max-width:600px'>
								<el-row :gutter='10'>
									<el-col :span='12'>
										<el-form-item label='项目编号' prop='project_no'>
						    			<el-input v-model='queryParams.project_no' placeholder='项目编号' clearable></el-input>
						    		</el-form-item>
									</el-col>									
									<el-col :span='12'>
										<el-form-item label='项目名称' prop='project_name'>
											<el-input v-model='queryParams.project_name' clearable></el-input>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='合同内容' prop='content'>
											<el-input v-model='queryParams.content' clearable></el-input>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='付款方式' prop='payment'>
											<el-input  v-model='queryParams.payment' clearable></el-input>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='提交状态' prop='is_submit'>
											<el-select  v-model='queryParams.is_submit' clearable style='width:100%'>
												<el-option label='已提交' :value='1'></el-option>
												<el-option label='未提交' :value='0'></el-option>
											</el-select>
										</el-form-item>
									</el-col>
								</el-row>								
							</el-form>
	    				<el-button slot='reference'>更多条件</el-button>
	    			</el-popover>
	    			<el-button @click='resetQuery'>重置</el-button>
	    			<el-button @click='exportExcel'>导出</el-button>
	    		</el-form-item>
	    	</el-form>
	    	<el-table 
	    		:data='list' 
	    		ref='tableContract' 
	    		v-loading='loading' 
	    		border stripe
	    		max-height='500'
	    	>
	    		<el-table-column type='expand' width='30'>
    				<template slot-scope='props'>
							<el-form class='c-form-text' label-width='100px'>
								<el-row>
									<el-col :span='8'>
										<el-form-item label='创建时间'>
											<span>{{$moment(props.row.create_time).format('YYYY-MM-DD HH:mm')}}</span>
										</el-form-item>
									</el-col>
									<el-col :span='8'>
										<el-form-item label='客户名称'>
											<span>{{props.row.customer_name}}</span>
										</el-form-item>
									</el-col>
									<el-col :span='8'>
										<el-form-item label='客户类别'>
											<span>{{props.row.customer_type}}</span>
										</el-form-item>
									</el-col>
									<el-col :span='8'>
										<el-form-item label='业绩公司'>
											<span>{{props.row.company_name}}</span>
										</el-form-item>
									</el-col>
									<el-col :span='8'>
										<el-form-item label='项目地点'>
											<span>{{props.row.project_area}}</span>
										</el-form-item>
									</el-col>
									<el-col :span='8'>
										<el-form-item label='业务员'>
											<span>{{props.row.salesman}}</span>
										</el-form-item>
									</el-col>
									<el-col :span='8'>
										<el-form-item label='合同内容'>
											<span>{{props.row.content}}</span>
										</el-form-item>
									</el-col>
									<el-col :span='8'>
										<el-form-item label='操作员'>
											<span>{{props.row.contractor}}</span>
										</el-form-item>
									</el-col>
									<el-col :span='24'>
										<el-form-item label='付款方式'>
											<span v-html='convertTextarea(props.row.payment)'></span>
										</el-form-item>
									</el-col>
								</el-row>
							</el-form>
						</template>
	    		</el-table-column>
					<el-table-column prop='no' label='合同编号'></el-table-column>
					
					<el-table-column prop='project_no' label='项目编号' width='100'>
						<template slot-scope='{row}'>
							<span class='c-link' @click='$refs.projectDetails.open(row.project_id)'>{{row.project_no}}</span>
						</template>
					</el-table-column>
					<el-table-column prop='project_name' label='项目名称' show-overflow-tooltip></el-table-column>
					<el-table-column prop='area' label='合同量' align='right'>
						<template slot-scope='scope'>
							<span>{{scope.row.area}}㎡</span>
						</template>
					</el-table-column>		
					<el-table-column prop='price' label='合同款' align='right' header-align='center'>
						<template slot-scope='scope'>
							<span>￥{{scope.row.price}}</span>
						</template>
					</el-table-column>
					<el-table-column prop='contract_date' label='合同日期' width='100px'></el-table-column>
					<el-table-column prop='update_user_name' label='更新人员' width='80'></el-table-column>
					<el-table-column prop='update_time' label='更新时间' width='140'>
						<template slot-scope='scope'>
							<span>{{$moment(scope.row.update_time).format('YYYY-MM-DD HH:mm')}}</span>
						</template>
					</el-table-column>
					<el-table-column 
						prop='is_submit' 
						label='提交状态' 
						align='center'
						width='80'>
						<template slot-scope='props'>
							<el-tag type="success" v-if='props.row.is_submit==1' size="small">已提交</el-tag>
							<el-tag type="danger" v-else size="small">未提交</el-tag>
						</template>
					</el-table-column>
					<el-table-column label='操作' width='90'>
						<template slot-scope='scope'>
							<el-button size='mini' type='text' @click='editContract(scope)'>编辑</el-button>
							<el-button size='mini' type='text' @click='del(scope)'>删除</el-button>
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
	    </el-tab-pane>
	    <el-tab-pane name="todo">
	    	<el-badge class='_contract-badge' :value='newProjectLoading?"..":newProjectList.length' slot="label" >待办新项目</el-badge>
	    	<el-alert
		    title="未创建过合同的项目列表，请及时创建并提交！"
		    type="warning" 
		    :closable="false"
		    style='margin-bottom: 15px'>
		  	</el-alert>
	    	<el-table :data='newProjectList' v-loading='newProjectLoading' ref='tableTodo' border stripe>
	    		<el-table-column type='expand'>
	    			<template slot-scope='props'>
							<el-form class='c-form-text' label-width='100px'>
								<el-row >
									<el-col :span='12'>
										<el-form-item label='创建时间'>
											<span>{{props.row.create_time}}</span>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='客户名称'>
											<span>{{props.row.customer_name}}</span>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='客户类别'>
											<span>{{props.row.customer_type}}</span>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='业绩公司'>
											<span>{{props.row.company_name}}</span>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='业务员'>
											<span>{{props.row.salesman}}</span>
										</el-form-item>
									</el-col>
								</el-row>
							</el-form>
						</template>
	    		</el-table-column>
					<el-table-column type='index'></el-table-column>
					<el-table-column prop='no' label='项目编号'></el-table-column>
					<el-table-column prop='name' label='项目名称'></el-table-column>
					<el-table-column prop='contract_no' label='合同编号'></el-table-column>
					<el-table-column prop='area' label='项目地点'></el-table-column>
					<el-table-column prop='update_time' label='更新时间' width='140'>
						<template slot-scope='scope'>
							<span>{{$moment(scope.row.update).format('YYYY-MM-DD HH:mm')}}</span>
						</template>
					</el-table-column>
					<el-table-column label='操作' width='80'>
						<template slot-scope='scope'>
							<el-button size='mini' type='text' @click='createContractByTodo(scope)'>创建合同</el-button>
						</template>
					</el-table-column>
				</el-table>
	    </el-tab-pane>
	  </el-tabs>	
		<el-dialog  
			class='c-dialog-fixed' 
			:title='isFormEdit?"编辑合同":"创建合同"' 
			:visible.sync='dialogShow'
			width='60%'
			@open='openDialog'>
			<el-form :model='form' :rules='formRules' ref='form' label-width='80px' status-icon>
				<el-row :gutter='10' class='c-input-readonly'>
					<el-col :span='12'>
						<el-form-item label='项目名称'>
							<el-input readonly :value='form.project_name'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='12'>
						<el-form-item label='项目编号'>
							<el-input readonly :value='form.project_no'></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter='10'>
					<el-col :span='12'>
						<el-form-item label='合同编号' prop='no'>
							<el-input v-model='form.no'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='12'>
						<el-form-item label='操作员' prop='contractor'>
							<el-input v-model='form.contractor'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='12'>
						<el-form-item label='合同款' prop='price'>
							<el-input  v-model.number='form.price'>
								<span slot="prefix">￥</span>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='12'>
						<el-form-item label='合同面积' prop='area'>
							<el-input v-model.number='form.area'>
								<template slot="suffix">㎡（平方米）</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span='12'>
						<el-form-item label='合同日期' prop='contract_date'>
							<el-date-picker v-model='form.contract_date' style='width: 100%' value-format='yyyy-MM-dd'></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span='24'>
						<el-form-item label='合同内容' prop='content'>
							<el-input v-model='form.content' placeholder='简单填写合同相关内容'></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label='付款方式' prop='payment'>
					<el-input v-model='form.payment' type="textarea" :rows='4'></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer">
		    <el-tooltip content='提交至项目，运营中心才能看到更新内容'><el-button @click="save({isSubmit:true})" type="primary" :loading='formLoading'>{{isFormEdit?"更新并提交":"创建并提交"}}</el-button></el-tooltip>
		    <el-tooltip content='不提交到项目，运营中心无法查看更新内容' v-if='!form.is_submit'><el-button @click="save({isSubmit:false})" :loading='formLoading'>{{isFormEdit?"更 新":"创 建"}}</el-button></el-tooltip>
		    <el-button @click="dialogShow=false">取 消</el-button>
		  </span>
		</el-dialog>
		<project-details ref='projectDetails'/>
	</div>
</template>

<script>
import contractApi from '@/api/yyzx/contract'
import commonJs from '@/utils/common'
import projectDetails from '@/components/projectDetails'

const formInit = {
	id:null,
	no:'',
	project_id:null,
	project_name:'',	
	contract_date:'',
	payment:'',
	content:'',
	area:0,
	price:0,
	contractor:''
}
export default {
	components:{ projectDetails },
	data(){
		let validator = (rule,value,callback)=>{
			if(value<=0){
				callback(new Error('必须大于0'))
			}else{
				callback()
			}
		}
		return {
			tabIndex:'contract',
			loading: true,
			newProjectLoading: true,
			dialogShow:false,
			list:[],
			dataTotal:0,
			newProjectList:[],
			form:Object.assign({},formInit),
			formRules:{
				contract_no:[{ required:true, message:'请选择合同所属项目' }],
				no:[{ required:true, message:'请选择合同编号' }],
				area:[{type:'number',message:'请输入数字'},{ validator }],
				price:[
					{ type:'number',message:'请输入数字' },
					{ validator }
				],
				contract_date:[{required:true,message:'请输入合同日期'}],
			},
			formLoading:false,
			projectList:[],
			//查询字段
			queryParams:{
				contract_no:'',//合同编号
				project_no:'',//项目编号
				project_name:'',//项目名称
				content:'',
				payment:'',
				is_submit:''
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
		this.getTodoProject()
	},
	methods:{
		tabClick({name}){
			let ref=(name=='contract'?'tableContract':'tableTodo')
			setTimeout(()=>{
				this.$refs[ref].doLayout()
			},100)
		},
		sizeChange(value){
			this.requestParams.pageSize=value
			this.getData()
		},
		getData() {
			this.loading=true
			contractApi.getList(this.requestParams).then(res=>{
				this.list = res.data.list
				this.dataTotal = res.data.total
				this.loading = false
			})
		},
		getTodoProject(){
			this.newProjectLoading = true
			contractApi.getTodoProjectList().then(res=>{
				this.newProjectList=res.data
				this.newProjectLoading = false
			})
		},
		save({isSubmit}) {
			this.$refs.form.validate(vaild=>{
				if(vaild){
					this.formLoading=true
					this.form.is_submit = isSubmit?1:0
					if(this.isFormEdit){						
						contractApi.update(this.form).then(res=>{
							this.$message.success('合同更新成功')
							this.dialogShow = this.formLoading = false
							this.getData()
						})
					}else{						
						contractApi.create(this.form).then(res=>{
							this.$message.success('合同创建成功')
							this.dialogShow = this.formLoading = false
							this.getTodoProject()
							this.getData()							
						})
					}
				}else{
					return false
				}
			})
		},
		del({row,$index}){
			if(row.is_submit){
				this.$message.warning('已提交的合同无法删除！')
				return false
			}
			this.$confirm('确定删除？','提示',{
				type: 'warning'
			}).then(()=>{
				contractApi.del(row.id).then(res=>{
					this.list.splice($index,1)
					this.dataTotal--
					this.$message.success('删除成功')
					this.getTodoProject()
				})
			})
		},
		createContractByTodo({row}){
			let r = {
				project_no:row.no,
				project_name:row.name,
				project_id:row.id,
				no:row.contract_no					
			}
			this.form = Object.assign({},formInit,r)
			this.dialogShow = true			
		},
		editContract({row}){
			this.form = Object.assign({},formInit,row)
			this.form.price = Number(this.form.price)
			this.form.area = Number(this.form.area)
			this.dialogShow = true
		},
		//打开窗口后清除字段验证信息
		openDialog(){
			this.$nextTick(()=>{
				this.$refs.form?this.$refs.form.clearValidate():''
			})
		},		
		//查询方法
		query(){
			Object.assign(this.requestParams,this.queryParams)
			this.getData()
		},
		resetQuery(){
			this.$refs.formQuery.resetFields()
			this.$refs.formQueryMore.resetFields()
		},
		exportExcel(){
			this.$message.error('功能未开发')
		},
		convertTextarea(text){
			return commonJs.convertTextarea(text)
		}
	}
}
</script>
<style>
	._contract-badge .el-badge__content.is-fixed{
		top:10px;
		right:1px;
	}
</style>