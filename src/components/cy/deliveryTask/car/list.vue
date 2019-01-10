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
        <el-form-item label='车辆编号' prop='car_no'>
          <el-input v-model.trim='queryParams.car_no' clearable></el-input>
        </el-form-item>
        <el-form-item v-if='!hideTaskField' label='项目名称' prop='project_name'>
          <el-input v-model.trim='queryParams.project_name' clearable></el-input>
        </el-form-item>
        <!-- 更多条件 -->
        <template v-if='queryShowMore'>
          <el-form-item label='车辆状态' prop='status'>
            <el-select v-model='queryParams.status' multiple collapse-tags>
              <el-option value='SUBMIT' label='提交装车'></el-option>
              <el-option value='DELIVERY' label='司机发货'></el-option>
              <el-option value='RECEIVE' label='签收待审核'></el-option>
              <el-option value='FINISH' label='发货完成'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if='!hideTaskField' label='任务编号' prop='task_no'>
            <el-input v-model.trim='queryParams.task_no' clearable></el-input>
          </el-form-item>
          <el-form-item label='车辆订单' prop='car_order'>
            <el-input v-model.trim='queryParams.car_order' placeholder='车辆发货订单' clearable></el-input>
          </el-form-item>
          <el-form-item v-if='!hideTaskField' label='销售公司' prop='company_name'>
            <el-input v-model.trim='queryParams.company_name' clearable></el-input>
          </el-form-item>
          <el-form-item v-if='!hideTaskField' label='业务员' prop='salesman'>
            <el-input v-model.trim='queryParams.salesman' clearable></el-input>
          </el-form-item>
          <el-form-item v-if='!hideTaskField' label='发货工厂' prop='area_name'>
            <el-input v-model.trim='queryParams.area_name' clearable></el-input>
          </el-form-item>
          <el-form-item v-if='!hideTaskField' label='收货单位' prop='receive_unit'>
            <el-input v-model.trim='queryParams.receive_unit' clearable></el-input>
          </el-form-item>
          <el-form-item v-if='!hideTaskField' label='收货地址' prop='receive_address'>
            <el-input v-model.trim='queryParams.receive_address' clearable></el-input>
          </el-form-item>
          <el-form-item v-if='!hideTaskField' label='收货人' prop='receive_name'>
            <el-input v-model.trim='queryParams.receive_name' clearable></el-input>
          </el-form-item>
          <el-form-item label='司机单位' prop='driver_unit'>
            <el-input v-model.trim='queryParams.driver_unit' clearable></el-input>
          </el-form-item>
          <el-form-item label='司机车牌' prop='driver_no'>
            <el-input v-model.trim='queryParams.driver_no' clearable></el-input>
          </el-form-item>
          <el-form-item label='司机姓名' prop='driver_name'>
            <el-input v-model.trim='queryParams.driver_name' clearable></el-input>
          </el-form-item>
          <el-form-item label='司机电话' prop='driver_tel'>
            <el-input v-model.trim='queryParams.driver_tel' clearable></el-input>
          </el-form-item>
          <el-form-item v-if='!hideSubmitField' label='提交日期'>
            <el-row style='width:300px'>
              <el-col :span="11">
                <el-form-item prop='submit_date_begin'>
                  <el-date-picker v-model='queryParams.submit_date_begin' placeholder='开始日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="2">至</el-col>
              <el-col :span="11">
                <el-form-item prop='submit_date_end'>
                  <el-date-picker v-model='queryParams.submit_date_end' placeholder='结束日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label='发货日期'>
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
          <el-form-item label='签收日期'>
            <el-row style='width:300px'>
              <el-col :span="11">
                <el-form-item prop='receive_date_begin'>
                  <el-date-picker v-model='queryParams.receive_date_begin' placeholder='开始日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="2">至</el-col>
              <el-col :span="11">
                <el-form-item prop='receive_date_end'>
                  <el-date-picker v-model='queryParams.receive_date_end' placeholder='结束日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label='审核日期'>
            <el-row style='width:300px'>
              <el-col :span="11">
                <el-form-item prop='review_date_begin'>
                  <el-date-picker v-model='queryParams.review_date_begin' placeholder='开始日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="2">至</el-col>
              <el-col :span="11">
                <el-form-item prop='review_date_end'>
                  <el-date-picker v-model='queryParams.review_date_end' placeholder='结束日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label='装车面积'>
            <el-row style='width:300px'>
              <el-col :span="11">
                <el-form-item prop='product_area_begin'>
                  <el-input v-model='queryParams.product_area_begin' placeholder='最小值' clearable>
                    <span slot="suffix">㎡</span>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">至</el-col>
              <el-col :span="11">
                <el-form-item prop='product_area_end'>
                  <el-input v-model='queryParams.product_area_end' placeholder='最小值' clearable>
                    <span slot="suffix">㎡</span>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
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
      @sort-change='sortChange'
      @selection-change='selectionChange'>
      <el-table-column
        v-if='showSelection'
        type="selection"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column prop='no' fixed label='车辆编号' sortable='custom' width='130' show-overflow-tooltip>
        <template slot-scope='{row}'>
          <span class='c-link' @click='openDetails(row)'>{{row.no}}</span>
        </template>
      </el-table-column>      
      <el-table-column v-if='!hideSubmitField' prop='status' fixed label='车辆状态' width='100' align='center'>
        <template slot-scope='{row}'>
          <status-tag :status='row.status'></status-tag>
        </template>
      </el-table-column>      
      <el-table-column v-if='!hideTaskField' prop='project' label='项目名称' width='110' show-overflow-tooltip />
      <el-table-column v-if='!hideTaskField' prop='task_no' label='任务编号' width='110' show-overflow-tooltip>
        <template slot-scope='{row}'>
          <span class='c-link' @click='openTaskDetails(row)'>
            {{row.task_no}}
          </span>
        </template>
      </el-table-column>
      <el-table-column v-if='!hideTaskField' prop='contract_no' label='合同号' width='110' show-overflow-tooltip />
      <el-table-column v-if='!hideTaskField' prop='salesman_unit' label='销售公司' width='110' show-overflow-tooltip />
      <el-table-column v-if='!hideTaskField' prop='salesman_name' label='业务员' width='110' show-overflow-tooltip />
      <el-table-column v-if='!hideTaskField' prop='db_no' label='调拨单号' width='110' show-overflow-tooltip />
      <el-table-column v-if='!hideTaskField' prop='fh_no' label='发货申请编号' width='120' show-overflow-tooltip />
      <el-table-column v-if='!hideTaskField' prop='area_name' label='发货工厂' width='110' show-overflow-tooltip />
      <el-table-column v-if='!hideTaskField' prop='receive_unit' label='收货单位' width='110' show-overflow-tooltip />
      <el-table-column v-if='!hideTaskField' prop='receive_address' label='收货地址' width='110' show-overflow-tooltip />
      <el-table-column v-if='!hideTaskField' prop='receive_name' label='收货人' width='110' show-overflow-tooltip />
      <el-table-column v-if='!hideTaskField' prop='receive_tel' label='联系电话' width='110' show-overflow-tooltip />
      <el-table-column prop='orders' label='发货订单' width='110' show-overflow-tooltip />
      <el-table-column prop='driver_unit' label='司机单位' width='110' show-overflow-tooltip/>
      <el-table-column prop='driver_name' label='司机姓名' width='100' show-overflow-tooltip />
      <el-table-column prop='driver_no' label='车牌号码' width='110' show-overflow-tooltip />
      <el-table-column prop='driver_tel' label='联系电话' width='110' show-overflow-tooltip />
      <el-table-column prop='amount_total' label='装车数量' width='100' align='right' sortable='custom' />
      <el-table-column prop='area_total' label='装车面积' width='110' align='right' sortable='custom'>
        <template slot-scope='{row}'>
          <span class='c-link' @click='openProductDialog(row)'>{{ row.area_total }}㎡</span>
        </template>
      </el-table-column>
      <el-table-column prop='delivery_time' label='发货时间' sortable='custom' width='120'>
        <template slot-scope='{row}'>
          {{ $commonJs.formatDate(row.delivery_time) }}
        </template>
      </el-table-column>
      <el-table-column prop='receive_time' label='签收时间' sortable='custom' width='120'>
        <template slot-scope='{row}'>
          {{ $commonJs.formatDate(row.receive_time) }}
        </template>
      </el-table-column>
      <el-table-column prop='review_time' label='审核完成时间' sortable='custom' width='120'>
        <template slot-scope='{row}'>
          {{ $commonJs.formatDate(row.review_time) }}
        </template>
      </el-table-column>
      <el-table-column prop='img_attach_ids' align='center' label='签收图片'>
        <template slot-scope='{row}'>
          <span class='c-link' @click='openImg(row)'>{{row.img_attach_ids?row.img_attach_ids.split(',').length:0}}
          </span>
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
    <product-list-dialog 
      hide-car-fields
      :in-dialog='inDialog' 
      ref='productListDialog' />
    <car-details 
      :in-dialog='inDialog' 
      ref='carDetails' />
    <img-list-dialog :in-dialog='inDialog' ref='imgListDialog'/>
    <task-details :in-dialog='inDialog' ref='taskDetails'/>
  </div>
