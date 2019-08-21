<template>
  <div class="white-bg">
    <Form :label-width="150" class="search-form">
      <Row type="flex" justify="space-between">
        <Col :sm="8" :xs="24">
          <FormItem label="姓名:">
            <Input v-model="params.nickName"></Input>
          </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
          <FormItem label="对应仓库:">
            <Select v-model="params.warehouseId" clearable placeholder>
              <Option
                v-for="item in deviceList"
                :value="item.value"
                :key="item.value"
              >{{ item.label}}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
          <FormItem label="状态:">
            <Select v-model="params.status" clearable placeholder="全部">
              <Option
                v-for="item in statusList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}
              </Option>
            </Select>
          </FormItem>
        </Col>
        <Col :sm="24" :xs="24" class="text-right">
          <FormItem>
            <Button type="primary" @click="search">搜索</Button>
            <Button style="margin-left: 8px" @click="reset">重置</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <Row>
      <Col span="24">
        <router-link to="StorehouseAdd">
          <Button type="primary" class="margin-bottom-10 margin-right-10">新增账号</Button>
        </router-link>
      </Col>
    </Row>
    <Table :columns="tableColumns" :row-class-name="rowClassName" :data="tableData" border></Table>
    <Modal ref="modal" v-model="showModal" width="416" >
      <div class="ivu-modal-confirm">
        <div class="ivu-modal-confirm-head">
          <div class="ivu-modal-confirm-head-icon ivu-modal-confirm-head-icon-confirm">
            <i class="ivu-icon ivu-icon-ios-help-circle"></i>
          </div>
          <div class="ivu-modal-confirm-head-title">信息确认！</div>
        </div>
        <div class="ivu-modal-confirm-body">
          <div>是否确认重置密码?</div>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" @click="resetPasswordFun(getId)">确定</Button>
      </div>
    </Modal>
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
          simple />
      </div>
    </div>
  </div>
