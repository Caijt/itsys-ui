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
            :hide-query="hideQuery"
            :show-checkbox="showCheckbox"
            :data-api="dataApi"
        >
            <div slot="query">
                <el-form-item label="交还编号" prop="no">
                    <el-input v-model="queryParams.no" clearable></el-input>
                </el-form-item>
                <el-form-item label="归还地点" prop="place">
                    <el-input v-model="queryParams.place" clearable></el-input>
                </el-form-item>
                <el-form-item label="交还备注" prop="remarks">
                    <el-input v-model="queryParams.remarks" clearable></el-input>
                </el-form-item>
            </div>
            <div slot="query-more">
                <el-form-item label="交还日期">
                    <el-row style="width:300px">
                        <el-col :span="11">
                            <el-form-item prop="return_date_begin">
                                <el-date-picker
                                    v-model="queryParams.return_date_begin"
                                    placeholder="开始日期"
                                    value-format="yyyy-MM-dd"
                                    style="width: 100%"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2">至</el-col>
                        <el-col :span="11">
                            <el-form-item prop="return_date_end">
                                <el-date-picker
                                    v-model="queryParams.return_date_end"
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
                <el-table-column prop="no" label="交还单编号" width="110">
                    <template slot-scope="{row}">
                        <span class="c-link" @click="openDetailsDialog(row)">{{row.no}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="record_date" width="100" sortable="custom" label="交还日期">
                    <template slot-scope="{row}">{{row.record_date|formatToDate}}</template>
                </el-table-column>
                <el-table-column
                    prop="amount"
                    align="center"
                    label="交还数量"
                    sortable="custom"
                    width="100"
                >
                    <template slot-scope="{row}">
                        <span class="c-link" @click="openRecordDetailDialog(row)">{{row.amount}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="place" label="归还地点" min-width="120" show-overflow-tooltip/>
                <el-table-column prop="remarks" label="备注" min-width="120" show-overflow-tooltip/>
                <el-table-column
                    prop="company_name"
                    min-width="120"
                    label="记录所属公司"
                    show-overflow-tooltip
                />
                <el-table-column
                    width="90"
                    prop="create_user_name"
                    show-overflow-tooltip
                    label="录入员"
                />
                <el-table-column prop="submit_time" width="120" label="提交时间" sortable="custom">
                    <template slot-scope="{ row }">
                        <span>{{ row.submit_time | formatDate }}</span>
                    </template>
                </el-table-column>
                <slot name="column"></slot>
            </template>
        </list>

        <detail-list-dialog hide-record-fields :in-dialog="inDialog" ref="detailListDialog"/>
        <record-details :in-dialog="inDialog" ref="recordDetails"/>
    </div>
</template>
<script>
import api from "@/api/it/assetReturnRecord";
import detailListDialog from "./detail/listDialog";
import recordDetails from "./details";
import list from "@/components/common/list";

export default {
    components: { detailListDialog, recordDetails, list },
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
                place: "",
                remarks: "",
                return_date_begin: "",
                return_date_end: ""
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
        }
    }
};
</script>