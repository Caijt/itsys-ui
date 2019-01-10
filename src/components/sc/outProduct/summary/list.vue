<!-- 
此组件初始化时不会自动加载数据，请在mounted中 this.$refs.[].initData() 初始化数据
如果放在dialog里面的吗，请在dialog的open事件中用this.$nextTick进行初始化数据
 -->
<template>
  <div>
    <!-- 查询条件 -->
    <div style='margin-bottom: 2px' v-show='!hideQuery'>
      <div style='float:right;margin-top: 1px' >
        <span><el-button type='primary' @click='query' size='mini'>查询</el-button></span>
        <span><el-button @click='resetQuery' size='mini'>重置</el-button ></span>
        <span><el-button @click='queryShowMore=!queryShowMore' size='mini' icon="">
          {{queryShowMore?"收起":"更多"}}
          <i :class="{'el-icon-arrow-up':queryShowMore,'el-icon-arrow-down':!queryShowMore}"></i>
        </el-button></span>
      </div>
      <el-form ref='formQuery' :model='queryParams' label-width='68px' 
        class='c-form-condensed' inline size='mini'>
        <el-form-item label='订单编号' prop='order_no'>
          <el-input v-model='queryParams.order_no' clearable></el-input>
        </el-form-item>
        <el-form-item label='项目名称' prop='project_name'>
          <el-input v-model='queryParams.project_name' clearable></el-input>
        </el-form-item>
        <el-form-item prop='toProduct'>
          <el-tooltip content='待生产的订单（未生产面积大于0）'>
            <el-checkbox 
              v-model="queryParams.toProduct" 
              label="待生产" 
              border
              :true-label='1'
              :false-label='0'
              @change='query({key:"toProduct"})'
              >
            </el-checkbox>
          </el-tooltip>
        </el-form-item>
        <!-- 更多条件 -->
        <template v-if='queryShowMore'>
          <el-form-item label='生产工厂' prop='factory_name'>
            <el-input v-model='queryParams.factory_name' clearable></el-input>
          </el-form-item>
          <el-form-item label='订单类别' prop='order_type'>
            <el-input v-model='queryParams.order_type' clearable></el-input>
          </el-form-item>
          <el-form-item label='批次' prop='batch'>
            <el-input v-model='queryParams.batch' clearable></el-input>
          </el-form-item>
          <el-form-item label='项目编号' prop='project_no'>
            <el-input v-model='queryParams.project_no' clearable></el-input>
          </el-form-item>
          <el-form-item label='合同编号' prop='contract_no'>
            <el-input v-model='queryParams.contract_no' clearable></el-input>
          </el-form-item>
          <el-form-item label='客户名称' prop='customer_name'>
            <el-input v-model='queryParams.customer_name' clearable></el-input>
          </el-form-item>
          <el-form-item label='业绩公司' prop='company_name'>
            <el-input v-model='queryParams.company_name' clearable></el-input>
          </el-form-item>
          <el-form-item label='业务员' prop='salesman'>
            <el-input v-model='queryParams.salesman' clearable></el-input>
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
      @sort-change='sortChange'>
      <el-table-column prop='order_no' fixed label='订单编号' width='130'>
        <template slot-scope='{ row }'>
          <span class='c-link' @click='openOrderInfo(row.order_id)'>{{ row.order_no }}</span>
        </template>
      </el-table-column>
      <el-table-column 
        prop='project_name' label='项目名称' width='110' show-overflow-tooltip />
      <el-table-column prop='sc_out_is_finish' label='状态' width='80' align='center'>
        <template slot-scope='{row}'>
          <el-tag size='mini' v-if='row.sc_out_is_finish==1' type='success'>已完成</el-tag>
           <el-tag v-else-if='row.out_product_record_total==0' type='info' size='mini'>未生产</el-tag>
          <el-tag size='mini' v-else >生产中</el-tag>          
        </template>
      </el-table-column>
      <el-table-column 
        prop='sc_out_product_status' label='生产状态' width='110' show-overflow-tooltip />
      <el-table-column 
        prop='sc_out_product_unit' label='生产单位' width='110' show-overflow-tooltip />
      <el-table-column prop='area_name' label='生产工厂' sortable='custom' show-overflow-tooltip width='110'>
      </el-table-column>
      <el-table-column prop='order_type' label='订单类别' show-overflow-tooltip />
      <el-table-column prop='series' label='系列' show-overflow-tooltip></el-table-column>
      <el-table-column prop='model' label='窗型' show-overflow-tooltip></el-table-column>
      <el-table-column prop='window_style' label='闭窗器样式' width='100' show-overflow-tooltip></el-table-column>
      <el-table-column prop='color' label='型材颜色' show-overflow-tooltip></el-table-column>
      <el-table-column prop='order_batch' label='订单批次' show-overflow-tooltip />
      <el-table-column prop='order_area' label='订单面积' sortable='custom' align='right' width='110'>
        <template slot-scope='scope'>
          <span>{{ scope.row.order_area }}㎡</span>
        </template>
      </el-table-column>
      <el-table-column prop='order_amount' label='订单数量' sortable='custom' align='right' width='110'>
      </el-table-column>
      <el-table-column prop='out_area' label='外协计划面积' sortable='custom' align='right' width='120'>
        <template slot-scope='{ row }'>
          <span>{{ row.out_area }}㎡</span>
        </template>
      </el-table-column>
      <el-table-column prop='out_amount' label='外协计划数量' sortable='custom' align='right' width='120'>
        <template slot-scope='{ row }'>
          <span>{{ row.out_amount }}</span>
        </template>
      </el-table-column>
      <el-table-column prop='out_finish_area_total' label='已生产面积' sortable='custom' width='110' align='right'>
        <template slot-scope='{row}'>
          {{ row.out_finish_area_total }}㎡
        </template>
      </el-table-column>
      <el-table-column prop='out_product_record_total' label='生产日志' align='center' sortable='custom' width='100' >
        <template slot-scope='{row}'>
          <span class='c-link' @click='$refs.outProductList.open({order_id:row.order_id})'>{{ row.out_product_record_total }}</span>
        </template>
      </el-table-column>
      <el-table-column prop='out_first_product_date' label='生产日期' sortable='custom' width='110'></el-table-column>
      <el-table-column prop='no_product_area' label='未生产面积' sortable='custom' width='110' align='right'>
        <template slot-scope='{row}'>
          {{ row.no_product_area }}㎡
        </template>
      </el-table-column>
      <el-table-column label='生产进度' min-width='120' align='center'>
        <template slot-scope='{row}'>
          <el-progress 
            text-inside :stroke-width='16' 
            :status='$commonJs.getProgressPercentage(row.out_finish_area_total/row.out_area)>=100?"success":""' 
            :percentage="$commonJs.getProgressPercentage(row.out_finish_area_total/row.out_area)"/>
        </template>
      </el-table-column>
      <el-table-column prop='order_date' label='下单日期' sortable='custom' width='110'></el-table-column>
      <el-table-column prop='order_delivery_date' label='交货日期' sortable='custom' width='110'></el-table-column>
      <el-table-column prop='project_no' label='项目编号' width='100'>
        <template slot-scope='scope'>
          <span @click='openProjectDetails(scope.row.project_id)' class='c-link'>{{ scope.row.project_no }}</span>          
        </template>
      </el-table-column>
      
      <el-table-column 
        prop='contract_no' label='合同编号' width='110' show-overflow-tooltip />
      <el-table-column 
        prop='customer_name' label='客户名称' width='110' show-overflow-tooltip />
     
      <el-table-column prop='order_create_time' label='订单创建时间' sortable='custom' width='140'>
        <template slot-scope='{row}'>
          {{ $commonJs.formatDate(row.order_create_time) }}
        </template>
      </el-table-column>
      <!-- slot[column] -->
      <slot name='column'></slot>
      <!--/ slot[column]-->
    </el-table>
    <!-- 数据表格 -->
    <!-- 分页 -->
    <el-pagination style='margin-top: 10px'
      v-if='!noPage'
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
    <out-product-list :in-dialog='inDialog' ref='outProductList'></out-product-list>
    <project-details :in-dialog='inDialog' ref='projectDetails' />
    <order-info :in-dialog='inDialog' ref='orderInfo' />
  </div>
