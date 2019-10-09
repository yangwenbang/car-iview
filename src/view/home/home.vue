<template>
  <div>
    <Row :gutter="20">
      <i-col :xs="12" :md="8" :lg="8" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;padding-bottom: 10px;">
        <infor-card v-if="!infor.hide" shadow :color="infor.color" :icon="infor.icon" :icon-size="36" :link="infor.link">
          <count-to :end="infor.count" count-class="count-style" />
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
  </div>
</template>

<script>
import InforCard from "_c/info-card";
import CountTo from "_c/count-to";
import { queryIndexCount } from '@/api/common'
import { setToken, getToken } from '@/libs/util'

export default {
    name: "home",

    components: {
        InforCard,
        CountTo
    },

    data() {
        return {

          hideInIndex: true,

          inforCardData: [
              {
                  title: "总商品数",
                  icon: "ios-car",
                  count: 0,
                  color: "#2d8cf0",
                  link: "/commodity/CommodityList",
              },
              {
                  title: "待上架商品数",
                  icon: "ios-car-outline",
                  count: 0,
                  color: "#19be6b",
                  link: "/commodity/CommodityList",
              },
              {
                  title: "待退款订单数",
                  icon: "ios-list-box-outline",
                  count: 0,
                  color: "#f5222d",
                  link: "/order/OrderList",
              },
              {
                  title: "今日新增终端用户数",
                  icon: "md-people",
                  count: 0,
                  color: "#fa541c",
                  link: "/user/UserList",
              },
              {
                  title: "质检商家用户数",
                  icon: "ios-speedometer-outline",
                  count: 0,
                  color: "#eb2f96",
                  link: "/qualityShop/shopList",
              },
              {
                  title: "终端用户数",
                  icon: "ios-people",
                  count: 0,
                  color: "#fa8c16",
                  link: "/user/UserList",
              }
            ]
        }
    },

    mounted() {
      this.hideInIndex = (JSON.parse(this.$store.state.user.token).isAdmin == 1 ? false : true);
      this.getCountFun();
    },
    methods:{
      getCountFun() {
        queryIndexCount().then(res => {
            if (res.data.code == "200") {
                const countInfor = res.data.data;
                this.inforCardData[0].count = countInfor.commoditys;
                this.inforCardData[1].count = countInfor.waitingShelfCommoditys;
                this.inforCardData[2].count = countInfor.waitingRefunds;
                this.inforCardData[3].count = countInfor.currentDayAppUsers;
                this.inforCardData[4].count = countInfor.merchantsUsers;
                this.inforCardData[5].count = countInfor.appUsers;

                this.inforCardData[3].hide = this.hideInIndex;
                this.inforCardData[4].hide = this.hideInIndex;
                this.inforCardData[5].hide = this.hideInIndex;
            } else {
                this.$Message.error(res.data.msg);
            }
        });
      },
    }
};
</script>

<style lang="less">
.count-style {
    font-size: 50px;
}
//表单左侧提示
.select-box {
    position: relative;
    min-width: 200px;
    .left-tooltip {
        position: absolute;
        left: -20px;
        top: 5px;
        z-index: 99;
    }
}
.in-pie-select{
  position: absolute;
  width: 125px;
  z-index: 999;
}
</style>
