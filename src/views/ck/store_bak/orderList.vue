<template>
	<el-dialog :visible.sync="dialogShow" width='80%'>
		<el-table 
  		:data='list' 
  		ref='tableList'
  		v-loading='loading' border stripe>
			<el-table-column prop='xc_storage_date' label='型材入库日期' align='center' width='110'></el-table-column>
			<el-table-column prop='material_type' label='材料类型' show-overflow-tooltip></el-table-column>
			<el-table-column prop='material_status' label='材料状态' show-overflow-tooltip></el-table-column>
			<el-table-column prop='material_stock' label='材料库存情况' show-overflow-tooltip></el-table-column>
			<el-table-column prop='other_material_stock' label='非通用材料情况' show-overflow-tooltip></el-table-column>
			<el-table-column prop='hardware_storage_date' label='五金入库日期' align='center' width='110'></el-table-column>
			<el-table-column prop='hardware_status' label='五金材料状态' show-overflow-tooltip></el-table-column>
			<el-table-column prop='hardware_stock' label='五金库存情况' show-overflow-tooltip></el-table-column>
			<el-table-column prop='update_time' label='更新时间' align='center' width='140'>
				<template slot-scope='scope'>
					<span>{{scope.row.update_time | formatDate}}</span>
				</template>
			</el-table-column>
		</el-table>
	</el-dialog>
</template>
<script>
	import storeApi from '@/api/ck/store'
	
	export default {
		data(){
			return {
				list:[],
				loading:true,				
				dialogShow: false
			}
		},
		methods:{
			open(projectId){
				this.loading = true
				this.dialogShow = true
				storeApi.getListByProject(projectId).then(res=>{
					this.list = res.data
					this.loading = false
				})
			}
		}
	}
</script>