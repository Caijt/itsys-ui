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
			<upload 
				type='img' 
				:params='uploadParams'
				img-compress
				@uploaded='imgUpload'></upload>
			<divider title='签收图片'></divider>
			<img-list 
				attach_field='img_attach_ids' 
				ref='imgList' 
				show-del 
				@del='updated=true' />
		</div>
		<span slot="footer">
		 	<el-tooltip content='签收图片已通过确认后请点击此按钮进行提交'>
		 		<el-button type='success' @click='review' :loading='loading'>审核通过</el-button>
		 	</el-tooltip>
	    <el-button @click="show=false">关 闭</el-button>
  	</span>
	</el-dialog>
</div>
</template>
<script>
	import carApi from '@/api/cy/deliveryCar'
	import editDialog from './editDialog'
	import carList from './list'
	import print from './print'
	import imgList from '@/components/common/attach/imgList'
	import upload from '@/components/common/attach/upload'

	const formInit = {
		id:null,
		no:''
	}
	export default {
		components:{ 
			editDialog,
			carList,
			print,
			imgList,
			upload
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
				params:{
					no:null
				},
				updated:false,
				companyList:[],
				companyLoading:false,
				factoryList:[],
				factoryLoading:false,
				uploadParams:{
					table_name:'cy_delivery_car',
					table_id:null,
					attach_field:'img_attach_ids'
				}
			}
		},
		computed:{
			isEdit(){
				return this.form.id? true:false
			},
			title(){
				let title = '车辆签收审核'
				if(this.isEdit){
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
			getForm(id){
				this.loading = true
				carApi.getTaskForm(id).then(res=>{
					this.initData(res.data)
					this.loading = false
				})
			},
			submit(){				
				this.$confirm('确定提交打样申请？','提示',{
					type: 'warning'
				}).then(()=>{
					this.save(1)
				})
			},
			saved(){
				this.show=false
				this.$emit('saved')
			},
			closeDialog(){	
				if(this.updated){
					this.$emit('updated')
				}
				this.resetFields()
				this.$refs.imgList.clear()
				this.loading = false
			},
			initData(data){
				this.assign(data)
				this.uploadParams.table_id = data.id
				this.$refs.imgList.initData({attach_ids:data.img_attach_ids})
			},
			assign(data){				
				this.form = { ...this.form, ...data }
				return this
			},
			clearValidate(){
				this.$nextTick(()=>{
					this.$refs.form && this.$refs.form.clearValidate()
				})
			},
			resetFields(){
				this.updated = false
				this.form = {...formInit}
				this.clearValidate()
				return this
			},
			addCar(){
				this.$refs.editDialog.open().then(that=>{
					that.create( { task_id:this.form.id } )
				}).catch(res=>{
					console.log(res)
				})
			},
			editCar({row}){
				this.$refs.editDialog.open().then(that=>{
					that.getForm(row.id)
				})
			},
			delCar(scope){
				this.$refs.editList.del(scope)
			},
			printCar(scope){
				this.$refs.print.open().then(that=>{
					that.get(scope.row.id)
				})
				//this.$refs.carList.del(scope)
			},
			imgUpload(res){
				this.updated = true
				this.$refs.imgList.push(res)
			},
			carUpdated(){
				this.updated = true
			},
			review(){
				this.$confirm('您确认签收图片已通过审核？通过后，签收图片将无法添加或修改。', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        	this.loading = true
          carApi.review({id:this.form.id}).then(res=>{
          	this.$message.success('审核通过成功')
          	this.updated = true
          	this.show = false
          	this.loading = false
          })
        })
			}
		}
	}
</script>