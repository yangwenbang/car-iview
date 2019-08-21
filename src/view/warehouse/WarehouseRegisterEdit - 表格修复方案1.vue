<template>
  <div class="white-bg">
    <Form :label-width="150" class="search-form" ref="formValidate" :model="formValidate" :rules="ruleValidate">
      <div class="table-title">入库单</div>
      <hr class="line">
      <Row type="flex" justify="space-between">
        <Col :sm="8" :xs="24">
            <FormItem label="入库单号:">
                <Input v-model="formValidate.warehouseId" disabled></Input>
            </FormItem>
        </Col>
        <!-- <Col :sm="8" :xs="24">
        <FormItem label="入库仓库:" prop="warehouse">
          <Select v-model="formValidate.warehouse" filterable clearable disabled>
            <Option v-for="(item,index) in warehouseList" :value="item" :key="index">{{ item }}</Option>
          </Select>
        </FormItem>
        </Col> -->
        <Col :sm="8" :xs="24">
        <FormItem label="入库日期:" prop="inputDate">
          <DatePicker v-model="formValidate.inputDate" type="date" style="width:100%;"></DatePicker>
        </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
        <FormItem label="货主:" prop="ownner">
          <Select v-model="formValidate.ownner" filterable clearable @on-change="changeOwnner">
            <Option v-for="(item,index) in ownnerList" :value="item" :key="index">{{ item }}</Option>
          </Select>
        </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
        <FormItem label="货主联系人:">
          <Input v-model="formValidate.ownnerLinker" :maxlength="30"></Input>
        </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
        <FormItem label="货主联系人手机号:">
          <Input v-model="formValidate.ownnerLinkerPhone" :maxlength="20"></Input>
        </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
        <FormItem label="货主通知单号:">
          <Input v-model="formValidate.ownnerNoticeNo" :maxlength="30"></Input>
        </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
        <FormItem label="送货车号:" prop="carno">
          <Input v-model="formValidate.carno" :maxlength="60"></Input>
        </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
        <FormItem label="送货人:">
          <Input :maxlength="20"></Input>
        </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
        <FormItem label="送货人电话:">
          <Input v-model="formValidate.phone" :maxlength="20"></Input>
        </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
        <FormItem label="收货人:" prop="receiveman">
          <Select v-model="formValidate.receiveman" filterable clearable>
            <Option v-for="(item,index) in receivemanList" :value="item" :key="index">{{ item }}</Option>
          </Select>
        </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
        <FormItem label="吊车工:">
          <Select filterable clearable multiple>
            <Option v-for="(item,index) in dcgList" :value="item" :key="index">{{ item }}</Option>
          </Select>
        </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
        <FormItem label="装卸工:">
          <Select filterable clearable multiple>
            <Option v-for="(item,index) in zxgList" :value="item" :key="index">{{ item }}</Option>
          </Select>
        </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
        </Col>
        <Col :sm="24" :xs="24">
        <FormItem label="备注:">
          <Input type="textarea" :autosize="{minRows: 2,maxRows: 5}" :maxlength="200"/>
        </FormItem>
        </Col>
      </Row>
    </Form>
    <Row>
      <Col span="24">
      <div class="pull-left table-title">
        <span class="pull-left">入库单明细</span>
        <Upload :show-upload-list="false" :on-success="fileUpload" accept=".xls,.xlsx" action="//jsonplaceholder.typicode.com/posts/">
          <Button class="margin-left-10" type="info" size="small">导入明细</Button>
        </Upload>
        <Button class="margin-left-10" type="default" size="small">下载模板</Button>
      </div>
      <div class="pull-right count-content">
        <span class="margin-right-10">货物数量：
          <b class="tip">16</b> 件</span>
        <span class="margin-right-10">货物重量：
          <b class="tip">10.0000</b> 吨</span>
      </div>
      </Col>
    </Row>
    <Table class="table" ref="myTable" :columns="tableColumns" :data="tableData" border>
      <template slot="col1" slot-scope="props">
        <Form :ref="'formDynamic'+props.idx" :model="props.row">
          <FormItem prop="col1">
            <Input v-model="props.row.col1" size="small"></Input>
          </FormItem>
        </Form>
      </template>
      <template slot="col2" slot-scope="props">
        <Form :ref="'formDynamic'+props.idx" :model="props.row">
          <FormItem prop="col2" :rules="{required: true, message: '请选择产地', trigger: 'change'}">
            <Select v-model="props.row.col2" size="small">
              <Option v-for="item in factoryList" :value="item.value" :key="item.value">{{item.label}}</Option>
            </Select>
          </FormItem>
        </Form>
      </template>
      <template slot="col3" slot-scope="props">
        <Form :ref="'formDynamic'+props.idx" :model="props.row">
          <FormItem prop="col3" :rules="{required: true, message: '请选择品名', trigger: 'change'}">
            <Select v-model="props.row.col3">
              <Option v-for="item in breedList" :value="item.value" :key="item.value">{{item.label}}</Option>
            </Select>
          </FormItem>
        </Form>
      </template>
      <template slot="col5" slot-scope="props">
        <Form :ref="'formDynamic'+props.idx" :model="props.row">
          <FormItem prop="col5" :rules="{required: true, message: '请选择材质', trigger: 'change'}">
            <Select v-model="props.row.col5">
              <Option v-for="item in materialList" :value="item.value" :key="item.value">{{item.label}}</Option>
            </Select>
          </FormItem>
        </Form>
      </template>
      <template slot="col4" slot-scope="props">
        <Form :ref="'formDynamic'+props.idx" :model="props.row">
          <FormItem prop="col4" :rules="{required: true, message: '请输入规格', trigger: 'blur'}">
            <AutoComplete clearable :data="specList" :filter-method="specFilter" v-model="props.row.col4"></AutoComplete>
          </FormItem>
        </Form>
      </template>
      <template slot="col6" slot-scope="props">
        <Form :ref="'formDynamic'+props.idx" :model="props.row">
          <FormItem prop="col6" :rules="{required: true, message: '请选择库区', trigger: 'change'}">
            <Select v-model="props.row.col6">
              <Option v-for="item in kqList" :value="item.value" :key="item.value">{{item.label}}</Option>
            </Select>
          </FormItem>
        </Form>
      </template>
      <template slot="col7" slot-scope="props">
        <Form :ref="'formDynamic'+props.idx" :model="props.row">
          <FormItem prop="col7" :rules="{required: true, message: '请选择库位', trigger: 'change'}">
            <Select v-model="props.row.col7">
              <Option v-for="item in kwList" :value="item.value" :key="item.value">{{item.label}}</Option>
            </Select>
          </FormItem>
        </Form>
      </template>
      <template slot="col8" slot-scope="props">
        <Form :ref="'formDynamic'+props.idx" :model="props.row">
          <FormItem prop="col8" :rules="{required: true, message: '请输入数量', trigger: 'blur'}">
            <InputNumber size="small" :maxlength="10" :min="0" v-model="props.row.col8" @on-change="countTonage(props.idx)"/>
          </FormItem>
        </Form>
      </template>
      <template slot="col9" slot-scope="props">
        <Form :ref="'formDynamic'+props.idx" :model="props.row">
          <FormItem prop="col9" :rules="{required: true, message: '请输入单件重量', trigger: 'blur'}">
            <Input :maxlength="20" v-model="props.row.col9" @on-change="countTonage(props.idx)"/>
          </FormItem>
        </Form>
      </template>
      <template slot="col11" slot-scope="props">
        <Form :ref="'formDynamic'+props.idx" :model="props.row">
          <FormItem prop="col11" :rules="{required: true, message: '请选择计重方式', trigger: 'change'}">
            <Select v-model="props.row.col11">
              <Option v-for="item in typeList" :value="item.value" :key="item.value">{{item.label}}</Option>
            </Select>
          </FormItem>
        </Form>
      </template>
      <template slot="col12" slot-scope="props">
        <Form :ref="'formDynamic'+props.idx" :model="props.row">
          <FormItem prop="col12">
            <Input v-model="props.row.col12" size="small"></Input>
          </FormItem>
        </Form>
      </template>
      <template slot="col16" slot-scope="props">
        <Form :ref="'formDynamic'+props.idx" :model="props.row">
          <FormItem prop="col16">
            <Input v-model="props.row.col16" size="small"></Input>
          </FormItem>
        </Form>
      </template>
      <template slot="col17" slot-scope="props">
        <Form :ref="'formDynamic'+props.idx" :model="props.row">
          <FormItem prop="col17">
            <Input v-model="props.row.col17" size="small"></Input>
          </FormItem>
        </Form>
      </template>
      <template slot-scope="{ row, index }" slot="operate">
        <div title="复制本行" class="tb-link-copy margin-right-10" @click="tableCopy(row, index)"><img src="../../assets/images/icon_copy.png" /></div>
        <Icon class="tb-link-remove color-red" type="md-remove-circle" size="20" @click="tableDel(row, index)"/>
      </template>
    </Table>
    <div class="text-center margin-top-10">
      <Button type="primary" class="btn-common-width" @click="handleSubmit('formValidate')">保存</Button>
      <!-- <Button type="primary" class="btn-common-width margin-left-10" @click="handleSubmit('formValidate')">提交审核</Button> -->
      <Button class="btn-common-width margin-left-10" @click="backFun">取消</Button>
    </div>
  </div>

