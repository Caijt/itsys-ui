<!-- 
此组件初始化时不会自动加载数据，请在mounted中 this.$refs.[].initData()
如果放在dialog里面的吗，请在dialog的open事件中用this.$nextTick进行加载
 -->
<template>
    <div>
        <list ref="list" hide-export-button :data-api="dataApi" :query-params="queryParams">
            <div slot="query">
                <el-form-item label="员工姓名" prop="name">
                    <el-input v-model.trim="queryParams.name" clearable></el-input>
                </el-form-item>
                <el-form-item label="工号" prop="no">
                    <el-input v-model.trim="queryParams.no" clearable></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="mail">
                    <el-input v-model.trim="queryParams.mail" clearable></el-input>
                </el-form-item>
            </div>
            <div slot="query-more">
                <el-form-item label="部门" prop="dep_id">
                    <select-input
                        ref="depSelectInput"
                        @click="openSelectDepDialog"
                        v-model="queryParams.dep_id"
                    />
                </el-form-item>
                <el-form-item label="子部门" prop="hasSubDep">
                    <el-switch v-model="queryParams.hasSubDep"></el-switch>
                </el-form-item>
                <el-form-item label="离职" prop="is_disabled">
                    <el-switch v-model="queryParams.is_disabled"></el-switch>
                </el-form-item>
            </div>
            <template slot="column">
                <el-table-column prop="name" label="姓名" min-width="100" show-overflow-tooltip/>
                <el-table-column prop="no" label="工号" width="100" show-overflow-tooltip/>
                <el-table-column prop="mail" label="邮箱" width="150" show-overflow-tooltip/>
                <el-table-column prop="dep_name" label="部门" width="100" show-overflow-tooltip/>
                <el-table-column prop="sex" label="性别" align="center" width="60">
                    <template slot-scope="{row}">
                        <el-tag v-if="row.sex==0">男</el-tag>
                        <el-tag v-else type="danger">女</el-tag>
                    </template>
                </el-table-column>
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
            </template>
        </list>
        <!--/ 分页 -->
        <dep-dialog :in-dialog="inDialog" ref="depDialog" show-select @select="selectDep"/>
    </div>
</template>
<script>
import employeeApi from "@/api/hr/employee";
import depDialog from "@/components/hr/dep/treeDialog";
import list from "@/components/common/list";
import selectInput from "@/components/common/selectInput";

export default {
    components: { depDialog, list, selectInput },
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
                name: "",
                no: "",
                mail:"",
                dep_id: null,
                hasSubDep: true,
                is_disabled: false
            },
            dataApi: employeeApi.getPageList,
            list: null
        };
    },
    mounted() {
        this.list = this.$refs.list;
    },
    methods: {
        //初始化数据
        initData(params = {}) {
            this.$refs.list.initData(params);
        },
        //刷新数据
        reload() {
            this.$refs.list.getData();
        },
        del(row) {
            let confirmText = "确定删除此员工吗？";
            this.$confirm(confirmText, "提示", {
                type: "warning"
            }).then(() => {
                employeeApi.del(row.id).then(res => {
                    this.reload();
                    this.$message.success("删除成功");
                    this.$emit("del");
                });
            });
        },
        openSelectDepDialog() {
            this.$refs.depDialog.open().then(that => {
                that.initData();
            });
        },
        selectDep(data) {
            this.queryParams.dep_id = data.id;
            this.$refs.depSelectInput.setName(data.name);
            this.$refs.depDialog.close();
        }
    }
};
</script>