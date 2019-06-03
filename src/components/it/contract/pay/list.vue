<!-- 
此组件初始化时不会自动加载数据，请在mounted中 this.$refs.[].initData()
如果放在dialog里面的吗，请在dialog的open事件中用this.$nextTick进行加载
 -->
<template>
    <div>
        <list
            ref="list"
            hide-export-button
            :query-params="queryParams"
            :data-api="dataApi"
            :hide-query="hideQuery"
            :show-query-more="showQueryMore"
        >
            <div slot="query">
                <el-form-item label="合同编号" prop="contract_no">
                    <el-input v-model.trim="queryParams.contract_no" clearable></el-input>
                </el-form-item>
                <el-form-item label="合同名称" prop="contract_name">
                    <el-input v-model.trim="queryParams.contract_name" clearable></el-input>
                </el-form-item>
            </div>
            <div slot="query-more">
                <el-form-item label="供应商" prop="supplier_name">
                    <el-input v-model.trim="queryParams.supplier_name" clearable></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remarks">
                    <el-input v-model.trim="queryParams.remarks" clearable></el-input>
                </el-form-item>
                <el-form-item label="付款金额">
                    <el-row style="width:300px">
                        <el-col :span="11">
                            <el-form-item prop="pay_price_begin">
                                <el-input
                                    v-model.trim="queryParams.pay_price_begin"
                                    placeholder="最小值"
                                    clearable
                                >
                                    <span slot="prefix">￥</span>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2">至</el-col>
                        <el-col :span="11">
                            <el-form-item prop="pay_price_end">
                                <el-input
                                    v-model.trim="queryParams.pay_price_end"
                                    placeholder="最小值"
                                    clearable
                                >
                                    <span slot="prefix">￥</span>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="付款日期">
                    <el-row style="width:300px">
                        <el-col :span="11">
                            <el-form-item prop="pay_date_begin">
                                <el-date-picker
                                    v-model.trim="queryParams.pay_date_begin"
                                    placeholder="开始日期"
                                    value-format="yyyy-MM-dd"
                                    style="width: 100%"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2">至</el-col>
                        <el-col :span="11">
                            <el-form-item prop="pay_date_end">
                                <el-date-picker
                                    v-model.trim="queryParams.pay_date_end"
                                    placeholder="结束日期"
                                    value-format="yyyy-MM-dd"
                                    style="width: 100%"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
            </div>
            <template slot="column">
                <el-table-column
                    v-if="!hideContractFields"
                    prop="contract_no"
                    label="合同编号"
                    width="110"
                    show-overflow-tooltip
                >
                    <template slot-scope="{row}">
                        <span class="c-link" @click="openContractDetails(row)">{{row.contract_no}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="!hideContractFields"
                    prop="contract_name"
                    label="合同名称"
                    min-width="120"
                    show-overflow-tooltip
                />
                <el-table-column
                    v-if="!hideContractFields"
                    prop="supplier_name"
                    label="供应合作商"
                    min-width="120"
                    show-overflow-tooltip
                >
                    <template slot-scope="{row}">
                        <span class="c-link" @click="openSupplierDetails(row)">{{row.supplier_name}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="pay_date" label="付款日期" sortable="custom" width="100">
                    <template slot-scope="{row}">{{ row.pay_date|formatToDate }}</template>
                </el-table-column>
                <el-table-column
                    prop="pay_price"
                    label="付款金额"
                    sortable="custom"
                    width="100"
                    align="right"
                >
                    <template slot-scope="{row}">
                        <span>￥{{ row.pay_price }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="remarks" label="备注" min-width="120" show-overflow-tooltip/>
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
                <!--/ slot[column]-->
            </template>
        </list>
        <contract-details :in-dialog="inDialog" ref="contractDetails"/>
        <supplier-details :in-dialog="inDialog" ref="supplierDetails"/>
    </div>
</template>
<script>
import api from "@/api/it/contractPayRecord";
import contractDetails from "@/components/it/contract/details";
import supplierDetails from "@/components/it/supplier/details";
import list from "@/components/common/list";

export default {
    components: { contractDetails, supplierDetails, list },
    props: {
        inDialog: {
            type: Boolean,
            default: false
        },
        hideQuery: {
            type: Boolean,
            default: false
        },
        noPage: {
            type: Boolean,
            default: false
        },
        showQueryMore: {
            type: Boolean,
            default: false
        },
        showCheckbox: {
            type: Boolean,
            default: false
        },
        hideContractFields: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            queryParams: {
                contract_no: "", //
                contract_name: "",
                supplier_name: "",
                remarks: "",
                pay_price_begin: "",
                pay_price_end: "",
                pay_date_begin: "",
                pay_date_end: ""
            },
            dataApi: this.noPage ? api.getList : api.getPageList
        };
    },
    methods: {
        //初始化数据
        initData(params) {
            this.$refs.list.initData(params);
        },
        //刷新数据
        reload() {
            this.$refs.list.getData();
        },
        openContractDetails(row) {
            this.$refs.contractDetails.open().then(that => {
                that.getDetails(row.id);
            });
        },
        clear() {
            this.$refs.list.clear();
        },
        del(row) {
            let confirmText = "确定删除此付款记录吗？";
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
        openSupplierDetails(row) {
            this.$refs.supplierDetails.open().then(that => {
                that.getDetails(row.supplier_id);
            });
        }
    }
};
</script>