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
        <el-form-item label='项目名称' prop='project_name'>
          <el-input v-model.trim='queryParams.project_name' clearable></el-input>
        </el-form-item>
        <!-- 更多条件 -->
        <template v-if='queryShowMore'>
          <el-form-item label='客户名称' prop='customer_name'>
            <el-input v-model.trim='queryParams.customer_name' clearable></el-input>
          </el-form-item>
          <el-form-item label='销售公司' prop='company_name'>
            <el-input v-model.trim='queryParams.company_name' clearable></el-input>
          </el-form-item>  
          <el-form-item label='业务员' prop='salesman'>
            <el-input v-model.trim='queryParams.salesman' clearable></el-input>
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
      @sort-change='sortChange'
      :show-summary='showSummary'
      :summary-method='getSummaryData'
      @selection-change='selectionChange'>
      <el-table-column
        v-if='showSelection'
        type="selection"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column prop='index' sortable='custom' label='序号' width='80' show-overflow-tooltip />
      <el-table-column prop='type' label='类别' width='110' show-overflow-tooltip />
      <el-table-column prop='name' label='品名' width='110' show-overflow-tooltip />
      <el-table-column prop='no' label='编号' width='110' show-overflow-tooltip />
      <el-table-column prop='size' label='规格/尺寸' width='110' show-overflow-tooltip />
      <el-table-column prop='amount' sortable='custom' label='数量' width='90' show-overflow-tooltip >
        <template slot-scope='{row}'>
          {{row.amount}}{{row.unit}}
        </template>
      </el-table-column>
      <el-table-column prop='area' sortable='custom' align='right' label='面积' width='90' show-overflow-tooltip >
        <template slot-scope='{row}'>
          {{row.area}}㎡
        </template>
      </el-table-column>
      <el-table-column 
        v-if='!hideSubmitField' 
        prop='load_progress' 
        label='装车进度' 
        width='120' 
        sortable='custom' 
        align='center'>
        <template slot-scope='{ row }'>           
          <el-tooltip placement='left' :content='row.cy_load_area_total+"㎡（已装车面积） / "+row.area+"㎡（产品面积）"'>
            <el-progress 
              text-inside 
              :stroke-width='16' 
              :status='Number(row.load_progress)>=100?"success":""' 
              :percentage="Number(row.load_progress)>=100?100:Number(row.load_progress)"></el-progress>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column 
        v-if='!hideSubmitField'
        prop='delivery_progress' 
        label='发货进度' 
        width='120' 
        sortable='custom' 
        align='center'>
        <template slot-scope='{ row }'>           
          <el-tooltip placement='left' :content='row.cy_delivery_area_total+"㎡（已发货面积） / "+row.area+"㎡（产品面积）"'>
            <el-progress 
              text-inside 
              :stroke-width='16' 
              :status='Number(row.delivery_progress)>=100?"success":""' 
              :percentage="Number(row.delivery_progress)>=100?100:Number(row.delivery_progress)"></el-progress>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column v-if='!hideSubmitField' prop='receive_progress' label='签收进度' width='120' sortable='custom' align='center'>
        <template slot-scope='{ row }'>           
          <el-tooltip placement='left' :content='row.cy_receive_area_total+"㎡（已签收面积） / "+row.area+"㎡（产品面积）"'>
            <el-progress 
              text-inside 
              :stroke-width='16' 
              :status='Number(row.receive_progress)>=100?"success":""' 
              :percentage="Number(row.receive_progress)>=100?100:Number(row.receive_progress)"></el-progress>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column v-if='!hideSubmitField' prop='finish_progress' label='完成进度' width='120' sortable='custom' align='center'>
        <template slot-scope='{ row }'>           
          <el-tooltip placement='left' :content='row.cy_finish_area_total+"㎡（已完成面积） / "+row.area+"㎡（产品面积）"'>
            <el-progress 
              text-inside 
              :stroke-width='16' 
              :status='Number(row.finish_progress)>=100?"success":""' 
              :percentage="Number(row.finish_progress)>=100?100:Number(row.finish_progress)"></el-progress>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column  prop='remarks' label='备注' width='90' show-overflow-tooltip />
      <el-table-column v-if='!hideEditField' prop='create_user_name' label='录入员' />
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
  </div>
</template>
<script>
import productApi from '@/api/yyzx/deliveryTaskProduct'

export default {
  components:{ },
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
    showSelection:{
      type:Boolean,
      default:false
    },
    hideQuery:{
      type:Boolean,
      default:false
    },
    init:{
      type:Boolean,
      default:false
    },
    noPage:{
      type:Boolean,
      default:false
    },
    showSummary:{
      type:Boolean,
      default:true
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
      initParams:{},
      queryShowMore:false,
      summaryData:{},
      selectionList:[],
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
      this.inited = true
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
    selectionChange(valueArrary){
      this.selectionList = valueArrary
    },
    //分页容量大小发生变化时
    sizeChange(value){
      this.requestParams.pageSize=value
      this.getData()
    },
    //获取数据
    getData() {
      this.loading=true
      productApi.getList({...this.requestParams,...this.initParams}).then(res=>{
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
      productApi.exportExcel(this.requestParams)
    },
    openApplyListDialog(row){
      this.$refs.applyListDialog.open({ sample_id:row.id })
    },   
    del({ row,$index }){
      let confirmText = '确定删除此产品吗？'
      this.$confirm(confirmText,'提示',{
        type: 'warning'
      }).then(()=>{
        productApi.del(row.id).then(res=>{
          this.list.splice($index,1)
          this.dataTotal--
          this.$message.success('删除成功')
          this.$emit('del')         
        })
      })
    }     
  }
}
</script>