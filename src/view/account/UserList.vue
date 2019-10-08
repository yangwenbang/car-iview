<template>
  <div class="white-bg device-manage">
    <Form :label-width="150" class="search-form">
      <Row type="flex" justify="space-between">
        <Col :sm="8" :xs="24">
          <FormItem label="用户类型:">
            <Select v-model="searchForm.userType" clearable>
              <Option :value="0">终端用户</Option>
              <Option :value="1">商家用户</Option>
              <!-- <Option :value="2">系统用户</Option> -->
              <Option :value="3">管理员</Option>
            </Select>
          </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
            <FormItem label="创建时间:">
              <DatePicker v-model="createTime" type="daterange" placement="bottom-end" placeholder="请选择创建时间"></DatePicker>
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
import { queryUserList } from "@/api/user";
import { formatDate } from "@/libs/util";
export default {
  name: "UserList",
  data() {
    return {
      pageNum: 1,
      total: 0,
      pageSize: 10,
      createTime: [],
      searchForm: {
        userType: "",
        startDate: "",
        endDate: ""
      },
      tableData: [],
      tableColumns: [
        {
          title: "用户名称",
          key: "userName",
          minWidth: 50
        },
        {
          title: "联系方式",
          key: "mobile",
          minWidth: 100
        },
        {
          title: "创建时间",
          key: "createTime",
          minWidth: 100,
        },
        {
          title: "用户类型",
          key: "userType",
          minWidth: 100,
          render: (h, data) => {
            if (data.row.userType == "0") {
              return h("span", "终端用户");
            } else if (data.row.userType == "1") {
              return h("span", "商家用户");
            } else if (data.row.userType == "3") {
              return h("span", "管理员");
            }
          }
        },
        {
          title: "是否是超管",
          key: "isAdmin",
          minWidth: 100,
          render: (h, data) => {
            if (data.row.isAdmin == "0") {
              return h("span", "否");
            } else if (data.row.isAdmin == "1") {
              return h("span", "是");
            }
          }
        }
      ]
    };
  },
  methods: {
    search: function() {
      this.searchForm.startDate = this.createTime[0] ? formatDate(this.createTime[0]) : '';
      this.searchForm.endDate = this.createTime[1] ? formatDate(this.createTime[1]) : '';
      this.getUserList(1, 10);
    },

    reset: function() {
        this.createTime = [],
        this.searchForm.userType = "",
        this.searchForm.startDate = "",
        this.searchForm.endDate = ""
    },

    getUserList: function(pageNo, numPerPage) {
      let params = {
        userType: this.searchForm.userType,
        startDate: this.searchForm.startDate,
        endDate: this.searchForm.endDate,
        pageNo: pageNo,
        numPerPage: numPerPage,
        isPage: 1
      };
      queryUserList(params).then(res => {
        if (res.data.code == "200") {
          this.tableData = res.data.data.recordList;
          this.total = res.data.data.totalCount;
          this.pageNum = res.data.data.currentPage;
          this.pageSize = res.data.data.numPerPage;
        }
      });
    },

    pageChange: function(value) {
      this.getUserList(value, this.pageSize);
    },

    pageSizeChange: function(value) {
      this.getUserList(this.pageNum, value);
    },
  },

  mounted: function() {
    this.getUserList(1, 10);
  }
};
</script>

<style scoped>
.device-manage >>> .table-delete td {
  background-color: #f0f2f5;
}
</style>
