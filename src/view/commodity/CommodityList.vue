<template>
  <div class="white-bg device-manage">
    <Form :label-width="150" class="search-form">
      <Row type="flex" justify="space-between">
        <Col :sm="8" :xs="24">
          <FormItem label="产品分类:">
            <Select v-model="searchForm.commodityCategoryId" clearable>
              <Option
                v-for="(item,index) in categoryList"
                :value="item.id"
                :key="index"
              >{{ item.categoryName }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
          <FormItem label="商品状态:">
            <Select v-model="searchForm.auditStatus" clearable>
              <Option :value="0">未上架</Option>
              <Option :value="1">已上架</Option>
              <Option :value="2">已下架</Option>
            </Select>
          </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
          <FormItem label="商品标题:">
            <Input v-model="searchForm.commodityName" placeholder="请输入商品标题"></Input>
          </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
          <FormItem label="商品编号:">
            <Input v-model="searchForm.commodityCode" placeholder="请输入商品订单号"></Input>
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
    <Table
      :columns="tableColumns"
      :row-class-name="rowClassName"
      :data="tableData"
      @on-selection-change="selectionChange"
      border
    ></Table>
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
  </div>
</template>

<script>
import { queryCategory, queryCommodityOrder } from "@/api/commodity";
import { formatDate } from "@/libs/util";
export default {
  name: "CommodityList",
  data() {
    return {
      submitDisabled: false,
      pageNum: 1,
      total: 0,
      pageSize: 10,
      searchForm: {
        commodityCategoryId: "",
        commodityName: "",
        commodityCode: "",
        auditStatus: ""
      },
      categoryList: [],
      tableData: [],
      tableColumns: [
        {
          title: "商品编号",
          key: "commodityCode",
          minWidth: 50
        },
        {
          title: "商品标题",
          key: "commodityName",
          minWidth: 100
        },
        {
          title: "商品状态",
          key: "auditStatus",
          minWidth: 50,
          render: (h, data) => {
            if (data.row.auditStatus == "0") {
              return h("span", {}, "未上架");
            } else if (data.row.auditStatus == "1") {
              return h("span", {}, "已上架");
            } else if (data.row.auditStatus == "2") {
              return h("span", {}, "已下架");
            }
          }
        },
        {
          title: "产品分类",
          key: "commodityCategoryName",
          minWidth: 50
        },
        {
          title: "商品类型",
          key: "commodityType",
          align: "left",
          minWidth: 50,
          render: (h, data) => {
            if (data.row.commodityType == "0") {
              return h("span", {}, "原厂");
            } else if (data.row.commodityType == "1") {
              return h("span", {}, "非原厂");
            }
          }
        },
        {
          title: "一口价",
          key: "price",
          minWidth: 50
        },
        {
          title: "创建时间",
          key: "createTime",
          align: "left",
          minWidth: 50
        },
        {
          title: "发布地址",
          key: "address",
          align: "left",
          minWidth: 120
        },
        {
          title: "操作",
          key: "",
          fixed: "right",
          minWidth: 140,
          render: (h, data) => {
            return h(
              "span",
              {
                class: "tb-link margin-right-10",
                on: {
                  click: () => {
                    this.$router.push({
                      name: "CommodityAdd",
                      query: {
                        commodityCode: data.row.commodityCode
                      }
                    });
                  }
                }
              },
              "查看");
          }
        }
      ]
    };
  },
  methods: {
    search: function() {
      this.queryCommoditys(1, 10);
    },
    reset: function() {
      this.searchForm.commodityCategoryId = "",
        this.searchForm.commodityName = "",
        this.searchForm.commodityCode = "",
        this.searchForm.auditStatus = ""
    },
    submit: function() {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.submitDisabled = true;
          let data = {
            deviceType: this.changeForm.deviceCode,
            deviceName: this.changeForm.deviceName,
            processMode: this.changeForm.processMode,
            brand: this.changeForm.brand,
            remark: this.changeForm.remark
          };

          data.id = this.updataId;
          updateDevice(data).then(res => {
            if (res.data.code == "200") {
              this.$Message.success({
                content: "信息修改成功",
                duration: 1
              });
              this.modal = false;
              this.queryCommodityOrder(this.pageNum, this.pageSize);
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
        }
      });
    },
    rowClassName: function(row, index) {
      if (row.status == "2") {
        return "table-delete";
      }
    },
    selectionChange: function(selection) {
      let temp = selection.map(item => {
        return item.id;
      });
      this.tableCheckList = temp.toString();
    },
    queryCommoditys: function(pageNo, numPerPage) {
      let data = {
        commodityCategoryId: this.searchForm.commodityCategoryId,
        commodityName: this.searchForm.commodityName,
        commodityCode: this.searchForm.commodityCode,
        auditStatus: this.searchForm.auditStatus,
        pageNo: pageNo,
        numPerPage: numPerPage,
        isPage: 1
      };
      queryCommodityOrder(data).then(res => {
        if (res.data.code == "200") {
          this.tableData = res.data.data.recordList.map(item => {
            if (item.status == "2") {
              item._disabled = true;
            }
            return item;
          });
          this.total = res.data.data.totalCount;
          this.pageNum = res.data.data.currentPage;
          this.pageSize = res.data.data.numPerPage;
        }
      });
    },
    pageChange: function(value) {
      this.queryCommoditys(value, this.pageSize);
    },
    pageSizeChange: function(value) {
      this.queryCommoditys(this.pageNum, value);
    },
    getCategoryList() {
      var that = this;
      let params = {
        pageNo: 1,
        numPerPage: 10,
        // 是否分页，0-不分页 1-分页
        isPage: 0
      };
      queryCategory(params).then(response => {
        let rdata = response.data;
        if (rdata.code == 200) {
          that.categoryList = rdata.data.recordList;
        } else {
          this.$Message.error("查询分类失败" + rdata.msg);
        }
      });
    }
  },
  created: function() {
    this.getCategoryList();
  },
  mounted: function() {
    this.queryCommoditys(1, 10);
  }
};
</script>

<style scoped>
.device-manage >>> .table-delete td {
  background-color: #f0f2f5;
}
</style>
