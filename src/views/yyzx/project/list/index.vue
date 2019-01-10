<template>
	<div>
		<el-alert title='项目立项必须关联合同，一个合同可以关联多个项目，项目立项后，才可以进行运营下单操作' type='warning' style='margin-bottom: 10px'></el-alert>
  	</el-alert>
  	<div style='margin:10px 0px'>
	  	<el-button type='primary' @click='create' size='small'>项目立项</el-button>
	  	<el-button size='small' @click='exportExcel' >导出Excel</el-button>
	  </div>
		<el-tabs value='list'>
			<el-tab-pane label='项目列表' name='list'>
				<list ref='list'>					
					<el-table-column slot='column' label='操作' fixed='right' width='100' align='center'>
						<template slot-scope='scope'>					
							<el-button size='mini' type='text' @click='edit(scope)'>编辑</el-button>
							<el-button size='mini' type='text' @click='del(scope)'>删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				</list>
			</el-tab-pane>
		</el-tabs>
		<form-dialog ref='formDialog' @saved='reload'></form-dialog>
	</div>
</template>

<script>
import projectApi from '@/api/yyzx/project'
import customerApi from '@/api/yyzx/customer'
import companyApi from '@/api/yyzx/company'
import list from '@/components/yyzx/project/list'
import formDialog from '@/components/yyzx/project/formDialog'

const formInit = {
	id:null,
	name:'',
	customer_id:null
}
export default {
	components:{ list,formDialog },
	data(){
		return {
			loading:true,
			dialogShow:false,
			list:[],
			queryShowMore:false,
			customerList:[],//客户列表
			companyList:[],//业绩公司列表
			dataTotal:0,
			form:Object.assign( {}, formInit ),
			formRules:{
				name:[{ required:true, message:'请输入项目名称' }],
				customer_id:[{ required:true, message:'请选择客户' }],
				company_id:[{ required:true, message:'请选择项目所属业绩公司' }],
			},
			formLoading:false,
		}
	},
	computed:{
		isFormEdit(){
			return this.form.id!=null
		}
	},
	mounted(){
		this.$refs.list.initData()
	},
	created(){
		
	},
	methods:{
		details(row){
			this.$refs.projectDetails.open(row.id)
		},
		create(){
				this.$refs.formDialog.open()
		},
		edit({row}){
			this.$refs.formDialog.open(row.id)
		},
		del(scope){
			this.$refs.list.del(scope)
		},
		exportExcel(){
			this.$refs.list.exportExcel()
		},
		sortChange({prop,order}){
			this.requestParams.sortProp = prop
			this.requestParams.sortOrder = order
			this.getData()
		},
		reload(){
			this.$refs.list.reload()
		}
	}
}
</script>
<style >
	.point .el-table__row{
		cursor: pointer;
	}
</style>