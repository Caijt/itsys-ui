<!-- 
此组件初始化时不会自动加载数据，请在mounted中 this.$refs.[].initData()
如果放在dialog里面的吗，请在dialog的open事件中用this.$nextTick进行加载
 -->
<template>
    <div>
        <list
            ref="list"
            :query-params="queryParams"
            hide-export-button
            :show-checkbox="showCheckbox"
            :show-query-more="showQueryMore"
            :data-api="dataApi"
            :hide-query="hideQuery"
            :no-page="noPage"
        >
            <div slot="query">
                <el-form-item label="资产编号" prop="asset_no">
                    <el-input v-model="queryParams.asset_no" clearable></el-input>
                </el-form-item>
                <el-form-item label="资产型号" prop="asset_model">
                    <el-input v-model.trim="queryParams.asset_model" clearable></el-input>
                </el-form-item>
                <el-form-item label="标识号" prop="asset_diy_no">
                    <el-input v-model.trim="queryParams.asset_diy_no" clearable></el-input>
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
                    <el-switch v-model="queryParams.hasSubDep"></el-switch>
                </el-form-item>
                <el-form-item label="领用员工" prop="employee_name">
                    <el-input v-model.trim="queryParams.employee_name" clearable></el-input>
                </el-form-item>
                <el-form-item label="使用地点" prop="place">
                    <el-input v-model.trim="queryParams.place" clearable></el-input>
                </el-form-item>
                <el-form-item label="领用备注" prop="remarks">
                    <el-input v-model.trim="queryParams.remarks" clearable></el-input>
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
                <el-table-column v-if="!hideAssetFields" prop="asset_no" label="资产编号" width="100">
                    <template slot-scope="{row}">
                        <span class="c-link" @click="openDetails(row)">{{row.asset_no}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="!hideAssetFields"
                    prop="asset_model"
                    min-width="150"
                    label="资产型号"
                    show-overflow-tooltip
                />
                <el-table-column
                    v-if="!hideAssetFields"
                    prop="asset_type_name"
                    width="100"
                    label="资产类型"
                    show-overflow-tooltip
                />
                <el-table-column
                    v-if="!hideAssetFields"
                    prop="asset_diy_no"
                    width="100"
                    label="标识号"
                    show-overflow-tooltip
                />
                <el-table-column
                    v-if="!hideAssetFields"
                    prop="company_name"
                    min-width="120"
                    label="资产所属公司"
                    show-overflow-tooltip
                />
                <el-table-column prop="use_date" label="领用日期" sortable="custom" width="100">
                    <template slot-scope="{row}">{{ row.use_date | formatToDate }}</template>
                </el-table-column>
                <el-table-column
                    prop="dep_name"
                    label="领用部门"
                    sortable="custom"
                    width="120"
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="employee_name"
                    label="领用员工"
                    sortable="custom"
                    width="120"
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="use_place"
                    label="使用地点"
                    min-width="120"
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="use_remarks"
                    label="领用备注"
                    min-width="120"
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="use_amount"
                    label="使用数量"
                    align="right"
                    sortable="custom"
                    width="100"
                />
                <!-- slot[column] -->
                <slot name="column"></slot>
                <!--/ slot[column]-->
            </template>
        </list>
        <asset-details v-if="!hideAssetFields" :in-dialog="inDialog" ref="assetDetails"/>
        <dep-dialog :in-dialog="inDialog" ref="depDialog" show-select @select="selectDep"/>
    </div>
</template>
<script>
import api from "@/api/it/assetUseStatus";
import assetDetails from "@/components/it/asset/details";
import depDialog from "@/components/hr/dep/treeDialog";
import list from "@/components/common/list";
import selectInput from "@/components/common/selectInput";

export default {
    components: { assetDetails, depDialog, list, selectInput },
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
        showCheckbox: {
            type: Boolean,
            default: false
        },
        hideAssetFields: {
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
            queryParams: {
                asset_no: "",
                asset_model: "",
                asset_diy_no: "",
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
        openDetails(row) {
            this.$refs.assetDetails.open().then(that => {
                that.getDetails(row.asset_id);
            });
        },
        clear() {
            this.$refs.list.clear();
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