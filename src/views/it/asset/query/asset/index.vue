<template>
    <div>
        <asset-list ref="list" show-query-more/>
    </div>
</template>
<script>
import assetList from "@/components/it/asset/list";
export default {
    components: {
        assetList
    },
    mounted() {
        this.$refs.list.reload();
    }
};
</script>