<template>
  <div>
    <company-list ref='companyList'></company-list>
  </div>
</template>
<script>
  import companyList from '@/components/cw/arrears/companyList'
  export default{
    components:{
      companyList
    },
    data(){
      return {}
    },
    mounted(){
      this.$refs.companyList.initQueryParams.isArrears = 1
      this.$refs.companyList.initData()
    }
  }
</script>