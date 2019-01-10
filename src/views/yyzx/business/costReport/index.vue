<template>
	<div>
		<el-alert
    title="商务部根据已立项项目的商务预算情况填报实时更新"
    type="success" :closable="false">
  	</el-alert>
		<el-tabs type="card" v-model='tabIndex' style='margin-top: 15px' @tab-click='tabClick'>
	    <el-tab-pane label="报告列表" name="contract">
	    	<el-alert
			    title="只显示每个项目最近更新的报告，如需查看之前提交的历史报告，请在数据左侧展开后点击历史报告"
			    type="warning" 
			    :closable="false"
			    style='margin-bottom: 15px'>
		  	</el-alert>
	    	<el-form ref='formQuery' :model='queryParams' inline size='mini'>	    		
	    		<el-form-item prop='project_no'>
	    			<el-input v-model='queryParams.project_no' placeholder='项目编号' clearable></el-input>
	    		</el-form-item>
	    		<el-form-item>
	    			<el-button type='primary' @click='query'>查询</el-button>
	    			<el-popover>
	    				<el-form ref='formQueryMore' size='small' class='c-form-condensed' :model='queryParams' label-width='90px' style='max-width:600px'>
								<el-row :gutter='10'>
									<el-col :span='12'>
										<el-form-item label='项目名称' prop='project_name'>
											<el-input v-model='queryParams.project_name' clearable></el-input>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='合同编号' prop='contract_no'>
											<el-input v-model='queryParams.contract_no' clearable></el-input>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='报价员' prop='quoter'>
											<el-input v-model='queryParams.quoter' clearable></el-input>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='报价编号' prop='offer_no'>
											<el-input v-model='queryParams.offer_no' clearable></el-input>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='报价内容' prop='offer_content'>
											<el-input v-model='queryParams.offer_content' clearable></el-input>
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
	    			<el-button @click='exportExcel' v-if='false'>导出</el-button>
	    		</el-form-item>
	    	</el-form>
	    	<el-table :data='list' ref='tableContract' v-loading='loading' border stripe>
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
										<el-form-item label='合同编号'>
											<span>{{props.row.contract_no}}</span>
										</el-form-item>
									</el-col>
									<el-col :span='8'>
										<el-form-item label='客户名称'>
											<span>{{props.row.customer}}</span>
										</el-form-item>
									</el-col>
									<el-col :span='8'>
										<el-form-item label='客户类别'>
											<span>{{props.row.customer_type}}</span>
										</el-form-item>
									</el-col>
									<el-col :span='8'>
										<el-form-item label='分公司'>
											<span>{{props.row.company}}</span>
										</el-form-item>
									</el-col>
									<el-col :span='8'>
										<el-form-item label='区域'>
											<span>{{props.row.area}}</span>
										</el-form-item>
									</el-col>
									<el-col :span='8'>
										<el-form-item label='业务员'>
											<span>{{props.row.salesman}}</span>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span='8'>
										<el-form-item label='报价编号'>
											<span>{{ props.row.offer_no }}</span>
										</el-form-item>
									</el-col>
									<el-col :span='8'>
										<el-form-item label='报价员'>
											<span>{{ props.row.quoter }}</span>
										</el-form-item>
									</el-col>
									<el-col :span='24'>
										<el-form-item label='报价描述'>
											<span>{{ props.row.offer_content | textareaToHtml }}</span>
										</el-form-item>
									</el-col>
									<el-col :span='24'>
										<el-form-item label='合同量价核对'>
											<span>{{ props.row.contract_check | textareaToHtml }}</span>
										</el-form-item>
									</el-col>
									<el-col :span='24'>
										<el-form-item label='供货配置及品牌匹配度'>
											<span>{{ props.row.matching_degree | textareaToHtml }}</span>
										</el-form-item>
									</el-col>
									<el-col :span='8'>
										<el-form-item>
											<el-tooltip content='查看之前提交过的成本预算报告，该功能未开发'>
												<el-button size='mini' type='text' v-if='props.row.total>1'>历史报告[{{props.row.total-1}}]</el-button>
											</el-tooltip>
										</el-form-item>
									</el-col>
								</el-row>
							</el-form>
						</template>
	    		</el-table-column>
	    		<el-table-column prop='offer_no' label='报价编号'></el-table-column>
					<el-table-column prop='project_no' label='项目编号' width='100'></el-table-column>
					<el-table-column prop='project_name' label='项目名称' show-overflow-tooltip></el-table-column>
					<el-table-column prop='quoter' label='报价员' show-overflow-tooltip></el-table-column>
					<el-table-column prop='offer_content' label='报价描述' show-overflow-tooltip></el-table-column>	
					<el-table-column prop='contract_check' label='合同量价的核对' show-overflow-tooltip></el-table-column>	
					<el-table-column prop='matching_degree' label='供货配置及品牌匹配度' show-overflow-tooltip></el-table-column>
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
					<el-table-column label='操作' align='center' width='90'>
						<template slot-scope='scope'>
							<el-button size='mini' type='text' @click='editContract(scope)' v-if='!scope.row.is_submit'>编辑</el-button>
							<el-tooltip v-else content='拷贝并创建新报告' placement='left'>
								<el-button  size='mini' type='text' @click='createReport(scope)'>创建</el-button>
							</el-tooltip>									
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
		    title="未创建过工程进度报告的项目列表，请及时创建并提交！"
		    type="warning" 
		    :closable="false"
		    style='margin-bottom: 15px'>
		  	</el-alert>
	    	<el-table :data='newProjectList' v-loading='newProjectLoading' ref='tableTodo' border stripe>
	    		<el-table-column type='expand'>
	    			<template slot-scope='props'>
							<el-form class='c-form-text' label-width='100px'>
								<el-row>
									<el-col :span='12'>
										<el-form-item label='创建时间'>
											<span>{{props.row.create_time}}</span>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='客户名称'>
											<span>{{props.row.customer}}</span>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='客户类别'>
											<span>{{props.row.customer_type}}</span>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='分公司'>
											<span>{{props.row.company}}</span>
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
					<el-table-column prop='area' label='区域'></el-table-column>
					<el-table-column prop='salesman' label='业务员'></el-table-column>
					<el-table-column prop='update_time' label='更新时间' width='140'>
						<template slot-scope='scope'>
							<span>{{$moment(scope.row.update).format('YYYY-MM-DD HH:mm')}}</span>
						</template>
					</el-table-column>
					<el-table-column label='操作' width='80'>
						<template slot-scope='scope'>
							<el-button size='mini' type='text' @click='createReportByTodo(scope)'>创建报告</el-button>
						</template>
					</el-table-column>
				</el-table>
	    </el-tab-pane>
	  </el-tabs>	
		<el-dialog  class='c-full-fixed' :title='isFormEdit?"编辑报告":"创建报告"' :visible.sync='dialogShow' fullscreen @open='openDialog'>
			<el-form :model='form' :rules='formRules' ref='form' label-width='100px' status-icon>
				<el-row :gutter='20'>
					<el-col :span='8'>
						<el-form-item label='项目名称'>
							<el-input readonly :value='form.project_name'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='项目编号'>
							<el-input readonly :value='form.project_no'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='合同编号' prop='contract_no'>
							<el-input readonly v-model='form.no'></el-input>
						</el-form-item>
					</el-col>	
					<el-col :span='8'>
						<el-form-item label='报价编号' prop='offer_no'>
							<el-input v-model='form.offer_no'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='报价员' prop='quoter'>
							<el-input v-model='form.quoter'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='24'>
						<el-form-item label='报价描述' prop='offer_content'>
							<el-input v-model='form.offer_content' type='textarea' :rows='4'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='24'>
						<el-form-item label='合同量价的核对' prop='contract_check'>
							<el-input v-model='form.contract_check' type='textarea' :rows='4'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='24'>
						<el-form-item label='供货配置及品牌匹配度' prop='matching_degree'>
							<el-input v-model='form.matching_degree' type='textarea' :rows='4'></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<span slot="footer">
		    <el-tooltip content='提交至项目，运营中心才能看到更新内容，报告提交后无法修改内容，只能重新创建新报告'><el-button @click="save({isSubmit:true})" type="primary" :loading='formLoading'>{{isFormEdit?"更新并提交":"创建并提交"}}</el-button></el-tooltip>
		    <el-tooltip content='暂时不提交到项目，运营中心无法查看更新内容' v-if='!form.is_submit'><el-button @click="save({isSubmit:false})" :loading='formLoading'>{{isFormEdit?"更 新":"创 建"}}</el-button></el-tooltip>
		    <el-button @click="dialogShow=false">取 消</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
