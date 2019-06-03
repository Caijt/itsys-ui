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
                <divider title="付款记录"></divider>
                <el-form
                    :model="form"
                    :rules="rules"
                    ref="form"
                    label-width="85px"
                    size="mini"
                    status-icon
                    class="c-form-mini"
                >
                    <el-form-item label="付款金额" prop="pay_price">
                        <el-input v-model.number="form.pay_price" style="width:150px">
                            <span slot="prefix">￥</span>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="付款日期" prop="pay_date">
                        <el-date-picker
                            v-model="form.pay_date"
                            value-format="yyyy-MM-dd"
                            style="width:150px"
                        />
                    </el-form-item>
                    <el-form-item label="备注" prop="remarks">
                        <el-input type="textarea" v-model="form.remarks" placeholder></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" v-loading="loading">
                <el-button type="primary" @click="save" :loading="loading">保存</el-button>
                <el-button @click="show=false">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import api from "@/api/it/contractPayRecord";

const todayDate = new Date().toJSON().substr(0, 10);
const formInit = {
    id: 0,
    contract_id: null,
    pay_price: 0,
    pay_date: todayDate,
    remarks: ""
};
export default {
    components: {},
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
                pay_date: [{ required: true, message: "请填写付款日期" }],
                pay_price: [
                    { required: true, message: "请填写付款金额" },
                    { type: "number", message: "请输入数字" },
                    { validator: this.$commonJs.validateRules.et0 }
                ]
            },
            updated: false
        };
    },
    computed: {
        isEdit() {
            return this.form.id ? true : false;
        },
        title() {
            let title = "合同付款信息";
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
        getForm(id) {
            this.loading = true;
            api.getForm(id).then(res => {
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
        save() {
            this.$refs.form.validate(valid => {
                if (!valid) return false;
                api.save(this.form)
                    .then(res => {
                        if (!this.isEdit) {
                            this.form.id = res.data.id;
                        }
                        this.loading = false;
                        this.$message.success("保存成功");
                        this.updated = true;
                        this.show = false;
                    })
                    .catch(res => {
                        this.loading = false;
                        console.log(res);
                    });
            });
        },
        uploaded(res) {
            this.$refs.attachList.push(res);
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
        }
    }
};
</script>