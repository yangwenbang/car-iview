<template>
  <div class="white-bg device-manage">
    <Form :label-width="150" class="search-form">
      <Row type="flex" justify="space-between">
        <Col :sm="8" :xs="24">
          <FormItem label="用户名:">
            <Input v-model="searchForm.userName" placeholder="请输入用户名"></Input>
          </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
          <FormItem label="手机号:">
            <Input v-model="searchForm.mobile" placeholder="请输入手机号"></Input>
          </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
          <FormItem label="质检商家店面名称:">
            <Input v-model="searchForm.shopName" placeholder="请输入质检店面名称"></Input>
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
import { queryAccountList, resetPassword } from "@/api/user";
import { formatDate } from "@/libs/util";
export default {
  name: "UserList",
  data() {
    return {
      submitDisabled: false,
      pageNum: 1,
      total: 0,
      pageSize: 10,
      searchForm: {
        userName: "",
        mobile: "",
        shopName: ""
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
          title: "支付宝账号",
          key: "alipayAccount",
          minWidth: 100
        },
        {
          title: "微信账号",
          key: "wechatAccount",
          minWidth: 100
        },
        {
          title: "质检商家店面名称",
          key: "shopName",
          minWidth: 50
        },
        {
          title: "店面地址",
          key: "address",
          minWidth: 100
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
                     this.$Modal.confirm({
                        title: '重置密码',
                        content: '是否要重置该质检商家账号密码？',
                        onOk: () => {
                            let params = {
                                userId: data.row.userId
                            }
                            resetPassword(params).then(res => {
                                if (res.data.code == "200") {
                                    this.$Message.success({
                                        content: '重置密码成功',
                                        duration: 1
                                    });
                                    this.getAccountList(this.pageNum, this.pageSize)
                                } else {
                                    this.$Message.error({
                                        content: res.data.msg,
                                        duration: 1
                                    });
                                }
                            })
                        }
                    })
                  }
                }
              },
              "重置密码");
          }
        }
      ]
    };
  },
  methods: {
    search: function() {
      this.getAccountList(1, 10);
    },
    reset: function() {
        this.searchForm.userName = "",
        this.searchForm.mobile = "",
        this.searchForm.shopName = ""
    },

    getAccountList: function(pageNo, numPerPage) {
      let params = {
        userName: this.searchForm.userName,
        mobile: this.searchForm.mobile,
        shopName: this.searchForm.shopName,
        pageNo: pageNo,
        numPerPage: numPerPage,
        isPage: 1
      };
      queryAccountList(params).then(res => {
        if (res.data.code == "200") {
          this.tableData = res.data.data.recordList;
          this.total = res.data.data.totalCount;
          this.pageNum = res.data.data.currentPage;
          this.pageSize = res.data.data.numPerPage;
        }
      });
    },
    pageChange: function(value) {
      this.getAccountList(value, this.pageSize);
    },
    pageSizeChange: function(value) {
      this.getAccountList(this.pageNum, value);
    },
  },
  mounted: function() {
    this.getAccountList(1, 10);
  }
};
</script>

<style scoped>
.device-manage >>> .table-delete td {
  background-color: #f0f2f5;
}
</style>
