<template>
    <div>
        <el-alert title="这里能查询到资产领用交还记录中全部明细记录" type="success" style="margin-bottom:10px"></el-alert>
        <use-return-list ref="list" show-query-more/>
    </div>
</template>
<script>
import useReturnList from "@/components/it/asset/useReturn/list";
export default {
    components: {
        useReturnList
    },
    mounted() {
        this.$refs.list.reload();
    }
};
</script>