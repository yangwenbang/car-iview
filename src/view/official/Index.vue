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
        <div v-if="type == 1">
          <div class="main-body">
            <img src="../../assets/images/official/9.jpg" class="img-body">
          </div>
        </div>
        <div v-if="type == 2">
        </div>
        <div v-if="type == 3">
          <img src="../../assets/images/v2_pvwxm2.png" width="484px" height="488px">
        </div>
        <div v-if="type == 4">
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
    padding: 15px 0px;
    width: 100%;
}
.top-title:hover {
  color: blue !important;
  cursor: pointer;
}

.bg-img {
  position: absolute;
  margin-top: 100px;
  width: 100%;
  height: 100%;
}

.main-body {
  position: absolute;
  margin: 0px;
  width: 100%;
  height: 669px;
  left: 0px;
  top: 0px;
  vertical-align: middle;
  text-align: center;
}

.img-body {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0px;
  top: 0px;
  background-size: cover;
}

</style>
