<!-- 
此组件初始化时不会自动加载数据，请在mounted中 this.$refs.[].initData()
如果放在dialog里面的吗，请在dialog的open事件中用this.$nextTick进行加载
 -->
<template>
    <div>
        <list
            ref="list"
            hide-export-button
            :data-api="dataApi"
            :query-params="queryParams"
            :no-page="noPage"
            :hide-query="hideQuery"
            @loaded="$emit('loaded',$event)"
        >
            <div slot="query">
                <el-form-item label="库存种类" prop="name">
                    <el-input v-model="queryParams.name" clearable></el-input>
                </el-form-item>
                <el-form-item label="库存状态" prop="status">
                    <el-select v-model="queryParams.status" clearable>
                        <el-option :value="false" label="正常"></el-option>
                        <el-option :value="true" label="库存不足"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="remarks">
                    <el-input v-model="queryParams.remarks" clearable></el-input>
                </el-form-item>
            </div>
            <template slot="column">
                <el-table-column prop="name" label="库存种类" min-width="120" show-overflow-tooltip/>
                <el-table-column
                    prop="status"
                    align="center"
                    label="库存状态"
                    sortable="custom"
                    width="100"
                    show-overflow-tooltip
                >
                    <template slot-scope="{row}">
                        <el-tag type="success" v-if="row.stock_amount >row.warning_value">正常</el-tag>
                        <el-tag type="danger" v-else>库存不足</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="stock_amount"
                    align="center"
                    label="目前库存量"
                    sortable="custom"
                    width="120"
                >
                    <template slot-scope="{row}">
                        <span class="c-link" @click="openAssetDialog(row)">{{row.stock_amount}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="warning_value"
                    align="center"
                    label="库存预警值"
                    sortable="custom"
                    width="120"
                    show-overflow-tooltip
                />
                <el-table-column prop="remarks" label="备注" min-width="120" show-overflow-tooltip/>
                <el-table-column
                    prop="company_name"
                    label="所属公司"
                    min-width="120"
                    show-overflow-tooltip
                />
                <el-table-column
                    v-if="!hideEditFields"
                    prop="create_user_name"
                    width="90"
                    label="录入员"
                />
                <el-table-column
                    v-if="!hideEditFields"
                    prop="create_time"
                    width="120"
                    label="创建时间"
                    sortable="custom"
                >
                    <template slot-scope="{ row }">
                        <span>{{ row.create_time | formatDate }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="!hideEditFields"
                    prop="update_time"
                    label="最近更新时间"
                    width="120"
                    sortable="custom"
                >
                    <template slot-scope="{row}">
                        <span>{{ row.update_time | formatDate }}</span>
                    </template>
                </el-table-column>
                <!-- slot[column] -->
                <slot name="column"></slot>
                <!--/ slot[column]-->
            </template>
        </list>
        <asset-dialog :in-dialog="inDialog" ref="assetDialog"/>
    </div>
</template>
<script>
import api from "@/api/it/assetStockWarning";
import assetDialog from "@/components/it/asset/listDialog";
import list from "@/components/common/list";

export default {
    components: { assetDialog, list },
    props: {
        sortProp: {
            type: String,
            default: "status"
        },
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
        hideEditFields: {
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
                name: "",
                status: "",
                remarks: ""
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
        clear() {
            this.list = [];
        },
        del(row) {
            let confirmText =
                "确定删除此库存种类吗？删除后会自动清除此库存种类资产的关联关系！";
            this.$confirm(confirmText, "提示", {
                type: "warning"
            }).then(() => {
                api.del(row.id).then(res => {
                    this.reload();
                    this.$message.success("删除成功");
                    this.$emit("del");
                });
            });
        },
        openAssetDialog(row) {
            this.$refs.assetDialog.open().then(that => {
                that.initData({ stock_warning_id: row.id });
            });
        }
    }
};
</script>