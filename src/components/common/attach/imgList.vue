<!-- 
此组件初始化时不会自动加载数据，请在mounted中 this.$refs.[].initData() 初始化数据
如果放在dialog里面的吗，请在dialog的open事件中用this.$nextTick进行初始化数据
 -->
<template>
	<div v-loading='loading'>	
		<el-row :gutter='10'>
			<el-col :span='6' v-for='(item,index) in list' :key='item.id' style='margin-bottom:5px'>
				<el-card shadow='hover' :body-style="{ padding: '0px' }">
		      <img :src="'/upload/attach/'+item.save_name+'_thumb_300.jpg'" style='width: 100%;cursor: pointer;' @click='openImg(item)'>
		      <div style='padding:0px 10px 5px'>
		      	<div>
			        <el-tooltip placement='top' >
								<div slot='content'>
									附件大小：{{ Math.round(item.size/100)/10 }}KB｜上传时间：{{$commonJs.formatDate(item.upload_time)}}
									<div v-show='showDel'>
										<el-button type='text' size='mini' icon='el-icon-delete' @click='delAttach(item,index)'>附件删除</el-button>
									</div>
								</div>
								<el-button icon="el-icon-picture" type='text' @click='download(item)'>{{item.name}}</el-button>
							</el-tooltip>
						</div>
						<div style='font-size: 12px;color:#999;'>
			      	{{$commonJs.formatDate(item.upload_time)}}
			      </div>
		      </div>
		    </el-card>
			</el-col>
		</el-row>
		<!-- <span v-for='(item,index) in list' :key='item.id' style='margin-right:5px'>
			<el-tooltip placement='top' >
				<div slot='content'>
					附件大小：{{ Math.round(item.size/100)/10 }}KB｜上传时间：{{$commonJs.formatDate(item.upload_time)}}
					<div v-show='showDel'>
						<el-button type='text' size='mini' icon='el-icon-delete' @click='delAttach(item,index)'>附件删除</el-button>
					</div>
				</div>
				<el-button icon="el-icon-document" type='text' @click='download(item)'>{{item.name}}</el-button>
			</el-tooltip>
		</span> -->
	</div>
</template>
<script>
import attachApi from '@/api/attach'

export default {
	components:{  },
	props:{
		size:{
			type:String,
			default:''
		},
		attach_field:{
			type:String,
			default:'attach_ids'
		},
		maxHeight:{
			default:350
		},
		params:{
			default:()=>({})
		},
		inDialog:{
			type:Boolean,
			default:false
		},
		hideQuery:{
			type:Boolean,
			default:false
		},
		noPage:{
			type:Boolean,
			default:false
		},
		showDel:{
			type:Boolean,
			default:false
		}
	},
	data(){
		return {
			loading: false,			
			list:[],
			dataTotal:0,		
			queryShowMore:false,			
			//数据请求的参数
			requestParams:{
				isAttachIds:1,
				noPage:1
			}	
		}
	},
	created(){
		//this.getData()
	},
	methods:{
		initData(p){
			this.requestParams = { noPage:1,...this.params,...p}
			this.getData()
		},
		reload(){
			this.getData()
		},		
		//获取数据
		getData() {
			this.loading=true
			attachApi.getList(this.requestParams,...this.params).then(res=>{
				this.list = res.data.list
				this.dataTotal = res.data.total
				this.loading = false
			})
		},
		push(data){
			this.list.push(data)
		},
		download(item){
			attachApi.down(item.id)
		},
		openImg(item){
			attachApi.download(item.save_name)
		},
		clear(){
    	this.list = []
    	this.dataTotal = 0
    },
    delAttach(item,index){
			this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      	this.loading = true
      	attachApi.delImg({id:item.id,attach_field:this.attach_field}).then(res=>{
      		this.list.splice(index,1)
      		this.$message.success('删除成功!')
          this.loading = false
          this.$emit('del') 
      	})
      })
		},
	}
}
</script>