<template>
	<div>
		<el-input readonly :value='label' placeholder='点击右侧按钮选择项目'>
			<el-button :disabled='disabled' slot="append" @click='showDialog'>选择项目</el-button>
		</el-input>
		<el-dialog 
			class='c-dialog-small'
			title='选择项目'
    	:visible.sync='dialogShow' 
    	top='1vh'
    	width='60%'
    	append-to-body
    >
    	<el-form ref='formQuery' :model='queryParams' inline size='mini'>
    		<el-form-item label='编号' prop='no'>
    			<el-input v-model='queryParams.project_no' placeholder='填写项目编号' clearable></el-input>
    		</el-form-item>
    		<el-form-item>
    			<el-button type='primary' @click='query'>查询</el-button>
    			<el-popover>
						<el-form ref='formQueryMore' size='small' class='c-form-condensed' :model='queryParams' label-width='80px' style='max-width:600px'>
							<el-row :gutter='10'>
								<el-col :span='12'>
									<el-form-item label='项目名称' prop='project_name'>
										<el-input v-model='queryParams.project_name' clearable></el-input>
									</el-form-item>
								</el-col>
								<el-col :span='12'>
									<el-form-item label='合同编号' prop='contract_no'>
										<el-input size='small' v-model='queryParams.contract_no' clearable></el-input>
									</el-form-item>
								</el-col>
								<el-col :span='12'>
									<el-form-item label='客户名称' prop='customer'>
										<el-input size='small' v-model='queryParams.customer' clearable></el-input>
									</el-form-item>
								</el-col>
								<el-col :span='12'>
									<el-form-item label='客户类别' prop='customer_type'>
										<el-input size='small' v-model='queryParams.customer_type' clearable></el-input>
									</el-form-item>
								</el-col>
								<el-col :span='12'>
									<el-form-item label='业绩公司' prop='company'>
										<el-input size='small' v-model='queryParams.company' clearable></el-input>
									</el-form-item>
								</el-col>
								<el-col :span='12'>
									<el-form-item label='项目地点' prop='area'>
										<el-input size='small' v-model='queryParams.area' clearable></el-input>
									</el-form-item>
								</el-col>
								<el-col :span='12'>
									<el-form-item label='业务员' prop='salesman'>
										<el-input size='small' v-model='queryParams.salesman' placeholder='' clearable></el-input>
									</el-form-item>
								</el-col>
							</el-row>								
						</el-form>
					  <el-button slot="reference">更多条件</el-button>
					</el-popover>
					<el-button @click='resetQuery'>重置</el-button>
    		</el-form-item>
    	</el-form>
    	<el-table :data='list' size='small' border height='300' v-loading='loading'>
    		<el-table-column prop='no' fixed width='100' label='项目编号'></el-table-column>
    		<el-table-column prop='name' label='项目名称' min-width='150' show-overflow-tooltip></el-table-column>
    		<el-table-column prop='contract_no' label='合同编号' min-width='100' show-overflow-tooltip></el-table-column>
    		<el-table-column prop='customer_name' label='客户名称' min-width='100' show-overflow-tooltip></el-table-column>
    		<el-table-column prop='customer_type' label='客户类别'></el-table-column>
    		<el-table-column prop='company_name' label='业绩公司'></el-table-column>
    		<el-table-column prop='salesman' label='业务员'></el-table-column>
    		<el-table-column label='操作' fixed='right' align='center' width='60'>
    			<template slot-scope='scope'>
    				<el-button type='text' size='mini' @click='select(scope)'>选择</el-button>
    			</template>
    		</el-table-column>
    	</el-table>
    	<el-pagination style='margin-top: 10px'
	    	small
	      :current-page.sync = "requestParams.currentPage"
	      :total="dataTotal"
	      layout="prev, pager, next"
	      @current-change='getData'
	      >
	    </el-pagination>
			<span slot='footer'>
				<span style='float:left' >
					已选：
					<transition name="fade" mode='out-in'>
					<el-tag :type='selectedLabel?"":"info"' :closable='selectedLabel?true:false' @close='clearSelect'>{{selectedLabel?selectedLabel:"无"}}</el-tag>
				</transition>
				</span>
				<el-button size='small' type='primary' @click='submit'>确定</el-button>
				<el-button size='small'  @click="dialogShow=false">取消</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
	import projectApi from '@/api/yyzx/project'
	export default {
		props:{
			label:{
				type:String
			},
			value:{
				type:Number
			},
			disabled:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return {
				list:[],
				selectedLabel:this.label,
				dataTotal:0,
				dialogShow:false,
				loading:true,
				showed:false,
				queryParams:{
					project_name:'',
					project_no:''
				},
				requestParams:{
					currentPage:1
				},
				selectedItem:null,
				isChange:false
			}
		},
		methods:{
			getData(){
				this.loading = true
				projectApi.getList(this.requestParams).then(res=>{
					this.list=res.data.list
					this.dataTotal=res.data.total
					this.loading = false
				})
			},
			select({row}){
				this.isChange = true
				this.selectedItem = row
				this.selectedLabel = row.name
			},
			showDialog(){
				this.isChange = false
				if(!this.showed){
					this.getData()
				}
				this.selectedLabel = this.label
				this.showed = true
				this.dialogShow = true
			},
			submit(){
				if(this.isChange){
					this.$emit('update:label',this.selectedLabel)
					this.$emit('change',this.selectedItem)
					this.$emit('input',this.selectedItem?this.selectedItem.id:null)
				}				
				this.dialogShow = false
			},
			query(){
				this.requestParams={ ...this.requestParams, ...this.queryParams }
				this.getData()
			},
			clearSelect(){
				this.isChange = true
				this.selectedItem = null
				this.selectedLabel = ''
			},
			resetQuery(){
				this.$refs.formQuery.resetFields()
				this.$refs.formQueryMore.resetFields()
				this.query()
			}
		}
	}
</script>