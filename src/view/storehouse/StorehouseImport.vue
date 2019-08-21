<template>
  <div class="white-bg">
    <Row>
      <Col span="24" class="margin-bottom-10">
        <div class="pull-left table-title">当前仓库：{{storehouseData.warehouseName}}</div>
      </Col>
      <Col span="24">
        <Upload
          :show-upload-list="false"
          :on-success="fileUpload"
          :data="{warehouseId:id,warehouseName:storehouseData.warehouseName}"
          name="uploadFile"
          accept=".xls, .xlsx"
          action="/api/pwms/inventory/admin/in/importInEnterItem?"
        >
          <Button type="info">导入明细</Button>
        </Upload>
        <Button type="primary" class="margin-left-10" @click="download">下载模板</Button>
        <span class="color-red margin-left-10">此操作非常规入库，无法标记货主通知单号等信息，请谨慎使用</span>
      </Col>
    </Row>
    <div class="table-content margin-top-10">
      <div class="ivu-table table1">
        <table cellspacing="0" cellpadding="0" border="0" width="100%">
          <thead>
            <tr>
              <th v-for="(thItem,index) in tableTitles" :key="index" :width="thItem.minWidth">
                <div class="ivu-table-cell">
                  <span v-if="thItem.isMust" style="color: red;">*</span>
                  {{thItem.title}}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in tableData" :key="index">
              <!-- 编号 -->
              <td>
                <div class="ivu-table-cell">
                  <Input
                    :class="tableData[index].code.status || tableData[index].code.value ? '' : 'error'"
                    v-model="tableData[index].code.value"
                    :maxlength="30"
                  />
                </div>
              </td>
              <!-- 货主  -->
              <td>
                <div
                  class="ivu-table-cell"
                  v-if="tableData[index].ownerId.isUpload"
                  @click="tableRenderChange('ownerId',index)"
                >
                  <Input :value="tableData[index].customerName" :readonly="true"></Input>
                </div>
                <div class="ivu-table-cell" v-else>
                  <Select
                    @on-change="changeOwnner($event,index)"
                    label-in-value
                    filterable
                    :class="tableData[index].ownerId.status || tableData[index].ownerId.value ? '' : 'error'"
                    v-model="tableData[index].ownerId.value"
                  >
                    <Option
                      v-for="(item,index) in ownnerList"
                      :value="item.id"
                      :key="index"
                    >{{ item.customerName }}</Option>
                  </Select>
                </div>
              </td>
              <td>
                <DatePicker
                  v-model="tableData[index].inTime.value"
                  format="yyyy/MM/dd"
                  type="date"
                  placeholder="请选择日期"
                  style="width:90%;margin-left:6px;"
                ></DatePicker>
              </td>
              <!-- 产地  -->
              <td>
                <div
                  class="ivu-table-cell"
                  v-if="tableData[index].brandCode.isUpload"
                  @click="tableRenderChange('brandCode',index)"
                >
                  <Input :value="tableData[index].brandName" :readonly="true"></Input>
                </div>
                <div class="ivu-table-cell" v-else>
                  <Select
                    @on-change="changeBrand($event,index)"
                    label-in-value
                    filterable
                    :class="tableData[index].brandCode.status || tableData[index].brandCode.value ? '' : 'error'"
                    v-model="tableData[index].brandCode.value"
                  >
                    <Option
                      v-for="(item,index) in factoryList"
                      :value="item.brandCode"
                      :key="index"
                    >{{ item.brandName }}</Option>
                  </Select>
                </div>
              </td>
              <!-- 品名  -->
              <td>
                <div
                  class="ivu-table-cell"
                  v-if="tableData[index].breedCode.isUpload"
                  @click="tableRenderChange('breedCode',index)"
                >
                  <Input :value="tableData[index].breedName" :readonly="true"></Input>
                </div>
                <div class="ivu-table-cell" v-else>
                  <Select
                    label-in-value
                    filterable
                    :class="tableData[index].breedCode.status || tableData[index].breedCode.value ? '' : 'error'"
                    v-model="tableData[index].breedCode.value"
                    @on-change="changeBreed($event,index)"
                  >
                    <Option
                      v-for="(item,index) in breedList"
                      :value="item.breedCode"
                      :key="index"
                    >{{ item.breedName }}</Option>
                  </Select>
                </div>
              </td>
              <!-- 材质  -->
              <td>
                <div
                  class="ivu-table-cell"
                  v-if="tableData[index].materialCode.isUpload"
                  @click="tableRenderBreedChange(tableData[index].breedCode.value,index,tableData[index].materialCode.value)"
                >
                  <Input :value="tableData[index].materialName" ></Input>
                </div>
                <div class="ivu-table-cell" v-else>
                  <Select
                    label-in-value
                    filterable
                    :class="tableData[index].materialCode.status || tableData[index].materialCode.value ? '' : 'error'"
                    v-model="tableData[index].materialCode.value"
                    @on-change="changeMaterial($event,index)"
                  >
                    <Option
                      v-for="(item,index) in materialList[index]"
                      :value="item.materialCode"
                      :key="index"
                    >{{item.materialName}}</Option>
                  </Select>
                </div>
              </td>
              <!-- 规格  -->
              <td>
                <div class="ivu-table-cell">
                  <AutoComplete
                    @on-change="specChange($event,index)"
                    :class="tableData[index].specName.status || tableData[index].specName.value ? 'autoComplete-style' : 'autoComplete-style error'"
                    :data="specNameList[index]"
                    :filter-method="specFilter"
                    v-model="tableData[index].specName.value"
                  ></AutoComplete>
                </div>
              </td>
              <!-- 货物类型  -->
              <td>
                <div
                  class="ivu-table-cell"
                  v-if="tableData[index].type.isUpload"
                  @click="tableRenderChange('type',index)"
                >
                  <Input
                    :value="tableData[index].type.value == '0' ? '原料' : tableData[index].type.value == '1' ? '成品' : '' "
                    :readonly="true"
                  ></Input>
                </div>
                <div class="ivu-table-cell" v-else>
                  <Select
                    filterable
                    v-model="tableData[index].type.value"
                    @on-change="changeHW($event,index)"
                  >
                    <Option
                      v-for="(item,index) in hwList"
                      :value="item.value"
                      :key="index"
                    >{{item.label}}</Option>
                  </Select>
                </div>
              </td>
              <!-- 材料类型  -->
              <td>
                <div
                  class="ivu-table-cell"
                  v-if="tableData[index].inventoryType.isUpload"
                  @click="tableRenderChange('inventoryType',index)"
                >
                  <Input
                    :value="tableData[index].inventoryType.value == '0' ? '原材' : tableData[index].inventoryType.value == '1' ? '余卷' : tableData[index].inventoryType.value == '2' ? '分条料' : tableData[index].inventoryType.value == '3' ? '开平板' : '' "
                    :readonly="true"
                  ></Input>
                </div>
                <div class="ivu-table-cell" v-else>
                  <Select
                    filterable
                    v-model="tableData[index].inventoryType.value"
                    :class="tableData[index].inventoryType.status || tableData[index].inventoryType.value ? '' : 'error'"
                  >
                    <Option
                      v-for="(item,index) in inventoryTypeList[index]"
                      :value="item.value"
                      :key="index"
                    >{{item.label}}</Option>
                  </Select>
                </div>
              </td>
              <!-- 库区  -->
              <td>
                <div
                  class="ivu-table-cell"
                  v-if="tableData[index].storageAreaId.isUpload"
                  @click="tableRenderChange('storageAreaId',index)"
                >
                  <Input :value="tableData[index].storageArea" :readonly="true"></Input>
                </div>
                <div class="ivu-table-cell" v-else>
                  <Select
                    @on-change="changeArea($event,index)"
                    label-in-value
                    filterable
                    :class="tableData[index].storageAreaId.status || tableData[index].storageAreaId.value ? '' : 'error'"
                    v-model="tableData[index].storageAreaId.value"
                  >
                    <Option
                      v-for="(item,index) in kqList"
                      :value="item.id"
                      :key="index"
                    >{{item.name}}</Option>
                  </Select>
                </div>
              </td>
              <!-- 库位  -->
              <td>
                <div
                  class="ivu-table-cell"
                  v-if="tableData[index].storagePlaceId.isUpload"
                  @click="tableRenderChange('storagePlaceId',index)"
                >
                  <Input :value="tableData[index].storagePlace" :readonly="true"></Input>
                </div>
                <div class="ivu-table-cell" v-else>
                  <Select
                    @on-change="changePlace($event,index)"
                    label-in-value
                    filterable
                    :class="tableData[index].storagePlaceId.status || tableData[index].storagePlaceId.value ? '' : 'error'"
                    v-model="tableData[index].storagePlaceId.value"
                  >
                    <Option
                      v-for="(item,index) in kwList"
                      :value="item.id"
                      :key="index"
                    >{{item.name}}</Option>
                  </Select>
                </div>
              </td>
              <!-- 数量  -->
              <td>
                <div class="ivu-table-cell">
                  <InputNumber
                    :class="tableData[index].number.status || tableData[index].number.value ? '' : 'error'"
                    :parser="inputDecimal1"
                    style="width:100%;"
                    :maxlength="8"
                    :min="1"
                    v-model="tableData[index].number.value"
                    @on-change="countTonage(index)"
                  />
                </div>
              </td>
              <!-- 单件重量  -->
              <td>
                <div class="ivu-table-cell input-number-no-operate">
                  <InputNumber
                    :class="tableData[index].perAmount.status ? '' : 'error'"
                    style="width:100%;"
                    :min="0"
                    :parser="inputDecimal"
                    v-model="tableData[index].perAmount.value"
                    @on-change="countTonage(index,$event)"
                  />
                </div>
              </td>
              <!--  总重量 -->
              <td>
                <div class="ivu-table-cell">
                  <Input v-model="tableData[index].totalAmount.value" disabled/>
                </div>
              </td>
              <!--  计重方式 -->
              <td>
                <div
                  class="ivu-table-cell"
                  v-if="tableData[index].weightType.isUpload"
                  @click="tableRenderChange('weightType',index)"
                >
                  <Input
                    :value="tableData[index].weightType.value == '0' ? '抄码' : tableData[index].weightType.value == '1' ? '过磅' : tableData[index].weightType.value == '2' ? '理计' : '' "
                    :readonly="true"
                  ></Input>
                </div>
                <div class="ivu-table-cell" v-else>
                  <Select
                    :class="tableData[index].weightType.status || tableData[index].weightType.value ? '' : 'error'"
                    v-model="tableData[index].weightType.value"
                  >
                    <Option
                      v-for="(item,index) in typeList"
                      :value="item.value"
                      :key="index"
                    >{{item.label}}</Option>
                  </Select>
                </div>
              </td>
              <!--  钢卷号/捆包号 -->
              <td>
                <div class="ivu-table-cell">
                  <Input v-model="tableData[index].baleNumber.value" :maxlength="20"/>
                </div>
              </td>
              <!-- 包装  -->
              <td>
                <div class="ivu-table-cell">
                  <Input v-model="tableData[index].wrap.value" :maxlength="40"/>
                </div>
              </td>
              <!--  外观 -->
              <td>
                <div class="ivu-table-cell">
                  <Input v-model="tableData[index].appearance.value" :maxlength="40"/>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="text-center margin-top-10 margin-bottom-20">
      <Button
        class="btn-common-width margin-right-10"
        :disabled="submitDisabled"
        @click="handleSubmit"
        type="primary"
      >确定导入</Button>
    </div>
  </div>
