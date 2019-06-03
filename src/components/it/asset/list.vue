<!-- 
此组件初始化时不会自动加载数据，请在mounted中 this.$refs.[].initData()
如果放在dialog里面的吗，请在dialog的open事件中用this.$nextTick进行加载
 -->
<template>
    <div>
        <list
            row-key="id"
            ref="list"
            :hide-query="hideQuery"
            :show-checkbox="showCheckbox"
            :data-api="dataApi"
            :query-params="queryParams"
            :show-query-more="showQueryMore"
            show-summary
            :no-page="noPage"
            @export-excel="exportExcel"
            @loaded="$emit('loaded',$event)"
        >
            <div slot="query">
                <el-form-item label="资产编号" prop="no">
                    <el-input v-model.trim="queryParams.no" clearable></el-input>
                </el-form-item>
                <el-form-item label="资产型号" prop="model">
                    <el-input v-model.trim="queryParams.model" clearable></el-input>
                </el-form-item>
            </div>
            <div slot="query-more">
                <el-form-item label="资产状态" prop="abnormal_status">
                    <el-select
                        v-model="queryParams.abnormal_status"
                        collapse-tags
                        multiple
                        clearable
                    >
                        <el-option value="FREE" label="闲置"></el-option>
                        <el-option value="REPAIR" label="维修"></el-option>
                        <el-option value="SCRAP" label="报废"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标识号" prop="diy_no">
                    <el-input v-model.trim="queryParams.diy_no" clearable></el-input>
                </el-form-item>
                <el-form-item label="资产类型" prop="type_id">
                    <select-input
                        ref="typeSelectInput"
                        @click="openSelectTypeDialog"
                        v-model="queryParams.type_id"
                    />
                </el-form-item>
                <el-form-item label="子类型" prop="hasSubType">
                    <el-switch v-model="queryParams.hasSubType"/>
                </el-form-item>
                <el-form-item label="备注" prop="remarks">
                    <el-input v-model.trim="queryParams.remarks" clearable></el-input>
                </el-form-item>
                <el-form-item label="来源方式" prop="source">
                    <el-input v-model.trim="queryParams.source" clearable></el-input>
                </el-form-item>
                <el-form-item label="序列号" prop="sn">
                    <el-input v-model.trim="queryParams.sn" clearable></el-input>
                </el-form-item>
                <el-form-item label="供应商" prop="supplier_name">
                    <el-input v-model.trim="queryParams.supplier_name" clearable></el-input>
                </el-form-item>
                <el-form-item label="所属公司" prop="company_ids">
                    <el-select
                        v-model="queryParams.company_ids"
                        placeholder="选择资产所属公司"
                        multiple
                        collapse-tags
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
                <el-form-item label="领用部门" prop="dep_id">
                    <select-input
                        ref="depSelectInput"
                        @click="openSelectDepDialog"
                        v-model="queryParams.dep_id"
                    />
                </el-form-item>
                <el-form-item label="子部门" prop="hasSubDep">
                    <el-switch v-model="queryParams.hasSubDep"></el-switch>
                </el-form-item>
                <el-form-item label="领用员工" prop="employee_name">
                    <el-input v-model.trim="queryParams.employee_name" clearable></el-input>
                </el-form-item>
                <el-form-item label="入库日期">
                    <el-row style="width:300px">
                        <el-col :span="11">
                            <el-form-item prop="inbound_date_begin">
                                <el-date-picker
                                    v-model.trim="queryParams.inbound_date_begin"
                                    placeholder="开始日期"
                                    value-format="yyyy-MM-dd"
                                    style="width: 100%"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2">至</el-col>
                        <el-col :span="11">
                            <el-form-item prop="inbound_date_end">
                                <el-date-picker
                                    v-model.trim="queryParams.inbound_date_end"
                                    placeholder="结束日期"
                                    value-format="yyyy-MM-dd"
                                    style="width: 100%"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="资产价格">
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
            </div>
            <template slot="column">
                <el-table-column prop="no" label="资产编号" sortable="custom" width="100">
                    <template slot-scope="{row}">
                        <span class="c-link" @click="openDetails(row)">{{row.no}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="异常状态" align="center" width="100">
                    <template slot-scope="{row}">
                        <status-tag :asset="row"/>
                    </template>
                </el-table-column>
                <el-table-column prop="model" min-width="150" label="资产型号" show-overflow-tooltip/>
                <el-table-column prop="type_name" width="100" label="资产类型" show-overflow-tooltip/>
                <el-table-column prop="diy_no" width="100" label="标识号" show-overflow-tooltip/>
                <el-table-column prop="inbound_date" label="入库日期" sortable="custom" width="100">
                    <template slot-scope="{row}">{{row.inbound_date | formatToDate}}</template>
                </el-table-column>
                <el-table-column
                    prop="remain"
                    label="库存量"
                    align="right"
                    sortable="custom"
                    width="100"
                >
                    <template slot-scope="{row}">
                        <el-tooltip placement="top">
                            <div slot="content">
                                库存量：{{row.remain}}
                                <br>
                                可用量：{{row.avaiable_amount}}
                                <br>
                                入库量：{{row.amount}}
                            </div>
                            <span
                                class="c-link"
                                @click="openUseStatusDialog(row)"
                            >{{row.remain}} / {{row.avaiable_amount}} / {{row.amount}}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="use_dep_employee"
                    label="近期领用人"
                    sortable="custom"
                    width="120"
                    show-overflow-tooltip
                >
                    <template slot-scope="{row}">
                        <span>{{row.use_dep_name}} / {{row.use_employee_name}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="supplier_name" label="供应商" width="100" show-overflow-tooltip>
                    <template slot-scope="{row}">
                        <span class="c-link" @click="openSupplierDetails(row)">{{row.supplier_name}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="price"
                    label="金额"
                    sortable="custom"
                    width="100"
                    align="right"
                >
                    <template slot-scope="{row}">
                        <span>￥{{ row.price }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="source" label="来源方式" width="100" show-overflow-tooltip/>
                <el-table-column
                    prop="stock_warning_name"
                    label="库存种类"
                    sortable="custom"
                    width="100"
                    show-overflow-tooltip
                />
                <el-table-column prop="sn" label="序列号" width="100" show-overflow-tooltip/>
                <el-table-column prop="remarks" label="备注" width="120" show-overflow-tooltip/>
                <el-table-column
                    prop="company_name"
                    min-width="120"
                    label="资产所属公司"
                    show-overflow-tooltip
                />
                <el-table-column prop="create_user_name" label="录入员"/>
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
        <asset-details :in-dialog="inDialog" ref="assetDetails"/>
        <asset-use-status-dialog
            :in-dialog="inDialog"
            hide-asset-fields
            ref="assetUseStatusDialog"
        />
        <type-dialog :in-dialog="inDialog" ref="typeDialog" show-select @select="selectType"/>
        <supplier-details :in-dialog="inDialog" ref="supplierDetails"/>
        <dep-dialog :in-dialog="inDialog" ref="depDialog" show-select @select="selectDep"/>
    </div>
</template>
<script>
import list from "@/components/common/list";
import api from "@/api/it/asset";
import companyApi from "@/api/sys/company";
import assetDetails from "@/components/it/asset/details";
import assetUseStatusDialog from "./useStatus/listDialog";
import statusTag from "./statusTag";
import typeDialog from "./type/treeDialog";
import supplierDetails from "@/components/it/supplier/details";
import depDialog from "@/components/hr/dep/treeDialog";
import selectInput from "@/components/common/selectInput";

export default {
    components: {
        list,
        assetDetails,
        assetUseStatusDialog,
        statusTag,
        typeDialog,
        supplierDetails,
        depDialog,
        selectInput
    },
    props: {
        inDialog: {
            type: Boolean,
            default: false
        },
        hideQuery: {
            type: Boolean,
            default: false
        },
        showCheckbox: {
            type: Boolean,
            default: false
        },
        showQueryMore: {
            type: Boolean,
            default: false
        },
        noPage: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            companyList: [],
            companyLoading: true,
            //查询条件字段
            queryParams: {
                no: "",
                model: "",
                abnormal_status: [],
                diy_no: "",
                type_id: "",
                hasSubType: false,
                remarks: "",
                source: "",
                sn: "",
                supplier_name: "",
                company_ids: [],
                dep_id: "",
                hasSubDep: true,
                employee_name: "",
                inbound_date_begin: "",
                inbound_date_end: "",
                price_begin: "",
                price_end: ""
            },
            dataApi: api.getPageListWithSummary
        };
    },
    created() {},
    mounted() {
        this.getCompanyList();
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
        query() {
            this.$refs.list.query();
        },
        getSelectionList() {
            return this.$refs.list.selectionList;
        },
        getCompanyList() {
            this.companyLoading = true;
            companyApi.getList({ inUserCompany: true }).then(res => {
                this.companyList = res.data;
                this.companyLoading = false;
            });
        },
        openDetails(row) {
            this.$refs.assetDetails.open().then(that => {
                that.getDetails(row.id);
            });
        },
        //导出excel
        exportExcel(params) {
            api.exportExcel(params);
        },
        clear() {
            this.list = [];
        },
        del({ row, $index }) {
            let confirmText = "确定删除此IT资产吗？";
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
        openUseStatusDialog(row) {
            this.$refs.assetUseStatusDialog.open().then(that => {
                that.initData({ asset_id: row.id });
            });
        },
        openSelectTypeDialog() {
            this.$refs.typeDialog.open().then(that => {
                that.initData();
            });
        },
        selectType(data) {
            this.queryParams.type_id = data.id;
            this.$refs.typeSelectInput.setName(data.name);
            this.$refs.typeDialog.close();
        },
        openSupplierDetails(row) {
            this.$refs.supplierDetails.open().then(that => {
                that.getDetails(row.supplier_id);
            });
        },
        openSelectDepDialog() {
            this.$refs.depDialog.open().then(that => {
                that.initData();
            });
        },
        selectDep(data) {
            this.$refs.depSelectInput.setName(data.name);
            this.queryParams.dep_id = data.id;
            this.$refs.depDialog.close();
        }
    }
};
</script>