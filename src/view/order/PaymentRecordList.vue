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
          <FormItem label="收款人类型:">
            <Select v-model="searchForm.payeeType" clearable>
              <Option :value="0">商品卖家</Option>
              <Option :value="1">质检商家</Option>
            </Select>
          </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
          <FormItem label="付款人名称:">
            <Input v-model="searchForm.payerUserName" placeholder="请输入付款人名称"></Input>
          </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
          <FormItem label="收款人真实姓名:">
            <Input v-model="searchForm.payeeRealName" placeholder="请输入收款人真实姓名"></Input>
          </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
          <FormItem label="状态:">
            <Select v-model="searchForm.status" clearable>
              <Option :value="0">未打款</Option>
              <Option :value="1">已打款</Option>
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
import { paymentRecord, queryPaymentRecordList } from "@/api/order";
import { formatDate, formatPrice } from "@/libs/util";
export default {
  name: "PaymentRecordList",
  data() {
    return {
      submitDisabled: false,
      pageNum: 1,
      total: 0,
      pageSize: 10,
      searchForm: {
        orderNo: "",
        payeeType: "",
        payerUserName: "",
        payeeRealName: "",
        status: ""
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
          title: "打款金额(元)",
          key: "money",
          minWidth: 50,
          render: (h, data) => {
              return h("span", formatPrice(data.row.money));
          }
        },
        {
          title: "付款人付款总金额(元)",
          key: "payerMoney",
          minWidth: 100,
          render: (h, data) => {
              return h("span", formatPrice(data.row.payerMoney));
          }
        },
        {
          title: "收款人真实姓名",
          key: "payeeRealName",
          minWidth: 100
        },
        {
          title: "收款人类型",
          key: "payeeType",
          minWidth: 50,
          render: (h, data) => {
            if (data.row.payeeType == "0") {
              return h("span", "商品卖家");
            } else if (data.row.payeeType == "1") {
              return h("span", "质检商家");
            }
          }
        },
         {
          title: "收款类型",
          key: "paymentType",
          minWidth: 50,
          render: (h, data) => {
            if (data.row.paymentType == "0") {
              return h("span", "支付宝");
            } else if (data.row.payeeType == "1") {
              return h("span", "微信");
            }
          }
        },
        {
          title: "付款人名称",
          key: "payerUserName",
          minWidth: 50
        },
        {
          title: "付款人手机号",
          key: "payerMobile",
          minWidth: 50
        },
        {
          title: "收款人手机号",
          key: "payeeMobile",
          minWidth: 50
        },
        {
          title: "打款交易单号",
          key: "paymentNo",
          minWidth: 140
        },
        {
          title: "备注",
          key: "remark",
          minWidth: 140
        },
        {
          title: "状态",
          key: "status",
          minWidth: 50,
          render: (h, data) => {
            if (data.row.status == "0") {
              return h("span", "未打款");
            } else if (data.row.status == "1") {
              return h("span", "已打款");
            }
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
      this.queryPaymentRecordList(1, 10);
    },
    reset: function() {
      this.searchForm.orderNo = "",
      this.searchForm.payeeRealName = "",
      this.searchForm.payerUserName = "",
      this.paymentForm.payeeType = "",
      this.searchForm.status = ""
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
    queryPaymentRecordList: function(pageNo, numPerPage) {
      let data = {
        orderNo: this.searchForm.orderNo,
        payeeType: this.searchForm.payeeType,
        payerUserName: this.searchForm.payerUserName,
        payeeRealName: this.searchForm.payeeRealName,
        status: this.searchForm.status,
        pageNo: pageNo,
        numPerPage: numPerPage,
        isPage: 1
      };
      queryPaymentRecordList(data).then(res => {
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
      this.queryPaymentRecordList(value, this.pageSize);
    },
    pageSizeChange: function(value) {
      this.queryPaymentRecordList(this.pageNum, value);
    }
  },
  mounted: function() {
    this.queryPaymentRecordList(1, 10);
  }
};
</script>

<style scoped>
.device-manage >>> .table-delete td {
  background-color: #f0f2f5;
}
</style>
