<template>
    <div class="white-bg">
        <Form :label-width="150" class="search-form">
            <Row type="flex" justify="space-between">
                <Col :sm="8" :xs="24">
                <FormItem label="库区编号:">
                    <Input v-model="params.areaName"></Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="管理员:">
                    <Select v-model="params.employeeId" filterable clearable>
                        <Option v-for="(item,index) in employeeIdList" :value="item.employeeId" :key="index">{{ item.employeeName }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="库区状态:">
                    <Select v-model="params.status">
                        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                </Col>
            </Row>
            <Row type="flex" justify="space-between">
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
            <Button type="primary" class="margin-bottom-10" @click="modalAdd = true">新增库区</Button>
            </Col>
        </Row>
        <Table :columns="tableColumns" :data="tableData" border></Table>
        <div class="page-wrapper">
            <div v-if="this.$store.state.app.screenSize>768">
                <span class="left">共{{total}}条记录 第{{pageNum}}页 / 共{{Math.ceil(total / pageSize)}}页 </span>
                <Page class="pull-right" :current="pageNum" :total="total" :page-size="pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size-opts="pageSizeOpts" show-sizer show-elevator/>
            </div>
            <div v-if="this.$store.state.app.screenSize<=768">
                <Page class="pull-right" :current="pageNum" :page-size="pageSize" :total="total" @on-change="pageChange" simple />
            </div>
        </div>
        <Modal v-model="modalAdd" title="新增库区">
            <Form :label-width="100" ref="formAdd" :model="paramsAdd">
                <Row>
                    <Col :sm="24" :xs="24">
                    <FormItem label="库区编号:" prop="areaName" :rules="{required: true, message: '请输入库区编号', trigger: 'blur'}">
                        <Input v-model="paramsAdd.areaName" :maxlength="20"></Input>
                    </FormItem>
                    </Col>
                    <Col :sm="24" :xs="24">
                    <FormItem label="管理员:">
                        <Select v-model="paramsAdd.employeeId" label-in-value @on-change="changeEmployeeAdd" filterable clearable>
                            <Option v-for="(item,index) in employeeIdList" :value="item.employeeId" :key="index">{{ item.employeeName }}</Option>
                        </Select>
                    </FormItem>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="addOk" :disabled="submitDisabled">确认新增</Button>
                <Button @click="modalAdd=false">关闭</Button>
            </div>
        </Modal>
        <Modal v-model="modalEdit" title="修改库区">
            <Form :label-width="100" ref="formEdit" :model="paramsEdit">
                <Row>
                    <Col :sm="24" :xs="24">
                    <FormItem label="库区编号:" prop="areaName" :rules="{required: true, message: '请输入库区编号', trigger: 'blur'}">
                        <Input v-model="paramsEdit.areaName" :maxlength="20"></Input>
                    </FormItem>
                    </Col>
                    <Col :sm="24" :xs="24">
                    <FormItem label="管理员:">
                        <Select v-model="paramsEdit.employeeId" label-in-value @on-change="changeEmployeeEdit" filterable clearable>
                            <Option v-for="(item,index) in employeeIdList" :value="item.employeeId" :key="index">{{ item.employeeName }}</Option>
                        </Select>
                    </FormItem>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="addOk1" :disabled="submitDisabled">确认修改</Button>
                <Button @click="modalEdit=false">关闭</Button>
            </div>
        </Modal>
    </div>

</template>
<script>
import { commonEmployees } from "@/api/common";
import {
  storeAreaList,
  storeAreaAdd,
  storeAreaEdit,
  storeUpdateStatus
} from "@/api/store";
import { setTimeout } from "timers";
export default {
  name: "StoreAreaMaintain",
  data() {
    return {
      submitDisabled:false,
      params: {
        areaName: "",
        employeeId: "",
        status: ""
      },
      searchParams: {
        //搜索参数
        areaName: "",
        employeeId: "",
        status: ""
      },
      paramsAdd: {
        areaName: "",
        employeeId: 0,
        employeeName: ""
      },
      paramsEdit: {
        id: "",
        status: "",
        areaName: "",
        employeeId: 0,
        employeeName: ""
      },
      employeeIdList: [],
      statusList: [
        {
          value: "0",
          label: "启用中"
        },
        {
          value: "1",
          label: "停用中"
        }
      ],
      total: 0,
      pageSize: 10,
      pageNum: 1,
      pageSizeOpts: [10, 15, 20, 40, 50, 100],
      tableData: [],
      tableColumns: [
        {
          title: "库区编号",
          key: "areaName",
          align: "left",
          minWidth: 80
        },
        {
          title: "库区状态",
          key: "status",
          align: "center",
          minWidth: 80,
          render: (h, data) => {
            let statusTest = "",
              statusClass = "";
            if (data.row.status == "1") {
              statusTest = "停用中";
              statusClass = "ivu-tag-red";
            } else if (data.row.status == "0") {
              statusTest = "启用中";
              statusClass = "ivu-tag-green";
            } else {
              return "";
            }
            return h("Tag", { class: statusClass }, statusTest);
          }
        },
        {
          title: "原料数量（件）",
          key: "rawNumber",
          align: "right",
          minWidth: 100
        },
        {
          title: "成品数量（件）",
          key: "finishedFroducts",
          align: "right",
          minWidth: 100
        },
        {
          title: "管理员",
          key: "employeeName",
          align: "left",
          minWidth: 80
        },
        {
          title: "操作",
          key: "",
          align: "left",
          fixed: "right",
          minWidth: 160,
          render: (h, data) => {
            let newOperate;
            if (data.row.status == "0") {
              newOperate = h(
                "span",
                {
                  class: "tb-link color-red margin-left-10",
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: "提示",
                        content: "请确认是否停用？",
                        onOk: () => {
                          this.statusFun(data.row, 1);
                        },
                        onCancel: () => {}
                      });
                    }
                  }
                },
                "停用"
              );
            } else if (data.row.status == "1") {
              newOperate = h(
                "span",
                {
                  class: "tb-link color-green margin-left-10",
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: "提示",
                        content: "请确认是否启用？",
                        onOk: () => {
                          this.statusFun(data.row, 0);
                        },
                        onCancel: () => {}
                      });
                    }
                  }
                },
                "启用"
              );
            }
            return h("div", [
              h(
                "span",
                {
                  class: "tb-link",
                  on: {
                    click: () => {
                      this.paramsEdit = {
                        id:data.row.id,
                        status:data.row.status,
                        areaName: data.row.areaName,
                        employeeId: data.row.employeeId,
                        employeeName: data.row.employeeName
                      };
                      this.modalEdit = true;
                    }
                  }
                },
                "编辑"
              ),
              newOperate
            ]);
          }
        }
      ],
      modalAdd: false,
      modalEdit: false
    };
  },
  created() {
    this.getEmployee();
    this.getList();
  },
  methods: {
    getEmployee() {
      commonEmployees().then(res => {
        if (res.data.code == "200") {
          let resArr = res.data.data.map(item => {
            return {
              employeeId: item.employeeId ? item.employeeId.toString() : "",
              employeeName: item.employeeName
            };
          });
          this.employeeIdList = resArr;
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    changeEmployeeAdd(option) {
      if(option){
        this.paramsAdd.employeeName = option.label;
      }else{
        this.paramsAdd.employeeId = 0;
        this.paramsAdd.employeeName = "";
      }
    },
    changeEmployeeEdit(option) {
      if(option){
        this.paramsEdit.employeeName = option.label;
      }else{
        this.paramsEdit.employeeId = 0;
        this.paramsEdit.employeeName = "";
      }
    },
    addOk() {
      this.$refs["formAdd"].validate(valid => {
        if (valid) {
          this.submitDisabled = true;
          storeAreaAdd(this.paramsAdd).then(res => {
            if (res.data.code == "200") {
              this.$Message.success("新增成功！");
              this.getList();
              setTimeout(() => {
                this.modalAdd = false;
                this.paramsAdd = {
                  areaName: "",
                  employeeId: 0,
                  employeeName: ""
                };
              }, 1000);
            } else {
              this.$Message.error(res.data.msg);
            }
            setTimeout(() => {
              this.submitDisabled = false;
            }, 1000);
          });
        }
      });
    },
    addOk1() {
      this.$refs["formEdit"].validate(valid => {
        if (valid) {
          this.submitDisabled = true;
          storeAreaEdit(this.paramsEdit).then(res => {
            if (res.data.code == "200") {
              this.$Message.success("修改成功！");
              this.getList();
              setTimeout(() => {
                this.modalEdit = false;
                this.paramsEdit = {
                  id:"",
                  status:"",
                  areaName: "",
                  employeeId: 0,
                  employeeName: ""
                };
              }, 1000);
            } else {
              this.$Message.error(res.data.msg);
            }
            setTimeout(() => {
              this.submitDisabled = false;
            }, 1000);
          });
        }
      });
    },
    reset() {
      this.params = {
        areaName: "",
        employeeId: "",
        status: ""
      };
    },
    search() {
      this.searchParams.areaName = this.params.areaName;
      this.searchParams.employeeId = this.params.employeeId;
      this.searchParams.status = this.params.status;
      this.pageChange(1);
    },
    getList() {
      const para = {
        areaName: this.searchParams.areaName,
        employeeId: this.searchParams.employeeId,
        status: this.searchParams.status,
        numPerPage: this.pageSize,
        pageNo: this.pageNum
      };
      storeAreaList(para).then(res => {
        if (res.data.code == "200") {
          const data = res.data.data ? res.data.data : null;
          let data1 = data ? data.recordList : [];
          this.tableData = data1;
          this.total = data.totalCount;
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
    statusFun(row, flag) {
        let params = {
            id:row.id,
            status:flag
        };
      storeUpdateStatus(params).then(res => {
        if (res.data.code == "200") {
          this.getList();
          this.$Message.success({
            content: "状态修改成功!",
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



