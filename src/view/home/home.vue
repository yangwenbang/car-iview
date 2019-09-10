<template>
  <div>
    <Row :gutter="20">
      <i-col :xs="12" :md="8" :lg="8" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36" :link="infor.link">
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
export default {
    name: "home",
    components: {
        InforCard,
        CountTo
    },
    data() {
        return {
            inforCardData: [
                {
                    title: "已上架商品",
                    icon: "ios-car",
                    count: 0,
                    color: "#2d8cf0",
                    link: "/commodity/CommodityList"
                },
                {
                    title: "未上架商品",
                    icon: "md-log-out",
                    count: 0,
                    color: "#19be6b",
                    link: "/commodity/CommodityList"
                }
            ]
        };
    },
    mounted() {
    
    },
    methods:{
      getCountFun() {
        queryIndexCount().then(res => {
            if (res.data.code == "200") {
                const countInfor = res.data.data;
                this.inforCardData[0].count = countInfor.inEnterCount;
                this.inforCardData[1].count = countInfor.outEnterCount;
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
