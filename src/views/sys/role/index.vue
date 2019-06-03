<template>
    <div>
        <div style="margin:10px 0px">
            <el-button-group>
                <el-button type="primary" @click="create" icon="el-icon-edit">创建角色</el-button>
            </el-button-group>
        </div>
        <list ref="list">
            <el-table-column slot="column" label="操作" fixed="right" align="center" width="70">
                <template slot-scope="{row}">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="edit(row)"/>
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="del(row)"/>
                </template>
            </el-table-column>
        </list>
        <edit-dialog ref="editDialog" @updated="reload"></edit-dialog>
    </div>
</template>

<script>
import list from "@/components/sys/role/list";
import editDialog from "@/components/sys/role/editDialog";

export default {
    components: {
        list,
        editDialog
    },
    data() {
        return {};
    },
    computed: {
        //表单是否是编辑状态
        isFormEdit() {
            return this.form.id != null;
        }
    },
    mounted() {
        this.reload();
    },
    methods: {
        reload() {
            this.$refs.list.reload();
        },
        create() {
            this.$refs.editDialog.open().then(that => {});
        },
        edit(row) {
            if (row.id == -1) {
                this.$message.error("该角色为系统超级角色，禁止修改！");
                return false;
            }
            this.$refs.editDialog.open().then(that => {
                that.initData(row);
            });
        },
        //删除
        del(row) {
            this.$refs.list.del(row);
        }
    }
};
</script>