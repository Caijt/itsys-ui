<!-- 
此组件初始化时不会自动加载数据，请在mounted中 this.$refs.[].initData()
如果放在dialog里面的吗，请在dialog的open事件中用this.$nextTick进行加载
 -->
<template>
    <div>
        <list
            row-key="id"
            ref="list"
            hide-export-button
            hide-more-button
            :hide-query="hideQuery"
            :data-api="dataApi"
            :show-checkbox="showCheckbox"
            :query-params="queryParams"
        >
            <div slot="query">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="queryParams.name" clearable></el-input>
                </el-form-item>
                <el-form-item label="角色说明" prop="remarks">
                    <el-input v-model="queryParams.remarks" clearable></el-input>
                </el-form-item>
            </div>
            <template slot="column">
                <el-table-column prop="name" label="角色名称" min-width="120" show-overflow-tooltip/>
                <el-table-column prop="remarks" label="角色说明" min-width="120" show-overflow-tooltip/>
                <el-table-column
                    prop="factory_names"
                    label="菜单权限"
                    align="center"
                    sortable="custom"
                    width="95"
                    show-overflow-tooltip
                >
                    <template slot-scope="{row}">
                        <span class="c-link" @click="openMenuDialog(row)">查看</span>
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
        <menu-dialog :in-dialog="inDialog" ref="menuDialog"/>
    </div>
</template>
<script>
import api from "@/api/sys/role";
import menuDialog from "@/components/sys/menu/treeDialog";
import list from "@/components/common/list";

export default {
    components: { menuDialog, list },
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
				name:"",
				remarks:""
            },
            dataApi: api.getPageList
        };
    },
    methods: {
        reload() {
            this.$refs.list.getData();
        },
        //初始化数据
        initData(params = {}) {
            this.$refs.list.initData(params);
        },        
        openDetails(row) {
            this.$refs.assetDetails.open().then(that => {
                that.initData(row);
            });
        },        
        del(row) {
            if (row.id == -1) {
                this.$message.error("该角色为系统超级角色，禁止删除！");
                return false;
            }
            let confirmText = "确定删除此角色吗？";
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
        getMenuCount(menu_ids) {
            if (menu_ids) {
                return menu_ids.split(",").length;
            } else {
                return 0;
            }
        },
        openMenuDialog(row) {
            this.$refs.menuDialog.open().then(that => {
                that.initData({ role_id: row.id });
            });
        }
    }
};
</script>