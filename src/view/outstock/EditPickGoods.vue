<template>
  <div class="white-bg">
    <Form :label-width="150" class="search-form" ref="formValidate" :model="form" :rules="ruleValidate">
      <Row>
        <Col :sm="8" :xs="24">
        <FormItem label="提货单号:">
          <div class="val-text">{{form.deliveryCode}}</div>
        </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
        <FormItem label="出库结算单号:">
          <div class="val-text tb-link">
            <router-link :to="{name:'ViewOutstockSettlement',query:{id:form.outSettleId}}">{{form.outSettleCode}}</router-link>
          </div>
        </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
        <FormItem label="提货日期:">
          <div class="val-text">
            <DatePicker v-model="inputDate" type="date" style="width:100%;"></DatePicker>
          </div>
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col :sm="8" :xs="24">
        <FormItem label="货主:">
          <div class="val-text">{{form.ownerName}}</div>
        </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
        <FormItem label="提货客户:" prop="deliveryCustomerId">
          <Select v-model="form.deliveryCustomerId" filterable clearable label-in-value @on-change="changeDeliveryCustomer">
            <Option v-for="(item,index) in ownnerList" :value="item.id" :key="index">{{ item.customerName }}</Option>
          </Select>
        </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
        <FormItem label="放货单号:">
          <Input v-model="form.releaseCode"></Input>
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col :sm="24" :xs="24">
        <FormItem label="备注:">
          <Input v-model="form.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" />
        </FormItem>
        </Col>
      </Row>
    </Form>
    <Row>
      <Col span="24">
      <div class="pull-left table-title margin-bottom-5">提货司机信息</div>
      </Col>
    </Row>
    <Table ref="myTable" :columns="tableColumns2" :data="tableData2" border class="validTable">
      <template slot="carNum" slot-scope="{ row, index }">
        <Form :ref="'formCar'+index" :model="row">
          <FormItem prop="carNum" :rules="{required: true, message: '请输入提货车号', trigger: 'blur'}">
            <Input v-model="row.carNum" :maxlength="20" @on-change="tableData3[index].carNum1 = row.carNum"></Input>
          </FormItem>
        </Form>
      </template>

      <template slot="mobile" slot-scope="{ row, index }">
        <Form :ref="'formPhone'+index" :model="row">
          <FormItem prop="mobile" :rules="[{required: true, message: '请输入司机电话', trigger: 'blur'},phoneRules]">
            <Input v-model="row.mobile" :maxlength="20" @on-change="tableData3[index].mobile1 = row.mobile"></Input>
          </FormItem>
        </Form>
      </template>

      <template slot="driver" slot-scope="{ row, index }">
        <Input v-model="row.driver" :maxlength="20" @on-change="tableData3[index].driver1 = row.driver" />
      </template>

      <template slot="cardNum" slot-scope="{ row, index }">
        <Form :ref="'formId'+index" :model="row">
            <FormItem prop="cardNum" :rules="IdRules">
                <Input v-model="row.cardNum" :maxlength="20" @on-change="tableData3[index].cardNum1 = row.cardNum" />
            </FormItem>
        </Form>
      </template>

      <template slot="action" slot-scope="{ row, index }">
        <Icon type="md-add-circle" size="20" class="color-green margin-right-10 handstyle" @click="addRow(index)" />
        <Icon type="md-remove-circle" size="20" class="color-red handstyle" @click="delRow(index)" />
      </template>
    </Table>
    <Row class="margin-top-20">
      <Col span="24">
      <div class="pull-left table-title">待提货明细</div>
      <div class="pull-right count-content">
        <span class="margin-right-10">提货总数量：
          <b class="tip">{{countEle.countNum}}</b> 件</span>
        <span class="margin-right-10">提货总重量：
          <b class="tip">{{countEle.countWeight}}</b> 吨</span>
      </div>
      </Col>
    </Row>
    <Table class="pickTable validTable" ref="selection" :columns="tableColumns" :data="tableData" border>

      <template slot-scope="{ row, index }" slot="weighedWeight">
				<Form ref="formWeighedWeight" :model="row" v-if="settleTimeType==1">
          <FormItem prop="weighedWeight" :rules="{type:'number',required: true, message: '请输入过磅重量', trigger: 'change'}" >
            <InputNumber v-model="row.weighedWeight" :min="0" :parser="inputWeight" @on-change="changeWeighedWeight(index,$event)" class="input-number-no-operate" ></InputNumber>
          </FormItem>
        </Form>
        <InputNumber v-else v-model="row.weighedWeight" :min="0" :parser="inputWeight" @on-change="changeWeighedWeight(index,$event)" class="input-number-no-operate"></InputNumber>
      </template>
	    <template slot-scope="{ row,index }" slot="price" >
        <Form ref="formPrice" :model="row" v-if="settleTimeType==1" >
          <FormItem prop="price" :rules="{type:'number',required: true, message: '请输入提货单价', trigger: 'change'}" >
            <InputNumber v-model="row.price" :min="0" :parser="inputPrice" class="input-number-no-operate" @on-change="chanagePrice(index,$event)"></InputNumber>
          </FormItem>
        </Form>
        <InputNumber v-else v-model="row.price" :min="0" :parser="inputPrice" class="input-number-no-operate" @on-change="chanagePrice(index,$event)"></InputNumber>
      </template>
			<template slot-scope="{ row,index }" slot="otherCharge" >
        <InputNumber v-model="row.otherCharge" :min="0" :parser="inputPrice" class="input-number-no-operate" @on-change="changeOthercharge(index,$event)"></InputNumber>
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
      <Button type="primary" class="btn-common-width" @click="handleSubmit" :disabled="submitDisabled">保存</Button>
      <Button class="btn-common-width margin-left-10" @click="backFun">取消</Button>
    </div>
  </div>

