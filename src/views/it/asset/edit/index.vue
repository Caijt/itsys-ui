<template>
    <div>
        <el-alert
            title="如果需查询某个部门或员工具体领用哪些资产，请到资产领用状态列表中进行查询"
            type="warning"
            show-icon
            style="margin-bottom:10px"
        >
            <div>
                <el-button
                    type="text"
                    size="mini"
                    @click="$router.push('/it/asset/query/useStatus')"
                >[ 资产领用状态列表 ]</el-button>
            </div>
        </el-alert>
        <div style="margin:10px 0px">
            <el-button-group>
                <el-button type="primary" @click="create" icon="el-icon-edit">资产录入</el-button>
                <el-button @click="printBatch" icon="el-icon-printer">打印标签</el-button>
                <el-button @click="openImportDialog">Excel导入</el-button>
            </el-button-group>
        </div>
        <el-tabs v-model="tabName" @tab-click="tabClick">
            <el-tab-pane label="全部" name="ALL"></el-tab-pane>
            <el-tab-pane label="闲置" name="FREE"></el-tab-pane>
            <el-tab-pane label="维修" name="REPAIR"></el-tab-pane>
            <el-tab-pane label="报废" name="SCRAP"></el-tab-pane>
        </el-tabs>
        <list ref="list" show-checkbox>
            <el-table-column slot="column" label="操作" fixed="right" align="center" width="100">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="edit(scope)"/>
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="del(scope)"/>
                    <el-dropdown style="margin-left:10px">
                        <el-button type="text" icon="el-icon-more"/>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="copy(scope)">复制</el-dropdown-item>
                            <el-dropdown-item @click.native="print(scope)">打印标签</el-dropdown-item>
                            <!-- <el-dropdown-item>领用交还</el-dropdown-item>
                            <el-dropdown-item>维修</el-dropdown-item>-->
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
        </list>
        <edit-dialog ref="editDialog" @updated="reload"></edit-dialog>
        <print-label ref="printLabel"/>
        <import-dialog ref="importDialog" @updated="reload"/>
    </div>
</template>

<script>
import list from "@/components/it/asset/list";
import editDialog from "@/components/it/asset/editDialog";
import printLabel from "@/components/it/asset/printLabel";
import importDialog from "@/components/it/asset/importDialog";

export default {
    components: {
        list,
        editDialog,
        printLabel,
        importDialog
    },
    data() {
        return {
            tabName: "ALL",
            toInvoiceProjectTotal: 0,
            toInvoiceProjectLoading: true,
            companyList: [],
            companyLoading: true
        };
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
        exportExcel() {
            this.$refs.list.exportExcel();
        },
        create() {
            this.$refs.editDialog.open().then(that => {
                that.create();
            });
        },
        edit({ row }) {
            this.$refs.editDialog.open().then(that => {
                that.initData(row);
            });
        },
        //删除
        del(scope) {
            this.$refs.list.del(scope);
        },
        reload() {
            this.$refs.list.reload();
        },
        print({ row }) {
            this.$refs.printLabel.open().then(that => {
                that.getData({ ids: row.id });
            });
        },
        printBatch() {
            let selectionList = this.$refs.list.getSelectionList();
            if (selectionList.length == 0) {
                this.$message.warning("未选择资产数据");
                return false;
            }
            let ids = selectionList.map(d => {
                return d.id;
            });
            this.$refs.printLabel.open().then(that => {
                that.getData({ ids });
            });
        },
        copy({ row }) {
            this.$refs.editDialog.open().then(that => {
                let copyData = this.$commonJs.obj.copyByKey(row, [
                    "model",
                    "company_id",
                    "type_id",
                    "type_name",
                    "supplier_id",
                    "stock_warning_name",
                    "stock_warning_id",
                    "supplier_name",
                    "buy_date",
                    "price",
                    "amount",
                    "sn",
                    "source",
                    "remarks"
                ]);
                that.assign(copyData).clearValidate();
                that.create();
            });
        },
        test2() {
            this.$refs.list.$refs.tableList.clearSelection();
        },
        openImportDialog() {
            this.$refs.importDialog.open();
        },
        tabClick() {
            let status = [];
            if (this.tabName != "ALL") {
                status = [this.tabName];
            }
            this.$refs.list.queryParams.abnormal_status = status;
            this.$refs.list.query();
        }
    }
};
</script>