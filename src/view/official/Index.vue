<template>
  <div class="main">
    <div>
		<div style="float: right; margin-right: 20%; font-size: 16px;"><span style="margin-right: 50px;">首页/home</span><span style="margin-right: 50px;">商家入驻/stationed</span><span style="margin-right: 50px;">关于/about</span><span style="margin-right: 50px;">联系/contact</span></div>
    <div class="bg-img"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'OfficialIndex',
  components: {},
  data () {
    return {}
  },
  created () {
  },
  mounted () {
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
.main {
    overflow-x: hidden;
    height:100%;
    overflow: auto;
    padding: 15px;
    width: 100%;
}
.login {
    width: 100%;
    height: 100%;
    background-image: url('../../assets/images/v2_pvwxm2.png');
    background-repeat: no-repeat;
    background-position: center;
    position: relative;
    background-color:rgba(251, 198, 71, 1);
    @media screen and (max-width: 600px) {
        .top {
            padding-top: 120px !important;
        }
    }
    .top {
        padding-top: 200px;
    }
}
</style>
