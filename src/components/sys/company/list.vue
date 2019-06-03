<!-- 
此组件初始化时不会自动加载数据，请在mounted中 this.$refs.[].initData()
如果放在dialog里面的吗，请在dialog的open事件中用this.$nextTick进行加载
 -->
<template>
    <div>
        <list
            ref="list"
            :query-params="queryParams"
            no-page
            :data-api="dataApi"
            hide-export-button
            hide-more-button
        >
            <div slot="query">
                <el-form-item label="公司名称" prop="name">
                    <el-input v-model="queryParams.name" clearable></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-input v-model="queryParams.address" clearable></el-input>
                </el-form-item>
            </div>
            <template slot="column">
                <el-table-column prop="name" label="公司名称" min-width="120" show-overflow-tooltip/>
                <el-table-column prop="is_disabled" align="center" label="状态" width="80">
                    <template slot-scope="{row}">
                        <el-tag type="success" v-if="!row.is_disabled">启用</el-tag>
                        <el-tag type="info" v-else>禁用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="地址" min-width="120" show-overflow-tooltip/>
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
    </div>
</template>
<script>
import api from "@/api/sys/company";
import list from "@/components/common/list";
export default {
    components: { list },
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
                name: "", //项目编号
                address: "" //
            },
            dataApi: api.getPageList
        };
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
            let confirmText = "确定删除此公司吗？";
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