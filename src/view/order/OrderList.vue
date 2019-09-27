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
              <DatePicker v-model="createTime" type="daterange" placement="bottom-end" placeholder="请选择下单时间"></DatePicker>
            </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
          <FormItem label="订单状态:">
            <Select v-model="searchForm.payStatus" clearable>
              <Option :value="0">待付款</Option>
              <Option :value="1">已付款</Option>
              <Option :value="2">已发货</Option>
              <Option :value="3">已收货</Option>
              <Option :value="4">退款审核中</Option>
              <Option :value="5">退款中</Option>
              <Option :value="6">已退款</Option>
              <Option :value="7">退款已拒绝</Option>
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
      <Modal ref="modal" v-model="modal" :title="modalTitle" width="40%" style="text-align:center;" @on-ok="delivery">
            <Form :model="orderInfo" :label-width="100">
              <Row type="flex" justify="space-between">
                <Col :span="12">
                  <div class="img-upload">
                    <div class="demo-upload-list" v-for="item in uploadList">
                      <template v-if="item.status === 'finished'">
                        <img :src="item.url">
                        <div class="demo-upload-list-cover">
                          <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                          <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                        </div>
                      </template>
                      <template v-else>
                        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                      </template>
                    </div>
                    <Upload
                      ref="upload"
                      :show-upload-list="false"
                      :on-success="handleSuccess"
                      :format="['jpg','jpeg','png']"
                      :max-size="8*1024"
                      :on-format-error="handleFormatError"
                      :on-exceeded-size="handleMaxSize"
                      :before-upload="handleBeforeUpload"
                      type="drag"
                      action="/car/qualityshop/uploadPicture"
                      style="display: inline-block;width:150px;"
                    >
                      <div style="width: 150px;height:150px;line-height:148px;">
                        <Icon type="ios-camera" size="24"></Icon>
                         <span>上传运费发票</span>
                      </div>
                    </Upload>
                  </div>
                </Col>
                <Col :span="12">
                  <FormItem label="商品订单号:">
                      <Input v-model="orderInfo.orderNo" readonly></Input>
                  </FormItem>
                  <FormItem label="买家用户名:">
                      <Input v-model="orderInfo.userName" readonly></Input>
                  </FormItem>
                  <template v-for="commodity in orderInfo.commodityInfos">
                    <FormItem label="商品标题:">
                        <Input v-model="commodity.commodityName" readonly></Input>
                    </FormItem>
                    <FormItem label="一口价:">
                      <div class="input-price">
                        <Input v-model="commodity.price" readonly></Input>
                        <span class="tr-span">￥</span>
                      </div>
                    </FormItem>
                  </template>
                  <FormItem label="付款金额:">
                    <div class="input-price">
                      <Input v-model="orderInfo.payMoney" readonly></Input>
                      <span class="tr-span">￥</span>
                    </div>
                  </FormItem>
                  <FormItem label="收货人:">
                      <Input v-model="orderInfo.receiptUserName" readonly></Input>
                  </FormItem>
                  <FormItem label="收货人手机号:">
                      <Input v-model="orderInfo.receiptMobile" readonly></Input>
                  </FormItem>
                  <FormItem label="收货地址:">
                      <Input v-model="orderInfo.receiveAddress" readonly></Input>
                  </FormItem>
                  <FormItem label="物流单号:" required>
                      <Input v-model="orderInfo.logisticsCode"></Input>
                  </FormItem>
                  <FormItem label="运费:" required>
                    <div class="input-price">
                      <Input v-model="orderInfo.freight"></Input>
                      <span class="tr-span">￥</span>
                    </div>
                  </FormItem>
                  </Col>
            </Row>
              </Form>
            <div slot="footer" style="text-align:center">
                <Button type="dashed"  @click="cancel">取消</Button>
                <Button type="primary" @click="delivery" style="background-color: #fbc647;border: #fbc647;" :disabled="submitDisabled">发货</Button>
            </div>
        </Modal>
    </div>
  </div>
