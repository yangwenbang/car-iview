<template>
  <Row>
    <Col
      :xs="24"
      :sm="24"
      :md="24"
    >
    <Row class="margin-bottom-10">
      <Col span="24">
      <div class="pull-left table-title">机组</div>
      </Col>
    </Row>
    <RadioGroup v-model="currentRadio.deviceId" @on-change="changeRadio">
      <Radio v-for="(radio, index) in groupList"
        :label="radio.deviceId"
        :key="index"
      >{{radio.deviceName}}</Radio>
    </RadioGroup>
    <div class="count-content"><span class="margin-right-10">当前单量：<b class="tip">{{currentRadio.waitingProcessNum}}</b> 单</span> <span class="margin-right-10">待加工卷数：<b class="tip">{{currentRadio.number}}</b> 卷</span> <span class="margin-right-10">待加工重量：<b class="tip">{{currentRadio.weight|formatWeight}}</b> 吨</span>
    </div>
    <Row :gutter="10">
      <Col span="24">
      <div class="pull-left margin-bottom-10 margin-top-20 table-title">
        <span class="margin-right-10">加工信息</span>
        <Button
          type="info"
          size="small"
          @click="showCoilModal"
          class="margin-right-10"
        >选择原料卷</Button>
        <Button
          type="info"
          size="small"
          @click="showCoilModal1"
          class="margin-right-10"
        >选择成品卷</Button>
      </div>
      </Col>
      <Col span="24">
      <div class="table-content">
        <div class="ivu-table table1">
          <table
            cellspacing="0"
            cellpadding="0"
            border="0"
            width="100%"
          >
            <thead>
              <tr>
                <th
                  colspan="7"
                  class="text-center"
                >
                  <div class="ivu-table-cell">母卷信息</div>
                </th>
                <th
                  colspan="9"
                  class="text-center"
                >
                  <div class="ivu-table-cell">加工信息
                     <span
                      class="tb-link"
                      @click="batchCopy"
                    >[复制规格]</span>
                  </div>
                </th>
              </tr>
              <tr>
                <th>
                  <div class="ivu-table-cell">操作</div>
                </th>
                <th>
                  <div class="ivu-table-cell">编号</div>
                </th>
                <th>
                  <div class="ivu-table-cell">母卷信息</div>
                </th>
                <th class="text-right">
                  <div class="ivu-table-cell">数量(卷)</div>
                </th>
                <th class="text-right">
                  <div class="ivu-table-cell">重量(吨)</div>
                </th>
                <th>
                  <div class="ivu-table-cell"><span class="color-red">*</span>用料(吨)</div>
                </th>
                <th>
                  <div class="ivu-table-cell"><span class="color-red">*</span>分段 <Tooltip
                      content="1表示不分段"
                      placement="top"
                    >
                      <Icon
                        type='md-help-circle'
                        :size="17"
                      ></Icon>
                    </Tooltip>
                  </div>
                </th>
                <th>
                  <div class="ivu-table-cell"><span class="color-red">*</span>加工宽度(mm)</div>
                </th>
                <th>
                  <div class="ivu-table-cell"><span class="color-red">*</span>数量(条)</div>
                </th>
                <th class="text-right">
                  <div class="ivu-table-cell">理重(吨)</div>
                </th>
                <th>
                  <div class="ivu-table-cell">加工单价(元/吨)</div>
                </th>
                <th>
                  <div class="ivu-table-cell">其他费用(元)</div>
                </th>
                <th class="text-center">
                  <div class="ivu-table-cell">操作
                  </div>
                </th>
                <th class="text-right">
                  <div class="ivu-table-cell">已用宽度(mm)</div>
                </th>
                <th class="text-right">
                  <div class="ivu-table-cell">剩余宽度(mm)</div>
                </th>
                <th class="text-right">
                  <div class="ivu-table-cell">金额(元)</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="tableData1.length == 0">
                <td
                  colspan="16"
                  class="text-center"
                >
                  <div class="ivu-table-cell">无数据</div>
                </td>
              </tr>
              <template v-for="(data, index) in tableData1">
                <tr :key="index" :class="{'tr-even': index%2 == 1}">
                  <td
                    class="text-center"
                    :rowspan="data.processProducts.length"
                  >
                    <div class="ivu-table-cell">
                      <Icon
                        class="tb-link-remove color-red"
                        type="md-remove-circle"
                        :size="20"
                        @click="removeTableData(index)"
                      ></Icon>
                    </div>
                  </td>
                  <td :rowspan="data.processProducts.length">
                    <div class="ivu-table-cell">{{data.inventoryCode}}</div>
                  </td>
                  <td :rowspan="data.processProducts.length">
                    <div class="ivu-table-cell">
                      <div>捆包号：{{data.baleNumber}}</div>
                      <div>产地： {{data.brandName}}</div>
                      <div>品名：{{data.breedName}}</div>
                      <div>材质： {{data.materialName}}</div>
                      <div>规格：<b style="color:#1890ff">{{data.specName}}</b></div>
                      <div>库区库位：{{data.storageArea}}&nbsp;{{data.storagePlace}}</div>
                      <div>包装：{{data.wrap}}</div>
                    </div>
                  </td>
                  <td
                    class="text-right"
                    :rowspan="data.processProducts.length"
                  >
                    <div class="ivu-table-cell">{{data.number}}</div>
                  </td>
                  <td
                    class="text-right"
                    :rowspan="data.processProducts.length"
                  >
                    <div class="ivu-table-cell">{{data.weight|formatWeight}}</div>
                  </td>
                  <td :rowspan="data.processProducts.length">
                    <div class="ivu-table-cell">
                      <InputNumber v-model="data.processWeight" :min="0" :parser="inputWeight"  @on-change="computedAll" :class="{'input-number-no-operate':true,'error-border': validate==true && !validateCol5(index).flag}"></InputNumber>
                       <div v-if="validate==true && !validateCol5(index).flag" class="color-red">{{validateCol5(index).content}}</div>
                    </div>
                  </td>
                  <td :rowspan="data.processProducts.length">
                    <div class="ivu-table-cell">
                      <InputNumber v-model="data.sectionNumber" :min="1" :parser="inputNum"  @on-change="computedAll" :class="{'error-border': validate==true && !validateCol6(index).flag}"></InputNumber>
                       <div v-if="validate==true && !validateCol6(index).flag" class="color-red">{{validateCol6(index).content}}</div>
                    </div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <InputNumber v-model="data.processProducts[0].specWidth" :min="1" :parser="inputWidth"  @on-change="computedAll" :class="{'input-number-no-operate':true,'error-border': validate==true && !validateColumns1(data.processProducts[0].key,0,'specWidth').flag}"></InputNumber>
                      <div v-if="validate==true && !validateColumns1(data.processProducts[0].key,0,'specWidth').flag" class="color-red">{{validateColumns1(data.processProducts[0].key,0,'specWidth').content}}</div>
                    </div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <InputNumber v-model="data.processProducts[0].number" :min="1" :parser="inputNum"  @on-change="computedAll" :class="{'error-border': validate==true && !validateColumns(data.processProducts[0].key,0,'number').flag}"></InputNumber>
                      <div v-if="validate==true && !validateColumns(data.processProducts[0].key,0,'number').flag" class="color-red">{{validateColumns(data.processProducts[0].key,0,'number').content}}</div>
                    </div>
                  </td>
                  <td class="text-right">
                    <div class="ivu-table-cell">
                      {{data.processProducts[0].weight}}
                    </div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <InputNumber v-model="data.processProducts[0].unitPrice" :min="0" :parser="inputPrice"  @on-change="computedAll" class="input-number-no-operate"></InputNumber>
                    </div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <InputNumber v-model="data.processProducts[0].otherCharge" :min="0" :parser="inputPrice"  @on-change="computedAll" class="input-number-no-operate"></InputNumber>
                    </div>
                  </td>
                  <td class="text-center">
                    <div class="ivu-table-cell">
                      <Icon
                        class="tb-link-add color-green"
                        type="md-add-circle"
                        :size="20"
                        @click="addProcessInfo(data.processProducts[0].key)"
                      ></Icon>
                      <Icon
                        class="tb-link-remove color-red"
                        type="md-remove-circle"
                        :size="20"
                        @click="removeProcessInfo(data.processProducts[0].key, 0)"
                      ></Icon>
                    </div>
                  </td>
                  <td
                    class="text-right"
                    :rowspan="data.processProducts.length"
                  >
                    <div class="ivu-table-cell">{{data.usedWeidth|formatPrice}}</div>
                  </td>
                  <td
                    class="text-right"
                    :rowspan="data.processProducts.length"
                  >
                    <div :class="{'ivu-table-cell': true, 'color-red': Number(data.remainWidth) <= 0}">{{data.remainWidth|formatPrice}}</div>
                  </td>
                  <td
                    class="text-right"
                    :rowspan="data.processProducts.length"
                  >
                    <div class="ivu-table-cell">{{data.totalPrice}}</div>
                  </td>
                </tr>
                <template v-for="(process, i) in data.processProducts">
                  <tr
                    :key="process.id"
                    v-if="i > 0"
                    :class="{'tr-even': getCurentRowIndex(process.key)%2 == 1}"
                  >
                    <td>
                      <div class="ivu-table-cell">
                        <InputNumber v-model="process.specWidth" :min="1" :parser="inputWidth"  @on-change="computedAll" :class="{'input-number-no-operate':true,'error-border': validate==true && !validateColumns1(process.key,i,'specWidth').flag}"></InputNumber>
                         <div v-if="validate==true && !validateColumns1(process.key,i,'specWidth').flag" class="color-red">{{validateColumns1(process.key,i,'specWidth').content}}</div>
                      </div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <InputNumber v-model="process.number" :min="1" :parser="inputNum"  @on-change="computedAll" :class="{'error-border': validate==true && !validateColumns(process.key,i,'number').flag}"></InputNumber>
                        <div v-if="validate==true && !validateColumns(process.key,i,'number').flag" class="color-red">{{validateColumns(process.key,i,'number').content}}</div>
                      </div>
                    </td>
                    <td class="text-right">
                      <div class="ivu-table-cell">
                        {{process.weight}}
                      </div>
                    </td>
                    <td>
                    <div class="ivu-table-cell">
                      <InputNumber v-model="process.unitPrice" :min="0" :parser="inputPrice"  @on-change="computedAll" class="input-number-no-operate"></InputNumber>
                    </div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <InputNumber v-model="process.otherCharge" :min="0" :parser="inputPrice"  @on-change="computedAll" class="input-number-no-operate"></InputNumber>
                    </div>
                  </td>
                    <td class="text-center">
                      <div class="ivu-table-cell">
                        <Icon
                          class="tb-link-add color-green"
                          type="md-add-circle"
                          :size="20"
                          @click="addProcessInfo(process.key)"
                        ></Icon>
                        <Icon
                          class="tb-link-remove color-red"
                          type="md-remove-circle"
                          :size="20"
                          @click="removeProcessInfo(process.key, i)"
                        ></Icon>
                      </div>
                    </td>
                  </tr>
                </template>
              </template>
              <tr
                v-if="tableData1.length > 0"
                class="sum"
              >
                <td class="text-center">
                  <div class="ivu-table-cell">合计</div>
                </td>
                <td>
                  <div class="ivu-table-cell"></div>
                </td>
                <td>
                  <div class="ivu-table-cell"></div>
                </td>
                <td class="text-right">
                  <div class="ivu-table-cell">{{sumCol3}}</div>
                </td>
                <td class="text-right">
                  <div class="ivu-table-cell">{{sumCol4|formatWeight}}</div>
                </td>
                <td>
                  <div class="ivu-table-cell">{{sumCol5|formatWeight}}</div>
                </td>
                <td>
                  <div class="ivu-table-cell"></div>
                </td>
                <td>
                  <div class="ivu-table-cell"></div>
                </td>
                <td>
                  <div class="ivu-table-cell">{{sumColumns2}}</div>
                </td>
                <td class="text-right">
                  <div class="ivu-table-cell">{{sumColumns3|formatWeight}}</div>
                </td>
                <td>
                  <div class="ivu-table-cell"></div>
                </td>
                <td>
                  <div class="ivu-table-cell"></div>
                </td>
                <td>
                  <div class="ivu-table-cell"></div>
                </td>
                <td>
                  <div class="ivu-table-cell"></div>
                </td>
                <td>
                  <div class="ivu-table-cell"></div>
                </td>
                <td class="text-right">
                  <div class="ivu-table-cell">{{sumCol11|formatPrice}}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      </Col>
    </Row>
    </Col>
  </Row>
