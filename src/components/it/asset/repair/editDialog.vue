<template>
    <div>
        <el-dialog
            :title="title"
            class="c-dialog-fixed"
            :visible.sync="show"
            :append-to-body="inDialog"
            width="80%"
            @open="openDialog"
            @close="closeDialog"
        >
            <div v-loading="loading">
                <divider title="维修信息"></divider>
                <el-form
                    :model="form"
                    :rules="rules"
                    ref="form"
                    label-width="100px"
                    size="mini"
                    status-icon
                    class="c-form-mini"
                >
                    <el-form-item label="维修资产" prop="asset_id" :inline-message="true">
                        <el-button
                            type="primary"
                            :disabled="isEdit"
                            @click="openSelectAssetDialog"
                        >{{ form.asset_id?('['+form.asset_no+'] '+form.asset_model):'选择IT资产'}}</el-button>
                    </el-form-item>
                    <el-row :gutter="10">
                        <el-col :span="8">
                            <el-form-item label="维修日期" prop="repair_date">
                                <el-date-picker
                                    v-model="form.repair_date"
                                    value-format="yyyy-MM-dd"
                                    style="width: 100%"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="维修供应商" prop="supplier_id">
                        <el-input
                            v-model="form.supplier_name"
                            placeholder="点击选择"
                            readonly
                            @click.native="openSelectSupplierDialog"
                        >
                            <i
                                style="cursor: pointer;"
                                v-show="form.supplier_id"
                                slot="suffix"
                                class="el-input__icon el-icon-close"
                                @click.stop="form.supplier_name='';form.supplier_id=null"
                            ></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="故障描述" prop="reason">
                        <el-input type="textarea" v-model="form.reason" placeholder></el-input>
                    </el-form-item>
                    <el-form-item label="维修状态" prop="is_finish">
                        <el-radio-group v-model="form.is_finish">
                            <el-radio :label="false">维修中</el-radio>
                            <el-radio :label="true">已完成</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <div v-if="form.is_finish">
                        <el-row :gutter="10">
                            <el-col :span="8">
                                <el-form-item label="完成日期" prop="finish_date">
                                    <el-date-picker
                                        v-model="form.finish_date"
                                        value-format="yyyy-MM-dd"
                                        style="width: 100%"
                                    />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="维修金额" prop="price">
                                    <el-input v-model.number="form.price" placeholder>
                                        <span slot="prefix">￥</span>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="维修内容" prop="content">
                            <el-input type="textarea" v-model="form.content" placeholder></el-input>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <div slot="footer" v-loading="loading">
                <el-button type="primary" @click="save(0)" :loading="loading">保存</el-button>
                <el-button @click="show=false">关 闭</el-button>
            </div>
        </el-dialog>
        <asset-list-dialog :params="{isRepair:0}" :in-dialog="inDialog" ref="assetListDialog">
            <el-table-column slot="column" fixed="right" width="60" align="center" label="操作">
                <template slot-scope="{row}">
                    <el-button type="text" @click="selectAsset(row)">选择</el-button>
                </template>
            </el-table-column>
        </asset-list-dialog>
        <supplier-dialog
            :in-dialog="inDialog"
            show-select
            ref="supplierDialog"
            @select="selectSupplier"
        />
    </div>
</template>
<script>
import assetRepairRecordApi from "@/api/it/assetRepairRecord";
import assetListDialog from "../listDialog";
import supplierDialog from "@/components/it/supplier/listDialog";
const todayDate = new Date().toJSON().substr(0, 10);
const formInit = {
    id: 0,
    model: "",
    asset_id: null,
    repair_date: todayDate,
    price: 0,
    is_finish: false,
    supplier_id: null,
    supplier_name: ""
};
export default {
    components: {
        assetListDialog,
        supplierDialog
    },
    props: {
        inDialog: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            resolve: null,
            show: false,
            loading: false,
            updated: false,
            data: {},
            form: { ...formInit },
            rules: {
                asset_id: [{ required: true, message: "请选择维修资产" }],
                supplier_name: [
                    { required: true, message: "请选择维修供应商" }
                ],
                repair_date: [{ required: true, message: "请填写维修日期" }],
                finish_date: [{ required: true, message: "请填写完成日期" }],
                price: [
                    { required: true, message: "请填写维修花费的金额" },
                    { type: "number", message: "请输入数字" }
                ]
            },
            params: {
                no: null
            },
            updated: false,
            companyList: [],
            companyLoading: false,
            attachParams: {
                table_name: "it_asset",
                table_id: null
            }
        };
    },
    computed: {
        isEdit() {
            return this.form.id ? true : false;
        },
        title() {
            let title = "IT资产维修记录";
            if (this.isEdit) {
                title += " [ 修改 ]";
            } else {
                title += " [ 新增 ]";
            }
            return title;
        }
    },
    mounted() {},
    methods: {
        openDialog() {
            this.$nextTick(() => {
                if (this.resolve) {
                    this.resolve(this);
                }
            });
        },
        open() {
            this.show = true;
            return new Promise((resolve, reject) => {
                this.resolve = resolve;
            });
        },
        closeDialog() {
            if (this.updated) {
                this.$emit("updated");
            }
            this.resetFields();
        },
        create() {},
        getForm(id) {
            this.loading = true;
            assetRepairRecordApi.getForm(id).then(res => {
                this.initData(res.data);
                this.loading = false;
            });
        },
        initData(data) {
            this.assign(data);
            this.clearValidate();
        },
        assign(data) {
            this.form = { ...this.form, ...data };
            return this;
        },
        save(action = 0) {
            this.$refs.form.validate(valid => {
                if (!valid) {
                    return false;
                }
                this.loading = true;
                if (!this.form.is_finish) {
                    this.form.finish_date = null;
                    this.form.content = "";
                    this.form.price = 0;
                }
                assetRepairRecordApi
                    .save(this.form)
                    .then(res => {
                        this.loading = false;
                        this.$message.success("保存成功");
                        this.updated = true;
                        if (this.form.action == 1) {
                            this.show = false;
                        }
                    })
                    .catch(res => {
                        this.loading = false;
                        console.log(res);
                    });
            });
        },
        clearValidate() {
            this.$nextTick(() => {
                this.$refs.form && this.$refs.form.clearValidate();
            });
        },
        resetFields() {
            this.updated = false;
            this.form = { ...formInit };
            this.clearValidate();
            return this;
        },
        openSelectAssetDialog() {
            this.$refs.assetListDialog.open().then(that => {
                that.$refs.list.initData();
            });
        },
        selectAsset(row) {
            this.form.asset_id = row.id;
            this.form.asset_model = row.model;
            this.form.asset_no = row.no;
            this.$refs.assetListDialog.close();
        },
        openSelectSupplierDialog() {
            this.$refs.supplierDialog.open().then(that => {
                that.initData({
                    supplier_type: "ASSET"
                });
            });
        },
        selectSupplier(row) {
            this.form.supplier_id = row.id;
            this.form.supplier_name = row.name;
            this.$refs.supplierDialog.close();
        }
    }
};
</script>