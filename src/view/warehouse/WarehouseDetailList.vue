<template>
  <div class="white-bg">
    <Form :label-width="150" class="search-form">
      <Row type="flex" justify="space-between">
        <Col :sm="8" :xs="24">
        <FormItem label="入库单号:">
          <Input v-model="params.inCode"></Input>
        </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
        <FormItem label="入库日期:">
          <DatePicker clearable v-model="inputDate" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="请选择日期" style="width:100%;"></DatePicker>
        </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
        <FormItem label="货物编号:">
          <Input v-model="params.code"></Input>
        </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
        <FormItem label="产地:">
          <Select filterable clearable v-model="params.brandCode" @on-change="changeBrand" label-in-value>
            <Option v-for="(item,index) in factoryList" :value="item.brandCode" :key="index">{{ item.brandName }}</Option>
          </Select>
        </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
        <FormItem label="品名:">
          <Select filterable clearable v-model="params.breedCode" @on-change="changeBreed" label-in-value>
            <Option v-for="(item,index) in breedList" :value="item.breedCode" :key="index">{{ item.breedName }}</Option>
          </Select>
        </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
        <FormItem label="材质:">
          <Select filterable clearable v-model="params.materialCode" @on-change="changeMaterial" label-in-value>
            <Option v-for="(item,index) in materialList" :value="item.materialCode" :key="index">{{ item.materialName }}</Option>
          </Select>
        </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
        <FormItem label="规格:">
          <Input v-model="params.specName"></Input>
        </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
        <FormItem label="货物类型:">
          <Select filterable clearable v-model="params.type" @on-change="changeHW">
            <Option v-for="(item,index) in hwList" :value="item.value" :key="index">{{ item.label }}</Option>
          </Select>
        </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
        <FormItem label="材料类型:">
          <Select filterable clearable v-model="params.inventoryType">
            <Option v-for="(item,index) in clList" :value="item.value" :key="index">{{ item.label }}</Option>
          </Select>
        </FormItem>
        </Col>
        <Col :sm="24" :xs="24" class="text-right">
        <FormItem>
          <Button type="primary" @click="search">搜索</Button>
          <Button style="margin-left: 8px" @click="reset">重置</Button>
        </FormItem>
        </Col>
      </Row>
    </Form>
    <Row>
      <Col span="24">
      <div class="pull-right count-content">
        <span class="margin-right-10">货物数量：
          <b class="tip">{{itemsNumber}}</b> 件</span>
        <span>总重量：
          <b class="tip">{{itemsWeight | formatWeight}}</b> 吨</span>
      </div>
      </Col>
    </Row>
    <Table ref="selection" :columns="tableColumns" :data="tableData" border></Table>
    <div class="page-wrapper">
      <div v-if="this.$store.state.app.screenSize>768">
        <span class="left">共{{total}}条记录 第{{pageNum}}页 / 共{{Math.ceil(total / pageSize)}}页 </span>
        <Page class="pull-right" :current="pageNum" :total="total" :page-size="pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size-opts="pageSizeOpts" show-sizer show-elevator/>
      </div>
      <div v-if="this.$store.state.app.screenSize<=768">
        <Page class="pull-right" :current="pageNum" :page-size="pageSize" :total="total" @on-change="pageChange" simple />
      </div>
    </div>
    <!-- <div class="text-center margin-top-10">
            <Button class="btn-common-width margin-left-10" @click="backFun">关闭</Button>
        </div> -->
  </div>

