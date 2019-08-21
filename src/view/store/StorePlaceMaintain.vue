<template>
    <div class="white-bg">
        <Form :label-width="150" class="search-form">
            <Row type="flex" justify="space-between">
                <Col :sm="8" :xs="24">
                <FormItem label="编号:">
                    <Input v-model="params.locationName"></Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="管理员:">
                    <Select v-model="params.employeeId" filterable clearable>
                        <Option v-for="(item,index) in employeeIdList" :value="item.employeeId" :key="index">{{ item.employeeName }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24" class="text-right">
                <FormItem>
                    <Button type="primary" @click="search">搜索</Button>
                    <Button style="margin-left: 8px" @click="reset">重置</Button>
                </FormItem>
                </Col>
            </Row>
        </Form>
        <Row>
            <Col span="24">
            <Button type="primary" class="margin-bottom-10" @click="modalAdd = true">新增库位</Button>
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
        <Modal v-model="modalAdd" title="新增库位">
            <Form :label-width="100" ref="formAdd" :model="paramsAdd">
                <Row>
                    <Col :sm="24" :xs="24">
                    <FormItem label="库位编号:" prop="locationName" :rules="{required: true, message: '请输入库位编号', trigger: 'blur'}">
                        <Input v-model="paramsAdd.locationName" :maxlength="20"></Input>
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
        <Modal v-model="modalEdit" title="修改库位">
            <Form :label-width="100" ref="formEdit" :model="paramsEdit">
                <Row>
                    <Col :sm="24" :xs="24">
                    <FormItem label="库位编号:" prop="locationName" :rules="{required: true, message: '请输入库位编号', trigger: 'blur'}">
                        <Input v-model="paramsEdit.locationName" :maxlength="20"></Input>
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
  storeHouseList,
  storeHouseAdd,
  storeHouseEdit
} from "@/api/store";
import { setTimeout } from "timers";
export default {
  name: "StorePlaceMaintain",
  data() {
    return {
      submitDisabled:false,
      params: {
        locationName: "",
        employeeId: ""
      },
      searchParams: {
        //搜索参数
        locationName: "",
        employeeId: ""
      },
      paramsAdd: {
        locationName: "",
        employeeId: 0,
        employeeName: ""
      },
      paramsEdit: {
        id: "",
        locationName: "",
        employeeId: 0,
        employeeName: ""
      },
      employeeIdList: [],
      total: 0,
      pageSize: 10,
      pageNum: 1,
      pageSizeOpts: [10, 15, 20, 40, 50, 100],
      tableData: [],
      tableColumns: [
        {
          title: "库位编号",
          key: "locationName",
          align: "left",
          minWidth: 80
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
            return h("div", [
              h(
                "span",
                {
                  class: "tb-link",
                  on: {
                    click: () => {
                      this.paramsEdit = {
                        id:data.row.id,
                        locationName: data.row.locationName,
                        employeeId: data.row.employeeId.toString(),
                        employeeName: data.row.employeeName
                      };
                      this.modalEdit = true;
                    }
                  }
                },
                "编辑"
              )
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
    addOk() {
      this.$refs["formAdd"].validate(valid => {
        if (valid) {
          this.submitDisabled = true;
          storeHouseAdd(this.paramsAdd).then(res => {
            if (res.data.code == "200") {
              this.$Message.success("新增成功！");
              this.getList();
              setTimeout(() => {
                this.modalAdd = false;
                this.paramsAdd = {
                  locationName: "",
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
          storeHouseEdit(this.paramsEdit).then(res => {
            if (res.data.code == "200") {
              this.$Message.success("修改成功！");
              this.getList();
              setTimeout(() => {
                this.modalEdit = false;
                this.paramsEdit = {
                  id:"",
                  locationName: "",
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
    reset() {
      this.params = {
        locationName: "",
        employeeId: ""
      };
    },
    search() {
      this.searchParams.locationName = this.params.locationName;
      this.searchParams.employeeId = this.params.employeeId;
      this.pageChange(1);
    },
    getList() {
      const para = {
        locationName: this.searchParams.locationName,
        employeeId: this.searchParams.employeeId,
        numPerPage: this.pageSize,
        pageNo: this.pageNum
      };
      storeHouseList(para).then(res => {
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
    }
  }
};
</script>