import businessApi from '@/api/yyzx/business'
import commonJs from '@/utils/common'

const formInit = {
	id:null,
	no:'',
	project_id:null,
	project_name:'',	
	contract_no:'',
	offer_content:'',
	offer_no:'',
	quoter:'',
	contract_check:'',
	matching_degree:'',
	quoter:''
}
export default {
	data(){
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
				offer_no:[{ required:true, message:'请填写报价编号' }],
				quoter:[ { required:true, message:'请填写报价员' }],
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
				is_submit:'',
				isTodo:false
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
			businessApi.getList(this.requestParams).then(res=>{
				this.list = res.data.list
				this.dataTotal = res.data.total
				this.loading = false
			})
		},
		getTodoProject(){
			this.newProjectLoading = true
			businessApi.getTodoProjectList().then(res=>{
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
						businessApi.update(this.form).then(res=>{
							this.$message.success('报告更新成功')
							this.dialogShow = this.formLoading = false
							this.getData()
						})
					}else{						
						businessApi.create(this.form).then(res=>{
							this.$message.success('报告创建成功')
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
				this.$message.warning('已提交的报告无法删除！')
				return false
			}
			let confirmText = '当前项目之前没提交过报告，删除后，会移至待办新项目中，您确定删除吗？'
			if(row.total > 1){
				confirmText = '当前项目之前提交过报告，删除后，会显示为最近一次提交的报告，您确定删除吗？'
			}
			this.$confirm(confirmText,'提示',{
				type: 'warning'
			}).then(()=>{
				businessApi.del(row.id).then(res=>{
					if(row.total <= 1){
						this.list.splice($index,1)
						this.dataTotal--
						this.getTodoProject()
					}else{
						this.getData()
					}
					this.$message.success('删除成功')
				})
			})
		},
		createReport({row}){
			let r = {
				project_no:row.project_no,
				project_name:row.project_name,
				project_id:row.project_id,
				contract_no:row.contract_no,
				offer_no:row.offer_no,
				quoter:this.$store.state.user.name,
				offer_content:row.offer_content,
				contract_check:row.contract_check,
				matching_degree:row.matching_degree
			}
			this.form = Object.assign({},formInit,r)
			this.dialogShow = true
		},
		createReportByTodo({row}){
			let r = {
				project_no:row.no,
				project_name:row.name,
				project_id:row.id,
				no:row.contract_no,
				quoter:this.$store.state.user.employee			
			}
			this.form = Object.assign({},formInit,r)
			this.dialogShow = true			
		},
		editContract({row}){
			this.form = Object.assign({},formInit,row)
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
			this.query()
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