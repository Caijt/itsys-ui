<template>
	<div>		 
		<el-form :model='queryParams' ref='formQuery' :inline='true' style='width:100%'>
			<el-row>
				<el-col :span='24'>
					<el-form-item label='编号' prop='no'>
						<el-input size='small' v-model='queryParams.no' style='max-width:120px'></el-input>
					</el-form-item>
					<el-form-item label='状态' prop='state' >
						<el-select size='small' v-model='queryParams.state' multiple>
							<el-option label='等待发货' value='WAIT'></el-option>
							<el-option label='安排车辆' value='ARRANGE'></el-option>
							<el-option label='车辆运输' value='SENDING'></el-option>
							<el-option label='货物签收' value='RECEIVE'></el-option>
							<el-option label='任务完成' value='FINISH'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label='项目' prop='project' >
						<el-input size='small' v-model='queryParams.project' style='max-width:120px'></el-input>
					</el-form-item>
					<el-form-item>						 
						<el-button type='primary' size='small' @click='query'>查询</el-button>
						<el-popover>
							<el-form ref='formQueryMore' size='small' class='c-form-condensed' :model='queryParams' label-width='80px' style='max-width:600px'>
								<el-row :gutter='10'>
									<el-col :span='12'>
										<el-form-item label='收货单位' prop='receive_unit'>
											<el-input v-model='queryParams.receive_unit'></el-input>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='收货地址' prop='receive_address'>
											<el-input v-model='queryParams.receive_address'></el-input>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='收货人' prop='receive_name'>
											<el-input v-model='queryParams.receive_name'></el-input>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='收货电话' prop='receive_tel'>
											<el-input  v-model='queryParams.receive_tel'></el-input>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='合同号' prop='contract_no'>
											<el-input v-model='queryParams.contract_no'></el-input>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='调拨单号' prop='db_no'>
											<el-input v-model='queryParams.db_no'></el-input>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='发货申请' prop='fh_no'>
											<el-input v-model='queryParams.fh_no' placeholder='发货申请编号'></el-input>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='订单号' prop='order_no'>
											<el-input v-model='queryParams.order_no'></el-input>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='业务单位' prop='salesman_unit'>
											<el-input v-model='queryParams.salesman_unit'></el-input>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='业务员' prop='salesman_name'>
											<el-input v-model='queryParams.salesman_name'></el-input>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='业务电话' prop='salesman_tel'>
											<el-input v-model='queryParams.salesman_tel'></el-input>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='交付方式' prop='method'>
											<el-input  v-model='queryParams.method'></el-input>
										</el-form-item>
									</el-col>
								</el-row>								
							</el-form>
						  <el-button size='small' slot="reference">更多条件</el-button>
						</el-popover>
						<el-button size='small' @click='queryReset'>重置</el-button>
						<el-tooltip content="将查询结果导出EXCEL文件" >						
							<el-button size='small' @click='exportExcel'>导出</el-button>	
						</el-tooltip>		
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<el-tabs v-model='pageConfig.task_range' type="card" @tab-click="tabClick">
			<el-tab-pane label='任务进行中' name='ing'></el-tab-pane>
			<el-tab-pane label='任务完成' name='finish'></el-tab-pane>
		</el-tabs>
		<el-table 
			border 
			:data='taskList' 
			v-loading.body="loading" 
			@expand-change='tableExpand'>
			<el-table-column type="expand">
      <template slot-scope="props" >
      	<el-steps :active="getStep(props.row.state)"  finish-status='success'	 >
				  <el-step title="等待发货" >
				  	<span slot='description'>{{props.row.start_time | formatDate}}</span>
				  </el-step>
				  <el-step title="安排车辆" :description='props.row.arrange_time'>
				  	<span slot='description'>{{props.row.arrange_time | formatDate}}</span>
				  </el-step>
				  <el-step title="车辆运输" :description='props.row.send_time'>
				  	<span slot='description'>{{props.row.send_time | formatDate}}</span>
				  </el-step>
				  <el-step title="货物签收" :description='props.row.receive_time'>
				  	<span slot='description'>{{props.row.receive_time | formatDate}}</span>
				  </el-step>
				  <el-step title="发货完成" :description='props.row.finish_time'>
				  	<span slot='description'>{{props.row.finish_time | formatDate}}</span>
				  </el-step>
				</el-steps>
				<el-tabs value='info' v-loading='!props.row.detailsLoaded'>
			    <el-tab-pane label="任务信息" name="info">
			    	<el-form label-width='100px' class='c-form-text'>
		        	<el-row>
		        		<el-col :span='12'>
		        			<el-form-item label="合同单号">
			            	<span>{{ props.row.contract_no}}</span>
			          	</el-form-item>
		        			<el-form-item label="调拨单号">
			            	<span>{{ props.row.db_no}}</span>
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
			    	<el-table :data='props.row.prodList' >
			    		<el-table-column prop='index' label='序号' width="80"></el-table-column>
			    		<el-table-column prop='name' label='材料名称'></el-table-column>
			    		<el-table-column prop='size' label='规格/尺寸'></el-table-column>
			    		<el-table-column prop='unit' width='80' label='单位'></el-table-column>
			    		<el-table-column prop='number' width='80' label='数量'></el-table-column>
			    		<el-table-column prop='remarks' label='其它要求'></el-table-column>
			    	</el-table>
			    </el-tab-pane>
			    <el-tab-pane label="发货车辆" name="car">
			    	<el-table :data='props.row.carList' @expand-change='carTableExpand'>
			    		<el-table-column type="expand">
						<template slot-scope="props">
							<el-steps :active="getCarStep(props.row.state)" finish-status='success'>
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
									<el-tag size='mini' :type='carStateColor(scope.row.state)'>{{carStateText(scope.row.state)}}</el-tag>
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
					<el-tag size='mini' :type='stateColor(scope.row.state)'>{{stateText(scope.row.state)}}</el-tag>
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
		</el-table>
		<el-pagination		 
      layout="total,sizes, prev, pager, next, jumper"
      :total="pageConfig.total" style='margin-top: 10px' :page-size='10' :current-page.sync='pageConfig.page' @current-change='currentChange' @size-change='sizeChange'>
    </el-pagination>
	</div>
