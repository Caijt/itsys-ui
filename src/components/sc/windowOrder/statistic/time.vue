<template>
	<div>
		<div style='margin-bottom:15px' v-show='!hideQuery'>
			<div style='float:right;margin-top:1px'>
				<span><el-button type='primary' @click='query' size='mini'>统计</el-button></span>
				<span><el-button @click='resetQuery' size='mini'>重置</el-button ></span>
				<span v-if='false'><el-button @click='exportExcel' size='mini'>导出</el-button ></span>
        <el-tooltip content='显示更多统计条件' placement='top'>
          <el-button @click='queryShowMore=!queryShowMore' size='mini'>
          <i :class="{'el-icon-arrow-up':queryShowMore,'el-icon-arrow-down':!queryShowMore}"></i>
          </el-button>
        </el-tooltip>
			</div>
			<el-form ref='formQuery' :model='queryParams' label-width='68px' 
				class='c-form-condensed' inline size='mini'>
				<el-form-item label='统计单位' prop='unit'>
					<el-select v-model='queryParams.unit' style='width: 100px'>
						<el-option label='年' value='year'></el-option>
						<el-option label='月' value='month'></el-option>
						<el-option label='日' value='day'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label='统计时段'>
					<el-row style='width:300px'>
						<el-col :span="11">
							<el-form-item prop='time_begin'>
				      	<el-date-picker 
				      		v-model='queryParams.time_begin' 
				      		placeholder='开始时间' 
				      		value-format='yyyy-MM-dd' 
				      		style='width: 100%'
				      		:type='unitType'/>
				    	</el-form-item>
				    </el-col>
				    <el-col :span="2">至</el-col>
				    <el-col :span="11">
				    	<el-form-item prop='time_end'>
				    		<el-date-picker 
				    			v-model='queryParams.time_end' 
				    			placeholder='结束时间' 
				    			value-format='yyyy-MM-dd' 
				    			style='width: 100%'
				    			:type='unitType'/>
				      </el-form-item>
				    </el-col>
			  	</el-row>
				</el-form-item>
				<!-- 更多条件 -->
				<div v-if='queryShowMore'>
					<el-form-item label='订单编号' prop='order_no'>
						<el-input v-model='queryParams.order_no' clearable></el-input>
					</el-form-item>
					<el-form-item label='项目名称' prop='project_name'>
						<el-input v-model='queryParams.project_name' clearable></el-input>
					</el-form-item>
					<el-form-item label='订单类型' prop='order_type'>
						<el-input v-model='queryParams.order_type' clearable></el-input>
					</el-form-item>
					<el-form-item label='客户名称' prop='customer_name'>
						<el-input v-model='queryParams.customer_name' clearable></el-input>
					</el-form-item>
					<el-form-item label='合同号' prop='contract_no'>
						<el-input v-model='queryParams.contract_no' clearable></el-input>
					</el-form-item>
					<el-form-item label='地盘' prop='domain'>
						<el-input v-model='queryParams.domain' clearable></el-input>
					</el-form-item>
					<el-form-item label='备注' prop='remarks'>
						<el-input v-model='queryParams.remarks' clearable></el-input>
					</el-form-item>
					<el-form-item label='生产状态' prop='produce_status_remarks'>
						<el-input v-model='queryParams.produce_status_remarks' placeholder='生产状态描述' clearable></el-input>
					</el-form-item>							
					<!-- <el-form-item label='产品数量'>
						<el-row style='width:300px'>
							<el-col :span="11">
								<el-form-item prop='amount_begin'>
					      	<el-input v-model='queryParams.amount_begin' placeholder='最小值' clearable>
										<span slot="suffix">樘</span>
									</el-input>
					    	</el-form-item>
					    </el-col>
					    <el-col :span="2">至</el-col>
					    <el-col :span="11">
					    	<el-form-item prop='amount_end'>
					    		<el-input v-model='queryParams.amount_end' placeholder='最小值' clearable>
										<span slot="suffix">樘</span>
									</el-input>
					      </el-form-item>
					    </el-col>
				  	</el-row>
					</el-form-item> -->
					<!-- <el-form-item label='订单面积'>
						<el-row style='width:300px'>
							<el-col :span="11">
								<el-form-item prop='area_begin'>
					      	<el-input v-model='queryParams.area_begin' placeholder='最小值' clearable>
										<span slot="suffix">㎡</span>
									</el-input>
					    	</el-form-item>
					    </el-col>
					    <el-col :span="2">至</el-col>
					    <el-col :span="11">
					    	<el-form-item prop='area_end'>
					    		<el-input v-model='queryParams.area_end' placeholder='最小值' clearable>
										<span slot="suffix">㎡</span>
									</el-input>
					      </el-form-item>
					    </el-col>
				  	</el-row>
					</el-form-item> -->			
				</div>
				<!--/ 更多条件-->
			</el-form>			
		</div>
		<div ref='chartContainer' :style='{width:"100%",height:chartHeight}'></div>
	</div>