</template>
<script>
import carApi from '@/api/cy/deliveryCar'
import statusTag from './statusTag'
import productListDialog from '../product/listDialog'
import carDetails from './details'
import imgListDialog from '@/components/common/attach/imgListDialog'

export default {
  components:{ statusTag, productListDialog, carDetails, imgListDialog },
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
    showSelection:{
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
    hideTaskField:{
      type:Boolean,
      default:false
    },    
    sortProp:{
      default:''
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
      selectionList:[],
      summaryData:{},
      //查询条件字段
      queryParams:{
        input_status:1,
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
  created(){
    this.$options.components.taskDetails = ()=>import('@/components/yyzx/deliveryTask/details')
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
      this.getData()
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
    selectionChange(valueArrary){
      this.selectionList = valueArrary
    },
    //获取数据
    getData() {
      this.loading=true
      carApi.getList({...this.requestParams,...this.params,...this.initParams}).then(res=>{
        this.list = res.data.list
        this.dataTotal = res.data.total
        this.summaryData = res.data.summary || {}
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
    exportExcel(){
      carApi.exportExcel({...this.requestParams,...this.params,...this.initParams})
    },
    del({ row,$index }){
      let confirmText = '确定删除此车辆吗？'
      this.$confirm(confirmText,'提示',{
        type: 'warning'
      }).then(()=>{
        carApi.del(row.id).then(res=>{
          this.list.splice($index,1)
          this.dataTotal--
          this.$message.success('删除成功')
          this.$emit('del')         
        })
      })
    },
    undo({ row,$index }){
      if(row.status!=='SUBMIT'){
        this.$message.error('该车辆已发货，无法撤销！')
        return false
      }
      let confirmText = '确定撤销此车辆吗？'
      this.$confirm(confirmText,'提示',{
        type: 'warning'
      }).then(()=>{
        carApi.undo(row.id).then(res=>{
          this.list.splice($index,1)
          this.dataTotal--
          this.$message.success('撤销成功')
          this.$emit('undo')       
        })
      })
    },
    undoReview({ row,$index }){
      if(row.status!=='FINISH'){
        this.$message.error('该车辆未审核完成，无法撤销审核！')
        return false
      }
      let confirmText = '确定撤销此车辆的审核吗？'
      this.$confirm(confirmText,'提示',{
        type: 'warning'
      }).then(()=>{
        carApi.undoReview(row.id).then(res=>{
          this.list.splice($index,1)
          this.dataTotal--
          this.$message.success('撤销成功')
          this.$emit('undo')       
        })
      })
    },
    openProductDialog(row){
      this.$refs.productListDialog.open().then(that=>{
        that.initData({car_id:row.id})
      })
    },
    openDetails(row){
      this.$refs.carDetails.open().then(that=>{
        that.initData(row)
      })
    },
    openImg(row){
      if(row.img_attach_ids){
        this.$refs.imgListDialog.open().then(that=>{
          that.initData({attach_ids:row.img_attach_ids})
        })
      }
    },
    openTaskDetails(row){
      this.$refs.taskDetails.open().then(that=>{
        that.get(row.task_id)
      })
    }
  }
}
</script>