</template>
<script>
// import { getTableData } from '@/api/data'
import { closeNowTag } from "@/libs/util";
export default {
  name: "WarehouseRegisterAdd",
  data() {
    return {
      formDynamic: {},
      formValidate: {
        warehouseId:"10000234424",
        ownner: "常州中天钢厂2",
        ownnerLinker: "李四",
        ownnerLinkerPhone: "13817002000",
        ownnerNoticeNo: "",
        inputDate: new Date(),
        warehouse: "上海钢联2库",
        carno: "沪D-20333",
        phone: "",
        receiveman: "张二"
      },
      ruleValidate: {
        ownner: [
          {
            required: true,
            message: "请选择货主",
            trigger: "change"
          }
        ],
        inputDate: [
          {
            required: true,
            type: "date",
            message: "请选择入库日期",
            trigger: "change"
          }
        ],
        receiveman: [
          {
            required: true,
            message: "请选择收货人",
            trigger: "change"
          }
        ],
        carno: [
          {
            required: true,
            message: "请填写送货车号",
            trigger: "change"
          }
        ],
      },
      ownnerList: ["江南钢铁厂2", "常州中天钢厂2"],
      ownnerLinkerList: ["张三", "李四"],
      receivemanList: ["李三", "张二"],
      warehouseList: ["上海钢联1库", "上海钢联2库"],
      dcgList: ["王朝", "马汉", "陈燕", "徐路"],
      zxgList: ["王朝", "马汉", "陈燕", "徐路"],
      imgNo: "",
      tableData: [],
      tableData1: [
        {
          col1: "AT001",
          col2: "沙钢",
          col3: "冷轧卷",
          col4: "1.0*1250*C",
          col5: "Q235B",
          col6: "A区",
          col7: "A1－1",
          col8: 3,
          col9: "7.4300",
          col10: "7.4800",
          col11: "抄码",
          col12: "453***",
          col13: "AS***",
          col14: "4443",
          col15: "34466",
          col16: "",
          col17: "",
          status: 1
        }
      ],
      importTableData: [
        {
          col1: "AT001",
          col2: "沙钢",
          col3: "冷轧卷",
          col4: "1.0*1250*C",
          col5: "Q235B",
          col6: "A区",
          col7: "A1－1",
          col8: 3,
          col9: "7.4300",
          col10: "7.4800",
          col11: "抄码",
          col12: "453***",
          col13: "AS***",
          col14: "4443",
          col15: "34466",
          col16: "",
          col17: "",
          status: 2
        },
        {
          col1: "AT002",
          col2: "沙钢",
          col3: "冷轧卷",
          col4: "1.0*1250*C",
          col5: "Q235B",
          col6: "A区",
          col7: "A1－1",
          col8: "3",
          col9: "7.4300",
          col10: "7.4800",
          col11: "抄码",
          col12: "453***",
          col13: "AS***",
          col14: "4443",
          col15: "34466",
          col16: "",
          col17: "",
          status: 2
        }
      ],
      tableColumns: [
        {
          title: "编号",
          key: "col1",
          align: "left",
          minWidth: 120,
          slot:'col1',
          renderHeader: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    color: "red"
                  }
                },
                "*"
              ),
              h("span", "编号")
            ]);
          },
          render: (h, params) => {
            this.tableData[params.index] = params.row;
            return h(
              'div',
              this.$refs.myTable.$scopedSlots.col1({
                row: params.row,
                idx: params.row._index
              })
            )
          }
        },
        {
          title: "产地",
          key: "col2",
          align: "left",
          minWidth: 120,
          slot:'col2',
          renderHeader: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    color: "red"
                  }
                },
                "*"
              ),
              h("span", "产地")
            ]);
          },
          render: (h, params) => {
            this.tableData[params.index] = params.row
            return h(
              'div',
              this.$refs.myTable.$scopedSlots.col2({
                row: params.row,
                idx: params.row._index
              })
            )
          }
        },
        {
          title: "品名",
          key: "col3",
          align: "left",
          minWidth: 120,
          renderHeader: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    color: "red"
                  }
                },
                "*"
              ),
              h("span", "品名")
            ]);
          },
          render: (h, params) => {
            this.tableData[params.index] = params.row
            return h(
              'div',
              this.$refs.myTable.$scopedSlots.col3({
                row: params.row,
                idx: params.row._index
              })
            )
          }
        },
        {
          title: "材质",
          key: "col5",
          align: "left",
          minWidth: 120,
          slot:"col5",
          renderHeader: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    color: "red"
                  }
                },
                "*"
              ),
              h("span", "材质")
            ]);
          },
          render: (h, params) => {
            this.tableData[params.index] = params.row
            return h(
              'div',
              this.$refs.myTable.$scopedSlots.col5({
                row: params.row,
                idx: params.row._index
              })
            )
          }
        },
        {
          title: "规格",
          key: "col4",
          align: "left",
          minWidth: 130,
          slot:"col4",
          renderHeader: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    color: "red"
                  }
                },
                "*"
              ),
              h("span", "规格")
            ]);
          },
          render: (h, params) => {
            this.tableData[params.index] = params.row
            return h(
              'div',
              this.$refs.myTable.$scopedSlots.col4({
                row: params.row,
                idx: params.row._index
              })
            )
          }
        },
        {
          title: "库区",
          key: "col6",
          align: "left",
          minWidth: 120,
          slot:"col6",
          renderHeader: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    color: "red"
                  }
                },
                "*"
              ),
              h("span", "库区")
            ]);
          },
          render: (h, params) => {
            this.tableData[params.index] = params.row
            return h(
              'div',
              this.$refs.myTable.$scopedSlots.col6({
                row: params.row,
                idx: params.row._index
              })
            )
          }
        },
        {
          title: "库位",
          key: "col7",
          align: "left",
          minWidth: 120,
          slot:"col7",
          renderHeader: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    color: "red"
                  }
                },
                "*"
              ),
              h("span", "库位")
            ]);
          },
          render: (h, params) => {
            this.tableData[params.index] = params.row
            return h(
              'div',
              this.$refs.myTable.$scopedSlots.col7({
                row: params.row,
                idx: params.row._index
              })
            )
          }
        },
        {
          title: "数量",
          key: "col8",
          align: "right",
          minWidth: 98,
          slot:"col8",
          renderHeader: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    color: "red"
                  }
                },
                "*"
              ),
              h("span", "数量")
            ]);
          },
          render: (h, params) => {
            this.tableData[params.index] = params.row
            return h(
              'div',
              this.$refs.myTable.$scopedSlots.col8({
                row: params.row,
                idx: params.row._index
              })
            )
          }
        },
        {
          title: "单件重量",
          key: "col9",
          align: "right",
          minWidth: 100,
          slot:"col9",
          renderHeader: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    color: "red"
                  }
                },
                "*"
              ),
              h("span", "单件重量")
            ]);
          },
          render: (h, params) => {
            this.tableData[params.index] = params.row
            return h(
              'div',
              this.$refs.myTable.$scopedSlots.col9({
                row: params.row,
                idx: params.row._index
              })
            )
          }
        },
        {
          title: "总重量",
          key: "col10",
          align: "right",
          minWidth: 100,
          slot:"col10",
          render: (h, data) => {
            const val1 =  (Number(data.row.col10)).toFixed(4)
            return h("span", val1)
          }
        },
        {
          title: "计重方式",
          key: "col11",
          align: "left",
          minWidth: 100,
          slot:"col11",
          renderHeader: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    color: "red"
                  }
                },
                "*"
              ),
              h("span", "计重方式")
            ]);
          },
          render: (h, params) => {
            this.tableData[params.index] = params.row
            return h(
              'div',
              this.$refs.myTable.$scopedSlots.col11({
                row: params.row,
                idx: params.row._index
              })
            )
          }
        },
        {
          title: "钢卷号",
          key: "col12",
          align: "left",
          minWidth: 120,
          slot:"col12",
          render: (h, params) => {
            this.tableData[params.index] = params.row
            return h(
              'div',
              this.$refs.myTable.$scopedSlots.col12({
                row: params.row,
                idx: params.row._index
              })
            )
          }
        },
        {
          title: "包装",
          key: "col16",
          align: "left",
          minWidth: 120,
          slot:"col16",
          render: (h, params) => {
            this.tableData[params.index] = params.row
            return h(
              'div',
              this.$refs.myTable.$scopedSlots.col16({
                row: params.row,
                idx: params.row._index
              })
            )
          }
        },
        {
          title: "外观",
          key: "col17",
          align: "left",
          minWidth: 120,
          slot:"col17",
          render: (h, params) => {
            this.tableData[params.index] = params.row
            return h(
              'div',
              this.$refs.myTable.$scopedSlots.col17({
                row: params.row,
                idx: params.row._index
              })
            )
          }
        },
        {
          title: "操作",
          key: "",
          align: "center",
          fixed: "right",
          minWidth: 80,
          slot:"operate",
          renderHeader: (h, params) => {
            return h("a",{
              props:{
                href:"javascript:;"
              }
            }, [
              h("Icon", {
                props: {
                  type: "md-add-circle",
                  size: 20
                },
                class: "tb-link-add color-green",
                on: {
                  click: () => {
                    this.tableData.push({
                      col1: "",
                      col2: "",
                      col3: "",
                      col4: "",
                      col5: "",
                      col6: "",
                      col7: "",
                      col8: 1,
                      col9: "",
                      col10: "",
                      col11: "抄码",
                      col12: "",
                      col13: "",
                      col14: "",
                      col15: "",
                      col16: "",
                      col17: "",
                      status: 0
                    });
                  }
                }
              })
            ]);
          },
          // render: (h, data) => {
          //   return h("div", [
          //     h("span", {
          //       props: {
          //         src: "../../assets/images/icon_copy.png"
          //       },
          //       class: "tb-link-copy margin-left-10",
          //       on: {
          //         click: () => {
          //           this.tableData.splice((data.index+1), 0, data.row); 
          //         }
          //       }
          //     }),
          //     h("Icon", {
          //       props: {
          //         type: "md-remove-circle",
          //         size: 20
          //       },
          //       class: "tb-link-remove margin-left-10 color-red",
          //       on: {
          //         click: () => {
          //           if(this.tableData.length > 1){
          //             this.tableData.splice(data.index, 1);
          //           }else{
          //             this.$Message.error("至少保留一条入库单明细！")
          //           }
          //         }
          //       }
          //     })
          //   ]);
          // }
        }
      ],
      factoryList:[
        {label:"唐钢",value:"唐钢"},
        {label:"沙钢",value:"沙钢"},
        {label:"中天钢铁",value:"中天钢铁"}
      ],
      breedList:[
        {label:"螺纹钢",value:"螺纹钢"},
        {label:"盘螺",value:"盘螺"},
        {label:"冷轧卷",value:"冷轧卷"},
        {label:"热卷",value:"热卷"}
      ],
      materialList:[
        {label:"HRB400",value:"HRB400"},
        {label:"Q235B",value:"Q235B"}
      ],
      typeList:[
        {label:"抄码",value:"抄码"},
        {label:"过磅",value:"过磅"},
        {label:"理计",value:"理计"}
      ],
      specList:["20*10","22*10"],
      kqList:[
        {label:"A区",value:"A区"},
        {label:"B区",value:"B区"},
        {label:"C区",value:"C区"}
      ],
      kwList:[
        {label:"A1－1",value:"A1－1"},
        {label:"A1－2",value:"A1－2"},
        {label:"A1－3",value:"A1－3"}
      ],
    };
  },
  wtach: {},
  mounted() {
    this.tableData = this.tableData1;
  },
  methods: {
    countTonage(index){
      let a = parseInt(this.tableData[index].col8) ? parseInt(this.tableData[index].col8) : 0;
      let b = parseFloat(this.tableData[index].col9) ? parseFloat(this.tableData[index].col9) : 0;
      this.tableData[index].col10 = a*b ? (a*b).toFixed(4) : ""
    },
    specFilter(value, option){
        return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
    },
    changeSpec(value, row, index){
      // this.tableData[index].col4 = value;
      this.tableData[index] = row;
    },
    tableCopy(row,index){
      let data = this.tableData;
      data.splice((index+1), 0, row);
      this.tableData = data;
    },
    tableDel(row,index){
      if(this.tableData.length > 1){
          this.tableData.splice(index, 1);
      }else{
          this.$Message.error("至少保留一条入库单明细！")
      }
    },
    handleSubmit(name) {
      let isValid = true;
      this.$refs[name].validate(valid => {
        if (valid) {
        } else {
          isValid = false;
          // this.$Message.error("提交失败");
        }
      });
      for (let i = 0, len = this.tableData.length; i < len; i++) {
        console.log(this.$refs['formDynamic' + i])
            this.$refs['formDynamic' + i].validate(valid => {
              if (valid) {
                // this.$Message.success('Success!')
              } else {
                isValid = false;
              }
            })
      }
      // setTimeout(() => {
      //   if(isValid){
      //     this.$Message.success({
      //         content: "提交成功!",
      //         duration: 1
      //       });
      //       setTimeout(() => {
      //         closeNowTag(this.$store.state.app, this.$route);
      //         this.$router.push({
      //           path: "WarehouseRegister"
      //         });
      //       }, 1000);
      //   }
      // },2000)
      
    },
    changeOwnner(value) {
      if (value) {
      }else{
      }
    },
    fileUpload() {
      this.$Message.success({
        content: "导入成功!",
        duration: 1
      });
      this.tableData = this.importTableData;
    },
    backFun() {
      this.$Modal.confirm({
          title: "提示",
          content: "取消将不保存修改内容，请确认是否取消？",
          onOk: () => {
            closeNowTag(this.$store.state.app, this.$route);
            this.$router.push({
              path: "WarehouseRegister"
            });
          },
          onCancel: () => {
          }
      });
    }
  }
};
</script>
<style scoped>
.text-center {
  text-align: center;
}
.search-form .ivu-form-item {
  margin-bottom: 20px;
}
.table .ivu-form-item {
  margin-bottom: 0;
}
.tb-link-copy,
.tb-link-add,
.tb-link-remove {
  cursor: pointer;
}
.ivu-upload {
  float: left;
}
.tb-link-copy{display: inline-block;height:20px;vertical-align: middle;}
</style>



