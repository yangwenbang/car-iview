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
          <div class="second-body">
            <img src="../../assets/images/official/10.jpg" class="img-body">
          </div>
          <div class="third-body">
            <img src="../../assets/images/official/8-1.jpg" class="img-body">
          </div> 
          <div>
            <img src="../../assets/images/official/11.jpg" class="img-body">
          </div>
        </div>
        <div v-if="type == 2">
          <div class="second-body-2">
            <img src="../../assets/images/official/7-1.jpg" class="img-body">
          </div>
          <div class="second-body-2">
            <img src="../../assets/images/official/12.jpg" class="img-body">
          </div>
          <div>
            <img src="../../assets/images/official/11.jpg" class="img-body">
          </div>
        </div>
        <div v-if="type == 3">
          <div class="second-body-3">
            <img src="../../assets/images/official/13.jpg" class="img-body">
          </div>
          <div>
            <img src="../../assets/images/official/11.jpg" class="img-body">
          </div>
        </div>
        <div v-if="type == 4">
          <div class="second-body-3">
            <img src="../../assets/images/official/14.jpg" class="img-body">
          </div>
          <div>
            <img src="../../assets/images/official/11.jpg" class="img-body">
          </div>
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
  position: relative;
    overflow-x: hidden;
    height:900px;
    overflow-y: scroll;
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
  position: relative;
  margin: 0px;
  width: 100%;
  height: 669px;
  left: 0px;
  top: 0px;
  vertical-align: middle;
  text-align: center;
}

.second-body {
  position: relative;
  padding: 0px 200px 0px 200px;
  width: 100%;
  height: 600px;
  left: 0px;
  top: 0px;
  vertical-align: middle;
  text-align: center;
}

.second-body-2 {
  position: relative;
  padding: 0px 300px 0px 300px;
  width: 100%;
  height: 500px;
  left: 0px;
  top: 0px;
  vertical-align: middle;
  text-align: center;
}

.second-body-3 {
  position: relative;
  padding: 0px 300px 0px 300px;
  width: 100%;
  height: 767px;
  left: 0px;
  top: 0px;
  vertical-align: middle;
  text-align: center;
}

.third-body {
  position: relative;
  margin: 0px;
  width: 100%;
  height: 800px;
  left: 0px;
  top: 0px;
  vertical-align: middle;
  text-align: center;
}

.img-body {
  width: 100%;
  height: 100%;
}

</style>
