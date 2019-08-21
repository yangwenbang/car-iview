<template>
  <div class="white-bg audit-pick-goods">
    <div class="table-scrollable left-right-table">
      <table border="1">
        <tbody>
          <tr>
            <td class="left-bg">提货单号：</td>
            <td>{{form.deliveryCode}}</td>
            <td class="left-bg">出库结算单号：</td>
            <td class="tb-link">
              <router-link :to="{name:'ViewOutstockSettlement',query:{id:form.outSettleId}}">{{form.outSettleCode}}</router-link>
            </td>
            <td class="left-bg">提货日期：</td>
            <td>{{form.deliveryDate}}</td>
          </tr>
          <tr>
            <td class="left-bg">货主：</td>
            <td>{{form.ownerName}}</td>
            <td class="left-bg">提货客户：</td>
            <td>{{form.deliveryCustomerName}}</td>
            <td class="left-bg">放货单号：</td>
            <td>{{form.releaseCode}}</td>
          </tr>
          <tr>
            <td class="left-bg">备注：</td>
            <td colspan="5">{{form.remark}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <Row class="margin-top-20 margin-bottom-10">
      <Col span="24">
      <div class="pull-left table-title">提货司机信息</div>
      </Col>
    </Row>
    <Table :columns="tableColumns2" :data="form.deliveryTransports" border>
    </Table>
    <Row class="margin-top-20 margin-bottom-10">
      <Col span="24">
      <div class="pull-left table-title">提货单明细</div>
      <div class="pull-right count-content">
        <span class="margin-right-10">提货总数量：
          <b class="tip">{{countEle.countNum}}</b> 件</span>
        <span class="margin-right-10">提货总重量：
          <b class="tip">{{countEle.countWeight}}</b> 吨</span>
      </div>
      </Col>
    </Row>
    <Table :columns="tableColumns" :data="form.deliveryItems" border>
			<div slot="footer" class="table-foot">
				<div class="other-price-info" v-if="settleTimeType==1">
					<Row>
							<Col :sm="8" :xs="24">
							<div class="val-text margin-left-20">
									<span class="total-money">附加费：
											<b class="tip color-red">{{form.extraCharge | formatPrice}}</b> 元</span>
							</div>
							</Col>
							<Col :sm="8" :xs="24">
							<div class="val-text margin-right-20">
									<span class="total-money">打包费：
											<b class="tip color-red">{{form.packageCharge | formatPrice}}</b> 元</span>
							</div>
							</Col>
							<Col :sm="8" :xs="24">
							<div class="val-text text-right margin-right-20">
									<span class="total-money">结算总金额：
											<b class="tip color-red">{{form.totalChange | formatPrice}}</b> 元</span>
							</div>
							</Col>
					</Row>
				</div>
			</div>
		</Table>
    <div class="text-center margin-top-20">
      <Button type="primary" @click="submitFun">审核</Button>
      <Button class="btn-common-width margin-left-10" @click="backFun">取消</Button>
    </div>
  </div>
</template>
<script>
import { closeNowTag, formatWeight, formatPrice} from "@/libs/util";
import { queryDeliveryDetail, queryDeliveryAudit } from "@/api/outstock";
export default {
  name: "AuditPickGoods",
  data() {
    return {
      settleTimeType:0,
      form: {},
      tableColumns: [
        {
          title: "编号",
          key: "code",
          align: "left",
          minWidth: 140
        },
        {
          title: "打包号",
          key: "packCode",
          align: "left",
          minWidth: 120
        },
        {
          title: "货物类型",
          key: "type",
          align: "left",
          minWidth: 90,
          render: (h, data) => {
            let typeText = "";
            if (data.row.type == 0) {
              typeText = "原料";
            } else if (data.row.type == 1) {
              typeText = "成品";
            }
            return h("span", typeText);
          }
        },
        {
          title: "产地",
          key: "brandName",
          align: "left",
          minWidth: 100
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
          minWidth: 120
        },
        {
            title: "过磅重量(吨)",
            key: "weighedWeight",
            align: "left",
            minWidth: 140,
            render: (h, params) => {
              return h(
                "span",
                formatWeight(params.row.weighedWeight)
              );
            }
        },
        {
            title: "提货单价(元)",
            key: "price",
            align: "left",
            minWidth: 140,
            render: (h, params) => {
              return h(
                "span",
                formatPrice(params.row.price)
              );
            }
        },
        {
            title: "提货费用(元)",
            key: "amount",
            align: "left",
            minWidth: 140,
            render: (h, params) => {
              return h(
                "span",
                formatPrice(params.row.amount)
              );
            }
        },
        {
            title: "其他费用(元)",
            key: "otherCharge",
            align: "left",
            minWidth: 140,
            render: (h, params) => {
              return h(
                "span",
                formatPrice(params.row.otherCharge)
              );
            }
        },
        {
            title: "总金额(元)",
            key: "otherCharge",
            align: "left",
            minWidth: 140,
            render: (h, params) => {
              return h(
                "span",
                formatPrice(params.row.otherCharge+params.row.amount)
              );
            }
        },
        {
          title: "库区",
          key: "storageArea",
          align: "left",
          minWidth: 100
        },
        {
          title: "库位",
          key: "storagePlace",
          align: "left",
          minWidth: 100
        },
        {
          title: "提货数量(件)",
          key: "number",
          align: "right",
          minWidth: 100
        },
        {
          title: "单件重量(吨)",
          key: "perAmount",
          align: "right",
          minWidth: 100,
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.perAmount ? Number(params.row.perAmount).toFixed(4) : 0
            );
          }
        },
        {
          title: "提货总重量(吨)",
          key: "weight",
          align: "right",
          minWidth: 120,
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.weight ? Number(params.row.weight).toFixed(4) : 0
            );
          }
        },

        {
          title: "包装",
          key: "wrap",
          align: "left",
          minWidth: 100
        },
        {
          title: "外观",
          key: "appearance",
          align: "left",
          minWidth: 100
        },
        {
          title: "钢卷号/捆包号",
          key: "baleNumber",
          align: "left",
          minWidth: 120
        }
      ],
      tableColumns2: [
        {
          title: "提货车号",
          key: "carNum"
        },
        {
          title: "司机电话",
          key: "mobile"
        },
        {
          title: "司机姓名",
          key: "driver"
        },
        {
          title: "身份证号",
          key: "cardNum"
        }
      ]
    };
  },
  
  computed: {
    countEle: function() {
      let countNum = 0,
        countWeight = 0;
      if (this.form.deliveryItems) {
        for (var i = 0; i < this.form.deliveryItems.length; i++) {
          countNum =
            countNum +
            (this.form.deliveryItems[i].number
              ? parseInt(this.form.deliveryItems[i].number)
              : 0);
          countWeight =
            countWeight +
            (this.form.deliveryItems[i].weight
              ? parseFloat(this.form.deliveryItems[i].weight)
              : 0);
        }
      }
      return { countNum: countNum, countWeight: countWeight.toFixed(4) };
    }
  },
  created() {
    this.getDetail();
  },
  activated:function(){
    this.getDetail();
  },
  methods: {
    getDetail() {
      queryDeliveryDetail({
        id: this.$route.query.id
      }).then(res => {
        if (res.data.code == "200") {
          let data = res.data.data;
					this.form = data;
					this.settleTimeType=this.form.settleTimeType;
					if(this.settleTimeType==0 && this.tableColumns.length==20){
						this.tableColumns.splice(8,4)
					}
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    submitFun() {
      this.$Modal.confirm({
        title: "提示",
        content: "请确认是否审核通过？",
        onOk: () => {
          queryDeliveryAudit({
            id: this.$route.query.id,
            status: 1
          }).then(res => {
            if (res.data.code == "200") {
              this.$Message.success({
                content: "审核结果提交成功!",
                duration: 1
              });
              setTimeout(() => {
                closeNowTag(this.$store.state.app, this.$route);
                this.$router.push({
                  path: "PickGoodsManage"
                });
              }, 1000);
            } else {
              this.$Message.error(res.data.msg);
            }
          });
        },
        onCancel: () => {}
      });
    },
    backFun() {
      closeNowTag(this.$store.state.app, this.$route);
      this.$router.push({
        path: "PickGoodsManage"
      });
    }
  }
};
</script>
<style scoped>
.audit-pick-goods >>> .ivu-table-footer{
	height: 0px !important;
	line-height: 0px !important;
}
.audit-pick-goods  .other-price-info{
	height: 48px ;
	line-height: 48px ;
}
</style>



