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
        <el-form-item label='任务编号' prop='task_no'>
          <el-input v-model.trim='queryParams.task_no' clearable></el-input>
        </el-form-item>
        <el-form-item label='项目名称' prop='project_name'>
          <el-input v-model.trim='queryParams.project_name' clearable></el-input>
        </el-form-item>
        <!-- 更多条件 -->
        <span v-show='queryShowMore'>
          <el-form-item label='合同号' prop='contract_no'>
            <el-input v-model.trim='queryParams.contract_no' clearable></el-input>
          </el-form-item>
          <el-form-item label='销售公司' prop='company_name'>
            <el-input v-model.trim='queryParams.company_name' clearable></el-input>
          </el-form-item>
          <el-form-item label='业务员' prop='salesman'>
            <el-input v-model.trim='queryParams.salesman' clearable></el-input>
          </el-form-item>
          <el-form-item label='联系电话' prop='salesman_tel'>
            <el-input v-model.trim='queryParams.salesman_tel' placeholder='业务员联系电话' clearable></el-input>
          </el-form-item>
          <el-form-item label='调拨单号' prop='db_no'>
            <el-input v-model.trim='queryParams.db_no' clearable></el-input>
          </el-form-item>
          <el-form-item label='发货申请' prop='fh_no'>
            <el-input v-model.trim='queryParams.fh_no' placeholder='发货申请编号' clearable></el-input>
          </el-form-item>
          <el-form-item label='发货工厂' prop='factory_name'>
            <el-input v-model.trim='queryParams.factory_name' clearable></el-input>
          </el-form-item>
          <el-form-item label='发货订单' prop='order_no'>
            <el-input v-model.trim='queryParams.order_no' clearable></el-input>
          </el-form-item>
          <el-form-item label='交付方式' prop='method'>
            <el-input v-model.trim='queryParams.method' clearable></el-input>
          </el-form-item>
          <el-form-item label='收货单位' prop='receive_unit'>
            <el-input v-model.trim='queryParams.receive_unit' clearable></el-input>
          </el-form-item>
          <el-form-item label='收货地址' prop='receive_address'>
            <el-input v-model.trim='queryParams.receive_address' clearable></el-input>
          </el-form-item>
          <el-form-item label='收货人' prop='receive_name'>
            <el-input v-model.trim='queryParams.receive_name' clearable></el-input>
          </el-form-item>
          <el-form-item label='收货联系' prop='receive_tel'>
            <el-input v-model.trim='queryParams.receive_tel' placeholder='收货人联系电话' clearable></el-input>
          </el-form-item>
          <el-form-item label='计划发货'>
            <el-row style='width:300px'>
              <el-col :span="11">
                <el-form-item prop='plan_send_date_begin'>
                  <el-date-picker v-model='queryParams.plan_send_date_begin' placeholder='开始日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="2">至</el-col>
              <el-col :span="11">
                <el-form-item prop='plan_send_date_end'>
                  <el-date-picker v-model='queryParams.plan_send_date_end' placeholder='结束日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label='提交日期' v-if='!hideSubmitField'>
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
          <el-form-item label='装车日期' v-if='!hideSubmitField'>
            <el-row style='width:300px'>
              <el-col :span="11">
                <el-form-item prop='load_finish_date_begin'>
                  <el-date-picker v-model='queryParams.load_finish_date_begin' placeholder='开始日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="2">至</el-col>
              <el-col :span="11">
                <el-form-item prop='load_finish_date_end'>
                  <el-date-picker v-model='queryParams.load_finish_date_end' placeholder='结束日期' value-format='yyyy-MM-dd' style='width: 100%'></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label='装车面积'>
            <el-row style='width:300px'>
              <el-col :span="11">
                <el-form-item prop='load_area_begin'>
                  <el-input v-model='queryParams.load_area_begin' placeholder='最小值' clearable>
                    <span slot="suffix">㎡</span>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">至</el-col>
              <el-col :span="11">
                <el-form-item prop='load_area_end'>
                  <el-input v-model='queryParams.load_area_end' placeholder='最小值' clearable>
                    <span slot="suffix">㎡</span>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label='发货进度' v-if='!hideSubmitField'>
            <el-row style='width:300px'>
              <el-col :span="11">
                <el-form-item prop='delivery_progress_begin'>
                  <el-input v-model='queryParams.delivery_progress_begin' placeholder='最小值' clearable>
                    <span slot="suffix">%</span>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">至</el-col>
              <el-col :span="11">
                <el-form-item prop='delivery_progress_end'>
                  <el-input v-model='queryParams.delivery_progress_end' placeholder='最小值' clearable>
                    <span slot="suffix">%</span>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label='签收进度' v-if='!hideSubmitField'>
            <el-row style='width:300px'>
              <el-col :span="11">
                <el-form-item prop='receive_progress_begin'>
                  <el-input v-model='queryParams.receive_progress_begin' placeholder='最小值' clearable>
                    <span slot="suffix">%</span>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">至</el-col>
              <el-col :span="11">
                <el-form-item prop='receive_progress_end'>
                  <el-input v-model='queryParams.receive_progress_end' placeholder='最小值' clearable>
                    <span slot="suffix">%</span>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label='完成进度' v-if='!hideSubmitField'>
            <el-row style='width:300px'>
              <el-col :span="11">
                <el-form-item prop='finish_progress_begin'>
                  <el-input v-model='queryParams.finish_progress_begin' placeholder='最小值' clearable>
                    <span slot="suffix">%</span>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">至</el-col>
              <el-col :span="11">
                <el-form-item prop='finish_progress_end'>
                  <el-input v-model='queryParams.finish_progress_end' placeholder='最小值' clearable>
                    <span slot="suffix">%</span>
                  </el-input>
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
      @sort-change='sortChange'>
      <el-table-column prop='no' fixed label='任务编号' width='110'>
        <template slot-scope='{row}'>
          <span class='c-link' @click='openDetails(row)'>{{row.no}}</span>
        </template>
      </el-table-column>      
      <el-table-column prop='project' fixed label='项目名称' width='110' show-overflow-tooltip />
      <el-table-column prop='contract_no' label='合同号' width='110' show-overflow-tooltip />
      <el-table-column prop='salesman_unit' label='销售公司' width='110' show-overflow-tooltip />
      <el-table-column prop='salesman_name' label='业务员' width='110' show-overflow-tooltip />
      <el-table-column prop='salesman_tel' label='联系电话' width='110' show-overflow-tooltip />
      <el-table-column prop='db_no' label='调拨单号' width='90' show-overflow-tooltip />
      <el-table-column prop='fh_no' label='发货申请编号' width='100' show-overflow-tooltip />
      <el-table-column prop='area_name' label='发货工厂' width='100' show-overflow-tooltip />
      <el-table-column prop='plan_send_date' sortable='custom' label='计划发货日期' width='120' show-overflow-tooltip />
      <el-table-column prop='order_no' label='发货订单' width='100' show-overflow-tooltip />
      <el-table-column prop='method' label='交付方式' width='100' show-overflow-tooltip />
      <el-table-column prop='receive_unit' label='收货单位' width='100' show-overflow-tooltip />
      <el-table-column prop='receive_address' label='收货地址' width='110' show-overflow-tooltip />
      <el-table-column prop='receive_name' label='收货人' width='100' show-overflow-tooltip />
      <el-table-column prop='receive_tel' label='联系电话' width='100' show-overflow-tooltip />
      <el-table-column v-if='!hideSubmitField' prop='cy_car_total' label='发货车辆' align='center' sortable='custom' width='100'>
        <template slot-scope='{row}'>
          <span class='c-link' @click='openCarListDialog(row)'>{{row.cy_car_total}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if='!hideSubmitField' prop='status' label='发货车辆状态' width='120' show-overflow-tooltip>
        <template slot-scope='{row}'>
          <el-tooltip>
            <div slot='content'>
              <div>装车车辆：{{row.cy_load_car_total}}</div>
              <div>发货车辆：{{row.cy_delivery_car_total}}</div>
              <div>签收车辆：{{row.cy_receive_car_total}}</div>
              <div>完成车辆：{{row.cy_finish_car_total}}</div>
            </div>
            <div>
            <el-tag size='mini' type='warning'>{{row.cy_load_car_total}}</el-tag>
            <el-tag size='mini'>{{row.cy_delivery_car_total}}</el-tag>
            <el-tag size='mini' type='danger'>{{row.cy_receive_car_total}}</el-tag>
            <el-tag size='mini' type='success'>{{row.cy_finish_car_total}}</el-tag>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop='load_finish_time' label='装车完成时间' sortable='custom' width='120'>
        <template slot-scope='{row}'>
          <span v-if='row.load_finish_time'>{{ $commonJs.formatDate(row.load_finish_time) }}</span>
          <div style='text-align: center;' v-else><el-tag  >装车中</el-tag></div>
        </template>
      </el-table-column>
      <el-table-column prop='cy_load_area_total' label='装车面积' align='right' sortable='custom' width='110'>
        <template slot-scope='{row}'>
          {{row.cy_load_area_total}}㎡
        </template>
      </el-table-column>
      <!-- <el-table-column prop='product_area_total' align='right' sortable='custom' label='产品面积' width='100' >
        <template slot-scope='{row}'>
          {{ row.product_area_total }}㎡
        </template>
      </el-table-column> -->
      <!-- <el-table-column v-if='!hideSubmitField' prop='load_progress' label='装车进度' width='120' sortable='custom' align='center'>
        <template slot-scope='{ row }'>           
          <el-tooltip placement='left' :content='row.cy_load_area_total+"㎡（已装车面积） / "+row.product_area_total+"㎡（产品面积）"'>
            <el-progress 
              text-inside 
              :stroke-width='16' 
              :status='Number(row.load_progress)>=100?"success":""' 
              :percentage="Number(row.load_progress)>=100?100:Number(row.load_progress)"></el-progress>
          </el-tooltip>
        </template>
      </el-table-column> -->
      <el-table-column 
        v-if='!hideSubmitField'
        prop='delivery_progress' 
        label='发货进度' 
        width='120' 
        sortable='custom' 
        align='center'>
        <template slot-scope='{ row }'>           
          <el-tooltip placement='left' :content='row.cy_delivery_area_total+"㎡（已发货面积） / "+row.cy_load_area_total+"㎡（装车面积）"'>
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
          <el-tooltip placement='left' :content='row.cy_receive_area_total+"㎡（已签收面积） / "+row.cy_load_area_total+"㎡（装车面积）"'>
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
          <el-tooltip placement='left' :content='row.cy_finish_area_total+"㎡（已完成面积） / "+row.cy_load_area_total+"㎡（装车面积）"'>
            <el-progress 
              text-inside 
              :stroke-width='16' 
              :status='Number(row.finish_progress)>=100?"success":""' 
              :percentage="Number(row.finish_progress)>=100?100:Number(row.finish_progress)"></el-progress>
          </el-tooltip>
        </template>
      </el-table-column>
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
      <el-table-column v-if='!hideSubmitField' prop='create_user_name' label='提交人' />
      <el-table-column v-if='!hideSubmitField' prop='submit_time' label='提交时间' sortable='custom' width='120'>
        <template slot-scope='{row}'>
          {{ $commonJs.formatDate(row.submit_time) }}
        </template>
      </el-table-column>      
      <!-- <el-table-column v-if='showConfirmField' prop='confirm_time' label='确认时间' sortable='custom' width='120'>
        <template slot-scope='{row}'>
          {{ $commonJs.formatDate(row.confirm_time) }}
        </template>
      </el-table-column> -->
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
    <car-list-dialog :in-dialog='inDialog' hide-task-field hide-edit-field ref='carListDialog'></car-list-dialog>
    <task-details :in-dialog='inDialog' ref='taskDetails'/>
  </div>
</template>
<script>
import taskApi from '@/api/yyzx/deliveryTask'
import carListDialog from '@/components/cy/deliveryTask/car/listDialog'
import taskDetails from '../details'
export default {
  components:{ carListDialog, taskDetails },
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
      taskApi.getList(this.requestParams).then(res=>{
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
    },
    exportExcel(){
      taskApi.exportExcel(this.requestParams)
    },
    getProjectFieldList(field){
      return (keyword,callback)=>{
        projectApi.getFieldList({ field,keyword }).then(res=>{
          callback(res.data)
        })
      }
    },
    openCarListDialog(row){
      if(row.cy_car_total){
        this.$refs.carListDialog.open().then(that=>{
          that.initData({task_id:row.id})
        })
      }
    },
    undo({ row,$index }){
      if(row.cy_car_total>0){
        this.$message.error('该发货任务已装车，无法撤回！')
        return false
      }
      let confirmText = '确定撤回此发货任务吗？撤回后将在编辑列表中'
      this.$confirm(confirmText,'提示',{
        type: 'warning'
      }).then(()=>{
        taskApi.undo(row.id).then(res=>{
          this.list.splice($index,1)
          this.dataTotal--
          this.$message.success('撤回成功')
          this.$emit('undo')         
        })
      })
    },
    del({ row,$index }){
      let confirmText = '确定删除此任务吗？'
      this.$confirm(confirmText,'提示',{
        type: 'warning'
      }).then(()=>{
        taskApi.del(row.id).then(res=>{
          this.list.splice($index,1)
          this.dataTotal--
          this.$message.success('删除成功')
          this.$emit('del')         
        })
      })
    },
    openDetails(row){
      this.$refs.taskDetails.open().then(that=>{
        that.initData(row)
      })
    }
  }
}
</script>