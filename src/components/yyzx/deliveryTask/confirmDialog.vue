<template>
	<div>
	<el-dialog 
		:title='title'
		class='c-dialog-fixed'
		:visible.sync='show'
		:append-to-body='inDialog'
		width='80%'
		@open='openDialog'
		@close='closeDialog'>
		<div v-loading='loading'>		
			<divider title='发货产品'></divider>	
			<product-list ref='productList' hide-edit-field hide-query no-page sort-prop='index'>
				<el-table-column 
					slot='column' 
					prop='cy_load_area_total' 
					fixed='right' 
					label='实际发货数量面积' 
					align='right' 
					width='130'>
					<template slot-scope='{row}'>
						<span :class='{_red:Number(row.amount)!=Number(row.cy_load_amount_total)}' >{{row.cy_load_amount_total}}{{row.unit}} / {{ row.cy_load_area_total }}㎡</span>
					</template>
				</el-table-column>
			</product-list>
			<divider title='发货任务附件' style='margin-top: 10px'></divider>	
			<el-alert type='warning' title='在此上传修改后的发货清单，确认后将无法修改' style='margin-bottom: 10px'/>
			<attach-upload ref='attachUpload' :params='attachParams' @uploaded='uploaded'></attach-upload>
			<attach-list ref='attachList' show-del></attach-list>
		</div>
			<div slot="footer" v-loading='loading'>
				<el-tooltip content='确认后发货任务的产品数量面积就会与实际发货的数量面积一致'>
					<el-button type='primary' @click='confirm' :loading='loading'>确认</el-button>
				</el-tooltip>		      
		    <el-button @click="show=false">关 闭</el-button>
	  	</div>
		</el-dialog>
	</div>
</template>
<script>
	import taskApi from '@/api/yyzx/deliveryTask'
	import attachUpload from '@/components/common/attach/upload'
	import attachList from '@/components/common/attach/textList'
	import productList from './product/list'

	const formInit = {
		project_id:null,
		project_no:'',
		project_name:'',
		salesman:'',
		company_id:'',
		orders:[],
		remarks:'请提前联系收货人再送货过去！',
		id:null,
		no:'',
		input_status:-1	
	}
	export default {
		components:{ 
			attachUpload,
			attachList,
			productList,
		},
		props:{
			inDialog:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return {
				resolve:null,
				show:false,
				loading:false,
				updated:false,
				data:{ },				
				form:{ ...formInit },
				rules:{
					company_id:[{ required:true, message:'请选择销售公司' }],
					orders:[{ required:true, message:'请填写发货订单' }],
					area_id:[{ required:true, message:'请选择打样工厂' }],
					project:[{ required:true, message:'请填写项目名称' }],
					salesman:[{ required:true, message:'请填写业务员' }],					
					amount:[{ type:'number',message:'请输入数字' }],
					receive_unit:[{ required:true, message:'请填写收货单位' }],
					receive_address:[{ required:true, message:'请填写收货地址' }],
					receive_name:[{ required:true, message:'请填写收货人' }],
					receive_tel:[{ required:true, message:'请填写收货人联系电话' }],
					plan_send_date:[{ required:true, message:'请填写计划发货日期' }],
				},
				params:{
					no:null
				},
				updated:false,
				companyList:[],
				companyLoading:false,
				factoryList:[],
				factoryLoading:false,
				attachParams:{
					table_name:'yyzx_delivery_task',
					table_id:null
				}
			}
		},
		computed:{
			isEdit(){
				return this.form.id? true:false
			},
			title(){
				let title = '发货任务面积确认'
				if(this.form.input_status>=0&&this.form.no){
					title += ' [ '+this.form.no+' ]'
				}
				return title
			}
		},
		mounted(){
		},
		methods:{
			openDialog(){
				this.$nextTick(()=>{
					if(this.resolve){
						this.resolve(this)
					}
				})
			},
			open(){
				this.show = true
				return new Promise((resolve,reject)=>{
					this.resolve = resolve
				}) 
			},
			closeDialog(){				
				if(this.updated){
					this.$emit('updated')
				}
				this.resetFields()
				this.$refs.productList.clear()
			},
			create(){
				this.loading = true
				return new Promise((resolve,reject)=>{
					taskApi.create().then(res=>{
						this.initData( res.data )
						this.loading = false
						resolve()
					})
				})
				
			},
			getForm(id){
				this.loading = true
				taskApi.getForm(id).then(res=>{
					this.initData(res.data)
					this.loading = false
				})
			},
			initData(data){
				this.assign(data)
				this.attachParams.table_id = data.id
				if(data.attach_ids){
					this.$refs.attachList.initData({ attach_ids:data.attach_ids})
				}
				this.$refs.productList.initData({ task_id:data.id })
				this.clearValidate()
			},
			assign(data){
				this.form = { ...this.form, ...data }
				this.form.orders = this.form.order_no?this.form.order_no.split(','):[]
				return this
			},
			 
			 
			clearValidate(){
				this.$nextTick(()=>{
					this.$refs.form && this.$refs.form.clearValidate()
				})
			},
			resetFields(){
				this.updated = false
				this.form = { ...formInit }
				this.clearValidate()
				this.$refs.attachUpload.clear()
				this.$refs.attachList.clear()
				return this
			},
			openProjectDialog(){
				this.$refs.projectDialog.open()
			},			
			uploaded(res){
				this.updated = true
				this.$refs.attachList.push(res)
			},
			confirm({ row,$index }){
	      this.$confirm('您确定已要将发货任务产品的数量面积更新为实际发货产品的数量面积吗？','提示',{
	        type: 'warning'
	      }).then(()=>{
	      	this.loading = true
	        taskApi.loadConfirm(this.form.id).then(res=>{
	          this.$message.success('确认成功')
	          this.$emit('updated')
	          this.loading = false
	          this.show = false
	        }).catch(res=>{
	        	this.loading = false
	        })
	      })
    	},
    	openImportDialog(){
				this.$refs.importDialog.assign({task_id:this.form.id}).open()
			},
		}
	}
</script>
<style scoped>
	._red{
		color:#f44;
	}
</style>