</template>

<script>
import {
  commonBrandInfos,
  commonBreedInfos,
  commonSpecInfos,
  commonMaterialInfos,
  commonQueryOwners,
} from "@/api/common";
import { closeNowTag, formatDate, decimalInput } from "@/libs/util";
import { getOne, saveInEnterList, importInEnterItem,getAreasByWarehouseId,getLocationByWarehouseId } from "@/api/storehouse";
export default {
  name: "StorehouseImport",
  data() {
    return {
      id: this.$route.query.id,
      submitDisabled: false,
      storehouseData: {},
      tableData: [
        {
          code: { status: true, value: "" },
          ownerId: { status: true, value: "" },
          inTime: { status: true, value: new Date() },
          brandCode: { status: true, value: "" },
          breedCode: { status: true, value: "" },
          materialCode: { isUpload: false, status: true, value: "" },
          specCode: { isUpload: false, status: true, value: "" },
          specName: { status: true, value: "" },
          type: { status: true, value: "0" },
          inventoryType: { status: true, value: "" },
          storageAreaId: { status: true, value: "" },
          storagePlaceId: { status: true, value: "" },
          number: { status: true, value: 1 },
          perAmount: { status: true, value: 0 },
          totalAmount: { status: true, value: "" },
          weightType: { status: true, value: "0" },
          baleNumber: { status: true, value: "" },
          wrap: { status: true, value: "" },
          appearance: { status: true, value: "" },
          inEnterItemId: { status: true, value: "" }
        }
      ],
      tableTitles: [
        {
          title: "编号",
          key: "code",
          align: "left",
          minWidth: 100,
          isMust: true
        },
        {
          title: "货主",
          key: "ownerName",
          align: "left",
          minWidth: 140,
          isMust: true
        },
        {
          title: "入库日期",
          key: "inTime",
          align: "left",
          minWidth: 120
        },
        {
          title: "产地",
          key: "brandCode",
          align: "left",
          minWidth: 120,
          isMust: true
        },
        {
          title: "品名",
          key: "breedCode",
          align: "left",
          minWidth: 140,
          isMust: true
        },
        {
          title: "材质",
          key: "materialCode",
          align: "left",
          minWidth: 120,
          isMust: true
        },
        {
          title: "规格",
          key: "specCode",
          align: "left",
          minWidth: 120,
          isMust: true
        },
        {
          title: "货物类型",
          key: "type",
          align: "left",
          minWidth: 100
        },
        {
          title: "材料类型",
          key: "inventoryType",
          align: "left",
          minWidth: 100,
          isMust: true
        },
        {
          title: "库区",
          key: "storageAreaId",
          align: "left",
          minWidth: 100
        },
        {
          title: "库位",
          key: "storagePlaceId",
          align: "left",
          minWidth: 100
        },
        {
          title: "数量",
          key: "number",
          align: "left",
          minWidth: 100,
          isMust: true
        },
        {
          title: "单件重量",
          key: "perAmount",
          align: "left",
          minWidth: 100,
          isMust: true
        },
        {
          title: "总重量",
          key: "totalAmount",
          align: "left",
          minWidth: 100
        },
        {
          title: "计重方式",
          key: "weightType",
          align: "left",
          minWidth: 100,
          isMust: true
        },
        {
          title: "钢卷号/捆包号",
          key: "baleNumber",
          align: "left",
          minWidth: 120
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
        }
      ],
      ownnerList: [],
      factoryList: [],
      breedList: [],
      materialList: [],
      specCodeList: [],
      specNameList: [],
      typeList: [
        { label: "抄码", value: "0" },
        { label: "过磅", value: "1" },
        { label: "理计", value: "2" }
      ],
      hwList: [
        {
          value: "0",
          label: "原料"
        },
        {
          value: "1",
          label: "成品"
        }
      ],
      inventoryTypeList: [
        [{ label: "原材", value: "0" }, { label: "余卷", value: "1" }]
      ],
      kqList: [],
      kwList: [],
      wokerIdList: [],
      employeeList: []
    };
  },
  mounted() {
    this.getOwnerList();
    this.getBrandList();
    this.getBreedList();
    this.getKQList();
    this.getKWList();
    this.getList();
  },
  methods: {
    inputDecimal(value) {
      return decimalInput(value, 12, 4);
    },
    inputDecimal1(value) {
      return decimalInput(value, 8, 0);
    },
    getOwnerList() {
      commonQueryOwners().then(res => {
        if (res.data.code == "200") {
          this.ownnerList = res.data.data.map(item => {
            return { id: item.id.toString(), customerName: item.customerName };
          });
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    getList() {
      getOne({ id: this.id }).then(res => {
        if (res.data.code == "200") {
          const data = res.data.data;
          this.storehouseData = data;
        }
      });
    },
    changeOwnner(option, index) {
      if (option) {
        this.tableData[index].ownerName = option.label;
      }
    },
    specFilter(value, option) {
      return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
    },
    specChange(value, index) {
      if (value.length > 20) {
        this.tableData[index].specName.value = value + "";
        setTimeout(() => {
          this.tableData[index].specName.value = value.substring(0, 20);
        }, 0);
      } else {
        const index1 = this.specNameList[index].indexOf(value);
        if (index1 != -1) {
          this.tableData[index].specCode.value = this.specCodeList[index][
            index1
          ];
        } else {
          this.tableData[index].specCode.value = "";
        }
      }
    },
    getKQList() {
      getAreasByWarehouseId({warehouseId:this.id}).then(res => {
        if (res.data.code == "200") {
          this.kqList = res.data.data.map(item => {
            return { id: item.id.toString(), name: item.name };
          });
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    getKWList() {
      getLocationByWarehouseId({warehouseId:this.id}).then(res => {
        if (res.data.code == "200") {
          this.kwList = res.data.data.map(item => {
            return { id: item.id.toString(), name: item.name };
          });
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    getBrandList() {
      commonBrandInfos().then(res => {
        if (res.data.code == "200") {
          this.factoryList = res.data.data;
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    getBreedList() {
      commonBreedInfos().then(res => {
        if (res.data.code == "200") {
          this.breedList = res.data.data;
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    changeBrand(option, index) {
      if (option) {
        this.tableData[index].brandName = option.label;
      }
    },
    changeArea(option, index) {
      if (option) {
        this.tableData[index].storageArea = option ? option.label : "";
      }
    },
    changePlace(option, index) {
      if (option) {
        this.tableData[index].storagePlace = option.label;
      }
    },
    changeBreed(option, index) {
      if (option) {
        this.tableData[index].breedName = option.label;
        commonMaterialInfos({
          breedCode: option.value
        }).then(res => {
          if (res.data.code == "200") {
            this.$set(this.materialList, index, res.data.data);
            console.log(this.materialList)
            this.specFun(option.value, "", index);
          } else {
            this.$Message.error(res.data.msg);
          }
        });
      }
    },
    changeMaterial(option, index) {
      if (option) {
        this.tableData[index].materialName = option.label;
        this.specFun(
          this.tableData[index].breedCode.value,
          option.value,
          index
        );
      }
    },
    specFun(breedCode, materialCode, index) {
      commonSpecInfos({
        breedCode: breedCode,
        materialCode: materialCode
      }).then(res => {
        if (res.data.code == "200") {
          let specCodeList = [],
            specNameList = [];
          specNameList =
            res.data && res.data.data
              ? res.data.data.map(item => {
                  specCodeList.push(item.specCode);
                  return item.specName;
                })
              : [];
          this.$set(this.specCodeList, index, specCodeList);
          this.$set(this.specNameList, index, specNameList);
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    changeHW(value, index) {
      this.tableData[index].inventoryType.value = "";
      if (value == "0") {
        this.inventoryTypeList[index] = [
          {
            value: "0",
            label: "原材"
          },
          {
            value: "1",
            label: "余卷"
          }
        ];
      } else if (value == "1") {
        this.inventoryTypeList[index] = [
          {
            value: "2",
            label: "分条料"
          },
          {
            value: "3",
            label: "开平板"
          }
        ];
      } else {
        this.inventoryTypeList[index] = [];
      }
    },
    tableRenderChange(name, index) {
      this.tableData[index][name].isUpload = false;
    },
    countTonage(index, value) {
      let a = parseInt(this.tableData[index].number.value)
        ? parseInt(this.tableData[index].number.value)
        : 0;
      let b = parseFloat(this.tableData[index].perAmount.value)
        ? parseFloat(this.tableData[index].perAmount.value)
        : 0;
      this.tableData[index].totalAmount.value = a * b ? (a * b).toFixed(4) : "";
    },
    download() {
      window.open(
        "/api/pwms/inventory/admin/in/downInEnterTemplates?templeteName=inEnterAdminTemplates.xlsx"
      );
    },

    fileUpload(data) {
      if (data.code == "200") {
        this.$Message.success({
          content: "导入成功!",
          duration: 1
        });
        let reRenderArr = [],
        oldLength = this.tableData.length;
        let data1 = data.data.itemDTOs.map((item, index) => {
          let a = parseInt(item.number) ? parseInt(item.number) : 0;
          let b = parseFloat(item.perAmount) ? parseFloat(item.perAmount) : 0;
          let totalAmount = a * b ? (a * b).toFixed(4) : ""; //计算导入数据每行的总重量

          let perAmountStatus = true;
          if (item.perAmount) {
            let arr = item.perAmount.toString().split(".");
            if (arr.length > 1 && arr[1].length > 4) {
              perAmountStatus = false;
            } else {
              perAmountStatus = true;
            }
          } //验证导入的数据单件重量是否超出4位小数
          // this.breedChangeSave(item.breedCode,index);
          reRenderArr.push({
            breedCode: item.breedCode,
            materialCode: item.materialCode,
            specCode: item.specCode,
            specName: item.specName,
            newIndex: oldLength + index
          });
          if (item.type == "0") {
            this.inventoryTypeList[oldLength + index] = [
              {
                value: "0",
                label: "原材"
              },
              {
                value: "1",
                label: "余卷"
              }
            ];
          } else if (item.type == "1") {
            this.inventoryTypeList[oldLength + index] = [
              {
                value: "2",
                label: "分条料"
              },
              {
                value: "3",
                label: "开平板"
              }
            ];
          } else {
            this.inventoryTypeList[oldLength + index] = [];
          }
          return {
            code: { isUpload:true,status: true, value: item.code|| ''  },
            ownerId:{isUpload: true, status: true, value:  item.ownerId || '' },
            ownerName:item.ownerName || '',
            inTime:  {isUpload: true, status: true, value:  item.inTime || '' },
            brandCode: { isUpload: true, status: true, value: item.brandCode || ''},
            brandName: item.brandName,
            breedCode: { isUpload: true, status: true, value: item.breedCode || ''},
            breedName: item.breedName,
            specCode: {isUpload: true,status: true, value: item.specCode || item.specCode == 0 ? item.specCode.toString() : ""},
            specName: { status: true, value: item.specName},
            materialCode: {
              isUpload: true,
              status: true,
              value: item.materialCode
            },
            materialName: item.materialName,
            type: {
              isUpload: true,
              status: true,
              value: item.type || item.type == 0 ? item.type.toString() : ""
            },
            inventoryType: {
              isUpload: true,
              status: true,
              value:
                item.inventoryType || item.inventoryType == 0
                  ? item.inventoryType.toString()
                  : ""
            },
            storageAreaId: {
              isUpload: true,
              status: true,
              value: item.storageAreaId ? item.storageAreaId.toString() : ""
            },
            storageArea: item.storageAreaId || "",
            storagePlaceId: {
              isUpload: true,
              status: true,
              value: item.storagePlaceId ? item.storagePlaceId.toString() : ""
            },
            storagePlace: item.storagePlaceId || "",
            number: { status: true, value: item.number },
            perAmount: { status: perAmountStatus, value: item.perAmount },
            totalAmount: { status: true, value: totalAmount },
            weightType: {
              isUpload: true,
              status: true,
              value: item.weightType.toString()
            },
            baleNumber: { status: true, value: item.baleNumber },
            wrap: { status: true, value: item.wrap },
            appearance: { status: true, value: item.appearance }
          };

        });
        
        this.tableData =data1;
      } else {
        this.$Message.error(data.msg);
      }
    },
   reRenderImport(reRenderArr,oldLength){
      let materialTbArr = [];
      let breedTbArr = this.tableData.map((item,index)=>{
        if(index < oldLength){
          materialTbArr.push(item.materialCode.value)
          return item.breedCode.value;
        }
      })
      for(var i=0;i<reRenderArr.length;i++){
        const index = breedTbArr.indexOf(reRenderArr[i].breedCode);
        if(index >= 0){
          this.materialList[reRenderArr[i].newIndex] = this.materialList[index];
          this.tableData[reRenderArr[i].newIndex].materialCode.value = reRenderArr[i].materialCode;
        }else{
          this.tableRenderBreedChange(reRenderArr[i].breedCode,reRenderArr[i].newIndex,reRenderArr[i].materialCode)
        }
        //if(reRenderArr[i].specCode){
          const index1 = materialTbArr.indexOf(reRenderArr[i].materialCode);
          if(index1 >= 0){
            this.specCodeList[reRenderArr[i].newIndex] = this.specCodeList[index1];
            this.specNameList[reRenderArr[i].newIndex] = this.specNameList[index1];
            this.tableData[reRenderArr[i].newIndex].specCode.value = reRenderArr[i].specCode;
            this.tableData[reRenderArr[i].newIndex].specName.value = reRenderArr[i].specName;
          }else{
            this.tableRenderMaterialChange(reRenderArr[i].breedCode,reRenderArr[i].materialCode,reRenderArr[i].newIndex,reRenderArr[i].specCode,reRenderArr[i].specName)
          }
        //}
      }
      
    },
    tableRenderBreedChange(breedCode,index,materialCode){
      commonMaterialInfos({
          breedCode: breedCode
      }).then(res => {
        if(res.data.code == "200"){
            this.tableData[index].materialCode.isUpload = false;
            this.materialList[index] = res.data.data;
            this.tableData[index].materialCode.value = materialCode;
        }else{
            this.$Message.error(res.data.msg);
        }
      });
    },
    tableRenderMaterialChange(breedCode,materialCode,index,specCode,specName){
      commonSpecInfos({
        breedCode: breedCode,
        materialCode: materialCode
      }).then(res => {
        if(res.data.code == "200"){
            let specCodeList = [],specNameList=[];
            specNameList = res.data && res.data.data ? res.data.data.map(item => {
              specCodeList.push(item.specCode)
              return item.specName;
            }) : [];
            this.$set(this.specCodeList,index,specCodeList)
            this.$set(this.specNameList,index,specNameList)
            this.tableData[index].specCode.value = specCode;
            this.tableData[index].specName.value = specName;
        }else{
            this.$Message.error(res.data.msg);
        }
      });
    },
    handleSubmit() {
      this.submitDisabled = true;
      let trError = false;
      for (var i = 0; i < this.tableData.length; i++) {
        let obj = this.tableData[i];
        for (var key in obj) {
          if (
            key == "brandCode" ||
            key == "breedCode" ||
            key == "materialCode" ||
            key == "specName" ||
            key == "inventoryType" ||
            key == "code" ||
            key == "ownerId" ||
            key == "number" ||
            key == "perAmount" ||
            key == "weightType"
          ) {
            let objValue = obj[key].value;
            if (objValue) {
              if (key == "perAmount") {
                let arr = obj[key].value.toString().split(".");
                if (arr.length > 1 && arr[1].length > 4) {
                  obj[key].status = false;
                  trError = true;
                } else {
                  obj[key].status = true;
                }
              } else {
                obj[key].status = true;
              }
            } else {
              if (key == "weightType" && objValue == "0") {
                obj[key].status = true;
              } else {
                obj[key].status = false;
                if (!trError) {
                  trError = true;
                }
              }
            }
          }
        }
      }

      if (!trError) {
        let itemDTOs = [];
        for (var i = 0; i < this.tableData.length; i++) {
          let item = this.tableData[i];
          itemDTOs.push({
            code: item.code.value || ''  ,
            warehouseId : this.id ,
            warehouseName : this.storehouseData.warehouseName,
            ownerName: item.ownerName || ''  ,
            ownerId: item.ownerId.value || ''  ,
            inTime: formatDate(item.inTime.value) || '',
            inEnterItemId: 0,
            brandName: item.brandName || ''  ,
            brandCode: item.brandCode.value || ''  ,
            breedCode: item.breedCode.value || ''  ,
            breedName: item.breedName || ''  ,
            specCode: item.specCode.value || '',
            specName: item.specName.value || '',
            materialCode: item.materialCode.value || '',
            materialName: item.materialName || '',
            type: item.type.value ? parseInt(item.type.value) : "",
            inventoryType: item.inventoryType.value
              ? parseInt(item.inventoryType.value)
              : "",
            storageArea: item.storageAreaId.value ? item.storageArea  :"" ,
            storageAreaId: item.storageAreaId.value ? parseInt(item.storageAreaId.value) : 0,
            storagePlace: item.storagePlaceId.value ? item.storagePlace  :"" ,
            storagePlaceId:  item.storagePlaceId.value ? parseInt(item.storagePlaceId.value) : 0,
            number: item.number.value || '',
            perAmount: item.perAmount.value || '',
            weightType: item.weightType.value
              ? parseInt(item.weightType.value)
              : 0,
            baleNumber: item.baleNumber.value || '',
            gyCode: "",
            wrap: item.wrap.value || '',
            appearance: item.appearance.value || '',
            categoryStandard: 0,
            specStandard: item.specCode.value ? 0 : 1,
            materialStandard: 0 //0标准1非标
          });
        }
        saveInEnterList({ itemDTOs: itemDTOs }).then(res => {
          if (res.data.code == "200") {
            this.$Message.success({
              content: "提交成功!",
              duration: 1
            });
            setTimeout(() => {
              closeNowTag(this.$store.state.app, this.$route);
              this.$router.push({
                path: "StorehouseManage"
              });
            }, 1000);
          } else {
            this.$Message.error(res.data.msg);
          }
          setTimeout(() => {
            this.submitDisabled = false;
          }, 1000);
        });
      } else {
        this.$Message.error("请补充必填项");
        this.submitDisabled = false;
      }
    }
  }
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
  min-width: 1600px;
}
.ivu-upload {
  float: left;
}
</style>
