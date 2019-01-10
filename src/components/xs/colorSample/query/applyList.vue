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
        <el-form-item label='打样编号' prop='apply_no'>
          <el-input v-model.trim='queryParams.apply_no' clearable></el-input>
        </el-form-item>
        <el-form-item label='项目名称' prop='project_name'>
          <el-input v-model.trim='queryParams.project_name' clearable></el-input>
        </el-form-item>
        <!-- 更多条件 -->
        <template v-if='queryShowMore'>
          <el-form-item label='申请状态' prop='status'>
            <el-select v-model='queryParams.status' multiple collapse-tags>
              <el-option value='APPLY' label='已申请待归档'></el-option>
              <el-option value='FILE' label='已归档待打板'></el-option>
              <el-option value='MAKING' label='打板中'></el-option>
              <el-option value='MAKE' label='已打板待寄出'></el-option>
              <el-option value='DELIVERY' label='已寄出待确认'></el-option>
              <el-option value='CONFIRM_Y' label='通过客户确认'></el-option>
              <el-option value='CONFIRM_N' label='未通过确认'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label='色样编号' prop='sample_no'>
            <el-input v-model.trim='queryParams.sample_no' clearable></el-input>
          </el-form-item>
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
          <el-form-item label='寄出快递' prop='express' >
            <el-input v-model.trim='queryParams.express' clearable></el-input>
          </el-form-item>
          <el-form-item label='收件人' prop='receiver'>
            <el-input v-model.trim='queryParams.receiver' placeholder='寄回收件人' clearable></el-input>
          </el-form-item>
          <el-form-item label='联系手机' prop='receive_tel'>
            <el-input v-model.trim='queryParams.receive_tel' placeholder='寄回收件人联系手机' clearable></el-input>
          </el-form-item>
          <el-form-item label='寄回地址' prop='receive_address' >
            <el-input v-model.trim='queryParams.receive_address' clearable></el-input>
          </el-form-item>
          <el-form-item v-if='!hideFileField' label='归档编号' prop='file_no' >
            <el-input v-model.trim='queryParams.file_no' clearable></el-input>
          </el-form-item>
          <el-form-item v-if='!hideFileField' label='归档日期'>
            <el-row style='width:300px'>
              <el-col :span="11">
                <el-form-item prop='file_date_begin'>
                  <el-date-picker v-model='queryParams.file_date_begin' placeholder='开始日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="2">至</el-col>
              <el-col :span="11">
                <el-form-item prop='file_date_end'>
                  <el-date-picker v-model='queryParams.file_date_end' placeholder='结束日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item v-if='!hideFileField' label='归档说明' prop='file_remarks' >
            <el-input v-model.trim='queryParams.file_remarks' clearable></el-input>
          </el-form-item>
          <el-form-item v-if='!hideMakeField' label='打板厂家' prop='make_supplier' >
            <el-input v-model.trim='queryParams.make_supplier' clearable></el-input>
          </el-form-item>
          <el-form-item v-if='!hideMakeField' label='完成日期'>
            <el-row style='width:300px'>
              <el-col :span="11">
                <el-form-item prop='make_finish_date_begin'>
                  <el-date-picker v-model='queryParams.make_finish_date_begin' placeholder='开始日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="2">至</el-col>
              <el-col :span="11">
                <el-form-item prop='make_finish_date_end'>
                  <el-date-picker v-model='queryParams.make_finish_date_end' placeholder='结束日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item v-if='!hideMakeField' label='单板说明' prop='make_remarks'>
            <el-input v-model.trim='queryParams.make_remarks' clearable></el-input>
          </el-form-item>
          <el-form-item v-if='!hideDeliveryField' label='色样快递' prop='delivery_express'>
            <el-input v-model.trim='queryParams.delivery_express' placeholder='色样寄出快递信息' clearable></el-input>
          </el-form-item>
          <el-form-item v-if='!hideDeliveryField' label='寄出日期'>
            <el-row style='width:300px'>
              <el-col :span="11">
                <el-form-item prop='delivery_date_begin'>
                  <el-date-picker v-model='queryParams.delivery_date_begin' placeholder='开始日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="2">至</el-col>
              <el-col :span="11">
                <el-form-item prop='delivery_date_end'>
                  <el-date-picker v-model='queryParams.delivery_date_end' placeholder='结束日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item v-if='!hideDeliveryField' label='寄出说明' prop='delivery_remarks'>
            <el-input v-model.trim='queryParams.delivery_remarks' clearable></el-input>
          </el-form-item>
          <el-form-item v-if='!hideConfirmField' label='确认结果' prop='confirm_is_pass'>
            <el-select v-model='queryParams.confirm_is_pass' clearable>
              <el-option value='1' label='已通过'></el-option>
              <el-option value='0' label='未通过'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if='!hideConfirmField' label='确认说明' prop='confirm_remarks'>
            <el-input v-model.trim='queryParams.confirm_remarks' clearable></el-input>
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
      <el-table-column prop='no' fixed label='打样申请编号' width='110'>
        <template slot-scope='{row}'>
          <span class='c-link' @click='openApplyInfo(row)'>{{row.no}}</span>
        </template>
      </el-table-column>
      <el-table-column prop='status' fixed label='申请状态' width='110' align='center'>
        <template slot-scope='{row}'>
          <status-tag :status='row.status'></status-tag>
        </template>
      </el-table-column>
      <el-table-column v-if='!hideSampleField' prop='sample_no' label='色样编号' width='110' show-overflow-tooltip>
        <template slot-scope='{row}'>
          <span class='c-link' @click='openSampleInfo(row)'>{{ row.sample_no }}</span>
        </template>
      </el-table-column>     
      <el-table-column v-if='!hideSampleField' prop='project_name' label='项目名称' width='110' show-overflow-tooltip />
      <el-table-column v-if='!hideSampleField' prop='customer_name' label='客户名称' width='110' show-overflow-tooltip />
      <el-table-column v-if='!hideSampleField' prop='company_name' label='销售公司' width='110' show-overflow-tooltip />
      <el-table-column v-if='!hideSampleField' prop='salesman' label='业务员' width='110' show-overflow-tooltip />
      <el-table-column v-if='!hideSampleField' prop='factory_name' label='打样工厂' width='90' show-overflow-tooltip />
      <el-table-column prop='amount' label='申请数量' sortable='custom' width='100' align='right' />
      <el-table-column prop='express' label='寄出快递' width='110' show-overflow-tooltip />
      <el-table-column prop='remarks' label='申请备注' width='110' show-overflow-tooltip />
      <el-table-column prop='receiver' label='寄回收件人' width='110' show-overflow-tooltip />
      <el-table-column prop='receive_tel' label='寄回联系手机' width='110' show-overflow-tooltip />
      <el-table-column prop='receive_address' label='寄回地址' width='110' show-overflow-tooltip />      
      <el-table-column prop='submit_user_name' label='申请人' />
      <el-table-column prop='submit_time' label='申请时间' sortable='custom' width='120'>
        <template slot-scope='{row}'>
          {{ $commonJs.formatDate(row.submit_time) }}
        </template>
      </el-table-column>
      <el-table-column v-if='!hideFileField' prop='file_no' label='归档编号' width='110' show-overflow-tooltip />   
      <el-table-column v-if='!hideFileField' prop='file_date' label='归档日期' sortable='custom' width='110' show-overflow-tooltip />   
      <el-table-column v-if='!hideFileField' prop='file_remarks' label='归档说明' width='110' show-overflow-tooltip />       
      <el-table-column v-if='!hideFileField' prop='file_user_name' label='归档人' />
      <el-table-column v-if='!hideFileField' prop='file_time' label='归档时间' sortable='custom' width='120'>
        <template slot-scope='{row}'>
          {{ $commonJs.formatDate(row.file_time) }}
        </template>
      </el-table-column>
      <el-table-column v-if='!hideMakeField' prop='make_supplier' label='打板厂家' width='110' show-overflow-tooltip />  
      <el-table-column v-if='!hideMakeField' prop='make_finish_date' label='完成日期' sortable='custom' width='110' show-overflow-tooltip>
        <template slot-scope='{row}'>
          {{row.make_finish_date}}{{row.make_is_finish===0?"（预计）":""}}
        </template>
      </el-table-column>  
      <el-table-column v-if='!hideMakeField' prop='make_remarks' label='单板说明' width='110' show-overflow-tooltip />  
      <el-table-column v-if='!hideMakeField' prop='make_user_name' label='打板人' />
      <el-table-column v-if='!hideMakeField' prop='make_time' label='打板时间' sortable='custom' width='120'>
        <template slot-scope='{row}'>
          {{ $commonJs.formatDate(row.make_time) }}
        </template>
      </el-table-column>
      <el-table-column v-if='!hideDeliveryField' prop='delivery_express' label='寄出快递信息' width='110' show-overflow-tooltip />  
      <el-table-column v-if='!hideDeliveryField' prop='delivery_date' label='寄出日期' sortable='custom' width='110' show-overflow-tooltip />  
      <el-table-column v-if='!hideDeliveryField' prop='delivery_remarks' label='寄出说明' width='110' show-overflow-tooltip />  
      <el-table-column v-if='!hideDeliveryField' prop='delivery_user_name' label='寄出人' />
      <el-table-column v-if='!hideDeliveryField' prop='delivery_time' label='寄出时间' sortable='custom' width='120'>
        <template slot-scope='{row}'>
          {{ $commonJs.formatDate(row.delivery_time) }}
        </template>
      </el-table-column>
      <el-table-column v-if='!hideConfirmField' prop='confirm_is_pass' label='确认结果' width='80' align='center'>
        <template slot-scope='{row}'>
          <el-tag type='success' v-if='row.confirm_is_pass==1'>通过</el-tag>
          <el-tag type='danger' v-else-if='row.confirm_is_pass==0'>未通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if='!hideConfirmField' prop='confirm_remarks' label='确认说明' width='110' show-overflow-tooltip />
      <el-table-column v-if='!hideConfirmField' prop='confirm_user_name' label='确认人' />
      <el-table-column v-if='!hideConfirmField' prop='confirm_time' label='确认时间' sortable='custom' width='120'>
        <template slot-scope='{row}'>
          {{ $commonJs.formatDate(row.confirm_time) }}
        </template>
      </el-table-column>
      <el-table-column prop='progress_update_time' label='更新时间' sortable='custom' width='120'>
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
    <apply-info :hide-sample-field='hideSampleField' :in-dialog='inDialog' ref='applyInfo'></apply-info>
    <sample-info v-if='!hideSampleField' :in-dialog='inDialog' ref='sampleInfo'></sample-info>
  </div>
