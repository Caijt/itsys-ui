<!-- 
此组件初始化时不会自动加载数据，请在mounted中 this.$refs.[].initData()
如果放在dialog里面的吗，请在dialog的open事件中用this.$nextTick进行加载
 -->
<template>
    <div>
        <list
            ref="list"
            hide-export-button
            :query-params="queryParams"
            :data-api="dataApi"
            :show-query-more="showQueryMore"
            :hide-query="hideQuery"
            :no-page="noPage"
            @loaded="$emit('loaded',$event)"
        >
            <div slot="query">
                <el-form-item label="记录编号" prop="record_no">
                    <el-input v-model="queryParams.record_no" clearable></el-input>
                </el-form-item>
                <el-form-item label="记录类型" prop="record_type">
                    <el-select v-model="queryParams.record_type" clearable>
                        <el-option label="领用" value="USE"></el-option>
                        <el-option label="交还" value="RETURN"></el-option>
                    </el-select>
                </el-form-item>
            </div>
            <div slot="query-more">
                <el-form-item label="资产编号" prop="asset_no">
                    <el-input v-model="queryParams.asset_no" clearable></el-input>
                </el-form-item>
                <el-form-item label="资产型号" prop="asset_model">
                    <el-input v-model="queryParams.asset_model" clearable></el-input>
                </el-form-item>
                <el-form-item label="部门" prop="dep_id">
                    <select-input
                        ref="depSelectInput"
                        v-model="queryParams.dep_id"
                        @click="openSelectDepDialog"
                    />
                </el-form-item>
                <el-form-item label="子部门" prop="hasSubDep">
                    <el-switch v-model="queryParams.hasSubDep"></el-switch>
                </el-form-item>
                <el-form-item label="员工" prop="employee_name">
                    <el-input v-model="queryParams.employee_name" clearable></el-input>
                </el-form-item>
                <el-form-item label="地点" prop="place">
                    <el-input v-model="queryParams.place" clearable></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remarks">
                    <el-input v-model="queryParams.remarks" clearable></el-input>
                </el-form-item>
                <el-form-item label="记录日期">
                    <el-row style="width:300px">
                        <el-col :span="11">
                            <el-form-item prop="record_date_begin">
                                <el-date-picker
                                    v-model="queryParams.record_date_begin"
                                    placeholder="开始日期"
                                    value-format="yyyy-MM-dd"
                                    style="width: 100%"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2">至</el-col>
                        <el-col :span="11">
                            <el-form-item prop="record_date_end">
                                <el-date-picker
                                    v-model="queryParams.record_date_end"
                                    placeholder="结束日期"
                                    value-format="yyyy-MM-dd"
                                    style="width: 100%"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
            </div>
            <template slot="column">
                <el-table-column align="center" prop="no" label="记录类型" width="80">
                    <template slot-scope="{row}">
                        <el-tag v-show="row.record_type=='USE'" type="danger">领用</el-tag>
                        <el-tag v-show="row.record_type=='RETURN'" type="success">交还</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="record_no" label="记录编号" width="110">
                    <template slot-scope="{row}">
                        <span class="c-link" @click="openDetailsDialog(row)">{{row.record_no}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="record_date" width="100" sortable="custom" label="记录日期">
                    <template slot-scope="{row}">{{row.record_date|formatToDate}}</template>
                </el-table-column>
                <el-table-column
                    v-if="!hideAssetFields"
                    prop="asset_no"
                    width="100"
                    label="资产编号"
                    show-overflow-tooltip
                >
                    <template slot-scope="{row}">
                        <span class="c-link" @click="openAssetDetails(row)">{{row.asset_no}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="!hideAssetFields"
                    prop="asset_model"
                    width="150"
                    label="资产型号"
                    show-overflow-tooltip
                />
                <el-table-column prop="dep_name" width="100" label="部门" show-overflow-tooltip/>
                <el-table-column prop="employee_name" width="90" label="员工" show-overflow-tooltip/>
                <el-table-column
                    prop="amount"
                    align="right"
                    label="数量"
                    sortable="custom"
                    width="70"
                ></el-table-column>
                <el-table-column prop="place" label="使用/归还地点" width="120" show-overflow-tooltip/>
                <el-table-column prop="remarks" label="备注" width="120" show-overflow-tooltip/>
                <el-table-column
                    width="90"
                    prop="create_user_name"
                    label="录入员"
                    show-overflow-tooltip
                />
                <el-table-column prop="submit_time" width="120" label="提交时间" sortable="custom">
                    <template slot-scope="{ row }">
                        <span>{{ row.submit_time | formatDate }}</span>
                    </template>
                </el-table-column>
                <!-- slot[column] -->
                <slot name="column"></slot>
                <!--/ slot[column]-->
            </template>
        </list>
        <use-record-details :in-dialog="inDialog" ref="useRecordDetails"/>
        <return-record-details :in-dialog="inDialog" ref="returnRecordDetails"/>
        <dep-dialog :in-dialog="inDialog" ref="depDialog" show-select @select="selectDep"/>
        <asset-details v-if="!hideAssetFields" :in-dialog="inDialog" ref="assetDetails"/>
    </div>
</template>
<script>
import api from "@/api/it/assetUseRecordItem";
import useRecordDetails from "../use/details";
import returnRecordDetails from "../return/details";
import depDialog from "@/components/hr/dep/treeDialog";
import assetDetails from "../details";
import list from "@/components/common/list";
import selectInput from "@/components/common/selectInput";

export default {
    components: {
        useRecordDetails,
        returnRecordDetails,
        depDialog,
        assetDetails,
        list,
        selectInput
    },
    props: {
        inDialog: {
            type: Boolean,
            default: false
        },
        hideQuery: {
            type: Boolean,
            default: false
        },
        showQueryMore: {
            type: Boolean,
            default: false
        },
        hideAssetFields: {
            type: Boolean,
            default: false
        },
        showCheckbox: {
            type: Boolean,
            default: false
        },
        noPage: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            //查询条件字段
            queryParams: {
                record_no: "", //
                record_type: "",
                asset_no: "", //
                asset_model: "", //
                dep_id: null,
                hasSubDep: true,
                employee_name: "",
                remarks: "",
                record_date_begin: "",
                record_date_end: ""
            },
            dataApi: api.getPageList
        };
    },
    methods: {
        //初始化数据
        initData(params) {
            this.$refs.list.initData(params);
        },
        //刷新数据
        reload() {
            this.$refs.list.getData();
        },
        openAssetDetails(row) {
            this.$refs.assetDetails.open().then(that => {
                that.getDetails(row.asset_id);
            });
        },
        //导出excel
        exportExcel() {
            assetApi.exportExcel(this.requestParams);
        },
        clear() {
            this.list = [];
        },
        openDetailsDialog(row) {
            let name =
                row.record_type == "USE"
                    ? "useRecordDetails"
                    : "returnRecordDetails";
            this.$refs[name].open().then(that => {
                that.getDetails(row.record_id);
            });
        },
        openSelectDepDialog() {
            this.$refs.depDialog.open().then(that => {
                that.initData();
            });
        },
        selectDep(data) {
            this.$refs.depSelectInput.setName(data.name);
            this.queryParams.dep_id = data.id;
            this.$refs.depDialog.close();
        }
    }
};
</script>