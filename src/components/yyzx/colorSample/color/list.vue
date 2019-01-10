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
        <el-form-item label='色样编号' prop='sample_no'>
          <el-input v-model.trim='queryParams.sample_no' clearable></el-input>
        </el-form-item>
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
          <el-form-item label='打样工厂' prop='factory_name'>
            <el-input v-model.trim='queryParams.factory_name' clearable></el-input>
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
          <el-form-item label='玻璃胶色' prop='glass_color'>
            <el-input v-model.trim='queryParams.glass_color' clearable></el-input>
          </el-form-item>
          <el-form-item label='材料' prop='material' >
            <el-input v-model.trim='queryParams.material' clearable></el-input>
          </el-form-item>
          <el-form-item label='其它要求' prop='remarks' >
            <el-input v-model.trim='queryParams.remarks' clearable></el-input>
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
      <el-table-column prop='color_no' fixed label='色板色号' width='110' show-overflow-tooltip />
      <el-table-column prop='no' label='色样编号' width='110'>
        <template slot-scope='{row}'>
          <span class='c-link' @click='openSampleInfo(row)'>{{row.no}}</span>
        </template>
      </el-table-column>
      <el-table-column prop='project_name' label='项目名称' width='110' show-overflow-tooltip />      
      <el-table-column prop='customer_name' label='客户名称' width='110' show-overflow-tooltip />
      <el-table-column prop='company_name' label='销售公司' width='110' show-overflow-tooltip />
      <el-table-column prop='salesman' label='业务员' width='110' show-overflow-tooltip />
      <el-table-column prop='factory_name' label='打样工厂' width='90' show-overflow-tooltip /> 
      <el-table-column prop='apply_total' label='打样次数' width='80' align='center'>
        <template slot-scope='{row}'>
          <span class='c-link' @click='openApplyListDialog(row)'>{{row.apply_total}}</span>
        </template>
      </el-table-column>
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
      <el-table-column prop='submit_user_name' label='提交人' />
      <el-table-column prop='submit_time' label='提交时间' sortable='custom' width='120'>
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
    <apply-list-dialog ref='applyListDialog'></apply-list-dialog>
    <sample-info ref='sampleInfo' />
  </div>
</template>
<script>
import colorSampleApi from '@/api/xs/colorSample'
import applyListDialog from '@/components/xs/colorSample/query/applyListDialog'
import sampleInfo from '@/components/xs/colorSample/edit/info'

export default {
  components:{ applyListDialog, sampleInfo },
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
      inited:false,
      loading: false,      
      list:[],
      dataTotal:0,    
      queryShowMore:false,
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
        status:['CONFIRM_Y']
      },
      //数据请求的参数
      requestParams:{
        pageSize:10,//分页大小
        currentPage:1,//当前页
        sortProp:'submit_time',
        sortOrder:'descending'
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
      colorSampleApi.getList(this.requestParams).then(res=>{
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
      colorSampleApi.exportExcel(this.requestParams)
    },
    getOrderFieldList(field){
      return (keyword,callback)=>{
        orderApi.getFieldList({ field,keyword }).then(res=>{
          callback(res.data)
        })
      }
    },
    openSampleInfo(row){
      this.$refs.sampleInfo.open().then(that=>{
        that.get(row.id)
      })
    },
    openApplyListDialog(row){
      this.$refs.applyListDialog.open({ sample_id:row.id })
    },
    undo({ row,$index }){
      if(row.apply_total>0){
        this.$message.error('该色样已进行过打样申请，无法撤回！')
        return false
      }
      let confirmText = '确定撤回此色样信息吗？撤回后将在编辑列表中'
      this.$confirm(confirmText,'提示',{
        type: 'warning'
      }).then(()=>{
        colorSampleApi.undo(row.id).then(res=>{
          this.list.splice($index,1)
          this.dataTotal--
          this.$message.success('撤回成功')
          this.$emit('undo')         
        })
      })
    }  
  }
}
</script>