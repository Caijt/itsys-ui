<template>
  <div>
    <contract-list ref='contractList'></contract-list>
  </div>
</template>
<script>
  import contractList from '@/components/cw/settlementArrears/contractList'
  export default{
    components:{
      contractList
    },
    data(){
      return {}
    },
    mounted(){
      this.$refs.contractList.initQueryParams.isArrears = 1
      this.$refs.contractList.initData()
    }
  }
</script>