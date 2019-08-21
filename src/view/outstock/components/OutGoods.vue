<template>
    <div>
        <Modal v-model="modal" title="选中出库货物" width="80%" @on-ok="doOk" @on-cancel="doCancel">
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
                     <Col :sm="8" :xs="24">
                    <FormItem label="打包号:">
                        <Input v-model="params.packCode"></Input>
                    </FormItem>
                    </Col>
                    <Col :sm="8" :xs="24">
                    <FormItem label="材料类型:">
                        <Select v-model="params.inventoryType" filterable clearable>
                            <Option v-for="item in inventoryTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                  <Col :sm="24" :xs="24" class="text-right">
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
        </Modal>
        <Modal v-model="modal1" title="母卷信息" width="60%" ok-text="确定">
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
                <Button type="primary" @click="modal1=false">确定</Button>
            </div>
        </Modal>
        <Modal v-model="modal2" title="打包货物明细" width="60%" ok-text="确定">
            <div class="table-scrollable ivu-table ivu-table-db">
                <table cellspacing="0" cellpadding="0" border="0" width="100%">
                   <thead>
                     <tr>
                       <th>打包号</th>
                       <th>货物类型</th>
                       <th>材料类型</th>
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
                            <td>{{item.type == '0' ? '原料' : item.type == '1' ? '成品' : '废料'}}</td>
                            <td>{{item.inventoryType == '0' ? '原材' : item.inventoryType == '1' ? '余卷' : item.inventoryType == '2' ? '分条料' : item.inventoryType == '3' ? '开平板' : item.inventoryType == '4' ? '头尾板' : item.inventoryType == '5' ? '边丝' : ''}}</td>
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
    </div>
