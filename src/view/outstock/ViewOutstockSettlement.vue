<template>
    <div class="white-bg view-oss">
        <Row class="margin-bottom-10">
            <Col span="24">
            <div class="pull-left table-title">出库结算单</div>
            </Col>
        </Row>
        <div class="table-scrollable left-right-table">
            <table border="1">
                <tbody>
                    <tr>
                        <td class="left-bg">出库结算单号：</td>
                        <td>{{formParams.outSettleCode}}</td>
                        <td class="left-bg">货主：</td>
                        <td>{{formParams.ownerName}}</td>
                        <td class="left-bg">货物类型：</td>
                        <td>{{formParams.type==0?'原料':formParams.type==1?'成品':formParams.type==2?'废料':''}}</td>

                    </tr>
                    <tr>
                        <td class="left-bg">结算方式：</td>
                        <td>{{formParams.settleType==0?'月结':formParams.settleType==1?'现结':formParams.settleType==2?'其他':''}}</td>
                        <td class="left-bg">状态：</td>
                        <td :class="statusColor">{{statusText}}</td>
                        <td class="left-bg">提货单：</td>
                        <td>
                            <span class="tb-link margin-right-10" @click="goToDelivery(item.id)" v-for="(item,index) in formParams.deliveryList" :key="index">{{item.deliveryCode}}</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="left-bg">结算客户：</td>
                        <td>{{formParams.settleCustomerName}}</td>
                        <td class="left-bg">备注：</td>
                        <td colspan="3">{{formParams.remark}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <Row class="margin-top-20 margin-bottom-10">
            <Col span="24">
            <div class="pull-left table-title">出库结算单明细</div>
            <div class="pull-right count-content">
                <span class="margin-right-10">出库总数量：
                    <b class="tip">{{formParams.numberTotal}}</b> 件</span>
                <span class="margin-right-10">出库总重量：
                    <b class="tip">{{formParams.weightTotal | formatWeight}}</b> 吨</span>
            </div>
            </Col>
        </Row>
        <Table :columns="tableColumns" :data="tableData" border>
            <div slot="footer" class="table-foot" >
							<div class="other-price-info" v-if="formParams.settleTimeType==0">
                <Row>
                    <Col :sm="8" :xs="24">
                    <div class="val-text margin-left-20">
                        <span class="total-money">附加费：
                            <b class="tip color-red">{{formParams.extraCharge | formatPrice}}</b> 元</span>
                    </div>
                    </Col>
                    <Col :sm="8" :xs="24">
                    <div class="val-text margin-right-20">
                        <span class="total-money">打包费：
                            <b class="tip color-red">{{formParams.packageCharge | formatPrice}}</b> 元</span>
                    </div>
                    </Col>
                    <Col :sm="8" :xs="24">
                    <div class="val-text text-right margin-right-20">
                        <span class="total-money">结算总金额：
                            <b class="tip color-red">{{formParams.amountTotal | formatPrice}}</b> 元</span>
                    </div>
                    </Col>
                </Row>
							</div>
            </div>
        </Table>
        <div class="text-center margin-top-10">
            <Button class="btn-common-width" type="info" @click="printFun">打印</Button>
        </div>
        <Modal v-model="showModal1" title="母卷信息" width="60%" ok-text="确定">
            <div class="table-scrollable left-right-table" v-if="mjInfor">
                <table border="1">
                    <tbody>
                        <tr>
                            <td class="left-bg">编号：</td>
                            <td>{{mjInfor.code}}</td>
                            <td class="left-bg">产地：</td>
                            <td>{{mjInfor.brandName}}</td>
                        </tr>
                        <tr>
                            <td class="left-bg">品名：</td>
                            <td>{{mjInfor.breedName}}</td>
                            <td class="left-bg">材质：</td>
                            <td>{{mjInfor.materialName}}</td>
                        </tr>
                        <tr>
                            <td class="left-bg">数量（件）：</td>
                            <td>{{mjInfor.number}}</td>
                            <td class="left-bg">单件重量（吨）：</td>
                            <td>{{mjInfor.perAmount | formatWeight}}</td>
                        </tr>
                        <tr>
                            <td class="left-bg">计重方式：</td>
                            <td>{{mjInfor.weightType == '0' ? "抄码" : mjInfor.weightType == '1' ? "过磅" : mjInfor.weightType == '2' ? "理重" : ""}}</td>
                            <td class="left-bg">钢卷号/捆包号：</td>
                            <td>{{mjInfor.baleNumber}}</td>
                        </tr>
                        <tr>
                            <td class="left-bg">包装：</td>
                            <td>{{mjInfor.wrap}}</td>
                            <td class="left-bg">外观：</td>
                            <td>{{mjInfor.appearance}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <h3 v-else style="text-align:center;">没有母卷信息</h3>
            <div slot="footer">
                <Button type="primary" @click="showModal1=false">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import { OutSettleDetail, getParentInventoryItemDetail } from "@/api/outstock";
import { formatPrice, formatWeight, isAcrobatPluginInstall } from "@/libs/util";
export default {
  name: "ViewOutstockSettlement",
  data() {
    return {
      showModal1: false,
      mjInfor: {},
      formParams: {},
      statusText: "",
      statusColor: "",
			tableData: [],
      tableColumns: [
        {
          title: "编号",
          key: "code",
          align: "left",
          minWidth: 120
        },
        {
          title: "打包号",
          key: "packCode",
          align: "left",
          minWidth: 120
        },
        {
          title: "产地",
          key: "brandName",
          align: "left",
          minWidth: 80
        },
        {
          title: "品名",
          key: "breedName",
          align: "left",
          minWidth: 100
        },
        {
          title: "材质",
          key: "materialName",
          align: "left",
          minWidth: 100
        },
        {
          title: "规格",
          key: "specName",
          align: "left",
          minWidth: 110
        },
        {
          title: "库区",
          key: "storageArea",
          align: "left",
          minWidth: 80
        },
        {
          title: "库位",
          key: "storagePlace",
          align: "left",
          minWidth: 80
        },
        {
          title: "可结算数量(件)",
          key: "remainNum",
          align: "right",
          minWidth: 120
        },
        {
          title: "出库结算数量(件)",
          key: "number",
          align: "right",
          minWidth: 130
        },
        {
          title: "单件重量(吨)",
          key: "perAmount",
          align: "right",
          minWidth: 100,
          render: (h, data) => {
            return h("span", formatWeight(data.row.perAmount));
          }
        },
        {
          title: "出库结算重量(吨)",
          key: "weight",
          align: "right",
          minWidth: 130,
          render: (h, data) => {
            return h("span", formatWeight(data.row.weight));
          }
        },
        {
          title: "计量方式",
          key: "weightType",
          align: "right",
          minWidth: 80,
          render: (h, data) => {
            let typeText = "";
            if (data.row.weightType == 0) {
              typeText = "抄码";
            } else if (data.row.weightType == 1) {
              typeText = "过磅";
            } else if (data.row.weightType == 2) {
              typeText = "理重";
            }
            return h("span", typeText);
          }
        },
        {
          title: "出库单价(元)",
          key: "price",
          align: "right",
          minWidth: 130,
          render: (h, data) => {
            return h("span", formatPrice(data.row.price));
          }
        },
        {
          title: "出库费用(元)",
          key: "outAmount",
          align: "right",
          minWidth: 100,
          render: (h, data) => {
            return h("span", formatPrice(data.row.outAmount));
          }
        },
        {
          title: "其他费用(元)",
          key: "otherCharge",
          align: "right",
          minWidth: 100,
          render: (h, data) => {
            return h("span", formatPrice(data.row.otherCharge));
          }
        },
        {
          title: "总金额(元)",
          key: "amount",
          align: "right",
          minWidth: 100,
          render: (h, data) => {
            return h("span", formatPrice(data.row.amount));
          }
        },
        {
          title: "包装",
          key: "wrap",
          align: "left",
          minWidth: 80
        },
        {
          title: "外观",
          key: "appearance",
          align: "left",
          minWidth: 80
        },
        {
          title: "钢卷号/捆包号",
          key: "baleNumber",
          align: "left",
          minWidth: 120
        }
      ]
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getMjInfor(inventoryItemId) {
      getParentInventoryItemDetail({ inventoryItemId: inventoryItemId }).then(
        res => {
          this.mjInfor = res.data.data;
          
        }
      );
    },
    printFun() {
      var result = isAcrobatPluginInstall();
      if (result) {
        window.open(
          "/api/pwms/inventory/outSettle/printOutSettle?outSettleId=" +
            this.$route.query.id
        );
      }
    },
    getList() {
      OutSettleDetail({
        id: this.$route.query.id
      }).then(res => {
        if (res.data.code == "200") {
          let data = res.data.data;
          if (data.status == 0) {
            this.statusText = "待审核";
            this.statusColor = "blue";
          } else if (data.status == 1) {
            this.statusText = "已审核";
            this.statusColor = "green";
          } else if (data.status == 9) {
            this.statusText = "已删除 ";
            this.statusColor = "gray";
					}
					if(data.settleTimeType==1 && this.tableColumns.length==20){
						this.tableColumns.splice(13,4);
					}
          if (data.type == 1 && ((this.tableColumns.length==20 && data.settleTimeType==0) || (this.tableColumns.length==16 && data.settleTimeType==1))) {
            this.tableColumns.splice(5, 0, {
              title: "母卷信息",
              align: "center",
              minWidth: 80,
              render: (h, data) => {
                if (data.row.type == 1) {
                  return h(
                    "a",
                    {
                      class: "tb-link",
                      on: {
                        click: () => {
                          this.showModal1 = true;
                          this.getMjInfor(data.row.inventoryItemId);
                        }
                      }
                    },
                    "查看"
                  );
                } else {
                  return h("span", "无");
                }
              }
            });
          }
					this.formParams = data;
					this.tableData = data.itemList;
					
        }
      });
    },
    goToDelivery(id) {
      this.$router.push({ name: "ViewPickGoods", query: { id: id } });
    }
  },
  activated:function(){
      this.getList();
  }
//   watch: {
//     //监听相同路由下参数变化的时候，从而实现异步刷新
//     $route(to, from) {
//       //重新获取数据
//       if (to.name == "ViewOutstockSettlement") {
//         this.getList();
//       }
//     }
//   }
};
</script>
<style scoped>
.view-oss >>> .ivu-table-footer{
	height: 0px !important;
	line-height: 0px !important;
}
.view-oss .other-price-info{
	height: 48px;
	line-height: 48px;
}
</style>