</template>
<script>
import {
  accountList,
  banAccount,
  deleteAccount,
  resetPassword,
  getWarehouse
} from "@/api/account";
export default {
  name: "StorehouseAccount",
  data() {
    return {
      deviceList: [],
      params: {
        nickName: "",
        warehouseId: '',
        status: ""
      },
      searchParams: {
        //搜索参数
        nickName: "",
        warehouseId: '',
        status: ""
      },
      statusList: [
        {
          value: 0,
          label: "启用中"
        },
        {
          value: 1,
          label: "禁用中"
        }
      ],
      showModal: false,
      modalTitle: "确认信息!",
      getId: "",
      pageSize: 10,
      pageNum: 1,
      pageSizeOpts: [10, 15, 20, 40, 50, 100],
      total: 0,
      tableColumns: [
        {
          title: "ID",
          key: "id",
          align: "left",
          minWidth: 100
        },
        {
          title: "状态",
          key: "status",
          align: "left",
          minWidth: 100,
          render: (h, data) => {
            let statusTest = "",
              statusClass = "";
            if (data.row.auditStatus == "0") {
              return "";
            } else {
              if (data.row.status == "1") {
                statusTest = "禁用中";
                statusClass = "ivu-tag-red";
              } else if (data.row.status == "0") {
                statusTest = "启用中";
                statusClass = "ivu-tag-green";
              } else {
                return "";
              }
            }
            return h("Tag", { class: statusClass }, statusTest);
          }
        },
        {
          title: "姓名",
          key: "nickName",
          align: "left",
          minWidth: 140
        },
        {
          title: "用户名",
          key: "userName",
          minWidth: 140
        },
        {
          title: "对应仓库",
          key: "warehouseName",
          minWidth: 140
        },
        {
          title: "备注",
          key: "remark",
          minWidth: 60,
          ellipsis: true,
          tooltip: true
        },
        {
          title: "操作",
          key: "operate",
          fixed: "right",
          width: 320,
          minWidth: 320,
          render: (h, data) => {
            if (data.row.status != "9") {
              let child = [
                h(
                  "span",
                  {
                    class: "tb-link margin-right-10",
                    on: {
                      click: () => {
                        this.$router.push({
                          name: "StorehouseCheck",
                          query: { id: data.row.id }
                        });
                      }
                    }
                  },
                  "查看"
                ),
                h(
                  "span",
                  {
                    class: "tb-link margin-right-10",
                    on: {
                      click: () => {
                        this.$router.push({
                          name: "StorehouseEdit",
                          query: { id: data.row.id }
                        });
                      }
                    }
                  },
                  "修改"
                ),
                h(
                  "span",
                  {
                    class: "tb-link margin-right-10 tb-link-orange",
                    on: {
                      click: () => {
                        this.showModal = true;
                        this.getId = data.row.id;
                      }
                    }
                  },
                  "重置密码"
                ),
                h(
                  "span",
                  {
                    class: "tb-link margin-right-10 color-red",
                    on: {
                      click: () => {
                        this.$Modal.confirm({
                          title: "信息确认！",
                          content: "是否确定删除?",
                          onOk: () => {
                            this.deleteFun(data.row.id);
                          },
                          onCancel: () => {}
                        });
                      }
                    }
                  },
                  "删除"
                ),
                h(
                  "span",
                  {
                    class: "tb-link margin-right-10",
                    on: {
                      click: () => {
                        this.$router.push({
                          name: "StorehousePower",
                          query: {
                            id: data.row.id
                          }
                        });
                      }
                    }
                  },
                  "权限配置"
                )
              ];
              if (data.row.status == 0) {
                child.push(
                  h(
                    "span",
                    {
                      class: "tb-link margin-right-10 color-red",
                      on: {
                        click: () => {
                          this.$Modal.confirm({
                            title: "信息确认",
                            content: "请确认是否停用？",
                            onOk: () => {
                              this.banAccountFun(data.row.id, 1);
                            }
                          });
                        }
                      }
                    },
                    "禁用"
                  )
                );
              } else {
                child.push(
                  h(
                    "span",
                    {
                      class: "tb-link margin-right-10 color-green",
                      on: {
                        click: () => {
                          this.$Modal.confirm({
                            title: "信息确认",
                            content: "是否要启用该账号？",
                            onOk: () => {
                              this.banAccountFun(data.row.id, 0);
                            }
                          });
                        }
                      }
                    },
                    "启用"
                  )
                );
              }
              return h("div", child);
            } else {
              return h("span", "");
            }
          }
        }
      ],
      tableData: []
    };
  },
  activated() {
    this.getList();
    this.getWarehouse();
  },
  created() {
    this.getList();
    this.getWarehouse();
  },
  methods: {
    rowClassName(row, index) {
      if (row.auditStatus == "0") {
        return "table-info-row1";
      }
      return "";
    },
    search() {
      this.searchParams.nickName = this.params.nickName;
      this.searchParams.status = this.params.status;
      this.searchParams.warehouseId = this.params.warehouseId;
      this.pageChange(1);
    },
    reset() {
      this.params = {
        name: "",
        status: "",
        warehouseId: ''
      };
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
    promiseAll() {
      let promiseArray = [];
      promiseArray.push(queryRole({ id: this.$route.query.id }));
      promiseArray.push(queryRightList());
      Promise.all(promiseArray).then(res => {
        if (res[0].data.code == 200) {
          this.params.rolename = res[0].data.data.name;
          this.params.remark = res[0].data.data.remark;
          this.rightList = res[0].data.data.rights;
        }
        if (res[1].data.code == 200) {
          this.tableData = res[1].data.data;
          res[0].data.data.rights.forEach((item, index) => {
            res[1].data.data.forEach((iitem, iindex) => {
              if (item.id == iitem.id) {
                this.tableData[iindex]._checked = true;
                this.tableCheckList.push(item.id);
              }
            });
          });
        }
      });
    },
    getList() {
      const para = {
        nickName: this.searchParams.nickName,
        status: this.searchParams.status,
        warehouseId:this.searchParams.warehouseId,
        pageNo: this.pageNum,
        numPerPage: this.pageSize
      };
      accountList(para).then(res => {
        if (res.data.code == "200") {
          const data = res.data.data ? res.data.data : null;
          let data1 = data ? data.recordList : [];
          this.tableData = data1;
          this.total = data ? data.totalCount : 0;
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    getWarehouse() {
      getWarehouse({}).then(res => {
        console.log(res.data.data)
        if (res.data.code == "200") {
          this.deviceList = res.data.data.map(o => {
            return {
              label: o.warehouseName,
              value: o.id
            };
          });
        }
      });
    },
    banAccountFun(id, status) {
      banAccount({
        userId: id,
        status: status
      }).then(res => {
        if (res.data.code == "200") {
          this.getList();
          this.$Message.success({
            content: res.data.data,
            duration: 1
          });
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    resetPasswordFun(id) {
      this.showModal = false;
      resetPassword({
        userId: id
      }).then(res => {
        if (res.data.code == "200") {
          this.$Modal.success({
            title: "信息确认",
            content: "重置密码为：" + res.data.data
          });
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    deleteFun(id) {
      deleteAccount({
        userId: id
      }).then(res => {
        if (res.data.code == "200") {
          this.getList();
          this.pageChange(1);
          this.$Message.success({
            content: res.data.data,
            duration: 1
          });
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    }
  }
};
</script>
