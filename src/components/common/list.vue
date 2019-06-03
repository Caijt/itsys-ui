<template>
    <div>
        <!-- 查询条件 -->
        <div style="margin-bottom: 2px" v-show="!hideQuery">
            <div style="float:right;">
                <el-button-group>
                    <el-button type="primary" icon="el-icon-search" @click="query"></el-button>
                    <el-tooltip content="重置查询条件" placement="top">
                        <el-button icon="el-icon-refresh" @click="resetQuery"></el-button>
                    </el-tooltip>
                    <el-tooltip content="导出Excel" placement="top">
                        <el-button
                            v-if="!hideExportButton"
                            @click="exportExcel"
                            size="mini"
                            icon="el-icon-download"
                        ></el-button>
                    </el-tooltip>
                    <el-tooltip content="显示更多查询条件" placement="top">
                        <el-button
                            v-if="!hideMoreButton"
                            @click="queryShowMore=!queryShowMore"
                            size="mini"
                        >
                            <i
                                :class="{'el-icon-arrow-up':queryShowMore,'el-icon-arrow-down':!queryShowMore}"
                            ></i>
                        </el-button>
                    </el-tooltip>
                </el-button-group>
            </div>
            <el-form class="c-form-condensed" label-width="68px" inline size="mini">
                <slot name="query"></slot>
                <div v-show="queryShowMore">
                    <slot name="query-more"></slot>
                </div>
            </el-form>
        </div>
        <!--/ 查询条件 -->
        <!-- 数据表格 -->
        <el-table
            :data="data"
            ref="tableList"
            v-loading="loading"
            highlight-current-row
            border
            stripe
            :row-key="rowKey"
            :max-height="tableMaxHeight"
            :show-summary="showSummary"
            @selection-change="selectionChange"
            :summary-method="getSummaryData"
            @sort-change="sortChange"
        >
            <el-table-column fixed v-if="showCheckbox" type="selection" align="center" width="35"/>
            <!-- slot[column] -->
            <slot name="column"></slot>
            <!--/ slot[column]-->
        </el-table>
        <!-- 数据表格 -->
        <!-- 分页 -->
        <el-pagination
            v-if="!noPage"
            style="margin-top: 10px"
            :page-sizes="[10, 20, 50, 100]"
            :page-size.sync="pageParams.pageSize"
            :current-page.sync="pageParams.currentPage"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="getData"
            @current-change="getData"
        />
        <slot></slot>
        <!--/ 分页 -->
    </div>
</template>
<script>
export default {
    props: {
        rowKey: {},
        maxHeight: {
            default: 0
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
        orderProp: {
            default: ""
        },
        orderDesc: {
            default: null
        },
        hideExportButton: {
            type: Boolean,
            default: false
        },
        hideMoreButton: {
            type: Boolean,
            default: false
        },
        dataApi: {
            type: Function,
            default: null
        },
        queryParams: {
            type: Object,
            defalut: () => ({})
        },
        showSummary: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            data: [],
            total: 0,
            loading: false,
            selectionList: [],
            summaryData: {},
            queryShowMore: this.showQueryMore,
            initParams: {},
            //查询参数
            tempQueryParams: {},
            initQueryParams: {},
            //数据请求的参数
            orderParams: {
                orderProp: this.orderProp, //排序字段
                orderDesc: this.orderDesc //排序顺序
            },
            pageParams: {
                pageSize: this.$store.state.sys.pageSize, //分页大小
                currentPage: 1 //当前页
            }
        };
    },
    mounted() {
        this.initQueryParams = { ...this.queryParams };
        this.tempQueryParams = { ...this.queryParams };
    },
    computed: {
        tableMaxHeight() {
            return this.maxHeight
                ? this.maxHeight
                : this.$store.state.sys.tableMaxHeight;
        }
    },
    methods: {
        //分页容量大小发生变化时
        sizeChange(value) {
            this.getData();
        },
        selectionChange(valueArrary) {
            this.selectionList = valueArrary;
        },
        getSummaryData({ columns, data }) {
            let sum = [];
            let labelIndex = this.showCheckbox ? 1 : 0;
            columns.forEach((column, i) => {
                if (i == labelIndex) {
                    sum[i] = "合计";
                } else {
                    sum[i] = this.summaryData[column.property];
                }
            });
            return sum;
        },
        initData(params = {}) {
            this.initParams = { ...params };
            this.resetQuery();
        },
        getData() {
            if (this.dataApi == undefined) {
                this.$message.error("请指定数据接口dataApi属性！");
                return false;
            }
            this.loading = true;
            let params = {};
            if (!this.noPage) {
                params = { ...this.pageParams };
            }
            params = {
                ...params,
                ...this.tempQueryParams,
                ...this.initParams,
                ...this.orderParams
            };
            this.dataApi(params).then(res => {
                this.data = res.data.list;
                this.total = res.data.total;
                if (res.data.summary) {
                    this.summaryData = res.data.summary;
                }
                this.loading = false;
                this.$emit("loaded", {
                    data: this.data,
                    total: this.total
                });
            });
        },
        //查询方法
        query() {
            this.tempQueryParams = { ...this.queryParams };
            this.getData();
        },
        //重置查询条件
        resetQuery() {
            for (let key in this.queryParams) {
                this.queryParams[key] = this.initQueryParams[key];
            }
            this.pageParams.currentPage = 1;
            this.query();
        },
        sortChange({ prop, order }) {
            this.orderParams.orderProp = prop;
            this.orderParams.orderDesc = order
                ? order == "descending"
                    ? true
                    : false
                : null;
            this.getData();
        },
        //导出excel
        exportExcel() {
            this.$emit("export-excel", {
                ...this.tempQueryParams,
                ...this.orderParams
            });
        },
        clear() {
            this.total = 0;
            this.data = [];
        }
    }
};
</script>