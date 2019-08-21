<template>
  <div class="white-bg">
    <Form :label-width="150" class="search-form" ref="formValidate" :model="formValidate" :rules="ruleValidate">
      <Row>
        <Col :sm="8" :xs="24">
        <FormItem label="过户日期:" prop="inputDate">
          <DatePicker v-model="formValidate.inputDate" format="yyyy/MM/dd" type="date" style="width:100%;"></DatePicker>
        </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
        <FormItem label="货物类型:">
          <div class="val-text">{{formValidate.type == '0' ? '原料' : formValidate.type == '1' ? '成品' :  formValidate.type == '2' ? '废料' : ""}}</div>
        </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
        <FormItem label="原货主:">
          <div class="val-text">{{formValidate.oldOwner}}</div>
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col :sm="8" :xs="24">
        <FormItem label="新货主:" prop="newOwnerId">
          <Select v-model="formValidate.newOwnerId" filterable clearable label-in-value @on-change="changeNewowner">
            <Option v-for="(item,index) in ownnerList" :value="item.id" :key="index">{{ item.customerName }}</Option>
          </Select>
        </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
        <FormItem label="付款单位:" prop="payCustomerId">
          <Select v-model="formValidate.payCustomerId" filterable clearable label-in-value @on-change="changePayCustomer">
            <Option v-for="(item,index) in fkList" :value="item.value" :key="index">{{ item.label }}</Option>
          </Select>
        </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
        <FormItem label="结算方式:">
          <Select v-model="formValidate.settleType"  :disabled="disabledSettleType">
            <Option v-for="item in payTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        </Col>
        <Col :sm="24" :xs="24">
        <FormItem label="备注:">
          <Input v-model="formValidate.desc" type="textarea" :maxlength="200" :autosize="{minRows: 2,maxRows: 5}" />
        </FormItem>
        </Col>
      </Row>
    </Form>
    <Row class="margin-top-20 margin-bottom-10">
      <Col span="24">
      <div class="pull-left table-title">选择要过户的货物明细
        <Button size="small" type="info" class="margin-left-10" @click="showGoodsModal">选择过户货物</Button>
      </div>
      <div class="pull-right count-content">
        <span class="margin-right-10">过户总数量：
          <b class="tip">{{totalNumber}}</b> 件</span>
        <span class="margin-right-10">过户总重量：
          <b class="tip">{{transferWeight}}</b> 吨</span>
      </div>
      </Col>
    </Row>
    <Table :columns="tableColumns" :data="tableData" border class="validTable vertical-middle table-nowrap">
      <template slot-scope="{ row, index }" slot="number">
        <Form :ref="'formOutNumber'+index" :model="row">
          <FormItem prop="number" :rules="[{type:'number',required: true, message: '请输入过户数量', trigger: 'change'}]">
            <div v-if="row.packId">
              <div v-for="(item,index1) in row.packList" :key="index1" :class="index1 > 0 ? 'table-line table-mn' : 'table-mn'">
                <InputNumber disabled style="width:100%;" v-model="item.number" />
              </div>
            </div>
            <InputNumber v-else style="width:100%;" :min="1" :max="Number(row.availableNumber)" :precision="0" v-model="row.number" @on-change="changeNumber(row,index)" />
          </FormItem>
        </Form>
      </template>

      <template slot-scope="{ row, index }" slot="transferPrice">
        <div v-if="row.packId">
          <div v-for="(item,index1) in row.packList" :key="index1" :class="index1 > 0 ? 'table-line table-mn' : 'table-mn'">
            <Form :ref="'formSinglePrice'+index + '-' + index1" :model="item">
              <FormItem prop="transferPrice" :rules="[{type:'number',required: true, message: '请输入单价', trigger: 'blur'}]">
                <InputNumber class="input-number-no-operate" v-model="item.transferPrice" style="width:100%;" :parser="priceDecimal" :min="0" @on-change="changeSinglePrice(item,index,index1)"></InputNumber>
              </FormItem>
            </Form>
          </div>
        </div>
        <Form v-else :ref="'formSinglePrice'+index" :model="row">
          <FormItem prop="transferPrice" :rules="[{type:'number',required: true, message: '请输入单价', trigger: 'blur'}]">
            <InputNumber class="input-number-no-operate" v-model="row.transferPrice" style="width:100%;" :parser="priceDecimal" :min="0" @on-change="changeSinglePrice(row,index)"></InputNumber>
          </FormItem>
        </Form>
      </template>

      <div slot="footer" class="table-foot">
        <Form :label-width="150" class="search-form margin-top-15" ref="formPrice" :model="formPrice">
          <Row>
            <Col :sm="8" :xs="24">
            <FormItem label="附加费:">
              <InputNumber class="input-number-no-operate" v-model="formPrice.extraCharge" style="width:calc(100% - 27px);" :parser="priceDecimal" :min="0" @on-change="totalAmount"></InputNumber>
              <span class="price-label">元</span>
            </FormItem>
            </Col>
            <Col :sm="8" :xs="24">
            <div class="val-text text-right margin-right-20">
              <span class="total-money">过户总金额：
                <b class="tip color-red">{{totalMoney}}</b> 元</span>
            </div>
            </Col>
          </Row>
        </Form>
      </div>
    </Table>
    <div class="text-center margin-top-20">
      <Button type="primary" class="btn-common-width" @click="handleSubmit" :disabled="submitDisabled">保存</Button>
      <Button class="btn-common-width margin-left-10" @click="backFun">取消</Button>
    </div>
    <transfer-goods ref="modalChild" :showModal="showModal" :oldOwnerId="formValidate.oldOwnerId" :type="formValidate.type" :selectedIds="selectedIds" @hide-modal="hideModel"></transfer-goods>
  </div>
