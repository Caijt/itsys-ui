<template>
  <div>
    <project-list ref='projectList'></project-list>
  </div>
</template>
<script>
  import projectList from '@/components/cw/settlementArrears/projectList'
  export default{
    components:{
      projectList
    },
    data(){
      return {}
    },
    mounted(){
      this.$refs.projectList.initQueryParams.isArrears = 1
      this.$refs.projectList.initData()
    }
  }
</script>