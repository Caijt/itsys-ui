<template>
	<div>		
		<el-alert title='当发货任务提交后，储运中心就可以查看到提交的任务，并根据任务安排发货车辆' type='warning' style='margin-bottom: 10px'></el-alert>
		<div style='margin:10px 0px'>
			<el-button type='primary' size='small' @click='create'>创建发货任务</el-button>
		</div> 
		<el-tabs v-model='pageConfig.task_range' @tab-click="tabClick">
			<el-tab-pane label='我的草稿' name='draft'></el-tab-pane>
			<el-tab-pane label='我提交的' name='my'></el-tab-pane>
			<el-tab-pane label='全部任务' name='all'></el-tab-pane>
		</el-tabs>
		<el-table border :data='taskList'  v-loading.body="loading" @expand-change='tableExpand'>
			<el-table-column type="expand">
      <template slot-scope="props" >
      	<el-steps :active="getStep(props.row.state)" align-center center finish-status='success'	 style='padding:10px 40px 20px'>
				  <el-step title="等待发货" :description='props.row.start_time'></el-step>
				  <el-step title="安排车辆" :description='props.row.arrange_time'></el-step>
				  <el-step title="车辆运输" :description='props.row.send_time'>
				  </el-step>
				  <el-step title="货物签收" :description='props.row.receive_time'></el-step>
				  <el-step title="发货完成" :description='props.row.finish_time'></el-step>
				</el-steps>
				<el-tabs value='info' v-loading='!props.row.detailsLoaded'>
			    <el-tab-pane label="任务信息" name="info">
			    	<el-form label-width='100px' class='form-view'>
		        	<el-row>
		        		<el-col :span='12'>
		        			<el-form-item label="合同号">
			            	<span>{{ props.row.contract_no }}</span>
			          	</el-form-item>
		        			<el-form-item label="调拨单号">
			            	<span>{{ props.row.db_no }}</span>
			          	</el-form-item>
			          	<el-form-item label="发货申请编号">
			            	<span>{{ props.row.fh_no }}</span>
			          	</el-form-item>
			          	<el-form-item label="订单号">
			            	<span>{{ props.row.order_no }}</span>
			          	</el-form-item>
			          	<el-form-item label="业务单位">
			            	<span>{{ props.row.salesman_unit }}</span>
			          	</el-form-item>
			          	<el-form-item label="业务员">
			            	<span>{{ props.row.salesman_name }}</span>
			          	</el-form-item>
			          	<el-form-item label="联系电话">
			            	<span>{{ props.row.salesman_tel }}</span>
			          	</el-form-item>
		        		</el-col>
			        	<el-col :span='12'>
			        		<el-form-item label="计划送货日期">
			            	<span>{{ props.row.plan_send_date }}</span>
			          	</el-form-item>
			          	<el-form-item label="交付方式">
			            	<span>{{ props.row.method }}</span>
			          	</el-form-item>
			          	<el-form-item label="收货单位">
			            	<span>{{ props.row.receive_unit }}</span>
			          	</el-form-item>
			          	<el-form-item label="收货地址">
			            	<span>{{ props.row.receive_address }}</span>
			          	</el-form-item>
			          	<el-form-item label="收货人">
			            	<span>{{ props.row.receive_name }}</span>
			          	</el-form-item>
			          	<el-form-item label="联系电话">
			            	<span>{{ props.row.receive_tel }}</span>
			          	</el-form-item>
			        	</el-col>	        	
		        	</el-row>
        		</el-form>
			    </el-tab-pane>
			    <el-tab-pane label="发货列表" name="list">
			    	<el-table :data='props.row.prodList' :default-sort='{prop:"index"}'>
			    		<el-table-column prop='index' label='序号' width="80"></el-table-column>
			    		<el-table-column prop='name'  label='材料名称'></el-table-column>
			    		<el-table-column prop='size' label='规格/尺寸'></el-table-column>
			    		<el-table-column prop='unit' width='80' label='单位'></el-table-column>
			    		<el-table-column prop='number' width='80' label='数量'></el-table-column>
			    		<el-table-column prop='remarks' label='其它要求'></el-table-column>
			    	</el-table>
			    </el-tab-pane>
			    <el-tab-pane label="发货车辆" name="car">
			    	<el-table :data='props.row.carList' @expand='carTableExpand'>
			    		<el-table-column type="expand">
						<template slot-scope="props">
							<el-steps :active="getCarStep(props.row.state)" align-center center finish-status='success'	 style='padding:10px 40px 20px'>
							  <el-step title="货物装车" :description='$moment(props.row.create_time).format("YYYY-MM-DD HH:mm")'></el-step>
							  <el-step title="车辆发货" :description='props.row.send_time?$moment(props.row.send_time).format("YYYY-MM-DD HH:mm"):""'>
							  </el-step>
							  <el-step title="收货人签收" :description='props.row.receive_time?$moment(props.row.receive_time).format("YYYY-MM-DD HH:mm"):""'></el-step>
							</el-steps>
							<el-tabs value='img'>
								<el-tab-pane label="收货签收图" name="img" v-loading='false===props.row.imgLoaded'>
						    	<p style='text-align: center;color: #999' v-if='undefined===props.row.imgList||props.row.imgList.length<=0'>未上传收货签收图</p>
						    	<el-row :gutter='20'>
						    		<el-col :span='6' v-for='img in props.row.imgList' :key='img.id' style='margin-bottom: 20px'>
						    			<el-card :body-style="{ padding: '0px' }" >
									      <img :src='"/upload/prod_send_task/"+img.id+"_300.jpg"' style='max-width: 100%;cursor: pointer;' @click='viewImg(img)'>
									      <div style="padding: 14px;">
									        <span>{{img.name}}</span>
									        <div class="bottom clearfix" style='margin-top:13px;'>
									          <time class="time" style='font-size: 13px;color:#999'>{{ img.create_time }}</time>
									        </div>
									      </div>
									    </el-card>
						    		</el-col>
						    	</el-row>
						    </el-tab-pane>
					    </el-tabs>
						</template>
					</el-table-column>
			    		<el-table-column prop='state' label='状态' width="100">
			    			<template slot-scope='scope'>
									<el-tag :type='carStateColor(scope.row.state)'>{{carStateText(scope.row.state)}}</el-tag>
								</template>
			    		</el-table-column>
			    		<el-table-column prop='sign' label='车辆标记' width="100"></el-table-column>
			    		<el-table-column prop='no' label='车牌号码'></el-table-column>
			    		<el-table-column prop='name' label='司机姓名'></el-table-column>
			    		<el-table-column prop='tel' label='司机手机'></el-table-column>
			    		<el-table-column prop='unit' label='车辆单位'></el-table-column>
			    	</el-table>
			    </el-tab-pane>
			    <el-tab-pane label="附件" name="attach">
			    	<el-table :data='props.row.attachList'>
			    		<el-table-column prop='name' label='附件名'></el-table-column>
			    		<el-table-column prop='upload_date' label='上传日期' width='150'></el-table-column>
			    		<el-table-column label='操作' width='150'>
			    			<template slot-scope='props'>
			    				<el-button type='text' size='small' @click='downAttach(props)'>下载</el-button>
			    			</template>
			    		</el-table-column>
			    	</el-table>
			    </el-tab-pane>
			  </el-tabs>
      </template>
    </el-table-column>
			<el-table-column  width='80' align='center' label='状态'>
				<template slot-scope='scope'>
					<el-tag :type='stateColor(scope.row.state)'>{{stateText(scope.row.state)}}</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop='no' width='120' label='任务编号'></el-table-column>
			<el-table-column prop='project' min-width='100' label='项目名称'></el-table-column>
			<el-table-column prop='receive_unit' min-width='100' label='收货单位'></el-table-column>
			<el-table-column prop='maker' width='100' label='制单人'></el-table-column>
			<el-table-column prop='start_time' width='160' label='创建时间'>
				<template slot-scope='scope'>
					{{scope.row.start_time?$moment(scope.row.start_time).format("YYYY-MM-DD HH:mm"):$moment(scope.row.create_time).format("YYYY-MM-DD HH:mm")}}
				</template>
			</el-table-column>
			<el-table-column label='操作' width='90' header-align='center' align='center'>
				<template slot-scope='scope'>					
					<el-dropdown>
						<el-button size='mini' type='primary'>
							操作<i class="el-icon-caret-bottom el-icon--right"></i>	
						</el-button>
					  <el-dropdown-menu slot="dropdown">
					    <el-dropdown-item @click.native='edit(scope)' :disabled='!hasAdmin(scope)'>修改</el-dropdown-item>
					    <el-dropdown-item @click.native='copy(scope)'>拷贝新增</el-dropdown-item>
					    <el-dropdown-item @click.native='del(scope)' :disabled='!hasAdmin(scope)'>删除</el-dropdown-item>
					    <el-dropdown-item @click.native='print(scope)' :disabled='!hasAdmin(scope)'>打印</el-dropdown-item>
					  </el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination		 
      layout="total,sizes, prev, pager, next, jumper"
      :total="pageConfig.total" style='margin-top: 10px' :page-size='10' :current-page.sync='pageConfig.page' @current-change='currentChange' @size-change='sizeChange'>
    </el-pagination>
    <list ref='list'>
    	<el-table-column slot='column' label='操作' fixed='right' width='100' align='center'>
    		<template slot-scope='scope'>
    			<el-button size='mini' type='text' @click='edit(scope)'>编辑</el-button>
    			<el-button size='mini' type='text' @click='del(scope)'>删除</el-button>
    		</template>
    	</el-table-column>
    </list>
    <form-dialog ref='formDialog' @saved='reload'></form-dialog>
	</div>
