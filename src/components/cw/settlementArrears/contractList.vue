<!-- 
此组件初始化时不会自动加载数据，请在mounted中 this.$refs.[].initData() 初始化数据
如果放在dialog里面的吗，请在dialog的open事件中用this.$nextTick进行初始化数据
 -->
<template>
  <div>
    <!-- 查询条件 -->
    <div style='margin-bottom:2px' v-show='!hideQuery'>
      <div style='float:right;margin-top:1px'>
        <span><el-button type='primary' @click='query' size='mini'>查询</el-button></span>
        <span><el-button @click='resetQuery' size='mini'>重置</el-button ></span>
        <span><el-button @click='exportExcel' size='mini'>导出</el-button ></span>
        <el-tooltip content='显示更多查询条件' placement='top'>
          <el-button @click='queryShowMore=!queryShowMore' size='mini'>
          <i :class="{'el-icon-arrow-up':queryShowMore,'el-icon-arrow-down':!queryShowMore}"></i>
          </el-button>
        </el-tooltip>
      </div>
      <el-form ref='formQuery' :model='queryParams' label-width='68px' 
        class='c-form-condensed' inline size='mini'>
         <el-form-item label='合同号' prop='contract_no'>
          <el-input v-model.trim='queryParams.contract_no' clearable></el-input>
        </el-form-item>
        <el-form-item prop='isArrears'>
          <el-tooltip content='只显示在途物资不等于0的合同'>
            <el-checkbox 
              v-model="queryParams.isArrears" 
              label="在途" 
              border
              :true-label='1'
              :false-label='0'
              @change='query({key:"isArrears"})'></el-checkbox>
          </el-tooltip>
        </el-form-item>
        <!-- 更多条件 -->
        <div v-show='queryShowMore'>
          <el-form-item label='客户名称' prop='customer_name'>
            <el-input v-model.trim='queryParams.customer_name' clearable></el-input>
          </el-form-item>
          <el-form-item label='销售公司' prop='company_name'>
            <el-input v-model.trim='queryParams.company_name' clearable></el-input>
          </el-form-item>  
          <el-form-item label='业务员' prop='salesman'>
            <el-input v-model.trim='queryParams.salesman' clearable></el-input>
          </el-form-item>
        </div>
        <!--/ 更多条件-->
      </el-form>
      
    </div>
    <!--/ 查询条件 -->
    <slot name='button'></slot>
    <!-- 数据表格 -->
    <el-table 
      :data='list' 
      ref='tableList'
      v-loading='loading'
      border 
      stripe
      :size='size'
      :max-height='maxHeight'
      :show-summary='showSummary'
      :summary-method='getSummaryData'
      @sort-change='sortChange'>
      <el-table-column prop='contract_no' fixed label='合同编号' min-width='150'  show-overflow-tooltip>
        <template slot-scope='{row}'>
          <span>{{row.contract_no}}</span>
        </template>
      </el-table-column>
      <el-table-column prop='customer_name' label='客户名称' width='150' show-overflow-tooltip />
      <el-table-column prop='company_name' label='业绩公司' width='120' show-overflow-tooltip />
      <el-table-column prop='salesman' label='业务员' width='100' show-overflow-tooltip />
      <el-table-column prop='arrears_project_total' label='在途项目' sortable='custom' width='100' align='center'>
        <template slot-scope='{row}'>
          <span class='c-link' @click='openProject(row)'>{{row.arrears_project_total}}</span>
        </template>
      </el-table-column>
      <el-table-column prop='contract_price' sortable align='right' label='合同金额' width='120'>
        <template slot-scope='{row}'>
          ￥ {{row.contract_price}}
        </template>
      </el-table-column>
      <el-table-column prop='settlement_price_total' sortable align='right' label='已对账货款' width='120'>
        <template slot-scope='{row}'>
          ￥ {{row.settlement_price_total}}
        </template>
      </el-table-column>
      <el-table-column prop='cw_invoice_price_total' sortable align='right' label='已开票金额' width='120'>
        <template slot-scope='{row}'>
          ￥ {{row.cw_invoice_price_total}}
        </template>
      </el-table-column>
      <el-table-column label='开票进度' width='120' prop='invoice_progress' sortable align='center'>
        <template slot-scope='{ row }'>           
          <el-tooltip placement='left' :content='row.cw_invoice_price_total+"㎡（已开票金额） / "+row.settlement_price_total+"㎡（已对账货款）"'>
            <el-progress 
              text-inside 
              :stroke-width='16' 
              :status='Number(row.invoice_progress)>=100?"success":""' 
              :percentage="Number(row.invoice_progress)>=100?100:Number(row.invoice_progress)"></el-progress>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop='cw_last_invoice_date' label='最近开票日期' sortable='custom' width='120' />
      <el-table-column prop='arrears_price' fixed='right' align='right' sortable='custom' label='在途物资金额' width='150' >
        <template slot-scope='{row}'>
          ￥{{ row.arrears_price }}
        </template>
      </el-table-column>
      <!-- slot[column] -->
      <slot name='column'></slot>
      <!--/ slot[column]-->
    </el-table>
    <!-- 数据表格 -->
    <!-- 分页 -->
    <el-pagination 
      v-if='!noPage'
      style='margin-top: 10px'
      :page-sizes = "[10, 20, 50, 100]"
      :page-size= "requestParams.pageSize"
      :current-page.sync = "requestParams.currentPage"
      layout="total, sizes, prev, pager, next, jumper"
      :total="dataTotal"
      @size-change='sizeChange'
      @current-change='getData'
      >
    </el-pagination>
    <!--/ 分页 -->  
    <project-list-dialog :in-dialog='inDialog' ref='projectListDialog'></project-list-dialog>
  </div>