</template>
<script>
	export default{
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
					task_range:'ing',
					size:10,
					total:0,
					page:1
				}
			}
		},
		created(){
			this.getData();
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
			//表格项目展开事件
			tableExpand(row,expanded){
				if(expanded){
					if(expanded){
						this.$set(row,'detailsLoaded',false);
						this.$http.get('/service/pc/yyzx/prod_send_task/getTaskDetails',{params:{task_id:row.id}}).then(res=>{
								row.prodList=res.data.prodList;
								row.attachList=res.data.attachList;
								row.carList=res.data.carList;
								row.detailsLoaded=true;
						})
					}
				}
			},
			getData(){
				this.loading=true;
				this.$http.post('/service/pc/sale/prod_send_task/getTaskList',this.pageConfig).then((res)=>{
					this.taskList=res.data;
					this.pageConfig.total=Number(res.total);
	  			this.loading=false;	
		    })
			},
			copy(s){
				this.$router.push({
					path:'/sale/delivery/add',
					query:{
						copy:s.row.id
					}
				});
			},
			print(s){
				this.$router.push({
					path:'/sale/delivery/print/'+s.row.id,
				})
			},
			edit(s){
				this.$router.push({
					path:'/sale/delivery/edit/'+s.row.id,
				})
			},
			del(s){
				this.$confirm('确定要删除此任务单？','提示',{
					type:'warning'	
				}).then(()=>{
					this.loading=true;
					this.$http.post('/service/pc/sale/prod_send_task/delTask',{id:s.row.id}).then((r)=>{
						this.taskList.splice(s.$index, 1);
						this.pageConfig.total--;
		  			this.loading=false;
			    })
				});
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
						type='货物签收';
						break;
				}
				return type;
			},
			stateColor(s){
				let type=''
				switch(s){
					case 'WAIT':
						type='info';
						break;
					case 'ARRANGE':
						type='';
						break;
					case 'SENDING':
						type='danger';
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
			viewImg(img){
				window.open('/upload/prod_send_task/'+img.id+'.'+img.ext);
			},
			exportExcel(){
				let queryStr=this.$qs.stringify(this.pageConfig);
				window.location.href='/service/pc/sale/prod_send_task/exportExcel?'+queryStr;
			},
			downAttach(a){
				window.location='/service/pc/yyzx/prod_send_task/downAttach/id/'+a.row.id;
			},
			carStateText(s){
				let type=''
				switch(s){
					case 'WAIT':
						type='未发车';
						break;
					case 'SENDING':
						type='运输中';
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
			carStateColor(s){
				let type=''
				switch(s){
					case 'WAIT':
						type='gray';
						break;
					case 'SENDING':
						type='primary';
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
			//表格项目展开事件
			carTableExpand(row,expanded){
				if(expanded){					
					if(!row.imgLoaded){
						this.$set(row,'imgLoaded',false);
						this.$http.get('/service/pc/cyzx/send_task_track/getImgList',{params:{car_id:row.id}}).then(res=>{
								row.imgList=res.data;
								row.imgLoaded=true;
						})
					}
				}
			},
			getCarStep(state){
				let step=1;
				switch(state){
					case 'WAIT':
						step=1;
						break;
					case 'SENDING':
						step=2;
						break;
					case 'RECEIVE':
						step=3;
						break;
				}
				return step;
			}
		}
	}
</script>
<style>
	
</style>