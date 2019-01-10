<template>
	<div>
		<div style='margin:10px 0px'>
	  	<el-button @click='exportExcel' size='small'>导出Excel</el-button>
	  </div>
		<progress-list :params='params' ref='progressList' @loaded='getData'>
			<el-table-column slot='column' label='操作' fixed='right' width='80' align='center'>
				<template slot-scope='scope'>					
					<el-button size='mini' type='text' @click='details(scope.row)'>进度详情</el-button>
				</template>
			</el-table-column>
		</progress-list>
		<project-details ref='projectDetails'></project-details>
	</div>
</template>

<script>
import projectApi from '@/api/yyzx/project'
import projectDetails from '@/components/projectDetails'
import progressList from '@/components/yyzx/project/progress/list'

export default {
	components:{ projectDetails,progressList },
	data(){
		return {
			params:{
				isSale:1
			}
		}
	},
	mounted(){
		this.$refs.progressList.initData()
	},
	methods:{
		details(row){
			this.$refs.projectDetails.open(row.id)
		},
		getData({total,list,params}) {
			this.summaryLoading = true
			projectApi.getProjectSummary( params ).then(res=>{
				this.totalOrderArea = res.data.order_area_total ||0
				this.totalRecord = res.data.order_total ||0
				this.totalOrderAmount = res.data.order_amount_total||0
				this.summaryLoading = false
			})
		},
		exportExcel(){
			this.$refs.progressList.exportExcel()
		}
	}
}
</script>