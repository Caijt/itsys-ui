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
        <divider title="供应商信息"></divider>
        <el-form
          :model="form"
          :rules="rules"
          ref="form"
          label-width="85px"
          size="mini"
          status-icon
          class="c-form-mini"
        >
          <el-form-item label="所属公司" prop="company_id">
            <el-select
              v-model="form.company_id"
              placeholder="选择供应商所属公司"
              filterable
              style="width: 100%"
              :loading="companyLoading"
            >
              <el-option
                v-for="item in companyList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                v-show="!item.is_disabled"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="简称" prop="name">
            <el-input v-model="form.name" placeholder="简单容易记住，一般不超过4个字"></el-input>
          </el-form-item>
          <el-form-item label="全称" prop="full_name">
            <el-input v-model="form.full_name" placeholder="供应商完整公司名称"></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="form.address" placeholder></el-input>
          </el-form-item>
          <el-form-item label="合作类型" prop="supplierTypeList">
            <el-checkbox-group v-model="form.supplierTypeList">
              <el-checkbox label="ASSET">资产供应商</el-checkbox>
              <el-checkbox label="CONTRACT">合同合作商</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="联系人" prop="contacts">
            <el-input
              type="textarea"
              autosize
              v-model="form.contacts"
              placeholder="供应合作商的联系人，可填写多个"
            ></el-input>
          </el-form-item>
          <el-form-item label="付款银行" prop="bank">
            <el-input type="textarea" autosize v-model="form.bank" placeholder="供应合作商的付款银行信息，可填写多个"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input type="textarea" autosize v-model="form.remarks" placeholder></el-input>
          </el-form-item>
          <el-form-item label="附件" prop="remarks">
            <attach-upload ref="attachUpload" :attach-guid="form.attach_guid" @uploaded="uploaded"></attach-upload>
            <attach-list ref="attachList" show-del></attach-list>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" v-loading="loading">
        <el-button type="primary" @click="save(0)" :loading="loading">保存</el-button>
        <el-button @click="show=false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import api from "@/api/it/supplier";
import companyApi from "@/api/sys/company";
import attachUpload from "@/components/common/attach/upload";
import attachList from "@/components/common/attach/textList";

const formInit = {
  id: 0,
  company_id: null,
  name: "",
  full_name: "",
  address: "",
  contacts: "",
  bank: "",
  remarks: "",
  supplier_type: "",
  supplierTypeList: [],
  attach_guid: null
};
export default {
  components: {
    attachUpload,
    attachList
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
        name: [{ required: true, message: "请填写供应商简称" }],
        full_name: [{ required: true, message: "请填写供应商完全名称" }],
        company_id: [{ required: true, message: "请选择所属公司" }]
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
      let title = "供应商信息";
      if (this.isEdit) {
        title += " [ 修改 ]";
      } else {
        title += " [ 新增 ]";
      }
      return title;
    }
  },
  mounted() {
    this.getCompanyList();
  },
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
      this.$refs.attachUpload.clear();
      this.$refs.attachList.clear();
    },
    getCompanyList() {
      this.companyLoading = true;
      companyApi.getList({ inUserCompany: true }).then(res => {
        this.companyList = res.data;
        this.companyLoading = false;
      });
    },
    create() {
      this.loading = true;
      this.$commonJs.newGuid().then(guid => {
        this.form.attach_guid = guid;
        this.loading = false;
      });
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
      this.$refs.attachList.initData({ attach_guid: data.attach_guid });
      this.clearValidate();
    },
    assign(data) {
      this.form = { ...this.form, ...data };
      if (this.form.supplier_type) {
        this.form.supplierTypeList = this.form.supplier_type.split(",");
      }
      return this;
    },
    save() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false;
        }
        this.form.supplier_type = this.form.supplierTypeList.join(",");
        this.form.action = status;
        this.loading = true;
        api
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
      this.form.supplierTypeList = [];
      this.clearValidate();
      return this;
    },
    openSelectDepDialog() {
      this.$refs.depDialog.open().then(that => {
        that.initData();
      });
    }
  }
};
</script>