<template>
  <div class="breadcrumb-title">
    <h1 class="title">{{pageTitle}}</h1>
    <custom-bread-crumb show-icon style="margin-left: 30px;" :list="breadCrumbList" :hidden="this.$store.state.app.screenSize<768"></custom-bread-crumb>
  </div>
</template>
<script>
import CustomBreadCrumb from './CustomBreadCrumb'
import './BreadcrumbTitle.less'
export default {
  name: 'HeaderBar',
  components: {
    CustomBreadCrumb
  },
  data() {
      return {
         
      }
  },
  computed: {
    breadCrumbList () {
      return this.$store.state.app.breadCrumbList
    },
    pageTitle () {
      if(this.$store.state.app.breadCrumbList.length!==0){
        return this.$store.state.app.breadCrumbList[this.$store.state.app.breadCrumbList.length-1].meta.pageTitle;
      }
    }
  },
  methods: {
  }
}
</script>
