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
				<el-form-item label='开票日期'>
					<el-row style='width:300px'>
						<el-col :span="11">
							<el-form-item prop='invoice_date_begin'>
				      	<el-date-picker 
				      		v-model='queryParams.invoice_date_begin' 
				      		placeholder='开始日期' 
				      		value-format='yyyy-MM-dd' 
				      		style='width: 100%'/>
				    	</el-form-item>
				    </el-col>
				    <el-col :span="2">至</el-col>
				    <el-col :span="11">
				    	<el-form-item prop='invoice_date_end'>
				    		<el-date-picker 
				    			v-model='queryParams.invoice_date_end' 
				    			placeholder='结束日期' 
				    			value-format='yyyy-MM-dd' 
				    			style='width: 100%'/>
				      </el-form-item>
				    </el-col>
			  	</el-row>
				</el-form-item>
				<!-- 更多条件 -->
				<div v-if='queryShowMore'>					
          <el-form-item label='公司名称' prop='company_name'>
            <el-input v-model.trim='queryParams.company_name' clearable></el-input>
          </el-form-item>
				</div>
				<!--/ 更多条件-->
			</el-form>			
		</div>
		<div ref='chartContainer' :style='{width:"100%",height:chartHeight}'></div>
	</div>
</template>
<script>
	import invoiceApi from '@/api/cw/invoiceRecord'
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
				default:'500px'
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
					noPage:1,
					sortProp:'invoice_price_total'
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
			    grid:{
			    	left:'150px'
			    },
			    xAxis: [
			    	{
	            type: 'value',		        
		          name: '金额',
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
			    yAxis: [
			    	{
				    	type:'category',
				    	inverse:true,
				    	axisLabel:{
				    		formatter:(value,index)=>{
				    			if(value.length>11){
				    				let text = value.substr(0,10)
				    				return text+'...'
				    			}else{
				    				return value
				    			}
				    		}
				    	},
			    	}
		      ],
			    series: [
			    	{
			        name: '开票金额',
			        type: 'bar',
			    	},
			    	{
			        name: '开票数量',
			        type: 'line',	
			        xAxisIndex: 1,	     
			    	}
			    ]
				});				
			},
			getData(){
				this.echarts.showLoading()
				invoiceApi.getCompanyStatisticList({
					...this.requestParams,
					...this.params,
					...this.initParams
				}).then(res=>{
					this.echarts.setOption({	
						dataset:
							{			
								dimensions: ['company_name', 'invoice_price_total', 'invoice_total'],	
								source:res.data.list
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