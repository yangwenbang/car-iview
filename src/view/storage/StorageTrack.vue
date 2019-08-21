<template>
  <div class="white-bg">
    <div class="storagetarckTitle">
      货物类型：{{formateType}}
    </div>
    <Table
      border
      :columns="columns"
      :data="tabledata"
    ></Table>
    <div class="page-wrapper">
      <div v-if="this.$store.state.app.screenSize>768">
        <span class="left">共{{total}}条记录 第{{pageNum}}页 / 共{{Math.ceil(total / pageSize)}}页 </span>
        <Page
          class="pull-right"
          :current="pageNum"
          :total="total"
          :page-size="pageSize"
          @on-change="pageChange"
          @on-page-size-change="pageSizeChange"
          :page-size-opts="pageSizeOpts"
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
    <Modal
      v-model="modal"
      title="母卷信息"
    >
      <Row>
        <Col span="8"><span class="jumbo-roll">编号：{{parent.code}}</span></Col>
        <Col span="8"><span class="jumbo-roll">产地：{{parent.brandName}}</span></Col>
        <Col span="8"><span class="jumbo-roll">品名：{{parent.breedName}}</span></Col>
      </Row>
      <Row>
        <Col span="8"><span class="jumbo-roll">材质：{{parent.materialName}}</span></Col>
        <Col span="8"><span class="jumbo-roll">数量（件）：{{parent.number}}</span></Col>
        <Col span="8"><span class="jumbo-roll">单件重量（吨）：{{parent.perAmount}}</span></Col>
      </Row>
      <Row>
        <Col span="12"><span class="jumbo-roll">计重方式：{{weightType}}</span></Col>
        <Col span="12"><span class="jumbo-roll">钢卷号/捆包号：{{parent.baleNumber}}</span></Col>
      </Row>
      <Row>
        <Col span="12"><span class="jumbo-roll">包装：{{parent.wrap}}</span></Col>
        <Col span="12"><span class="jumbo-roll">外观：{{parent.appearance}}</span></Col>
      </Row>
      <div slot="footer">
        <Button
          type="info"
          size="large"
          long
          @click="modal=false"
        >确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { formatWeight } from "../../libs/util.js";
import { getStorageTrack, getParentInventory } from "@/api/storage";
export default {
  name: "StorageTrack",
  data() {
    return {
      id: 0,
      type: 0,
      tabledata: [],
      pageSize: 10,
      pageSizeOpts: [10, 15, 20, 40, 50, 100],
      pageNum: 1,
      total: 100,
      modal: false,
      parent: {},
      columns: [
        {
          title: "时间",
          key: "bookTime",
          align: "left"
        },
        {
          title: "日志类型",
          key: "bookType",
          align: "left",
          render: (h, data) => {
            let typeText = "";
            switch (data.row.bookType) {
              case 10:
                typeText = "现货入库";
                break;
              case 11:
                typeText = "过户入库";
                break;
              case 12:
                typeText = "加工入库";
                break;
              case 13:
                typeText = "调拨入库";
                break;
              case 14:
                typeText = "次品入库";
                break;
              case 15:
                typeText = "调整入库";
                break;
              case 20:
                typeText = "现货出库";
                break;
              case 21:
                typeText = "过户出库";
                break;
              case 22:
                typeText = "加工出库";
                break;
              case 23:
                typeText = "调拨出库";
                break;
              case 24:
                typeText = "次品出库";
                break;
              case 25:
                typeText = "调整出库";
                break;
              case 88:
                typeText = "盘赢";
                break;
              case 89:
                typeText = "盘亏";
                break;
              default:
                typeText = "";
                break;
            }
            return h("span", {}, typeText);
          }
        },
        {
          title: "数量（件）",
          align: "right",
          key: "number"
        },
        {
          title: "重量（吨）",
          align: "right",
          key: "weight",
          render: (h, data) => {
            return h("span", {}, formatWeight(data.row.weight));
          }
        },
        {
          title: "编号",
          align: "left",
          key: "code"
        },
        {
          title: "汇总ID",
          key: "summaryId"
        },
        {
          title: "产地",
          align: "left",
          key: "brandName"
        },
        {
          title: "品名",
          align: "left",
          key: "breedName"
        },
        {
          title: "材质",
          align: "left",
          key: "materialName"
        },
        {
          title: "规格",
          align: "left",
          key: "specName"
        },
        {
          title: "货主",
          align: "left",
          key: "ownerName"
        },
        {
          title: "库区库位",
          align: "right",
          key: "storageArea",
          render: (h, data) => {
            if (data.row.storageArea == "" && data.row.storagePlace == "") {
              return h("span", {}, "");
            } else {
              return h(
                "span",
                {},
                data.row.storageArea + "-" + data.row.storagePlace
              );
            }
          }
        }
      ]
    };
  },
  computed: {
    formateType: function() {
      if (this.type == 0) {
        return "原料";
      } else if (this.type == 1) {
        return "成品";
      } else if (this.type == 2) {
        return "废料";
      }
    },
    weightType: function() {
      if (this.parent.weightType == 0) {
        return "抄码";
      } else if (this.parent.weightType == 1) {
        return "过磅";
      } else {
        return "理重";
      }
    }
  },
  mounted() {
    this.id = this.$route.query.id;
    this.type = this.$route.query.type;
    this.getList({ inventoryItemId: this.id, numPerPage: 10 });
  },
  activated() {
    this.id = this.$route.query.id;
    this.type = this.$route.query.type;
    this.getList({ inventoryItemId: this.id, numPerPage: 10 });
  },
  methods: {
    getList: function(data) {
      getStorageTrack(data).then(res => {
        if ((res.data.code = "200")) {
          this.tabledata = res.data.data.recordList;
          this.total = res.data.data.totalCount;
          this.haveParent();
        }
      });
    },
    pageChange: function(page) {
      this.pageNum = page;
      this.getList({
        inventoryItemId: this.id,
        numPerPage: 10,
        pageNo: this.pageNum
      });
    },
    pageSizeChange: function(pagesize) {
      this.pageNum = 1;
      this.pageSize = pagesize;
      this.getList({
        inventoryItemId: this.id,
        numPerPage: this.pageSize,
        pageNo: this.pageNum
      });
    },
    haveParent: function() {
      if (
        this.tabledata[0].bookType == 12 &&
        this.type == 1 &&
        this.columns.length == 12
      ) {
        this.columns.splice(2, 0, {
          title: "母卷信息",
          align: "left",
          key: "",
          render: (h, data) => {
            if (data.row.bookType == 12) {
              return h(
                "span",
                {
                  class: "tb-link margin-left-10",
                  on: {
                    click: () => {
                      if (!this.parent.id) {
                        getParentInventory({ inventoryItemId: this.id }).then(
                          res => {
                            if (res.data.code == "200") {
                              if (res.data.data != null) {
                                this.parent = res.data.data;
                                this.modal = true;
                              } else {
                                this.$Modal.warning({
                                  title: "提示",
                                  content: "没有母卷信息"
                                });
                              }
                            } else {
                              this.$Message.error(res.data.msg);
                            }
                          }
                        );
                      } else {
                        this.modal = true;
                      }
                    }
                  }
                },
                "查看"
              );
            } else {
              return h("span", {}, "");
            }
          }
        });
      }
    }
  }
};
</script>
<style>
.storagetarckTitle {
  font-size: 16px;
  margin-bottom: 10px;
}
.jumbo-roll {
  display: inline-block;
  font-size: 14px;
  margin-top: 10px;
}
</style>