</template>

<script>
import { queryOrderList, queryOrderInfo, deliveryGoods } from "@/api/order";
import { formatDate, formatSeconds, formatPrice } from "@/libs/util";
export default {
  name: "OrderList",
  data() {
    return {
      submitDisabled: false,
      pageNum: 1,
      total: 0,
      pageSize: 10,
      createTime: [],
      searchForm: {
        orderNo: "",
        userName: "",
        commodityCode: "",
        payStatus: "",
        startCreateTime: "",
        endCreateTime: "",
      },
      modal: false,
      modalTitle: '订单发货',
      imgName: "",
      imgUrl: "",
      visible: false,
      uploadList: [],
      orderInfo: {},
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
          minWidth: 80,
          render: (h, data) => {
            let statusText = "", statusClass="";
            switch(data.row.payStatus) {
                case 0:
                    statusText = "待付款";
                    statusClass = "ivu-tag-warning";
                    break;
                case 1:
                    statusText = "已付款";
                    statusClass = "ivu-tag-cyan";
                    break;
                case 2:
                    statusText = "已发货";
                    statusClass = "ivu-tag-orange";
                    break;
                case 3:
                    statusText = "已收货";
                    statusClass = "ivu-tag-success";
                    break;
                case 4:
                    statusText = "退款审核中";
                    statusClass = "ivu-tag-geekblue";
                    break;
                case 5:
                    statusText = "退款中";
                    statusClass = "ivu-tag-volcano";
                    break;
                case 6:
                    statusText = "已退款";
                    statusClass = "ivu-tag-purple";
                    break;
                case 7:
                    statusText = "退款已拒绝";
                    statusClass = "ivu-tag-red";
                    break;
                case 9:
                    statusText = "已取消";
                    statusClass = "ivu-tag-default";
                    break;
                case 10:
                    statusText = "已删除";
                    statusClass = "ivu-tag-magenta";
                    break;
            }
            return h("Tag", {class: statusClass}, statusText);
          }
        },
        {
          title: "商品编号",
          key: "commodityCode",
          minWidth: 80
        },
        {
          title: "商品名称",
          key: "commodityName",
          minWidth: 100
        },
        {
          title: "买家名称",
          key: "userName",
          minWidth: 50
        },
        {
          title: "付款总金额(元)",
          key: "payMoney",
          minWidth: 50,
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
          minWidth: 120,
          render: (h, data) => {
            if(data.row.createTime) {
              return h("span", formatSeconds(data.row.createTime));
            }
          }
        },
        {
          title: "付款时间",
          key: "payDate",
          minWidth: 120,
          render: (h, data) => {
            if(data.row.payDate) {
              return h("span", formatSeconds(data.row.payDate));
            }
          }
        },
        {
          title: "发货时间",
          key: "deliveryTime",
          minWidth: 120,
          render: (h, data) => {
             if(data.row.deliveryTime) {
              return h("span", formatSeconds(data.row.deliveryTime));
             }
          }
        },
        {
          title: "收货地址",
          key: "receiveAddress",
          minWidth: 120
        },
        {
          title: "物流单号",
          key: "logisticsCode",
          minWidth: 100
        },
        {
          title: "确认收货时间",
          key: "receiptTime",
          minWidth: 120,
          render: (h, data) => {
            if(data.row.receiptTime) {
              return h("span", formatSeconds(data.row.receiptTime));
            }
          }
        },
        {
          title: "操作",
          key: "",
          fixed: "right",
          minWidth: 100,
          render: (h, data) => {
            if(data.row.payStatus == 1) {
              return h("span",
                {
                  class: "tb-link margin-right-10",
                  on: {
                    click: () => {
                      let params = {
                        id: data.row.id
                      }
                      queryOrderInfo(params).then(response => {
                         if (response.data.code == "200") {
                           this.orderInfo = response.data.data;
                           this.modal = true;
                         }else {
                           this.$Message.error("查询订单详情失败" + response.data.msg)
                         }
                      })
                    }
                  }
                },
              "发货");
            }else if(data.row.payStatus == 5 ) {
              return h("span",
                {
                  class: "tb-link margin-right-10",
                  on: {
                    click: () => {

                    }
                  }
                },
              "退款");
            }
          }
        }
      ]
    };
  },
  methods: {
    search: function() {
      this.searchForm.startCreateTime = this.createTime[0] ? formatDate(this.createTime[0]):'';
      this.searchForm.endCreateTime = this.createTime[1] ? formatDate(this.createTime[1]):'';
      this.queryOrderList(1, 10);
    },
    reset: function() {
      this.createTime = [],
      this.searchForm.orderNo = "",
      this.searchForm.userName = "",
      this.searchForm.commodityCode = "",
      this.searchForm.payStatus = "",
      this.searchForm.startCreateTime = "",
      this.searchForm.endCreateTime = ""
    },

    delivery() {
      if(this.orderInfo.freight == null || this.orderInfo.freight == "") {
        this.$Message.error("请填写运费!");
        return;
      }
      if(this.orderInfo.logisticsCode == null || this.orderInfo.logisticsCode == "") {
         this.$Message.error("请填写物流单号!");
        return;
      }
      if(this.orderInfo.freightPicturesUrls == null || this.orderInfo.freightPicturesUrls == "") {
         this.$Message.error("请上传运费发票!");
        return;
      }
      let params = {
        freight: this.orderInfo.freight,
        freightPicturesUrls: this.orderInfo.freightPicturesUrls,
        id: this.orderInfo.id,
        logisticsCode: this.orderInfo.logisticsCode
      }
      deliveryGoods(params).then(res => {
         if (res.data.code == "200") {
          this.$Message.info("订单发货成功!");
          window.location.reload();
          this.$router.push({
            name: "OrderList",
          });
        }else {
          this.$Message.error("订单发货失败" + res.data.msg);
        }
      })

    },

    queryOrderList: function(pageNo, numPerPage) {
      let data = {
        orderNo: this.searchForm.orderNo,
        userName: this.searchForm.userName,
        commodityCode: this.searchForm.commodityCode,
        payStatus: this.searchForm.payStatus,
        startCreateTime: this.searchForm.startCreateTime,
        startCreateTime: this.searchForm.startCreateTime,
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
        }else {
          this.$Message.error("查询订单列表失败" + res.data.msg);
        }
      });
    },

    handleView(item) {
      this.imgName = item.name;
      this.imgUrl = item.url;
      this.visible = true;
    },
    handleRemove(file) {
      this.uploadList.splice(this.uploadList.indexOf(file), 1);
    },
    handleSuccess(res, file) {
      if (res.code == "200") {
        file.url = "http://" + res.data;
      } else {
        this.$Message.error(res.msg);
      }
      this.uploadList.push(file);
      this.orderInfo.freightPicturesUrls = file.url;
    },
    handleBeforeUpload() {
      const check = this.uploadList.length < 1;
      if (!check) {
        this.$Message.info("最多上传1张运费发票图片.");
      }
      return check;
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "文件格式不正确",
        desc: "文件格式 " + file.name + " 不正确, 请选择 jpg 、jpeg 、 png文件."
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "文件大小超限",
        desc: "文件  " + file.name + " 太大，上传文件大小不能超过8M."
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

.tr-span {
  position: absolute;
  left: 6px;
  top: 0px;
  font-size: 14px;
}

.input-price /deep/ input {
  padding: 5px 20px;
}

.img-upload /deep/ .ivu-icon-ios-camera {
  vertical-align: middle;
}

.img-upload {
    position: absolute;
    display: inline-block;
    top: 30%;
    left: 30%;
}

.demo-upload-list {
  display: inline-block;
  width: 150px;
  height: 150px;
  text-align: center;
  line-height: 150px;
  border: 1px solid transparent;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
  margin-right: 8px;
}

.demo-upload-list img {
  width: 100%;
  height: 100%;
}

.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}

.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}

.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
