<template>
    <div class="white-bg">
        <Form :label-width="150" class="search-form">
            <Row type="flex" justify="space-between">
                <Col :sm="8" :xs="24">
                <FormItem label="提货单号:">
                    <Input v-model="params.deliveryCode"></Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="出库结算单号:">
                    <Input v-model="params.outSettleCode"></Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="提货日期:">
                    <DatePicker v-model="inputDate" type="daterange" placement="bottom-end" placeholder="请选择日期"></DatePicker>
                </FormItem>
                </Col>
            </Row>
            <Row type="flex" justify="space-between">
                <Col :sm="8" :xs="24">
                <FormItem label="货主:">
                    <Select v-model="params.ownerId" filterable clearable>
                        <Option v-for="(item,index) in ownnerList" :value="item.id" :key="index">{{ item.customerName }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="提货客户:">
                    <Select v-model="params.deliveryCustomerId" filterable clearable>
                        <Option v-for="(item,index) in ownnerList" :value="item.id" :key="index">{{ item.customerName }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="状态:">
                    <Select v-model="params.status" clearable placeholder="所有">
                        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                </Col>
            </Row>
            <Row type="flex" justify="space-between">
                <Col :sm="8" :xs="24">
                <FormItem label="放货单号:">
                  <Input v-model="params.releaseCode"></Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="结算客户:">
                    <Select v-model="params.settleCustomerId" filterable clearable>
                        <Option v-for="(item,index) in ownnerList" :value="item.id" :key="index">{{ item.customerName }}</Option>
                    </Select>
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
            <Button type="default" class="margin-bottom-10 margin-right-10" @click="bulkDel">批量删除</Button>
            </Col>
        </Row>
        <Table :row-class-name="rowClassName" :columns="tableColumns" :data="tableData" border @on-selection-change="getSelected"></Table>
        <div class="page-wrapper">
            <div v-if="this.$store.state.app.screenSize>768">
                <span class="left">共{{total}}条记录 第{{pageNum}}页 / 共{{Math.ceil(total / pageSize)}}页 </span>
                <Page class="pull-right" :current="pageNum" :total="total" :page-size="pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size-opts="pageSizeOpts" show-sizer show-elevator/>
            </div>
            <div v-if="this.$store.state.app.screenSize<=768">
                <Page class="pull-right" :current="pageNum" :page-size="pageSize" :total="total" @on-change="pageChange" simple />
            </div>
        </div>
        <Modal v-model="modal" title="录入磅重" width="70%" @on-ok="doOk" @on-cancel="doCancel">
          <Table :columns="modalTableColumns" :data="modalTableData" border>
            <template slot-scope="{ row, index }" slot="weighedWeight">
              <InputNumber v-model="row.weighedWeight" :min="0" :parser="inputWeight"  @on-change="changeWeighedWeight(index,$event)" class="input-number-no-operate"></InputNumber>
            </template>
          </Table>
      </Modal>
    </div>

</template>
<script>
import { deliveryList, deleteDelivery, updateDeliveryItemWeighed, queryDeliveryDetail } from "@/api/outstock";
import { commonQueryOwners } from "@/api/common";
import { formatDate,formatWeight,decimalInput } from "@/libs/util";
export default {
  name: "PickGoodsManage",
  data() {
    return {
      params: {
        deliveryCode: "",
        outSettleCode: "",
        planDeliveryDateMin: "",
        planDeliveryDateMax: "",
        ownerId: "",
        status: "",
        deliveryCustomerId: '',
        releaseCode: '',
        settleCustomerId: ''
      },
      inputDate: [],
      searchParams: {
        deliveryCode: "",
        outSettleCode: "",
        planDeliveryDateMin: "",
        planDeliveryDateMax: "",
        ownerId: "",
        status: "",
        deliveryCustomerId: '',
        releaseCode: '',
        settleCustomerId: ''
      },
      pageSize: 10,
      pageNum: 1,
      pageSizeOpts: [10, 15, 20, 40, 50, 100],
      total: 0,
      checkedRow: [],
      ownnerList: [],
      statusList: [
        {
          value: "0",
          label: "待审核"
        },
        {
          value: "1",
          label: "已审核"
        },
        // {
        //   value: "2",
        //   label: "已出库"
        // },
        {
          value: "9",
          label: "已删除"
        }
      ],
      tableData: [],
      tableColumns: [
        {
          type: "selection",
          width: 40,
          align: "center"
        },
        {
          title: "提货单号",
          key: "deliveryCode",
          align: "left",
          minWidth: 140,
          render: (h, data) => {
            if (
              data.row.status != "0"
            ) {
              return h(
                "span",
                {
                  class: "tb-link",
                  on: {
                    click: () => {
                      this.$router.push({
                        name: "ViewPickGoods",
                        query:{id:data.row.id}
                      });
                    }
                  }
                },
                data.row.deliveryCode
              );
            } else {
              return h("span", {}, data.row.deliveryCode);
            }
          }
        },
        {
          title: "出库结算单号",
          key: "outSettleCode",
          align: "left",
          minWidth: 150,
          render: (h, data) => {
            return h(
              "span",
              {
                class: "tb-link",
                on: {
                  click: () => {
                    this.$router.push({
                      name: "ViewOutstockSettlement",
                      query:{id:data.row.outSettleId}
                    });
                  }
                }
              },
              data.row.outSettleCode
            );
          }
        },
        {
          title: "放货单号",
          key: "releaseCode",
          align: "left",
          minWidth: 150
        },
        {
          title: "货主",
          key: "ownerName",
          tooltip: true,
          ellipsis: true,
          align: "left",
          minWidth: 200
        },
        {
          title: "提货客户",
          key: "deliveryCustomerName",
          tooltip: true,
          ellipsis: true,
          align: "left",
          minWidth: 200
        },
        {
          title: "提货日期",
          key: "planDeliveryDate",
          align: "left",
          minWidth: 110
        },
        {
          title: "提货数量(件)",
          key: "deliveryNumber",
          align: "right",
          minWidth: 100
        },
        {
          title: "提货重量(吨)",
          key: "deliveryWeight",
          align: "right",
          minWidth: 120,
          render: (h, params) => {
            return h("span", {}, Number(params.row.deliveryWeight).toFixed(4));
          }
        },
        {
          title: "备注",
          tooltip: true,
          ellipsis: true,
          key: "remark",
          align: "left",
          minWidth: 120
        },
        {
          title: "车号",
          key: "carnums",
          align: "left",
          tooltip: true,
          ellipsis: true,
          minWidth: 120
        },
        {
          title: "状态",
          key: "status",
          align: "left",
          minWidth: 120,
          render: (h, data) => {
            var statusTest = "",
              statusClass = "";
            if (data.row.status == "0") {
              statusTest = "待审核";
              statusClass = "ivu-tag-blue";
            } else if (data.row.status == "1") {
              statusTest = "已审核";
              statusClass = "ivu-tag-green";
            } else if (data.row.status == "9") {
              statusTest = "已删除";
              statusClass = "ivu-tag-default";
            } else if (data.row.status == "2") {
              statusTest = "已出库";
              statusClass = "ivu-tag-cyan";
            }
            return h("Tag", { class: statusClass }, statusTest);
          }
        },
        {
          title: "制单人",
          key: "creator",
          align: "right",
          minWidth: 80
        },
        {
          title: "制单时间",
          key: "createTime",
          align: "right",
          minWidth: 160
        },
        {
          title: "操作",
          align: "left",
          minWidth: 140,
          fixed: "right",
          render: (h, data) => {
            var h_edit = h(
              "span",
              {
                class: "tb-link margin-right-10",
                on: {
                  click: () => {
                    this.$router.push({
                      name: "EditPickGoods",
                      query:{id:data.row.id}
                    });
                  }
                }
              },
              "编辑"
            );
            var h_audit = h(
              "span",
              {
                class: "tb-link margin-right-10",
                on: {
                  click: () => {
                    this.$router.push({
                      name: "AuditPickGoods",
                      query:{id:data.row.id,type:data.row.settleTimeType}
                    });
                  }
                }
              },
              "审核"
            );
            var h_view = h(
              "span",
              {
                class: "tb-link margin-right-10",
                on: {
                  click: () => {
                    this.$router.push({
                      name: "ViewPickGoods",
                      query:{id:data.row.id}
                    });
                  }
                }
              },
              "查看"
            );
            var h_del = h(
              "span",
              {
                class: "tb-link color-red",
                on: {
                  click: () => {
                    this.$Modal.confirm({
                      title: "提示",
                      content: "<p>是否确认删除这条信息？</p>",
                      okText: "确认",
                      cancelText: "取消",
                      onOk: () => {
                        this.deleteFun(data.row.id);
                      }
                    });
                  }
                }
              },
              "删除"
            );
            var h_input = h(
              "span",
              {
                class: "tb-link margin-right-10",
                on: {
                  click: () => {
                    this.modal = true;
                    this.getDetail(data.row.id)
                  }
                }
              },
              "录入磅重"
            );
            return h(
              "div",
              (function() {
                var childs = [];
                var i;
                if (data.row.status == "0") {
                  childs.push(h_edit, h_audit, h_del);
                }
                if (data.row.status == "2" || data.row.status == "9" || data.row.status == "1") {
                  childs.push(h_view);
                }
                if (data.row.status == "1" && data.row.deliveryWeighedWeight <= 0) {
                  childs.push(h_input);
                }
                
                return childs;
              })()
            );
          }
        }
      ],
      deliveryId:'',
      modal: false,
      modalTableData:[],
      modalTableColumns: [
        {
          title: "编号",
          key: "code",
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
          minWidth: 150
        },
        {
          title: "过磅重量(吨)",
          slot: "weighedWeight",
          align: "left",
          minWidth: 140
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
    };
  },
  mounted() {
    //this.inputDate = this.resetDate();
    this.getList();
    this.getOwnerList();
    
  },
  activated(){
    this.getList();
  },
  methods: {
    inputWeight(value) {
      return decimalInput(value,12,4);
    },
    resetDate(){
      let now = new Date(); //当前日期
      this.searchParams.planDeliveryDateMin = formatDate(now);
      this.searchParams.planDeliveryDateMax = formatDate(now);
      return [now,now]
    },
    getOwnerList() {
      commonQueryOwners().then(res => {
        if (res.data.code == "200") {
          this.ownnerList = res.data.data;
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    rowClassName(row, index) {
      if (row.status == "0") {
        //待审核 0
        return "table-info-row1";
      } else if (row.status == "9") {
        //已删除9
        return "table-info-row2";
      }
      return "";
    },
    reset() {
      this.params = {
        deliveryCode: "",
        outSettleCode: "",
        planDeliveryDateMin: "",
        planDeliveryDateMax: "",
        ownerId: "",
        status: "",
        deliveryCustomerId: '',
        releaseCode: '',
        settleCustomerId: ''
      };
      this.inputDate = [];
    },
    search() {
      this.searchParams.planDeliveryDateMin = this.inputDate[0] ? formatDate(this.inputDate[0]) : "";
      this.searchParams.planDeliveryDateMax = this.inputDate[1] ? formatDate(this.inputDate[1]) : "";
      this.searchParams.deliveryCode = this.params.deliveryCode;
      this.searchParams.ownerId = this.params.ownerId;
      this.searchParams.outSettleCode = this.params.outSettleCode;
      this.searchParams.status = this.params.status;
      this.searchParams.deliveryCustomerId = this.params.deliveryCustomerId;
      this.searchParams.releaseCode = this.params.releaseCode;
      this.searchParams.settleCustomerId = this.params.settleCustomerId;
      this.pageChange(1);
    },
    getList() {
      const params = {
        deliveryCode: this.searchParams.deliveryCode,
        outSettleCode: this.searchParams.outSettleCode,
        planDeliveryDateMin: this.searchParams.planDeliveryDateMin,
        planDeliveryDateMax: this.searchParams.planDeliveryDateMax,
        ownerId: this.searchParams.ownerId,
        status: this.searchParams.status,
        deliveryCustomerId: this.searchParams.deliveryCustomerId,
        releaseCode: this.searchParams.releaseCode,
        settleCustomerId: this.searchParams.settleCustomerId,
        numPerPage: this.pageSize,
        pageNo: this.pageNum
      };
      deliveryList(params).then(res => {
        if (res.data.code == "200") {
          const data = res.data.data ? res.data.data : null;
          let data1 = data ? data.recordList : [];
          for (var i = 0; i < data1.length; i++) {
            if (data1[i].status != 0) {
              data1[i]._disabled = true;
            } else {
              data1[i]._disabled = false;
            }
          }
          this.tableData = data1;
          this.total = data ? data.totalCount : 0;
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    changeWeighedWeight(index, val) {
      let row = JSON.parse(JSON.stringify(this.modalTableData[index]));
      row.weighedWeight = val;
      this.modalTableData[index] = JSON.parse(JSON.stringify(row));
    },
    //正整数及小数点后4位
    changeNumDecimal(value) {
      if (value != "" && value.substr(0, 1) == ".") {
        value = "";
      }
      //清除“数字”和“.”以外的字符
      value = value.replace(/[^\d.]/g, ""); 
      //只保留第一个. 清除多余的
      value = value.replace(/\.{2,}/g, "."); 
      value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      //只能输入两个小数
      value = value.replace(/^(\-)*(\d+)\.(\d{0,4}).*$/, "$1$2.$3"); 
      if (String(value).indexOf(".") < 0 && value != "") {
        if (value.substr(0, 1) == "0" && value.length == 2) {
          value = value.substr(1, value.length);
        }
      }
      return value;
    },
    getSelected(selection) {
      this.checkedRow = selection;
    },
    bulkDel() {
      if (this.checkedRow.length > 0) {
        this.$Modal.confirm({
          title: "提示",
          content: "<p>是否确认删除所选项？</p>",
          okText: "确认",
          cancelText: "取消",
          onOk: () => {
            let ids = this.checkedRow.map(item => {
              return item.id;
            });
            this.deleteFun(ids.join(","));
          }
        });
      } else {
        this.$Modal.warning({
          title: "提示",
          content: "<p>请至少选择一条信息！</p>"
        });
      }
    },
    deleteFun(ids) {
      deleteDelivery({
        id: ids
      }).then(res => {
        if (res.data.code == "200") {
          this.getList();
          this.$Message.success({
            content: "删除成功!",
            duration: 1
          });
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    pageChange(page) {
      this.pageNum = page;
      this.getList();
    },
    pageSizeChange(pagesize) {
      this.pageNum = 1;
      this.pageSize = pagesize;
      this.getList();
    },
    getDetail(id) {
      queryDeliveryDetail({
        id: id
      }).then(res => {
        if (res.data.code == "200") {
          let data = res.data.data;
          this.modalTableData = data && data.deliveryItems ? data.deliveryItems:[];
          this.deliveryId = data.deliveryId;
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    doOk() {
      let deliveryItems = this.modalTableData.map(item => {
        return {
          weighedWeight: item.weighedWeight,
          itemId: item.itemId
        }
      })

      updateDeliveryItemWeighed({
        deliveryId: this.deliveryId,
        deliveryItems: deliveryItems
      }).then(res => {
        if(res.data.code == '200') {
          this.$Message.success('修改成功');
        } else {
          this.$Message.error(res.data ? res.data.msg : "");
        }
        this.modal = false;
        this.search();
      })
    },
    doCancel() {
      this.modal = false;
    }
  }
};
</script>
<style lang="less" scoped>
@deep: ~'>>>';
@{deep} .ivu-input, .ivu-input-number {
    width: 100%;
}
</style>