</template>
<script>
import { closeNowTag, formatDate, formatWeight, formatPrice,decimalInput } from "@/libs/util";
import { queryDeliveryDetail, updateDelivery } from "@/api/outstock";
import { commonQueryOwners } from "@/api/common";
export default {
  name: "EditPickGoods",
  data() {
    const validatePhone = (rule, value, callback) => {
      var myreg=/^[1][0-9]{10}$/;
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
      var myreg=/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;;
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
			inputDate: "",
			settleTimeType:0,
			tableAllMoney:0,
			changeSign:false,
			form: {},
			formPrice:{
				extraCharge:0,
				packageCharge:0
			},
      ruleValidate: {
        deliveryCustomerId: [
            {  
                required: true,
                message: "请选择提货客户",
                trigger: "change",
                type: 'number'
            }
        ]
      },
      phoneRules: {
        validator: validatePhone,
        trigger: "blur"
      },
      IdRules: {
        validator: validateId,
        trigger: "blur"
      },
      ownnerList:[],
      tableColumns: [
        {
          title: "编号",
          key: "code",
          align: "left",
          minWidth: 120
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
            }
            return h("span", typeText);
          }
        },
        {
          title: "产地",
          key: "brandName",
          align: "left",
          minWidth: 100
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
          minWidth: 150
        },
       
        {
          title: "库区",
          key: "storageArea",
          align: "left",
          minWidth: 100
        },
        {
          title: "库位",
          key: "storagePlace",
          align: "left",
          minWidth: 100
        },
        {
          title: "提货数量(件)",
          key: "number",
          align: "right",
          minWidth: 100
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
          title: "提货总重量(吨)",
          key: "weight",
          align: "right",
          minWidth: 120,
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.weight ? Number(params.row.weight).toFixed(4) : 0
            );
          }
				},
				
				{
          title: "过磅重量(吨)",
          slot: "weighedWeight",
          align: "left",
          minWidth: 140
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
          title: "包装",
          key: "wrap",
          align: "left",
          minWidth: 100
        },
        {
          title: "外观",
          key: "appearance",
          align: "left",
          minWidth: 100
        },
        {
          title: "钢卷号/捆包号",
          key: "baleNumber",
          align: "left",
          minWidth: 120
        },
        {
          title: "操作",
          align: "center",
          minWidth: 60,
          fixed: "right",
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
                    let _this = this;
                    //是否只剩同一个打包号的数据
                    let isOnlyPackCode = true;
                    if(data.row.packCode) {
                      this.tableData.map(o => {
                        if(o.packCode != data.row.packCode) {
                          isOnlyPackCode = false;
                        }
                      })
                      if(!isOnlyPackCode) {
                        let copyTableData = JSON.parse(JSON.stringify(this.tableData));
                        let num = 0;
                        copyTableData.map((o,i) => {
                          if(o.packCode == data.row.packCode) { 
                            num ++ ;
                            this.itemsDelete.push(o.itemId);
                          }
                        })
                        for(var i in copyTableData) {
                          if(copyTableData[i].packCode == data.row.packCode) { 
                            this.tableData.splice(i, num);
                            break;
                          }
                        }
                      } else {
                        this.$Message.error("至少保留一组同一打包号的待提货明细！");
                      }
                    } else {
                      if(this.tableData.length > 1) {
                        this.tableData.splice(data.index, 1);
                        this.itemsDelete.push(data.row.itemId);
                      } else {
                        this.$Message.error("至少保留一组同一打包号的待提货明细！");
                      }
                    }
                  }
                }
              })
            ]);
          }
        }
      ],
      tableData: [],
      tableData2: [],
      tableData3: [],
      tableData4: [],
      itemsDelete: [],
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
      ]
    };
  },
  computed: {
    countEle: function() {
      let countNum = 0,
        countWeight = 0;
      if (this.tableData) {
        for (var i = 0; i < this.tableData.length; i++) {
          countNum =
            countNum +
            (this.tableData[i].number
              ? parseInt(this.tableData[i].number)
              : 0);
          countWeight =
            countWeight +
            (this.tableData[i].weight
              ? parseFloat(this.tableData[i].weight)
              : 0);
        }
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
  created() {
    this.getDetail();
    this.getOwnerList();
  },
  methods: {
    inputWeight(value) {
      return decimalInput(value,12,4);
		},
		inputPrice(value) {
      return decimalInput(value, 14, 2);
		},
		updatetable(){
      this.tableAllMoney=0;
      this.tableData.forEach(item=>{
					this.tableAllMoney=Number(this.tableAllMoney)+Number(item.totalprice);
      })
    },
    /** 获取初始化数据 */
    getDetail() {
      queryDeliveryDetail({
        id: this.$route.query.id
      }).then(res => {
        if (res.data.code == "200") {
          let data = res.data.data;
					this.form = data;
					this.formPrice={
						extraCharge:data.extraCharge,
						packageCharge:data.packageCharge
					}
					this.settleTimeType=this.form.settleTimeType;
					if(this.settleTimeType==0){
						this.tableColumns.splice(13,4)
					}
					this.tableData = data&&data.deliveryItems ? data.deliveryItems:[] ;
					//如果货物在加工时标记了“加工出库一票结”，此字段默认为0且不可修改
					this.tableData.forEach((item,index)=>{
						if(item.isIntegrate==1){
							this.tableData[index].price=0;
						}
					})	
          this.inputDate = data&&data.deliveryDate?new Date(data.deliveryDate):'';
          const deliveryTransports =
            data && data.deliveryTransports ? data.deliveryTransports : [];
          this.tableData3 = [];
          this.tableData2 = deliveryTransports.map(item => {
            this.tableData3.push({
              carNum1: item.carNum,
              cardNum1: item.cardNum,
              mobile1: item.mobile,
              driver1: item.driver,
              id: item.id
            });
            this.tableData4.push({
              carNum1: item.carNum,
              cardNum1: item.cardNum,
              mobile1: item.mobile,
              driver1: item.driver,
              id: item.id
            });
            return {
              carNum: item.carNum,
              cardNum: item.cardNum,
              mobile: item.mobile,
              driver: item.driver
            };
          });
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    /** 删除司机行 */
    delRow(idx) {
      if (this.tableData2.length > 1) {
        if (this.tableData3[idx].id) {
          for (var i = 0; i < this.tableData4.length; i++) {
            if (this.tableData3[idx].id == this.tableData4[i].id) {
              this.tableData4[i].id = 9;
            }
          }
        }
        this.tableData2.splice(idx, 1);
        this.tableData3.splice(idx, 1);
      }
    },
    /** 添加司机行 */
    addRow() {
      for(var i=0;i<this.tableData2.length;i++){
        this.tableData2[i].carNum = this.tableData2[i].carNum1;
        this.tableData2[i].mobile = this.tableData2[i].mobile1;
        this.tableData2[i].driver = this.tableData2[i].driver1;
        this.tableData2[i].cardNum = this.tableData2[i].cardNum1;
      }
      this.tableData2.push({
        carNum: "",
        cardNum: "",
        driver: "",
        mobile: ""
      });
      this.tableData3.push({
        carNum1: "",
        cardNum1: "",
        driver1: "",
        mobile1: "",
        id: ""
      });
    },
    /** 司机必填项验证*/
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
      let phoneCompleteFlagArr = [];
      for (let i = 0, len = this.tableData2.length; i < len; i++) {
        this.$refs["formPhone" + i].validate(valid => {
          if (valid) {
            phoneCompleteFlagArr[i] = true;
          } else {
            phoneCompleteFlagArr[i] = false;
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
      //车号和电话中任意有一个false的时候，验证都不通过
      if (
        carCompleteFlagArr.indexOf(false) > -1 ||
        phoneCompleteFlagArr.indexOf(false) > -1 || 
        cardCompleteFlagArr.indexOf(false) > -1
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
			let formTable=true;
			if(this.settleTimeType==1){
				this.$refs['formWeighedWeight'].validate(valid => {
					if(!valid){
						formTable = false;
					}
				});
				this.$refs['formPrice'].validate(valid => {
					if(!valid){
						formTable = false;
					}
				});
			}
      this.$refs['formValidate'].validate(valid => {
        formValidate = valid;
      });
      if (flag&&formValidate && formTable) {
        this.submitDisabled = true;
        let deliveryItems = [];
          this.tableData.forEach((item,index) => {
						if(this.settleTimeType==1){
							deliveryItems.push({
								price:item.price,
								otherCharge:item.otherCharge?item.otherCharge : 0,
								weighedWeight: item.weighedWeight ? parseFloat(item.weighedWeight).toFixed(4) : null,
								itemId: item.itemId
							})
						}else{
							deliveryItems.push({
								weighedWeight: item.weighedWeight ? parseFloat(item.weighedWeight).toFixed(4) : null,
								itemId: item.itemId
							})
						}
            
          });
        let deliveryTransports = this.tableData3.map(item => {
          return {
            carNum: item.carNum1,
            cardNum: item.cardNum1,
            mobile: item.mobile1,
            driver: item.driver1,
            id: item.id
          };
        });
        for (var i = 0; i < this.tableData4.length; i++) {
          if (this.tableData4[i].id == 9) {
            deliveryTransports.push(this.tableData4[i]);
          }
				}
				let data={
          releaseCode: this.form.releaseCode,
          deliveryCustomerId: this.form.deliveryCustomerId,
          deliveryCustomerName: this.form.deliveryCustomerName,
          deliveryDate: formatDate(this.inputDate),
          deliveryId: this.form.deliveryId,
          deliveryItems: deliveryItems,
          deleteItemIds: this.itemsDelete.join(","),
          deliveryTransports: deliveryTransports,
          remark: this.form.remark
				}
				if(this.settleTimeType==1){
					data.extraCharge=this.formPrice.extraCharge
					data.packageCharge=this.formPrice.packageCharge
				}
        updateDelivery(data).then(res => {
          if (res.data.code == "200") {
            this.$Message.success({
              content: "编辑提货单成功!",
              duration: 1
            });
            setTimeout(() => {
              closeNowTag(this.$store.state.app, this.$route);
              this.$router.push({
                path: "PickGoodsManage"
              });
            }, 1000);
          } else {
            this.$Message.error(res.data.msg+'');
          }
          setTimeout(()=>{
              this.submitDisabled = false;
          },1000)
        });
      }
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
    changeWeighedWeight(index, val) {
      let row = JSON.parse(JSON.stringify(this.tableData[index]));
      row.weighedWeight = val;
      this.tableData[index] = JSON.parse(JSON.stringify(row));
		},
		chanagePrice(index, val){
			let row = JSON.parse(JSON.stringify(this.tableData[index]));
      row.price = val;
      this.tableData[index] = JSON.parse(JSON.stringify(row));
		},
		changeOthercharge(index, val) {
      let row = JSON.parse(JSON.stringify(this.tableData[index]));
      row.otherCharge = val;
      this.tableData[index] = JSON.parse(JSON.stringify(row));
    },
    changeDeliveryCustomer(obj) {
      this.form.deliveryCustomerName = obj?obj.label:'';
      this.form.deliveryCustomerId = obj?obj.value:'';
    },
    /** 取消返回 */
    backFun() {
      this.$Modal.confirm({
        title: "提示",
        content: "有数据未保存，是否确定放弃？",
        onOk: () => {
          closeNowTag(this.$store.state.app, this.$route);
          this.$router.push({
            path: "PickGoodsManage"
          });
        },
        onCancel: () => {}
      });
    }
  }
};
</script>
<style lang="less" scoped>
.search-form .ivu-form-item {
  margin-bottom: 20px;
}
@deep: ~'>>>';
@{deep} .ivu-input, .ivu-input-number {
    width: 100%;
}
</style>



