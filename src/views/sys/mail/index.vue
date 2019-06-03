<template>
    <div>
        <div style="margin:10px 0px">
            <el-button-group>
                <el-button type="primary" @click="openMailDialog" icon="el-icon-edit">邮箱配置</el-button>
            </el-button-group>
        </div>
        <list ref="list">
            <el-table-column slot="column" label="操作" fixed="right" align="center" width="70">
                <template slot-scope="{row}">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="edit(row)"/>
                </template>
            </el-table-column>
        </list>
        <edit-dialog ref="editDialog" @updated="reload"></edit-dialog>
        <mail-edit-dialog ref="mailEditDialog"></mail-edit-dialog>
    </div>
</template>

<script>
import list from "@/components/sys/mail/list";
import editDialog from "@/components/sys/mail/editDialog";
import mailEditDialog from "@/components/sys/mail/mailEditDialog";

export default {
    components: {
        list,
        editDialog,
        mailEditDialog
    },
    data() {
        return {};
    },
    mounted() {
		this.reload()
	},
    methods: {        
        edit(row) {
            this.$refs.editDialog.open().then(that => {
                that.initData(row);
            });
        },
        //删除
        del(row) {
            this.$refs.list.del(row);
        },
        reload() {
            this.$refs.list.reload();
        },        
        openMailDialog() {
            this.$refs.mailEditDialog.open().then(that => {
                that.getData("DEFAULT");
            });
        }
    }
};
</script>