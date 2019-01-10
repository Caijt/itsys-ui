<!-- 
此组件初始化时不会自动加载数据，请在mounted中 this.$refs.[].initData() 初始化数据
如果放在dialog里面的吗，请在dialog的open事件中用this.$nextTick进行初始化数据
 -->
<template>
  <div>
    <!-- 查询条件 -->
    <div style='margin-bottom:3px' v-show='!hideQuery'>
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
        <el-form-item label='打样编号' prop='no'>
          <el-input v-model.trim='queryParams.no' clearable></el-input>
        </el-form-item>
        <el-form-item label='项目名称' prop='project_name'>
          <el-input v-model='queryParams.project_name' clearable></el-input>
        </el-form-item>
        <!-- 更多条件 -->
        <template v-if='queryShowMore'>
          <el-form-item label='客户名称' prop='customer_name'>
            <el-input v-model.trim='queryParams.customer_name' clearable></el-input>
          </el-form-item>
          <el-form-item label='销售公司' prop='company_name'>
            <el-input v-model.trim='queryParams.company_name' clearable></el-input>
          </el-form-item>
          <el-form-item label='状态' prop='status'>
            <el-select
              v-model="queryParams.status"
              multiple
              collapse-tags
              placeholder="请选择">
              <el-option label="已申请，待归档" value="SUBMIT"></el-option>
              <el-option label="已归档，待打板" value="FILE"></el-option>
              <el-option label="已打板，待寄出" value="MAKE"></el-option>
              <el-option label="已寄出，待确认" value="DELIVERY"></el-option>
              <el-option label="客户已确认" value="FINISH"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label='色板色号' prop='color_no'>
            <el-input v-model.trim='queryParams.color_no' clearable></el-input>
          </el-form-item>
          <el-form-item label='系列' prop='series'>
            <el-input v-model.trim='queryParams.series' clearable></el-input>
          </el-form-item>
          <el-form-item label='表面处理' prop='surface'>
            <el-input v-model.trim='queryParams.surface' clearable></el-input>
          </el-form-item>
          <el-form-item label='温控' prop='temperature'>
            <el-input v-model.trim='queryParams.temperature' clearable></el-input>
          </el-form-item>
          <el-form-item label='型材颜色' prop='xc_color'>
            <el-input v-model.trim='queryParams.xc_color' clearable></el-input>
          </el-form-item>
          <el-form-item label='五金颜色' prop='wj_color'>
            <el-input v-model.trim='queryParams.wj_color' clearable></el-input>
          </el-form-item>
          <el-form-item label='型材品牌' prop='xc_brand'>
            <el-input v-model.trim='queryParams.xc_brand' clearable></el-input>
          </el-form-item>
          <el-form-item label='五金品牌' prop='wj_brand'>
            <el-input v-model.trim='queryParams.wj_brand' clearable></el-input>
          </el-form-item>
          <el-form-item label='玻璃胶颜色' prop='glass_color' label-width='90px'>
            <el-input v-model.trim='queryParams.glass_color' clearable></el-input>
          </el-form-item>
          <el-form-item label='材料' prop='material' >
            <el-input v-model.trim='queryParams.material' clearable></el-input>
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
      <el-table-column prop='no' label='打样编号' width='110'>
        <template slot-scope='{row}'>
          <span>{{row.no}}</span>
        </template>
      </el-table-column>
      <el-table-column prop='status' label='状态' width='110' show-overflow-tooltip>
        <template slot-scope='{row}'>
          {{ getStatusText(row.status) }}
        </template>
      </el-table-column>
      <el-table-column prop='is_confirm' label='确认结果' align='center' width='80'>
        <template slot-scope='{row}'>
          <el-tag type='success' size='mini' v-show='row.is_confirm==1'>通过</el-tag>
          <el-tag type='danger' size='mini' v-show='row.is_confirm==0'>未通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop='times' label='打样次数' width='100' align='center' sortable='custom'>
        <template slot-scope='{row}'>
          <span class='c-link' @click='$refs.progressListDialog.open({no:row.no})'>{{ row.times }}</span>
        </template>
      </el-table-column>
      <el-table-column prop='project_name' label='项目名称' width='110' show-overflow-tooltip />
      <el-table-column prop='customer_name' label='客户名称' width='110' show-overflow-tooltip />
      <el-table-column prop='company_name' label='销售公司' width='110' show-overflow-tooltip />
      <el-table-column prop='color_no' label='色板色号' show-overflow-tooltip />
      <el-table-column prop='amount' label='色板数量' width='100' align='right' sortable='custom'/>
      <el-table-column 
        prop='series' label='系列' width='110' show-overflow-tooltip />
      <el-table-column prop='surface' label='表面处理' show-overflow-tooltip />
      <el-table-column prop='temperature' label='温控' show-overflow-tooltip />
      <el-table-column prop='xc_color' label='型材颜色' show-overflow-tooltip />
      <el-table-column prop='wj_color' label='五金颜色' show-overflow-tooltip />
      <el-table-column prop='xc_brand' label='型材品牌' show-overflow-tooltip />
      <el-table-column prop='wj_brand' label='五金品牌' show-overflow-tooltip />
      <el-table-column prop='glass_color' label='玻璃胶颜色' width='100' show-overflow-tooltip />
      <el-table-column prop='material' label='材料' show-overflow-tooltip />
      <el-table-column prop='remarks' label='其它要求' show-overflow-tooltip />
      <el-table-column prop='progress_update_time' label='进度更新时间' width='120' sortable='custom'>
         <template slot-scope='{row}'>
          {{ $commonJs.formatDate(row.progress_update_time) }}
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
    <progress-list-dialog :in-dialog='inDialog' ref='progressListDialog'/>
    <project-details :in-dialog='inDialog' ref='projectDetails' />
    <order-info :in-dialog='inDialog' ref='orderInfo' />
  </div>
</template>
<script>
import colorSampleApi from '@/api/xs/colorSample'
import orderApi from '@/api/yyzx/order'
import projectApi from '@/api/yyzx/project'
import progressListDialog from '@/components/xs/colorSample/progressListDialog'
import projectDetails from '@/components/projectDetails'
import orderInfo from '@/components/yyzx/order/info'


export default {
  components:{ projectDetails, orderInfo, progressListDialog  },
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
    hideQuery:{
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
      loading: false,      
      list:[],
      dataTotal:0,    
      queryShowMore:false,
      //查询条件字段
      queryParams:{
        no:'',
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
        inCompany:1
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
      colorSampleApi.getProgressSummaryList(this.requestParams).then(res=>{
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
      colorSampleApi.exportSummaryExcel(this.requestParams)
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
    getStatusText(status){
      return colorSampleApi.getStatusText(status)
    }
  }
}
</script>