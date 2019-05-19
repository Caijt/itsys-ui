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
				  <el-tooltip content='导出Excel' placement='top'>
				  	<el-button @click='exportExcel' size='mini' icon='el-icon-download'></el-button>
					</el-tooltip>
				  <el-tooltip content='显示更多查询条件' placement='top'>
					  <el-button @click='queryShowMore=!queryShowMore' size='mini'>
	          <i :class="{'el-icon-arrow-up':queryShowMore,'el-icon-arrow-down':!queryShowMore}"></i>
          	</el-button>
          </el-tooltip>
				</el-button-group>
			</div>
			<el-form class='c-form-condensed' label-width='68px' inline size='mini'>
				<slot name='query-item'></slot>	
				<div v-show='queryShowMore'>
					<slot name='query-item-more'></slot>
				</div>
			</el-form>
		</div> 
		<!--/ 查询条件 -->		
		<!-- 数据表格 -->
		<el-table 
			:data='data' 
			ref='tableList'
			v-loading='loading'
			highlight-current-row
			border 
			stripe
			:row-key='rowKey'
			:max-height='tableMaxHeight' 
			show-summary
			@selection-change='selectionChange'
			:summary-method='getSummaryData'
			@sort-change='sortChange'>			
			<el-table-column 
				fixed
				v-if='showCheckbox'
				type='selection' 
				align='center' 
				width='35' />
			<!-- slot[column] -->
			<slot name='column'></slot>
			<!--/ slot[column]-->
		</el-table>
		<!-- 数据表格 -->
		<!-- 分页 -->
		<el-pagination style='margin-top: 10px'
			v-if='showPage'
	    :page-sizes = "[10, 20, 50, 100]"
	    :page-size.sync= "params.pageSize"
	    :current-page.sync = "params.currentPage"
	    layout="total, sizes, prev, pager, next, jumper"
	    :total="total"
	    @size-change='reload'
	    @current-change='reload' />
	  <!--/ 分页 -->
	</div>
</template>
<script>

export default {
	props:{
		data:{
			type:Array,
			default:()=>([])
		},
		total:{
			default:0
		},
		rowKey:{

		},
		maxHeight:{
			default:0
		},
		hideQuery:{
			type:Boolean,
			default:false
		},
		noPage:{
			type:Boolean,
			default:false
		},
		showPage:{
			type:Boolean,
			default:true
		},
		showQueryMore:{
			type:Boolean,
			default:false
		},
		showCheckbox:{
			type:Boolean,
			default:false
		},
		loading:{
			type:Boolean,
			default:false
		},
		summary:{
			type:Object,
			default:()=>({})
		},
		sortProp:{
			default:''
		},
		sortOrder:{
			default:''
		}
	},
	data(){
		return {
			selectionList:[],
			queryShowMore:this.showQueryMore,			
			//数据请求的参数
			params:{
				pageSize:this.$store.state.sys.pageSize,//分页大小
				currentPage:1,//当前页
				sortProp:this.sortProp,//排序字段
				sortOrder:this.sortOrder,//排序顺序
				showPage:this.showPage?1:0,
				noPage:this.noPage?1:0
			},
			pageParams:{
				pageSize:this.$store.state.sys.pageSize,//分页大小
				currentPage:1,//当前页
				noPage:this.noPage?1:0,
			}
		}
	},
	computed:{
		tableMaxHeight(){
			return this.maxHeight?this.maxHeight:this.$store.state.sys.tableMaxHeight
		}
	},
	methods:{
		//刷新数据
		reload(){
			this.$emit('reload')
		},
		//分页容量大小发生变化时
		sizeChange(value){
			this.getData()
		},
		selectionChange(valueArrary){
			this.selectionList = valueArrary
		},
		getSummaryData({columns,data}){
      let sum = []
      let labelIndex = this.showCheckbox?1:0
      columns.forEach((column,i)=>{
        if(i==labelIndex){
          sum[i]='合计'
        }else{
          sum[i] = this.summary[column.property]
        }       
      })
      return sum
    },
		//查询方法
		query(){
			this.$emit('query')
		},
		//重置查询条件
		resetQuery(){
			this.$emit('reset-query')
		},
		sortChange({prop,order}){
			this.params.sortProp = prop
			this.params.sortOrder = order
			this.reload()
		},
		//导出excel
		exportExcel(){
			this.$emit('export-excel')
		},
		clear(){
			this.list = []
		}
	}
}
</script>