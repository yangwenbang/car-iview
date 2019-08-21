<template>
  <Modal v-model="modal" :title="title" width="70%" @on-ok="doOk" @on-cancel="doCancel">
    <Table :columns="tableType" :data="tableData" border></Table>
  </Modal>
</template>
<script>
import { chargePayment, invokeChargePayment } from "@/api/financial";
import { transferQueryTransfer } from "@/api/outstock";
import { formatPrice } from "@/libs/util";
export default {
  name: "WorkOrder",
  props: {
    showModal: Boolean,
    chargeId: Number,
    settleCustomerId: Number,
    type: Number,
    buzId: Number
  },
  data() {
    return {
      submitDisabled:false,
      modal: this.showModal,
      title: "",
      ownnerList: [],
      tableColumns1: [
        {
          title: "单号",
          key: "buzCode",
          align: "left",
          minWidth: 100
        },
        {
          title: "货主",
          key: "ownerName",
          align: "left",
          minWidth: 100
        },
        {
          title: "结算客户",
          key: "settleCustomerName",
          align: "left",
          minWidth: 100
        },
        {
          title: "结算方式",
          key: "settleType",
          align: "left",
          minWidth: 120,
          render: (h, data) => {
            if (data.row.settleType == "0") {
              return h("span", "现结");
            } else if (data.row.settleType == "1") {
              return h("span", "月结");
            } else if (data.row.settleType == "2") {
              return h("span", "其他");
            }
          }
        },
        {
          title: "加工费用",
          key: "settleCharge",
          align: "right",
          minWidth: 100,
          render: (h, data) => {
            return h("span", formatPrice(data.row.settleCharge));
          }
        },
        {
          title: "其他费用",
          key: "otherCharge",
          align: "right",
          minWidth: 100,
          render: (h, data) => {
            return h("span", formatPrice(data.row.otherCharge));
          }
        },
        {
          title: "合计",
          key: "amount",
          align: "right",
          minWidth: 100,
          render: (h, data) => {
            return h("span", formatPrice(data.row.amount));
          }
        }
      ],
      tableColumns2: [
        {
          title: "单号",
          key: "buzCode",
          align: "left",
          minWidth: 100
        },
        {
          title: "货主",
          key: "ownerName",
          align: "left",
          minWidth: 100
        },
        {
          title: "结算客户",
          key: "settleCustomerName",
          align: "left",
          minWidth: 100
        },
        {
          title: "结算方式",
          key: "settleType",
          align: "left",
          minWidth: 120,
          render: (h, data) => {
            if (data.row.settleType == "0") {
              return h("span", "现结");
            } else if (data.row.settleType == "1") {
              return h("span", "月结");
            } else if (data.row.settleType == "2") {
              return h("span", "其他");
            }
          }
        },
        {
          title: "出库费用",
          key: "settleCharge",
          align: "right",
          minWidth: 100,
          render: (h, data) => {
            return h("span", formatPrice(data.row.settleCharge));
          }
        },
        {
          title: "其他费用",
          key: "otherCharge",
          align: "right",
          minWidth: 100,
          render: (h, data) => {
            return h("span", formatPrice(data.row.otherCharge));
          }
        },
        {
          title: "附加费",
          key: "extraCharge",
          align: "right",
          minWidth: 100,
          render: (h, data) => {
            return h("span", formatPrice(data.row.extraCharge));
          }
        },
        {
          title: "包装费",
          key: "packageCharge",
          align: "right",
          minWidth: 100,
          render: (h, data) => {
            return h("span", formatPrice(data.row.packageCharge));
          }
        },
        {
          title: "合计",
          key: "amount",
          align: "right",
          minWidth: 100,
          render: (h, data) => {
            return h("span", formatPrice(data.row.amount));
          }
        }
      ],
      tableColumns3: [
        {
          title: "单号",
          key: "buzCode",
          align: "left",
          minWidth: 100
        },
        {
          title: "货主",
          key: "ownerName",
          align: "left",
          minWidth: 100
        },
        {
          title: "结算客户",
          key: "settleCustomerName",
          align: "left",
          minWidth: 100
        },
        {
          title: "结算方式",
          key: "settleType",
          align: "left",
          minWidth: 120,
          render: (h, data) => {
            if (data.row.settleType == "0") {
              return h("span", "现结");
            } else if (data.row.settleType == "1") {
              return h("span", "月结");
            } else if (data.row.settleType == "2") {
              return h("span", "其他");
            }
          }
        },
        {
          title: "提货费用",
          key: "settleCharge",
          align: "right",
          minWidth: 100,
          render: (h, data) => {
            return h("span", formatPrice(data.row.settleCharge));
          }
        },
        {
          title: "其他费用",
          key: "otherCharge",
          align: "right",
          minWidth: 100,
          render: (h, data) => {
            return h("span", formatPrice(data.row.otherCharge));
          }
        },
        {
          title: "附加费",
          key: "extraCharge",
          align: "right",
          minWidth: 100,
          render: (h, data) => {
            return h("span", formatPrice(data.row.extraCharge));
          }
        },
        {
          title: "包装费",
          key: "packageCharge",
          align: "right",
          minWidth: 100,
          render: (h, data) => {
            return h("span", formatPrice(data.row.packageCharge));
          }
        },
        {
          title: "合计",
          key: "amount",
          align: "right",
          minWidth: 100,
          render: (h, data) => {
            return h("span", formatPrice(data.row.amount));
          }
        }
      ],
      tableColumns4: [
        {
          title: "单号",
          key: "buzCode",
          align: "left",
          minWidth: 100
        },
        {
          title: "货主",
          key: "ownerName",
          align: "left",
          minWidth: 100
        },
        {
          title: "结算客户",
          key: "settleCustomerId",
          align: "left",
          minWidth: 100,
          render: (h, params) => {
            return h(
              "Select",
              {
                props: {
                  value: params.row.settleCustomerId,
                  transfer: true
                },
                on: {
                  "on-change": event => {
                    this.tableData[params.index].settleCustomerId = event;
                    this.ownnerList.forEach(item => {
                      if (item.id == event) {
                        this.tableData[params.index].settleCustomerName =
                          item.customerName;
                      }
                    });
                  }
                }
              },
              this.ownnerList.map(item => {
                return h("Option", {
                  props: {
                    value: item.id,
                    label: item.customerName
                  }
                });
              })
            );
          }
        },
        {
          title: "结算方式",
          key: "settleType",
          align: "left",
          minWidth: 120,
          render: (h, data) => {
            if (data.row.settleType == "0") {
              return h("span", "现结");
            } else if (data.row.settleType == "1") {
              return h("span", "月结");
            } else if (data.row.settleType == "2") {
              return h("span", "其他");
            }
          }
        },
        {
          title: "过户费用",
          key: "settleCharge",
          align: "right",
          minWidth: 100,
          render: (h, data) => {
            return h("span", formatPrice(data.row.settleCharge));
          }
        },
        {
          title: "附加费",
          key: "extraCharge",
          align: "right",
          minWidth: 100,
          render: (h, data) => {
            return h("span", formatPrice(data.row.extraCharge));
          }
        },
        {
          title: "合计",
          key: "amount",
          align: "right",
          minWidth: 100,
          render: (h, data) => {
            return h("span", formatPrice(data.row.amount));
          }
        }
      ],
      tableData: []
    };
  },
  computed: {
    tableType() {
      if (this.type == 0) {
        this.title = "加工单收款";
        return this.tableColumns1;
      } else if (this.type == 1) {
        this.title = "出库单收款";
        return this.tableColumns2;
      } else if (this.type == 2) {
        this.title = "提货单收款";
        return this.tableColumns3;
      } else if (this.type == 3) {
        this.title = "过户单收款";
        return this.tableColumns4;
      }
    }
  },
  methods: {
    getList() {
      if (this.type == 3) {
        transferQueryTransfer({
          transferId: this.buzId
        }).then(res => {
          if (res.data.code == "200") {
            var data = res.data.data;
            this.ownnerList = [];
            this.ownnerList.push(
              {
                id: data.oldOwnerId,
                customerName: data.oldOwner
              },
              {
                id: data.newOwnerId,
                customerName: data.newOwner
              }
            );
          }
        });
      }
      chargePayment({
        chargeId: this.chargeId
      }).then(res => {
        if (res.data.code == "200") {
          const data = res.data.data;
          this.tableData = [
            {
              buzCode: data.buzCode,
              ownerName: data.ownerName,
              settleCustomerId: data.settleCustomerId,
              settleCustomerName: data.settleCustomerName,
              settleType: data.settleType,
              packageCharge: data.packageCharge,
              extraCharge: data.extraCharge,
              settleCharge: data.settleCharge,
              otherCharge: data.otherCharge,
              amount: data.amount
            }
          ];
        }
      });
    },
    doOk() {
      this.submitDisabled = true;
      invokeChargePayment({
        chargeIds: [this.chargeId],
        settleCustomerId:
          this.type == 3 &&
          this.tableData &&
          this.tableData[0] &&
          this.tableData[0].settleCustomerId
            ? this.tableData[0].settleCustomerId
            : 0,
        settleCustomerName:
          this.type == 3 &&
          this.tableData &&
          this.tableData[0] &&
          this.tableData[0].settleCustomerName
            ? this.tableData[0].settleCustomerName
            : ""
      }).then(res => {
        if (res.data.code == "200") {
          this.$Message.success("收款成功！");
          this.$emit("re-search", true);
        } else {
          this.$Message.error(res.data.msg);
        }
        setTimeout(() => {
            this.submitDisabled = false;
        }, 1000);
        this.$emit("hide-modal", true); //参数true是用来判断是点击了取消还是确认
      });
    },
    doCancel() {
      this.$emit("hide-modal");
      this.submitDisabled = false;
    }
  },
  watch: {
    showModal(newVal, oldVal) {
      this.modal = newVal;
    },
    chargeId(newVal, oldVal) {
      this.chargeId = newVal;
    },
    settleCustomerId(newVal, oldVal) {
      this.settleCustomerId = newVal;
    }
  }
};
</script>


