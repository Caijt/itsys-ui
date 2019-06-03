<template>
    <div>
        <div style="margin-bottom:15px" v-show="!hideQuery">
            <div style="float:right">
                <el-button-group>
                    <el-button type="primary" icon="el-icon-search" @click="query"></el-button>
                    <el-tooltip content="重置查询条件" placement="top">
                        <el-button icon="el-icon-refresh" @click="resetQuery"></el-button>
                    </el-tooltip>
                    <el-tooltip content="显示更多查询条件" placement="top">
                        <el-button @click="queryShowMore=!queryShowMore" size="mini">
                            <i
                                :class="{'el-icon-arrow-up':queryShowMore,'el-icon-arrow-down':!queryShowMore}"
                            ></i>
                        </el-button>
                    </el-tooltip>
                </el-button-group>
            </div>
            <el-form
                ref="formQuery"
                :model="queryParams"
                label-width="68px"
                class="c-form-condensed"
                inline
                size="mini"
            >
                <el-form-item label="统计单位" prop="unit">
                    <el-select v-model="queryParams.unit" style="width: 100px">
                        <el-option label="年" value="year"></el-option>
                        <el-option label="月" value="month"></el-option>
                        <el-option label="日" value="day"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="统计时段">
                    <el-row style="width:300px">
                        <el-col :span="11">
                            <el-form-item prop="time_begin">
                                <el-date-picker
                                    v-model="queryParams.time_begin"
                                    placeholder="开始时间"
                                    value-format="yyyy-MM-dd"
                                    style="width: 100%"
                                    :type="unitType"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="2">至</el-col>
                        <el-col :span="11">
                            <el-form-item prop="time_end">
                                <el-date-picker
                                    v-model="queryParams.time_end"
                                    placeholder="结束时间"
                                    value-format="yyyy-MM-dd"
                                    style="width: 100%"
                                    :type="unitType"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
                <!-- 更多条件 -->
                <div v-if="queryShowMore">
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
                                v-show="item.is_disabled==1?false:true"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="供应商" prop="supplier_name">
                        <el-input v-model.trim="queryParams.supplier_name" clearable></el-input>
                    </el-form-item>
                </div>
                <!--/ 更多条件-->
            </el-form>
        </div>
        <div ref="chartContainer" :style="{width:'100%',height:chartHeight}"></div>
    </div>
</template>
<script>
import api from "@/api/it/contractPayRecord";
import companyApi from "@/api/sys/company";
export default {
    props: {
        params: {
            default: () => ({})
        },
        hideQuery: {
            type: Boolean,
            default: false
        },
        chartHeight: {
            type: String,
            default: "350px"
        }
    },
    data() {
        return {
            queryShowMore: false,
            echarts: null,
            companyList: [],
            companyList: true,
            initParams: {},
            queryParams: {
                unit: "month",
                time_begin: "",
                time_end: "",
                company_ids: [],
                supplier_name: ""
            },
            requestParams: {}
        };
    },
    computed: {
        unitType() {
            let type = "date";
            if (this.queryParams.unit == "year") {
                type = "year";
            } else if (this.queryParams.unit == "month") {
                type = "month";
            } else if (this.queryParams.unit == "day") {
                type = "date";
            }
            return type;
        }
    },
    beforeDestroy() {
        if (!this.echarts) {
            return false;
        }
        this.echarts.dispose();
        this.echarts = null;
    },
    mounted() {
        this.initChart();
        this.getCompanyList();
    },
    methods: {
        initChart() {
            let echarts = require("echarts");
            this.echarts = echarts.init(this.$refs.chartContainer);
            this.echarts.setOption({
                legend: {},
                tooltip: {
                    trigger: "axis"
                },
                xAxis: [
                    {
                        type: "category"
                    }
                ],
                yAxis: [
                    {
                        type: "value",
                        name: "金额",
                        gridIndex: 0
                    },
                    {
                        type: "value",
                        name: "数量",
                        gridIndex: 0,
                        splitLine: {
                            show: false
                        }
                    }
                ],
                series: [
                    {
                        name: "付款金额",
                        type: "bar"
                    },
                    {
                        name: "付款数量",
                        type: "line",
                        yAxisIndex: 1
                    }
                ]
            });
        },
        getCompanyList() {
            this.companyLoading = true;
            companyApi.getList({ inUserCompany: true }).then(res => {
                this.companyList = res.data;
                this.companyLoading = false;
            });
        },
        getData() {
            this.echarts.showLoading();
            api.getTimeStatistic({
                ...this.requestParams,
                ...this.params,
                ...this.initParams
            }).then(res => {
                this.echarts.setOption({
                    dataset: {
                        source: res.data
                    }
                });
                this.echarts.hideLoading();
            });
        },
        query({ key } = {}) {
            if (key) {
                let value = this.queryParams[key];
                this.requestParams = { ...this.requestParams, [key]: value };
            } else {
                this.requestParams = {
                    ...this.requestParams,
                    ...this.queryParams
                };
            }
            this.getData();
        },
        //重置并查询
        resetQuery() {
            this.$refs.formQuery.resetFields();
            this.query();
        },
        exportExcel() {},
        initData(params = {}) {
            this.initParams = params;
            this.resetQuery();
        }
    }
};
</script>