<!-- 
此组件初始化时不会自动加载数据，请在mounted中 this.$refs.[].initData()
如果放在dialog里面的吗，请在dialog的open事件中用this.$nextTick进行加载
 -->
<template>
    <div>
        <list
            ref="list"
            :data-api="dataApi"
            no-page
            hide-more-button
            hide-export-button
            :query-params="queryParams"
        >
            <div slot="query">
                <el-form-item label="参数名称" prop="key">
                    <el-input v-model="queryParams.key" clearable></el-input>
                </el-form-item>
                <el-form-item label="说明" prop="remarks">
                    <el-input v-model="queryParams.remarks" clearable></el-input>
                </el-form-item>
            </div>
            <template slot="column">
                <el-table-column prop="key" label="参数名称" width="150" show-overflow-tooltip/>
                <el-table-column prop="value" label="参数值" width="150" show-overflow-tooltip/>
                <el-table-column prop="remarks" label="参数说明" min-width="120" show-overflow-tooltip/>
                <!-- slot[column] -->
                <slot name="column"></slot>
            </template>
        </list>
    </div>
</template>
<script>
import api from "@/api/sys/config";
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
                key: "",
                remarks: ""
            },
            dataApi: api.getList
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
            let confirmText = "确定删除此参数吗？";
            this.$confirm(confirmText, "提示", {
                type: "warning"
            }).then(() => {
                api.del(row.key).then(res => {
                    this.reload();
                    this.$message.success("删除成功");
                    this.$emit("del");
                });
            });
        }
    }
};
</script>