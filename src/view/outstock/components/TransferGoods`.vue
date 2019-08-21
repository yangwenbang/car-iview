<template>
<div>
    <Modal v-model="modal" title="选择过户货物" width="80%" @on-ok="doOk" @on-cancel="doCancel">
        <Form :label-width="150" class="search-form">
            <Row>
                <Col :sm="8" :xs="24">
                <FormItem label="编号:">
                    <Input v-model="params.code"></Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="入库日期:">
                    <DatePicker v-model="inputDate" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="请选择日期"></DatePicker>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="产地:">
                    <Select v-model="params.brandName" filterable clearable>
                        <Option v-for="(item,index) in factoryList" :value="item.brandName" :key="index">{{ item.brandName }}</Option>
                    </Select>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col :sm="8" :xs="24">
                <FormItem label="品名:">
                    <Select filterable clearable v-model="params.breedCode" @on-change="changeBreed" label-in-value>
                        <Option v-for="(item,index) in breedList" :value="item.breedCode" :key="index">{{ item.breedName }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="材质:">
                    <Select filterable clearable v-model="params.materialName">
                        <Option v-for="(item,index) in materialList" :value="item.materialName" :key="index">{{ item.materialName }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="规格:">
                    <Input v-model="params.specName"></Input>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col :sm="8" :xs="24">
                <FormItem label="库区:">
                    <Select v-model="params.storageArea" multiple filterable clearable>
                        <Option v-for="(item,index) in areasList" :value="item.id" :key="index">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col :sm="16" :xs="24" class="text-right">
                <FormItem>
                    <Button type="primary" @click="search">查询</Button>
                    <Button style="margin-left: 8px" @click="reset">重置</Button>
                </FormItem>
                </Col>
            </Row>
        </Form>
        <Table class="table-nowrap" :columns="tableColumns" :data="tableData" border @on-select-all="onSelectedAll" @on-select-all-cancel="onSelected" @on-select-cancel="onSelected" @on-select="changeSelected"></Table>
        <div class="page-wrapper">
            <div v-if="this.$store.state.app.screenSize>768">
                <span class="left">共{{total}}条记录 第{{pageNum}}页 / 共{{Math.ceil(total / pageSize)}}页 </span>
                <Page class="pull-right" :current="pageNum" :total="total" :page-size="pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size-opts="pageSizeOpts" show-sizer show-elevator/>
            </div>
            <div v-if="this.$store.state.app.screenSize<=768">
                <Page class="pull-right" :current="pageNum" :page-size="pageSize" :total="total" @on-change="pageChange" simple />
            </div>
        </div>
        <Modal v-model="modal2" title="打包货物明细" width="60%" ok-text="确定">
            <div class="table-scrollable ivu-table ivu-table-db">
                <table cellspacing="0" cellpadding="0" border="0" width="100%">
                    <thead>
                        <tr>
                            <th>打包号</th>
                            <th>货物类型</th>
                            <th>原材类型/<br>成品类型</th>
                            <th>产地</th>
                            <th>品名</th>
                            <th>材质</th>
                            <th>规格</th>
                            <th align="right">数量(件)</th>
                            <th align="right">单件重量（吨）</th>
                            <th align="right">总重量（吨）</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in dbInfor" :key="index">
                            <td :rowspan="dbInfor.length" v-if="index == 0">{{item.packCode}}</td>
                            <td>{{item.type == '0' ? '原料' : '成品'}}</td>
                            <td>{{item.type == '0' ? '原材' : item.type == '1' ? '余卷' : item.type == '2' ? '分条料' : item.type == '3' ? '开平板' : ''}}</td>
                            <td>{{item.brandName}}</td>
                            <td>{{item.breedName}}</td>
                            <td>{{item.materialName}}</td>
                            <td>{{item.specName}}</td>
                            <td align="right">{{item.number}}</td>
                            <td align="right">{{item.perAmount}}</td>
                            <td align="right">{{item.weight}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div slot="footer">
                <Button type="primary" @click="modal2=false">确定</Button>
            </div>
        </Modal>
    </Modal>
    <Modal v-model="modal1" title="打包货物明细" width="60%" ok-text="确定">
        <div class="table-scrollable ivu-table ivu-table-db">
            <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <thead>
                <tr>
                    <th>打包号</th>
                    <th>货物类型</th>
                    <th>原材类型/<br>成品类型</th>
                    <th>产地</th>
                    <th>品名</th>
                    <th>材质</th>
                    <th>规格</th>
                    <th align="right">数量(件)</th>
                    <th align="right">单件重量（吨）</th>
                    <th align="right">总重量（吨）</th>
                </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in dbInfor" :key="index">
                        <td :rowspan="dbInfor.length" v-if="index == 0">{{item.packCode}}</td>
                        <td>{{item.type == '0' ? '原料' : '成品'}}</td>
                        <td>{{item.type == '0' ? '原材' : item.type == '1' ? '余卷' : item.type == '2' ? '分条料' : item.type == '3' ? '开平板' : ''}}</td>
                        <td>{{item.brandName}}</td>
                        <td>{{item.breedName}}</td>
                        <td>{{item.materialName}}</td>
                        <td>{{item.specName}}</td>
                        <td align="right">{{item.number}}</td>
                        <td align="right">{{item.perAmount|formatWeight}}</td>
                        <td align="right">{{item.weight|formatWeight}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div slot="footer">
            <Button type="primary" @click="modal1=false">确定</Button>
        </div>
    </Modal>
</div>
</template>
<script>
import {
  commonBrandInfos,
  commonBreedInfos,
  commonMaterialInfos,
  commonAreasByWarehouseId
} from "@/api/common";
<<<<<<< .mine
import {
  inventoryItemQueryList,
  queryInventoryItemsByPackId
} from "@/api/outstock";
=======
import { inventoryItemQueryList, queryInventoryItemsByPackId } from "@/api/outstock";
>>>>>>> .r19038
import { formatDate, formatPrice, formatWeight } from "@/libs/util";
export default {
<<<<<<< .mine
  name: "TransferGoods",
  props: {
    showModal: Boolean,
    oldOwnerId: String,
    type: Number,
    selectedIds: Array
  },
  data() {
    return {
      modal: this.showModal,
      modal2: false,
      dbInfor: {},
      inputDate: [],
      checkedRow: [],
      params: {
        code: "",
        brandName: "",
        breedName: "",
        materialName: "",
        specName: "",
        storageArea: []
      },
      searchParams: {
        code: "",
        startTime: "",
        endTime: "",
        brandName: "",
        breedName: "",
        materialName: "",
        specName: "",
        storageArea: ""
      },
      pageSize: 10,
      pageNum: 1,
      pageSizeOpts: [10, 15, 20, 40, 50, 100],
      total: 100,
      factoryList: [],
      breedList: [],
      materialList: [],
      areasList: [],
      tableData: [],
      tableColumns: [
        {
          type: "selection",
          width: 40,
          align: "center"
        },
        {
          title: "编号",
          key: "code",
          align: "left",
          minWidth: 120,
          render: (h, data) => {
            if (data.row.packId) {
              var arr = [];
              data.row.packList.forEach((item, index) => {
                let line = "table-mn";
                if (index > 0) {
                  line = "table-line table-mn";
                }
                arr.push(h("div", { class: line }, item.code));
              });
              return h("div", arr);
            } else {
              return h("div", data.row.code);
            }
          }
        },
        {
          title: "打包号",
          key: "packCode",
          align: "left",
          minWidth: 120,
          render: (h, data) => {
            if (data.row.packId) {
              return h(
                "a",
=======
    name: "TransferGoods",
    props: {
        showModal: Boolean,
        oldOwnerId: String,
        type: Number,
        selectedIds: Array
    },
    data() {
        return {
            modal: this.showModal,
            modal1:false,
            dbInfor: [],
            inputDate: [],
            checkedRow: [],
            params: {
                code: "",
                brandName: "",
                breedName: "",
                materialName: "",
                specName: "",
                storageArea: []
            },
            searchParams: {
                code: "",
                startTime: "",
                endTime: "",
                brandName: "",
                breedName: "",
                materialName: "",
                specName: "",
                storageArea: ""
            },
            pageSize: 10,
            pageNum: 1,
            pageSizeOpts: [10, 15, 20, 40, 50, 100],
            total: 100,
            factoryList: [],
            breedList: [],
            materialList: [],
            areasList: [],
            tableData: [],
            tableColumns: [
>>>>>>> .r19038
                {
<<<<<<< .mine
                  class: "tb-link",
                  on: {
                    click: () => {
                      this.modal2 = true;
                      this.getDBInfor(data.row.packId);
=======
                    type: "selection",
                    width: 40,
                    align: "center"
                },
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
                    minWidth: 120,
                    render: (h, data) => {
                        if (data.row.packCode) {
                            return h(
                                "a",
                                {
                                class: "tb-link",
                                on: {
                                    click: () => {
                                    this.modal1 = true;
                                    this.getDBInfor(data.row.packId);
                                    }
                                }
                                },
                                data.row.packCode
                            );
                        } else {
                            return h("span", "");
                        }
                    }
                },
                {
                    title: "产地",
                    key: "brandName",
                    align: "left",
                    minWidth: 120
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
                    minWidth: 140
                },
                {
                    title: "数量(件)",
                    key: "number",
                    align: "right",
                    minWidth: 100
                },
                {
                    title: "单件重量(吨)",
                    key: "perAmount",
                    align: "right",
                    minWidth: 100,
                    render: (h, data) => {
                        return h("span", formatWeight(data.row.perAmount));
>>>>>>> .r19038
                    }
                  }
                },
                data.row.packCode
              );
            } else {
              return h("span", "");
            }
          }
        },
        {
          title: "产地",
          key: "brandName",
          align: "left",
          minWidth: 100,
          render: (h, data) => {
            if (data.row.packId) {
              var arr = [];
              data.row.packList.forEach((item, index) => {
                let line = "table-mn";
                if (index > 0) {
                  line = "table-line table-mn";
                }
                arr.push(h("div", { class: line }, item.brandName));
              });
              return h("div", arr);
            } else {
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
            if (data.row.packId) {
              var arr = [];
              data.row.packList.forEach((item, index) => {
                let line = "table-mn";
                if (index > 0) {
                  line = "table-line table-mn";
                }
                arr.push(h("div", { class: line }, item.breedName));
              });
              return h("div", arr);
            } else {
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
            if (data.row.packId) {
              var arr = [];
              data.row.packList.forEach((item, index) => {
                let line = "table-mn";
                if (index > 0) {
                  line = "table-line table-mn";
                }
                arr.push(h("div", { class: line }, item.materialName));
              });
              return h("div", arr);
            } else {
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
            if (data.row.packId) {
              var arr = [];
              data.row.packList.forEach((item, index) => {
                let line = "table-mn";
                if (index > 0) {
                  line = "table-line table-mn";
                }
                arr.push(h("div", { class: line }, item.specName));
              });
              return h("div", arr);
            } else {
              return h("div", data.row.specName);
            }
          }
        },
        {
          title: "数量(件)",
          key: "number",
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
                arr.push(h("div",{class:line}, item.number));
              });
              return h("div", arr);
            }else{
              return h("div", data.row.number);
            }
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
          minWidth: 100,
          render: (h, data) => {
            if(data.row.packId){
              var arr = [];
              data.row.packList.forEach((item,index) => {
                let line = "table-mn";
                if(index > 0){
                  line = "table-line table-mn"
                }
                var statusTest = "";
                if (item.weightType == "0") {
                    statusTest = "抄码";
                } else if (item.weightType == "1") {
                    statusTest = "过磅";
                } else if (item.weightType == "2") {
                    statusTest = "理重";
                }
                arr.push(h("div",{class:line}, statusTest));
              });
              return h("div", arr);
            }else{
                var statusTest = "";
                if (data.row.weightType == "0") {
                    statusTest = "抄码";
                } else if (data.row.weightType == "1") {
                    statusTest = "过磅";
                } else if (data.row.weightType == "2") {
                    statusTest = "理重";
                }
              return h("div", statusTest);
            }
          }
        },
        {
          title: "加锁数量(件)",
          key: "lockNum",
          align: "right",
          minWidth: 140,
          render: (h, data) => {
            if(data.row.packId){
              var arr = [];
              data.row.packList.forEach((item,index) => {
                let line = "table-mn";
                if(index > 0){
                  line = "table-line table-mn"
                }
                arr.push(h("div",{class:line}, item.lockNum));
              });
              return h("div", arr);
            }else{
              return h("div", data.row.lockNum);
            }
          }
        },
        {
          title: "可过户数量(件)",
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
          title: "可过户重量(吨)",
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
                arr.push(h("div",{class:line}, formatWeight(item.availableWeight)));
              });
              return h("div", arr);
            }else{
              return h("div", formatWeight(data.row.availableWeight));
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
<<<<<<< .mine
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
=======
        pageSizeChange(pagesize) {
            this.pageNum = 1;
            this.pageSize = pagesize;
            this.getList();
        },
        getDBInfor(packId) {
            queryInventoryItemsByPackId({ packIds: packId }).then(res => {
                this.dbInfor = res.data.data ? res.data.data : [];
            });
        },
    },
    watch: {
        showModal(newVal, oldVal) {
            this.modal = newVal;
>>>>>>> .r19038
        },
        {
          title: "入库日期",
          key: "inTime",
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
                arr.push(h("div",{class:line}, item.inTime));
              });
              return h("div", arr);
            }else{
              return h("div", data.row.inTime);
            }
          }
        },
        {
          title: "仓租天数",
          key: "storageDay",
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
                arr.push(h("div",{class:line}, item.storageDay));
              });
              return h("div", arr);
            }else{
              return h("div", data.row.storageDay);
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
      ]
    };
  },
  mounted() {
    //this.getCurrentWeek();
    this.getBrandList();
    this.getBreedList();
    this.getAreasList();
  },
  methods: {
    //默认显示当前一周
    getCurrentWeek() {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      this.inputDate = [start, end];
      this.searchParams.startTime = formatDate(this.inputDate[0]);
      this.searchParams.endTime = formatDate(this.inputDate[1]);
    },
    onSelected(selection) {
      this.checkRowChange(selection);
    },
    onSelectedAll(selection) {
      selection.forEach(item => {
        this.changeSelected(selection, item);
      });
    },
    changeSelected(selection, row) {
      if (row.packId) {
        let n;
        selection.forEach((item, index) => {
          if (item.id == row.id) {
            n = index;
          }
        });
        this.checkedRow = selection;
        this.packFun(n, row.packId);
      } else {
        this.checkRowChange(selection);
      }
    },
    checkRowChange(selection) {
      var newSel = [];
      selection.forEach(item => {
        let count = 0;
        this.checkedRow.forEach(item1 => {
          if (item.id == item1.id) {
            newSel.push(item1);
          } else {
            count++;
          }
        });
        if (count == this.checkedRow.length) {
          newSel.push(item);
        }
      });
      this.checkedRow = newSel;
    },
    getBrandList() {
      commonBrandInfos().then(res => {
        this.factoryList = res.data.data;
      });
    },
    getBreedList() {
      commonBreedInfos().then(res => {
        this.breedList = res.data.data;
      });
    },
    changeBreed(option) {
      this.params.breedName = option.label;
      commonMaterialInfos({
        breedCode: option.value
      }).then(res => {
        this.materialList = res.data.data;
      });
    },
    getAreasList() {
      commonAreasByWarehouseId().then(res => {
        this.areasList = res.data.data;
      });
    },
    doOk() {
      this.$emit("hide-modal", this.checkedRow);
      this.checkedRow = [];
    },
    doCancel() {
      this.$emit("hide-modal");
      this.checkedRow = [];
    },
    reset() {
      this.inputDate = [];
      this.params = {
        code: "",
        brandName: "",
        breedName: "",
        breedCode: "",
        materialName: "",
        specName: "",
        storageArea: []
      };
    },
    search() {
      this.searchParams.startTime = formatDate(this.inputDate[0]);
      this.searchParams.endTime = formatDate(this.inputDate[1]);
      this.searchParams.code = this.params.code;
      this.searchParams.brandName = this.params.brandName;
      this.searchParams.breedName = this.params.breedName;
      this.searchParams.materialName = this.params.materialName;
      this.searchParams.specName = this.params.specName;
      this.searchParams.storageArea = this.params.storageArea.join(",");
      this.pageChange(1);
    },
    getList() {
      const para = {
        code: this.searchParams.code,
        ownerId: this.oldOwnerId,
        type: this.type,
        startTime: this.searchParams.startTime,
        endTime: this.searchParams.endTime,
        code: this.searchParams.code,
        brandName: this.searchParams.brandName,
        breedName: this.searchParams.breedName,
        materialName: this.searchParams.materialName,
        specName: this.searchParams.specName,
        storageArea: this.searchParams.storageArea,
        numPerPage: this.pageSize,
        pageNo: this.pageNum,
        greaterThanZero: 1
      };
      inventoryItemQueryList(para).then(res => {
        let data = res.data.data.recordList,tableArr=[];
        //与之前选中的数据比对，已选中或者可结算数量<=0的,则设置_disabled:true
        for (let i = 0; i < data.length; i++) {
          if (
            this.selectedIds.indexOf(data[i].id) > -1 ||
            data[i].availableNumber <= 0
          ) {
            this.$set(data[i], "_disabled", true);
          }
          if(data[i].packId){
              let count = -1;
              for(let j=0;j<tableArr.length;j++){
                if(tableArr[j].packId == data[i].packId && tableArr[j].id != data[i].id){
                  count = j;
                }
              }
              if(count >= 0){
                tableArr[count].packList.push(data[i])
              }else{
                let Obj = data[i];
                Obj.packList = [];
                Obj.packList.push({
                  id: data[i].id, //出库结算单明细ID
                  inventoryItemId: data[i].inventoryItemId, //物资明细ID
                  code: data[i].code,
                  brandName: data[i].brandName,
                  breedName: data[i].breedName,
                  materialName: data[i].materialName,
                  specName: data[i].specName,
                  storageArea: data[i].storageArea,
                  storagePlace: data[i].storagePlace,
                  remainNum:data[i].remainNum,
                  number:data[i].number,
                  weightType: data[i].weightType,
                  wrap: data[i].wrap,
                  appearance: data[i].appearance,
                  baleNumber: data[i].baleNumber,
                  type:data[i].type,
                  packCode: data[i].packCode,
                  packId: data[i].packId,
                  availableNumber:data[i].availableNumber,
                  availableWeight:data[i].availableWeight,
                  inTime:data[i].inTime,
                  lockNum:data[i].lockNum,
                  lockWeight:data[i].lockWeight,
                  outNum:data[i].outNum,
                  ownerId:data[i].ownerId,
                  perAmount:data[i].perAmount,
                  storageDay:data[i].storageDay,
                  unitPrice:data[i].unitPrice,
                  weight:data[i].weight
                })

                tableArr.push(Obj);
              }
          }else{
            tableArr.push(data[i]);
          }
        }
        this.tableData = tableArr;
        this.total = res.data.data.totalCount;
      });
    },
    pageChange(page) {
      this.pageNum = page;
      this.getList();
    },
    pageSizeChange(pagesize) {
      this.pageNum = 1;
      this.pageSize = pagesize;
      this.getList();
    },
    packFun(n, packId) {
      queryInventoryItemsByPackId({ packIds: packId }).then(res => {
        var arr = res.data.data;
        arr.forEach((item, i) => {
          //过户数量默认等于可过户数量，不能为0
          arr[i].number = arr[i].availableNumber ? arr[i].availableNumber : 1;

          //过户重量(吨) = 过户数量*单件重量
          arr[i].weight = arr[i].number * arr[i].perAmount;

          //过户单价,默认为空（需要用户自己填写）
          arr[i].transferPrice = 0;

          //过户费用(元) = 过户重量*过户单价
          arr[i].transferFee = arr[i].weight * arr[i].transferPrice;
          arr[i].itemId = arr[i].id;
        });
        this.checkedRow[n].packList = arr;
      });
    },
    getDBInfor(packId) {
      queryInventoryItemsByPackId({ packIds: packId }).then(res => {
        this.dbInfor = res.data.data;
      });
    }
  },
  watch: {
    showModal(newVal, oldVal) {
      this.modal = newVal;
    },
    selectedIds(newVal, oldVal) {
      this.selectedIds = newVal;
    },
    oldOwnerId(newVal, oldVal) {
      this.oldOwnerId = newVal;
    },
    type(newVal, oldVal) {
      this.type = newVal;
    }
  }
};
</script>
<style scoped>
.ivu-table-db{border-top: 1px solid #dcdee2;border-left: 1px solid #dcdee2;}
.ivu-table-db th,.ivu-table-db td{padding:5px;}
</style>


