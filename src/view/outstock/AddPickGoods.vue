<template>
  <div class="white-bg">
    <Form
      :label-width="150"
      class="search-form"
      ref="formValidate"
      :model="formValidate"
      :rules="ruleValidate"
    >
      <Row>
        <Col
          :sm="8"
          :xs="24"
        >
        <FormItem label="出库结算单号:">
          <div class="val-text tb-link">
            <router-link :to="{name:'ViewOutstockSettlement',query:{id:$route.query.id}}">{{formParams.outSettleCode}}</router-link>
          </div>
        </FormItem>
        </Col>
        <Col
          :sm="8"
          :xs="24"
        >
        <FormItem label="货主:">
          <div class="val-text">{{formParams.ownerName}}</div>
        </FormItem>
        </Col>
        <Col
          :sm="8"
          :xs="24"
        >
        <FormItem label="提货日期:">
          <DatePicker
            v-model="inputDate"
            type="date"
            style="width:100%;"
          ></DatePicker>
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col
          :sm="8"
          :xs="24"
        >
        <FormItem
          label="提货客户:"
          prop="deliveryCustomerId"
        >
          <Select
            v-model="formValidate.deliveryCustomerId"
            filterable
            clearable
            label-in-value
            @on-change="changeDeliveryCustomer"
          >
            <Option
              v-for="(item,index) in ownnerList"
              :value="item.id"
              :key="index"
            >{{ item.customerName }}</Option>
          </Select>
        </FormItem>
        </Col>
        <Col
          :sm="8"
          :xs="24"
        >
        <FormItem label="放货单号:">
          <Input
            v-model="releaseCode"
            :maxlength="20"
          ></Input>
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col
          :sm="24"
          :xs="24"
        >
        <FormItem label="备注:">
          <Input
            v-model="remark"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
          />
        </FormItem>
        </Col>
      </Row>
    </Form>
    <Row>
      <Col span="24">
      <div class="pull-left table-title margin-bottom-5">提货司机信息</div>
      </Col>
    </Row>
    <Table
      ref="myTable"
      :columns="tableColumns2"
      :data="tableData2"
      border
      class="validTable"
    >
      <template
        slot="carNum"
        slot-scope="{ row, index }"
      >
        <Form
          :ref="'formCar'+index"
          :model="row"
        >
          <FormItem
            prop="carNum"
            :rules="{required: true, message: '请输入提货车号', trigger: 'blur'}"
          >
            <Input
              v-model="row.carNum"
              :maxlength="20"
              @on-change="tableData2[index].carNum1 = row.carNum"
            ></Input>
          </FormItem>
        </Form>
      </template>

      <template
        slot="mobile"
        slot-scope="{ row, index }"
      >
        <Form
          :ref="'formPhone'+index"
          :model="row"
        >
          <FormItem
            prop="mobile"
            :rules="[{required: true, message: '请输入司机电话', trigger: 'blur'},phoneRules]"
          >
            <Input
              v-model="row.mobile"
              :maxlength="20"
              @on-change="tableData2[index].mobile1 = row.mobile"
            ></Input>
          </FormItem>
        </Form>
      </template>

      <template
        slot="driver"
        slot-scope="{ row, index }"
      >
        <Input
          v-model="row.driver"
          :maxlength="20"
          @on-change="tableData2[index].driver1 = row.driver"
        />
      </template>

      <template
        slot="cardNum"
        slot-scope="{ row, index }"
      >
        <Form
          :ref="'formId'+index"
          :model="row"
        >
          <FormItem
            prop="cardNum"
            :rules="IdRules"
          >
            <Input
              v-model="row.cardNum"
              :maxlength="20"
              @on-change="tableData2[index].cardNum1 = row.cardNum"
            />
          </FormItem>
        </Form>
      </template>

      <template
        slot="action"
        slot-scope="{ row, index }"
      >
        <Icon
          type="md-add-circle"
          size="20"
          class="color-green margin-right-10 handstyle"
          @click="addRow(index)"
        />
        <Icon
          type="md-remove-circle"
          size="20"
          class="color-red handstyle"
          @click="delRow(index)"
        />
      </template>
    </Table>
    <Row class="margin-top-20">
      <Col span="24">
      <div class="pull-left table-title">待提货明细</div>
      <div class="pull-right count-content">
        <span class="margin-right-10">待提货数量：
          <b class="tip">{{formParams.noDeliveryNumberTotal}}</b> 件</span>
        <span class="margin-right-10">待提货重量：
          <b class="tip">{{formParams.noDeliveryWeightTotal | formatWeight}}</b> 吨</span>
      </div>
      </Col>
    </Row>
    <Table
      class="pickTable validTable"
      ref="selection"
      :columns="tableColumns"
      :data="tableData"
      border
    >
      <template
        slot="checkRow"
        slot-scope="{ row, index }"
      >
        <Checkbox
          v-model="tableData[index]._checked"
          :disabled="tableData[index]._disabled"
          @on-change="changeSingle(index,$event)"
        ></Checkbox>
      </template>
      <template
        slot-scope="{ row, index }"
        slot="weighedWeight"
      >
        <Form
          :ref="'formWeighedWeight'+index"
          :model="row"
          v-if="settleTimeType==1"
        >
          <FormItem
            prop="weighedWeight"
            :rules="{type:'number',required: true, message: '请输入过磅重量', trigger: 'change'}"
          >
            <InputNumber
              v-model="row.weighedWeight"
              :min="0"
              :parser="inputWeight"
              @on-change="changeWeighedWeight(index,$event)"
              class="input-number-no-operate"
            ></InputNumber>
          </FormItem>
        </Form>
        <InputNumber
          v-else
          v-model="row.weighedWeight"
          :min="0"
          :parser="inputWeight"
          @on-change="changeWeighedWeight(index,$event)"
          class="input-number-no-operate"
        ></InputNumber>
      </template>
      <template
        slot-scope="{ row, index }"
        slot="price"
      >
        <Form
          :ref="'formPrice'+index"
          :model="row"
          v-if="settleTimeType==1"
        >
          <FormItem
            prop="price"
            :rules="{type:'number',required: true, message: '请输入提货单价', trigger: 'change'}"
          >
            <InputNumber
              v-model="row.price"
              :min="0"
              :parser="inputPrice"
              class="input-number-no-operate"
							@on-change="changePrice(index,$event)"
            ></InputNumber>
          </FormItem>
        </Form>
        <InputNumber
          v-else
          v-model="row.price"
          :min="0"
          :parser="inputPrice"
          class="input-number-no-operate"
          @on-change="changePrice(index,$event)"
        ></InputNumber>
      </template>
      <template
        slot-scope="{ row,index }"
        slot="otherCharge"
      >
        <InputNumber
          v-model="row.otherCharge"
          :min="0"
          :parser="inputPrice"
          @on-change="changeOthercharge(index,$event)"
          class="input-number-no-operate"
        ></InputNumber>
      </template>
      <template
        slot-scope="{ row, index }"
        slot="num1"
      >
        <Form
          :ref="'formNum1'+index"
          :model="row"
        >
          <FormItem
            prop="num1"
            :rules="{type:'number',required: true, message: '请输入提货数量', trigger: 'change'}"
          >
            <InputNumber
              v-if="tableData[index]._disabled"
              style="width:100%;"
              :disabled="tableData[index]._disabled"
              
            />
            <InputNumber
              v-else
              style="width:100%;"
              :min="1"  
              :max="Number(tableData[index].noDeliveryNumber)"
              :parser="inputNum"
              :precision="0"
              v-model="row.num1"
              :disabled="tableData[index]._disabled"
              @on-change="changeNum(index,$event)"
            />
          </FormItem>
        </Form>
      </template>
      <div slot="footer" class="table-foot">
        <Form :label-width="150" class="search-form margin-top-15" ref="formPrice" :model="formPrice" v-if="settleTimeType==1">
            <Row>
                <Col :sm="8" :xs="24">
                <FormItem class="input-number-no-operate" label="附加费:" prop="extraCharge">
                    <InputNumber v-model="formPrice.extraCharge" :parser="inputPrice"/>
                        <span slot="append">元</span>
                    </Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem class="input-number-no-operate" label="打包费:" prop="packageCharge">
                    <InputNumber v-model="formPrice.packageCharge" :parser="inputPrice"/>
                        <span slot="append">元</span>
                    </Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <div class="val-text text-right margin-right-20">
                    <span class="total-money">结算总金额：
                    <b class="tip color-red">{{totalMoney}}</b> 元</span>
                </div>
                </Col>
            </Row>
        </Form>
    </div>
    </Table>
    <div class="text-center margin-top-20">
      <Button
        type="primary"
        class="btn-common-width"
        @click="handleSubmit"
        :disabled="submitDisabled"
      >保存</Button>
      <Button
        class="btn-common-width margin-left-10"
        @click="backFun"
      >取消</Button>
    </div>
  </div>