</template>
<script>
import { closeNowTag, formatDate } from "@/libs/util";
import {
  commonBrandInfos,
  commonBreedInfos,
  commonMaterialInfos
} from "@/api/common";
import { InventoryInQueryEnterItem } from "@/api/warehouse";
export default {
  name: "WarehouseRegister",
  data() {
    return {
      inputDate: [],
      params: {
        brandName: "",
        breedName: "",
        code: "",
        inCode: "",
        inEnterId: "",
        materialName: "",
        brandCode: "",
        breedCode: "",
        materialCode: "",
        specName:"",
        type:"",
        inventoryType:""
      },
      searchParams: {
        startTime: "",
        endTime: "",
        brandName: "",
        breedName: "",
        code: "",
        inCode: "",
        inEnterId: "",
        materialName: "",
        specName:"",
        type:"",
        inventoryType:""
      },
      pageSize: 10,
      pageNum: 1,
      pageSizeOpts: [10, 15, 20, 40, 50, 100],
      total: 100,
      factoryList: [],
      breedList: [],
      materialList: [],
      statusList: [
        {
          value: "1",
          label: "待审核"
        },
        {
          value: "2",
          label: "审核通过"
        },
        {
          value: "3",
          label: "审核不通过"
        },
        {
          value: "4",
          label: "已删除"
        }
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
      clList: [],
      tableData: [],
      tableColumns: [
        {
          title: "入库单号",
          key: "inCode",
          align: "left",
          minWidth: 140
        },
        {
          title: "编号",
          key: "id",
          align: "left",
          minWidth: 80
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
          minWidth: 120
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
          minWidth: 100
        },
        {
          title: "货物类型",
          key: "type",
          align: "left",
          minWidth: 80,
          render: (h, data) => {
            var type = "";
            if (data.row.type == "0") {
              type = "原料";
            } else if (data.row.type == "1") {
              type = "成品";
            }
            return h("span", type);
          }
        },
        {
          title: "材料类型",
          key: "inventoryType",
          align: "left",
          minWidth: 80,
          render: (h, data) => {
            var inventoryType = "";
            if (data.row.inventoryType == "0") {
              inventoryType = "原材";
            } else if (data.row.inventoryType == "1") {
              inventoryType = "余卷";
            } else if (data.row.inventoryType == "2") {
              inventoryType = "分条料";
            } else if (data.row.inventoryType == "3") {
              inventoryType = "开平板";
            }
            return h("span", inventoryType);
          }
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
          title: "数量(件)",
          key: "number",
          align: "right",
          minWidth: 100
        },
        {
          title: "单件重量(吨)",
          key: "perAmount",
          align: "right",
          minWidth: 100
        },
        {
          title: "总重量(吨)",
          key: "weight",
          align: "right",
          minWidth: 100
        },
        {
          title: "计重方式",
          key: "weightType",
          align: "left",
          minWidth: 100,
          render: (h, data) => {
            var statusTest = "";
            if (data.row.weightType == "0") {
              statusTest = "抄码";
            } else if (data.row.weightType == "1") {
              statusTest = "过磅";
            } else if (data.row.weightType == "2") {
              statusTest = "理重";
            }
            return h("span", statusTest);
          }
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
      checkedRow: [],
      itemsNumber: "",
      itemsWeight: ""
    };
  },
  mounted() {
    this.inputDate = this.resetDate();
    this.getList();
    this.getBrandList();
    this.getBreedList();
  },
  methods: {
    resetDate() {
      let now = new Date(); //当前日期
      let nowDayOfWeek = now.getDay(); //今天本周的第几天
      let nowDay = now.getDate(); //当前日
      let nowMonth = now.getMonth(); //当前月
      let nowYear = now.getFullYear(); //当前年
      let queryBeginDate = new Date(
        nowYear,
        nowMonth,
        nowDay - nowDayOfWeek + 1
      );
      let queryEndDate = new Date(nowYear, nowMonth, nowDay);
      this.searchParams.startTime = formatDate(queryBeginDate);
      this.searchParams.endTime = formatDate(queryEndDate);
      return [queryBeginDate, queryEndDate];
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
    changeBrand(option) {
      if (option) {
        this.params.brandName = option.label;
      }else{
        this.params.brandName = "";
      }
    },
    changeMaterial(option) {
      if (option) {
        this.params.materialName = option.label;
      }else{
        this.params.materialName = "";
      }
    },
    changeBreed(option) {
      if (option) {
        this.params.breedName = option.label;
        const breedCode = option.value;
        commonMaterialInfos({
          breedCode: breedCode
        }).then(res => {
          if (res.data.code == "200") {
            this.materialList = res.data.data;
          } else {
            this.$Message.error(res.data.msg);
          }
        });
      }else{
        this.params.breedName = "";
      }
    },
    changeHW(value){
      this.params.inventoryType = "";
      if(value == '0'){
        this.clList = [
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
        this.clList = [
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
        this.clList = []
      }
    },
    reset() {
      this.inputDate = this.resetDate();
      this.materialList = [];
      this.clList = [];
      this.params = {
        brandName: "",
        breedName: "",
        code: "",
        inCode: "",
        inEnterId: "",
        materialName: "",
        specName:"",
        brandCode: "",
        breedCode: "",
        materialCode: "",
        type:"",
        inventoryType:""
      };
    },
    search() {
      this.searchParams.startTime = formatDate(this.inputDate[0]);
      this.searchParams.endTime = formatDate(this.inputDate[1]);
      this.searchParams.inCode = this.params.inCode;
      this.searchParams.brandName = this.params.brandName;
      this.searchParams.breedName = this.params.breedName;
      this.searchParams.code = this.params.code;
      this.searchParams.inEnterId = this.params.inEnterId;
      this.searchParams.materialName = this.params.materialName;
      this.searchParams.specName = this.params.specName;
      this.searchParams.type = this.params.type;
      this.searchParams.inventoryType = this.params.inventoryType;
      this.pageChange(1);
    },
    getList() {
      const para = {
        startTime: this.searchParams.startTime,
        endTime: this.searchParams.endTime,
        brandName: this.searchParams.brandName,
        breedName: this.searchParams.breedName,
        code: this.searchParams.code,
        inCode: this.searchParams.inCode,
        inEnterId: this.searchParams.inEnterId,
        materialName: this.searchParams.materialName,
        specName:this.searchParams.specName,
        type:this.searchParams.type,
        inventoryType:this.searchParams.inventoryType,
        numPerPage: this.pageSize,
        pageNo: this.pageNum
      };
      InventoryInQueryEnterItem(para).then(res => {
        if (res.data.code == "200") {
          const data =
            res.data.data && res.data.data.pagination
              ? res.data.data.pagination
              : null;
          this.tableData = data ? data.recordList : [];
          this.total = data ? data.totalCount : 0;
          this.itemsNumber =
            res.data.data && res.data.data.itemsNumber
              ? res.data.data.itemsNumber
              : 0;
          this.itemsWeight =
            res.data.data && res.data.data.itemsWeight
              ? res.data.data.itemsWeight
              : 0;
        } else {
          this.$Message.error(res.data.msg);
        }
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
    backFun() {
      closeNowTag(this.$store.state.app, this.$route);
      this.$router.push({
        path: "WarehouseRegister"
      });
    }
  }
};
</script>



