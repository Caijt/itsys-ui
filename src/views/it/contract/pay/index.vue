<template>
    <div>
        <el-tabs v-model="tabName">
            <el-tab-pane label="待付款合同" name="toPay">
                <contract-list ref="contractList" hide-edit-field>
                    <el-table-column
                        slot="column"
                        label="操作"
                        fixed="right"
                        align="center"
                        width="90"
                    >
                        <template slot-scope="{row}">
                            <el-button size="mini" type="text" @click="create(row)">付款</el-button>
                            <el-button size="mini" type="text" @click="openPayRecordDialog(row)">记录</el-button>
                        </template>
                    </el-table-column>
                </contract-list>
            </el-tab-pane>
        </el-tabs>
        <edit-dialog ref="editDialog" @updated="reload"/>
        <pay-list-dialog hide-contract-fields ref="payListDialog" @del="reload">
            <el-table-column slot="column" label="操作" align="center" width="60" fixed="right">
                <template slot-scope="{row}">
                    <el-button type="text" icon="el-icon-edit" @click="edit(row)"></el-button>
                    <el-button type="text" icon="el-icon-delete" @click="del(row)"></el-button>
                </template>
            </el-table-column>
        </pay-list-dialog>
    </div>
</template>
<script>
import contractList from "@/components/it/contract/list";
import editDialog from "@/components/it/contract/pay/editDialog";
import payListDialog from "@/components/it/contract/pay/listDialog";

export default {
    components: {
        contractList,
        editDialog,
        payListDialog
    },
    data() {
        return {
            tabName: "toPay"
        };
    },
    mounted() {
        this.$refs.contractList.initData({ toPay: true });
    },
    methods: {
        reload() {
            this.$refs.contractList.reload();
            if (this.$refs.payListDialog.show) {
                this.$refs.payListDialog.reload();
            }
        },
        create(row) {
            this.$refs.editDialog.open().then(that => {
                that.assign({ contract_id: row.id });
            });
        },
        edit(row) {
            this.$refs.editDialog.open().then(that => {
                that.initData(row);
            });
        },
        del(row) {
            this.$refs.payListDialog.$refs.list.del(row);
        },
        openPayRecordDialog(row) {
            this.$refs.payListDialog.open().then(that => {
                that.initData({ contract_id: row.id });
            });
        }
    }
};
</script>