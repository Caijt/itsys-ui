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
        >
            <div slot="query">
                <el-form-item label="资产编号" prop="asset_no">
                    <el-input v-model="queryParams.asset_no" clearable></el-input>
                </el-form-item>
                <el-form-item label="资产型号" prop="asset_model">
                    <el-input v-model="queryParams.asset_model" clearable></el-input>
                </el-form-item>
            </div>
            <div slot="query-more">
                <el-form-item label="报废原因" prop="reason">
                    <el-input v-model="queryParams.reason" clearable></el-input>
                </el-form-item>
                <el-form-item label="报废日期">
                    <el-row style="width:300px">
                        <el-col :span="11">
                            <el-form-item prop="scrap_date_begin">
                                <el-date-picker
                                    v-model="queryParams.scrap_date_begin"
                                    placeholder="开始日期"
                                    value-format="yyyy-MM-dd"
                                    style="width: 100%"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2">至</el-col>
                        <el-col :span="11">
                            <el-form-item prop="scrap_date_end">
                                <el-date-picker
                                    v-model="queryParams.scrap_date_end"
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
                <el-table-column prop="scrap_date" width="100" sortable="custom" label="报废日期">
                    <template slot-scope="{row}">{{row.scrap_date|formatToDate}}</template>
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
                    min-width="150"
                    label="资产型号"
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="amount"
                    label="报废数量"
                    sortable="custom"
                    width="120"
                    show-overflow-tooltip
                />
                <el-table-column prop="reason" label="报废原因" min-width="150" show-overflow-tooltip/>
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
    </div>
</template>
<script>
import api from "@/api/it/assetScrapRecord";
import assetDetails from "../details";
import list from "@/components/common/list";

export default {
    components: { assetDetails, list },
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
                asset_no: "", //项目编号
                asset_model: "", //项目名称
                reason: "",
                scrap_date_begin: "",
                scrap_date_end: ""
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
        clear() {
            this.$refs.list.clear();
        },
        del({ row, $index }) {
            let confirmText = "确定删除此IT资产报废记录吗？";
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
        }
    }
};
</script>