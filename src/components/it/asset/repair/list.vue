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
            :data-api="dataApi"
            :hide-query="hideQuery"
            :no-page="noPage"
            @loaded="$emit('loaded',$event)"
        >
            <div slot="query">
                <el-form-item label="资产编号" prop="asset_no">
                    <el-input v-model="queryParams.asset_no" clearable style="width: 150px"></el-input>
                </el-form-item>
                <el-form-item label="维修状态" prop="is_finish">
                    <el-select v-model="queryParams.is_finish" clearable>
                        <el-option :value="false" label="维修中"></el-option>
                        <el-option :value="true" label="正常"></el-option>
                    </el-select>
                </el-form-item>
            </div>
            <div slot="query-more">
                <el-form-item label="资产型号" prop="asset_model">
                    <el-input v-model="queryParams.asset_model" clearable></el-input>
                </el-form-item>
                <el-form-item label="供应商" prop="supplier_name">
                    <el-input v-model="queryParams.supplier_name" clearable></el-input>
                </el-form-item>
                <el-form-item label="故障描述" prop="reason">
                    <el-input v-model="queryParams.reason" clearable></el-input>
                </el-form-item>
                <el-form-item label="维修内容" prop="content">
                    <el-input v-model="queryParams.content" clearable></el-input>
                </el-form-item>
                <el-form-item label="维修日期">
                    <el-row style="width:300px">
                        <el-col :span="11">
                            <el-form-item prop="repair_date_begin">
                                <el-date-picker
                                    v-model="queryParams.repair_date_begin"
                                    placeholder="开始日期"
                                    value-format="yyyy-MM-dd"
                                    style="width: 100%"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2">至</el-col>
                        <el-col :span="11">
                            <el-form-item prop="repair_date_end">
                                <el-date-picker
                                    v-model="queryParams.repair_date_end"
                                    placeholder="结束日期"
                                    value-format="yyyy-MM-dd"
                                    style="width: 100%"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="完成日期">
                    <el-row style="width:300px">
                        <el-col :span="11">
                            <el-form-item prop="finish_date_begin">
                                <el-date-picker
                                    v-model="queryParams.finish_date_begin"
                                    placeholder="开始日期"
                                    value-format="yyyy-MM-dd"
                                    style="width: 100%"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2">至</el-col>
                        <el-col :span="11">
                            <el-form-item prop="finish_date_end">
                                <el-date-picker
                                    v-model="queryParams.finish_date_end"
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
                <el-table-column prop="is_finish" width="90" align="center" label="维修状态">
                    <template slot-scope="{row}">
                        <el-tag v-if="row.is_finish" type="success">已完成</el-tag>
                        <el-tag v-else type="danger">维修中</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="repair_date" width="100" sortable="custom" label="维修日期">
                    <template slot-scope="{row}">{{row.repair_date|formatToDate}}</template>
                </el-table-column>
                <el-table-column
                    prop="supplier_name"
                    width="100"
                    label="维修供应商"
                    show-overflow-tooltip
                >
                    <template slot-scope="{row}">
                        <span class="c-link" @click="openSupplierDetails(row)">{{row.supplier_name}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="!hideAssetFields"
                    prop="asset_no"
                    align="center"
                    label="资产编号"
                    sortable="custom"
                    width="100"
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
                <el-table-column prop="reason" label="故障描述" width="120" show-overflow-tooltip/>
                <el-table-column
                    prop="finish_date"
                    label="完成日期"
                    sortable="custom"
                    width="100"
                    show-overflow-tooltip
                >
                    <template slot-scope="{row}">{{row.finish_date|formatToDate}}</template>
                </el-table-column>
                <el-table-column
                    prop="price"
                    label="维修金额"
                    align="right"
                    sortable="custom"
                    width="100"
                    show-overflow-tooltip
                >
                    <template slot-scope="{row}">
                        <span>￥{{row.price}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="content" label="维修内容" width="150" show-overflow-tooltip/>
                <el-table-column
                    width="90"
                    prop="create_user_name"
                    label="录入员"
                    show-overflow-tooltip
                />
                <el-table-column prop="create_time" width="120" label="创建时间" sortable="custom">
                    <template slot-scope="{ row }">
                        <span>{{ row.create_time | formatDate }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="update_time" width="120" label="更新时间" sortable="custom">
                    <template slot-scope="{ row }">
                        <span>{{ row.update_time | formatDate }}</span>
                    </template>
                </el-table-column>
                <!-- slot[column] -->
                <slot name="column"></slot>
                <!--/ slot[column]-->
            </template>
        </list>
        <asset-details v-if="!hideAssetFields" :in-dialog="inDialog" ref="assetDetails"/>
        <supplier-details :in-dialog="inDialog" ref="supplierDetails"/>
    </div>
</template>
<script>
import api from "@/api/it/assetRepairRecord";
import assetDetails from "../details";
import supplierDetails from "@/components/it/supplier/details";
import list from "@/components/common/list";

export default {
    components: { assetDetails, supplierDetails, list },
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
                is_finish: null,
                asset_model: "",
                supplier_name: "",
                reason: "",
                content: "",
                repair_date_begin: "",
                repair_date_end: "",
                finish_date_begin: "",
                finish_date_end: ""
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
        openDetails(row) {
            this.$refs.assetDetails.open().then(that => {
                that.initData(row);
            });
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
        del({ row, $index }) {
            let confirmText = "确定删除此IT资产维修记录吗？";
            this.$confirm(confirmText, "提示", {
                type: "warning"
            }).then(() => {
                assetApi.del(row.id).then(res => {
                    this.reload();
                    this.$message.success("删除成功");
                    this.$emit("del");
                });
            });
        },
        openAssetDetails(row) {
            this.$refs.assetDetails.open().then(that => {
                that.getDetails(row.asset_id);
            });
        },
        openSupplierDetails(row) {
            this.$refs.supplierDetails.open().then(that => {
                that.getDetails(row.supplier_id);
            });
        },
        clear() {
            this.$refs.list.clear();
        }
    }
};
</script>