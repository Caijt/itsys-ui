<!-- 
此组件初始化时不会自动加载数据，请在mounted中 this.$refs.[].initData()
如果放在dialog里面的吗，请在dialog的open事件中用this.$nextTick进行加载
 -->
<template>
    <div>
        <list ref="list" hide-export-button :query-params="queryParams" :data-api="dataApi">
            <div slot="query">
                <el-form-item label="账号名称" prop="name">
                    <el-input v-model.trim="queryParams.name" clearable></el-input>
                </el-form-item>
                <el-form-item label="登录地址" prop="login_address">
                    <el-input v-model.trim="queryParams.login_address" clearable></el-input>
                </el-form-item>
            </div>
            <div slot="query-more">
                <el-form-item label="登录账号" prop="account">
                    <el-input v-model.trim="queryParams.account" clearable></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remarks">
                    <el-input v-model.trim="queryParams.remarks" clearable></el-input>
                </el-form-item>
            </div>
            <template slot="column">
                <el-table-column prop="name" label="账号名称" width="110" show-overflow-tooltip>
                    <template slot-scope="{row}">
                        <span class="c-link" @click="openDetails(row)">{{row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="login_address"
                    label="登录地址"
                    min-width="120"
                    show-overflow-tooltip
                />
                <el-table-column prop="account" label="登录账号" min-width="120" show-overflow-tooltip/>
                <el-table-column
                    prop="password"
                    label="账号密码"
                    min-width="120"
                    show-overflow-tooltip
                />
                <el-table-column prop="remarks" label="备注" min-width="120" show-overflow-tooltip/>
                <el-table-column
                    prop="company_name"
                    label="账号所属公司"
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
        <account-details :in-dialog="inDialog" ref="accountDetails"/>
    </div>
</template>
<script>
import api from "@/api/it/account";
import depDialog from "@/components/hr/dep/treeDialog";
import accountDetails from "./details";
import list from "@/components/common/list";

export default {
    components: { depDialog, accountDetails, list },
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
                login_address: "",
                account: "",
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
        openDetails(row) {
            this.$refs.accountDetails.open().then(that => {
                that.initData(row);
            });
        },
        clear() {
            this.$refs.list.clear();
        },
        del(row) {
            let confirmText = "确定删除此账号吗？";
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