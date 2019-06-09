<!-- 
此组件初始化时不会自动加载数据，请在mounted中 this.$refs.[].initData()
如果放在dialog里面的吗，请在dialog的open事件中用this.$nextTick进行加载
 -->
<template>
    <div>
        <list
            ref="list"
            hide-export-button
            show-summary
            :query-params="queryParams"
            :show-query-more="showQueryMore"
            :data-api="dataApi"
            :no-page="noPage"
            :hide-query="hideQuery"
            @loaded="$emit('loaded',$event)"
        >
            <div slot="query">
                <el-form-item label="合同编号" prop="no">
                    <el-input v-model.trim="queryParams.no" clearable></el-input>
                </el-form-item>
                <el-form-item label="合同名称" prop="name">
                    <el-input v-model.trim="queryParams.name" clearable></el-input>
                </el-form-item>
            </div>
            <div slot="query-more">
                <el-form-item label="供应商" prop="supplier_name">
                    <el-input v-model.trim="queryParams.supplier_name" clearable></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remarks">
                    <el-input v-model.trim="queryParams.remarks" clearable></el-input>
                </el-form-item>
                <el-form-item label="合同金额">
                    <el-row style="width:300px">
                        <el-col :span="11">
                            <el-form-item prop="price_begin">
                                <el-input
                                    v-model.trim="queryParams.price_begin"
                                    placeholder="最小值"
                                    clearable
                                >
                                    <span slot="prefix">￥</span>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2">至</el-col>
                        <el-col :span="11">
                            <el-form-item prop="price_end">
                                <el-input
                                    v-model.trim="queryParams.price_end"
                                    placeholder="最小值"
                                    clearable
                                >
                                    <span slot="prefix">￥</span>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="签订日期">
                    <el-row style="width:300px">
                        <el-col :span="11">
                            <el-form-item prop="sign_date_begin">
                                <el-date-picker
                                    v-model.trim="queryParams.sign_date_begin"
                                    placeholder="开始日期"
                                    value-format="yyyy-MM-dd"
                                    style="width: 100%"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2">至</el-col>
                        <el-col :span="11">
                            <el-form-item prop="sign_date_end">
                                <el-date-picker
                                    v-model.trim="queryParams.sign_date_end"
                                    placeholder="结束日期"
                                    value-format="yyyy-MM-dd"
                                    style="width: 100%"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="生效日期">
                    <el-row style="width:300px">
                        <el-col :span="11">
                            <el-form-item prop="begin_date_begin">
                                <el-date-picker
                                    v-model.trim="queryParams.begin_date_begin"
                                    placeholder="开始日期"
                                    value-format="yyyy-MM-dd"
                                    style="width: 100%"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2">至</el-col>
                        <el-col :span="11">
                            <el-form-item prop="begin_date_end">
                                <el-date-picker
                                    v-model.trim="queryParams.begin_date_end"
                                    placeholder="结束日期"
                                    value-format="yyyy-MM-dd"
                                    style="width: 100%"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="失效日期">
                    <el-row style="width:300px">
                        <el-col :span="11">
                            <el-form-item prop="end_date_begin">
                                <el-date-picker
                                    v-model.trim="queryParams.end_date_begin"
                                    placeholder="开始日期"
                                    value-format="yyyy-MM-dd"
                                    style="width: 100%"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2">至</el-col>
                        <el-col :span="11">
                            <el-form-item prop="end_date_end">
                                <el-date-picker
                                    v-model.trim="queryParams.end_date_end"
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
                <el-table-column prop="no" label="合同编号" width="110" show-overflow-tooltip>
                    <template slot-scope="{row}">
                        <span class="c-link" @click="openDetails(row)">{{row.no}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="合同名称" min-width="120" show-overflow-tooltip/>
                <el-table-column
                    prop="supplier_name"
                    label="供应合作商"
                    min-width="120"
                    show-overflow-tooltip
                >
                    <template slot-scope="{row}">
                        <span class="c-link" @click="openSupplierDetails(row)">{{row.supplier_name}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="price"
                    label="合同金额"
                    sortable="custom"
                    width="100"
                    align="right"
                >
                    <template slot-scope="{row}">
                        <span>￥{{ row.price }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="pay_price_total"
                    label="已付金额"
                    sortable="custom"
                    width="100"
                    align="right"
                >
                    <template slot-scope="{row}">
                        <span>￥{{ row.pay_price_total }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="unpay"
                    label="未付金额"
                    sortable="custom"
                    width="100"
                    align="right"
                >
                    <template slot-scope="{row}">
                        <span>￥{{ row.unpay }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="last_pay_date" label="近期付款日期" sortable="custom" width="120">
                    <template slot-scope="{row}">{{row.last_pay_date|formatToDate}}</template>
                </el-table-column>
                <el-table-column
                    prop="pay_progress"
                    label="付款进度"
                    sortable="custom"
                    width="120"
                    align="right"
                >
                    <template slot-scope="{row}">
                        <el-tooltip
                            placement="left"
                            :content="'￥'+row.pay_price_total+'（已付金额） / ￥'+row.price+'（合同金额）'"
                        >
                            <el-progress
                                text-inside
                                :stroke-width="16"
                                :status="row.pay_progress>=100?'success':undefined"
                                :percentage="row.pay_progress>=100?100:row.pay_progress"
                            ></el-progress>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="sign_date" label="签订日期" sortable="custom" width="100">
                    <template slot-scope="{row}">{{row.sign_date | formatToDate }}</template>
                </el-table-column>
                <el-table-column prop="begin_date" label="生效日期" sortable="custom" width="100">
                    <template slot-scope="{row}">{{row.begin_date | formatToDate }}</template>
                </el-table-column>
                <el-table-column prop="end_date" label="失效日期" sortable="custom" width="100">
                    <template slot-scope="{row}">{{row.end_date | formatToDate }}</template>
                </el-table-column>
                <el-table-column prop="is_remind" label="失效提醒" align="center" width="80">
                    <template slot-scope="{row}">
                        <el-tag v-if="row.is_remind" type="success">是</el-tag>
                        <el-tag v-else type="info">否</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="remarks" label="备注" min-width="120" show-overflow-tooltip/>
                <el-table-column
                    prop="company_name"
                    label="合同所属公司"
                    min-width="120"
                    show-overflow-tooltip
                />
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
import api from "@/api/it/contract";
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
        }
    },
    data() {
        return {
            queryParams: {
                no: "", //
                name: "",
                supplier_name: "",
                remarks: "",
                price_begin: "",
                price_end: "",
                sign_date_begin: "",
                sign_date_end: "",
                begin_date_begin: "",
                begin_date_end: "",
                end_date_begin: "",
                end_date_end: ""
            },
            dataApi: api.getPageListWithSummary
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
        openDetails(row) {
            this.$refs.contractDetails.open().then(that => {
                that.getDetails(row.id);
            });
        },
        clear() {
            this.$refs.list.clear();
        },
        del(row) {
            let confirmText = "确定删除此合同吗？";
            this.$confirm(confirmText, "提示", {
                type: "warning"
            }).then(() => {
                contractApi.del(row.id).then(res => {
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