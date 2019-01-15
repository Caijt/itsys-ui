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
			<divider title='报废信息'></divider>
			<el-form 
				:model='form' :rules='rules' 
				ref='form' label-width='100px' 
				size='mini' status-icon
				class='c-form-mini' >
				<el-form-item label='报废资产' prop='asset_id' :inline-message='true'>
					<el-button type='primary' :disabled='form.input_status>=0' @click='openSelectAssetDialog'>{{ form.asset_id?('['+form.asset_no+'] '+form.asset_model):'选择IT资产'}}</el-button>
				</el-form-item>
				<el-row :gutter='10'>
					<el-col :span='8'>
						<el-form-item label='报废日期' prop='scrap_date'>
							<el-date-picker 
								v-model='form.scrap_date' 
								value-format='yyyy-MM-dd' 
								style='width: 100%' />
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='库存数量' >
							<span>{{form.remain}}</span>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label='报废数量' prop='amount'>
							<el-input v-model.number='form.amount'/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label='报废原因' prop='reason' >
					<el-input type='textarea' v-model='form.reason' placeholder=''>
					</el-input>
				</el-form-item>
			</el-form>		
		</div>
			<div slot="footer" v-loading='loading'>
				<el-button type='primary' @click='save(0)' :loading='loading'>保存</el-button>
		    <el-button @click="show=false">关 闭</el-button>
	  	</div>
		</el-dialog>
		<asset-list-dialog :params='{isFree:1}' :in-dialog='inDialog' ref='assetListDialog'>
			<el-table-column slot='column' fixed='right' width='60' align='center' label='操作'>
				<template slot-scope='{row}'>
					<el-button type='text' @click='selectAsset(row)'>选择</el-button>
				</template>
			</el-table-column>
		</asset-list-dialog>
	</div>
</template>
<script>
	import assetScrapRecordApi from '@/api/it/assetScrapRecord'
	import assetListDialog from '../listDialog'

	const formInit = {		
		model:'',		
		asset_id:null,
		id:null,
		no:'',
		input_status:-1	,
		scrap_date:new Date(),
		remain:0
	}
	export default {
		components:{
			assetListDialog
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
				maxScrapAmount:0,
				rules:{
					asset_id:[{ required:true, message:'请选择报废资产' }],	
					scrap_date:[{ required:true, message:'请填写报废日期' }],
					amount:[
						{ required:true, message:'请填写资产报废数量' },
						{ type:'number',message:'请输入数字' },
						{ validator:this.$commonJs.validateRules.et0 },
						{ validator:(rule,value,callback)=>{
							if(value>this.maxScrapAmount){
								callback(new Error('报废数量大于库存数量'))
							}else{
								callback()
							}
						}}
					],
				},
				params:{
					no:null
				},
				updated:false,
			}
		},
		computed:{
			isEdit(){
				return this.form.id? true:false
			},
			isSubmit(){
				return this.form.input_status>=1
			},
			title(){
				let title = 'IT资产报废记录'
				if(this.form.input_status>=0){
					title += ' [ 修改 ]'
				}else{
					title += ' [ 新增 ]'
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
			},
			create(){
				this.loading = true
				return new Promise((resolve,reject)=>{
					assetScrapRecordApi.create().then(res=>{
						this.initData( res.data )
					 	this.loading = false
						resolve()
					})
				})
			},
			getForm(id){
				this.loading = true
				assetScrapRecordApi.getForm(id).then(res=>{
					this.initData(res.data)
					this.loading = false
				})
			},
			initData(data){
				this.assign(data)
				this.maxScrapAmount = this.form.remain + this.form.amount
				this.clearValidate()
			},
			assign(data){
				this.form = { ...this.form, ...data }
				this.form.price = Number(this.form.price)
				return this
			},
			save(status=0){
				this.$refs.form.validate(valid=>{
					if(valid){
						this.form.action = status
						if(status){
							
						}else{
							this.update()
						}
					}else{
						return false
					}
				})
			},
			update(){
				this.loading = true
				let messageText = this.form.action?'提交成功':'保存成功'
				assetScrapRecordApi.update(this.form).then(res=>{
					this.form.no = res.data.no
					this.form.input_status = res.data.input_status
					this.loading = false
					this.$message.success(messageText)
					this.updated = true
					if(this.form.action==1){
						this.show=false									
					}
				}).catch(res=>{
					this.loading = false
					console.log(res)
				})
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
				return this
			},	
			openSelectAssetDialog(){
				this.$refs.assetListDialog.open().then(that=>{
					that.$refs.list.initData()
				})
			},
			selectAsset(row){
				this.form.asset_id = row.id
				this.form.asset_model = row.model
				this.form.asset_no = row.no
				this.form.remain = row.remain
				this.$refs.assetListDialog.close()
			},
		}
	}
</script>