<template>
    <div class="white-bg">
        <Form :label-width="150" class="search-form" ref="formValidate" :model="formValidate" :rules="ruleValidate">
            <Row>
                <Col :sm="8" :xs="24">
                <FormItem label="货主:" prop="ownerId">
                    <Select v-model="formValidate.ownerId" label-in-value filterable clearable @on-change="changeOwner">
                        <Option v-for="(item,index) in ownnerList" :value="item.id" :key="index">{{ item.customerName }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="货物类型:">
                    <Select v-model="formValidate.type" placeholder="所有" @on-change="changeType">
                        <Option v-for="(item,index) in typeList" :value="item.value" :key="index">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="结算方式:">
                    <Select v-model="formValidate.settleType" :disabled="disabledSettleType">
                        <Option v-for="item in payTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="结算客户:" prop="settleCustomerId">
                    <Select v-model="formValidate.settleCustomerId" label-in-value filterable clearable @on-change="changeCustomer">
                        <Option v-for="(item,index) in ownnerList" :value="item.id" :key="index">{{ item.customerName }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="结算时间:">
                    <RadioGroup v-model="formValidate.settleTimeType">
                        <Radio :label="0">出库时结算</Radio>
                        <Radio :label="1">提货时结算</Radio>
                    </RadioGroup>
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
            <div class="pull-left table-title">出库结算单明细
                <Button size="small" type="info" class="margin-left-10" @click="showGoodsModal">选择出库货物</Button>
            </div>
            <div class="pull-right count-content">
                <span class="margin-right-10">出库总数量：
                    <b class="tip">{{totalNumber}}</b> 件</span>
                <span class="margin-right-10">出库总重量：
                    <b class="tip">{{totalWeight}}</b> 吨</span>
            </div>
            </Col>
        </Row>
        <Table :columns="tableColumns" :data="tableData" border class="validTable vertical-middle table-nowrap">
            <template slot-scope="{ row, index }" slot="realOutNumber">
                <Form :ref="'formOutNumber'+index" :model="row">
                    <FormItem prop="realOutNumber" :rules="[{type:'number',required: true, message: '请输入出库数量', trigger: 'change'}]">
                        <div v-if="row.packId">
                          <div v-for="(item,index1) in row.packList" :key="index1" :class="index1 > 0 ? 'table-line table-mn' : 'table-mn'">
                            <InputNumber disabled style="width:100%;" v-model="item.realOutNumber"/>
                          </div>
                        </div>
                        <InputNumber v-else style="width:100%;" :min="1" :max="Number(row.remainNum)" :precision="0" :parser="inputDecimal1" v-model="row.realOutNumber" @on-change="changeNumber(row,index)" />
                    </FormItem>
                </Form>
            </template>

            <template slot-scope="{ row, index }" slot="outSinglePrice">
                <div v-if="row.packId">
                    <div v-for="(item,index1) in row.packList" :key="index1" :class="index1 > 0 ? 'table-line table-mn' : 'table-mn'">
                      <Form :ref="'formSinglePrice'+index + '-' + index1" :model="item">
                        <FormItem class="input-number-no-operate" prop="outSinglePrice" :rules="{type:'number',required: true, message: '请输入出库单价', trigger: 'blur'}">
                            <InputNumber v-model="item.outSinglePrice" @input="changeSinglePrice(item,index,index1)" :parser="inputDecimal"/>
                        </FormItem>
                      </Form>
                    </div>
                </div>
                <Form v-else :ref="'formSinglePrice'+index" :model="row">
                  <FormItem class="input-number-no-operate" prop="outSinglePrice" :rules="{type:'number',required: true, message: '请输入出库单价', trigger: 'blur'}">
                      <InputNumber v-model="row.outSinglePrice" @input="changeSinglePrice(row,index)" :parser="inputDecimal"/>
                  </FormItem>
                </Form>
            </template>

            <template slot="otherPrice" slot-scope="{ row, index }">
                <div v-if="row.packId">
                    <div v-for="(item,index1) in row.packList" :key="index1" :class="index1 > 0 ? 'table-line table-mn' : 'table-mn'">
                      <Form :ref="'formOtherPrice'+index + '-' + index1" :model="item">
                        <FormItem class="input-number-no-operate" prop="otherPrice" :rules="[priceRules]">
                            <InputNumber v-model="item.otherPrice" @input="changeOtherPrice(item,index,index1)" :parser="inputDecimal"/>
                        </FormItem>
                      </Form>
                    </div>
                </div>
                <Form v-else :ref="'formOtherPrice'+index" :model="row">
                  <FormItem class="input-number-no-operate" prop="otherPrice" :rules="[priceRules]">
                      <InputNumber v-model="row.otherPrice" @input="changeOtherPrice(row,index)" :parser="inputDecimal"/>
                  </FormItem>
                </Form>
            </template>
            <div slot="footer" class="table-foot">
                <Form :label-width="150" class="search-form margin-top-15" ref="formPrice" :model="formPrice" v-if="formValidate.settleTimeType==0">
                    <Row>
                        <Col :sm="8" :xs="24">
                        <FormItem class="input-number-no-operate" label="附加费:" prop="extraCharge">
                            <!-- <Input v-model="formPrice.extraCharge" :maxlength="20" @on-keyup="totalAmount"> -->
                            <InputNumber v-model="formPrice.extraCharge" @input="totalAmount" :parser="inputDecimal"/>
                            <span slot="append">元</span>
                            </Input>
                        </FormItem>
                        </Col>
                        <Col :sm="8" :xs="24">
                        <FormItem class="input-number-no-operate" label="打包费:" prop="packageCharge">
                            <!-- <Input v-model="formPrice.packageCharge" :maxlength="20" @on-keyup="totalAmount"> -->
                            <InputNumber v-model="formPrice.packageCharge" @input="totalAmount" :parser="inputDecimal"/>
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
            <Button type="primary" class="btn-common-width" @click="handleSubmit" :disabled="submitDisabled">保存</Button>
            <Button class="btn-common-width margin-left-10" @click="backFun">取消</Button>
        </div>
        <out-goods ref="modalChild" :showModal="showModal" :ownerId="formValidate.ownerId" :type="formValidate.type" :selectedIds="selectedIds" @hide-modal="hideModel"></out-goods>
        <Modal v-model="showModal1" title="母卷信息" width="60%" ok-text="确定">
            <div class="table-scrollable left-right-table" v-if="mjInfor">
                <table border="1">
                    <tbody>
                        <tr>
                            <td class="left-bg">编号：</td>
                            <td>{{mjInfor.code}}</td>
                            <td class="left-bg">产地：</td>
                            <td>{{mjInfor.brandName}}</td>
                        </tr>
                        <tr>
                            <td class="left-bg">品名：</td>
                            <td>{{mjInfor.breedName}}</td>
                            <td class="left-bg">材质：</td>
                            <td>{{mjInfor.materialName}}</td>
                        </tr>
                        <tr>
                            <td class="left-bg">数量（件）：</td>
                            <td>{{mjInfor.number}}</td>
                            <td class="left-bg">单件重量（吨）：</td>
                            <td>{{mjInfor.perAmount | formatWeight}}</td>
                        </tr>
                        <tr>
                            <td class="left-bg">计重方式：</td>
                            <td>{{mjInfor.weightType == '0' ? "抄码" : mjInfor.weightType == '1' ? "过磅" : mjInfor.weightType == '2' ? "理重" : ""}}</td>
                            <td class="left-bg">钢卷号/捆包号：</td>
                            <td>{{mjInfor.baleNumber}}</td>
                        </tr>
                        <tr>
                            <td class="left-bg">包装：</td>
                            <td>{{mjInfor.wrap}}</td>
                            <td class="left-bg">外观：</td>
                            <td>{{mjInfor.appearance}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <h3 v-else style="text-align:center;">没有母卷信息</h3>
            <div slot="footer">
                <Button type="primary" @click="showModal1=false">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import {mapState} from 'vuex'
import OutGoods from "./components/OutGoods";
import { commonQueryOwners } from "@/api/common";
import { OutSettleSave, getParentInventoryItemDetail } from "@/api/outstock";
import { closeNowTag, formatPrice, formatWeight,decimalInput } from "@/libs/util";
import { setTimeout } from 'timers';
export default {
  name: "AddOutstockSettlement",
  components: { OutGoods },
  data() {
    const validateMoney = (rule, value, callback) => {
      if (value) {
        if (!Number(value)) {
          callback(new Error("请输入数字"));
        } else {
          if (String(value).indexOf(".") > -1) {
            let val_arr = String(value).split(".");
            if (val_arr[1].length > 2) {
              callback(new Error("最多两位小数点"));
            }
          }
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      submitDisabled:false,
      showModal1: false,
      showModal: false, //传入子组件的弹框显示
      disabledSettleType: false,
      mjInfor: {},
      deleteOption:[],
      formValidate: {
        ownerId: null,
        ownerName: "",
        settleCustomerId: null,
        settleCustomerName: "",
        settleTimeType:0,
        type: 0,
        settleType: 1,
        desc: ""
      },
      formPrice: {
        extraCharge: null,
        packageCharge: null
      },
      priceRules: {
        validator: validateMoney,
        trigger: "blur"
      },
      ruleValidate: {
        ownerId: [
          {
            required: true,
            message: "请选择货主",
            trigger: "change"
          }
        ],
        settleCustomerId: [
          {
            required: true,
            message: "请选择结算客户",
            trigger: "change"
          }
        ],
        type: [
          {
            required: true,
            message: "请选择出库货物类型",
            trigger: "change"
          }
        ]
      },
      rulePrice: {
        extraCharge: [
          { type: "number", validator: validateMoney, trigger: "blur" }
        ],
        packageCharge: [
          { type: "number", validator: validateMoney, trigger: "blur" }
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
        },
        {
          value: 2,
          label: "废料"
        }
      ],
      ownnerList: [],
      payTypeList: [
        {
          value: 0,
          label: "月结"
        },
        {
          value: 1,
          label: "现结"
        },
        {
          value: 2,
          label: "其他"
        }
      ],
      tableData: [],
      tableColumns: [
        {
          title: "操作",
          align: "center",
          minWidth: 60,
          render: (h, data) => {
            return h("div", [
              h("Icon", {
                props: {
                  type: "md-remove-circle",
                  size: 20
                },
                class: "tb-link-remove color-red",
                on: {
                  click: () => {
                    this.tableData.splice(data.index, 1);
                    this.totalAmount();
                  }
                }
              })
            ]);
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
          title: "可结算数量(件)",
          key: "remainNum",
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
                arr.push(h("div",{class:line}, item.remainNum));
              });
              return h("div", arr);
            }else{
              return h("div", data.row.remainNum);
            }
          }
        },
        {
          title: "出库数量(件)",
          slot: "realOutNumber",
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
              h("span", "出库数量(件)")
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
                arr.push(h("div",{class:line}, formatWeight(item.perAmount)));
              });
              return h("div", arr);
            }else{
              return h("div", formatWeight(data.row.perAmount));
            }
          }
        },
        {
          title: "出库结算重量(吨)",
          key: "totalWeight",
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
                arr.push(h("div",{class:line}, formatWeight(item.totalWeight)));
              });
              return h("div", arr);
            }else{
              return h("div", formatWeight(data.row.totalWeight));
            }
          }
        },
        {
          title: "计量方式",
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
          title: "出库单价(元/吨)",
          slot: "outSinglePrice",
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
              h("span", "出库单价(元/吨)")
            ]);
          }
        },
        {
          title: "出库费用(元)",
          key: "outTotalPrice",
          align: "right",
          minWidth: 110,
          render: (h, data) => {
            if(data.row.packId){
              var arr = [];
              data.row.packList.forEach((item,index) => {
                let line = "table-mn";
                if(index > 0){
                  line = "table-line table-mn"
                }
                arr.push(h("div",{class:line}, formatPrice(item.outTotalPrice)));
              });
              return h("div", arr);
            }else{
              return h("div", formatPrice(data.row.outTotalPrice));
            }
          }
        },
        {
          title: "其他费用(元)",
          slot: "otherPrice",
          minWidth: 120
        },
        {
          title: "总金额(元)",
          key: "totalMoney",
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
                arr.push(h("div",{class:line}, formatPrice(item.totalMoney)));
              });
              return h("div", arr);
            }else{
              return h("div", formatPrice(data.row.totalMoney));
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
      totalWeight: "",
      totalMoney: "",
      selectedIds: [],
      hasMJ: false
    };
  },
  mounted() {
    //初始化settleTimeType
    this.formValidate.settleTimeType=this.defaultSettleTimeType
    //表格头部的合计变化

    this.totalAmount();
    this.getOwnerList();
  },
  computed:{
        ...mapState({
            
            defaultSettleTimeType:state=>state.user.warehouse.outDefaultSettleTime
        }),
		settleTimeType:function(){
			return this.formValidate.settleTimeType;
		}
  },
  watch:{
		settleTimeType:function(){
			let tableLength=this.tableColumns.length
			if(this.settleTimeType==1){
				//从后往前切，避免母卷信息带来的问题
				this.deleteOption=this.tableColumns.splice(tableLength-7,4)
			}else{
				this.deleteOption.forEach((value,index)=>{
					this.tableColumns.splice(tableLength-3+index,0,value)
				})
			}
		}
  },
  methods: {
    inputDecimal(value){
      return decimalInput(value,14,2)
    },
    inputDecimal1(value){
      return decimalInput(value,8,0)
    },
    getMjInfor(inventoryItemId) {
      getParentInventoryItemDetail({ inventoryItemId: inventoryItemId }).then(
        res => {
          this.mjInfor = res.data.data;
        }
      );
    },
    changeOwner(option) {
      this.formValidate.ownerName = option.label;
      this.formValidate.settleCustomerId = option.value;
      this.formValidate.settleCustomerName = option.label;
      this.changeClearTable();
      this.getIsMonthSettle();
    },
    //获取用户结算信息
    getIsMonthSettle() {
      if(this.formValidate.settleCustomerId) {
        this.ownnerList.map((o) => {
          if(this.formValidate.settleCustomerId == o.id) {
            this.formValidate.settleType = 1;
            this.disabledSettleType = o.isMonthSettle == 1? false: true;
          }
        })
      } else {
        this.disabledSettleType = false;
      }
    },
    changeType() {
      if (this.formValidate.type == 1) {
        if (!this.hasMJ) {
          this.tableColumns.splice(6, 0, {
            title: "母卷信息",
            align: "center",
            minWidth: 80,
            render: (h, data) => {
              if(data.row.packId){
                var arr = [];
                data.row.packList.forEach((item,index) => {
                  let line = "table-mn";
                  if(index > 0){
                    line = "table-line table-mn"
                  }
                  let ret;
                  if (item.type == 1) {
                    ret = [h(
                      "a",
                      {
                        class: "tb-link",
                        on: {
                          click: () => {
                            this.showModal1 = true;
                            this.getMjInfor(item.inventoryItemId);
                          }
                        }
                      },
                      "查看"
                    )]; 
                  } else {
                    ret = "无";
                  }
                  arr.push(h("div",{class:line}, ret));
                });
                return h("div", arr);
              }else{
                if (data.row.type == 1) {
                  return h(
                    "a",
                    {
                      class: "tb-link",
                      on: {
                        click: () => {
                          this.showModal1 = true;
                          this.getMjInfor(data.row.inventoryItemId);
                        }
                      }
                    },
                    "查看"
                  );
                } else {
                  return h("span", "无");
                }
              }
            }
          });
        }
        this.hasMJ = true;
      } else {
        if (this.hasMJ) {
          this.tableColumns.splice(6, 1);
        }
        this.hasMJ = false;
      }
      this.changeClearTable();
    },
    changeCustomer(option) {
      if(option){
        this.formValidate.settleCustomerName = option.label;
      }else{
        this.formValidate.settleCustomerName = "";
      }
      this.getIsMonthSettle()
    },
    /**弹框关闭触发的事件*/
    hideModel(data) {
      if (data) {
        let packIds = this.tableData.map(item =>{
          return item.packId;
        })
        for (let i = 0; i < data.length; i++) {
          if(data[i].packId && packIds.indexOf(data[i].packId) >= 0){
          }else{
            //可结算数量(件)
            data[i].remainNum = data[i].number - data[i].outNum;

            //出库结算数量默认等于可结算数量，不能为0
            data[i].realOutNumber = data[i].remainNum ? data[i].remainNum : 1;

            //出库结算总重量(吨) = 出库结算数量*单件重量
            data[i].totalWeight = data[i].realOutNumber * data[i].perAmount;

            //不带入加工单价
          //data[i].outSinglePrice = data[i].unitPrice ? String(data[i].unitPrice) : "";

            //出库费用(元) = 出库总重量*出库单价
            data[i].outTotalPrice = data[i].totalWeight * (data[i].outSinglePrice?data[i].outSinglePrice:0);
            //其他费用,默认为空（需要用户自己填写）
            data[i].otherPrice = "";

            //总金额 = 出库费用(元) + 其他费用(元)
            data[i].totalMoney =
              Number(data[i].outTotalPrice) + Number(data[i].otherPrice);
            data[i].packList = data[i].packList ? data[i].packList : [];
            data[i].packList.forEach((item,index)=>{
              if(item.isIntegrate==1){
                data[i].packList[index].outSinglePrice=0;
              }
            })
            this.tableData.push({
              inventoryItemId: data[i].id,
              ownerId: data[i].ownerId,
              ownerName: data[i].ownerName,
              warehouseId: data[i].warehouseId,
              warehouseName: data[i].warehouseName,
              code: data[i].code,
              brandName: data[i].brandName,
              breedName: data[i].breedName,
              materialName: data[i].materialName,
              specName: data[i].specName,
              storageArea: data[i].storageArea,
              storagePlace: data[i].storagePlace,
              remainNum: data[i].remainNum ? parseFloat(data[i].remainNum) : null,
              realOutNumber: data[i].realOutNumber ? parseFloat(data[i].realOutNumber) : null,
              perAmount: data[i].perAmount ? parseFloat(data[i].perAmount) : null,
              totalWeight: data[i].totalWeight,
              weightType: data[i].weightType,
              //如果货物在加工时标记了“加工出库一票结”，此字段默认为0 
              outSinglePrice: data[i].isIntegrate==1?0:(data[i].outSinglePrice ? parseFloat(data[i].outSinglePrice) : null),
              outTotalPrice: data[i].outTotalPrice ? parseFloat(data[i].outTotalPrice) : null,
              otherPrice: data[i].otherPrice ? parseFloat(data[i].otherPrice) : null,
              totalMoney: data[i].totalMoney ? parseFloat(data[i].totalMoney) : null,
              wrap: data[i].wrap,
              appearance: data[i].appearance,
              baleNumber: data[i].baleNumber,
              type: data[i].type,
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
    /**货主或者货物类型改变时表格数据清空*/
    changeClearTable() {
      this.tableData = [];
    },
    /**货主下拉选项*/
    getOwnerList() {
      commonQueryOwners().then(res => {
        this.ownnerList = res.data.data.map(item => {
          return { id: item.id.toString(), customerName: item.customerName, isMonthSettle: item.isMonthSettle };
        });
      });
    },
    /**选择出库货物 */
    showGoodsModal() {
      //先判断是否选了货主和货物类型
      if (!this.formValidate.ownerId) {
        this.$Modal.warning({
          title: "提示",
          content: "<p>请先选择货主！</p>"
        });
      } else {
        //拿到已选择项的物资明细id
        this.selectedIds = this.tableData.map(item => {
          return item.inventoryItemId;
        });
        //弹框显示
        this.showModal = true;
        //调用子组件的方法
        this.$refs.modalChild.getList();
      }
    },
    /** 出库结算数量 联动 出库结算重量,出库费用,总金额 */
    changeNumber(row, index) {
      let a = row.realOutNumber ? row.realOutNumber : 1; //出库结算数量
      let b = row.perAmount; //单件重量
      let c = row.outSinglePrice ? row.outSinglePrice : 0; //出库单价
      let d = row.otherPrice ? row.otherPrice : 0; //其他费用
      //出库总重量=出库结算数量*出库单价
      row.totalWeight = a * b ? (a * b).toFixed(4) : "0.0000";
      //出库费用=出库总重量*出库单价
      row.outTotalPrice =
				row.totalWeight * c ? (row.totalWeight * c).toFixed(2) : "0.00";
      //总金额=出库费用+其他费用
      row.totalMoney =
        Number(row.outTotalPrice) + Number(d)
          ? (Number(row.outTotalPrice) + Number(d)).toFixed(2)
          : "0.00";
      //将修改完的值赋给原始的tableData
      this.tableData[index] = row;
      //表格头部的合计变化
      this.totalAmount();
    },
    /** 出库单价 联动 出库费用,总金额 */
    changeSinglePrice(row, index,index1) {
      let a = row.outSinglePrice
        ? isNaN(row.outSinglePrice) ? 0 : row.outSinglePrice
        : 0; //出库单价
      let d = row.otherPrice ? (isNaN(row.otherPrice) ? 0 : row.otherPrice) : 0; //其他费用
      //出库费用=出库总重量*出库单价
      row.outTotalPrice =
        row.totalWeight * a ? (row.totalWeight * a).toFixed(2) : "0.00";
      //总金额=出库费用+其他费用
      row.totalMoney =
        Number(row.outTotalPrice) + Number(d)
          ? (Number(row.outTotalPrice) + Number(d)).toFixed(2)
          : "0.00";
      //将修改完的值赋给原始的tableData
      if(index1 || index1 == 0){
        this.tableData[index].packList[index1] = row;
      }else{
        this.tableData[index] = row;
      }
      //表格头部的合计变化
      this.totalAmount();
    },
    /** 其他费用 联动 总金额 */
    changeOtherPrice(row, index,index1) {
      let d = row.otherPrice ? (isNaN(row.otherPrice) ? 0 : row.otherPrice) : 0; //其他费用
      //总金额=出库费用+其他费用
      row.totalMoney =
        Number(row.outTotalPrice) + Number(d)
          ? (Number(row.outTotalPrice) + Number(d)).toFixed(2)
          : "0.00";
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
        if(this.tableData[i].packId){
          for(var j=0;j<this.tableData[i].packList.length;j++){
              number += Number(this.tableData[i].packList[j].realOutNumber);
              weight += Number(this.tableData[i].packList[j].totalWeight);
              money += Number(this.tableData[i].packList[j].totalMoney);
          }
        }else{
          number += Number(this.tableData[i].realOutNumber);
          weight += Number(this.tableData[i].totalWeight);
          money += Number(this.tableData[i].totalMoney);
        }
      }
      this.totalNumber = number;
      this.totalWeight = weight ? weight.toFixed(4) : "0.0000";
      //附加费
      let extraCharge = this.formPrice.extraCharge
        ? isNaN(this.formPrice.extraCharge)
          ? 0
          : Number(this.formPrice.extraCharge)
        : 0;
      //打包费
      let packageCharge = this.formPrice.packageCharge
        ? isNaN(this.formPrice.packageCharge)
          ? 0
          : Number(this.formPrice.packageCharge)
        : 0;
      //总金额=表格合计总金额+附加费+打包费
      this.totalMoney =
        money + packageCharge + extraCharge
          ? (money + packageCharge + extraCharge).toFixed(2)
          : "0.00";
    },
    /** 出库结算单明细验证*/
    checkTable() {
      //循环验证出库结算数量
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
			//循环验证出库单价
			let singlePriceFlagArr = [];
			//提货时结算不验证
      if(this.formValidate.settleTimeType==0){
        for (let i = 0, len = this.tableData.length; i < len; i++) {
					if(this.tableData[i].packId){
					var newValid = true;
					for(var j=0;j<this.tableData[i].packList.length;j++){
							this.$refs["formSinglePrice" + i + "-"+j][0].validate(valid => {
							if(!valid){
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
								singlePriceFlagArr[i] = false;
								}
						});
					}
        }
      }
      
			//循环验证其他费用
			let otherPriceFlagArr = [];
			//提货时结算不验证
			if(this.formValidate.settleTimeType==0){
				for (let i = 0, len = this.tableData.length; i < len; i++) {
					if(this.tableData[i].packId){
						var newValid = true;
						for(var j=0;j<this.tableData[i].packList.length;j++){
							this.$refs["formOtherPrice" + i + "-"+j][0].validate(valid => {
								if(!valid){
									newValid = false;
								}
							});
						}
						if (newValid) {
								otherPriceFlagArr[i] = true;
						} else {
								otherPriceFlagArr[i] = false;
						}
					}else{
						this.$refs["formOtherPrice" + i].validate(valid => {
							if (valid) {
								otherPriceFlagArr[i] = true;
							} else {
								otherPriceFlagArr[i] = false;
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
      //验证下面的打包费和附加费
    //   let formPriceFlag;
    //   this.$refs["formPrice"].validate(valid => {
    //     if (valid) {
    //       formPriceFlag = true;
    //     } else {
    //       formPriceFlag = false;
    //     }
    //   });
      //所有的验证只要有一个没通过，就不通过outNumberFlagArr
      if (
        outNumberFlagArr.indexOf(false) > -1 ||
        singlePriceFlagArr.indexOf(false) > -1 ||
        otherPriceFlagArr.indexOf(false) > -1 ||
        !formValidateFlag
      ) {
        return false;
      } else {
        return true;
      }
    },
    /** 保存出库结算单*/
    handleSubmit() {
      this.submitDisabled = true;
      let tableFlag = this.checkTable();
      if (tableFlag) {
        var submitData = [];
        this.tableData.forEach((item,index)=>{
          if(item.packId){
            item.packList.forEach((item1)=>{
              submitData.push(item1)
            })
          }else{
            submitData.push(item)
          }
        })
        if (submitData.length > 0) {
          let para = {
            ownerId: this.formValidate.ownerId,
            ownerName: this.formValidate.ownerName,
            settleCustomerId: this.formValidate.settleCustomerId,
            settleCustomerName: this.formValidate.settleCustomerName,
            warehouseId: submitData[0].warehouseId,
            warehouseName: submitData[0].warehouseName,
            type: this.formValidate.type,
            remark: this.formValidate.desc,
            settleType: this.formValidate.settleType,
            settleTimeType:this.formValidate.settleTimeType,
          };
          if(this.formValidate.settleTimeType==0){
                para.extraCharge=this.formPrice.extraCharge? parseFloat(this.formPrice.extraCharge).toFixed(2): 0;
                para.packageCharge=this.formPrice.packageCharge? parseFloat(this.formPrice.packageCharge).toFixed(2): 0;     
          }
          let outSettleItemDTOs = [];
          for (let i = 0; i < submitData.length; i++) {
						if(this.formValidate.settleTimeType==0){
              outSettleItemDTOs.push({
                weight: submitData[i].totalWeight
                  ? parseFloat(submitData[i].totalWeight).toFixed(4)
                  : 0,
                inventoryItemId: submitData[i].inventoryItemId,
								number: submitData[i].realOutNumber,
								otherCharge: submitData[i].otherPrice
									? parseFloat(submitData[i].otherPrice).toFixed(2)
									: 0,
								price: submitData[i].outSinglePrice
									? parseFloat(submitData[i].outSinglePrice).toFixed(2)
									: 0
              });
            }else{
							outSettleItemDTOs.push({
                weight: submitData[i].totalWeight
                  ? parseFloat(submitData[i].totalWeight).toFixed(4)
                  : 0,
                inventoryItemId: submitData[i].inventoryItemId,
								number: submitData[i].realOutNumber,
              });
						}
          }
          para.outSettleItemDTOs = outSettleItemDTOs;
          OutSettleSave(para).then(res => {
            if (res.data.code == "200") {
              this.$Message.success({
                content: "新增出库结算单成功!",
                duration: 1
              });
              setTimeout(() => {
                closeNowTag(this.$store.state.app, this.$route);
                this.$router.push({
                  name: "OutstockSettlement"
                });
              }, 1000);
            } else {
              this.$Message.error({
                content: res.data.msg,
                duration: 1
              });
            }
            setTimeout(()=>{
              this.submitDisabled = false;
            },1000)
          });
        } else {
          this.$Message.error({
            content: "请选择出库货物!",
            duration: 1
          });
          this.submitDisabled = false;
        }
      } else {
        this.submitDisabled = false;
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
            path: "OutstockSettlement"
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
.ivu-table-db{border-top: 1px solid #dcdee2;border-left: 1px solid #dcdee2;}
.ivu-table-db th,.ivu-table-db td{padding:5px;}
</style>


