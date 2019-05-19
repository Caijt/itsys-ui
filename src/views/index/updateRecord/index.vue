<template>
	<div>
		<el-form ref='formQuery' :model='queryParams' inline size='mini'>
			<el-form-item prop='keyword' style='max-width:150px'>
				<el-input v-model='queryParams.keyword' placeholder='根据关键字查询' clearable prefix-icon="el-icon-search" ></el-input>
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
			<el-table-column prop='title' label='更新标题' width='200'></el-table-column>
			<el-table-column prop='content' label='更新内容' min-width='200' show-overflow-tooltip></el-table-column>			
			<el-table-column prop='update_date' label='更新日期' width='120'>
				<template slot-scope='{row}'>
					{{ $commonJs.formatToDate(row.update_date)}}
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
				keyword:''			
			},
			requestParams:{
				pageSize:10,
				currentPage:1,
				orderDesc:true,
				orderProp:"update_date"
			}
		}),
		created(){
			this.getData()
		},
		methods:{
			getData(){
				this.loading = true
				indexApi.getUpdateRecordList(this.requestParams).then(res=>{
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