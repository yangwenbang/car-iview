<template>
  <div class="white-bg">
    <Form :label-width="150" class="search-form" ref="formValidate" :model="formValidate" :rules="ruleValidate">
      <div class="table-title">入库单</div>
      <hr class="line">
      <Row type="flex" justify="space-between">
        <Col :sm="8" :xs="24">
        <FormItem label="入库日期:" prop="inTime">
          <DatePicker v-model="formValidate.inTime" type="date" style="width:100%;"></DatePicker>
        </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
        <FormItem label="货主:" prop="ownerId">
          <Select label-in-value v-model="formValidate.ownerId" filterable clearable @on-change="changeOwnner">
            <Option v-for="(item,index) in ownnerList" :value="item.id" :key="index">{{ item.customerName }}</Option>
          </Select>
        </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
        <FormItem label="货主联系人:">
          <Input v-model="formValidate.ownerContract" :maxlength="30"></Input>
        </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
        <FormItem label="货主联系人手机号:">
          <Input v-model="formValidate.ownerPhone" :maxlength="20"></Input>
        </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
        <FormItem label="货主通知单号:">
          <Input v-model="formValidate.ownerNoticeCode" :maxlength="30"></Input>
        </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
        <FormItem label="送货车号:" prop="carNumber">
          <Input v-model="formValidate.carNumber" :maxlength="60"></Input>
        </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
        <FormItem label="送货人:">
          <Input v-model="formValidate.carContract" :maxlength="20"></Input>
        </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
        <FormItem label="送货人电话:">
          <Input v-model="formValidate.carPhone" :maxlength="20"></Input>
        </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
        <FormItem label="收货人:" prop="receiveId">
          <Select label-in-value v-model="formValidate.receiveId" filterable clearable @on-change="changeReceiver">
            <Option v-for="(item,index) in receiveIdList" :value="item.employeeId" :key="index">{{ item.employeeName }}</Option>
          </Select>
        </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
        <FormItem label="吊车工:">
          <Select filterable clearable multiple v-model="cranemanIds">
            <Option v-for="(item,index) in dcgList" :value="item.employeeId" :key="index">{{ item.employeeName }}</Option>
          </Select>
        </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
        <FormItem label="装卸工:">
          <Select filterable clearable multiple v-model="stevedoreIds">
            <Option v-for="(item,index) in zxgList" :value="item.employeeId" :key="index">{{ item.employeeName }}</Option>
          </Select>
        </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
        </Col>
        <Col :sm="24" :xs="24">
        <FormItem label="备注:">
          <Input type="textarea" v-model="formValidate.remark" :autosize="{minRows: 2,maxRows: 5}" :maxlength="200" />
        </FormItem>
        </Col>
      </Row>
    </Form>

    <Row>
      <Col span="24">
        <div class="pull-left table-title">
          <span class="pull-left">入库单明细</span>
          <Upload :show-upload-list="false" :on-success="fileUpload" name="uploadFile" accept=".xls,.xlsx" action="/api/pwms/inventory/in/importInEnterItem">
            <Button class="margin-left-10" type="info" size="small">导入明细</Button>
          </Upload>
          <Button class="margin-left-10" type="default" size="small" @click="download">下载模板</Button>
        </div>
        <div class="pull-right count-content">
          <span class="margin-right-10">货物数量：
            <b class="tip">{{countEle.countNum}}</b> 件</span>
          <span class="margin-right-10">货物重量：
            <b class="tip">{{countEle.countWeight}}</b> 吨</span>
        </div>
      </Col>
    </Row>
    <div class="table-content">
      <div class="ivu-table table1">
        <table cellspacing="0" cellpadding="0" border="0" width="100%">
          <thead>
            <tr>
              <th v-for="(thItem,index) in tableTitles" :key="index" :width="thItem.minWidth">
                <div class="ivu-table-cell">
                  <span v-if="thItem.isMust" style="color: red;">*</span>{{thItem.title}}</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(trItem,index) in tableData" :key="index" @keyup="keyCopyFun($event,index)">
              <td>
                <div class="ivu-table-cell">
                  <Input v-model="tableData[index].code.value" :maxlength="30" />
                </div>
              </td>
              <td>
                <!-- <div class="ivu-table-cell">
                  <Select @on-change="changeBrand($event,index)" label-in-value filterable :class="tableData[index].brandCode.status || tableData[index].brandCode.value ? '' : 'error'" v-model="tableData[index].brandCode.value">
                    <Option v-for="(item,index) in factoryList" :value="item.brandCode" :key="index">{{ item.brandName }}</Option>
                  </Select>
                </div> -->
                <div class="ivu-table-cell" v-if="tableData[index].brandCode.isUpload" @click="tableRenderChange('brandCode',index)">
                  <Input :value="tableData[index].brandName" :readonly="true"></Input>
                </div>
                <div class="ivu-table-cell" v-else>
                  <Select @on-change="changeBrand($event,index)" label-in-value filterable :class="tableData[index].brandCode.status || tableData[index].brandCode.value ? '' : 'error'" v-model="tableData[index].brandCode.value">
                    <Option v-for="(item,index) in factoryList" :value="item.brandCode" :key="index">{{ item.brandName }}</Option>
                  </Select>
                </div>
              </td>
              <td>
                <!-- <div class="ivu-table-cell">
                  <Select label-in-value filterable :class="tableData[index].breedCode.status || tableData[index].breedCode.value ? '' : 'error'" v-model="tableData[index].breedCode.value" @on-change="changeBreed($event,index)">
                    <Option v-for="(item,index) in breedList" :value="item.breedCode" :key="index">{{ item.breedName }}</Option>
                  </Select>
                </div> -->
                <div class="ivu-table-cell" v-if="tableData[index].breedCode.isUpload" @click="tableRenderChange('breedCode',index)">
                  <Input :value="tableData[index].breedName" :readonly="true"></Input>
                </div>
                <div class="ivu-table-cell" v-else>
                  <Select label-in-value filterable :class="tableData[index].breedCode.status || tableData[index].breedCode.value ? '' : 'error'" v-model="tableData[index].breedCode.value" @on-change="changeBreed($event,index)">
                    <Option v-for="(item,index) in breedList" :value="item.breedCode" :key="index">{{ item.breedName }}</Option>
                  </Select>
                </div>
              </td>
              <td>
                <div class="ivu-table-cell" v-if="tableData[index].materialCode.isUpload" @click="tableRenderBreedChange(tableData[index].breedCode.value,index,tableData[index].materialCode.value)">
                  <Input :value="tableData[index].materialName" :readonly="true"></Input>
                </div>
                <div class="ivu-table-cell" v-else>
                  <Select label-in-value filterable :class="tableData[index].materialCode.status || tableData[index].materialCode.value ? '' : 'error'" v-model="tableData[index].materialCode.value" @on-change="changeMaterial($event,index)">
                    <Option v-for="(item,index) in materialList[index]" :value="item.materialCode" :key="index">{{item.materialName}}</Option>
                  </Select>
                </div>
              </td>
              <td>
                <div class="ivu-table-cell">
                  <AutoComplete @on-change="specChange($event,index)" :class="tableData[index].specName.status || tableData[index].specName.value ? 'autoComplete-style' : 'autoComplete-style error'" :data="specNameList[index]" :filter-method="specFilter" v-model="tableData[index].specName.value">
                    <!-- <div style="max-height:200px;"><Option v-for="(option,index) in specNameList[index]" :value="option" :key="index">{{ option }}</Option></div> -->
                  </AutoComplete>
                </div>
              </td>
              <td>
                <!-- <div class="ivu-table-cell">
                  <Select filterable v-model="tableData[index].type.value" @on-change="changeHW($event,index)">
                    <Option v-for="(item,index) in hwList" :value="item.value" :key="index">{{item.label}}</Option>
                  </Select>
                </div> -->
                <div class="ivu-table-cell" v-if="tableData[index].type.isUpload" @click="tableRenderChange('type',index)">
                  <Input :value="tableData[index].type.value == '0' ? '原料' : tableData[index].type.value == '1' ? '成品' : '' " :readonly="true"></Input>
                </div>
                <div class="ivu-table-cell" v-else>
                  <Select filterable v-model="tableData[index].type.value" @on-change="changeHW($event,index)">
                    <Option v-for="(item,index) in hwList" :value="item.value" :key="index">{{item.label}}</Option>
                  </Select>
                </div>
              </td>
              <td>
                <!-- <div class="ivu-table-cell">
                  <Select filterable v-model="tableData[index].inventoryType.value">
                    <Option v-for="(item,index) in inventoryTypeList[index]" :value="item.value" :key="index">{{item.label}}</Option>
                  </Select>
                </div> -->
                <div class="ivu-table-cell" v-if="tableData[index].inventoryType.isUpload" @click="tableRenderChange('inventoryType',index)">
                  <Input :value="tableData[index].inventoryType.value == '0' ? '原材' : tableData[index].inventoryType.value == '1' ? '余卷' : tableData[index].inventoryType.value == '2' ? '分条料' : tableData[index].inventoryType.value == '3' ? '开平板' : '' " :readonly="true"></Input>
                </div>
                <div class="ivu-table-cell" v-else>
                  <Select filterable v-model="tableData[index].inventoryType.value">
                    <Option v-for="(item,index) in inventoryTypeList[index]" :value="item.value" :key="index">{{item.label}}</Option>
                  </Select>
                </div>
              </td>
              <td>
                <!-- <div class="ivu-table-cell">
                  <Select @on-change="changeArea($event,index)" label-in-value filterable :class="tableData[index].storageAreaId.status || tableData[index].storageAreaId.value ? '' : 'error'" v-model="tableData[index].storageAreaId.value">
                    <Option v-for="(item,index) in kqList" :value="item.id" :key="index">{{item.name}}</Option>
                  </Select>
                </div> -->
                <div class="ivu-table-cell" v-if="tableData[index].storageAreaId.isUpload" @click="tableRenderChange('storageAreaId',index)">
                  <Input :value="tableData[index].storageArea" :readonly="true"></Input>
                </div>
                <div class="ivu-table-cell" v-else>
                  <Select @on-change="changeArea($event,index)" label-in-value filterable :class="tableData[index].storageAreaId.status || tableData[index].storageAreaId.value ? '' : 'error'" v-model="tableData[index].storageAreaId.value">
                    <Option v-for="(item,index) in kqList" :value="item.id" :key="index">{{item.name}}</Option>
                  </Select>
                </div>
              </td>
              <td>
                <!-- <div class="ivu-table-cell">
                  <Select @on-change="changePlace($event,index)" label-in-value filterable :class="tableData[index].storagePlaceId.status || tableData[index].storagePlaceId.value ? '' : 'error'" v-model="tableData[index].storagePlaceId.value">
                    <Option v-for="(item,index) in kwList" :value="item.id" :key="index">{{item.name}}</Option>
                  </Select>
                </div> -->
                <div class="ivu-table-cell" v-if="tableData[index].storagePlaceId.isUpload" @click="tableRenderChange('storagePlaceId',index)">
                  <Input :value="tableData[index].storagePlace" :readonly="true"></Input>
                </div>
                <div class="ivu-table-cell" v-else>
                  <Select @on-change="changePlace($event,index)" label-in-value filterable :class="tableData[index].storagePlaceId.status || tableData[index].storagePlaceId.value ? '' : 'error'" v-model="tableData[index].storagePlaceId.value">
                    <Option v-for="(item,index) in kwList" :value="item.id" :key="index">{{item.name}}</Option>
                  </Select>
                </div>
              </td>
              <td>
                <div class="ivu-table-cell">
                  <InputNumber :class="tableData[index].number.status || tableData[index].number.value ? '' : 'error'" :parser="inputDecimal1" style="width:100%;" :maxlength="8" :min="1" v-model="tableData[index].number.value" @on-change="countTonage(index)" :step="0"/>
                </div>
              </td>
              <td>
                <div class="ivu-table-cell input-number-no-operate">
                  <InputNumber :class="tableData[index].perAmount.status ? '' : 'error'" style="width:100%;" :min="0"              
                  :parser="inputDecimal"
                   v-model="tableData[index].perAmount.value" @on-change="countTonage(index,$event)" 
                   :step="0"    />
                </div>
              </td>
              <td>
                <div class="ivu-table-cell">
                  <Input v-model="tableData[index].totalAmount.value" disabled/>
                </div>
              </td>
              <td>
                <!-- <div class="ivu-table-cell">
                  <Select :class="tableData[index].weightType.status || tableData[index].weightType.value ? '' : 'error'" v-model="tableData[index].weightType.value">
                    <Option v-for="(item,index) in typeList" :value="item.value" :key="index">{{item.label}}</Option>
                  </Select>
                </div> -->
                <div class="ivu-table-cell" v-if="tableData[index].weightType.isUpload" @click="tableRenderChange('weightType',index)">
                  <Input :value="tableData[index].weightType.value == '0' ? '抄码' : tableData[index].weightType.value == '1' ? '过磅' : tableData[index].weightType.value == '2' ? '理计' : '' " :readonly="true"></Input>
                </div>
                <div class="ivu-table-cell" v-else>
                  <Select :class="tableData[index].weightType.status || tableData[index].weightType.value ? '' : 'error'" v-model="tableData[index].weightType.value">
                    <Option v-for="(item,index) in typeList" :value="item.value" :key="index">{{item.label}}</Option>
                  </Select>
                </div>
              </td>
              <td>
                <div class="ivu-table-cell">
                  <Input v-model="tableData[index].baleNumber.value" />
                </div>
              </td>
              <td>
                <div class="ivu-table-cell">
                  <Input v-model="tableData[index].wrap.value" />
                </div>
              </td>
              <td>
                <div class="ivu-table-cell">
                  <Input v-model="tableData[index].appearance.value" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="ivu-table table2">
        <table cellspacing="0" cellpadding="0" border="0" width="100%">
          <thead>
            <tr>
              <th align="center">
                <div class="ivu-table-cell">
                  <Icon class="tb-link-add color-green" type="md-add-circle" size="20" @click="tableAdd" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(trItem,index) in tableData" :key="index" v-bind:class="{ 'tr-more-height': !tableData[index].perAmount.status && tableData[index].perAmount.value}">
              <td align="center">
                <div class="ivu-table-cell td-operate">
                  <div title="复制本行" class="tb-link-copy margin-right-10" @click="tableCopy(trItem, index)"><img src="../../assets/images/icon_copy.png" /></div>
                  <Icon class="tb-link-remove color-red" type="md-remove-circle" size="20" @click="tableDel(trItem, index)" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="text-center margin-top-10">
      <Button type="primary" class="btn-common-width" :disabled="submitDisabled" @click="handleSubmit('formValidate')">保存</Button>
      <Button class="btn-common-width margin-left-10" @click="backFun">取消</Button>
    </div>
  </div>

