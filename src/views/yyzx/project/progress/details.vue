<template >
<div>
	<el-dialog 
		class='c-full-fixed' 
		:visible.sync='dialogShow' 
		:title='project.name?"【 "+project.name+" 】 项目详情":"加载中..."' 
		ref='dialog'
		fullscreen
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
							<el-form-item label='客户名称'>
								<span>{{ project.customer }}</span>
							</el-form-item>
							<el-form-item label='客户类别'>
								<span>{{ project.customer_type }}</span>
							</el-form-item>
							<el-form-item label='分公司'>
								<span>{{ project.company }}</span>
							</el-form-item>
							<el-form-item label='区域'>
								<span>{{ project.area }}</span>
							</el-form-item>
							<el-form-item label='业务员'>
								<span>{{ project.salesman }}</span>
							</el-form-item>
						</el-col>
						<el-col :span='12'>
							<!-- <el-form-item label='创建者'>
								<span>蔡锦钿</span>
							</el-form-item> -->
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
		  <el-collapse-item name="contract" ref='item_contract'>
		  	<div slot="title" @click='log("contract")' >
		  		<el-badge class='_details-badge' value='有更新' :hidden='!hasUpdate("contract")' >
					  <span><b>合同情况</b></span>
					</el-badge>		
					<span class='_details-update-text'>更新：{{ $commonJs.formatDate(project.contract_update_time)||'无'}}</span>
		    </div>
		    <el-form class='c-form-text' label-width='100px' v-if='!hasTodo("contract")'>
					<el-row>
						<el-col :span='8'>
							<el-form-item label='终端合同编号'>
								<span>{{project.contract_no}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='合同面积'>
								<span>{{project.contract_area}}㎡</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='合同款'>
								<span>￥{{project.contract_price}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='合同日期'>
								<span>{{project.contract_date}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='8'>
							<el-form-item label='合同内容'>
								<span>{{project.contract_content}}</span>
							</el-form-item>
						</el-col>				
						<el-col :span='8'>
							<el-form-item label='操作员'>
								<span>{{project.contractor}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='24'>							
							<el-form-item label='付款方式'>
								<span v-html='contractPayment'></span>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
				<notice-area v-else></notice-area>
		  </el-collapse-item>
		  <el-collapse-item name="saleplan" ref='item_saleplan'>
		  	<div slot="title">
		  		<el-badge class='_details-badge' value='有更新' :hidden='!hasUpdate("saleplan")'>
					  <b>销售计划情况</b>
					</el-badge>
					<span class='_details-update-text'>更新：{{ $commonJs.formatDate(project.saleplan_update_time)||'无'}}</span>
		    </div>
		    <div v-if='!hasTodo("saleplan")'>
			    <el-form class='c-form-text' label-width='100px' >
						<el-row>
							<el-col :span='12'>
								<el-form-item label='下单情况描述'>
									<span>已全部下单</span>
								</el-form-item>
							</el-col>
							<el-col :span='24'>
								<el-form-item label='交货计划'>
									<span>春节后正月十五框扇（不含玻璃）交付一半</span>
								</el-form-item>
							</el-col>
							<el-col :span='24'>
								<el-form-item label='回款计划'>
									<span>框扇供货后15日内收款40%</span>
								</el-form-item>
							</el-col>
							<el-col :span='12'>
								<el-form-item label='记录人员'>
									<span>张敏</span>
								</el-form-item>
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
		  <el-collapse-item name="productplan" ref='item_productplan'>
		  	<div slot='title'>
		  		<el-badge class='_details-badge' value='有更新' :hidden='!hasUpdate("productplan")'>
		  			<span><b>生产计划情况</b></span>
		  		</el-badge>
		  		<span class='_details-update-text'>更新：{{ $commonJs.formatDate(project.productplan_update_time)||'无' }}</span>
		  	</div>
		  	<div v-if='!hasTodo("productplan")'>
			  	<el-form class='c-form-text' label-width='100px' >
						<el-row>
							<el-col :span='12'>
								<el-row>
									<el-col :span='12'>
										<el-form-item label='生产计划'>
											<span>
												<el-tag v-if='project.productplan_is_finish' size='small' type='success'>完成</el-tag>
												<el-tag v-else size='small'>进行中</el-tag>
											</span>
										</el-form-item>
									</el-col>
									<el-col :span='12' v-if='project.productplan_is_finish'>
										<el-form-item label='完成日期'>
											<span v-if='project.productplan_finish_date'>
												{{ project.productplan_finish_date }}
											</span>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span='12'>
										<el-form-item label='首次下单日期'>
											<span>{{ project.productplan_first_order_date }}</span>
										</el-form-item>
										<el-form-item label='累计下单面积'>
											<span>{{ project.productplan_order_area }}㎡</span>
										</el-form-item>
										<el-form-item label='累计下单数量'>
											<span>{{ project.productplan_order_amount }}</span>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='下单天数'>
											<span>
												<el-tag size='small' v-if='project.productplan_is_finish'>{{ productplanOrderDays }}天</el-tag>
												<el-tag size='small' v-else>已进行{{ productplanOrderDays }}天</el-tag>
											</span>
										</el-form-item>
									</el-col>
								</el-row>
							</el-col>
							<el-col :span='12'>							
								<el-row style='text-align: center;'>
									<el-col :span='12' >
										<div style='margin-bottom: 10px'><strong>项目下单率</strong></div>
										<el-tooltip :content='project.productplan_order_area+" / "+project.contract_area+" ㎡"'><el-progress :stroke-width='10' type='circle' :percentage="projectOrderAreaPercentage"></el-progress></el-tooltip>
									</el-col>
									<el-col :span='12' >
										<div style='margin-bottom: 10px'><strong>下单完成率</strong></div>
										<el-tooltip :content='project.productplan_finish_area+" / "+project.productplan_order_area+" ㎡"'><el-progress :stroke-width='10' type='circle' :percentage="orderFinishAreaPercentage"></el-progress></el-tooltip>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
					</el-form>
					<el-tabs value='list' >
				    <el-tab-pane label="生产下单列表" name="list">
				    	<el-table 
					  		:data='project.productplanList' 
					  		v-loading='loading' border stripe
					  		size='small'>
								<el-table-column prop='order_no' fixed label='下单编号' width='100'></el-table-column>
								<el-table-column prop='oroder_area' label='下单面积' align='right' width='90'>
									<template slot-scope='scope'>
										<span>{{ scope.row.order_area }}㎡</span>
									</template>
								</el-table-column>
								<el-table-column prop='order_amount' label='下单数量' align='right' width='80'>
								</el-table-column>
								<el-table-column prop='order_date' label='下单日期' align='center' width='110'></el-table-column>
								<el-table-column prop='product_status' label='生产状态' show-overflow-tooltip></el-table-column>
								<el-table-column prop='expect_delivery' label='预计交期' show-overflow-tooltip></el-table-column>
								<el-table-column prop='glass_expect_delivery' label='玻璃加工预计交期' show-overflow-tooltip></el-table-column>
								<el-table-column label='完成日期' width='100' align='center'>
									<template slot-scope='scope'>
										<el-tooltip v-if='scope.row.is_finish' :content='"下单时长："+getOrderDays(scope)+"天"'>
											<el-tag type='success' size='mini'>{{ scope.row.finish_date }}</el-tag>
										</el-tooltip>
										<el-tag size='mini' v-else>已下单 {{ getOrderDays(scope) }} 天</el-tag>
									</template>
								</el-table-column>
								<el-table-column prop='update_time' label='更新时间' align='center' width='140'>
									<template slot-scope='scope'>
										<span>{{scope.row.update_time | formatDate}}</span>
									</template>
								</el-table-column>
							</el-table>
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
				<notice-area v-else></notice-area>
		  </el-collapse-item>
		  <el-collapse-item name="purchase" ref='item_purchase'>
		  	<div slot='title'>
		  		<el-badge class='_details-badge' value='有更新' :hidden='!hasUpdate("purchase")'>
		  			<span><b>采购计划情况</b></span>
		  		</el-badge>
		  		<span class='_details-update-text'>更新：{{ project.purchase_update_time }}</span>
		  	</div>
		  	<div v-if='!hasTodo("purchase")'>
		  		<el-form class='c-form-text' label-width='100px'>
						<el-row>
							<el-col :span='12'>
								<el-row>
									<el-col :span='12'>
										<el-form-item label='采购计划'>
											<span>
												<el-tag v-if='project.purchase_is_finish' size='small' type='success'>完成</el-tag>
												<el-tag v-else size='small'>进行中</el-tag>
											</span>
										</el-form-item>
									</el-col>
									<el-col :span='12' v-if='project.purchase_is_finish'>
										<el-form-item label='完成日期'>
											<span v-if='project.purchase_finish_date'>
												{{ project.purchase_finish_date }}
											</span>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span='12'>
										<el-form-item label='首次下单日期'>
											<span>{{ project.purchase_first_order_date }}</span>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='下单天数'>
											<span>
												<el-tag size='small' v-if='project.purchase_is_finish'>{{ purchaseOrderDays }}天</el-tag>
												<el-tag size='small' v-else>已进行{{ purchaseOrderDays }}天</el-tag>
											</span>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='预计采购金额'>
											<span>￥{{ project.purchase_expect_price }}</span>
										</el-form-item>
									</el-col>
								</el-row>
								<el-form-item label='预计完成日期'>
									<span>{{ project.purchase_last_expect_delivery_date }}</span>
								</el-form-item>
							</el-col>
							<el-col :span='12'>							
								<el-row style='text-align: center'>
									<el-col :span='24' >
										<div style='margin-bottom: 10px'><strong>下单采购率</strong></div>
										<el-tooltip :content='project.purchase_finish_order_total+" / "+project.purchase_order_total'><el-progress :stroke-width='10' type='circle' :percentage="purchaseFinishPercentage"></el-progress></el-tooltip>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
					</el-form>
		  		<el-tabs value='list' >
				    <el-tab-pane label="采购下单列表" name="list">
							<el-table 
					  		:data='project.purchaseList' 
					  		v-loading='loading' border stripe 
					  		size='small'>
								<el-table-column prop='order_no' fixed label='下单编号' width='100'></el-table-column>
								<el-table-column prop='order_date' label='材料下单日期' align='center' width='110'></el-table-column>
								<el-table-column prop='expect_price' label='预计采购金额' align='right' width='120'>
									<template slot-scope='scope'>
										<span>￥{{ scope.row.expect_price || 0 }}</span>
									</template>
								</el-table-column>			
								<el-table-column prop='purchase_status' label='采购状态' show-overflow-tooltip></el-table-column>
								<el-table-column prop='expect_delivery_date' label='预计交期' width='100'></el-table-column>
								<el-table-column prop='demand_plan' label='需求计划' show-overflow-tooltip></el-table-column>
								<el-table-column label='完成日期' width='100' align='center'>
									<template slot-scope='scope'>
										<el-tooltip v-if='scope.row.is_finish' :content='"下单时长："+getOrderDays(scope)+"天"'>
											<el-tag type='success' size='mini'>{{ scope.row.finish_date }}</el-tag>
										</el-tooltip>
										<el-tag size='mini' v-else>已下单 {{ getOrderDays(scope) }} 天</el-tag>
									</template>
								</el-table-column>
								<el-table-column prop='update_time' label='更新时间' align='center' width='140'>
									<template slot-scope='scope'>
										<span>{{scope.row.update_time | formatDate}}</span>
									</template>
								</el-table-column>
							</el-table>
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
			<notice-area v-else></notice-area>
		  </el-collapse-item>
		  <el-collapse-item  name="product" ref='item_product'>
		  	<div slot='title' >
		  		<el-badge class='_details-badge' value='有更新' :hidden='!hasUpdate("product")'>
		  			<b>生产车间报告</b>
		  		</el-badge>
		  		<span class='_details-update-text'>更新：{{ project.purchase_update_time || '无' }}</span>
		  	</div>
		  	<div v-if='!hasTodo("product")'>
			  	<el-form class='c-form-text' label-width='100px'>
						<el-row>
							<el-col :span='12'>
								<el-row>
									<el-col :span='12'>
										<el-form-item label='生产状态'>
											<span>
												<el-tag v-if='project.product_is_finish' size='small' type='success'>完成</el-tag>
												<el-tag v-else size='small'>进行中</el-tag>
											</span>
										</el-form-item>
									</el-col>
									<el-col :span='12' v-if='project.product_is_finish'>
										<el-form-item label='完成日期'>
											<span v-if='project.product_finish_date'>
												{{ project.product_finish_date }}
											</span>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span='12'>
										<el-form-item label='投产日期'>
											<span>{{ project.product_first_product_date }}</span>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='生产时长'>
											<span>
												<el-tag size='small' v-if='project.product_is_finish'>{{ productOrderDays }}天</el-tag>
												<el-tag size='small' v-else>已进行{{ productOrderDays }}天</el-tag>
											</span>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='累计订单面积'>
											<span>{{ project.product_order_area }}㎡</span>
										</el-form-item>
									</el-col>
									<el-col :span='12'>
										<el-form-item label='未完成面积'>
											<span>{{ project.product_unfinish_area }}㎡</span>
										</el-form-item>
									</el-col>
								</el-row>
								<el-form-item label='订单数量'>
									<span>{{ project.product_order_amount }}</span>
								</el-form-item>
							</el-col>
							<el-col :span='12'>							
								<el-row style='text-align: center'>
									<el-col :span='12' >
										<div style='margin-bottom: 10px'><strong>订单生产完成率</strong></div>
										<el-tooltip :content='(project.product_order_area-project.product_unfinish_area)+" / "+project.product_order_area+"㎡"'><el-progress :stroke-width='10' type='circle' :percentage="getPercentage((project.product_order_area-project.product_unfinish_area)/project.product_order_area)"></el-progress></el-tooltip>
									</el-col>
									<el-col :span='12' >
										<div style='margin-bottom: 10px'><strong>项目生产完成率</strong></div>
										<el-tooltip :content='(project.product_order_area-project.product_unfinish_area)+" / "+project.contract_area+"㎡"'><el-progress :stroke-width='10' type='circle' :percentage="getPercentage((project.product_order_area-project.product_unfinish_area)/project.contract_area)"></el-progress></el-tooltip>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
					</el-form>
					<el-tabs value='list'>
						<el-tab-pane label='生产日志' name='list'>
							<el-table
					  		:data='project.productList' 
					  		v-loading='loading' border stripe
					  		size='small'>
								<el-table-column prop='order_no' fixed label='下单编号' width='100'></el-table-column>
								<el-table-column prop='product_status' label='状态' width='110'></el-table-column>
								<el-table-column label='生产进度' width='120' align='center'>
									<template slot-scope='scope'>
										<el-progress text-inside :stroke-width='18' :status='scope.row.is_finish?"success":""' :percentage="getPercentage((scope.row.order_area-scope.row.unfinish_area)/scope.row.order_area)"></el-progress>
									</template>
								</el-table-column>
								<el-table-column prop='product_date' label='生产日期' width='100' align='center'></el-table-column>
								<el-table-column label='完成日期' width='100' align='center'>
									<template slot-scope='scope'>
										<el-tooltip v-if='scope.row.is_finish' :content='"生产时长："+getOrderDays(scope)+"天"'>
											<el-tag type='success' size='mini'>{{ scope.row.finish_date }}</el-tag>
										</el-tooltip>
										<el-tag size='mini' v-else>已下单 {{ getOrderDays(scope) }} 天</el-tag>
									</template>
								</el-table-column>
								<el-table-column prop='order_amount' label='订单数量' align='right' width='110'></el-table-column>
								<el-table-column prop='order_area' label='订单面积' align='right' width='110'>
									<template slot-scope='scope'>
										<span>{{ scope.row.order_area }}㎡</span>
									</template>
								</el-table-column>
								<el-table-column prop='unfinish_area' label='未完成面积' align='right' width='110'>
									<template slot-scope='scope'>
										<span>{{ scope.row.unfinish_area }}㎡</span>
									</template>
								</el-table-column>
								<el-table-column prop='series' label='系列' width='110'></el-table-column>
								<el-table-column prop='model' label='窗型' width='110'></el-table-column>
								<el-table-column prop='window_style' label='闭窗器样式' width='110'></el-table-column>
								<el-table-column prop='update_time' label='更新时间' align='center' width='140'>
									<template slot-scope='scope'>
										<span>{{scope.row.update_time | formatDate}}</span>
									</template>
								</el-table-column>
							</el-table>
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
				<notice-area v-else></notice-area>
		  </el-collapse-item>
		  <el-collapse-item name="store" ref='item_store'>
		  	<div slot='title'>
		  		<el-badge class='_details-badge' value='有更新' :hidden='!hasUpdate("store")'>
		  			<b>仓库库存状态</b>
		  		</el-badge>
		  		<span class='_details-update-text'>更新：{{ project.store_update_time || '无'}}</span>
		  	</div>
		  	<div v-if='!hasTodo("store")'>
		  		<el-form class='c-form-text' label-width='150px'>
		  			<el-form-item label='型材首次入库日期'>
		  				<span>{{ project.store_xc_first_storage_date }}</span>
		  			</el-form-item>
		  			<el-form-item label='五金首次入库日期'>
		  				<span>{{ project.store_hardware_first_storage_date }}</span>
		  			</el-form-item>
		  		</el-form>
		  		<el-tabs value='list'>
		  			<el-tab-pane label='库存记录' name='list'>
		  				<el-table 
					  		:data='project.storeList' 
					  		v-loading='loading' 
					  		border stripe 
					  		size='small'>
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
		  	<notice-area v-else></notice-area>
		  </el-collapse-item>
		  <el-collapse-item name="transport" ref='item_transport'>
		  	<div slot='title' >
		  		<el-badge class='_details-badge' value='有更新' :hidden='!hasUpdate("transport")'>
		  			<b>储运状态</b>
		  		</el-badge>		  		
		  		<span class='_details-update-text'>更新：{{ project.transport_update_time || '无' }}</span>
		  	</div>
		  	<div v-if='!hasTodo("transport")'>
		  		<el-form class='c-form-text' label-width='100px'>
						<el-row>
							<el-col :span='12'>
								<el-form-item label='首次入库日期'>
									<span>{{ project.transport_first_storage_date }}</span>
								</el-form-item>
								<el-form-item label='累计入库量'>
									<span>{{ project.transport_storage_area }}</span>
								</el-form-item>
								<el-form-item label='首次发货日期'>
									<span>{{ project.transport_first_delivery_date }}</span>
								</el-form-item>
								<el-form-item label='累计发货量'>
									<span>{{ project.transport_delivery_area }}</span>
								</el-form-item>
							</el-col>
							<el-col :span='12'>							
								<el-row style='text-align: center'>
									<el-col :span='12' >
										<div style='margin-bottom: 10px'><strong>库存发货率</strong></div>
										<el-tooltip :content='project.transport_delivery_area+" / "+project.transport_storage_area+"㎡"'><el-progress :stroke-width='10' type='circle' :percentage="getPercentage(project.transport_delivery_area/project.transport_storage_area)"></el-progress></el-tooltip>
									</el-col>
									<el-col :span='12' >
										<div style='margin-bottom: 10px'><strong>项目发货率</strong></div>
										<el-tooltip :content='project.transport_delivery_area+" / "+project.contract_area+"㎡"'><el-progress :stroke-width='10' type='circle' :percentage="getPercentage(project.transport_delivery_area/project.contract_area)"></el-progress></el-tooltip>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
						<el-tabs value='list'>
							<el-tab-pane label='发货记录' name='list'>
								<el-table 
						  		:data='project.transportList' 
						  		v-loading='loading' border stripe
						  		size='small'>
									<el-table-column prop='order_no' fixed label='下单编号' width='120'></el-table-column>
									<el-table-column label='发货进度' min-width='120' align='center'>
										<template slot-scope='scope'>
											<el-progress text-inside :stroke-width='18' :status='getPercentage(scope.row.delivery_area/scope.row.storage_area)>=100?"success":""' :percentage="getPercentage(scope.row.delivery_area/scope.row.storage_area)"></el-progress>
										</template>
									</el-table-column>
									<el-table-column prop='first_storage_date' label='首次入库日期' align='center' width='110'>
									</el-table-column>
									<el-table-column prop='storage_area' label='累计入库面积' align='right' width='110'>
										<template slot-scope='scope'>
											<span>{{ scope.row.storage_area}}㎡</span>
										</template>
									</el-table-column>
									<el-table-column prop='storage_date' label='最近入库日期' align='center' width='110'>
									</el-table-column>
									<el-table-column prop='first_delivery_date' label='首次发货日期' align='center' width='110'>
									</el-table-column>
									<el-table-column prop='delivery_area' label='累计发货面积' align='right' width='110'>
										<template slot-scope='scope'>
											<span>{{ scope.row.delivery_area}}㎡</span>
										</template>
									</el-table-column>
									<el-table-column prop='delivery_date' label='最近发货日期' align='center' width='110'>
									</el-table-column>
									<el-table-column prop='delivery_content' label='发货内容描述' show-overflow-tooltip></el-table-column>
									
									<el-table-column prop='update_time' label='更新时间' align='center' width='140'>
										<template slot-scope='scope'>
											<span>{{scope.row.update_time | formatDate}}</span>
										</template>
									</el-table-column>
								</el-table>
							</el-tab-pane>
							<el-tab-pane name="problem">
					    	<el-badge class='_details-badge' :value='getProblemList("TRANSPORT").length' slot="label" >反馈问题</el-badge>
					    	<el-table 
						  		:data='getProblemList("TRANSPORT")' 
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
					</el-form>
		  	</div>
		  	<notice-area v-else></notice-area>
		  </el-collapse-item>
		  <el-collapse-item name="engineering" ref='item_engineering'>
		  	<div slot='title'>
		  		<el-badge class='_details-badge' value='有更新' :hidden='!hasUpdate("engineering")'>
		  			<span><b>工程报告</b></span>
		  		</el-badge>
		  		<span class='_details-update-text'>更新：{{ project.engineering_update_time||'无' }}</span>
		  	</div>
		  	<div v-if='!hasTodo("engineering")'>
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
		  <el-collapse-item name="finance" ref='item_finance'>
		  	<div slot='title'>
		  		<el-badge value='有更新' class='_details-badge' :hidden='!hasUpdate("finance")'>
		  			<b>回款情况</b>
		  		</el-badge>		  		
		  		<span class='_details-update-text'>更新：{{ project.finance_update_time || '无' }}</span>
		  	</div>
		  	<div v-if='!hasTodo("finance")'>
			  	<el-form class='c-form-text' label-width='100px'>
						<el-row>
							<el-col :span='12'>
								<el-form-item label='最近回款日期'>
									<span>{{ project.finance_last_payment_date}}</span>
								</el-form-item>
								<el-form-item label='累计回款金额'>
									<span>￥{{ project.finance_payment_price}}</span>
								</el-form-item>
								<el-form-item label='最近开票日期'>
									<span>{{ project.finance_last_open_date}}</span>
								</el-form-item>
								<el-form-item label='累计开票金额'>
									<span>￥{{ project.finance_open_price}}</span>
								</el-form-item>		
							</el-col>
							<el-col :span='12'>							
								<el-row style='text-align: center'>
									<el-col :span='24'>
										<div style='margin-bottom: 10px'><b>项目回款率</b></div>
										<el-tooltip :content='"￥"+project.finance_payment_price+" / "+project.contract_price'><el-progress :stroke-width='10' type='circle' :percentage="getPercentage(project.finance_payment_price/project.contract_price)"></el-progress></el-tooltip>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
					</el-form>
					<el-tabs value='list'>
						<el-tab-pane label='回款记录' name='list'>
							<el-table 
					  		:data='project.financeList' 
					  		v-loading='loading' border stripe size='small'>
								<el-table-column prop='no' fixed label='回款编号' width='120'></el-table-column>
								<el-table-column prop='payment_date' label='最近回款日期' align='center' width='110'></el-table-column>
								<el-table-column prop='payment_unit' label='回款单位' show-overflow-tooltip></el-table-column>
								<el-table-column prop='payment_price' label='累计回款金额' width='120' align='right'>
									<template slot-scope='scope'>
										<span>￥{{ scope.row.payment_price }}</span>
									</template>
								</el-table-column>
								<el-table-column prop='payment_method' label='回款形式'></el-table-column>
								<el-table-column prop='open_price' label='开票金额' width='120' align='right'>
									<template slot-scope='scope'>
										<span>￥{{ scope.row.open_price }}</span>
									</template>
								</el-table-column>
								<el-table-column prop='open_date' label='开票日期' align='center' width='100'></el-table-column>
								<el-table-column prop='update_time' label='更新时间' align='center' width='140'>
									<template slot-scope='scope'>
										<span>{{scope.row.update_time | formatDate}}</span>
									</template>
								</el-table-column>
							</el-table>
						</el-tab-pane>
						<el-tab-pane name="problem">
				    	<el-badge class='_details-badge' :value='getProblemList("finance").length' slot="label" >反馈问题</el-badge>
				    	<el-table 
					  		:data='getProblemList("finance")' 
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
		  <el-collapse-item name='problem' ref='item_problem'>
		  	<div slot='title'>
		  		<el-badge value='有更新' class='_details-badge' :hidden='!hasUpdate("finance")'>
		  			<b>项目问题处理记录</b>
		  		</el-badge>		  		
		  		<span class='_details-update-text'>更新：{{ project.finance_update_time || '无' }}</span>
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
			  <el-button type='primary' plain round>
			  	快速定位
			  	<i class='el-icon-location'></i>
				</el-button>
			  <el-dropdown-menu slot="dropdown">
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
			<el-button @click="refresh" >刷 新</el-button>
			<el-button @click="dialogShow=false" >打 印</el-button>
	    <el-button @click="dialogShow=false" type='primary'>关闭</el-button>	    
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

const projectInit = {
	id:null,
	name:'',
	contractList:[],
	saleplanList:[],
	productplanList:[],
	productList:[],
	financeList:[],
	problemList:[],
	viewLog:{}
}
export default {
	components:{ problemLevelTag,Notice,NoticeArea,problemInfo },
	props:{

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
				'contract':'合同情况',
				'saleplan':'销售计划情况',
				'productplan':'生产计划情况',
				'purchase':'采购情况',
				'product':'生产车间情况',
				'store':'仓库库存情况',
				'transport':'储运情况',
				'engineering':'工程情况',
				// 'business':'商务报价情况',
				'finance':'回款情况'
			},
			scrollDom:null,
			hasUpdateView:{},
			timeout:null
		}
	},
	mounted(){
		this.scrollDom = this.$refs.dialog.$el.firstChild
		this.scrollDom.addEventListener('scroll',this.scroll)
	},
	destroyed() {
	  this.scrollDom.removeEventListener('scroll', this.scroll)
	},
	computed:{
		//生产下单时长
		productplanOrderDays(){
			let finishDate 
			if(this.project.productplan_is_finish){
				finishDate = this.$moment(this.project.productplan_finish_date)
			}else{
				finishDate = this.$moment()
			}
			return finishDate.diff(this.$moment(this.project.productplan_first_order_date),'days')+1
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
		contractPayment(){			
			return commonJs.convertTextarea(this.project.contract_payment)
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
		},
		//生产下单完成率
		orderFinishAreaPercentage(){
			return Math.round(this.project.productplan_finish_area / this.project.productplan_order_area*100*100)/100||0
		},
		//项目下单率
		projectOrderAreaPercentage(){
			let a = this.project.contract_area || 0
			let b =  this.project.productplan_order_area|| 0
			if( b > a ){
				return 100
			}else{
				return Math.round(b / a*100*100)/100||0
			}
		},
		//项目
		// projectAreaPercentage(){
		// 	return Math.round(this.projectFinishArea/this.projectArea*100*100)/100||0
		// },
		//采购完成率
		purchaseFinishPercentage(){
			return Math.round(this.project.purchase_finish_order_total/this.project.purchase_order_total*100*100)/100||0
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
		open(id) {
			this.id = id
			this.names = Object.keys(this.areas)
			this.names.push('problem')
			this.hasUpdateView = {}
			this.project = Object.assign({},projectInit)
			this.getData()
			this.dialogShow = true
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
					let end = dom.offsetTop + dom.clientHeight
					let begin = dom.offsetTop+dom.clientHeight-e.target.clientHeight
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
				this.scrollDom.scrollTop = dom.offsetTop
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