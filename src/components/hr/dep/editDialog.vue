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
                <divider title="部门信息"></divider>
                <el-form
                    :model="form"
                    :rules="rules"
                    ref="form"
                    label-width="85px"
                    size="mini"
                    status-icon
                    class="c-form-mini"
                >
                    <el-form-item label="上级部门" prop="parent_id">
                        <select-input
                            ref="depSelectInput"
                            @click="openSelectDepDialog"
                            v-model="form.parent_id"
                        />
                    </el-form-item>
                    <el-form-item label="部门名称" prop="name">
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
        <dep-dialog :in-dialog="inDialog" ref="depDialog">
            <template slot="right" slot-scope="{node,data}">
                <el-button :disabled="isSelect(data)" type="text" @click="selectDep(data)">选择</el-button>
            </template>
        </dep-dialog>
    </div>
</template>
<script>
import depApi from "@/api/hr/dep";
import depDialog from "./treeDialog";
import selectInput from "@/components/common/selectInput";

const formInit = {
    id: 0,
    parent_id: null,
    name: "",
    order: 99,
    remarks: ""
};
export default {
    components: {
        depDialog,
        selectInput
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
                name: [{ required: true, message: "请填写部门名称" }],
                order: [{ type: "number", message: "请输入数字" }]
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
            let title = "部门信息";
            if (this.form.input_status >= 0) {
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
        create() {
            this.loading = true;
            return new Promise((resolve, reject) => {
                depApi.create().then(res => {
                    this.initData(res.data);
                    this.loading = false;
                    resolve();
                });
            });
        },
        getForm(id) {
            this.loading = true;
            depApi.getForm(id).then(res => {
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
            if (data.parent_dep) {
                this.$refs.depSelectInput.setName(data.parent_dep);
            }
            return this;
        },
        save() {
            this.$refs.form.validate(valid => {
                if (!valid) {
                    return false;
                }
                this.loading = true;
                depApi
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
        openSelectDepDialog() {
            this.$refs.depDialog.open().then(that => {
                that.initData();
            });
        },
        selectDep(data) {
            this.form.parent_id = data.id;
            this.$refs.depSelectInput.setName(data.name);
            this.$refs.depDialog.close();
        },
        clearParentDep() {
            this.form.parent_id = null;
            this.form.parent_dep = "";
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