</template>

<script>
import { formatPrice, formatWeight, decimalInput } from "@/libs/util";
import { InventoryProcessDeviceList } from '@/api/process';
export default {
  name: "NewProcessBillScissors",
  props: {
    propData: Array,
    defaultRadio: Object,
    isEdit: Boolean,
    owner: Number,
    isValidated: Boolean
  },
  data() {
    return {
      currentRadio: {
        deviceId: this.defaultRadio ? this.defaultRadio.deviceId : '',
        deviceName: this.defaultRadio ? this.defaultRadio.deviceName : '',
        number: 0,
        waitingProcessNum: 0,
        weight: 0
      },
      ownerId: this.owner,
      edit: this.isEdit,
      validate: this.isValidated,
      groupList: [],
      currentSelect: this.propData,
      sumCol3: 0,
      sumCol4: 0,
      sumCol5: 0,
      sumColumns2: 0,
      sumColumns3: 0,
      sumCol11: 0,
      tableData1: []
    };
  },
  watch: {
    propData: {
      handler(newVal, oldVal) {
        this.currentSelect = JSON.parse(JSON.stringify(newVal));
        this.initTableData();
      },
      deep: true
    },
    defaultRadio: {
      handler(newVal, oldVal) {
        this.currentRadio.deviceId = newVal ? newVal.deviceId : '';
        this.currentRadio.deviceName = newVal ? newVal.deviceName : '';
        this.getDeviceList();
      },
      deep: true
    },
    isValidated(newVal, oldVal) {
      this.validate = newVal;
    },
    owner(newVal, oldVal) {
      this.ownerId = this.owner;
    }
  },
  methods: {
    inputPrice(value){
        return decimalInput(value,14,2)
    },
    inputWeight(value){
        return decimalInput(value,12,4)
    },
    inputNum(value) {
        return decimalInput(value,8,0);
    },
    inputWidth(value) {
        return decimalInput(value,8,2);
    },
    getCurentRowIndex(processKey) {
      let index = 0;
      this.tableData1.map((o, i) => {
        if (o.itemId == processKey) {
          index = i;
        }
      });
      return index;
    },
    addProcessInfo(key) {
      let index = this.getCurentRowIndex(key);
      this.tableData1[index].processProducts.push({
        specWidth: null,
        number: 1,
        weight: 0,
        otherCharge: 0,
        unitPrice: 0,
        key: key
      });
      this.computedAll();
    },
    removeProcessInfo(key, processProductsIndex) {
      let index = this.getCurentRowIndex(key);

      if (this.tableData1[index].processProducts.length > 1) {
        this.tableData1[index].processProducts.splice(processProductsIndex, 1);
      } else {
        this.$Modal.warning({
          title: "提示",
          content: "最后一条数据不允许删除"
        });
      }
      this.computedAll();
    },
    removeTableData(index) {
      this.$Modal.confirm({
        title: "信息确认",
        content: "<p>请确认删除该行信息？</p>",
        onOk: () => {
          this.$emit("removeTableData", this.tableData1[index]);
          this.tableData1.splice(index, 1);
          this.computedAll();
          this.$Message.success("删除成功");
        },
        onCancel: () => {}
      });
    },
    batchCopy() {
      let duplicate = JSON.parse(
        JSON.stringify(this.tableData1[0].processProducts)
      );
      this.tableData1.map((o, i) => {
        duplicate.map((o1, j) => {
          duplicate[j].key = o.processProducts[0].key;
        });
        this.tableData1[i].processProducts = JSON.parse(JSON.stringify(duplicate));
      });
      this.computedAll();
    },
    //合计
    sumAll() {
      this.sumCol3 = this.sumCol4 = this.sumCol5 = this.sumCol11 = 0;
      this.sumColumns2 = this.sumColumns3 = 0;
      this.tableData1.map((obj, index) => {
        this.sumCol3 += this.isNaN(obj.number);
        this.sumCol4 += this.isNaN(obj.weight);
        this.sumCol5 += this.isNaN(obj.processWeight);
        this.sumCol11 += this.isNaN(obj.totalPrice);
        obj.processProducts.map((o, i) => {
          this.sumColumns2 += this.isNaN(o.number);
          this.sumColumns3 += this.isNaN(o.weight);
        });
      });
    },
    computedAll() {
      let tempArr = [];
      tempArr = this.tableData1.map(o => {
        o.processProducts = JSON.parse(JSON.stringify(o.processProducts));
        return o;
      });

      tempArr.map((o, i) => {
        let sumCol7 = 0;
        let processProducts = [];
        let totalPrice = 0;
        o.processProducts.map((o1, j) => {
          sumCol7 += this.isNaN(o1.specWidth) * this.isNaN(o1.number);
          //用料长度
          let useLong = (this.isNaN(o.processWeight) * 1000) / 7.85 / (this.isNaN(o.col20)/1000) / this.isNaN(o.col21);
          //理重
          this.tableData1[i].processProducts[j].weight =  formatWeight((this.isNaN(o.col21) * (this.isNaN(o1.specWidth)/1000) * useLong * 7.85 * this.isNaN(o1.number))/1000);
          //金额 = 加工单价*理重+其他费用
          this.tableData1[i].processProducts[j].totalPrice = this.tableData1[i].processProducts[j].weight * this.isNaN(o1.unitPrice) + this.isNaN(o1.otherCharge);
          totalPrice += this.tableData1[i].processProducts[j].totalPrice;
        });
        //已用宽度
        this.tableData1[i].usedWeidth = formatPrice(sumCol7);
        //剩余宽度
        this.tableData1[i].remainWidth =  formatPrice(this.isNaN(o.col20) - sumCol7);
        this.tableData1[i].totalPrice = formatPrice(totalPrice);
      });
      this.sumAll();
      this.$emit('dataChange', {
        radio: this.currentRadio,
        tableData: this.tableData1
      });
    },
    isNaN(val) {
      return isNaN(Number(val)) ? 0 : Number(val);
    },
    initTableData() {
      if(this.currentSelect.length == 0) {
        this.tableData1 = [];
      }
      let dataCopy = JSON.parse(JSON.stringify(this.tableData1));
      this.currentSelect.map((o, i) => {
        let isHave = false;
        dataCopy.map((o1, j) => {
          if (o.itemId == o1.itemId) {
            isHave = true;
          }
        });
        if (!isHave) {
          let processProducts = [
            {
              number: 1,
              productId: 0,
              realNumber: 0,
              specWidth: null,
              //用料长度 = 用料(t)/7.85/原卷宽度(m)/厚(mm)
              //理重(kg) = 厚(mm)*加工宽度(m)*用料长度(m)*7.85*数量
              weight: 0,
              otherCharge: 0,
              unitPrice: 0,
              key: o.itemId
            }
          ];

          if (o.processProducts) {
            processProducts = o.processProducts.map(o1 => {
              o1.key = o.itemId;
              o1.specWidth = Number( o1.specWidth);
              o1.otherCharge = this.edit?o1.otherCharge:0;
              //单价
              o1.unitPrice = this.edit?o1.unitPrice:0;
              return o1;
            })
          }
          let arr = o.specName.split('*');
          this.tableData1.push({
            baleNumber: o.baleNumber,
            brandCode: o.brandCode,
            brandName: o.brandName,
            breedCode: o.breedCode,
            breedName: o.breedName,
            inventoryCode: o.inventoryCode?o.inventoryCode:o.code,
            itemCodeId: o.itemCodeId,
            itemId: o.itemId,
            materialCode: o.materialCode,
            materialId: o.materialId ? o.materialId:'',
            materialName: o.materialName,
            number: o.availableNumber?Number(o.availableNumber):Number(o.number),
            otherCharge: this.edit?Number(o.otherCharge):0,
            processProducts: processProducts,
            //用料
            processWeight: o.availableNumber?Number(formatWeight(Number(o.availableNumber)*Number(o.perAmount))):Number(formatWeight(o.processWeight)),
            //剩余宽度 = 原卷宽度 - 已用宽度之和
            remainWidth: this.edit?formatPrice(o.remainWidth):0,
            sectionNumber: o.sectionNumber?Number(o.sectionNumber):1,
            specCode: o.specCode,
            specName: o.specName,
            storageArea: o.storageArea,
            storageAreaId: o.storageAreaId,
            storagePlace: o.storagePlace,
            storagePlaceId: o.storagePlaceId,
            //金额 = 加工单价*重量+其他费用
            totalPrice: this.edit?Number(formatPrice(o.totalPrice)):0,
            //已用宽度 = 已用宽度之和
            usedWeidth: this.edit?Number(formatPrice(o.usedWeidth)):0,
            weight: o.availableNumber?Number(formatWeight(Number(o.availableNumber)*Number(o.perAmount))):Number(formatWeight(o.weight)),
            wrap: o.wrap,
             //原卷宽度
            col20: arr[1],
            //原卷厚度
            col21: arr[0],
          });
        } 
      });
      this.computedAll();
    },
    changeRadio(e) {
      this.groupList.map(o => {
        if(o.deviceId == e) {
          this.currentRadio.number = o.number;
          this.currentRadio.waitingProcessNum = o.waitingProcessNum;
          this.currentRadio.weight = o.weight;
          this.currentRadio.deviceName = o.deviceName;
          this.$emit('dataChange', {
            radio: o,
            tableData: this.tableData1
          });
        }
      })
    },
    getDeviceList() {
      InventoryProcessDeviceList().then(res => {
        if(res.data.code == "200") {
          //纵剪的机器
          this.groupList = res.data.data.filter(o => {
            if(o.processMode == 1) {
              return o;
            }
          })
          
          if(this.groupList.length > 0) {
            let isHave = false;
            //编辑
            this.groupList.map(o => {
              if(o.deviceId == this.currentRadio.deviceId) {
                this.currentRadio = JSON.parse(JSON.stringify(o));
                isHave = true;
              }
            }) 
            if(!isHave) {
              this.currentRadio = JSON.parse(JSON.stringify(this.groupList[0]));
            }
          } else {
            this.currentRadio = {
              deviceId: '',
              deviceName: '',
              number: 0,
              waitingProcessNum: 0,
              weight: 0
            };
          }
          this.$emit('dataChange', {
            radio: this.currentRadio,
            tableData: this.tableData1
          });
        }
      })
    },
    //选择原料
    showCoilModal() {
      if(this.ownerId) {
        this.$emit("showModal", 0);
      } else {
        this.$Message.error("请先选择货主");
      }
    },
    //选择成品
    showCoilModal1() {
      if(this.ownerId) {
        this.$emit("showModal", 1);
      } else {
        this.$Message.error("请先选择货主");
      }
    },
    validateCol5(index) {
      let rules = {
        flag: true,
        content: '',
      }
      let currentValue = this.tableData1[index].processWeight;
      if (!Number(currentValue)) {
        rules.flag = false;
        rules.content = '请输入大于0的数字';
      } else if(Number(currentValue) < 0) {
        rules.flag = false;
        rules.content = '必须大于0';
      } else {
          if(String(currentValue).indexOf(".")>-1){
              let val_arr = String(currentValue).split(".");
              if(val_arr[1].length>4){
                rules.flag = false;
                rules.content = '最多小数点后4位';
              } 
          } 
          if(Number(currentValue) > Number(this.tableData1[index].weight)) {
              rules.flag = false;
              rules.content = '用料不能大于重量';
          }
      }
      return rules;
    },
    validateColumns(key, i,colName) {
      let rules = {
        flag: true,
        content: '',
      }
      let index = this.getCurentRowIndex(key);
      let currentValue = this.tableData1[index].processProducts[i][colName];
      if (!Number(currentValue)) {
        rules.flag = false;
        rules.content = '请输入大于0的正整数';
      } else {
        if(Number(currentValue) <= 0) {
          rules.flag = false;
          rules.content = '请输入大于0的正整数';
        } else {
            if(String(currentValue).indexOf(".")>-1){
                rules.flag = false;
                rules.content = '请输入大于0的正整数';
            }
        }
      } 
      return rules;
    },
    validateColumns1(key, i,colName) {
      let rules = {
        flag: true,
        content: '',
      }
      let index = this.getCurentRowIndex(key);
      let currentValue = this.tableData1[index].processProducts[i][colName];
      if (!Number(currentValue)) {
        rules.flag = false;
        rules.content = '请输入大于0的数字';
      } else if(Number(currentValue) < 0) {
        rules.flag = false;
        rules.content = '必须大于0';
      } else {
          if(String(currentValue).indexOf(".")>-1){
              let val_arr = String(currentValue).split(".");
              if(val_arr[1].length>2){
                rules.flag = false;
                rules.content = '最多小数点后两位';
              } 
          }
      }
      return rules;
    },
    validateCol6(index) {
      let rules = {
        flag: true,
        content: '',
      }
      let currentValue = this.tableData1[index].sectionNumber;
      if (!Number(currentValue)) {
        rules.flag = false;
        rules.content = '请输入大于0的数字';
      } else if(Number(currentValue) < 0) {
        rules.flag = false;
        rules.content = '必须大于0';
      } else {
          if(String(currentValue).indexOf(".")>-1){
              rules.flag = false;
              rules.content = '请输入大于0的整数';
          }
      }
      return rules;
    },
    validateCol9(index) {
      let rules = {
        flag: true,
        content: '',
      }
      let currentValue = this.tableData1[index].unitPrice;
      if (!Number(currentValue)) {
        rules.flag = false;
        rules.content = '请输入大于0的数字';
      } else if(Number(currentValue) < 0) {
        rules.flag = false;
        rules.content = '必须大于0';
      } else {
          if(String(currentValue).indexOf(".")>-1){
              let val_arr = String(currentValue).split(".");
              if(val_arr[1].length>2){
                rules.flag = false;
                rules.content = '最多小数点后两位';
              } 
          }
      }
      return rules;
    }
  },
  mounted() {
    this.getDeviceList();
    this.initTableData();
  },
};
</script>

<style lang="less" scoped>
.table-content {
  border-left: 1px solid #ddd;
  border-top: 1px solid #ddd;
  position: relative;
}
.table-content .table1 {
  width: 100%;
  overflow: auto;
}
.table-content .table1 table {
  table-layout: auto;
  min-width: 1600px;
}
.table-content .table1 .ivu-table-cell {
  white-space: nowrap;
}
.table1 .sum td {
  background-color: #D7D7D8;
}
.table1 .tr-even td {
  background-color: #f3f3f3;
}
.text-center {
  text-align: center;
}
.text-right {
  text-align: right;
}
@deep: ~'>>>';
.error-border {
    @{deep} .ivu-input{
       border-color: #ed4014
    }
}
@{deep} .ivu-input, .ivu-input-number {
    width: 140px;
}
</style>