</template>
<script>
import {
  commonBrandInfos,
  commonBreedInfos,
  commonMaterialInfos,
  commonEmployees,
  commonSpecInfos,
  commonQueryOwners,
  commonAreasByWarehouseId,
  commonLocationByWarehouseId } from '@/api/common'
import {
  InventoryInSaveInEnterList
} from "@/api/warehouse";
import { closeNowTag,formatDate,decimalInput } from "@/libs/util";
export default {
  name: "WarehouseRegisterAdd",
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
    }
  },
  data() {
    return {
      submitDisabled:false,
      cranemanIds: [], //吊车工
      stevedoreIds: [], //装卸工
      formValidate: {
        ownerId: "",
        ownerName:"",
        ownerContract: "",
        ownerPhone: "",
        ownerNoticeCode: "",
        inTime: new Date(),
        carContract: "",
        warehouse: "",
        carNumber: "",
        carPhone: "",
        receiveId: "",
        receiveName:"",
        remark: ""
      },
      ruleValidate: {
        ownerId: [
          {
            required: true,
            message: "请选择货主",
            trigger: "change"
          }
        ],
        inTime: [
          {
            required: true,
            type: "date",
            message: "请选择入库日期",
            trigger: "change"
          }
        ],
        receiveId: [
          {
            required: true,
            message: "请选择收货人",
            trigger: "change"
          }
        ],
        carNumber: [
          {
            required: true,
            message: "请填写送货车号",
            trigger: "change"
          }
        ]
      },
      ownnerList: [],
      receiveIdList: [],
      dcgList: [],
      zxgList: [],
      imgNo: "",
      tableData: [
        {
          code: { status: true, value: "" },
          brandCode: { status: true, value: "" },
          breedCode: { status: true, value: "" },
          specCode: { isUpload:false,status: true, value: "" },
          specName: { status: true, value: "" },
          materialCode: { isUpload:false,status: true, value: "" },
          type:{ status: true, value: "0" },
          inventoryType:{ status: true, value: "0" },
          storageAreaId: { status: true, value: this.$store.state.user.warehouse.inDefaultAreaId ? this.$store.state.user.warehouse.inDefaultAreaId.toString() : "" },
          storagePlaceId: { status: true, value: this.$store.state.user.warehouse.inDefaultLocationId ? this.$store.state.user.warehouse.inDefaultLocationId.toString() : "" },
          number: { status: true, value: 1 },
          perAmount: { status: true, value: 0 },
          totalAmount: { status: true, value: "" },
          weightType: { status: true, value: "0" },
          baleNumber: { status: true, value: "" },
          wrap: { status: true, value: "" },
          appearance: { status: true, value: "" }
        }
      ],
      tableTitles: [
        {
          title: "编号",
          key: "code",
          align: "left",
          minWidth: 100
        },
        {
          title: "产地",
          key: "brandCode",
          align: "left",
          minWidth: 160,
          isMust: true
        },
        {
          title: "品名",
          key: "breedCode",
          align: "left",
          minWidth: 120,
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
          minWidth: 120
        },
        {
          title: "材料类型",
          key: "inventoryType",
          align: "left",
          minWidth: 120
        },
        {
          title: "库区",
          key: "storageAreaId",
          align: "left",
          minWidth: 120,
          isMust: true
        },
        {
          title: "库位",
          key: "storagePlaceId",
          align: "left",
          minWidth: 120,
          isMust: true
        },
        {
          title: "数量(件)",
          key: "number",
          align: "right",
          minWidth: 98,
          isMust: true
        },
        {
          title: "单件重量(吨)",
          key: "perAmount",
          align: "right",
          minWidth: 110,
          isMust: true
        },
        {
          title: "总重量(吨)",
          key: "totalAmount",
          align: "right",
          minWidth: 120
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
          minWidth: 120
        },
        {
          title: "外观",
          key: "appearance",
          align: "left",
          minWidth: 120
        }
      ],
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
      hwList:[
        {
          value: "0",
          label: "原料"
        },
        {
          value: "1",
          label: "成品"
        }
      ],
      inventoryTypeList:[
        [
          { label: "原材", value: "0" },
          { label: "余卷", value: "1" }
        ]
      ],
      kqList: [],
      kwList: [],
      wokerIdList:[],
      employeeList:[]
    };
  },
  wtach: {},
  mounted() {
  },
  created() {
    this.getOwnerList();
    this.getBrandList();
    this.getBreedList();
    this.getEmployee();
    this.getKQList();
    this.getKWList();
  },
  methods: {
    inputDecimal(value){
      return decimalInput(value,12,4)
    },
    inputDecimal1(value){
      return decimalInput(value,8,0)
    },
    download(){
      window.open('/api/pwms/inventory/in/downInEnterTemplates?templeteName=inEnterTemplates.xlsx');
      // downInEnterTemplates({
      //   templeteName:'inEnterTemplates.xlsx'
      // }).then((res) => {
      //    console.log(res) 
      // });
    },
    tableRenderChange(name,index){
      this.tableData[index][name].isUpload = false;
    },
    keyCopyFun(event, index) {
      if (event.keyCode == 40) {
        this.tableCopy(this.tableData[index], index);
      }
    },
    getKQList() {
        commonAreasByWarehouseId().then((res) => {
          if(res.data.code == "200"){
            this.kqList = res.data.data.map(item =>{
              return {id:item.id.toString(),name:item.name}
            });
          }else{
            this.$Message.error(res.data.msg);
          }
        });
    },
    getKWList() {
        commonLocationByWarehouseId().then((res) => {
            if(res.data.code == "200"){
                this.kwList = res.data.data.map(item =>{
                  return {id:item.id.toString(),name:item.name}
                });
            }else{
                this.$Message.error(res.data.msg);
            }
        });
    },
    getBrandList() {
      commonBrandInfos().then(res => {
        if(res.data.code == "200"){
            this.factoryList = res.data.data;
        }else{
            this.$Message.error(res.data.msg);
        }
      });
    },
    getBreedList() {
      commonBreedInfos().then(res => {
        if(res.data.code == "200"){
            this.breedList = res.data.data;
        }else{
            this.$Message.error(res.data.msg);
        }
      });
    },
    changeBrand(option,index){
      if(option){
      this.tableData[index].brandName = option.label;
      }
    },
    changeArea(option,index){
      if(option){
        this.tableData[index].storageArea = option ? option.label : "";
      }
    },
    changePlace(option,index){
      if(option){
        this.tableData[index].storagePlace = option.label;
      }
    },
    changeBreed(option, index) {
      if(option){
      this.tableData[index].breedName = option.label;
      commonMaterialInfos({
        breedCode: option.value
      }).then(res => {
        if(res.data.code == "200"){
            this.$set(this.materialList,index,res.data.data)
            this.specFun(option.value, "", index);
        }else{
            this.$Message.error(res.data.msg);
        }
      });
      }
    },
    changeMaterial(option, index) {
      if(option){
        this.tableData[index].materialName = option.label;
        this.specFun(this.tableData[index].breedCode.value, option.value, index);
      }
    },
    specFun(breedCode, materialCode, index) {
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
        }else{
            this.$Message.error(res.data.msg);
        }
      });
    },
    changeHW(value,index){
      this.tableData[index].inventoryType.value = "";
      if(value == '0'){
        this.inventoryTypeList[index] = [
          {
            value: "0",
            label: "原材"
          },
          {
            value: "1",
            label: "余卷"
          }
        ]
      }else if(value == '1'){
        this.inventoryTypeList[index] = [
          {
            value: "2",
            label: "分条料"
          },
          {
            value: "3",
            label: "开平板"
          }
        ]
      }else{
        this.inventoryTypeList[index] = []
      }
    },
    getOwnerList() {
      commonQueryOwners().then(res => {
        if(res.data.code == "200"){
            this.ownnerList = res.data.data.map(item => {
              return { id: item.id.toString(), customerName: item.customerName };
            });
        }else{
            this.$Message.error(res.data.msg);
        }
      });
    },
    getEmployee() {
      commonEmployees().then(res => {
        if(res.data.code == "200"){
            let resArr = res.data.data.map(item => {
              return {
                employeeId: item.employeeId ? item.employeeId.toString() : '',
                inEnterWorkerId: item.inEnterWorkerId ? item.inEnterWorkerId.toString() : '',
                employeeName: item.employeeName
              };
            });
            let resArr1 = res.data.data.map(item => {
              return item.employeeId ? item.employeeId.toString() : ''
            });
            let resArr2 = res.data.data.map(item => {
              return {
                employeeId: item.employeeId ? item.employeeId : 0,
                inEnterWorkerId: item.inEnterWorkerId ? item.inEnterWorkerId : 0,
                employeeName: item.employeeName
              };
            });
            this.receiveIdList = resArr;
            this.dcgList = resArr;
            this.zxgList = resArr;
            this.wokerIdList = resArr1;
            this.employeeList = resArr2;
        }else{
            this.$Message.error(res.data.msg);
        }
      });
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
      }else{
        const index1 = this.specNameList[index].indexOf(value);
        if(index1 != -1){
          this.tableData[index].specCode.value = this.specCodeList[index][index1];
        }else{
          this.tableData[index].specCode.value = "";
        }
      }
    },
    tableAdd() {
      this.tableData.push({
        code: { status: true, value: "" },
        brandCode: { status: true, value: "" },
        breedCode: { status: true, value: "" },
        specCode: { isUpload:false,status: true, value: "" },
        specName: { status: true, value: "" },
        materialCode: { isUpload:false,status: true, value: "" },
        type: { status: true, value: "0" },
        inventoryType: { status: true, value: "0" },
        storageAreaId: { status: true, value: this.$store.state.user.warehouse.inDefaultAreaId ? this.$store.state.user.warehouse.inDefaultAreaId : "" },
        storagePlaceId: { status: true, value: this.$store.state.user.warehouse.inDefaultLocationId ? this.$store.state.user.warehouse.inDefaultLocationId : "" },
        number: { status: true, value: 1 },
        perAmount: { status: true, value: 0 },
        totalAmount: { status: true, value: "" },
        weightType: { status: true, value: "0" },
        baleNumber: { status: true, value: "" },
        wrap: { status: true, value: "" },
        appearance: { status: true, value: "" }
      });
      this.inventoryTypeList.push([
        { label: "原材", value: "0" },
        { label: "余卷", value: "1" }
      ])
    },
    tableCopy(row, index) {
      let row1 = {
        code: { status: true, value: row.code.value },
        brandCode: { isUpload:row.brandCode.isUpload,status: true, value: row.brandCode.value },
        brandName: row.brandName,
        breedCode: { isUpload:row.breedCode.isUpload,status: true, value: row.breedCode.value },
        breedName: row.breedName,
        specCode: { isUpload:row.specCode.isUpload,status: true, value: row.specCode.value },
        specName: { status: true, value: row.specName.value },
        materialCode: { isUpload:row.materialCode.isUpload,status: true, value: row.materialCode.value },
        materialName: row.materialName,
        type: { isUpload:row.type.isUpload,status: true, value: row.type.value },
        inventoryType: { isUpload:row.inventoryType.isUpload,status: true, value: row.inventoryType.value },
        storageAreaId: { isUpload:row.storageAreaId.isUpload,status: true, value: row.storageAreaId.value },
        storagePlaceId: { isUpload:row.storagePlaceId.isUpload,status: true, value: row.storagePlaceId.value },
        storageArea: row.storageArea,
        storagePlace: row.storagePlace,
        number: { status: true, value: row.number.value },
        perAmount: { status: true, value: 0 },
        totalAmount: { status: true, value: "" },
        weightType: { isUpload:row.weightType.isUpload,status: true, value: row.weightType.value },
        baleNumber: { status: true, value: "" },
        wrap: { status: true, value: row.wrap.value },
        appearance: { status: true, value: row.appearance.value }
      };
      this.tableData.splice(index + 1, 0, row1);
      this.materialList.splice(index + 1, 0, this.materialList[index]);
      this.specCodeList.splice(index + 1, 0, this.specCodeList[index]);
      this.specNameList.splice(index + 1, 0, this.specNameList[index]);
      this.inventoryTypeList.splice(index + 1, 0, this.inventoryTypeList[index]);
    },
    countTonage(index, value) {
      let a = parseInt(this.tableData[index].number.value)
        ? parseInt(this.tableData[index].number.value)
        : 0;
      let b = parseFloat(this.tableData[index].perAmount.value)
        ? parseFloat(this.tableData[index].perAmount.value)
        : 0;
      this.tableData[index].totalAmount.value = a * b ? (a * b).toFixed(4) : "";
      // if (value) {
      //   let arr = value.toString().split(".");
      //   if (arr.length > 1 && arr[1].length > 4) {
      //     this.tableData[index].perAmount.status = false;
      //   } else {
      //     this.tableData[index].perAmount.status = true;
      //   }
      // }
    },
    tableDel(row, index) {
      if (this.tableData.length > 1) {
        this.tableData.splice(index, 1);
        if(this.materialList.length > index){
          this.materialList.splice(index,1);
        }
        if(this.specCodeList.length > index){
          this.specCodeList.splice(index,1);
          this.specNameList.splice(index,1);
        }
        if(this.inventoryTypeList.length > index){
          this.inventoryTypeList.splice(index,1);
        }
      } else {
        this.$Message.error("至少保留一条入库单明细！");
      }
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
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
                key == "storageAreaId" ||
                key == "storagePlaceId" ||
                key == "number" ||
                key == "perAmount" ||
                key == "weightType"
              ) {
                let objValue = obj[key].value;
                if (objValue != "") {
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
                  if(key == 'weightType' && objValue == "0"){
                    obj[key].status = true;
                  }else{
                    if(key == 'storagePlaceId' && !objValue && obj["storagePlace"]){
                      obj[key].status = true;
                    }else{
                      obj[key].status = false;
                      if (!trError) {
                        trError = true;
                      }
                    }
                  }
                }
              }
            }
          }
          if (!trError) {
            let inEnterItemImportDTOs = [];
            for(var i=0;i<this.tableData.length;i++){
              let item = this.tableData[i];
              inEnterItemImportDTOs.push({
                code: item.code.value,
                brandName: item.brandName,
                brandCode: item.brandCode.value,
                breedCode: item.breedCode.value,
                breedName: item.breedName,
                specCode: item.specCode.value,
                specName: item.specName.value,
                materialCode: item.materialCode.value,
                materialName: item.materialName,
                type: item.type.value ? parseInt(item.type.value) : "",
                inventoryType: item.inventoryType.value ? parseInt(item.inventoryType.value) : "",
                storageArea: item.storageAreaId.value ? item.storageArea : "",
                storageAreaId: item.storageAreaId.value ? parseInt(item.storageAreaId.value) : 0,
                storagePlace: item.storagePlaceId.value ? item.storagePlace : "",
                storagePlaceId: item.storagePlaceId.value ? parseInt(item.storagePlaceId.value) : 0,
                number: item.number.value,
                perAmount: item.perAmount.value,
                weightType:  item.weightType.value ? parseInt(item.weightType.value) : 0,
                baleNumber: item.baleNumber.value,
                gyCode:'',
                wrap: item.wrap.value,
                appearance: item.appearance.value,
                categoryStandard: 0,
                specStandard: item.specCode.value ? 0 : 1,
                materialStandard: 0 //0标准1非标
              })
            }
            let cranemanEmployees = [];
            for(var i=0;i<this.cranemanIds.length;i++){
              const wi = this.wokerIdList.indexOf(this.cranemanIds[i]);
              if(wi != -1){
                cranemanEmployees.push(this.employeeList[wi]);
              }
            }
            let stevedoreEmployees = [];
            for(var i=0;i<this.stevedoreIds.length;i++){
              const wi = this.wokerIdList.indexOf(this.stevedoreIds[i]);
              if(wi != -1){
                stevedoreEmployees.push(this.employeeList[wi]);
              }
            }
            InventoryInSaveInEnterList({
              receiveName: this.formValidate.receiveName,
              receiveId: this.formValidate.receiveId ? parseInt(this.formValidate.receiveId) : 0,
              carNumber: this.formValidate.carNumber,
              carPhone: this.formValidate.carPhone,
              cranemanEmployees: cranemanEmployees,
              inEnterItemImportDTOs: inEnterItemImportDTOs,
              inTime: formatDate(this.formValidate.inTime),
              ownerContract: this.formValidate.ownerContract,
              ownerId: this.formValidate.ownerId ? parseInt(this.formValidate.ownerId) : 0,
              ownerName: this.formValidate.ownerName,
              ownerNoticeCode: this.formValidate.ownerNoticeCode,
              ownerPhone: this.formValidate.ownerPhone,
              carContract: this.formValidate.carContract,
              remark: this.formValidate.remark,
              stevedoreEmployees: stevedoreEmployees
            }).then(res => {
              if(res.data.code == "200"){
                  this.$Message.success({
                    content: "提交成功!",
                    duration: 1
                  });
                  setTimeout(() => {
                    closeNowTag(this.$store.state.app, this.$route);
                    this.$router.push({
                      path: "WarehouseRegister"
                    });
                  }, 1000);
              }else{
                  this.$Message.error(res.data.msg);
              }
              setTimeout(()=>{
                this.submitDisabled = false;
              },1000)
            })
            
          } else {
            this.$Message.error("请补充必填项");
            this.submitDisabled = false;
          }
        } else {
          //this.$Message.error("提交失败");
        }
      });
    },
    changeOwnner(option) {
      this.formValidate.ownerName = option.label;
    },
    changeReceiver(option) {
      this.formValidate.receiveName = option.label;
    },
    fileUpload(data) {
      if (data.code == "200") {
        this.$Message.success({
          content: "导入成功!",
          duration: 1
        });
        let reRenderArr = [],oldLength = this.tableData.length;
        let data1 = data.data.itemDTOs.map((item, index) => {
          let a = parseInt(item.number)
            ? parseInt(item.number)
            : 0;
          let b = parseFloat(item.perAmount)
            ? parseFloat(item.perAmount)
            : 0;
          let totalAmount =
            a * b ? (a * b).toFixed(4) : "";//计算导入数据每行的总重量

          let perAmountStatus = true;
          if (item.perAmount) {
            let arr = item.perAmount.toString().split(".");
            if (arr.length > 1 && arr[1].length > 4) {
              perAmountStatus = false;
            } else {
              perAmountStatus = true;
            }
          }//验证导入的数据单件重量是否超出4位小数
         // this.breedChangeSave(item.breedCode,index);
          reRenderArr.push({
            breedCode:item.breedCode,
            materialCode:item.materialCode,
            specCode:item.specCode,
            specName:item.specName,
            newIndex:oldLength + index
          })
          if(item.type == '0'){
            this.inventoryTypeList[oldLength + index] = [
              {
                value: "0",
                label: "原材"
              },
              {
                value: "1",
                label: "余卷"
              }
            ]
          }else if(item.type == '1'){
            this.inventoryTypeList[oldLength + index] = [
              {
                value: "2",
                label: "分条料"
              },
              {
                value: "3",
                label: "开平板"
              }
            ]
          }else{
            this.inventoryTypeList[oldLength + index] = []
          }

          return {
            code: { isUpload:true,status: true, value: item.code },
            brandCode: { isUpload:true,status: true, value: item.brandCode },
            brandName: item.brandName,
            breedCode: { isUpload:true,status: true, value: item.breedCode },
            breedName: item.breedName,
            specCode: {
              isUpload:true,
              status: true,
              value: item.specCode ? "" : item.specName
            },
            specName: { status: true, value: item.specName },
            materialCode: { isUpload:true,status: true, value: item.materialCode },
            materialName: item.materialName,
            type:{ isUpload:true,status: true, value: item.type || item.type == 0 ? item.type.toString() : "" },
            inventoryType: { isUpload:true,status: true, value: item.inventoryType || item.inventoryType == 0 ? item.inventoryType.toString() : "" },
            storageAreaId: { isUpload:true,status: true, value: item.storageAreaId ? item.storageAreaId.toString() : "" },
            storageArea:item.storageAreaId ? item.storageArea : "",
            storagePlaceId: { isUpload:true,status: true, value: item.storagePlaceId ? item.storagePlaceId.toString() : "" },
            storagePlace:item.storagePlaceId ? item.storagePlace : "",
            number: { status: true, value: item.number },
            perAmount: { status: perAmountStatus, value: item.perAmount },
            totalAmount: { status: true, value: totalAmount },
            weightType: { isUpload:true,status: true, value: item.weightType.toString() },
            baleNumber: { status: true, value: item.baleNumber },
            wrap: { status: true, value: item.wrap },
            appearance: { status: true, value: item.appearance }
          };
        });
        this.tableData = this.tableData.concat(data1);
        //this.reRenderImport(reRenderArr,oldLength)
      }else{
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
    backFun() {
      this.$Modal.confirm({
        title: "提示",
        content: "有数据未保存，是否确定放弃？",
        onOk: () => {
          closeNowTag(this.$store.state.app, this.$route);
          this.$router.push({
            path: "WarehouseRegister"
          });
        },
        onCancel: () => {}
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
.tb-link-copy,
.tb-link-add,
.tb-link-remove {
  cursor: pointer;
}
.ivu-upload {
  float: left;
}
.tb-link-copy {
  display: inline-block;
  height: 20px;
  vertical-align: middle;
}
.table-content {
  border-left: 1px solid #ddd;
  border-top: 1px solid #ddd;
  position: relative;
  padding-right: 80px;
}
.table-content .table1 {
  width: 100%;
  overflow: auto;
}
.table-content .table1 table {
  min-width: 1600px;
}
.table-content .table2 {
  position: absolute;
  top: 0;
  right: 0;
  width: 80px;
  border-left: 1px solid #ddd;
  overflow: hidden;
}
.table-content .table2 th,
.table-content .table2 td {
  text-align: center;
}
.td-operate {
  height: 32px;
  line-height: 32px;
}
.error-tip {
  font-size: 11px;
  color: red;
}
.tr-more-height td {
  height: 61px !important;
}
</style>



