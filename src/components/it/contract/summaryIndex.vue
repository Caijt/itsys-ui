<template>
    <div>
        <el-tabs value="near">
            <el-tab-pane name="near" v-if="hasPath('/it/contract/query/contract')">
                <span slot="label">
                    <el-badge :hidden="!nearTotal" class="_my-bagde" :value="nearTotal">近期合同</el-badge>
                </span>
                <el-alert
                    title="以下仅显示近10天内创建的合同记录，如需更详细的合同数据，请到相关页面进行查询"
                    type="success"
                    style="margin-bottom:10px"
                >
                    <div>
                        <el-button
                            type="text"
                            size="mini"
                            @click="$router.push('/it/contract/query/contract')"
                        >[ 合同查询 ]</el-button>
                    </div>
                </el-alert>
                <contract-list
                    ref="contractList"
                    hide-query
                    max-height="250"
                    no-page
                    @loaded="nearTotal=$event.total"
                />
            </el-tab-pane>
            <el-tab-pane name="expire" v-if="hasPath('/it/contract/query/contract')">
                <span slot="label">
                    <el-badge :hidden="!expireTotal" class="_my-bagde" :value="expireTotal">即将到期合同</el-badge>
                </span>
                <el-alert
                    title="以下合同距离失效日期还不到一个月，请及时联系供应商签订新合同"
                    type="warning"
                    show-icon
                    style="margin-bottom:10px"
                ></el-alert>
                <contract-list
                    ref="contractExpireList"
                    hide-query
                    max-height="250"
                    no-page
                    @loaded="expireTotal=$event.total"
                />
            </el-tab-pane>
            <el-tab-pane name="toPay" v-if="hasPath('/it/contract/pay')">
                <span slot="label">
                    <el-badge :hidden="!payTotal" class="_my-bagde" :value="payTotal">待付款合同</el-badge>
                </span>
                <el-alert
                    title="以下合同的款项还未付清，如已付清，请及时补充付款记录"
                    type="warning"
                    show-icon
                    style="margin-bottom:10px"
                >
                    <div>
                        <el-button
                            type="text"
                            size="mini"
                            @click="$router.push('/it/contract/pay')"
                        >[ 合同付款 ]</el-button>
                    </div>
                </el-alert>
                <contract-list
					ref="toPayList"
                    hide-query
                    no-page
                    @loaded="payTotal=$event.total"
                />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import contractList from "./list";
export default {
    components: {
        contractList
    },
    data() {
        return {
            nearTotal: "..",
            expireTotal: "..",
            payTotal: ".."
        };
    },
    mounted() {
        this.$refs.contractList && this.$refs.contractList.initData({ isNear: true });
        this.$refs.contractExpireList && this.$refs.contractExpireList.initData({ toExpire: true });
        this.$refs.toPayList && this.$refs.toPayList.initData({ toPay: true });
    },
    methods: {
        initData() {},
        hasPath(path) {
            return this.$commonJs.hasUserPath(path);
        }
    }
};
</script>
<style lang='less'>
._my-bagde {
    .el-badge__content {
        top: 8px !important;
        right: 2px !important;
    }
}
</style>