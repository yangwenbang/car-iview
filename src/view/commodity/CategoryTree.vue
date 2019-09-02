<template>
  <div>
    <Tabs type="card" v-model="commodityType">
      <TabPane label="非原厂" name="1" icon="ios-car">
        <Card shadow>
          <tree-table expand-key="name" :expand-type="false" :selectable="false" :columns="columns" :data="data">
            <template slot="operate" slot-scope="scope">
              <Button @click="handle(scope)">新增</Button>
              <Button @click="handle(scope)">修改</Button>
              <Button @click="handle(scope)">删除</Button>
            </template>
          </tree-table>
        </Card>
      </TabPane>
      <TabPane label="原厂" name="0" icon="md-car">
        <Card shadow>
          <tree-table expand-key="name" :expand-type="false" :selectable="false" :columns="columns" :data="data">
            <template slot="operate" slot-scope="scope">
              <Button @click="handle(scope)">新增</Button>
              <Button @click="handle(scope)">修改</Button>
              <Button @click="handle(scope)">删除</Button>
            </template>
          </tree-table>
        </Card>
      </TabPane>
      <Modal ref="modal" v-model="modal" :title="modalTitle" @on-ok="submit">
            <Form ref="formValidate" :model="changeForm" :rules="ruleValidate" :label-width="100">
                <FormItem label="分类名称:" prop="">
                    <Input  placeholder="请输入分类名称" :maxlength="20"></Input>
                </FormItem>
                <FormItem label="顺序号:" prop="">
                    <Input  placeholder="请输入顺序号" :maxlength="3"></Input>
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
    import { deleteCategoryAttribute, saveCategoryAttribute, queryCategoryAttributeList } from "@/api/commodity";
export default {
  name: "CategoryTree",
  data() {
    return {
      commodityType:"1",
      modal: false,
      modalTitle: '修改分类属性',
      submitDisabled: false,
      changeForm: {
          id: "",
          categoryName: "",
          seq: ""
      },
      ruleValidate: {
        categoryName: [
            { required: true, message: '分类名称不能为空', trigger: 'blur' }
        ],
        seq: [
            { required: true, message: '顺序号不能为空', trigger: 'blur' }
        ]
      },
      columns: [
        {
          title: "属性名称",
          key: "name",
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
      data: [
        {
          name: "轮毂",
          children: [
            {
              name: "轮毂制作工艺",
              children: [
                {
                  name: "低压铸造",
                },
                {
                  name: "DPT 铸造",
                }
              ]
            },
            {
              name: "直径",
               children: [
                {
                  name: "15 英寸",
                },
                {
                  name: "16 英寸",
                }
              ]
            }
          ]
        },
        {
          name: "刹车",
          children: [
            {
              name: "类型",
              children: [
                {
                  name: "制动套装"
                },
                {
                  name: "刹车盘"
                }
              ]
            },
            {
              name: "品牌",
              children: [
                {
                  name: "Brembo"
                },
                {
                  name: "Apracing"
                }
              ]
            }
          ]
        }
      ]
    };
  },
  methods: {
    handle(scope) {
      console.log(scope);
    },

    cancel() {},

    submit() {}
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
