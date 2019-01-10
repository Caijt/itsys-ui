<template >
<div>
	<el-dialog 
		class='c-dialog-fixed' 
		:visible.sync='dialogShow' 
		:title='project.name?"【 "+project.name+" 】 项目详情":"加载中..."' 
		ref='dialog'
		width='90%'
		:append-to-body='inDialog'
		@open='openDialog'
	>
	<div v-loading='loading'>
		<el-alert 
	    title="以下部门的项目信息尚未完善，请提醒相关人员进行项目信息完善！"
	    type="warning"
	    show-icon
	    :closable='false'
	    style='margin-bottom:10px'
	    v-if='hasTodo()'>
	    <div>
	    	<notice v-for='(a,key) in areas' v-if='hasTodo(key)' :key='key'>
	    		<el-button type='text' size='mini' >[{{ a }}]</el-button>
	    	</notice>
	    </div>
	  </el-alert>
    <el-alert 
	    title="以下部门的项目信息有更新信息，请及时查看！"
	    type="success"
	    show-icon
	    :closable='false'
	    style='margin-bottom:10px'
	    v-if='hasUpdate()'>
	    <div>
	    	<el-button 
	    		type='text' 
	    		size='mini' 
	    		v-for='(a,key) in areas' 
	    		v-if='hasUpdate(key)' 
	    		:key='key'
	    		@click='jump(key)'>
	    		[{{a}}]
	    	</el-button>
	    </div>
  	</el-alert>
  	<el-alert 
	    title="以下部门反馈的问题仍未得到处理，请及时到反馈处理平台进行处理！"
	    type="error"
	    show-icon
	    :closable='false'
	    style='margin-bottom:10px'
	    v-if='hasProblem()'>
	    <div>
	    	<el-button 
	    		type='text' 
	    		size='mini' 
	    		v-for='(a,key) in areas' 
	    		v-if='hasProblem(key)' 
	    		:key='key'
	    		@click='jump(key)'>
	    		[{{a}}]
	    	</el-button>
	    </div>
	  </el-alert>
		<div>
			<b>立项信息</b>
		</div>
		<el-row style='margin-bottom:20px'>
			<el-col :span='16'>
				<el-form class='c-form-text' label-width='100px'>
					<el-row>
						<el-col :span='12'>
							<el-form-item label='项目编号'>
								<span>{{ project.no }}</span>
							</el-form-item>
							<el-form-item label='项目名称'>
								<span>{{ project.name }}</span>
							</el-form-item>
							<el-form-item label='开发商'>
								<span>{{ project.dev }}</span>
							</el-form-item>
							<el-form-item label='客户名称'>
								<span>{{ project.customer_name }}</span>
							</el-form-item>
							<el-form-item label='客户类别'>
								<span>{{ project.customer_type }}</span>
							</el-form-item>
							<el-form-item label='业绩公司'>
								<span>{{ project.company_name }}</span>
							</el-form-item>
							<el-form-item label='项目地点'>
								<span>{{ project.place }}</span>
							</el-form-item>
							<el-form-item label='业务员'>
								<span>{{ project.salesman }}</span>
							</el-form-item>
						</el-col>
						<el-col :span='12'>
							<el-form-item label='项目结算面积'>
								<span>{{ project.settlement_area_total }}㎡</span>
							</el-form-item>
							<el-form-item label='项目结算金额'>
								<span>￥{{ project.settlement_price_total }}</span>
							</el-form-item>
							<el-form-item label='录入员'>
								<span>{{ project.create_user_name}}</span>
							</el-form-item>
							<el-form-item label='创建时间'>
								<span>{{ $commonJs.formatDate(project.create_time) }}</span>
							</el-form-item>
							<!-- <el-form-item label='更新者'>
								<span>蔡锦钿</span>
							</el-form-item> -->
							<el-form-item label='更新时间'>
								<span>{{ $commonJs.formatDate(project.update_time) }}</span>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</el-col>
			<el-col :span='8' style='text-align: center;'>
				<div style='margin-bottom: 10px'><strong>项目信息完善率</strong></div>
				<el-progress :stroke-width='10' type='circle' :percentage="projectInfoPercentage"></el-progress>
			</el-col>
		</el-row>
		<el-collapse v-model='names' >
		  <el-collapse-item name="ht" ref='item_ht'>
		  	<div slot="title">
		  		<el-badge class='_details-badge' value='有更新' :hidden='!hasUpdate("ht")' >
					  <span><b>项目合同</b></span>
					</el-badge>		
					<span class='_details-update-text'>更新：{{ $commonJs.formatDate(project.ht_update_time)||'无'}}</span>
		    </div>
		    <el-form class='c-form-text' label-width='100px'>
					<el-row>
						<el-col :span='8'>
							<el-form-item label='合同编号'>
								<span>{{project.contract.contract_no}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='合同面积'>
								<span>{{project.contract.contract_area}}㎡</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='合同款'>
								<span>￥{{project.contract.contract_price}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='合同日期'>
								<span>{{project.contract.contract_date}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='签订公司'>
								<span>{{project.contract.sign_company_name}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='业绩公司'>
								<span>{{project.contract.company_name}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='业务员'>
								<span>{{project.contract.salesman}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='24'>
							<el-form-item label='合同内容'>
								<span>{{project.contract.content}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='24'>							
							<el-form-item label='付款方式'>
								<span v-html='$commonJs.textareaToHtml(project.contract.payment)'></span>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>				
		  </el-collapse-item>
		  <el-collapse-item name="xs" ref='item_xs'>
		  	<div slot="title">
		  		<el-badge class='_details-badge' value='有更新' :hidden='!hasUpdate("xs")'>
					  <b>销售计划情况</b>
					</el-badge>
					<span class='_details-update-text'>更新：{{ $commonJs.formatDate(project.xs_update_time)||'无'}}</span>
		    </div>
		    <div v-if='!hasTodo("xs")'>
			    <el-form class='c-form-text' label-width='100px' >
						<el-row>
							<el-col :span='12'>
								<el-form-item label='下单情况描述'>
									<span>{{ project.saleplan_order_content}}</span>
								</el-form-item>
							</el-col>
							<el-col :span='24'>
								<el-form-item label='交货计划'>
									<span>{{ project.saleplan_delivery_plan}}</span>
								</el-form-item>
							</el-col>
							<el-col :span='24'>
								<el-form-item label='回款计划'>
									<span>{{ project.saleplan_return_plan}}</span>
								</el-form-item>
							</el-col>
							<el-col :span='12'>
								<el-form-item label='明细查看' v-if='false'>
									<el-popover>
										<el-table :data='project.saleplan_list' border>
								    	<el-table-column label='下单情况描述' prop='order_content'></el-table-column>
								    	<el-table-column label='交货计划' prop='delivery_plan' ></el-table-column>
								    	<el-table-column label='回款计划' prop='return_plan' ></el-table-column>
								    	<el-table-column label='记录员' prop='recorder' ></el-table-column>
								    	<el-table-column label='提交时间' prop='update_time' ></el-table-column>
								    </el-table>
								    <el-button size='mini' type='text' slot="reference">[历史报告]</el-button>
									</el-popover>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
					<el-tabs value='problem' >
				    <el-tab-pane name="problem">
				    	<el-badge class='_details-badge' :value='getProblemList("SALEPLAN").length' slot="label" >反馈问题</el-badge>
				    	<el-table 
					  		:data='getProblemList("SALEPLAN")' 
					  		v-loading='loading' border stripe
					  		max-height='400'
					  		size='small'>
								<el-table-column prop='level' label='问题级别' align='center' width='80'>
									<template slot-scope='{row}'>
										<problem-level-tag :level='row.level' size='mini'></problem-level-tag>
									</template>
								</el-table-column>
								<el-table-column prop='level' label='提出部门'>
									<template slot-scope='{ row }'>
										<span>{{ getDepText(row.dep) }}</span>
									</template>
								</el-table-column>
								<el-table-column prop='content' label='反馈内容' show-overflow-tooltip></el-table-column>
								<el-table-column prop='create_user_name' label='反馈人' align='center'>
								</el-table-column>
								<el-table-column prop='create_time' label='反馈时间' align='center' width='140'>
									<template slot-scope='scope'>
										<span>{{scope.row.create_time | formatDate}}</span>
									</template>
								</el-table-column>
								<el-table-column prop='is_resolve' label='状态' align='center' width='80'>
									<template slot-scope='{row}'>					
										<el-tag size='mini' :type='row.is_resolve?"success":"danger"'>{{row.is_resolve?'已处理':'待处理'}}</el-tag>
									</template>
								</el-table-column>
								<el-table-column prop='resolve_time' label='处理时间' align='center' width='140'>
									<template slot-scope='{row}'>
										<span>{{row.resolve_time | formatDate}}</span>
									</template>
								</el-table-column>
								<el-table-column prop='resolve_user_name' label='处理人' align='center'>
								</el-table-column>
								<el-table-column prop='resolve_content' label='处理结果' show-overflow-tooltip>
								</el-table-column>
								<el-table-column label='操作' fixed='right' align='center' width='120'>
									<template slot-scope='scope'>
										<el-button  size='mini' type='text' @click='viewProblem(scope)'>预览</el-button>
									</template>
								</el-table-column>
							</el-table>
				    </el-tab-pane>
				  </el-tabs>
				</div>
				<notice-area v-else></notice-area>
		  </el-collapse-item>
		  <el-collapse-item name="xd" ref='item_xd'>
		  	<div slot='title'>
		  		<el-badge class='_details-badge' value='有更新' :hidden='!hasUpdate("xd")'>
		  			<span><b>运营下单情况</b></span>
		  		</el-badge>
		  		<span class='_details-update-text'>更新：{{ $commonJs.formatDate(project.xd_update_time)||'无' }}</span>
		  	</div>
		  	<div v-show='!hasTodo("xd")'>
			  	<el-form class='c-form-text' label-width='100px' >
						<el-row>
							<el-col :span='16'>
								<el-row>
									<el-col :span='12'>
										<el-form-item label='下单状态'>
											<span>
												<el-tag v-if='project.xd_is_finish' size='small' type='success'>完成</el-tag>
												<el-tag v-else size='small'>进行中</el-tag>
											</span>
										</el-form-item>
									</el-col>
									<el-col :span='12' v-if='project.xd_is_finish'>
										<el-form-item label='完成日期'>
											<span v-if='project.xd_finish_date'>
												{{ project.xd_finish_date }}
											</span>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span='12'>
										<el-form-item label='首次下单日期'>
											<span>{{ project.xd_first_order_date }}</span>
										</el-form-item>
										<el-form-item label='已下单面积'>
											<span>{{ project.xd_order_area_total }}㎡</span>
										</el-form-item>
										<el-form-item label='已下单数量'>
											<span>{{ project.xd_order_amount_total }}</span>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='下单时长'>
											<span>
												<el-tag size='small' v-if='project.xd_is_finish' type='success'>{{ productplanOrderDays }}天</el-tag>
												<el-tag size='small' v-else>已进行{{ productplanOrderDays }}天</el-tag>
											</span>
										</el-form-item>
									</el-col>
								</el-row>
							</el-col>
							<el-col :span='8'>							
								<el-row style='text-align: center;'>
									<el-col :span='24' >
										<div style='margin-bottom: 10px'><strong>项目下单率</strong></div>
										<el-tooltip 
											:content='project.xd_order_area_total+"㎡ / "+project.settlement_area_total+"㎡"'>
											<el-progress 
												:stroke-width='10' 
												type='circle' 
												:percentage="$commonJs.getProgressPercentage(project.xd_order_area_total/project.settlement_area_total)"></el-progress>
											</el-tooltip>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
					</el-form>
					<el-tabs value='list' >
				    <el-tab-pane label="下单明细" name="list">
				    	<order-list ref='orderList' max-height='200' size='mini' :params='{project_id:id,isDel:0}'/>
				    </el-tab-pane>
				    <el-tab-pane name="problem">
				    	<el-badge class='_details-badge' :value='getProblemList("PRODUCTPLAN").length' slot="label" >反馈问题</el-badge>
				    	<el-table 
					  		:data='getProblemList("PRODUCTPLAN")' 
					  		v-loading='loading' border stripe
					  		max-height='400'
					  		size='small'>
								<el-table-column prop='level' label='问题级别' align='center' width='80'>
									<template slot-scope='{row}'>
										<problem-level-tag :level='row.level' size='mini'></problem-level-tag>
									</template>
								</el-table-column>
								<el-table-column prop='level' label='提出部门'>
									<template slot-scope='{ row }'>
										<span>{{ getDepText(row.dep) }}</span>
									</template>
								</el-table-column>
								<el-table-column prop='content' label='反馈内容' show-overflow-tooltip></el-table-column>
								<el-table-column prop='create_user_name' label='反馈人' align='center'>
								</el-table-column>
								<el-table-column prop='create_time' label='反馈时间' align='center' width='140'>
									<template slot-scope='scope'>
										<span>{{scope.row.create_time | formatDate}}</span>
									</template>
								</el-table-column>
								<el-table-column prop='is_resolve' label='状态' align='center' width='80'>
									<template slot-scope='{row}'>					
										<el-tag size='mini' :type='row.is_resolve?"success":"danger"'>{{row.is_resolve?'已处理':'待处理'}}</el-tag>
									</template>
								</el-table-column>
								<el-table-column prop='resolve_time' label='处理时间' align='center' width='140'>
									<template slot-scope='{row}'>
										<span>{{row.resolve_time | formatDate}}</span>
									</template>
								</el-table-column>
								<el-table-column prop='resolve_user_name' label='处理人' align='center'>
								</el-table-column>
								<el-table-column prop='resolve_content' label='处理结果' show-overflow-tooltip>
								</el-table-column>
								<el-table-column label='操作' fixed='right' align='center' width='120'>
									<template slot-scope='scope'>
										<el-button  size='mini' type='text' @click='viewProblem(scope)'>预览</el-button>
									</template>
								</el-table-column>
							</el-table>
				    </el-tab-pane>
				  </el-tabs>
		  	</div>
		  </el-collapse-item>
		  <el-collapse-item  name="sc" ref='item_sc'>
		  	<div slot='title' >
		  		<el-badge class='_details-badge' value='有更新' :hidden='!hasUpdate("sc")'>
		  			<b>生产报告</b>
		  		</el-badge>
		  		<span class='_details-update-text'>更新：{{ $commonJs.formatDate(project.sc_update_time) || '无' }}</span>
		  	</div>
		  	<div v-show='!hasTodo("sc")'>
			  	<el-form class='c-form-text' label-width='100px'>
						<el-row>
							<el-col :span='16'>
								<el-form-item label='已生产面积'>
									<span>{{ Number(project.sc_self_finish_area_total) + Number(project.sc_out_finish_area_total) }}㎡</span>
								</el-form-item>
							 
								<el-form-item label='车间生产'>
									<span>{{ project.sc_self_finish_area_total }}㎡</span>
								</el-form-item>
								<el-form-item label='外协生产'>
									<span>{{ project.sc_out_finish_area_total }}㎡</span>
								</el-form-item>
							</el-col>
							<el-col :span='8'>							
								<el-row style='text-align: center'>
									<el-col :span='24' >
										<div style='margin-bottom: 10px'><strong>订单生产完成率</strong></div>
										<el-tooltip :content='Number(project.sc_self_finish_area_total) + Number(project.sc_out_finish_area_total)+"㎡ / "+project.xd_order_area_total+"㎡"'>
											<el-progress 
												:stroke-width='10' type='circle' 
												:percentage="$commonJs.getProgressPercentage((Number(project.sc_self_finish_area_total) + Number(project.sc_out_finish_area_total))/project.xd_order_area_total)"></el-progress>
											</el-tooltip>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
					</el-form>
					<el-tabs value='demand'>
						<el-tab-pane label='生产需求计划' name='demand'>
							<demand-list ref='demandList' max-height='200' size='mini' :params='{project_id:id}'/>
						</el-tab-pane>
						<el-tab-pane label='车间生产明细' name='product'>
							<product-list ref='productList' size='mini' :params='{project_id:id}'/>
						</el-tab-pane>
						<el-tab-pane label='外协生产明细' name='outProduct'>
							<out-product-list ref='outProductList' size='mini' :params='{project_id:id}'/>
						</el-tab-pane>
						<el-tab-pane name="problem">
				    	<el-badge class='_details-badge' :value='getProblemList("PRODUCT").length' slot="label" >反馈问题</el-badge>
				    	<el-table 
					  		:data='getProblemList("PRODUCT")' 
					  		v-loading='loading' border stripe
					  		max-height='400'
					  		size='small'>
								<el-table-column prop='level' label='问题级别' align='center' width='80'>
									<template slot-scope='{row}'>
										<problem-level-tag :level='row.level' size='mini'></problem-level-tag>
									</template>
								</el-table-column>
								<el-table-column prop='level' label='提出部门'>
									<template slot-scope='{ row }'>
										<span>{{ getDepText(row.dep) }}</span>
									</template>
								</el-table-column>
								<el-table-column prop='content' label='反馈内容' show-overflow-tooltip></el-table-column>
								<el-table-column prop='create_user_name' label='反馈人' align='center'>
								</el-table-column>
								<el-table-column prop='create_time' label='反馈时间' align='center' width='140'>
									<template slot-scope='scope'>
										<span>{{scope.row.create_time | formatDate}}</span>
									</template>
								</el-table-column>
								<el-table-column prop='is_resolve' label='状态' align='center' width='80'>
									<template slot-scope='{row}'>					
										<el-tag size='mini' :type='row.is_resolve?"success":"danger"'>{{row.is_resolve?'已处理':'待处理'}}</el-tag>
									</template>
								</el-table-column>
								<el-table-column prop='resolve_time' label='处理时间' align='center' width='140'>
									<template slot-scope='{row}'>
										<span>{{row.resolve_time | formatDate}}</span>
									</template>
								</el-table-column>
								<el-table-column prop='resolve_user_name' label='处理人' align='center'>
								</el-table-column>
								<el-table-column prop='resolve_content' label='处理结果' show-overflow-tooltip>
								</el-table-column>
								<el-table-column label='操作' fixed='right' align='center' width='120'>
									<template slot-scope='scope'>
										<el-button  size='mini' type='text' @click='viewProblem(scope)'>预览</el-button>
									</template>
								</el-table-column>
							</el-table>
				    </el-tab-pane>
					</el-tabs>
				</div>
		  </el-collapse-item>
		  <el-collapse-item name="cg" ref='item_cg'>
		  	<div slot='title'>
		  		<el-badge class='_details-badge' value='有更新' :hidden='!hasUpdate("cg")'>
		  			<span><b>物料采购情况</b></span>
		  		</el-badge>
		  		<span class='_details-update-text'>更新：{{ $commonJs.formatDate(project.cg_update_time)||"无" }}</span>
		  	</div>
		  	<div v-show='!hasTodo("cg")'>
		  		<el-form class='c-form-text' label-width='100px'> 
						<el-form-item label='采购进度'>
							<span>
								<el-tag v-if='project.cg_purchase_is_finish' size='small' type='success'>完成</el-tag>
								<el-tag v-else size='small'>进行中</el-tag>
							</span>
						</el-form-item>					 
						<el-form-item label='采购日期'>
							<span>{{ project.cg_first_purchase_date }}</span>
						</el-form-item>				 
						<el-form-item label='采购金额'>
							<span>￥{{ project.cg_purchase_price_total }}</span>
						</el-form-item>
					</el-form>
		  		<el-tabs value='list' >
				    <el-tab-pane label="采购明细" name="list">
				    	<purchase-list ref='purchaseList' max-height='200' size='mini' :params='{project_id:id}'/>
						</el-tab-pane>
						<el-tab-pane name="problem">
				    	<el-badge class='_details-badge' :value='getProblemList("PURCHASE").length' slot="label" >反馈问题</el-badge>
				    	<el-table 
					  		:data='getProblemList("PURCHASE")' 
					  		v-loading='loading' border stripe
					  		max-height='400'
					  		size='small'>
								<el-table-column prop='level' label='问题级别' align='center' width='80'>
									<template slot-scope='{row}'>
										<problem-level-tag :level='row.level' size='mini'></problem-level-tag>
									</template>
								</el-table-column>
								<el-table-column prop='level' label='提出部门'>
									<template slot-scope='{ row }'>
										<span>{{ getDepText(row.dep) }}</span>
									</template>
								</el-table-column>
								<el-table-column prop='content' label='反馈内容' show-overflow-tooltip></el-table-column>
								<el-table-column prop='create_user_name' label='反馈人' align='center'>
								</el-table-column>
								<el-table-column prop='create_time' label='反馈时间' align='center' width='140'>
									<template slot-scope='scope'>
										<span>{{scope.row.create_time | formatDate}}</span>
									</template>
								</el-table-column>
								<el-table-column prop='is_resolve' label='状态' align='center' width='80'>
									<template slot-scope='{row}'>					
										<el-tag size='mini' :type='row.is_resolve?"success":"danger"'>{{row.is_resolve?'已处理':'待处理'}}</el-tag>
									</template>
								</el-table-column>
								<el-table-column prop='resolve_time' label='处理时间' align='center' width='140'>
									<template slot-scope='{row}'>
										<span>{{row.resolve_time | formatDate}}</span>
									</template>
								</el-table-column>
								<el-table-column prop='resolve_user_name' label='处理人' align='center'>
								</el-table-column>
								<el-table-column prop='resolve_content' label='处理结果' show-overflow-tooltip>
								</el-table-column>
								<el-table-column label='操作' fixed='right' align='center' width='120'>
									<template slot-scope='scope'>
										<el-button  size='mini' type='text' @click='viewProblem(scope)'>预览</el-button>
									</template>
								</el-table-column>
							</el-table>
				    </el-tab-pane>
					</el-tabs>
			</div>
		  </el-collapse-item>
		  <el-collapse-item name="ck" ref='item_ck'>
		  	<div slot='title'>
		  		<el-badge class='_details-badge' value='有更新' :hidden='!hasUpdate("ck")'>
		  			<b>物料库存状态</b>
		  		</el-badge>
		  		<span class='_details-update-text'>更新：{{ $commonJs.formatDate(project.ck_update_time) || '无'}}</span>
		  	</div>
		  	<div v-show='!hasTodo("ck")'>
		  		<el-form class='c-form-text' label-width='150px'>
		  			<el-form-item label='型材首次入库日期'>
		  				<span>{{ project.ck_first_xc_storage_date }}</span>
		  			</el-form-item>
		  			<el-form-item label='五金首次入库日期'>
		  				<span>{{ project.ck_first_hardware_storage_date }}</span>
		  			</el-form-item>
		  		</el-form>
		  		<el-tabs value='list'>
		  			<el-tab-pane label='物料库存明细' name='list'>
		  				<ck-store-list ref='ckStoreList' max-height='200' size='mini' :params='{project_id:id}'/>
		  			</el-tab-pane>
		  			<el-tab-pane name="problem">
				    	<el-badge class='_details-badge' :value='getProblemList("STORE").length' slot="label" >反馈问题</el-badge>
				    	<el-table 
					  		:data='getProblemList("STORE")' 
					  		v-loading='loading' border stripe
					  		max-height='400'
					  		size='small'>
								<el-table-column prop='level' label='问题级别' align='center' width='80'>
									<template slot-scope='{row}'>
										<problem-level-tag :level='row.level' size='mini'></problem-level-tag>
									</template>
								</el-table-column>
								<el-table-column prop='level' label='提出部门'>
									<template slot-scope='{ row }'>
										<span>{{ getDepText(row.dep) }}</span>
									</template>
								</el-table-column>
								<el-table-column prop='content' label='反馈内容' show-overflow-tooltip></el-table-column>
								<el-table-column prop='create_user_name' label='反馈人' align='center'>
								</el-table-column>
								<el-table-column prop='create_time' label='反馈时间' align='center' width='140'>
									<template slot-scope='scope'>
										<span>{{scope.row.create_time | formatDate}}</span>
									</template>
								</el-table-column>
								<el-table-column prop='is_resolve' label='状态' align='center' width='80'>
									<template slot-scope='{row}'>					
										<el-tag size='mini' :type='row.is_resolve?"success":"danger"'>{{row.is_resolve?'已处理':'待处理'}}</el-tag>
									</template>
								</el-table-column>
								<el-table-column prop='resolve_time' label='处理时间' align='center' width='140'>
									<template slot-scope='{row}'>
										<span>{{row.resolve_time | formatDate}}</span>
									</template>
								</el-table-column>
								<el-table-column prop='resolve_user_name' label='处理人' align='center'>
								</el-table-column>
								<el-table-column prop='resolve_content' label='处理结果' show-overflow-tooltip>
								</el-table-column>
								<el-table-column label='操作' fixed='right' align='center' width='120'>
									<template slot-scope='scope'>
										<el-button  size='mini' type='text' @click='viewProblem(scope)'>预览</el-button>
									</template>
								</el-table-column>
							</el-table>
				    </el-tab-pane>
		  		</el-tabs>
		  	</div>
		  </el-collapse-item>
		  <el-collapse-item name="cy" ref='item_cy'>
		  	<div slot='title' >
		  		<el-badge class='_details-badge' value='有更新' :hidden='!hasUpdate("cy")'>
		  			<b>储运状态</b>
		  		</el-badge>		  		
		  		<span class='_details-update-text'>更新：{{ $commonJs.formatDate(project.cy_update_time) || '无' }}</span>
		  	</div>
		  	<div v-show='!hasTodo("cy")'>
		  		<el-form class='c-form-text' label-width='100px'>
						<el-row>
							<el-col :span='12'>
								<el-form-item label='首次入库日期'>
									<span>{{ project.cy_first_storage_date }}</span>
								</el-form-item>
								<el-form-item label='已入库面积'>
									<span>{{ project.cy_storage_area_total }}㎡</span>
								</el-form-item>
								<el-form-item label='首次发货日期'>
									<span>{{ project.cy_first_delivery_date }}</span>
								</el-form-item>
								<el-form-item label='已发货面积'>
									<span>{{ project.cy_delivery_area_total }}㎡</span>
								</el-form-item>
							</el-col>
							<el-col :span='12'>							
								<el-row style='text-align: center'>
									<el-col :span='12' >
										<div style='margin-bottom: 10px'><strong>成品入库率</strong></div>
										<el-tooltip 
											:content='project.cy_storage_area_total+"㎡ / "+(Number(project.sc_self_finish_area_total) + Number(project.sc_out_finish_area_total))+"㎡"'>
												<el-progress 
													:stroke-width='10' 
													type='circle' 
													:percentage="getPercentage(project.cy_storage_area_total/(Number(project.sc_self_finish_area_total) + Number(project.sc_out_finish_area_total)))"></el-progress></el-tooltip>
									</el-col>
									<el-col :span='12' >
										<div style='margin-bottom: 10px'><strong>库存发货率</strong></div>
										<el-tooltip :content='project.cy_delivery_area_total+"㎡ / "+project.cy_storage_area_total+"㎡"'><el-progress :stroke-width='10' type='circle' :percentage="$commonJs.getProgressPercentage(project.cy_delivery_area_total/project.cy_storage_area_total)"></el-progress></el-tooltip>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
						</el-form>
						<el-tabs value='store'>
							<el-tab-pane label='入库明细' name='store'>
								<cy-store-list ref='cyStoreList' max-height='200' size='mini' :params='{project_id:id}'/>
							</el-tab-pane>
							<el-tab-pane label='发货记录' name='delivery'>
								<delivery-list ref='deliveryList' max-height='200' size='mini' :params='{project_id:id}'/>
							</el-tab-pane>
							<el-tab-pane name="problem">
					    	<el-badge class='_details-badge' :value='getProblemList("TRANSPORT").length' slot="label" >反馈问题</el-badge>
					    	<el-table 
						  		:data='getProblemList("TRANSPORT")' 
						  		v-loading='loading' border stripe
						  		max-height='400'
						  		size='mini'>
									<el-table-column prop='level' label='问题级别' align='center' width='80'>
										<template slot-scope='{row}'>
											<problem-level-tag :level='row.level' size='mini'></problem-level-tag>
										</template>
									</el-table-column>
									<el-table-column prop='level' label='提出部门'>
										<template slot-scope='{ row }'>
											<span>{{ getDepText(row.dep) }}</span>
										</template>
									</el-table-column>
									<el-table-column prop='content' label='反馈内容' show-overflow-tooltip></el-table-column>
									<el-table-column prop='create_user_name' label='反馈人' align='center'>
									</el-table-column>
									<el-table-column prop='create_time' label='反馈时间' align='center' width='140'>
										<template slot-scope='scope'>
											<span>{{scope.row.create_time | formatDate}}</span>
										</template>
									</el-table-column>
									<el-table-column prop='is_resolve' label='状态' align='center' width='80'>
										<template slot-scope='{row}'>					
											<el-tag size='mini' :type='row.is_resolve?"success":"danger"'>{{row.is_resolve?'已处理':'待处理'}}</el-tag>
										</template>
									</el-table-column>
									<el-table-column prop='resolve_time' label='处理时间' align='center' width='140'>
										<template slot-scope='{row}'>
											<span>{{row.resolve_time | formatDate}}</span>
										</template>
									</el-table-column>
									<el-table-column prop='resolve_user_name' label='处理人' align='center'>
									</el-table-column>
									<el-table-column prop='resolve_content' label='处理结果' show-overflow-tooltip>
									</el-table-column>
									<el-table-column label='操作' fixed='right' align='center' width='120'>
										<template slot-scope='scope'>
											<el-button  size='mini' type='text' @click='viewProblem(scope)'>预览</el-button>
										</template>
									</el-table-column>
								</el-table>
					    </el-tab-pane>
						</el-tabs>
		  	</div>
		  </el-collapse-item>
		  <el-collapse-item name="gc" ref='item_gc'>
		  	<div slot='title'>
		  		<el-badge class='_details-badge' value='有更新' :hidden='!hasUpdate("gc")'>
		  			<span><b>工程报告</b></span>
		  		</el-badge>
		  		<span class='_details-update-text'>更新：{{ $commonJs.formatDate(project.gc_update_time)||'无' }}</span>
		  	</div>
		  	<div v-if='!hasTodo("gc")'>
		    	<el-form class='c-form-text' label-width='130px' >
					<el-row>
						<el-col :span='12'>
							<el-form-item label='提供安装'>
								<span>{{ project.engineering_is_install?'提供':'不提供' }}</span>
							</el-form-item>
						</el-col>
						<el-col :span='24'>
							<el-form-item label='项目管理人员'>
								<span>{{ project.engineering_admin }}</span>
							</el-form-item>
						</el-col>
						<el-col :span='24'>
							<el-form-item label='安装计划'>
								<span v-html='$commonJs.textareaToHtml(project.engineering_install_plan)'></span>
							</el-form-item>
						</el-col>
						<el-col :span='24'>
							<el-form-item label='安装进度'>
								<span v-html='$commonJs.textareaToHtml(project.engineering_install_progress)'></span>
							</el-form-item>
						</el-col>
						<el-col :span='24'>
							<el-form-item label='劳务合同执行情况'>
								<span v-html='$commonJs.textareaToHtml(project.engineering_contract_status)'></span>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
				<el-tabs value='problem'>
					<el-tab-pane name="problem">
			    	<el-badge class='_details-badge' :value='getProblemList("ENGINEERING").length' slot="label" >反馈问题</el-badge>
			    	<el-table 
				  		:data='getProblemList("ENGINEERING")' 
				  		v-loading='loading' border stripe
				  		max-height='400'
				  		size='mini'>
							<el-table-column prop='level' label='问题级别' align='center' width='80'>
								<template slot-scope='{row}'>
									<problem-level-tag :level='row.level' size='mini'></problem-level-tag>
								</template>
							</el-table-column>
							<el-table-column prop='level' label='提出部门'>
								<template slot-scope='{ row }'>
									<span>{{ getDepText(row.dep) }}</span>
								</template>
							</el-table-column>
							<el-table-column prop='content' label='反馈内容' show-overflow-tooltip></el-table-column>
							<el-table-column prop='create_user_name' label='反馈人' align='center'>
							</el-table-column>
							<el-table-column prop='create_time' label='反馈时间' align='center' width='140'>
								<template slot-scope='scope'>
									<span>{{scope.row.create_time | formatDate}}</span>
								</template>
							</el-table-column>
							<el-table-column prop='is_resolve' label='状态' align='center' width='80'>
								<template slot-scope='{row}'>					
									<el-tag size='mini' :type='row.is_resolve?"success":"danger"'>{{row.is_resolve?'已处理':'待处理'}}</el-tag>
								</template>
							</el-table-column>
							<el-table-column prop='resolve_time' label='处理时间' align='center' width='140'>
								<template slot-scope='{row}'>
									<span>{{row.resolve_time | formatDate}}</span>
								</template>
							</el-table-column>
							<el-table-column prop='resolve_user_name' label='处理人' align='center'>
							</el-table-column>
							<el-table-column prop='resolve_content' label='处理结果' show-overflow-tooltip>
							</el-table-column>
							<el-table-column label='操作' fixed='right' align='center' width='120'>
								<template slot-scope='scope'>
									<el-button  size='mini' type='text' @click='viewProblem(scope)'>预览</el-button>
								</template>
							</el-table-column>
						</el-table>
			    </el-tab-pane>
				</el-tabs>
				</div>
				<notice-area v-else></notice-area>
		  </el-collapse-item>
		  <el-collapse-item  name="business" ref='item_business' v-if='false'>
		  	<div slot='title'>
		  		<el-badge value='有更新' class='_details-badge'  :hidden='!hasUpdate("business")'>
		  			<b>商务成本预算报告</b>
		  		</el-badge>
		  		<span class='_details-update-text'>更新：{{ project.business_update_time||'无' }}</span>
		  	</div>
		  	<div v-if='!hasTodo("business")'>
			   	<el-form class='c-form-text' label-width='130px' >
						<el-row>
							<el-col :span='12'>
								<el-form-item label='报价编号'>
									<span>{{ project.business_offet_no }}</span>
								</el-form-item>
							</el-col>
							<el-col :span='24'>
								<el-form-item label='报价员'>
									<span>{{ project.business_quoter }}</span>
								</el-form-item>
							</el-col>
							<el-col :span='24'>
								<el-form-item label='报价描述'>
									<span>{{ project.business_offet_content | textareaToHtml }}</span>
								</el-form-item>
							</el-col>
							<el-col :span='24'>
								<el-form-item label='合同量价的核对'>
									<span>{{ project.business_contract_check | textareaToHtml }}</span>
								</el-form-item>
							</el-col>
							<el-col :span='24'>
								<el-form-item label='劳务合同执行情况'>
									<span>{{ project.business_matching_degree | textareaToHtml }}</span>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
					<el-tabs value='problem'>
						<el-tab-pane name="problem">
				    	<el-badge class='_details-badge' :value='getProblemList("BUSINESS").length' slot="label" >反馈问题</el-badge>
				    	<el-table 
					  		:data='getProblemList("BUSINESS")' 
					  		v-loading='loading' border stripe
					  		max-height='400'
					  		size='mini'>
								<el-table-column prop='level' label='问题级别' align='center' width='80'>
									<template slot-scope='{row}'>
										<problem-level-tag :level='row.level' size='mini'></problem-level-tag>
									</template>
								</el-table-column>
								<el-table-column prop='level' label='提出部门'>
									<template slot-scope='{ row }'>
										<span>{{ getDepText(row.dep) }}</span>
									</template>
								</el-table-column>
								<el-table-column prop='content' label='反馈内容' show-overflow-tooltip></el-table-column>
								<el-table-column prop='create_user_name' label='反馈人' align='center'>
								</el-table-column>
								<el-table-column prop='create_time' label='反馈时间' align='center' width='140'>
									<template slot-scope='scope'>
										<span>{{scope.row.create_time | formatDate}}</span>
									</template>
								</el-table-column>
								<el-table-column prop='is_resolve' label='状态' align='center' width='80'>
									<template slot-scope='{row}'>					
										<el-tag size='mini' :type='row.is_resolve?"success":"danger"'>{{row.is_resolve?'已处理':'待处理'}}</el-tag>
									</template>
								</el-table-column>
								<el-table-column prop='resolve_time' label='处理时间' align='center' width='140'>
									<template slot-scope='{row}'>
										<span>{{row.resolve_time | formatDate}}</span>
									</template>
								</el-table-column>
								<el-table-column prop='resolve_user_name' label='处理人' align='center'>
								</el-table-column>
								<el-table-column prop='resolve_content' label='处理结果' show-overflow-tooltip>
								</el-table-column>
								<el-table-column label='操作' fixed='right' align='center' width='120'>
									<template slot-scope='scope'>
										<el-button  size='mini' type='text' @click='viewProblem(scope)'>预览</el-button>
									</template>
								</el-table-column>
							</el-table>
				    </el-tab-pane>
					</el-tabs>
				</div>
				<notice-area v-else></notice-area>
		  </el-collapse-item>
		  <el-collapse-item name="cw" ref='item_cw'>
		  	<div slot='title'>
		  		<el-badge value='有更新' class='_details-badge' :hidden='!hasUpdate("cw")'>
		  			<b>回款情况</b>
		  		</el-badge>		  		
		  		<span class='_details-update-text'>更新：{{ $commonJs.formatDate(project.cw_update_time) || '无' }}</span>
		  	</div>
		  	<div v-show='!hasTodo("cw")'>
			  	<el-form class='c-form-text' label-width='100px'>
						<el-row>
							<el-col :span='16'>
								<el-form-item label='首次开票日期'>
									<span>{{ project.cw_first_invoice_date}}</span>
								</el-form-item>
								<el-form-item label='已开票金额'>
									<span>￥{{ project.cw_invoice_price_total}}</span>
								</el-form-item>		
								<el-form-item label='首次回款日期'>
									<span>{{ project.cw_first_payment_date}}</span>
								</el-form-item>
								<el-form-item label='已回款金额'>
									<span>￥{{ project.cw_payment_price_total}}</span>
								</el-form-item>								
							</el-col>
							<el-col :span='8'>							
								<el-row style='text-align: center'>
									<el-col :span='24'>
										<div style='margin-bottom: 10px'><b>项目回款率</b></div>
										<el-tooltip :content='"￥"+project.cw_payment_price_total+" / "+project.cw_invoice_price_total'>
											<el-progress :stroke-width='10' type='circle' 
												:percentage="$commonJs.getProgressPercentage(project.cw_payment_price_total/project.cw_invoice_price_total)"></el-progress></el-tooltip>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
					</el-form>
					<el-tabs value='invoice'>
						<el-tab-pane label='开票明细' name='invoice'>
							<invoice-list ref='invoiceList' in-dialog size='mini' :params='{project_id:id}'/>
						</el-tab-pane>
						<el-tab-pane label='回款明细' name='receive'>
							<receive-payment-list ref='receivePaymentList' in-dialog size='mini' :params='{project_id:id}'/>
						</el-tab-pane>
						<el-tab-pane name="problem">
				    	<el-badge class='_details-badge' :value='getProblemList("finance").length' slot="label" >反馈问题</el-badge>
				    	<el-table 
					  		:data='getProblemList("finance")' 
					  		v-loading='loading' border stripe
					  		max-height='400'
					  		size='mini'>
								<el-table-column prop='level' label='问题级别' align='center' width='80'>
									<template slot-scope='{row}'>
										<problem-level-tag :level='row.level' size='mini'></problem-level-tag>
									</template>
								</el-table-column>
								<el-table-column prop='level' label='提出部门'>
									<template slot-scope='{ row }'>
										<span>{{ getDepText(row.dep) }}</span>
									</template>
								</el-table-column>
								<el-table-column prop='content' label='反馈内容' show-overflow-tooltip></el-table-column>
								<el-table-column prop='create_user_name' label='反馈人' align='center'>
								</el-table-column>
								<el-table-column prop='create_time' label='反馈时间' align='center' width='140'>
									<template slot-scope='scope'>
										<span>{{scope.row.create_time | formatDate}}</span>
									</template>
								</el-table-column>
								<el-table-column prop='is_resolve' label='状态' align='center' width='80'>
									<template slot-scope='{row}'>					
										<el-tag size='mini' :type='row.is_resolve?"success":"danger"'>{{row.is_resolve?'已处理':'待处理'}}</el-tag>
									</template>
								</el-table-column>
								<el-table-column prop='resolve_time' label='处理时间' align='center' width='140'>
									<template slot-scope='{row}'>
										<span>{{row.resolve_time | formatDate}}</span>
									</template>
								</el-table-column>
								<el-table-column prop='resolve_user_name' label='处理人' align='center'>
								</el-table-column>
								<el-table-column prop='resolve_content' label='处理结果' show-overflow-tooltip>
								</el-table-column>
								<el-table-column label='操作' fixed='right' align='center' width='120'>
									<template slot-scope='scope'>
										<el-button  size='mini' type='text' @click='viewProblem(scope)'>预览</el-button>
									</template>
								</el-table-column>
							</el-table>
				    </el-tab-pane>
					</el-tabs>
				</div>
				<!-- <notice-area v-else></notice-area> -->
		  </el-collapse-item>
		  <el-collapse-item name='problem' ref='item_problem'>
		  	<div slot='title'>
	  			<b>项目问题处理记录</b>
		  	</div>
		  	<el-form class='c-form-text' label-width='100px'>
					<el-row>
						<el-col :span='12'>
							<el-form-item label='累计问题数量'>
								<span>{{ project.problemList.length}}</span>
							</el-form-item>
							<el-form-item label='已处理数量'>
								<span>{{ problemResolveList.length }}</span>
							</el-form-item>
						</el-col>
						<el-col :span='12'>							
							<el-row style='text-align: center'>
								<el-col :span='24'>
									<div style='margin-bottom: 10px'><b>问题处理率</b></div>
									<el-tooltip :content='problemResolveList.length+" / "+project.problemList.length'><el-progress :stroke-width='10' type='circle' :percentage="getPercentage(problemResolveList.length/project.problemList.length)"></el-progress></el-tooltip>
								</el-col>
							</el-row>
						</el-col>
					</el-row>
				</el-form>
		  	<el-table 
		  		:data='project.problemList' 
		  		v-loading='loading' border stripe
		  		max-height='350'
		  		size='mini'>
					<el-table-column prop='level' label='问题级别' align='center' width='80'>
						<template slot-scope='{row}'>
							<problem-level-tag :level='row.level' size='mini'></problem-level-tag>
						</template>
					</el-table-column>
					<el-table-column prop='level' label='提出部门'>
						<template slot-scope='{ row }'>
							<span>{{ getDepText(row.dep) }}</span>
						</template>
					</el-table-column>
					<el-table-column prop='content' label='反馈内容' show-overflow-tooltip></el-table-column>
					<el-table-column prop='create_user_name' label='反馈人' align='center'>
					</el-table-column>
					<el-table-column prop='create_time' label='反馈时间' align='center' width='140'>
						<template slot-scope='scope'>
							<span>{{scope.row.create_time | formatDate}}</span>
						</template>
					</el-table-column>
					<el-table-column prop='is_resolve' label='状态' align='center' width='80'>
						<template slot-scope='{row}'>					
							<el-tag size='mini' :type='row.is_resolve?"success":"danger"'>{{row.is_resolve?'已处理':'待处理'}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop='resolve_time' label='处理时间' align='center' width='140'>
						<template slot-scope='{row}'>
							<span>{{row.resolve_time | formatDate}}</span>
						</template>
					</el-table-column>
					<el-table-column prop='resolve_user_name' label='处理人' align='center'>
					</el-table-column>
					<el-table-column prop='resolve_content' label='处理结果' show-overflow-tooltip>
					</el-table-column>
					<el-table-column label='操作' fixed='right' align='center' width='120'>
						<template slot-scope='scope'>
							<el-button  size='mini' type='text' @click='viewProblem(scope)'>预览</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-collapse-item>
		</el-collapse>
		<el-tabs v-if='false' class='badge' v-model="activeName" type="border-card" style='margin-top:10px'>
	    <el-tab-pane label="相关部门报告" name="first" >
	    	
	    </el-tab-pane>
	    <el-tab-pane label="项目进度图" name="second">
	    	<img src='static/pro.jpg'  style='width:100%'/>
	    </el-tab-pane>
	  </el-tabs>
		</div>
		<span slot="footer">
			<el-dropdown style='float:left'>
			  <el-button type='primary' plain round >
			  	快速定位
			  	<i class='el-icon-location'></i>
				</el-button>
			  <el-dropdown-menu slot="dropdown" >
		  	 	<el-dropdown-item @click.native='jump("top")'>顶部</el-dropdown-item>
			  	<el-dropdown-item divided></el-dropdown-item>
			    <el-dropdown-item @click.native='jump(key)' v-for='(a,key) in areas' :key='key'>
			    	<el-badge is-dot class='_details-badge' :hidden='!hasUpdate(key)'>
			    		{{a}}
			    	</el-badge>
			    </el-dropdown-item>
			    <el-dropdown-item @click.native='jump("problem")' >
			    		问题处理记录
			    </el-dropdown-item>
			  </el-dropdown-menu>
			</el-dropdown>
			<el-button @click="refresh" size='small'>刷 新</el-button>
			<el-button @click="dialogShow=false" size='small'>打 印</el-button>
	    <el-button @click="dialogShow=false" type='primary' size='small'>关 闭</el-button>
	  </span>
	</el-dialog>
		<problem-info ref='problemInfo'></problem-info>
	</div>
</template>
<script>
import projectApi from '@/api/yyzx/project'
import projectProblemApi from '@/api/yyzx/projectProblem'
import problemInfo from '@/components/problemInfo'
import Notice from './notice'
import NoticeArea from './noticeArea'
import commonJs from '@/utils/common'
import problemLevelTag from '@/components/problemLevelTag'
import invoiceList from '@/components/cw/invoiceRecord/list'
import receivePaymentList from '@/components/cw/receivePaymentRecord/list'
import orderList from '@/components/yyzx/order/list'
import demandList from '@/components/sc/productDemandPlan/list'
import productList from '@/components/sc/product/list'
import outProductList from '@/components/sc/outProduct/list'
import purchaseList from '@/components/cg/purchase/list'
import ckStoreList from '@/components/ck/store/list'
import cyStoreList from '@/components/cy/store/list'
import deliveryList from '@/components/cy/delivery/list'

const projectInit = {
	id:null,
	name:'',
	contract:{},	
	problemList:[],
	viewLog:{}
}
export default {
	components:{ 
		problemLevelTag,
		Notice,
		NoticeArea,
		problemInfo,
		invoiceList,
		receivePaymentList,
		orderList,
		productList,
		outProductList,
		demandList,
		purchaseList,
		ckStoreList,
		cyStoreList,
		deliveryList },
	props:{
		inDialog:{
			type:Boolean,
			default:false
		}
	},
	data() {
		let project=Object.assign({},projectInit)
		return {
			id:null,
			loading:true,
			activeName:'first',
			names:[],
			project,
			title: '',
			dialogShow: false,
			noticeMethods:[],
			areas:{
				'ht':'合同情况',
				'xs':'销售计划情况',
				'xd':'下单情况',
				'cg':'物料采购情况',
				'sc':'生产情况',
				'ck':'物料库存情况',
				'cy':'储运情况',
				'gc':'工程情况',
				// 'business':'商务报价情况',
				'cw':'回款情况'
			},
			scrollDom:null,
			hasUpdateView:{},
			timeout:null
		}
	},	
	destroyed() {
		if(this.scrollDom){
			this.scrollDom.removeEventListener('scroll', this.scroll)
		}
	},
	computed:{
		//运营下单时长
		productplanOrderDays(){
			let finishDate 
			if(this.project.xd_is_finish){
				finishDate = this.$moment(this.project.xd_finish_date)
			}else{
				finishDate = this.$moment()
			}
			return finishDate.diff(this.$moment(this.project.xd_first_order_date),'days')+1
		},
		problemResolveList(){
			return this.project.problemList.filter(p=>{
				return p.is_resolve==1
			})
		},
		//生产时长
		productOrderDays(){
			let finishDate 
			if(this.project.product_is_finish){
				finishDate = this.$moment(this.project.product_finish_date)
			}else{
				finishDate = this.$moment()
			}
			return finishDate.diff(this.$moment(this.project.product_first_product_date),'days')+1
		},
		//采购时长
		purchaseOrderDays(){
			let finishDate 
			if(this.project.purchase_is_finish){
				finishDate = this.$moment(this.project.purchase_finish_date)
			}else{
				finishDate = this.$moment()
			}
			return finishDate.diff(this.$moment(this.project.purchase_first_order_date),'days')+1
		},
		//项目信息完善率
		projectInfoPercentage(){
			let hasInfoTotal = 0
			for(let key in this.areas){
				if(this.project[ key + '_update_time']!=null){
					hasInfoTotal += 1
				}
			}
			return Math.round(hasInfoTotal / Object.keys(this.areas).length*100*100)/100||0
		}		
	},
	methods:{
		getData() {
			this.loading = true
			projectApi.getDetails(this.id).then(res=>{
				this.project = res.data
				this.loading = false
				projectApi.updateViewLog({id:this.project.viewLog.id})
			})
		},
		getList(){
			this.$refs.orderList.initData()
			this.$refs.invoiceList.initData()
			this.$refs.receivePaymentList.initData()			
			this.$refs.demandList.initData()			
			this.$refs.productList.initData()			
			this.$refs.outProductList.initData()			
			this.$refs.purchaseList.initData()			
			this.$refs.ckStoreList.initData()			
			this.$refs.cyStoreList.initData()			
			this.$refs.deliveryList.initData()			
		},
		open(id) {
			this.id = id
			this.names = Object.keys(this.areas)
			this.names.push('problem')
			this.hasUpdateView = {}
			this.project = Object.assign({},projectInit)
			this.getData()
			this.dialogShow = true
		},
		openDialog(){
			if(!this.scrollDom){
				this.$nextTick(()=>{
					this.scrollDom = this.$refs.dialog.$el.querySelector('.el-dialog__body')
					this.scrollDom.addEventListener('scroll',this.scroll)
					this.scrollDom.scrollTop = 0
				})
			}else{
				this.$nextTick(()=>{
					this.scrollDom.scrollTop = 0
				})
			}
			this.$nextTick(()=>{
				this.getList()
			})			
		},
		hasUpdate(key){
			let keys= key?[key]:Object.keys(this.areas)
			return keys.some(k=>{
				return this.$moment(this.project[k+'_update_time']||0).isAfter(this.$moment(this.project.viewLog[k+'_view_time']||0))
			})			
		},
		hasTodo(key){
			let keys= key?[key]:Object.keys(this.areas)
			return keys.some(k=>{
				return this.project[k+'_update_time']==null
			})
		},
		hasProblem(key){
			let keys= key?[key]:Object.keys(this.areas)
			return keys.some(k=>{
				return this.getProblemList(k.toUpperCase()).some(p=>{
					return p.is_resolve==0
				})
			})
		},
		notice(){
			this.$message('该功能未开发')
		},
		scroll(e){
			Object.keys(this.areas).forEach(k=>{
				if(this.hasUpdate(k)&&!this.hasUpdateView[k]){
					let dom = this.$refs['item_' + k].$el
					let end = dom.offsetTop + dom.clientHeight-50
					let begin = dom.offsetTop+dom.clientHeight-e.target.clientHeight-50
					if(e.target.scrollTop > begin && e.target.scrollTop < end){						
						this.hasUpdateView[k] = true
						setTimeout(()=>{
							if(e.target.scrollTop > begin && e.target.scrollTop < end){
								projectApi.updateViewLog({id:this.project.viewLog.id,module:k})
								this.$message.success(this.areas[k]+'已阅！')
							}else{
								this.hasUpdateView[k] = false
							}
						},1500)
					}
				}
			})
		},
		jump(key){
			if(key=='top'){
				this.scrollDom.scrollTop = 0
			}else{
				let dom = this.$refs['item_' + key].$el
				this.scrollDom.scrollTop = dom.offsetTop-50
			}			
		},
		getOrderDays({row}){
			let finishDate 
			if(row.is_finish){
				finishDate = this.$moment(row.finish_date)
			}else{
				finishDate = this.$moment()
			}
			return finishDate.diff(this.$moment(row.order_date),'days') + 1
		},
		getPercentage(value){
			value = value >1?1:value
			return Math.round(value*100*100)/100||0
		},
		refresh(){
			this.getData()
			this.getList()
		},
		getProblemList(area){
			return this.project.problemList.filter(p=>{
				return p.dep==area.toUpperCase()&&p.is_resolve==0
			})
		},
		getDepText:dep=>projectProblemApi.getDepText(dep),
		viewProblem({row}){
			this.$refs.problemInfo.open(row.id)
		},
		test(){
			console.log('asdfadsf')
		}
	}
}
</script>

<style>	
	.problemtag{
		margin-left: 20px
	}
	._details-update-text{
		float:right;margin-right:5px;color:#777
	}
	._details-badge .el-badge__content.is-fixed{
		top:15px !important;
		right:0px !important;
	}
</style>