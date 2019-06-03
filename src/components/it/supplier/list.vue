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
            :show-checkbox="showCheckbox"
            :show-query-more="showQueryMore"
        >
            <div slot="query">
                <el-form-item label="名称" prop="name">
                    <el-input v-model.trim="queryParams.name" clearable></el-input>
                </el-form-item>
                <el-form-item label="合作类型" prop="supplierType">
                    <el-select v-model="queryParams.supplierType" multiple collapse-tags>
                        <el-option label="资产供应" value="ASSET"></el-option>
                        <el-option label="合同合作" value="CONTRACT"></el-option>
                    </el-select>
                </el-form-item>
            </div>
            <div slot="query-more">
                <el-form-item label="全称" prop="full_name">
                    <el-input v-model.trim="queryParams.full_name" clearable></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-input v-model.trim="queryParams.address" clearable></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="contacts">
                    <el-input v-model.trim="queryParams.contacts" clearable></el-input>
                </el-form-item>
                <el-form-item label="付款银行" prop="bank">
                    <el-input v-model.trim="queryParams.bank" clearable></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remarks">
                    <el-input v-model.trim="queryParams.remarks" clearable></el-input>
                </el-form-item>
            </div>
            <template slot="column">
                <el-table-column prop="name" label="供应商简称" min-width="100" show-overflow-tooltip>
                    <template slot-scope="{row}">
                        <span class="c-link" @click="openDetails(row)">{{row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="full_name"
                    label="供应商全称"
                    min-width="150"
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="supplier_type"
                    label="合作类型"
                    sortable="custom"
                    width="120"
                    show-overflow-tooltip
                >
                    <template
                        slot-scope="{row}"
                    >{{row.supplier_type&&row.supplier_type.replace('ASSET','资产供应商').replace('CONTRACT','合同合作商')}}</template>
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="地址"
                    sortable="custom"
                    width="120"
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="contacts"
                    label="联系人"
                    sortable="custom"
                    width="100"
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="bank"
                    label="付款银行"
                    sortable="custom"
                    width="100"
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="remarks"
                    label="备注"
                    sortable="custom"
                    width="100"
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="company_name"
                    label="所属公司"
                    min-width="120"
                    show-overflow-tooltip
                />
                <el-table-column prop="create_user_name" width="90" label="录入员"/>
                <el-table-column prop="create_time" width="120" label="创建时间" sortable="custom">
                    <template slot-scope="{ row }">
                        <span>{{ row.create_time | formatDate }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="update_time" label="最近更新时间" width="120" sortable="custom">
                    <template slot-scope="{row}">
                        <span>{{ row.update_time | formatDate }}</span>
                    </template>
                </el-table-column>
                <!-- slot[column] -->
                <slot name="column"></slot>
                <!--/ slot[column]-->
            </template>
        </list>
        <supplier-details :in-dialog="inDialog" ref="supplierDetails"/>
    </div>
</template>
<script>
import api from "@/api/it/supplier";
import supplierDetails from "@/components/it/supplier/details";
import list from "@/components/common/list";

export default {
    components: { supplierDetails, list },
    props: {
        inDialog: {
            type: Boolean,
            default: false
        },
        hideQuery: {
            type: Boolean,
            default: false
        },
        noPage: {
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
        }
    },
    data() {
        return {
            queryParams: {
                name: "",
                supplierType: [],
                full_name: "",
                address: "",
                contacts: "",
                bank: "",
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
        openDetails(row) {
            this.$refs.supplierDetails.open().then(that => {
                that.initData(row);
            });
        },
        clear() {
            this.$refs.list.clear();
        },
        del(row) {
            let confirmText = "确定删除此供应商吗？";
            this.$confirm(confirmText, "提示", {
                type: "warning"
            }).then(() => {
                api.del(row.id).then(res => {
                    this.reload();
                    this.$message.success("删除成功");
                    this.$emit("del");
                });
            });
        }
    }
};
</script>