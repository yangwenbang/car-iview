<template>
  <div class="white-bg device-manage">
    <Table
      :columns="tableColumns"
      :data="tableData"
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
import { queryCategory } from "@/api/commodity";
import { formatDate } from "@/libs/util";
export default {
  name: "CategoryList",
  data() {
    return {
      submitDisabled: false,
      pageNum: 1,
      total: 0,
      pageSize: 10,
      categoryList: [],
      tableData: [],
      tableColumns: [
        {
          title: "分类名称",
          key: "categoryName",
          minWidth: 140
        },
        {
          title: "分类顺序",
          key: "seq",
          minWidth: 140
        },
        {
          title: "操作",
          key: "",
          fixed: "right",
          minWidth: 50
        }
      ]
    };
  },
  methods: {
    submit: function() {
    },
    pageChange: function(value) {
      this.getCategoryList(value, this.pageSize);
    },
    pageSizeChange: function(value) {
      this.getCategoryList(this.pageNum, value);
    },
    getCategoryList(pageNo, numPerPage) {
        debugger
      var that = this;
      let params = {
        pageNo: pageNo,
        numPerPage: numPerPage,
        // 是否分页，0-不分页 1-分页
        isPage: 1
      };
      queryCategory(params).then(res => {
        if (res.data.code == "200") {
          this.tableData = res.data.data.recordList;
          this.total = res.data.data.totalCount;
          this.pageNum = res.data.data.currentPage;
          this.pageSize = res.data.data.numPerPage;
        }else {
            this.$Message.error("查询分类失败" + rdata.msg)
        }
      });
    }
  },
  created: function() {
    this.getCategoryList(1,10);
  }
};
</script>

<style scoped>
.device-manage >>> .table-delete td {
  background-color: #f0f2f5;
}
</style>
