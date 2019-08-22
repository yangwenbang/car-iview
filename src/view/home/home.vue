<template>
  <div>
    <Row :gutter="20" v-if="$store.state.user.employeeId != 1">
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
                    title: "待审核入库单",
                    icon: "md-log-in",
                    count: 0,
                    color: "#2d8cf0",
                    link: "/warehouse/WarehouseRegister"
                },
                {
                    title: "待审核出库结算单",
                    icon: "md-log-out",
                    count: 0,
                    color: "#19be6b",
                    link: "/outstock/OutstockSettlement"
                },
                {
                    title: "待审核提货单",
                    icon: "md-log-out",
                    count: 0,
                    color: "#E46CBB",
                    link: "/outstock/PickGoodsManage"
                },
                {
                    title: "待审核过户单",
                    icon: "md-log-out",
                    count: 0,
                    color: "#5618AC",
                    link: "/outstock/TransferManage"
                },
                {
                    title: "待加工数量",
                    icon: "ios-hammer",
                    count: 0,
                    color: "#ff9900",
                    link: "/process/ProcessList"
                },
                {
                    title: "待审核客户",
                    icon: "md-person-add",
                    count: 0,
                    color: "#ed3f14",
                    link: "/customer/CustomerMaintain"
                }
            ]
        };
    },
    mounted() {
      // if(this.$store.state.user.employeeId != 1){
      //   this.getCountFun();
      // }
    },
    methods:{
      getCountFun() {
        queryIndexCount().then(res => {
            if (res.data.code == "200") {
                const countInfor = res.data.data;
                this.inforCardData[0].count = countInfor.inEnterCount;
                this.inforCardData[1].count = countInfor.outEnterCount;
                this.inforCardData[2].count = countInfor.deliveryCount;
                this.inforCardData[3].count = countInfor.transferCount;
                this.inforCardData[4].count = countInfor.processCount;
                this.inforCardData[5].count = countInfor.customerCount;
            } else {
                this.$Message.error(res.data.msg);
            }
        });
      },
    //   goLink(link){
    //     this.$router.push({ name:link});
    //   }
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