</template>
<script>
import {
  closeNowTag,
  formatDate,
  formatWeight,
  formatPrice,
  decimalInput
} from "@/libs/util";
import { OutSettleDetail, saveDelivery } from "@/api/outstock";
import { commonQueryOwners } from "@/api/common";
export default {
  name: "AddPickGoods",
  computed: {
    countEle: function() {
      let countNum = 0,
        countWeight = 0;
      for (var i = 0; i < this.tableData.length; i++) {
        countNum =
          countNum +
          (this.tableData[i].number.value
            ? parseInt(this.tableData[i].number.value)
            : 0);
        countWeight =
          countWeight +
          (this.tableData[i].totalAmount.value
            ? parseFloat(this.tableData[i].totalAmount.value)
            : 0);
      }
      return { countNum: countNum, countWeight: countWeight.toFixed(4) };
    },
    totalMoney:function(){
        return formatPrice(this.tableAllMoney+this.formPrice.extraCharge+this.formPrice.packageCharge);
    }
  },
  watch:{
      //监听标识，如果行总金额改变则更新总金额
      changeSign:function(){
          if(this.changeSign){
              this.updatetable();
              this.changeSign=false;
          }
      }
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      var myreg = /^[1][0-9]{10}$/;
      if (value) {
        if (!myreg.test(value)) {
          callback(new Error("请输入正确的手机号码"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    const validateId = (rule, value, callback) => {
      var myreg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
      if (value) {
        if (!myreg.test(value)) {
          callback(new Error("请输入正确的身份证号"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      submitDisabled:false,
      formParams: {},
      formValidate: {
        deliveryCustomerId: ""
      },
      phoneRules: {
        validator: validatePhone,
        trigger: "blur"
      },
      IdRules: {
        validator: validateId,
        trigger: "blur"
      },
      formPrice: {
        extraCharge: 0,
        packageCharge: 0
      },
      deliveryCustomerName: "",
      releaseCode: "",
      changeSign:false,
      inputDate: new Date(), //提货日期
      remark: "", //备注
      ownnerList: [],
      tableAllMoney:0,//表总金额
      settleTimeType: 0,
      ruleValidate: {
        deliveryCustomerId: [
          {
            required: true,
            message: "请选择提货客户",
            trigger: "change",
            type: "number"
          }
        ]
      },
      tableData: [],
      tableColumns: [
        {
          title: "",
          slot: "checkRow",
          align: "center",
          minWidth: 40,
          renderHeader: (h, params) => {
            return h("Checkbox", {
              props: {
                value: this.checkedAll
              },
              on: {
                "on-change": val => {
                  this.checkedAll = val;
                  if (this.checkedAll) {
                    for (let i = 0; i < this.tableData.length; i++) {
                      if (
                        this.tableData[i].noDeliveryNumber &&
                        this.tableData[i].noDeliveryNumber > 0
                      ) {
                        this.$set(this.tableData[i], "_checked", true);
                      }
                    }
                  } else {
                    for (let i = 0; i < this.tableData.length; i++) {
                      this.$set(this.tableData[i], "_checked", false);
                    }
                  }
                }
              }
            });
          }
        },
        {
          title: "编号",
          key: "code",
          align: "left",
          minWidth: 140
        },
        {
          title: "打包号",
          key: "packCode",
          align: "left",
          minWidth: 120
        },
        {
          title: "货物类型",
          key: "type",
          align: "left",
          minWidth: 90,
          render: (h, data) => {
            let typeText = "";
            if (data.row.type == 0) {
              typeText = "原料";
            } else if (data.row.type == 1) {
              typeText = "成品";
            } else if (data.row.type == 2) {
              typeText = "废料";
            }
            return h("span", typeText);
          }
        },
        {
          title: "产地",
          key: "brandName",
          align: "left",
          minWidth: 100,
          tooltip: true,
          ellipsis: true
        },
        {
          title: "品名",
          key: "breedName",
          align: "left",
          minWidth: 100
        },
        {
          title: "材质",
          key: "materialName",
          align: "left",
          minWidth: 100
        },
        {
          title: "规格",
          key: "specName",
          align: "left",
          minWidth: 120
        },

        {
          title: "库区",
          key: "storageArea",
          align: "left",
          minWidth: 70
        },
        {
          title: "库位",
          key: "storagePlace",
          align: "left",
          minWidth: 80
        },
        {
          title: "出库结算数量(件)",
          key: "number",
          align: "right",
          minWidth: 130
        },
        {
          title: "待提货数量(件)",
          key: "noDeliveryNumber",
          align: "right",
          minWidth: 120
        },
        {
          title: "单件重量(吨)",
          key: "perAmount",
          align: "right",
          minWidth: 100,
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.perAmount ? Number(params.row.perAmount).toFixed(4) : 0
            );
          }
        },
        {
          title: "待提货总重量(吨)",
          key: "",
          align: "right",
          minWidth: 130,
          render: (h, params) => {
            const weight =
              (params.row.perAmount ? Number(params.row.perAmount) : 0) *
              (params.row.noDeliveryNumber
                ? Number(params.row.noDeliveryNumber)
                : 0);
            return h("span", {}, Number(weight).toFixed(4));
          }
        },
        {
          title: "提货数量(件)",
          slot: "num1",
          minWidth: 150,
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
              h("span", "提货数量(件)")
            ]);
          }
        },
        {
          title: "提货总重量(吨)",
          key: "",
          align: "right",
          minWidth: 120,
          render: (h, params) => {
            const weight =
              (params.row.perAmount ? Number(params.row.perAmount) : 0) *
              (params.row.num1 ? Number(params.row.num1) : 0);
            this.tableData[params.index].weight1 = weight;
            return h("span", {}, Number(weight).toFixed(4));
          }
        },
        {
          title: "过磅重量(吨)",
          slot: "weighedWeight",
          align: "left",
          minWidth: 140,
          renderHeader: (h, params) => {
            let header=[
              h("span", "过磅重量(吨)")
            ]
            if(this.settleTimeType==1){
                header.unshift(h(
                "span",
                {
                  style: {
                    color: "red"
                  }
                },
                "*"
              ),)
            }
            return h("div",header);
          }
        },
        {
          title: "提货单价",
          slot: "price",
          align: "left",
          minWidth: 120
        },
        //提货单价*过磅重量
        {
          title: "提货费用",
          key: "",
          align: "left",
          minWidth: 120,
          render: (h, params) => {
            let price =
              (params.row.price ? Number(params.row.price) : 0) *
              (params.row.weighedWeight ? Number(params.row.weighedWeight) : 0);
            this.tableData[params.index].thprice = Number(price).toFixed(2);
            return h("span", {}, Number(price).toFixed(2));
          }
        },
        {
          title: "其他费用",
          slot: "otherCharge",
          align: "left",
          minWidth: 120
        },
        //提货费用+其他费用
        {
          title: "总金额",
          key: "totalprice",
          align: "left",
          minWidth: 120,
          render: (h, params) => {
            let totalprice =(params.row.otherCharge ? Number(params.row.otherCharge) : 0) + 
            (params.row.price ? Number(params.row.price) : 0) *
            (params.row.weighedWeight ? Number(params.row.weighedWeight) : 0);
            this.tableData[params.index].totalprice = Number(totalprice).toFixed(2);
            this.changeSign=true;//行总金额变化 改变标识表示总金额已经改变
            return h("span", {}, Number(totalprice).toFixed(2));
          }
        },
        {
          title: "计量方式",
          key: "weightType",
          align: "right",
          minWidth: 80,
          render: (h, data) => {
            let typeText = "";
            if (data.row.weightType == 0) {
              typeText = "抄码";
            } else if (data.row.weightType == 1) {
              typeText = "过磅";
            } else if (data.row.weightType == 2) {
              typeText = "理重";
            }
            return h("span", typeText);
          }
        },
        {
          title: "包装",
          key: "wrap",
          align: "left",
          minWidth: 80
        },
        {
          title: "外观",
          key: "appearance",
          align: "left",
          minWidth: 80
        },
        {
          title: "钢卷号/捆包号",
          key: "baleNumber",
          align: "left",
          minWidth: 120
        }
      ],
      tableData2: [
        {
          carNum: "",
          mobile: "",
          driver: "",
          cardNum: ""
        }
      ],
      numTH: [],
      tableColumns2: [
        {
          title: "提货车号",
          slot: "carNum",
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
              h("span", "提货车号")
            ]);
          }
        },
        {
          title: "司机电话",
          slot: "mobile",
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
              h("span", "司机电话")
            ]);
          }
        },
        {
          title: "司机姓名",
          slot: "driver"
        },
        {
          title: "身份证号",
          slot: "cardNum"
        },
        {
          title: "操作",
          slot: "action",
          align: "center",
          width: 100,
          className: "iconTd"
        }
      ],
      checkedRows: [], //复选框选中的数据
      checkedAll: true //判断复选框全选是否选中
    };
  },
  mounted() {
    this.getList();
    this.getOwnerList();
  },
  methods: {
    updatetable(){
      this.tableAllMoney=0;
      this.tableData.forEach(item=>{
          this.tableAllMoney=Number(this.tableAllMoney)+Number(item.totalprice);
      })
    },
    inputNum(value) {
      return decimalInput(value, 8, 0);
    },
    inputWeight(value) {
      return decimalInput(value, 12, 4);
    },
    inputPrice(value) {
      return decimalInput(value, 14, 2);
    },
    /** 获取初始化数据 */
    getList() {
      OutSettleDetail({
        id: this.$route.query.id
      }).then(res => {
        if (res.data.code == "200") {
          let data = res.data.data;
					this.formParams = data;
          this.settleTimeType = data.settleTimeType;
          this.formValidate.deliveryCustomerId = data.ownerId;
          if(data.settleTimeType==0){
						this.tableColumns.splice(17,4)
          }
          this.numTH = [];
          this.tableData = data.itemList.map(item => {
            this.numTH.push(item.noDeliveryNumber ? item.noDeliveryNumber : 1);
            let _checked = false,
              _disabled = true;
            if (item.noDeliveryNumber && item.noDeliveryNumber > 0) {
              _checked = true;
              _disabled = false;
            }
            return {
              code: item.code,
              type: item.type,
              brandName: item.brandName,
              brandCode: item.brandCode,
              breedName: item.breedName,
              breedCode: item.breedCode,
              materialName: item.materialName,
              materialCode: item.materialCode,
              specName: item.specName,
              storageArea: item.storageArea,
              storagePlace: item.storagePlace,
              number: item.number,
              noDeliveryNumber: item.noDeliveryNumber,
              perAmount: item.perAmount,
              num1: item.noDeliveryNumber,
              id: item.id,
              weightType: item.weightType,
              wrap: item.wrap,
              appearance: item.appearance,
              baleNumber: item.baleNumber,
              weighedWeight: item.weighedWeight ? item.weighedWeight : null,
              price: item.isIntegrate==1?0:item.price,//如果货物在加工时标记了“加工出库一票结”，此字段默认为0
              otherCharge: item.otherCharge,
              packCode: item.packCode,
              packId: item.packId,
              _checked: _checked,
              _disabled: _disabled
            };
          });
        }
      });

      // 默认除待提货数量为0的选中
      for (let i = 0; i < this.tableData.length; i++) {
        let _checked = false,
          _disabled = true;
        if (
          this.tableData[i].noDeliveryNumber &&
          this.tableData[i].noDeliveryNumber > 0
        ) {
          _checked = true;
          _disabled = false;
        }
        this.$set(this.tableData[i], "_checked", _checked);
        this.$set(this.tableData[i], "_disabled", _disabled);
      }
    },
    changeNum(index, value) {
      this.numTH[index] = value;
    },
    
    getOwnerList() {
      commonQueryOwners().then(res => {
        if (res.data.code == "200") {
          this.ownnerList = res.data.data;
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    changeOthercharge(index, val) {
			let row = JSON.parse(JSON.stringify(this.tableData[index]));
			row.otherCharge = val;
			this.tableData[index] = JSON.parse(JSON.stringify(row));
    },
    changePrice(index, val){

			let row = JSON.parse(JSON.stringify(this.tableData[index]));
			row.price = val;
			this.tableData[index] = JSON.parse(JSON.stringify(row));
    },
    changeWeighedWeight(index, val) {
      let row = JSON.parse(JSON.stringify(this.tableData[index]));
      row.weighedWeight = val;
      this.tableData[index] = JSON.parse(JSON.stringify(row));
    },
    changeDeliveryCustomer(obj) {
      this.deliveryCustomerName = obj ? obj.label : "";
      this.formValidate.deliveryCustomerId = obj ? obj.value : "";
    },
    /** 删除司机行 */
    delRow(idx) {
      if (this.tableData2.length > 1) {
        this.tableData2.splice(idx, 1);
      }
    },
    /** 添加司机行 */
    addRow() {
      for (var i = 0; i < this.tableData2.length; i++) {
        this.tableData2[i].carNum = this.tableData2[i].carNum1;
        this.tableData2[i].mobile = this.tableData2[i].mobile1;
        this.tableData2[i].driver = this.tableData2[i].driver1;
        this.tableData2[i].cardNum = this.tableData2[i].cardNum1;
      }
      this.tableData2.push({
        carNum: "",
        mobile: "",
        driver: "",
        cardNum: ""
      });
    },
    /** 选中单选复选框 */
    changeSingle(index, data) {
      this.tableData[index]._checked = data;
      this.tableData.forEach((item, index1) => {
        if (
          item.packCode &&
          item.packCode == this.tableData[index].packCode &&
          index1 != index
        ) {
          this.tableData[index1]._checked = this.tableData[index]._checked;
        }
      });
      this.$nextTick(() => {
        let checkSingles = this.$refs.selection.getSelection();
        if (checkSingles.length == this.tableData.length) {
          this.checkedAll = true;
        } else {
          this.checkedAll = false;
        }
      });
    },
    /** 表格必填项验证*/
    checkDriver() {
      //循环验证提货车号
      let carCompleteFlagArr = [];
      for (let i = 0, len = this.tableData2.length; i < len; i++) {
        this.$refs["formCar" + i].validate(valid => {
          if (valid) {
            carCompleteFlagArr[i] = true;
          } else {
            carCompleteFlagArr[i] = false;
          }
        });
      }
      //循环验证司机电话
      let mobileCompleteFlagArr = [];
      for (let i = 0, len = this.tableData2.length; i < len; i++) {
        this.$refs["formPhone" + i].validate(valid => {
          if (valid) {
            mobileCompleteFlagArr[i] = true;
          } else {
            mobileCompleteFlagArr[i] = false;
          }
        });
      }
      //循环验证身份证号码
      let cardCompleteFlagArr = [];
      for (let i = 0, len = this.tableData2.length; i < len; i++) {
        this.$refs["formId" + i].validate(valid => {
          if (valid) {
            cardCompleteFlagArr[i] = true;
          } else {
            cardCompleteFlagArr[i] = false;
          }
        });
      }

      //提货件数必填验证
      let num1FlagArr = [];
      for (let i = 0, len = this.tableData.length; i < len; i++) {
        this.$refs["formNum1" + i].validate(valid => {
          if (valid) {
            num1FlagArr[i] = true;
          } else {
            num1FlagArr[i] = false;
          }
        });
      }

      //车号和电话、身份证格式中任意有一个false的时候，验证都不通过
      if (
        carCompleteFlagArr.indexOf(false) > -1 ||
        mobileCompleteFlagArr.indexOf(false) > -1 ||
        cardCompleteFlagArr.indexOf(false) > -1 ||
        num1FlagArr.indexOf(false) > -1
      ) {
        return false;
      } else {
        return true;
      }
    },
    /** 提交保存 */
    handleSubmit() {
      let flag = this.checkDriver();
      let formValidate = true;
      let tableValidate = true;
      this.$refs["formValidate"].validate(valid => {
        formValidate = valid;
      });
      //循环验证表格内容
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.settleTimeType == 1) {         
          this.$refs["formWeighedWeight" + i].validate(valid => {
            if (!valid) {
              tableValidate = false;
            }
          });
           this.$refs["formPrice" + i].validate(valid => {
            if (!valid) {
              tableValidate = false;
            }
          });
        }
        this.$refs["formNum1" + i].validate(valid => {
          if (!valid) {
            tableValidate = false;
          }
        });
      }
      if (flag && formValidate && tableValidate) {
        this.checkedRows = this.$refs.selection.getSelection();
        //司机验证通过之后再验证是否勾选了待提货明细
        if (this.checkedRows.length == 0) {
          this.$Modal.warning({
            title: "提示",
            content: "<p>请至少选择一条提货信息！</p>"
          });
          return false;
        } else {
          this.submitDisabled = true;
          let deliveryItems = [];
          this.tableData.forEach((item, index) => {
            if (this.tableData[index]._checked) {
                if(this.settleTimeType==1){
                    deliveryItems.push({
                        price:item.price,
                        otherCharge:item.otherCharge,
                        code: item.code,
                        number: this.numTH[index],
                        weight: item.weight1
                        ? parseFloat(item.weight1).toFixed(4)
                        : null,
                        weighedWeight: item.weighedWeight
                        ? parseFloat(item.weighedWeight).toFixed(4)
                        : null,
                        outSettleCode: this.formParams.outSettleCode,
                        outSettleId: this.$route.query.id,
                        outSettleItemId: item.id,
                        packId: item.packId,
                        packCode: item.packCode
                    })
                }else{
                    deliveryItems.push({
                        code: item.code,
                        number: this.numTH[index],
                        weight: item.weight1
                        ? parseFloat(item.weight1).toFixed(4)
                        : null,
                        weighedWeight: item.weighedWeight
                        ? parseFloat(item.weighedWeight).toFixed(4)
                        : null,
                        outSettleCode: this.formParams.outSettleCode,
                        outSettleId: this.$route.query.id,
                        outSettleItemId: item.id,
                        packId: item.packId,
                        packCode: item.packCode
                    });
                }
            }
          });
          let deliveryTransports = this.tableData2.map(item => {
            return {
              carNum: item.carNum1,
              cardNum: item.cardNum1,
              mobile: item.mobile1,
              driver: item.driver1
            };
          });
          let data={
            releaseCode: this.releaseCode,
            deliveryCustomerId: this.formValidate.deliveryCustomerId,
            deliveryCustomerName: this.deliveryCustomerName,
            deliveryCode: "",
            deliveryDate: formatDate(this.inputDate),
            deliveryId: 0,
            deliveryItems: deliveryItems,
            deliveryTransports: deliveryTransports,
            outSettleCode: this.formParams.outSettleCode,
            outSettleId: this.$route.query.id,
            ownerId: this.formParams.ownerId,
            ownerName: this.formParams.ownerName,
            remark: this.remark,
            settleTimeType:this.settleTimeType
          }
          if(this.settleTimeType==1){
            data.extraCharge=this.formPrice.extraCharge;
            data.packageCharge=this.formPrice.packageCharge;
          }
          saveDelivery(data).then(res => {
            if (res.data.code == "200") {
              this.$Message.success({
                content: "新增提货单成功!",
                duration: 1
              });
              setTimeout(() => {
                closeNowTag(this.$store.state.app, this.$route);
                this.$router.push({
                  path: "PickGoodsManage"
                });
              }, 1000);
            } else {
              this.$Message.error(res.data.msg);
            }
            setTimeout(()=>{
                this.submitDisabled = false;
            },1000)
          });
        }
      }
    },
    /** 取消返回 */
    backFun() {
      this.$Modal.confirm({
        title: "提示",
        content: "有数据未保存，是否确定放弃？",
        onOk: () => {
          closeNowTag(this.$store.state.app, this.$route);
          this.$router.push({
            path: "OutstockSettlement"
          });
        },
        onCancel: () => {}
      });
    }
  },
 
};
</script>
<style lang="less" scoped>
.search-form .ivu-form-item {
  margin-bottom: 20px;
}
@deep: ~">>>";
@{deep} .ivu-input,
.ivu-input-number {
  width: 100%;
}
</style>