</template>
<script>
	import list from '@/components/yyzx/deliveryTask/list'
	import deliveryTask from '@/api/yyzx/deliveryTask'
	import formDialog from '@/components/yyzx/deliveryTask/formDialog'
	export default{
		components:{ list, formDialog },
		data(){
			return {
				dialogMoreShow:false,
				loading:true,
				taskList:[],
				queryParams:{					
					no:'',
					state:[],
					receive_unit:'',
					project:'',
					receive_name:'',
					receive_tel:'',
					contract_no:'',
					db_no:'',
					fh_no:'',
					order_no:'',
					salesman_unit:'',
					salesman_name:'',
					salesman_tel:'',
					method:'',
					driver_unit:'',
					driver_name:'',
					driver_car:'',
					driver_tel:''
				},
				pageConfig:{
					task_range:'my',
					size:10,
					total:0,
					page:1
				}
			}
		},
		created(){
			this.getData();
		},
		mounted(){
			this.$refs.list.initData()
		},
		methods:{
			//表格当前页改变事件
			currentChange(val){
				this.pageConfig.page=val;
				this.getData();
			},
			//表格页大小改变事件
			sizeChange(val){
				this.pageConfig.size=val;
				this.getData();
			},
			tabClick(t){
				this.getData();
			},
			create(){
				this.$refs.formDialog.open()
			},
			//表格项目展开事件
			tableExpand(row,expanded){
				if(expanded){
					if(expanded){
						this.$set(row,'detailsLoaded',false);
						this.$http.get('/api2/pc/yyzx/prod_send_task/getTaskDetails',{params:{task_id:row.id}}).then(res=>{
							if(res.data.success){
								row.prodList = res.data.data.prodList;
								row.attachList = res.data.data.attachList;
								row.carList = res.data.data.carList;
								row.detailsLoaded = true;
							}
						})
					}
				}
			},
			getData(){
				this.loading=true;
				deliveryTask.getList(this.pageConfig).then(res=>{
					console.log(res)
					this.taskList=res.data.list;
					this.pageConfig.total = Number(res.data.total);
	  			this.loading = false;
				})
			},
			copy(s){
				this.$router.push({
					path:'/yyzx/sendtask/add',
					query:{
						copy:s.row.id
					}
				});
			},
			edit({row}){
				this.$refs.formDialog.open(row)
			},
			del(s){
				if(s.row.state!='WAIT'){
					this.$alert('只能删除状态为等待发货的任务！',{type:'error'});
					return false;
				}
				this.$confirm('确定要删除此任务单？','提示',{
					type:'warning'	
				}).then(()=>{
					this.loading=true;
					this.$http.post('/api2/pc/yyzx/prod_send_task/delTask',{id:s.row.id}).then((r)=>{
						if(r.data.success){
							this.taskList.splice(s.$index, 1);
							this.pageConfig.total--;
			  			this.loading=false;
						}else{
							this.$message({
								message:r.data.message,
								type:'error'
							})
						}		  		
			    }).catch((res)=>{
		    		
		    	})
				});
			},
			hasAdmin(s){
				let d=sessionStorage.getItem("user_id")==s.row.create_user;				
				return d;
			},
			stateText(s){
				let type='草稿'
				switch(s){
					case 'WAIT':
						type='等待发货';
						break;
					case 'ARRANGE':
						type='安排车辆';
						break;
					case 'SENDING':
						type='车辆运输';
						break;
					case 'FINISH':
						type='发货完成';
						break;
					case 'RECEIVE':
						type='已签收';
						break;
					case 'SUBMIT':
						type='待审核';
						break;
				}
				return type;
			},
			stateColor(s){
				let type=''
				switch(s){
					case 'WAIT':
						type='gray';
						break;
					case 'ARRANGE':
						type='';
						break;
					case 'SENDING':
						type='primary';
						break;
					case 'FINISH':
						type='success';
						break;
					case 'RECEIVE':
						type='warning';
						break;
					case 'SUBMIT':
						type='danger';
						break;
				}
				return type;
			},
			getStep(state){
				let step=0;
				switch(state){
					case 'WAIT':
						step=1;
						break;
					case 'ARRANGE':
						step=2;
						break;
					case 'SENDING':
						step=3;
						break;
					case 'RECEIVE':
						step=4;
						break;
					case 'SUBMIT':
						step=4;
						break;
					case 'FINISH':
						step=5;
						break;
				}
				return step;
			},
			//查询条件重置
			queryReset(){
				this.$refs.formQuery.resetFields();
				this.$refs.formQueryMore.resetFields();
			},
			query(){
				Object.assign(this.pageConfig,this.queryParams)
				this.getData();
			},
			exportExcel(){
				let queryStr=this.$qs.stringify(this.pageConfig);
				console.log(queryStr);
				window.location.href='/api2/pc/yyzx/prod_send_task/exportExcel?'+queryStr;
			},
			
			reload(){
				this.$refs.list.reload()
			},
			del(scope){
				this.$refs.list.del(scope)
			}
			
		
			

		}
	}
</script>
<style>
	
</style>