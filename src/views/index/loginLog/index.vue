<template>
	<div>
		<el-form ref='formQuery' :model='queryParams' inline size='mini'>
			<el-form-item prop='ip' style='max-width:150px'>
				<el-input v-model='queryParams.ip' placeholder='IP查询' clearable prefix-icon="el-icon-search" ></el-input>
			</el-form-item>
			<el-form-item>						 
				<el-button type='primary' @click='query'>查询</el-button>
				<el-button @click='resetQuery'>重置</el-button>
			</el-form-item>
		</el-form>
		<el-table 
			:data='list' 
			ref='tableList'
			v-loading='loading'
			stripe
		>
			<el-table-column type='index'></el-table-column>
			<el-table-column prop='ip' label='登录IP' min-width='200'></el-table-column>
			<el-table-column prop='login_time' label='登录时间' width='200'>
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
	</div>
</template>
<script>
	import indexApi from '@/api/index'
	export default {
		data:()=>({
			loading:false,
			list:[],
			unreadTotal:0,
			dataTotal:0,
			queryParams:{				
				ip:''			
			},
			requestParams:{
				pageSize:10,
				currentPage:1
			}
		}),
		created(){
			this.getData()
		},
		methods:{
			getData(){
				this.loading = true
				indexApi.getLoginLogList(this.requestParams).then(res=>{
					this.list = res.data.list
					this.dataTotal = res.data.total
					this.loading = false
				})
			},
			sizeChange(value){
				this.requestParams.pageSize=value
				this.getData()
			},
			query(){
				this.requestParams = Object.assign({},this.requestParams,this.queryParams)
				this.getData()
			},
			resetQuery(){
				this.$refs.formQuery.resetFields()
				this.query()
			}
		}
	}
</script>