</template>
<script>
import {
  commonBrandInfos,
  commonBreedInfos,
  commonMaterialInfos,
  commonAreasByWarehouseId
} from "@/api/common";
import {
  inventoryItemQueryList,
  getParentInventoryItemDetail,
  queryInventoryItemsByPackId
} from "@/api/outstock";
import { formatDate, formatPrice, formatWeight } from "@/libs/util";
export default {
  name: "OutGoods",
  props: {
    showModal: Boolean,
    ownerId: String,
    type: Number,
    selectedIds: Array
  },
  data() {
    return {
      hasMJ: false,
      modal1: false,
      modal2: false,
      modal: this.showModal,
      mjInfor: {},
      dbInfor: {},
      warehouseName: "", //当前登录的仓库
      inputDate: [],
      checkedRow: [],
      inventoryTypeList: [
        {
            value: 0,
            label: "原材"
        },
        {
            value: 1,
            label: "余卷"
        },
        {
            value: 2,
            label: "分条料"
        },
        {
            value: 3,
            label: "开平板"
        },
        {
            value: 4,
            label: "头尾板"
        },
        {
            value: 5,
            label: "边丝"
        }
      ],
      params: {
        code: "",
        brandName: "",
        breedName: "",
        materialName: "",
        specName: "",
        packCode:"",
        storageArea: [],
        inventoryType: ""
      },
      searchParams: {
        code: "",
        startTime: "",
        endTime: "",
        brandName: "",
        breedName: "",
        materialName: "",
        specName: "",
        packCode:"",
        storageArea: "",
        inventoryType: ""
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
          minWidth: 120,
          render: (h, data) => {
                if (data.row.packId) {
                  return h(
                    "a",
                    {
                      class: "tb-link",
                      on: {
                        click: () => {
                          this.modal2 = true;
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
          title: "材料类型",
          key: "inventoryType",
          align: "left",
          minWidth: 120,
          render: (h, data) => {
            var name = "";
            switch(data.row.inventoryType) {
              case 0: name = "原材"; break;
              case 1: name = "余卷"; break;
              case 2: name = "分条料"; break;
              case 3: name = "开平板"; break;
              case 4: name = "头尾板"; break;
              case 5: name = "边丝"; break;
            }
            return h("span", name);
          }
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
          title: "库存数量(件)",
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
          title: "库存总重量(吨)",
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
          title: "已锁定数量(件)",
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
          title: "已锁定重量(吨)",
          key: "lockWeight",
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
                arr.push(h("div",{class:line}, formatWeight(item.lockWeight)));
              });
              return h("div", arr);
            }else{
              return h("div", formatWeight(data.row.lockWeight));
            }
          }
        },
        {
          title: "可结算数量(件)",
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
          title: "可结算重量(吨)",
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
    this.changeInventoryTypeList(this.type);
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
    onSelected(selection){
      this.checkRowChange(selection);
    },
    onSelectedAll(selection){
      selection.forEach(item=>{
        this.changeSelected(selection,item);
      })
    },
    changeSelected(selection,row) {
      if(row.packId){
        let n;
        selection.forEach((item,index)=>{
          if(item.id == row.id){
            n = index;
          }
        })
        this.checkRowChange(selection);
        this.packFun(n,row.packId)
      }else{
        this.checkRowChange(selection);
      }
    },
    checkRowChange(selection){
      var newSel = [];
      selection.forEach(item=>{
        let count = 0;
        this.checkedRow.forEach(item1=>{
          if(item.id == item1.id){
            newSel.push(item1)
          }else{
            count++;
          }
        });
        if(count == this.checkedRow.length){
          newSel.push(item)
        }
      })
      this.checkedRow = newSel;
    },
    packFun(n,packId){
      queryInventoryItemsByPackId({ packIds: packId }).then(
          res => {
            var arr = res.data.data;
            arr.forEach((item,i)=>{
              //可结算数量(件)
              arr[i].remainNum = arr[i].number - arr[i].outNum;

              //出库结算数量默认等于可结算数量，不能为0
              arr[i].realOutNumber = arr[i].remainNum ? arr[i].remainNum : 1;

              //出库结算总重量(吨) = 出库结算数量*单件重量
              arr[i].totalWeight = arr[i].realOutNumber * arr[i].perAmount;

              //出库单价,成品默认取值成品单价unitPrice，原料成品单价应该为空
            //   arr[i].outSinglePrice = arr[i].unitPrice ? Number(arr[i].unitPrice) : "";

              //出库费用(元) = 出库总重量*出库单价
              arr[i].outTotalPrice = arr[i].totalWeight * arr[i].outSinglePrice;

              //其他费用,默认为空（需要用户自己填写）
              arr[i].otherPrice = null;

              //总金额 = 出库费用(元) + 其他费用(元)
              arr[i].totalMoney =
                Number(arr[i].outTotalPrice) + Number(arr[i].otherPrice);
              arr[i].inventoryItemId = arr[i].id;
              arr[i].id = "";
            })
            this.checkedRow[n].packList = arr;
          }
        );
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
    getMjInfor(inventoryItemId) {
      getParentInventoryItemDetail({ inventoryItemId: inventoryItemId }).then(
        res => {
          this.mjInfor = res.data.data;
        }
      );
    },
    getDBInfor(packId) {
      queryInventoryItemsByPackId({ packIds: packId }).then(
        res => {
          this.dbInfor = res.data.data;
        }
      );
    },
    doOk() {
      let newRows = [],packIds = [];
      this.checkedRow.forEach(item => {
        if(item.packId && packIds.indexOf(item.packId) >= 0){}else{
          packIds.push(item.packId);
          newRows.push(item);
        }
      })
      this.$emit("hide-modal", newRows);
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
        storageArea: [],
        packCode:"",
        inventoryType: ""
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
      this.searchParams.packCode=this.params.packCode;
      this.searchParams.storageArea = this.params.storageArea.join(",");
      this.searchParams.inventoryType=this.params.inventoryType;
      this.pageChange(1);
    },
    getList() {
      this.checkedRow = [];
      const para = {
        code: this.searchParams.code,
        ownerId: this.ownerId,
        type: this.type,
        warehouseName: this.warehouseName,
        startTime: this.searchParams.startTime,
        endTime: this.searchParams.endTime,
        packCode: this.searchParams.packCode,
        brandName: this.searchParams.brandName,
        breedName: this.searchParams.breedName,
        materialName: this.searchParams.materialName,
        specName: this.searchParams.specName,
        storageArea: this.searchParams.storageArea,
        inventoryType: this.searchParams.inventoryType,
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
        if (this.type == 1) {
          if (!this.hasMJ) {
            this.tableColumns.splice(5, 0, {
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
                              this.modal1 = true;
                              this.getMjInfor(item.id);
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
                            this.modal1 = true;
                            this.getMjInfor(data.row.id);
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
            this.tableColumns.splice(5, 1);
          }
          this.hasMJ = false;
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
    changeInventoryTypeList(type) {
      switch(type) {
        case 0: this.inventoryTypeList = [{
              value: 0,
              label: "原材"
          },
          {
              value: 1,
              label: "余卷"
          }]; 
          break;
        case 1: this.inventoryTypeList = [{
              value: 2,
              label: "分条料"
          },
          {
              value: 3,
              label: "开平板"
          }]; 
          break;
        case 2: this.inventoryTypeList = [{
              value: 4,
              label: "头尾板"
          },
          {
              value: 5,
              label: "边丝"
          }]; 
          break;
        default: this.inventoryTypeList = [{
              value: 0,
              label: "原材"
          },
          {
              value: 1,
              label: "余卷"
          },
          {
              value: 2,
              label: "分条料"
          },
          {
              value: 3,
              label: "开平板"
          },
          {
              value: 4,
              label: "头尾板"
          },
          {
              value: 5,
              label: "边丝"
          }]; 
        }
    }
  },
  watch: {
    showModal(newVal, oldVal) {
      this.modal = newVal;
    },
    selectedIds(newVal, oldVal) {
      this.selectedIds = newVal;
    },
    ownerId(newVal, oldVal) {
      this.ownerId = newVal;
    },
    type(newVal, oldVal) {
      this.type = newVal;
      this.changeInventoryTypeList(newVal);
    }
  }
};
</script>
<style scoped>
.ivu-table-db{border-top: 1px solid #dcdee2;border-left: 1px solid #dcdee2;}
.ivu-table-db th,.ivu-table-db td{padding:5px;}
</style>


