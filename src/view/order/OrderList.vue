<template>
  <div class="white-bg device-manage">
    <Form :label-width="150" class="search-form">
      <Row type="flex" justify="space-between">
        <Col :sm="8" :xs="24">
          <FormItem label="商品订单号:">
             <Input v-model="searchForm.orderNo" placeholder="请输入商品订单号"></Input>
          </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
          <FormItem label="商品编号:">
            <Input v-model="searchForm.commodityCode" placeholder="请输入商品编号"></Input>
          </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
          <FormItem label="买家用户名称:">
            <Input v-model="searchForm.userName" placeholder="请输入买家用户名称"></Input>
          </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
            <FormItem label="下单时间:" required>
              <DatePicker v-model="searchForm.createTime" type="daterange" format="yyyy-MM-dd"   placeholder="请选择下单时间"></DatePicker>
            </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
          <FormItem label="订单状态:">
            <Select v-model="searchForm.payStatus" clearable>
              <Option :value="0">待付款</Option>
              <Option :value="1">已付款</Option>
              <Option :value="2">已发货</Option>
              <Option :value="3">已收货</Option>
              <Option :value="4">待退款</Option>
              <Option :value="5">退款中</Option>
              <Option :value="6">已退款</Option>
              <Option :value="7">退款拒绝</Option>
              <Option :value="9">已取消</Option>
              <Option :value="10">已删除</Option>
            </Select>
          </FormItem>
        </Col>
        <Col :span="24" class="text-right">
          <FormItem>
            <Button type="primary" @click="search">查询</Button>
            <Button style="margin-left: 8px" @click="reset">重置</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <Table :columns="tableColumns" :data="tableData" border></Table>
    <div class="page-wrapper">
      <div v-if="this.$store.state.app.screenSize>768">
        <span class="left">共{{total}}条记录 第{{pageNum}}页 / 共{{Math.ceil(total / pageSize)}}页</span>
        <Page
          class="pull-right"
          :current="pageNum"
          :total="total"
          :page-size="pageSize"
          @on-change="pageChange"
          @on-page-size-change="pageSizeChange"
          show-sizer
          show-elevator
        />
      </div>
      <div v-if="this.$store.state.app.screenSize<=768">
        <Page
          class="pull-right"
          :current="pageNum"
          :page-size="pageSize"
          :total="total"
          @on-change="pageChange"
          simple
        />
      </div>
      <Modal ref="modal" v-model="modal" :title="modalTitle" style="text-align:center" @on-ok="submit">
            <Form :model="paymentForm" :label-width="100">
                <FormItem label="商品订单号:">
                    <Input v-model="paymentForm.orderNo" readonly></Input>
                </FormItem>
                <FormItem label="打款金额:">
                    <Input v-model="paymentForm.money" readonly></Input>
                </FormItem>
                <FormItem label="收款人真实姓名:">
                    <Input v-model="paymentForm.payeeRealName" readonly></Input>
                </FormItem>
                <FormItem label="收款人类型:">
                    <Input v-model="paymentForm.payeeType" readonly></Input>
                </FormItem>
            </Form>
            <div slot="footer" style="text-align:center">
                <Button type="dashed"  @click="cancel">取消</Button>
                <Button type="primary" @click="submit" style="background-color: #fbc647;border: #fbc647;" :disabled="submitDisabled">确认打款</Button>
            </div>
        </Modal>
    </div>
  </div>
</template>

