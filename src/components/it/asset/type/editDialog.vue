<template>
    <div>
        <el-dialog
            :title="title"
            class="c-dialog-fixed"
            :visible.sync="show"
            :append-to-body="inDialog"
            @open="openDialog"
            @close="closeDialog"
        >
            <div v-loading="loading">
                <divider title="资产类型信息"></divider>
                <el-form
                    :model="form"
                    :rules="rules"
                    ref="form"
                    label-width="85px"
                    size="mini"
                    status-icon
                    class="c-form-mini"
                >
                    <el-form-item label="上级类型" prop="parent_id" :inline-message="true">
                        <el-input
                            v-model="form.parent_type"
                            placeholder="点击选择，为空则为顶级类型"
                            readonly
                            @click.native="openSelectTypeDialog"
                        >
                            <i
                                style="cursor: pointer;"
                                v-show="form.parent_id"
                                slot="suffix"
                                class="el-input__icon el-icon-close"
                                @click.stop="form.parent_type='';form.parent_id=null"
                            ></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="类型名称" prop="name">
                        <el-input v-model="form.name" placeholder></el-input>
                    </el-form-item>
                    <el-form-item label="排序" prop="order">
                        <el-input v-model.number="form.order" style="width: 30%"></el-input>
                        <span style="font-size: 12px">值越小排越前</span>
                    </el-form-item>
                    <el-form-item label="备注" prop="remarks">
                        <el-input v-model="form.remarks" placeholder></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" v-loading="loading">
                <el-button type="primary" @click="save(0)" :loading="loading">保存</el-button>
                <el-button @click="show=false">关 闭</el-button>
            </div>
        </el-dialog>
        <type-dialog :in-dialog="inDialog" ref="typeDialog">
            <template slot="right" slot-scope="{node,data}">
                <el-button :disabled="isSelect(data)" type="text" @click="selectType(data)">选择</el-button>
            </template>
        </type-dialog>
    </div>
</template>
<script>
import typeApi from "@/api/it/assetType";
import typeDialog from "./treeDialog";

const formInit = {
    id: 0,
    parent_id: null,
    order: 99,
    remarks: ""
};
export default {
    components: {
        typeDialog
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
                name: [{ required: true, message: "请填写类型名称" }],
                price: [{ type: "number", message: "请输入数字" }],
                amount: [
                    { required: true, message: "请填写资产数量" },
                    { validator: this.$commonJs.validateRules.et0 }
                ]
            },
            params: {
                no: null
            },
            updated: false,
            companyList: [],
            companyLoading: false
        };
    },
    computed: {
        isEdit() {
            return this.form.id ? true : false;
        },
        title() {
            let title = "资产类型信息";
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
                this.$emit("updated", this.form);
            }
            this.resetFields();
        },
        create() {},
        getForm(id) {
            this.loading = true;
            typeApi.getForm(id).then(res => {
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
        save(status = 0) {
            this.$refs.form.validate(valid => {
                if (!valid) {
                    return false;
                }
                this.loading = true;
                typeApi
                    .save(this.form)
                    .then(res => {
                        if (!this.isEdit) {
                            this.form.id = res.data.id;
                        }
                        this.loading = false;
                        this.$message.success("保存成功");
                        this.updated = true;
                    })
                    .catch(res => {
                        this.loading = false;
                        console.log(res);
                    });
            });
        },
        update() {},
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
        openSelectTypeDialog() {
            this.$refs.typeDialog.open().then(that => {
                that.initData();
            });
        },
        selectType(data) {
            this.form.parent_id = data.id;
            this.form.parent_type = data.name;
            this.$refs.typeDialog.close();
        },
        clearParentDep() {
            this.form.parent_id = null;
            this.form.parent_type = "";
        },
        isSelect(data) {
            let parentIds = (data.parent_ids || "").split(",");
            return (
                data.id == this.form.id ||
                parentIds.indexOf(this.form.id.toString()) >= 0
            );
        }
    }
};
</script>