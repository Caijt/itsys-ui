<!-- 
此组件初始化时不会自动加载数据，请在mounted中 this.$refs.[].initData() 初始化数据
如果放在dialog里面的吗，请在dialog的open事件中用this.$nextTick进行初始化数据
 -->
<template>
  <div>
    <!-- 查询条件 -->
    <div style='margin-bottom:3px'>
      <div style='float:right;margin-top:3px'>
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
        <el-form-item label='订单编号' prop='order_no'>
          <el-input v-model.trim='queryParams.order_no' clearable></el-input>
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
          <el-form-item label='生产完成' prop='sc_self_is_finish'>
            <el-select v-model='queryParams.sc_self_is_finish' clearable style='width:160px'>
              <el-option label='是' :value='1'></el-option>
              <el-option label='否' :value='0'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label='生产状态' prop='sc_self_product_status'>
            <el-autocomplete v-model='queryParams.sc_self_product_status' clearable :fetch-suggestions="getOrderFieldList('sc_self_product_status')"></el-autocomplete>
          </el-form-item>
          <el-form-item label='订单类别' prop='order_type'>
            <el-autocomplete v-model='queryParams.order_type' clearable :fetch-suggestions="getOrderFieldList('order_type')"></el-autocomplete>
          </el-form-item>
          <el-form-item label='批次' prop='batch'>
            <el-autocomplete v-model='queryParams.batch' clearable :fetch-suggestions="getOrderFieldList('batch')"></el-autocomplete>
          </el-form-item>
          <el-form-item label='项目编号' prop='project_no'>
            <el-input v-model='queryParams.project_no' clearable></el-input>
          </el-form-item>
          <el-form-item label='合同编号' prop='contract_no'>
            <el-input v-model='queryParams.contract_no' clearable></el-input>
          </el-form-item>
          <el-form-item label='客户名称' prop='customer_name'>
            <el-autocomplete v-model='queryParams.customer_name' clearable :fetch-suggestions="getProjectFieldList('customer_name')"></el-autocomplete>
          </el-form-item>
          <el-form-item label='业绩公司' prop='company_name'>
            <el-autocomplete v-model='queryParams.company_name' clearable :fetch-suggestions="getProjectFieldList('company_name')"></el-autocomplete>
          </el-form-item>
          <el-form-item label='业务员' prop='salesman'>
            <el-autocomplete v-model='queryParams.salesman' clearable :fetch-suggestions="getProjectFieldList('salesman')"></el-autocomplete>
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
      <el-table-column prop='order_no' fixed label='订单编号' width='100' show-overflow-tooltip>
        <template slot-scope='{ row }'>
          <span class='c-link' @click='openOrderInfo(row.order_id)'>{{ row.order_no }}</span>
        </template>
      </el-table-column>
      <el-table-column 
        prop='project_name' label='项目名称' width='110' show-overflow-tooltip />
      <el-table-column prop='sc_self_is_finish' label='生产完成' width='90' align='center'>
        <template slot-scope='{row}'>
          <el-tag size='mini' v-if='row.sc_self_is_finish==1' type='success'>已完成</el-tag>
          <el-tag size='mini' v-else-if='row.self_product_record_total==0' type='info'>未生产</el-tag>
          <el-tag size='mini' v-else >生产中</el-tag>          
        </template>
      </el-table-column>
      <el-table-column 
        prop='sc_self_product_status' label='生产状态' width='110' show-overflow-tooltip />
      <el-table-column prop='order_type' label='订单类别' show-overflow-tooltip />
      <el-table-column prop='install_method' label='安装方式' width='80' show-overflow-tooltip></el-table-column>
      <el-table-column prop='series' label='系列' show-overflow-tooltip></el-table-column>
      <el-table-column prop='model' label='窗型' show-overflow-tooltip></el-table-column>
      <el-table-column prop='window_style' label='闭窗器样式' width='100' show-overflow-tooltip></el-table-column>
      <el-table-column prop='color' label='型材颜色' show-overflow-tooltip></el-table-column>
      <el-table-column prop='fire_time' label='防火时间' sortable='custom' align='right' width='100'>
        <template slot-scope={row}>
          {{ row.fire_time }} 小时
        </template>
      </el-table-column>
      <el-table-column prop='order_batch' label='订单批次' show-overflow-tooltip />
      <el-table-column prop='order_area' label='订单面积' sortable='custom' align='right' width='110'>
        <template slot-scope='scope'>
          <span>{{ scope.row.order_area }}㎡</span>
        </template>
      </el-table-column>
      <el-table-column prop='order_amount' label='订单数量' sortable='custom' align='right' width='110'>
      </el-table-column>
      <el-table-column prop='self_area' label='计划生产面积' sortable='custom' align='right' width='120'>
        <template slot-scope='{ row }'>
          <span>{{ row.self_area }}㎡</span>
        </template>
      </el-table-column>
      <el-table-column prop='self_amount' label='计划生产数量' sortable='custom' align='right' width='120'>
        <template slot-scope='{ row }'>
          <span>{{ row.self_amount }}</span>
        </template>
      </el-table-column>
      <el-table-column prop='sc_self_finish_area_total' sortable='custom' label='已生产面积' width='110' align='right'>
        <template slot-scope='{row}'>
          {{ row.sc_self_finish_area_total }}㎡
        </template>
      </el-table-column>
      <el-table-column prop='self_product_record_total' label='生产记录' align='center' sortable='custom' width='100' >
        <template slot-scope='{row}'>
          <span class='c-link' @click='$refs.productList.open({order_id:row.order_id,isDel:null})'>{{ row.self_product_record_total }}</span>
        </template>
      </el-table-column>
      <el-table-column prop='self_first_product_date' label='生产日期' sortable='custom' width='110'></el-table-column>
      <el-table-column prop='no_product_area' sortable='custom' label='未生产面积' width='110' align='right'>
        <template slot-scope='{row}'>
          {{ row.no_product_area }}㎡
        </template>
      </el-table-column>
      <el-table-column label='生产进度' min-width='120' align='center'>
        <template slot-scope='{row}'>
          <el-progress 
            text-inside :stroke-width='16' 
            :status='$commonJs.getProgressPercentage(row.sc_self_finish_area_total/row.self_area)>=100?"success":""' 
            :percentage="$commonJs.getProgressPercentage(row.sc_self_finish_area_total/row.self_area)"/>
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
    <product-list :in-dialog='inDialog' ref='productList'></product-list>
    <project-details :in-dialog='inDialog' ref='projectDetails' />
    <order-info :in-dialog='inDialog' ref='orderInfo' />
  </div>
</template>
<script>
import productApi from '@/api/sc/product'
import orderApi from '@/api/yyzx/order'
import projectApi from '@/api/yyzx/project'
import productList from '@/components/sc/product/listDialog'
import projectDetails from '@/components/projectDetails'
import orderInfo from '@/components/yyzx/order/info'

export default {
  components:{ projectDetails, orderInfo, productList  },
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
    init:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return {
      loading: true,      
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
        sc_self_is_finish:'',
        sc_self_product_status:'',
        toProduct:0,
        isDel:0
      },
      //数据请求的参数
      requestParams:{
        pageSize:10,//分页大小
        currentPage:1,//当前页
        sortProp:'',
        sortOrder:''
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
      productApi.exportSummaryExcel(this.requestParams)
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
    }
  }
}
</script>