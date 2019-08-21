<template>
  <div class="white-bg device-manage">
    <Form :label-width="150" class="search-form">
      <Row type="flex" justify="space-between">
        <Col :sm="8" :xs="24">
          <FormItem label="单据类型:">
            <Select v-model="params.feeType" placeholder="全部" clearable>
              <Option
                v-for="(item,index) in feeTypeList"
                :value="item.value"
                :key="index"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
          <FormItem label="单号:">
            <Input v-model="params.buzCode"></Input>
          </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
          <FormItem label="状态:">
            <Select v-model="params.status" placeholder="全部" clearable>
              <Option
                v-for="(item,index) in statusList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
          <FormItem label="货主:">
            <Select v-model="params.ownerId" clearable filterable>
              <Option
                v-for="(item,index) in ownnerList"
                :value="item.id"
                :key="index"
              >{{ item.customerName }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
          <FormItem label="结算方式:">
            <Select v-model="params.settleType" placeholder="全部" clearable>
              <Option
                v-for="(item,index) in settleTypeList"
                :value="item.value"
                :key="index"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
          <FormItem label="结算客户:">
            <Select v-model="params.settleCustomerId" clearable filterable>
              <Option
                v-for="(item,index) in ownnerList"
                :value="item.id"
                :key="index"
              >{{ item.customerName }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
          <FormItem label="创建日期:">
            <DatePicker
              v-model="createDate"
              format="yyyy/MM/dd"
              type="daterange"
              placement="bottom-start"
              placeholder="请选择日期"
              style="width:100%;"
            ></DatePicker>
          </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
          <FormItem label="结算日期:">
            <DatePicker
              v-model="settleTime"
              format="yyyy/MM/dd"
              type="daterange"
              placement="bottom-start"
              placeholder="请选择日期"
              style="width:100%;"
            ></DatePicker>
          </FormItem>
        </Col>
        <Col :sm="8" :xs="24" class="text-right">
          <FormItem>
            <Button type="primary" @click="search">查询</Button>
            <Button style="margin-left: 8px" @click="reset">重置</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <Row>
      <Col span="24">
        <Button type="primary" class="margin-bottom-10" @click="collectMoney">批量收款</Button>
        <Button style="margin-left: 8px" class="margin-bottom-10" @click="exportExcel">导出报表</Button>
        <div class="pull-right count-content"><span class="margin-right-10">合计：<b class="tip">{{this.totalAmount}}</b> 元</span> </div>
      </Col>
    
    </Row>
  
    <Table :columns="tableColumns" :data="tableData" @on-selection-change="selectionChange" border></Table>

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
    </div>
    <work-order
      ref="modalChild"
      :type="type"
      :chargeId="chargeId"
      :settleCustomerId="settleCustomerId"
      :buzId="buzId"
      :showModal="showModal"
      @hide-modal="hideModel"
      @re-search="search"
    ></work-order>
  </div>
</template>

<script>
import {
  queryChargeList,
  chargePayment,
  chargeExportExcel,
  invokeChargePayment
} from "@/api/financial";
import { commonQueryOwners } from "@/api/common";
import { formatDate, formatPrice } from "@/libs/util";
import WorkOrder from "./components/WorkOrder";
export default {
  components: { WorkOrder },
  data() {
    return {
      submitDisabled:false,
      chargeId: 0,
      buzId:0,
      settleCustomerId: null,
      showModal: false,
      tableCheckList: "",
      chargeIds: [],
      pageNum: 1,
      totalAmount: 0,
      total: 0,
      pageSize: 10,
      createDate: [],
      settleTime: [],
      type: 0,
      params: {
        feeType: "",
        buzCode: "",
        status: "",
        ownerId: "",
        settleCustomerId: null,
        settleType: "",
        settleStartTime: "",
        settleEndTime: "",
        createStartTime: "",
        createEndTime: ""
      },
      searchParams: {
        feeType: "",
        buzCode: "",
        status: "",
        ownerId: "",
        settleCustomerId: null,
        settleType: "",
        settleStartTime: "",
        settleEndTime: "",
        createStartTime: "",
        createEndTime: ""
      },
      ownnerList: [],
      settleCustomerList: [],
      settleTypeList: [
        {
          label: "现结",
          value: 0
        },
        {
          label: "月结",
          value: 1
        },
        {
          label: "其他",
          value: 2
        }
      ],
      statusList: [
        {
          label: "待收款",
          value: 0
        },
        {
          label: "已收款",
          value: 1
        },
        {
          label: "已取消",
          value: 9
        }
      ],
      feeTypeList: [
        {
          label: "加工单",
          value: 0
        },
        {
          label: "出库单",
          value: 1
        },
        {
          label: "提货单",
          value: 2
        },
        {
          label: "过户单",
          value: 3
        }
        
      ],
      tableData: [],
      tableColumns: [
        {
          type: "selection",
          width: 60,
          align: "center"
          // render:
        },
        {
          title: "单据类型",
          key: "feeType",
          align: "left",
          minWidth: 50,
          render: (h, data) => {
            if (data.row.feeType == "0") {
              return h("span", "加工单");
            } else if (data.row.feeType == "1") {
              return h("span", "出库单");
            } else if (data.row.feeType == "2") {
              return h("span", "提货单");
            } else if (data.row.feeType == "3") {
              return h("span", "过户单");
            }
          }
        },
        {
          title: "单号",
          key: "buzCode",
          minWidth: 140
        },
        {
          title: "状态",
          key: "status",
          align: "left",
          minWidth: 200,
          render: (h, data) => {
            if (data.row.status == "0") {
              return h("Tag",{class:"ivu-tag-blue"},"待收款");
            } else if (data.row.status == "1") {
              return h("Tag", {class:"ivu-tag-green"},"已收款");
            } else if (data.row.status == "9") {
              return h("Tag",{class:"ivu-tag-default"}, "已取消");
            }
          }
        },
        {
          title: "货主",
          key: "ownerName",
          align: "left",
          minWidth: 120
        },
        {
          title: "结算客户",
          key: "settleCustomerName",
          align: "left",
          minWidth: 120
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
          title: "创建日期",
          key: "createTime",
          align: "left",
          minWidth: 200
        },
        {
          title: "结算日期",
          key: "payTime",
          align: "left",
          minWidth: 120
        },

        {
          title: "总金额(元)",
          key: "amount",
          align: "right",
          minWidth: 120,
          render: (h, data) => {
            return h("span", formatPrice(data.row.amount));
          }
        },
        {
          title: "操作",
          key: "",
          fixed: "right",
          minWidth: 120,
          render: (h, data) => {
            let child = [
              h(
                "span",
                {
                  class: "tb-link margin-left-10",
                  on: {
                    click: () => {
                      if (data.row.feeType == 0) {
                        this.$router.push({
                          name: "ProcessBillDetail",
                          query: {
                            processId: data.row.buzId
                          }
                        });
                      } else if (data.row.feeType == 1) {
                        this.$router.push({
                          name: "ViewOutstockSettlement",
                          query: { id: data.row.buzId }
                        });
                      } else if (data.row.feeType == 2) {
                        this.$router.push({
                          name: "ViewPickGoods",
                          query: { id: data.row.buzId }
                        });
                      } else if (data.row.feeType == 3) {
                        this.$router.push({
                          name: "ViewTransfer",
                          query: { transferId: data.row.buzId }
                        });
                      }
                    }
                  }
                },
                "查看"
              ),
              h(
                "span",
                {
                  class: "tb-link margin-left-10",
                  on: {
                    click: () => {
                      if (data.row.feeType == "0") {
                        this.type = 0;
                        this.modalTitle = "加工单收款";
                        this.showModal = true;
                        this.chargeId = data.row.chargeId;
                        this.$nextTick(() => {
                          //调用子组件的方法
                          this.$refs.modalChild.getList();
                        });
                      } else if (data.row.feeType == "1") {
                        this.type = 1;
                        this.modalTitle = "出库单收款";
                        this.showModal = true;
                        this.chargeId = data.row.chargeId;
                        this.$nextTick(() => {
                          //调用子组件的方法
                          this.$refs.modalChild.getList();
                        });
                      } else if (data.row.feeType == "2") {
                        this.type = 2;
                        this.modalTitle = "提货单收款";
                        this.showModal = true;
                        this.chargeId = data.row.chargeId;
                        this.$nextTick(() => {
                          //调用子组件的方法
                          this.$refs.modalChild.getList();
                        });
                      } else if (data.row.feeType == "3") {
                        this.type = 3;
                        this.modalTitle = "过户单收款";
                        this.showModal = true;
                        this.chargeId = data.row.chargeId;
                        this.buzId = data.row.buzId;
                        this.settleCustomerId = data.row.settleCustomerId;
                        this.$nextTick(() => {
                          //调用子组件的方法
                          this.$refs.modalChild.getList();
                        });
                      }
                    }
                  }
                },
                "收款"
              )
            ];
            if (data.row.status == 1) {
              child.pop();
            }
            return h("div", child);
          }
        }
      ]
    };
  },
  methods: {
    search: function() {
      this.searchParams.createStartTime = this.createDate[0]
        ? formatDate(this.createDate[0])
        : "";
      this.searchParams.createEndTime = this.createDate[1]
        ? formatDate(this.createDate[1])
        : "";
      this.searchParams.settleStartTime = this.settleTime[0]
        ? formatDate(this.settleTime[0])
        : "";
      this.searchParams.settleEndTime = this.settleTime[1]
        ? formatDate(this.settleTime[1])
        : "";
      this.searchParams.feeType = this.params.feeType;
      this.searchParams.buzCode = this.params.buzCode;
      this.searchParams.ownerId = this.params.ownerId;
      this.searchParams.settleCustomerId = this.params.settleCustomerId;
      this.searchParams.settleType = this.params.settleType;
      this.searchParams.status = this.params.status;
      this.pageChange(1);
    },
    reset: function() {
      this.params.feeType = "";
      this.params.buzCode = "";
      this.params.ownerId = "";
      this.params.settleCustomerId = "";
      this.params.settleType = "";
      this.params.status = "";
      (this.createDate = []), (this.settleTime = []);
    },
    exportExcel() {
      window.open(
        "/api/pwms/inventory/charge/chargeExportExcel?feeType=" +
          this.searchParams.feeType +
          "&buzCode=" +
          this.searchParams.buzCode +
          "&status=" +
          this.searchParams.status +
          "&ownerId=" +
          this.searchParams.ownerId +
          "&settleCustomerId=" +
          (this.searchParams.settleCustomerId ? this.searchParams.settleCustomerId : 0) +
          "&settleType=" +
          this.searchParams.settleType +
          "&settleStartTime=" +
          this.searchParams.settleStartTime +
          "&settleEndTime=" +
          this.searchParams.settleEndTime +
          "&createStartTime=" +
          this.searchParams.createStartTime +
          "&createEndTime=" +
          this.searchParams.createEndTime
      );
    },
    selectionChange: function(selection) {
      let temp = selection.map(item => {
        return item;
      });
      this.tableCheckList = temp;
    },
    collectMoney: function() {
      if (this.tableCheckList.length < 1) {
        this.$Modal.warning({
          title: "提示",
          content: "请至少选择一个订单"
        });
      } else {
        this.$Modal.confirm({
          title: "信息确认",
          content: "将对选择的订单中全部未收款订单执行收款操作，是否继续？",
          onOk: () => {
            if(!this.submitDisabled){
              this.submitDisabled = true;
              this.chargeIds = [];
              this.tableCheckList.map(item => {
                this.chargeIds.push(item.chargeId);
              });
              invokeChargePayment({
                chargeIds: this.chargeIds,
                settleCustomerId: 0,
                settleCustomerName: ""
              }).then(res => {
                if (res.data.code == "200") {
                  this.$Message.success("收款成功！");
                  this.search();
                } else {
                  this.$Message.error(res.data.msg);
                }
                setTimeout(() => {
                    this.submitDisabled = false;
                }, 1000);
              });
            }
          }
        });
      }
    },
    /**确认收款 */
    hideModel(data) {
      this.showModal = false;
      if (data) {
        this.getOwnerList();
      }
    },
    getOwnerList() {
      commonQueryOwners().then(res => {
        this.ownnerList = res.data.data;
      });
    },
    getFinancialList() {
      const data = {
        feeType: this.searchParams.feeType,
        buzCode: this.searchParams.buzCode,
        ownerId: this.searchParams.ownerId,
        settleCustomerId: this.searchParams.settleCustomerId,
        settleType: this.searchParams.settleType,
        settleStartTime: this.searchParams.settleStartTime,
        settleEndTime: this.searchParams.settleEndTime,
        createStartTime: this.searchParams.createStartTime,
        createEndTime: this.searchParams.createEndTime,
        status: this.searchParams.status,
        pageNo: this.pageNum,
        numPerPage: this.pageSize
      };
      queryChargeList(data).then(res => {
        if (res.data.code == "200") {
          const data = res.data.data;
          this.tableData = (data ? data.pageResultDTO.recordList : []).map(
            o => {
              if (o.status != 0) {
                o._disabled = true;
              } else {
                o._disabled = false;
              }
              return o;
            }
          );
          this.totalAmount = data.totalAmount;
          this.total = data.pageResultDTO.totalCount;
          this.pageNum = data.pageResultDTO.currentPage;
          this.pageSize = data.pageResultDTO.numPerPage;
        }
      });
    },
    pageChange(page) {
      this.pageNum = page;
      this.getFinancialList();
    },
    pageSizeChange(pagesize) {
      this.pageNum = 1;
      this.pageSize = pagesize;
      this.getFinancialList();
    }
  },
  mounted: function() {
    this.getOwnerList();
    this.getFinancialList();
  }
};
</script>

<style scoped>
.device-manage >>> .table-delete td {
  background-color: #f0f2f5;
}
</style>