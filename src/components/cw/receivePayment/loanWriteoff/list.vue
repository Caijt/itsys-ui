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
        <el-form-item label='回款编号' prop='task_no'>
          <el-input v-model.trim='queryParams.task_no' clearable></el-input>
        </el-form-item>
        <el-form-item label='客户名称' prop='customer_name'>
          <el-input v-model.trim='queryParams.customer_name' clearable></el-input>
        </el-form-item>
        <!-- 更多条件 -->
        <span v-show='queryShowMore'>
          <el-form-item label='客户类别' prop='customer_type'>
            <el-input v-model.trim='queryParams.customer_type' clearable></el-input>
          </el-form-item>
          <el-form-item label='收款公司' prop='company_name'>
            <el-input v-model.trim='queryParams.company_name' clearable></el-input>
          </el-form-item>  
          <el-form-item label='回款形式' prop='payment_method'>
            <el-input v-model.trim='queryParams.payment_method' clearable></el-input>
          </el-form-item>
          <el-form-item label='回款日期'>
            <el-row style='width:300px'>
              <el-col :span="11">
                <el-form-item prop='payment_date_begin'>
                  <el-date-picker v-model='queryParams.payment_date_begin' placeholder='开始日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="2">至</el-col>
              <el-col :span="11">
                <el-form-item prop='payment_date_end'>
                  <el-date-picker v-model='queryParams.payment_date_end' placeholder='结束日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </span>
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
      <el-table-column prop='no' fixed label='回款编号' width='110'>
        <template slot-scope='{row}'>
          <span class='c-link' @click='openInfo(row)'>{{row.no}}</span>
        </template>
      </el-table-column>
      <el-table-column prop='customer_name' label='客户名称' min-width='150' show-overflow-tooltip />
      <el-table-column prop='customer_type' label='客户类别' width='90' show-overflow-tooltip />
      <el-table-column prop='payment_price' align='right' sortable='custom' label='回款金额' width='110' >
        <template slot-scope='{row}'>
          ￥{{ row.payment_price }}
        </template>
      </el-table-column>
      <el-table-column prop='project_payment_record_total' align='center' sortable='custom' label='已核销项目' width='110' >
        <template slot-scope='{row}'>
          {{ row.project_payment_record_total }}
        </template>
      </el-table-column>
      <el-table-column prop='project_payment_price_total' align='right' sortable='custom' label='已核销货款' width='110' >
        <template slot-scope='{row}'>
          ￥{{ row.project_payment_price_total }}
        </template>
      </el-table-column>
      <el-table-column prop='payment_date' label='回款日期' sortable='custom' width='100' show-overflow-tooltip />
      <el-table-column prop='payment_method' label='回款形式' width='100' show-overflow-tooltip />
      <el-table-column prop='company_name' label='收款单位' width='100' show-overflow-tooltip />
      <el-table-column prop='create_user_name' label='录入员' />
      <el-table-column v-if='!hideSubmitField' prop='submit_time' label='提交时间' sortable='custom' width='120'>
        <template slot-scope='{row}'>
          {{ $commonJs.formatDate(row.submit_time) }}
        </template>
      </el-table-column>
      <el-table-column prop='project_total' fixed='right' align='center' sortable='custom' label='可核销项目' width='110' />
      <el-table-column prop='to_writeoff_price' fixed='right' align='right' sortable='custom' label='待核销金额' width='130'>
        <template slot-scope='{row}'>
          ￥{{ row.to_writeoff_price }}
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
    <info :in-dialog='inDialog' ref='info' />
  </div>
</template>
<script>
import paymentApi from '@/api/cw/receivePaymentRecord'
import info from '../info'

export default {
  components:{ info },
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
      //查询条件字段
      queryParams:{
        input_status:1,
        customer_name:'',
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
    initData(){
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
      paymentApi.getLoanWriteoffList(this.requestParams).then(res=>{
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
      this.queryParams = {...this.queryParams,...this.params}
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
    openOrderInfo(id){
      this.$refs.orderInfo.open(id)
    },
    exportExcel(){
      paymentApi.exportExcel({...this.requestParams,fileName:'回款核销列表'})
    },
    getOrderFieldList(field){
      return (keyword,callback)=>{
        orderApi.getFieldList({ field,keyword }).then(res=>{
          callback(res.data)
        })
      }
    },
    getProjectFieldList(field){
      return (keyword,callback)=>{
        projectApi.getFieldList({ field,keyword }).then(res=>{
          callback(res.data)
        })
      }
    },
    openApplyListDialog(row){
      this.$refs.applyListDialog.open({ sample_id:row.id })
    },
    undo({ row,$index }){
      let confirmText = '确定撤回此项目货款吗？撤回后将恢复到编辑列表中'
      this.$confirm(confirmText,'提示',{
        type: 'warning'
      }).then(()=>{
        paymentApi.undo(row.id).then(res=>{
          this.list.splice($index,1)
          this.dataTotal--
          this.$message.success('撤回成功')
          this.$emit('undo')         
        })
      })
    },
    openInfo(row){
      this.$refs.info.open().then(that=>{
        that.getInfo(row.id)
      })
    }
  }
}
</script>