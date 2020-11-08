<template>
  <div class="main">
    <div>
      <div style="float: right; margin-right: 20%; font-size: 16px;">
        <span style="margin-right: 50px;" class="top-title" @click="go(1)">首页/home</span>
        <span style="margin-right: 50px;" class="top-title" @click="go(2)">商家入驻/stationed</span>
        <span style="margin-right: 50px;" class="top-title" @click="go(3)">关于/about</span>
        <span style="margin-right: 50px;" class="top-title" @click="go(4)">联系/contact</span>
      </div>
      <div class="bg-img">
        <div class="header-logo" v-if="type == 1">
          <img src="../../assets/images/v2_pvwxm2.png" width="484px" height="488px">
        </div>
        <div class="header-logo" v-if="type == 2">
        </div>
        <div class="header-logo" v-if="type == 3">
          <img src="../../assets/images/v2_pvwxm2.png" width="484px" height="488px">
        </div>
        <div class="header-logo" v-if="type == 4">
          <img src="../../assets/images/v2_pvwxm2.png" width="484px" height="488px">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'OfficialIndex',
  components: {},
  data() {
    return {
      type: 1
    }
  },

  created() {
  },

  mounted () {
  },

  methods: {
    go(type) {
      this.type = type;
    }
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
.top-title:hover {
  color: blue !important;
  cursor: pointer;
}
.top-title a {
  color:#000;  
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
