<template>
  <div class="white-bg device-manage">
    <Form :label-width="150" class="search-form">
      <Row type="flex" justify="space-between">
        <Col span="6">
            <Button type="primary" style="margin-bottom: 10px;" @click="add">新增设备</Button>
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
    <Modal ref="modal" v-model="modal" width="800px" :title="modalTitle" @on-ok="submit">
      <Form ref="formValidate" :model="changeForm" :rules="ruleValidate" :label-width="100">
          <FormItem label="设备类型:">
             <Select v-model="changeForm.equipmentType">
              <Option :value="0">安卓</Option>
              <Option :value="1">苹果</Option>
              <Option :value="2">苹果企业版</Option>
            </Select>
          </FormItem>
          <FormItem label="设备版本:">
            <Input v-model="changeForm.equipmentVersion"></Input>
          </FormItem>
           <FormItem label="设备地址:">
            <Input v-model="changeForm.equipmentPath"></Input>
          </FormItem>
          <FormItem label="是否强制更新:">
              <RadioGroup v-model="changeForm.isForceUpdate">
                <Radio :label="0">否</Radio>
                <Radio :label="1">是</Radio>
              </RadioGroup>
          </FormItem>
          <FormItem label="更新内容:">
            <Input
            type="textarea"
            :rows="4"
            style="width: 500px"
            placeholder="请输入更新内容"
            v-model="changeForm.updateContent"
            :maxlength="500"
            ></Input>
          </FormItem>
      </Form>
      <div slot="footer">
          <Button type="text" size="large" @click="cancel">取消</Button>
          <Button type="primary" size="large" @click="submit" :disabled="submitDisabled">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { saveEquipment, updateEquipment, queryEquipmentList, queryEquipmentInfo } from "@/api/equipment";
import { formatDate } from "@/libs/util";
export default {
  name: "EquipmentList",
  data() {
    return {
      submitDisabled: false,
      pageNum: 1,
      total: 0,
      pageSize: 10,
      visible: false,
      modal: false,
      modalTitle: '修改设备',
      changeForm: {
        id: "",
        equipmentType : "",
        equipmentVersion : "",
        equipmentPath : "",
        isForceUpdate : "",
        updateContent : ""
      },
      tableData: [],
      tableColumns: [
        {
          title: "设备类型",
          key: "equipmentType",
          minWidth: 50,
          render: (h, data) => {
            if (data.row.equipmentType == "0") {
              return h("span", "安卓");
            } else if (data.row.equipmentType == "1") {
              return h("span", "苹果");
            }else if (data.row.equipmentType == "2") {
              return h("span", "苹果企业版");
            }
          }
        },
        {
          title: "设备版本",
          key: "equipmentVersion",
          minWidth: 50
        },
        {
          title: "设备地址",
          key: "equipmentPath",
          minWidth: 30
        },
        {
          title: "创建时间",
          key: "createTime",
          minWidth: 50
        },
        {
          title: "是否强制更新",
          key: "isForceUpdate",
          minWidth: 30,
          render: (h, data) => {
            if (data.row.isForceUpdate == "0") {
              return h("span", "否");
            } else if (data.row.isForceUpdate == "1") {
              return h("span", "是");
            }
          }
        },
        {
          title: "更新内容",
          key: "updateContent",
          minWidth: 100,
        },
        {
          title: "操作",
          key: "",
          fixed: "right",
          minWidth: 50,
          render: (h, data) => {
            return h("div", [
              h("span",{
                class: "tb-link margin-right-10",
                on: {
                  click: () => {
                    this.modal = true;
                    this.modalTitle = "修改设备";
                    this.submitDisabled = false;
                    this.changeForm.id = data.row.id;
                    this.changeForm.equipmentType = data.row.equipmentType;
                    this.changeForm.equipmentVersion = data.row.equipmentVersion;
                    this.changeForm.equipmentPath = data.row.equipmentPath;
                    this.changeForm.isForceUpdate = data.row.isForceUpdate;
                    this.changeForm.updateContent = data.row.updateContent;
                  }
                }
              },
              "修改")
            ]);
          }
        }
      ],
      ruleValidate: {
      }
    };
  },

  methods: {
    queryEquipmentList: function(pageNo, numPerPage) {
      let params = {
        pageNo: pageNo,
        numPerPage: numPerPage,
        isPage: 1
      };
      queryEquipmentList(params).then(res => {
        if (res.data.code == "200") {
          this.tableData = res.data.data.recordList;
          this.total = res.data.data.totalCount;
          this.pageNum = res.data.data.currentPage;
          this.pageSize = res.data.data.numPerPage;
        }
      });
    },

    add: function() {
      this.changeForm.id = "";
      this.changeForm.equipmentType = "";
      this.changeForm.equipmentVersion = "";
      this.changeForm.equipmentPath = "";
      this.changeForm.isForceUpdate = 0;
      this.changeForm.updateContent = "";
      this.modal = true;
      this.modalTitle = "新增设备";
      this.submitDisabled = false;
    },

    submit: function() {
        this.submitDisabled = true;
        if(this.changeForm.id) {
            updateEquipment(this.changeForm).then(res=>{
                if(res.data.code=="200") {
                    this.$Message.success({
                        content: "修改设备成功",
                        duration:1
                    });
                    this.modal=false;
                    this.queryEquipmentList(this.pageNum,this.pageSize)
                }else{
                    this.$Message.error({
                        content: res.data.msg,
                        duration: 1
                    });
                }
                setTimeout(() => {
                    this.submitDisabled = false;
                }, 1000);
            })
        }else {
            saveEquipment(this.changeForm).then(res=>{
                if(res.data.code=="200") {
                    this.$Message.success({
                        content: "新增设备成功",
                        duration:1
                    });
                    this.modal=false;
                    this.queryEquipmentList(this.pageNum,this.pageSize)
                }else{
                    this.$Message.error({
                        content: res.data.msg,
                        duration: 1
                    });
                }
                setTimeout(() => {
                    this.submitDisabled = false;
                }, 1000);
            })
        }
    },

    cancel: function() {
        this.modal = false;
    },

    pageChange: function(value) {
      this.queryEquipmentList(value, this.pageSize);
    },

    pageSizeChange: function(value) {
      this.queryEquipmentList(this.pageNum, value);
    },

  },

  mounted: function() {
    this.queryEquipmentList(1, 10);
  }
};
</script>

<style scoped>
.device-manage >>> .table-delete td {
  background-color: #f0f2f5;
}

.img-pointer:hover {
  cursor: pointer;
}

.ivu-table-cell-tooltip-content {
     display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.demo-upload-list {
  display: inline-block;
  width: 102px;
  height: 102px;
  text-align: center;
  line-height: 100px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 102%;
  height: 102%;
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