</template>
<script>
import TransferGoods from "./components/TransferGoods";
import { commonQueryOwners } from "@/api/common";
import { transferQueryTransfer, editTransferSave } from "@/api/outstock";
import {
  closeNowTag,
  formatPrice,
  formatWeight,
  formatDate,
  decimalInput
} from "@/libs/util";
export default {
  name: "AddTransfer",
  components: { TransferGoods },
  data() {
    return {
      submitDisabled:false,
      showModal: false, //传入子组件的弹框显示
      disabledSettleType: false,
      formValidate: {
        inputDate: "",
        oldOwnerId: null,
        newOwnerId: null,
        payCustomerId: null,
        type: 0,
        settleType: 1,
        desc: ""
      },
      formPrice: {
        extraCharge: 0
      },
      ruleValidate: {
        inputDate: [
          {
            required: true,
            type: "date",
            message: "请选择过户日期",
            trigger: "change"
          }
        ],
        oldOwnerId: [
          {
            required: true,
            message: "请选择原货主",
            trigger: "change"
          }
        ],
        newOwnerId: [
          {
            required: true,
            message: "请选择新货主",
            trigger: "change"
          }
        ],
        type: [
          {
            required: true,
            message: "请选择货物类型",
            trigger: "change"
          }
        ],
        payCustomerId: [
          {
            required: true,
            message: "请选择付款单位",
            trigger: "change"
          }
        ]
      },
      typeList: [
        {
          value: 0,
          label: "原料"
        },
        {
          value: 1,
          label: "成品"
        }
      ],
      ownnerList: [],
      payTypeList: [
        {
          value: 1,
          label: "月结"
        },
        {
          value: 0,
          label: "现结"
        }
      ],
      oldDeletedIds: [],
      tableData: [],
      tableColumns: [
        // {
        //   title: "操作",
        //   align: "center",
        //   minWidth: 60,
        //   render: (h, data) => {
        //     return h("div", [
        //       h("Icon", {
        //         props: {
        //           type: "md-remove-circle",
        //           size: 20
        //         },
        //         class: "tb-link-remove color-red",
        //         on: {
        //           click: () => {
        //             this.tableData.splice(data.index, 1);
        //             this.totalAmount();
        //           }
        //         }
        //       })
        //     ]);
        //   }
        // },
        {
          title: "操作",
          align: "center",
          minWidth: 80,
          render: (h, data) => {
            if (data.row.isDisabled) {
              return h("div", [
                h(
                  "a",
                  {
                    on: {
                      click: () => {
                        if(data.row.packId){
                          data.row.packList.forEach((item,index1)=>{
                            let index = this.oldDeletedIds.indexOf(item.id);
                            this.oldDeletedIds.splice(index, 1);
                          })
                        }else{
                          let index = this.oldDeletedIds.indexOf(data.row.id);
                          this.oldDeletedIds.splice(index, 1);
                        }
                        this.tableData[data.index].isDisabled = false;
                        this.totalAmount();
                      }
                    }
                  },
                  "取消删除"
                )
              ]);
            } else {
              return h("div", [
                h("Icon", {
                  props: {
                    type: "md-remove-circle",
                    size: 20
                  },
                  class: "tb-link-remove color-red",
                  on: {
                    click: () => {
                      //如果是删除了原来的，那就要记下来id,新添加的明细是没有id的
                      if (data.row.id) {
                        if(data.row.packId){
                          data.row.packList.forEach((item,index1)=>{
                            this.oldDeletedIds.push(item.id);
                          })
                        }else{
                          this.oldDeletedIds.push(data.row.id);
                        }
                        this.tableData[data.index].isDisabled = true;
                      } else {
                        this.tableData.splice(data.index, 1);
                      }
                      this.totalAmount();
                    }
                  }
                })
              ]);
            }
          }
        },
        {
          title: "编号",
          key: "code",
          align: "left",
          minWidth: 120,
          render: (h, data) => {
            if(data.row.packId){
              var arr = [];
              data.row.packList.forEach((item,index) => {
                let line = "table-mn";
                if(index > 0){
                  line = "table-line table-mn"
                }
                arr.push(h("div",{class:line}, item.code));
              });
              return h("div", arr);
            }else{
              return h("div", data.row.code);
            }
          }
        },
        {
          title: "打包号",
          key: "packCode",
          align: "left",
          minWidth: 120
        },
        {
          title: "产地",
          key: "brandName",
          align: "left",
          minWidth: 100,
          render: (h, data) => {
            if(data.row.packId){
              var arr = [];
              data.row.packList.forEach((item,index) => {
                let line = "table-mn";
                if(index > 0){
                  line = "table-line table-mn"
                }
                arr.push(h("div",{class:line}, item.brandName));
              });
              return h("div", arr);
            }else{
              return h("div", data.row.brandName);
            }
          }
        },
        {
          title: "品名",
          key: "breedName",
          align: "left",
          minWidth: 100,
          render: (h, data) => {
            if(data.row.packId){
              var arr = [];
              data.row.packList.forEach((item,index) => {
                let line = "table-mn";
                if(index > 0){
                  line = "table-line table-mn"
                }
                arr.push(h("div",{class:line}, item.breedName));
              });
              return h("div", arr);
            }else{
              return h("div", data.row.breedName);
            }
          }
        },
        {
          title: "材质",
          key: "materialName",
          align: "left",
          minWidth: 100,
          render: (h, data) => {
            if(data.row.packId){
              var arr = [];
              data.row.packList.forEach((item,index) => {
                let line = "table-mn";
                if(index > 0){
                  line = "table-line table-mn"
                }
                arr.push(h("div",{class:line}, item.materialName));
              });
              return h("div", arr);
            }else{
              return h("div", data.row.materialName);
            }
          }
        },
        {
          title: "规格",
          key: "specName",
          align: "left",
          minWidth: 120,
          render: (h, data) => {
            if(data.row.packId){
              var arr = [];
              data.row.packList.forEach((item,index) => {
                let line = "table-mn";
                if(index > 0){
                  line = "table-line table-mn"
                }
                arr.push(h("div",{class:line}, item.specName));
              });
              return h("div", arr);
            }else{
              return h("div", data.row.specName);
            }
          }
        },
        {
          title: "可过户数量(件)",
          key: "availableNumber",
          align: "right",
          minWidth: 120,
          render: (h, data) => {
            if(data.row.packId){
              var arr = [];
              data.row.packList.forEach((item,index) => {
                let line = "table-mn";
                if(index > 0){
                  line = "table-line table-mn"
                }
                arr.push(h("div",{class:line}, item.availableNumber));
              });
              return h("div", arr);
            }else{
              return h("div", data.row.availableNumber);
            }
          }
        },
        {
          title: "过户数量(件)",
          slot: "number",
          minWidth: 140,
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
              h("span", "过户数量(件)")
            ]);
          }
        },
        {
          title: "单件重量(吨)",
          key: "perAmount",
          align: "right",
          minWidth: 100,
          render: (h, data) => {
            if(data.row.packId){
              var arr = [];
              data.row.packList.forEach((item,index) => {
                let line = "table-mn";
                if(index > 0){
                  line = "table-line table-mn"
                }
                arr.push(h("div",{class:line}, formatWeight(item.remainNum)));
              });
              return h("div", arr);
            }else{
              return h("div", formatWeight(data.row.perAmount));
            }
          }
        },
        {
          title: "重量(吨)",
          key: "weight",
          align: "right",
          minWidth: 130,
          render: (h, data) => {
            if(data.row.packId){
              var arr = [];
              data.row.packList.forEach((item,index) => {
                let line = "table-mn";
                if(index > 0){
                  line = "table-line table-mn"
                }
                arr.push(h("div",{class:line}, formatWeight(item.weight)));
              });
              return h("div", arr);
            }else{
              return h("div", formatWeight(data.row.weight));
            }
          }
        },
        {
          title: "计重方式",
          key: "weightType",
          align: "left",
          minWidth: 80,
          render: (h, data) => {
            if(data.row.packId){
              var arr = [];
              data.row.packList.forEach((item,index) => {
                let line = "table-mn";
                if(index > 0){
                  line = "table-line table-mn"
                }
                let text = "";
                if (item.weightType == 0) {
                  text = "抄码";
                } else if (item.weightType == 1) {
                  text = "过磅";
                } else if (item.weightType == 2) {
                  text = "理重";
                }
                arr.push(h("div",{class:line}, text));
              });
              return h("div", arr);
            }else{
              let text = "";
              if (data.row.weightType == 0) {
                text = "抄码";
              } else if (data.row.weightType == 1) {
                text = "过磅";
              } else if (data.row.weightType == 2) {
                text = "理重";
              }
              return h("div", text);
            }
          }
        },
        {
          title: "单价(元/吨)",
          slot: "transferPrice",
          minWidth: 120,
          renderHeader: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: { color: "red" }
                },
                "*"
              ),
              h("span", "单价(元/吨)")
            ]);
          }
        },
        {
          title: "金额(元)",
          key: "transferFee",
          align: "right",
          minWidth: 120,
          render: (h, data) => {
            if(data.row.packId){
              var arr = [];
              data.row.packList.forEach((item,index) => {
                let line = "table-mn";
                if(index > 0){
                  line = "table-line table-mn"
                }
                arr.push(h("div",{class:line}, formatPrice(item.transferFee)));
              });
              return h("div", arr);
            }else{
              return h("div", formatPrice(data.row.transferFee));
            }
          }
        },
        {
          title: "库区",
          key: "storageArea",
          align: "left",
          minWidth: 100,
          render: (h, data) => {
            if(data.row.packId){
              var arr = [];
              data.row.packList.forEach((item,index) => {
                let line = "table-mn";
                if(index > 0){
                  line = "table-line table-mn"
                }
                arr.push(h("div",{class:line}, item.storageArea));
              });
              return h("div", arr);
            }else{
              return h("div", data.row.storageArea);
            }
          }
        },
        {
          title: "库位",
          key: "storagePlace",
          align: "left",
          minWidth: 100,
          render: (h, data) => {
            if(data.row.packId){
              var arr = [];
              data.row.packList.forEach((item,index) => {
                let line = "table-mn";
                if(index > 0){
                  line = "table-line table-mn"
                }
                arr.push(h("div",{class:line}, item.storagePlace));
              });
              return h("div", arr);
            }else{
              return h("div", data.row.storagePlace);
            }
          }
        },
        {
          title: "包装",
          key: "wrap",
          align: "left",
          minWidth: 100,
          render: (h, data) => {
            if(data.row.packId){
              var arr = [];
              data.row.packList.forEach((item,index) => {
                let line = "table-mn";
                if(index > 0){
                  line = "table-line table-mn"
                }
                arr.push(h("div",{class:line}, item.wrap));
              });
              return h("div", arr);
            }else{
              return h("div", data.row.wrap);
            }
          }
        },
        {
          title: "外观",
          key: "appearance",
          align: "left",
          minWidth: 100,
          render: (h, data) => {
            if(data.row.packId){
              var arr = [];
              data.row.packList.forEach((item,index) => {
                let line = "table-mn";
                if(index > 0){
                  line = "table-line table-mn"
                }
                arr.push(h("div",{class:line}, item.appearance));
              });
              return h("div", arr);
            }else{
              return h("div", data.row.appearance);
            }
          }
        },
        {
          title: "钢卷号/捆包号",
          key: "baleNumber",
          align: "left",
          minWidth: 120,
          render: (h, data) => {
            if(data.row.packId){
              var arr = [];
              data.row.packList.forEach((item,index) => {
                let line = "table-mn";
                if(index > 0){
                  line = "table-line table-mn"
                }
                arr.push(h("div",{class:line}, item.baleNumber));
              });
              return h("div", arr);
            }else{
              return h("div", data.row.baleNumber);
            }
          }
        }
      ],
      totalNumber: "",
      transferWeight: "",
      totalMoney: "",
      transferFee: "",
      selectedIds: [],
      fkObj: {
        old: "",
        new: ""
      }
    };
  },
  computed: {
    fkList: function() {
      let arr = [];
      for (let index in this.fkObj) {
        if (this.fkObj[index]) {
          arr.push(this.fkObj[index]);
        }
      }
      return arr;
    }
  },
  mounted() {},
  created() {
    //表格头部的合计变化
    this.totalAmount();
    this.getOwnerList();
    this.getTransferInfor();
  },
  methods: {
    rowClassName(row, index) {
      if (row.isDisabled) {
        return "table-info-error";
      } else {
        return "";
      }
    },
    getTransferInfor() {
      transferQueryTransfer({
        transferId: this.$route.query.transferId
      }).then(res => {
        if (res.data.code == "200") {
          let data = res.data.data;
          if (data) {
            this.fkObj = {
              old: {
                value: data.oldOwnerId.toString(),
                label: data.oldOwner
              },
              new: {
                value: data.newOwnerId.toString(),
                label: data.newOwner
              }
            };
            this.formValidate = {
              inputDate: data.transferDate,
              oldOwnerId: data.oldOwnerId.toString(),
              oldOwner: data.oldOwner,
              newOwnerId: data.newOwnerId.toString(),
              newOwner: data.newOwner,
              payCustomerId: data.payCustomerId.toString(),
              payCustomer: data.payCustomer,
              type: data.type,
              settleType: data.payType,
              desc: data.remark
            };
            this.getIsMonthSettle();
            this.transferFee = data.transferFee;
            this.totalMoney = data.sumFee;
            this.totalNumber = data.transferNumber;
            this.transferWeight = data.transferWeight;
            this.formPrice.extraCharge = data.otherFee;
            let tableNewData = data.transferItemList
              ? data.transferItemList
              : [];
            tableNewData = tableNewData.map(item => {
              item.transferPrice = item.transferPrice;
              item.isDisabled = false;
              item.availableNumber =
                Number(item.availableNumber) + Number(item.number);
              return item;
            });
            let tableArr = [];
            for (let i = 0; i < tableNewData.length; i++) {
            if(tableNewData[i].packId){
              let count = -1;
              for(let j=0;j<tableArr.length;j++){
                if(tableArr[j].packId == tableNewData[i].packId && tableArr[j].id != tableNewData[i].id){
                  count = j;
                }
              }
              if(count >= 0){
                tableArr[count].packList.push(tableNewData[i])
              }else{
                let Obj = tableNewData[i];
                Obj.isDisabled = false;
                Obj.packList = [];
                Obj.packList.push({
                  appearance: tableNewData[i].appearance,
                  availableNumber: tableNewData[i].availableNumber,
                  availableWeight: tableNewData[i].availableWeight,
                  baleNumber: tableNewData[i].baleNumber,
                  brandCode: tableNewData[i].brandCode,
                  brandName: tableNewData[i].brandName,
                  breedCode: tableNewData[i].breedCode,
                  breedName: tableNewData[i].breedName,
                  code: tableNewData[i].code,
                  id: tableNewData[i].id,
                  isDisabled: tableNewData[i].isDisabled,
                  itemId: tableNewData[i].itemId,
                  materialCode: tableNewData[i].materialCode,
                  materialName: tableNewData[i].materialName,
                  newOwner: tableNewData[i].newOwner,
                  newOwnerId: tableNewData[i].newOwnerId,
                  number: tableNewData[i].number,
                  numberUnit: tableNewData[i].numberUnit,
                  oldOwner: tableNewData[i].oldOwner,
                  oldOwnerId: tableNewData[i].oldOwnerId,
                  packCode: tableNewData[i].packCode,
                  packId: tableNewData[i].packId,
                  perAmount: tableNewData[i].perAmount,
                  specCode: tableNewData[i].specCode,
                  specName: tableNewData[i].specName,
                  status: tableNewData[i].status,
                  storageArea: tableNewData[i].storageArea,
                  storagePlace: tableNewData[i].storagePlace,
                  summaryId: tableNewData[i].summaryId,
                  transferCode: tableNewData[i].transferCode,
                  transferFee: tableNewData[i].transferFee,
                  transferId: tableNewData[i].transferId,
                  transferPrice: tableNewData[i].transferPrice,
                  warehouseId: tableNewData[i].warehouseId,
                  warehouseName: tableNewData[i].warehouseName,
                  weight: tableNewData[i].weight,
                  weightType: tableNewData[i].weightType,
                  weightUnit: tableNewData[i].weightUnit,
                  wrap: tableNewData[i].wrap,
                })
                tableArr.push(Obj);
              }
            }else{
              tableArr.push(tableNewData[i]);
            }
          }
            this.tableData = tableArr;
          }
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    /**弹框关闭触发的事件*/
    hideModel(data) {
      if (data) {
        let packIds = this.tableData.map(item =>{
          return item.packId;
        })
        for (let i = 0; i < data.length; i++) {
          if(data[i].packId && packIds.indexOf(data[i].packId) >= 0){}
          else{
            //过户数量默认等于可过户数量，不能为0
            data[i].number = data[i].availableNumber
              ? data[i].availableNumber
              : 1;

            //过户重量(吨) = 过户数量*单件重量
            data[i].weight = data[i].number * data[i].perAmount;

            //过户单价,默认为空（需要用户自己填写）
            data[i].transferPrice = 0;

            //过户费用(元) = 过户重量*过户单价
            data[i].transferFee = data[i].weight * data[i].transferPrice;

            this.tableData.push({
              itemId: data[i].id,
              summaryId: data[i].summaryId,
              warehouseId: data[i].warehouseId,
              warehouseName: data[i].warehouseName,
              code: data[i].code,
              brandCode: data[i].brandCode,
              brandName: data[i].brandName,
              breedCode: data[i].breedCode,
              breedName: data[i].breedName,
              materialCode: data[i].materialCode,
              materialName: data[i].materialName,
              specCode: data[i].specCode,
              specName: data[i].specName,
              storageArea: data[i].storageArea,
              storagePlace: data[i].storagePlace,
              availableNumber: data[i].availableNumber,
              number: data[i].number,
              perAmount: data[i].perAmount,
              weight: data[i].weight,
              weightType: data[i].weightType,
              transferPrice: data[i].transferPrice,
              transferFee: data[i].transferFee,
              wrap: data[i].wrap,
              appearance: data[i].appearance,
              baleNumber: data[i].baleNumber,
              status: 0,
              packCode: data[i].packCode,
              packId: data[i].packId,
              packList:data[i].packList ? data[i].packList : []
            });
          }
        }
        //表格头部的合计变化
        this.totalAmount();
      }

      //弹框关闭
      this.showModal = false;
    },
    //价格格式化
    priceDecimal(value) {
      return decimalInput(value, 14, 2);
    },
    changeNewowner(option) {
      if (option) {
        if (option.value != this.formValidate.oldOwnerId) {
          this.fkObj["new"] = option;
          this.formValidate.newOwner = option.label;
          this.formValidate.payCustomerId = option.value;
          this.formValidate.payCustomerName = option.label;
        } else {
          this.$Message.error({
            content: "新货主不能与原货主相同",
            duration: 2
          });
          setTimeout(() => {
            this.formValidate.newOwnerId = "";
            this.formValidate.newOwner = "";
            this.formValidate.payCustomerId = "";
            this.formValidate.payCustomerName = "";
            this.fkObj["new"] = "";
          }, 1000);
        }
      } else {
        this.formValidate.newOwner = "";
      }
      this.getIsMonthSettle();
    },
    changePayCustomer(option) {
      if (option) {
        this.formValidate.payCustomerName = option.label;
      } else {
        this.formValidate.payCustomerName = "";
      }
      this.getIsMonthSettle();
    },
    getIsMonthSettle() {
      if(this.formValidate.payCustomerId) {
        this.ownnerList.map((o) => {
        if(this.formValidate.payCustomerId == o.id) {
            this.formValidate.settleType = 0;
            this.disabledSettleType = o.isMonthSettle == 1? false: true;
          }
        })
      } else {
         this.disabledSettleType = false;
      }
    },
    /**货主或者货物类型改变时表格数据清空*/
    changeClearTable() {
      this.tableData = [];
    },
    /**货主下拉选项*/
    getOwnerList() {
      commonQueryOwners().then(res => {
        this.ownnerList = res.data.data.map(item => {
          return { id: item.id.toString(), customerName: item.customerName,isMonthSettle: item.isMonthSettle };
        });
      });
    },
    /**选择过户货物 */
    showGoodsModal() {
      //先判断是否选了货主和货物类型
      if (!this.formValidate.oldOwnerId) {
        this.$Modal.warning({
          title: "提示",
          content: "<p>请先选择原货主！</p>"
        });
      } else {
        //拿到已选择项的物资明细id
        this.selectedIds = this.tableData.map(item => {
          return item.itemId;
        });
        //弹框显示
        this.showModal = true;
        //调用子组件的方法
        this.$refs.modalChild.getList();
      }
    },
    /** 过户数量 联动 过户重量,过户费用,总金额 */
    changeNumber(row, index) {
      let a = row.number ? row.number : 1; //过户数量
      let b = row.perAmount; //单件重量
      let c = row.transferPrice ? row.transferPrice : 0; //过户单价
      //过户重量=过户数量*过户单价
      row.weight = a * b ? (a * b).toFixed(4) : "0.0000";
      //过户费用=过户重量*过户单价
      row.transferFee = row.weight * c ? (row.weight * c).toFixed(2) : "0.00";
      //将修改完的值赋给原始的tableData
      this.tableData[index] = row;
      //表格头部的合计变化
      this.totalAmount();
    },
    /** 过户单价 联动 过户费用,总金额 */
    changeSinglePrice(row, index,index1) {
      let a = row.transferPrice
        ? isNaN(row.transferPrice) ? 0 : row.transferPrice
        : 0; //过户单价
      //过户费用=过户总重量*过户单价
      row.transferFee = row.weight * a ? (row.weight * a).toFixed(2) : "0.00";
      //将修改完的值赋给原始的tableData
      if(index1 || index1 == 0){
        this.tableData[index].packList[index1] = row;
      }else{  
        this.tableData[index] = row;
      }
      //表格头部的合计变化
      this.totalAmount();
    },
    /**合计的总数量，总重量 ，总金额 */
    totalAmount() {
      var number = 0,
        weight = 0,
        money = 0;
      for (let i = 0; i < this.tableData.length; i++) {
        if(!this.tableData[i].isDisabled){
          if(this.tableData[i].packId){
            for(var j=0;j<this.tableData[i].packList.length;j++){
                number += Number(this.tableData[i].packList[j].number);
                weight += Number(this.tableData[i].packList[j].weight);
                money += Number(this.tableData[i].packList[j].transferFee);
            }
          }else{
            number += Number(this.tableData[i].number);
            weight += Number(this.tableData[i].weight);
            money += Number(this.tableData[i].transferFee);
          }
        }
        
      }
      this.totalNumber = number;
      this.transferWeight = weight ? weight.toFixed(4) : "0.0000";
      //过户费
      this.transferFee = money ? money.toFixed(2) : "0.00";
      //附加费
      let extraCharge = this.formPrice.extraCharge
        ? isNaN(this.formPrice.extraCharge)
          ? 0
          : Number(this.formPrice.extraCharge)
        : 0;
      //总金额=表格合计总金额+附加费
      this.totalMoney =
        money + extraCharge ? (money + extraCharge).toFixed(2) : "0.00";
    },
    /** 过户单明细验证*/
    checkTable() {
      //循环验证过户数量
      let outNumberFlagArr = [];
      for (let i = 0, len = this.tableData.length; i < len; i++) {
        this.$refs["formOutNumber" + i].validate(valid => {
          if (valid) {
            outNumberFlagArr[i] = true;
          } else {
            outNumberFlagArr[i] = false;
          }
        });
      }
      //循环验证过户单价
      let singlePriceFlagArr = [];
      for (let i = 0, len = this.tableData.length; i < len; i++) {
        if(!this.tableData[i].isDisabled){
          if(this.tableData[i].packId){
            var newValid = true;
            for(var j=0;j<this.tableData[i].packList.length;j++){
              this.$refs["formSinglePrice" + i + "-"+j][0].validate(valid => {
                if(!valid){
                  this.$refs["formSinglePrice" + i + "-"+j][0].$el[0].focus()
                  newValid = false;
                }
              });
            }
            if (newValid) {
                singlePriceFlagArr[i] = true;
            } else {
                singlePriceFlagArr[i] = false;
            }
          }else{
            this.$refs["formSinglePrice" + i].validate(valid => {
              if (valid) {
                singlePriceFlagArr[i] = true;
              } else {
                this.$refs["formSinglePrice" + i].$el[0].focus()
                singlePriceFlagArr[i] = false;
              }
            });
          }
        }
      }

      //验证上面的表单
      let formValidateFlag;
      this.$refs["formValidate"].validate(valid => {
        if (valid) {
          formValidateFlag = true;
        } else {
          formValidateFlag = false;
        }
      });
      //所有的验证只要有一个没通过，就不通过outNumberFlagArr
      if (
        outNumberFlagArr.indexOf(false) > -1 ||
        singlePriceFlagArr.indexOf(false) > -1 ||
        !formValidateFlag
      ) {
        return false;
      } else {
        return true;
      }
    },
    /** 保存过户单*/
    handleSubmit() {
      let tableFlag = this.checkTable();
      if (tableFlag) {
        let tbLength = 0;
        for (var i = 0; i < this.tableData.length; i++) {
          if (!this.tableData[i].isDisabled) {
            tbLength++;
          }
        }
        if (tbLength > 0) {
          this.submitDisabled = true;
          let para = {
            id: this.$route.query.transferId,
            deleteItemIds: this.oldDeletedIds.join(","),
            oldOwnerId: this.formValidate.oldOwnerId,
            oldOwner: this.formValidate.oldOwner,
            newOwnerId: this.formValidate.newOwnerId,
            newOwner: this.formValidate.newOwner,
            otherFee: this.formPrice.extraCharge
              ? parseFloat(this.formPrice.extraCharge).toFixed(2)
              : 0,
            payCustomerId: this.formValidate.payCustomerId,
            payCustomerName: this.formValidate.payCustomerName,
            payType: this.formValidate.settleType,
            remark: this.formValidate.desc,
            sumFee: this.totalMoney,
            transferFee: this.transferFee,
            transferDate: formatDate(this.formValidate.inputDate),
            transferNumber: this.totalNumber,
            transferWeight: this.transferWeight,
            type: this.formValidate.type,
            warehouseId: this.tableData[0].warehouseId,
            warehouseName: this.tableData[0].warehouseName
          };
          let transferItemList = [];
          for (let i = 0; i < this.tableData.length; i++) {
            if (!this.tableData[i].isDisabled) {
              transferItemList.push({
                id: this.tableData[i].id ? this.tableData[i].id : "",
                weight: this.tableData[i].weight
                  ? parseFloat(this.tableData[i].weight).toFixed(4)
                  : 0,
                itemId: this.tableData[i].itemId,
                summaryId: this.tableData[i].summaryId,
                status: this.tableData[i].status,
                number: this.tableData[i].number,
                otherCharge: this.tableData[i].otherPrice
                  ? parseFloat(this.tableData[i].otherPrice).toFixed(2)
                  : 0,
                transferPrice: this.tableData[i].transferPrice
                  ? parseFloat(this.tableData[i].transferPrice).toFixed(2)
                  : 0,
                transferFee: this.tableData[i].transferFee
                  ? parseFloat(this.tableData[i].transferFee).toFixed(2)
                  : 0
              });
            }
          }
          para.transferItemList = transferItemList;
          editTransferSave(para).then(res => {
            if (res.data.code == "200") {
              this.$Message.success({
                content: "编辑过户单成功!",
                duration: 1
              });
              setTimeout(() => {
                closeNowTag(this.$store.state.app, this.$route);
                this.$router.push({
                  name: "TransferManage"
                });
              }, 1000);
            } else {
              this.$Message.error({
                content: res.data.msg,
                duration: 1
              });
            }
            setTimeout(() => {
              this.submitDisabled = false;
            }, 1000);
          });
        } else {
          this.$Message.error({
            content: "请选择过户货物!",
            duration: 1
          });
        }
      } else {
        return false;
      }
    },
    /**取消*/
    backFun() {
      this.$Modal.confirm({
        title: "提示",
        content: "有数据未保存，是否确定放弃？",
        onOk: () => {
          closeNowTag(this.$store.state.app, this.$route);
          this.$router.push({
            path: "TransferManage"
          });
        },
        onCancel: () => {}
      });
    }
  }
};
</script>
<style scoped>
.search-form .ivu-form-item {
  margin-bottom: 20px;
}
.total-money {
  display: block;
  margin-top: -5px;
}
.price-label {
  display: block;
  position: absolute;
  right: 0;
  top: 0px;
  height: 100%;
  width: 27px;
  padding: 7px;
  line-height: 15px;
  background-color: #f8f8f9;
  color: #666;
  border: 1px solid #dcdee2;
  border-left: none;
}
</style>


