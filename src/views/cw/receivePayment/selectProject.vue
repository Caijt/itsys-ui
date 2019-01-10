<template>
	<span>
		<el-alert
	    :title='"当前有 "+arrearProjectTotal+" 个项目已开票仍未收款，请及时进行收款"'
	    type="error" 
	    :closable="false"
	    style='margin: 10px 0px'
	    v-show='arrearProjectTotal>0'></el-alert>
		<el-badge :value="arrearProjectTotal" >
			<el-button type='primary' size='small' @click='selectProject'>回款登记</el-button>
  	</el-badge>
  	<el-button @click='$emit("export-excel")' size='small' style='margin-left:12px'>导出Excel</el-button>
  	<el-dialog 
  		class='c-dialog-small' title='选择项目进行回款' :visible.sync='dialogShow' 
			width='80%' top='2vh' @open='openDialog' >
			<project-summary-list 
				ref='projectSummaryList' in-dialog size='small' :params='params' max-height='300'>
				<el-table-column slot='column' label='操作' fixed='right' width='60' align='center'>
					<template slot-scope='scope'>
						<el-button size='mini' type='text' @click='createRecord(scope)'>回款</el-button>
					</template>
				</el-table-column>
			</project-summary-list>
		</el-dialog>
		
	</span>
</template>
<script>
	import projectSummaryList from '@/components/cw/summary/projectList'
	import receivePaymentApi from '@/api/cw/receivePaymentRecord'
	export default {
		components:{ projectSummaryList },
		data:()=>({
			loading:true,
			arrearProjectTotal:0,
			dialogShow:false,
			params:{
				noPayment:0
			}
		}),
		created(){
			this.getArrearProjectTotal()
		},
		methods:{
			getArrearProjectTotal(){
				this.loading = true
				receivePaymentApi.getArrearProjectTotal().then(res=>{
					this.arrearProjectTotal=res.data
					this.loading = false
				})
			},
			openDialog(){
				this.$nextTick(()=>{
					this.$refs.projectSummaryList.initData()
				})				
			},
			selectProject({ noPayment = 0 }){
				this.params.noPayment = noPayment
				this.dialogShow = true
			},
			createRecord({row}){
				this.$emit('create-record',{row})
			},
			reload(){
				this.getArrearProjectTotal()
				this.$refs.projectSummaryList.reload()
			}
		}
	}
</script>