</template>
<script>
import applyApi from '@/api/xs/colorSampleApply'
import statusTag from '../statusTag'
import applyInfo from '../apply/info'
import sampleInfo from '../edit/info'

export default {
  components:{ statusTag, applyInfo, sampleInfo },
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
    },
    noPage:{
      type:Boolean,
      default:false
    },
    hideSampleField:{
      type:Boolean,
      default:false
    },
    hideFileField:{
      type:Boolean,
      default:false
    },
    hideMakeField:{
      type:Boolean,
      default:false
    },
    hideDeliveryField:{
      type:Boolean,
      default:false
    },
    hideConfirmField:{
      type:Boolean,
      default:false
    },    
    sortProp:{
      default:'progress_update_time'
    },
    sortOrder:{
      default:''
    }
  },
  data(){
    return {
      inited:false,
      loading: false,      
      list:[],
      dataTotal:0,    
      queryShowMore:false,
      initParams:{},
      //查询条件字段
      queryParams:{
        sample_no:'',
        project_name:'',
        status:[],
        fixed_status:[],
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
        material:''
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
    initData(params){
      this.initParams = params
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
      this.requestParams.currentPage=1
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
      applyApi.getProgressList(this.requestParams).then(res=>{
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
      this.queryParams = {...this.queryParams,...this.params,...this.initParams}
      this.requestParams.currentPage=1
      this.query()
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
      applyApi.exportExcel(this.requestParams)
    },
    openApplyInfo(row){
      this.$refs.applyInfo.open().then(that=>{
        that.get(row.id)
      })
    },
    openSampleInfo(row){
      this.$refs.sampleInfo.open().then(that=>{
        that.get(row.sample_id)
      })
    }
  }
}
</script>