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
					<el-form-item label='任务编号' prop='task_no'>
	          <el-input v-model.trim='queryParams.task_no' clearable></el-input>
	        </el-form-item>
	        <el-form-item label='项目名称' prop='project_name'>
	          <el-input v-model.trim='queryParams.project_name' clearable></el-input>
	        </el-form-item>
	        <el-form-item label='合同号' prop='contract_no'>
            <el-input v-model.trim='queryParams.contract_no' clearable></el-input>
          </el-form-item>
          <el-form-item label='销售公司' prop='company_name'>
            <el-input v-model.trim='queryParams.company_name' clearable></el-input>
          </el-form-item>
          <el-form-item label='业务员' prop='salesman'>
            <el-input v-model.trim='queryParams.salesman' clearable></el-input>
          </el-form-item>
          <el-form-item label='联系电话' prop='salesman_tel'>
            <el-input v-model.trim='queryParams.salesman_tel' placeholder='业务员联系电话' clearable></el-input>
          </el-form-item>
          <el-form-item label='调拨单号' prop='db_no'>
            <el-input v-model.trim='queryParams.db_no' clearable></el-input>
          </el-form-item>
          <el-form-item label='发货申请' prop='fh_no'>
            <el-input v-model.trim='queryParams.fh_no' placeholder='发货申请编号' clearable></el-input>
          </el-form-item>
          <el-form-item label='发货工厂' prop='factory_name'>
            <el-input v-model.trim='queryParams.factory_name' clearable></el-input>
          </el-form-item>
          <el-form-item label='发货订单' prop='order_no'>
            <el-input v-model.trim='queryParams.order_no' clearable></el-input>
          </el-form-item>
          <el-form-item label='交付方式' prop='method'>
            <el-input v-model.trim='queryParams.method' clearable></el-input>
          </el-form-item>
          <el-form-item label='收货单位' prop='receive_unit'>
            <el-input v-model.trim='queryParams.receive_unit' clearable></el-input>
          </el-form-item>
          <el-form-item label='收货地址' prop='receive_address'>
            <el-input v-model.trim='queryParams.receive_address' clearable></el-input>
          </el-form-item>
          <el-form-item label='收货人' prop='receive_name'>
            <el-input v-model.trim='queryParams.receive_name' clearable></el-input>
          </el-form-item>
          <el-form-item label='收货联系' prop='receive_tel'>
            <el-input v-model.trim='queryParams.receive_tel' placeholder='收货人联系电话' clearable></el-input>
          </el-form-item>
				</div>
				<!--/ 更多条件-->
			</el-form>			
		</div>
		<div ref='chartContainer' :style='{width:"100%",height:chartHeight}'></div>
	</div>
</template>
<script>
	import taskApi from '@/api/yyzx/deliveryTask'
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
			    tooltip: {
			    	trigger:'axis'			    	
			    },
			    xAxis: [
			    	{
				    	type:'category',
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
		        }
		      ],
			    series: [
			    	{
			        name: '任务面积',
			        type: 'bar',
			    	},
			    	{
			        name: '任务数量',
			        type: 'line',	
			        yAxisIndex: 1,	     
			    	}
			    ]
				});				
			},
			getData(){
				this.echarts.showLoading()
				taskApi.getTimeStatistic({
					...this.requestParams,
					...this.params,
					...this.initParams
				}).then(res=>{
					this.echarts.setOption({	
						dataset:
							{
								source:res.data
							},						
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