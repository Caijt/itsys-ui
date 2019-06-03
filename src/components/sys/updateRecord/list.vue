<!-- 
此组件初始化时不会自动加载数据，请在mounted中 this.$refs.[].initData()
如果放在dialog里面的吗，请在dialog的open事件中用this.$nextTick进行加载
 -->
<template>
    <div>
        <list
            ref="list"
            hide-export-button
            hide-more-button
            :data-api="dataApi"
            :query-params="queryParams"
        >
            <div slot="query">
                <el-form-item label="更新标题" prop="title">
                    <el-input v-model="queryParams.title" clearable></el-input>
                </el-form-item>
                <el-form-item label="更新内容" prop="content">
                    <el-input v-model="queryParams.content" clearable></el-input>
                </el-form-item>
            </div>
            <template slot="column">
                <el-table-column prop="title" label="更新标题" width="120" show-overflow-tooltip/>
                <el-table-column prop="update_date" label="更新日期" sortable="custom" width="100">
                    <template slot-scope="{row}">
                        <span>{{row.update_date | formatToDate}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="content"
                    label="内容"
                    sortable="custom"
                    min-width="150"
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
            </template>
        </list>
    </div>
</template>
<script>
import api from "@/api/sys/updateRecord";
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
            queryParams: {
                title: "",
                content: ""
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
        openDetails(row) {
            this.$refs.assetDetails.open().then(that => {
                that.initData(row);
            });
        },
        del(row) {
            let confirmText = "确定删除此更新记录吗？";
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