</template>
<script>

import productApi from '@/api/sc/outProduct'
import outProductList from '@/components/sc/outProduct/listDialog'
import projectDetails from '@/components/projectDetails'
import orderInfo from '@/components/yyzx/order/info'

export default {
  components:{ projectDetails, orderInfo, outProductList  },
  props:{
    size:{
      type:String,
      default:''
    },
    hideQuery:{
      type:Boolean,
      default:false
    },
    noPage:{
      type:Boolean,
      default:false
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
    init:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return {
      inited:false,
      loading: false,      
      list:[],
      dataTotal:0,    
      queryShowMore:false,
      //查询条件字段
      queryParams:{
        order_no:'',//订单编号
        project_name:'',//项目名称
        customer_name:'',//客户单位
        project_no:'',//项目编号
        contract_no:'',//合同编号
        company_name:'',//业绩公司
        salesman:'',//业务员
        order_type:'',//订单类型
        batch:'',//订单批次
        product_status:'',//生产状态
        isDel:0,
        inFactory:1
      },
      //数据请求的参数
      requestParams:{
        pageSize:10,//分页大小
        currentPage:1,//当前页
        sortProp:'',
        sortOrder:'',
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
    initData(){
      this.inited = true
      this.resetQuery()
    },
    reload(){
      this.getData()
    },
    //分页容量大小发生变化时
    sizeChange(value){
      this.requestParams.pageSize=value
      this.getData()
    },
    //获取数据
    getData() {
      this.loading=true
      productApi.getSummaryListByOrder(this.requestParams).then(res=>{
        this.list = res.data.list
        this.dataTotal = res.data.total
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
    }
  }
}
</script>