</template>
<script>
	import orderApi from '@/api/yyzx/windowOrder'
	import logApi from '@/api/sc/produceLog'
	export default{
		props:{
			params:{
				default:()=>({})
			},
			hideQuery:{
				type:Boolean,
				default:false
			},
			chartHeight:{
				type:String,
				default:'350px'
			}
		},
		data(){
			return {
				queryShowMore:false,
				echarts:null,
				initParams:{},
				queryParams:{
					unit:'month',
					time_begin:'',
					time_end:''
				},
				requestParams:{

				}
			}
		},
		computed:{
			unitType(){
				let type = 'date'
				if(this.queryParams.unit=='year'){
					type = 'year'
				}else if(this.queryParams.unit=='month'){
					type = 'month'
				}else if(this.queryParams.unit=='day'){
					type = 'date'
				}
				return type
			}
		},
		beforeDestroy() {
	    if (!this.echarts) {
	      return
	    }
	    this.echarts.dispose();
	    this.echarts = null;
	  },
		mounted(){
			this.initChart()
		},
		methods:{
			initChart(){
				let echarts = require('echarts')
				this.echarts = echarts.init(this.$refs.chartContainer)
				this.echarts.setOption({			    
			    legend: {},
		    	// grid:{ bottom:30 },
		    	// dataset:[{},{}],
		    	grid:[
		    		{ right:'55%'},{ left:'55%' }
		    	],
			     tooltip: {
			    	trigger:'axis'			    	
			    },
			    xAxis: [
			    	{
				    	type:'category',
				    	gridIndex:0
			    	},
			    	{
				    	type:'category',
				    	gridIndex:1
			    	}
			    ],
			    yAxis: [
				    {
	            type: 'value',		        
		          name: '面积',
		          gridIndex:0      
		        },
		        {
		          type: 'value',
		          name: '数量',
		          gridIndex:0,
		          splitLine:{
		          	show:false
		          }
		        },
		        {
	            type: 'value',		        
		          name: '面积',
		          gridIndex:1		          
		        },
		        {
		          type: 'value',
		          name: '数量',
		          gridIndex:1,
		          splitLine:{
		          	show:false
		          }
		        }
		      ],
			    series: [
			    	{
			        name: '订单面积',
			        type: 'bar',
			        xAxisIndex:0,
			        yAxisIndex:0
			    	},
			    	{
			        name: '订单数量',
			        type: 'line',	
			        xAxisIndex:0,
			        yAxisIndex: 1,	     
			    	},
			    	{
			        name: '生产面积',
			        type: 'bar',
			        xAxisIndex:1,
			        yAxisIndex:2,
			        datasetIndex:1
			    	},
			    	{
			        name: '生产数量',
			        type: 'line',	
			        xAxisIndex:1,
			        yAxisIndex:3,			
			        datasetIndex:1        
			    	},
			    ]
				});				
			},
			getData(){
				this.echarts.showLoading()
				let orderData =	orderApi.getTimeStatistic({
					...this.requestParams,
					...this.params,
					...this.initParams
				})
				let logData =	logApi.getTimeStatistic({
					...this.requestParams,
					...this.params,
					...this.initParams
				})
				Promise.all([orderData,logData]).then(([o,l])=>{
					this.echarts.setOption({	
						dataset:[
							{
								source:o.data
							},
						  {
						  	source:l.data
						  }
						]
					})
					this.echarts.hideLoading()
				})
			},
			query({ key }={}){
				if(key){
					let value = this.queryParams[key]
					this.requestParams = {...this.requestParams,[key]:value}
				}else{
					this.requestParams = {...this.requestParams,...this.queryParams}
				}			
				this.getData()
			},
			//重置并查询		
			resetQuery(){
				this.$refs.formQuery.resetFields()
				this.query()
			},
			exportExcel(){

			},
			initData(params={}){
				this.initParams = params
				this.resetQuery()
			}
		}
	}
</script>