</template>
<script>
import arrearsApi from '@/api/cw/settlementArrears'
import projectListDialog from './projectListDialog'

export default {
  components:{ projectListDialog },
  props:{
    size:{
      type:String,
      default:''
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
    sortProp:{
      default:''
    },
    sortOrder:{
      default:''
    },
    hideQuery:{
      type:Boolean,
      default:false
    },
    init:{
      type:Boolean,
      default:false
    },
    showSummary:{
      type:Boolean,
      default:true
    },
    noPage:{
      type:Boolean,
      default:false
    },
    hideEditField:{
      type:Boolean,
      default:false
    },
    hideSubmitField:{
      type:Boolean,
      default:false
    },
  },
  data(){
    return {
      inited:false,
      loading: false,      
      list:[],
      dataTotal:0,    
      queryShowMore:false,
      summaryData:{},
      initParams:{},
      initQueryParams:{},
      //查询条件字段
      queryParams:{
        isArrears:0,
        project_name:'',
        customer_name:'',
        company_name:''
      },
      //数据请求的参数
      requestParams:{
        pageSize:10,//分页大小
        currentPage:1,//当前页
        sortProp:this.sortProp,
        sortOrder:this.sortOrder,
        noPage:this.noPage?1:0
      }     
    }
  },
  mounted(){
    if(this.init){
      this.inited = true
      this.initData()
    }    
  },
  methods:{
    getSummaryData({columns,data}){
      let sum = []
      columns.forEach((column,i)=>{
        if(i==0){
          sum[i]='合计'
        }else{
          sum[i] = this.summaryData[column.property]
        }       
      })
      return sum
    },
    initData(params={}){
      this.initParams = {...params}
      this.resetQuery()
    },
    reload(){
      if(this.inited){
        this.getData()
      }else{
        this.initData()
      }      
    },
    clear(){
    	this.list = []
    },
    //分页容量大小发生变化时
    sizeChange(value){
      this.requestParams.pageSize=value
      this.getData()
    },
    //获取数据
    getData() {
      this.loading=true
      arrearsApi.getContractList({...this.requestParams,...this.params,...this.initParams}).then(res=>{
        this.list = res.data.list
        this.dataTotal = res.data.total
        this.summaryData = res.data.summary
        this.loading = false
        this.$emit('loaded',{ 
          total:res.data.total,
          list:res.data.list,
          params:{...this.queryParams} 
        })
      })
    },
    //查询方法
    query({ key }={}){
      if(key){
        let value = this.queryParams[key]
        this.requestParams = {...this.requestParams,[key]:value}
      }else{
        this.requestParams = {...this.requestParams,...this.queryParams}
      }     
      this.getData()
    },
    //重置查询条件
    resetQuery(){
      this.$refs.formQuery.resetFields()
      this.queryParams = {...this.queryParams,...this.initQueryParams}
      this.requestParams.currentPage=1
      this.query()
    },
    openProjectDetails(projectId){
      this.$refs.projectDetails.open(projectId)
    },
    sortChange({prop,order}){
      this.requestParams.sortProp = prop
      this.requestParams.sortOrder = order
      this.getData()
    },
    openProject(row){
      this.$refs.projectListDialog.open().then(that=>{
        that.initData({
          contract_id:row.id
        })
      })
    },
    exportExcel(){
      arrearsApi.exportContractExcel(this.requestParams)
    }
  }
}
</script>