<template>
  <router-link :to="link">
    <Card :shadow="shadow" class="info-card-wrapper" :padding="0">
      <div class="content-con">
        <div class="left-area" :style="{background: color}">
          <div style="line-height:50px;color:#fff;font-size:25px;"><common-icon class="icon" :type="icon" :size="iconSize" color="#fff"/> {{title}}-<span style="font-size:14px;">待审核</span></div>
        </div>
        <div class="right-area">
          <slot></slot>
        </div>
      </div>
    </Card>
  </router-link>
</template>

<script>
import CommonIcon from '_c/common-icon'
export default {
  name: 'InforCard',
  components: {
    CommonIcon
  },
  props: {
    link: {
      type: String,
      default: "/"
    },
    title: {
      type: String,
      default: ""
    },
    left: {
      type: Number,
      default: 36
    },
    color: {
      type: String,
      default: '#2d8cf0'
    },
    icon: {
      type: String,
      default: ''
    },
    iconSize: {
      type: Number,
      default: 20
    },
    shadow: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    leftWidth () {
      return `${this.left}%`
    },
    rightWidth () {
      return `${100 - this.left}%`
    }
  }
}
</script>

<style lang="less">
.common{
  // float: left;
  // height: 100%;
  // display: table;
  text-align: center;
}
.size{
  width: 100%;
  height: 100%;
}
.middle-center{
  //display: table-cell;
  vertical-align: middle;
}
.info-card-wrapper{
  .size;
  cursor: pointer;
  &:hover{
    box-shadow: -1px 1px 8px #cccccc !important;
  }
  overflow: hidden;
  .ivu-card-body{
    .size;
  }
  .content-con{
    .size;
    position: relative;
    .left-area{
      width:100%;
      text-align: center;
      & > .icon{
        .middle-center;
      }
    }
    .right-area{
      color: #515a6e;
      width:100%;
      text-align: center;
      & > div{
        .middle-center;
      }
    }
  }
}
</style>