<script>
import { queryOrderList, queryOrderInfo, deliveryGoods } from "@/api/order";
import { formatDate, formatPrice } from "@/libs/util";
export default {
  name: "OrderList",
  data() {
    return {
      submitDisabled: false,
      pageNum: 1,
      total: 0,
      pageSize: 10,
      searchForm: {
        orderNo: "",
        userName: "",
        commodityCode: "",
        payStatus: "",
        createTime: ""
      },
      modal: false,
      modalTitle: '确认打款?',
      paymentForm: {
        paymentRecordId: "",
        orderNo: "",
        money: "",
        payeeRealName: "",
        payeeType: ""
      },
      tableData: [],
      tableColumns: [
        {
          title: "商品订单号",
          key: "orderNo",
          minWidth: 100
        },
        {
          title: "订单状态",
          key: "payStatus",
          minWidth: 50,
          render: (h, data) => {
            if (data.row.payStatus == "0") {
              return h("span", "待付款");
            } else if (data.row.payStatus == "1") {
              return h("span", "已付款");
            } else if (data.row.payStatus == "2") {
              return h("span", "已发货");
            }
            else if (data.row.payStatus == "3") {
              return h("span", "已收货");
            }
            else if (data.row.payStatus == "4") {
              return h("span", "待退款");
            }
            else if (data.row.payStatus == "5") {
              return h("span", "退款中");
            }
            else if (data.row.payStatus == "6") {
              return h("span", "已退款");
            }
            else if (data.row.payStatus == "7") {
              return h("span", "退款拒绝");
            } else if (data.row.payStatus == "9") {
              return h("span", "已取消");
            }
            else if (data.row.payStatus == "10") {
              return h("span", "已删除");
            }
          }
        },
        {
          title: "商品编号",
          key: "commodityCode",
          minWidth: 50
        },
        {
          title: "商品名称",
          key: "commodityName",
          minWidth: 50
        },
        {
          title: "买家名称",
          key: "userName",
          minWidth: 50
        },
        {
          title: "付款总金额(元)",
          key: "payMoney",
          minWidth: 100,
          render: (h, data) => {
              return h("span", formatPrice(data.row.payMoney));
          }
        },
        {
          title: "付款方式",
          key: "payType",
          minWidth: 50,
          render: (h, data) => {
            if (data.row.payType == "0") {
              return h("span", "支付宝");
            } else if (data.row.payType == "1") {
              return h("span", "微信");
            }
          }
        },
        {
          title: "下单时间",
          key: "createTime",
          minWidth: 50,
          render: (h, data) => {
              return h("span", formatDate(data.row.createTime));
          }
        },
        {
          title: "付款时间",
          key: "payDate",
          minWidth: 50,
          render: (h, data) => {
              return h("span", formatDate(data.row.payDate));
          }
        },
        {
          title: "发货时间",
          key: "deliveryTime",
          minWidth: 50,
          render: (h, data) => {
              return h("span", formatDate(data.row.deliveryTime));
          }
        },
        {
          title: "收货地址",
          key: "receiveAddress",
          minWidth: 100
        },
        {
          title: "物流单号",
          key: "logisticsCode",
          minWidth: 50
        },
        {
          title: "确认收货时间",
          key: "receiptTime",
          minWidth: 60,
          render: (h, data) => {
              return h("span", formatDate(data.row.receiptTime));
          }
        },
        {
          title: "操作",
          key: "",
          fixed: "right",
          minWidth: 100,
          render: (h, data) => {
            if(data.row.status == 0) {
              return h("span",
                {
                  class: "tb-link margin-right-10",
                  on: {
                    click: () => {
                        this.paymentForm.paymentRecordId = data.row.id;
                        this.paymentForm.orderNo = data.row.orderNo;
                        this.paymentForm.money = formatPrice(data.row.money);
                        this.paymentForm.payeeRealName = data.row.payeeRealName;
                        this.paymentForm.payeeType = data.row.payeeType == 0 ? "商品卖家" : "质检商家";
                        this.modal = true;
                    }
                  }
                },
              "打款");
            }
          }
        }
      ]
    };
  },
  methods: {
    search: function() {
      this.queryOrderList(1, 10);
    },
    reset: function() {
      this.searchForm.orderNo = "",
      this.searchForm.userName = "",
      this.searchForm.commodityCode = "",
      this.paymentForm.payStatus = "",
      this.searchForm.createTime = ""
    },
    submit: function() {
      this.submitDisabled = true;
      let data = {
        paymentRecordId: this.paymentForm.paymentRecordId
      };
      paymentRecord(data).then(res => {
        if (res.data.code == "200") {
          this.$Message.success({
            content: "打款成功",
            duration: 1
          });
          this.modal = false;
          this.queryPaymentRecordList(this.pageNum, this.pageSize);
        } else {
          this.$Message.error({
            content: res.data.msg,
            duration: 1
          });
        }
        setTimeout(() => {
          this.submitDisabled = false;
        }, 1000);
      });
    },
    queryOrderList: function(pageNo, numPerPage) {
      let data = {
        orderNo: this.searchForm.orderNo,
        userName: this.searchForm.userName,
        commodityCode: this.searchForm.commodityCode,
        payStatus: this.searchForm.payStatus,
        createTime: this.searchForm.createTime,
        pageNo: pageNo,
        numPerPage: numPerPage,
        isPage: 1
      };
      queryOrderList(data).then(res => {
        if (res.data.code == "200") {
          this.tableData = res.data.data.recordList;
          this.total = res.data.data.totalCount;
          this.pageNum = res.data.data.currentPage;
          this.pageSize = res.data.data.numPerPage;
        }
      });
    },
    cancel: function() {
        this.modal = false;
    },
    pageChange: function(value) {
      this.queryOrderList(value, this.pageSize);
    },
    pageSizeChange: function(value) {
      this.queryOrderList(this.pageNum, value);
    }
  },
  mounted: function() {
    this.queryOrderList(1, 10);
  }
};
</script>

<style scoped>
.device-manage >>> .table-delete td {
  background-color: #f0f2f5;
}
</style>
