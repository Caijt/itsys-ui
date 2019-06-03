<!-- 
此组件初始化时不会自动加载数据，请在mounted中 this.$refs.[].initData()
如果放在dialog里面的吗，请在dialog的open事件中用this.$nextTick进行加载
 -->
<template>
    <div>
        <list
            ref="list"
            :show-checkbox="showCheckbox"
            :query-params="queryParams"
            hide-export-button
            :data-api="dataApi"
        >
            <div slot="query">
                <el-form-item label="领用编号" prop="no">
                    <el-input v-model="queryParams.no" clearable></el-input>
                </el-form-item>
                <el-form-item label="使用地点" prop="place">
                    <el-input v-model="queryParams.place" clearable></el-input>
                </el-form-item>
                <el-form-item label="领用备注" prop="remarks">
                    <el-input v-model="queryParams.remarks" clearable></el-input>
                </el-form-item>
            </div>
            <div slot="query-more">
                <el-form-item label="领用部门" prop="dep_id">
                    <select-input
                        ref="depSelectInput"
                        @click="openSelectDepDialog"
                        v-model="queryParams.dep_id"
                    />
                </el-form-item>
                <el-form-item label="子部门" prop="hasSubDep">
                    <el-switch v-model="queryParams.hasSubDep"/>
                </el-form-item>
                <el-form-item label="领用员工" prop="employee_name">
                    <el-input v-model="queryParams.employee_name" clearable></el-input>
                </el-form-item>

                <el-form-item label="领用日期">
                    <el-row style="width:300px">
                        <el-col :span="11">
                            <el-form-item prop="use_date_begin">
                                <el-date-picker
                                    v-model="queryParams.use_date_begin"
                                    placeholder="开始日期"
                                    value-format="yyyy-MM-dd"
                                    style="width: 100%"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2">至</el-col>
                        <el-col :span="11">
                            <el-form-item prop="use_date_end">
                                <el-date-picker
                                    v-model="queryParams.use_date_end"
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
                <el-table-column prop="no" label="领用单编号" width="110">
                    <template slot-scope="{row}">
                        <span class="c-link" @click="openDetailsDialog(row)">{{row.no}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="record_date" width="100" sortable="custom" label="领用日期">
                    <template slot-scope="{row}">{{row.record_date | formatToDate }}</template>
                </el-table-column>
                <el-table-column prop="dep_name" width="100" label="领用部门" show-overflow-tooltip/>
                <el-table-column prop="employee_name" width="90" label="领用人" show-overflow-tooltip/>
                <el-table-column
                    prop="amount"
                    align="center"
                    label="领用数量"
                    sortable="custom"
                    width="100"
                >
                    <template slot-scope="{row}">
                        <span class="c-link" @click="openRecordDetailDialog(row)">{{row.amount}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="place" label="使用地点" width="120" show-overflow-tooltip/>
                <el-table-column prop="remarks" label="备注" width="120" show-overflow-tooltip/>
                <el-table-column
                    prop="company_name"
                    min-width="120"
                    label="记录所属公司"
                    show-overflow-tooltip
                />
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
            </template>
        </list>
        <detail-list-dialog hide-record-fields :in-dialog="inDialog" ref="detailListDialog"/>
        <record-details :in-dialog="inDialog" ref="recordDetails"/>
        <dep-dialog :in-dialog="inDialog" ref="depDialog" show-select @select="selectDep"/>
    </div>
</template>
<script>
import api from "@/api/it/assetUseRecord";
import detailListDialog from "./detail/listDialog";
import recordDetails from "./details";
import depDialog from "@/components/hr/dep/treeDialog";
import selectInput from "@/components/common/selectInput";
import list from "@/components/common/list";

export default {
    components: {
        detailListDialog,
        recordDetails,
        depDialog,
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
        showCheckbox: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            //查询条件字段
            queryParams: {
                no: "", //项目编号
                dep_id: null,
                hasSubDep: true,
                employee_name: "",
                place: "",
                remarks: "",
                use_date_begin: "",
                use_date_end: ""
            },
            dataApi: api.getPageList
        };
    },
    methods: {
        //初始化数据
        initData() {
            this.$refs.list.initData(params);
        },
        //刷新数据
        reload() {
            this.$refs.list.getData();
        },
        getSelectionList() {
            return this.$refs.list.selectionList;
        },
        openRecordDetailDialog(row) {
            this.$refs.detailListDialog.open().then(that => {
                that.initData({ record_id: row.id });
            });
        },
        openDetailsDialog(row) {
            this.$refs.recordDetails.open().then(that => {
                that.initData(row);
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