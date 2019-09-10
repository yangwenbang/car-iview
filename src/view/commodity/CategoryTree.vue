<template>
  <div>
    <Tabs type="card" v-model="attributeType" @on-click="changeTab">
      <TabPane label="非原厂" name="1" icon="ios-car">
        <Card shadow>
          <tree-table
            show-row-hover
            expand-key="attributeName"
            :expand-type="false"
            :selectable="false"
            :columns="columns"
            :data="data"
          >
            <template slot="operate" slot-scope="scope">
              <Button @click="add(scope)" v-if="scope.row.level != 3">添加</Button>
              <Button @click="upd(scope)" v-if="scope.row.level != 1">修改</Button>
              <Button @click="del(scope)" v-if="scope.row.level != 1">删除</Button>
            </template>
          </tree-table>
        </Card>
      </TabPane>
      <TabPane label="原厂" name="0" icon="md-car">
        <Card shadow>
          <tree-table
            show-row-hover
            expand-key="attributeName"
            :expand-type="false"
            :selectable="false"
            :columns="columns"
            :data="data"
          >
            <template slot="operate" slot-scope="scope">
              <Button @click="add(scope)" v-if="scope.row.level != 3">添加</Button>
              <Button @click="upd(scope)" v-if="scope.row.level != 1">修改</Button>
              <Button @click="del(scope)" v-if="scope.row.level != 1">删除</Button>
            </template>
          </tree-table>
        </Card>
      </TabPane>
      <Modal ref="modal" v-model="modal" :title="modalTitle" @on-ok="submit">
        <Form ref="formValidate" :model="attributeForm" :rules="ruleValidate" :label-width="100">
          <FormItem label="属性名称:" prop="attributeName">
            <Input placeholder="请输入属性名称" v-model="attributeForm.attributeName" :maxlength="20"></Input>
          </FormItem>
          <FormItem label="顺序号:">
            <Input placeholder="请输入顺序号" v-model="attributeForm.seq" :maxlength="3"></Input>
          </FormItem>
          <FormItem label="是否审核类型:">
            <RadioGroup v-model="attributeForm.isAuditType">
              <Radio :label="0">否</Radio>
              <Radio :label="1">是</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="是否手动输入:">
            <RadioGroup v-model="attributeForm.isManualInput">
              <Radio :label="0">否</Radio>
              <Radio :label="1">是</Radio>
            </RadioGroup>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text" size="large" @click="cancel">取消</Button>
          <Button type="primary" size="large" @click="submit" :disabled="submitDisabled">确定</Button>
        </div>
      </Modal>
    </Tabs>
  </div>
</template>

<script>
import {
  deleteCategoryAttribute,
  saveCategoryAttribute,
  queryCategoryAttributeList,
  queryTreeOfCategoryAttribute,
  updateCategoryAttribute
} from "@/api/commodity";
export default {
  name: "CategoryTree",
  data() {
    return {
      attributeType: "1",
      modal: false,
      modalTitle: "修改分类属性",
      submitDisabled: false,
      attributeForm: {
        attributeFirstWord: "",
        attributeName: "",
        attributeType: "",
        commodityCategoryId: "",
        id: "",
        isAuditType: 0,
        isManualInput: 0,
        parentId: "",
        seq: 0
      },
      ruleValidate: {
        attributeName: [
          { required: true, message: "属性名称不能为空", trigger: "blur" }
        ]
      },
      columns: [
        {
          title: "属性名称",
          key: "attributeName",
          minWidth: "400px"
        },
        {
          title: "操作",
          key: "operate",
          minWidth: "200px",
          type: "template",
          template: "operate"
        }
      ],
      data: []
    };
  },
  methods: {
    add(scope) {
      this.modal = true;
      this.modalTitle = "新增分类属性";
      this.attributeForm.attributeType = this.attributeType;
      this.attributeForm.commodityCategoryId = scope.row.commodityCategoryId;
      this.attributeForm.seq = 0;
      if (scope.row.level == 1) {
        this.attributeForm.parentId = 0;
      } else {
        this.attributeForm.parentId = scope.row.id;
      }
    },

    upd(scope) {
      this.modal = true;
      this.modalTitle = "修改分类属性";
      this.attributeForm.attributeType = this.attributeType;
      this.attributeForm.commodityCategoryId = scope.row.commodityCategoryId;
      this.attributeForm.attributeName = scope.row.attributeName;
      this.attributeForm.isAuditType = scope.row.isAuditType;
      this.attributeForm.isManualInput = scope.row.isManualInput ? scope.row.isManualInput : 0;
      this.attributeForm.id = scope.row.id;
      this.attributeForm.seq = scope.row.seq;

    },

    del(scope) {
       this.$Modal.confirm({
          title: '删除',
          content: '是否要删除该分类属性？',
          onOk: () => {
            let params = {
              id: scope.row.id
            }
            deleteCategoryAttribute(params).then(res => {
              if (res.data.code == "200") {
                    this.$Message.success({
                      content: "分类属性删除成功",
                      duration: 1
                    });
                    this.getCategoryAttributes(this.attributeType);
                } else {
                  this.$Message.error({
                    content: res.data.msg,
                    duration: 1
                  });
                }
            });
          }
       });
    },

    reset() {
        this.attributeForm.attributeFirstWord = "",
        this.attributeForm.attributeName =  "",
        this.attributeForm.attributeType =  "",
        this.attributeForm.commodityCategoryId = "",
        this.attributeForm.id = "",
        this.attributeForm.isAuditType = 0,
        this.attributeForm.isManualInput = 0,
        this.attributeForm.parentId =  "",
        this.attributeForm.seq = 0
    },

    cancel() {
      this.modal = false;
      this.reset();
    },

    submit() {
      this.submitDisabled = true;
      if(this.attributeForm.id) {
          updateCategoryAttribute(this.attributeForm).then(res => {
          if (res.data.code == "200") {
              this.$Message.success({
                content: "分类属性修改成功",
                duration: 1
              });
              this.modal = false;
              this.getCategoryAttributes(this.attributeType);
            } else {
              this.$Message.error({
                content: res.data.msg,
                duration: 1
              });
            }
            this.reset();
        });
      }else {
        saveCategoryAttribute(this.attributeForm).then(res => {
          if (res.data.code == "200") {
            this.$Message.success({
              content: "分类属性添加成功",
              duration: 1
            });
            this.modal = false;
            this.getCategoryAttributes(this.attributeType);
          } else {
            this.$Message.error({
              content: res.data.msg,
              duration: 1
            });
          }
          this.reset();
        });
      }
      setTimeout(() => {
        this.submitDisabled = false;
      }, 1000);
    },

    getCategoryAttributes(val) {
      let params = {
        attributeType: val
      };
      queryTreeOfCategoryAttribute(params).then(res => {
        if (res.data.code == "200") {
          if(val == 1) {
            this.data = res.data.data;
          }else if(val == 0) {
            let data = {
              id: 0,
              parentId: 0,
              attributeName: "品牌/属性",
              attributeType: 0,
              isAuditType: 0,
              isManualInput: 0,
              level: 1,
              children: res.data.data
            }
            this.data = [data];
          }
        } else {
          this.$Message.error("查询分类失败" + rdata.msg);
        }
      });
    },

    changeTab(val) {
      this.getCategoryAttributes(val);
    }
  },

  created: function() {
    this.getCategoryAttributes(this.attributeType);
  }
};
</script>

<style lang="less" scoped>
.zk-table /deep/ .zk-table--tree-icon {
  font-size: 16px !important;
}
.ivu-btn {
  margin-right: 10px !important;
}
</style>
