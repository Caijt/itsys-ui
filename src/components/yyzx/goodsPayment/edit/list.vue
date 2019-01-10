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
        <el-form-item label='项目编号' prop='project_no'>
          <el-input v-model.trim='queryParams.project_no' clearable></el-input>
        </el-form-item>
        <el-form-item label='项目名称' prop='project_name'>
          <el-input v-model.trim='queryParams.project_name' clearable></el-input>
        </el-form-item>
        <!-- 更多条件 -->
        <template v-if='queryShowMore'>
          <el-form-item label='合同号' prop='contract_no'>
            <el-input v-model.trim='queryParams.contract_no' clearable></el-input>
          </el-form-item>
          <el-form-item label='客户名称' prop='customer_name'>
            <el-input v-model.trim='queryParams.customer_name' clearable></el-input>
          </el-form-item>
          <el-form-item label='业绩公司' prop='company_name'>
            <el-input v-model.trim='queryParams.company_name' clearable></el-input>
          </el-form-item>  
          <el-form-item label='业务员' prop='salesman'>
            <el-input v-model.trim='queryParams.salesman' clearable></el-input>
          </el-form-item>
          <el-form-item label='结算订单' prop='settlement_order'>
            <el-input v-model.trim='queryParams.settlement_order' clearable></el-input>
          </el-form-item>
        </template>
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
      <el-table-column prop='project_no' fixed label='项目编号' width='110'>
        <template slot-scope='{row}'>
          <span>{{row.project_no}}</span>
        </template>
      </el-table-column>
      <el-table-column prop='project_name' label='项目名称' width='110' show-overflow-tooltip />
      <el-table-column prop='contract_no' label='合同号' width='110' show-overflow-tooltip >
        <template slot-scope='{row}'>
          <span class='c-link' @click='$refs.contractInfo.open(row.contract_id)'>{{row.contract_no}}</span>
        </template>
      </el-table-column>
      <el-table-column prop='customer_name' label='客户名称' width='110' show-overflow-tooltip />
      <el-table-column prop='company_name' label='业绩公司' width='110' show-overflow-tooltip />
      <el-table-column prop='salesman' label='业务员' width='110' show-overflow-tooltip />
      <el-table-column prop='settlement_order' label='结算订单' width='100' show-overflow-tooltip />
      <el-table-column prop='settlement_area' align='right' sortable='custom' label='结算面积' width='100' >
        <template slot-scope='{row}'>
          {{ row.settlement_area }}㎡
        </template>
      </el-table-column>
       <el-table-column prop='settlement_price' align='right' sortable='custom' label='结算金额' width='100' >
        <template slot-scope='{row}'>
          ￥{{ row.settlement_price }}
        </template>
      </el-table-column>
      <el-table-column prop='create_user_name' label='录入员' />
      <el-table-column v-if='!hideEditField' prop='create_time' label='创建时间' sortable='custom' width='120'>
        <template slot-scope='{row}'>
          {{ $commonJs.formatDate(row.create_time) }}
        </template>
      </el-table-column>
      <el-table-column v-if='!hideEditField' prop='update_time' label='更新时间' sortable='custom' width='120'>
        <template slot-scope='{row}'>
          {{ $commonJs.formatDate(row.update_time) }}
        </template>
      </el-table-column>
      <el-table-column v-if='!hideSubmitField' prop='submit_time' label='提交时间' sortable='custom' width='120'>
        <template slot-scope='{row}'>
          {{ $commonJs.formatDate(row.submit_time) }}
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
    <info ref='info'/>
    <contract-info ref='contractInfo'/>
  </div>
</template>
<script>
import paymentApi from '@/api/yyzx/goodsPayment'
import orderApi from '@/api/yyzx/order'
import info from './info'
import contractInfo from '@/components/yyzx/contract/info'

export default {
  components:{ info, contractInfo },
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
        sample_no:'',
        project_name:'',
        customer_name:'',
        company_name:'',
        color_no:'',
        series:'',
        surface:'',
        temperature:'',
        xc_color:'',
        wj_color:'',
        xc_brand:'',
        wj_brand:'',
        glass_color:'',
        material:'',
        inCompany:1,
        input_status:1
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
      paymentApi.getList(this.requestParams).then(res=>{
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
      paymentApi.exportExcel(this.requestParams)
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
    del({ row,$index }){
      let confirmText = '确定删除吗？'
      this.$confirm(confirmText,'提示',{
        type: 'warning'
      }).then(()=>{
        paymentApi.del(row.id).then(res=>{
          this.list.splice($index,1)
          this.dataTotal--
          this.$message.success('删除成功')
          this.$emit('del')         
        })
      })
    },
    openInfo(id){
      this.$refs.info.open().then(that=>{
        that.getInfo(id)
      })
    }
  }
}
</script>