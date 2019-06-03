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
            no-page
            :data-api="dataApi"
            :query-params="queryParams"
        >
            <div slot="query">
                <el-form-item label="通知事件" prop="name">
                    <el-input v-model="queryParams.name" clearable></el-input>
                </el-form-item>
            </div>
            <template slot="column">
                <el-table-column prop="name" label="邮件通知事件" width="220" show-overflow-tooltip/>
                <el-table-column prop="is_disabled" align="center" label="状态" width="80">
                    <template slot-scope="{row}">
                        <el-tag type="success" v-if="row.is_disabled==0">启用</el-tag>
                        <el-tag type="info" v-else>禁用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="title_template"
                    label="标题模版"
                    width="150"
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="content_template"
                    label="内容模版"
                    min-width="100"
                    show-overflow-tooltip
                />
                <!-- slot[column] -->
                <slot name="column"></slot>
            </template>
        </list>
    </div>
</template>
<script>
import api from "@/api/sys/mail";
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
                name: ""
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
        }
    }
};
</script>