<!-- 
此组件初始化时不会自动加载数据，请在mounted中 this.$refs.[].initData()
如果放在dialog里面的吗，请在dialog的open事件中用this.$nextTick进行加载
 -->
<template>
	<div>
		<!-- 查询条件 -->
		<div style='margin-bottom: 2px' v-show='!hideQuery'>
			<div style='float:right;'>
				<el-button-group>
				  <el-button type='primary' icon="el-icon-search" @click='query'></el-button>
				  <el-tooltip content='重置查询条件' placement='top'>
					  <el-button icon="el-icon-refresh" @click='resetQuery'></el-button>
					</el-tooltip>
<!-- 				  <el-tooltip content='导出Excel' placement='top'>
				  	<el-button @click='exportExcel' size='mini' icon='el-icon-download'></el-button>
					</el-tooltip> -->
				</el-button-group>
			</div>
			<el-form ref='formQuery' :model='queryParams' class='c-form-condensed' label-width='68px' inline size='mini'>
				<el-form-item label='参数名称' prop='key'>
					<el-input v-model='queryParams.key' clearable></el-input>
				</el-form-item>
				<div v-show='queryShowMore'>
				</div>
			</el-form>
		</div> 
		<!--/ 查询条件 -->		
		<!-- 数据表格 -->
		<el-table 
			:data='list' 
			ref='tableList'
			v-loading='loading'
			highlight-current-row
			border 
			stripe
			row-key='id'
			:size='size'
			:max-height='maxHeight' 			
			@sort-change='sortChange'>			
			<el-table-column 
				fixed
				v-if='showCheckbox'
				type='selection' 
				align='center' 
				width='35' />
			<el-table-column prop='key' label='参数名称' width='150' show-overflow-tooltip/>
			<el-table-column prop='value' label='参数值' width='150' show-overflow-tooltip/>	
			<el-table-column prop='remarks' label='参数说明' min-width='120' show-overflow-tooltip/>
			<!-- slot[column] -->
			<slot name='column'></slot>
			<!--/ slot[column]-->
		</el-table>
		<!-- 数据表格 -->
	</div>
</template>
<script>
import api from '@/api/sys/config'

export default {
	components:{  },
	props:{
		size:{
			type:String,
			default:''
		},
		maxHeight:{
			default:400
		},
		params:{
			default:()=>({})
		},
		inDialog:{
			type:Boolean,
			default:false
		},
		hideQuery:{
			type:Boolean,
			default:false
		},
		noPage:{
			type:Boolean,
			default:true
		},
		init:{
			type:Boolean,
			default:false
		},
		showMore:{
			type:Boolean,
			default:false
		},
		showCheckbox:{
			type:Boolean,
			default:false
		}
	},
	data(){
		return {
			inited:false,
			loading: false,
			dialogShow:false,
			list:[],
			dataTotal:0,
			formLoading:false,
			projectList:[],
			summaryData:{},
			selectionList:[],
			queryShowMore:this.showMore,
			initParams:{},
			queryParamsLabel:{
				dep_name:''
			},
			//查询条件字段
			queryParams:{
				name:'',//项目编号				
				address:'',//
			},
			//数据请求的参数
			requestParams:{
				orderProp:'',
				orderDesc:false,
			}
		}
	},
	created(){
		
	},
	mounted(){
    if(this.init){
      this.inited = true
      this.initData()
    }    
  },
	methods:{
		//初始化数据
		initData(params={}){
			this.initParams = {...params}
			this.resetQuery()
		},
		//刷新数据
		reload(){
			this.getData()
		},
		//分页容量大小发生变化时
		//获取数据
		getData() {
			this.loading=true
			api.getList({...this.requestParams,...this.params,...this.initParams}).then(res=>{
				this.list = res.data
				this.loading = false
				this.$emit('loaded',{ 
					total:this.dataTotal,
					list:this.list,
					params:{...this.queryParams} 
				})
			})
		},
		//查询方法
		query({ key }={}){
			if(key){
				let value = this.queryParams[key]
				this.requestParams = {...this.requestParams,[key]:value}
			}else{
				this.requestParams = {...this.requestParams,...this.queryParams}
			}	
			this.getData()
		},
		//重置查询条件
		resetQuery(){
			this.$refs.formQuery.resetFields()
			// this.queryParamsLabel = { ...initQueryParamsLabel }
			// this.queryParams = {...this.queryParams,...this.params}
			this.query()
		},
		sortChange({prop,order}){
			this.requestParams.orderProp = prop
			this.requestParams.orderDesc = order!="ascending"?true:false
			this.getData()
		},
		//导出excel
		exportExcel(){
			api.exportExcel(this.requestParams)
		},
		clear(){
			this.list = []
		},
		del(row){
			let confirmText = '确定删除此参数吗？'
			this.$confirm(confirmText,'提示',{
				type: 'warning'
			}).then(()=>{
				api.del(row.key).then(res=>{
					this.reload()
					this.$message.success('删除成功')
					this.$emit('del')
				})
			})
		}
	}
}
</script>