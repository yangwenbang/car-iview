<template>
  <div class="white-bg">
    <div class="table-scrollable left-right-table">
      <table border="1">
        <tbody>
          <tr>
            <td class="left-bg">入库单号：</td>
            <td>{{inEnterList.inCode}}</td>
            <td class="left-bg">入库仓库：</td>
            <td>{{$store.state.user.warehouse.warehouseName}}</td>
            <td class="left-bg">入库日期：</td>
            <td>{{inEnterList.inTime | formatDate}}</td>
          </tr>
          <tr>
            <td class="left-bg">货主：</td>
            <td>{{inEnterList.ownerName}}</td>
            <td class="left-bg">货主联系人：</td>
            <td>{{inEnterList.ownerContract}}</td>
            <td class="left-bg">货主联系人手机号：</td>
            <td>{{inEnterList.ownerContract}}</td>
          </tr>
          <tr>
            <td class="left-bg">货主通知单号：</td>
            <td>{{inEnterList.ownerNoticeCode}}</td>
            <td class="left-bg">送货车号：</td>
            <td>{{inEnterList.carNumber}}</td>
            <td class="left-bg">送货人：</td>
            <td>{{inEnterList.carContract}}</td>
          </tr>
          <tr>
            <td class="left-bg">送货电话：</td>
            <td>{{inEnterList.carPhone}}</td>
            <td class="left-bg">收货人：</td>
            <td>{{inEnterList.receiveName}}</td>
            <td class="left-bg">吊车工：</td>
            <td>
              <span v-for="(item,index) in cranemanWorkers" :key="index">
                <span v-if="index > 0"> / </span>{{item.employeeName}}</span>
            </td>
          </tr>
          <tr>
            <td class="left-bg">装卸工：</td>
            <td>
              <span v-for="(item,index) in stevedoreWorkers" :key="index">
                <span v-if="index > 0"> / </span>{{item.employeeName}}</span>
            </td>
            <td class="left-bg">备注：</td>
            <td colspan="3">{{inEnterList.remark}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <Row class="margin-top-20 margin-bottom-10">
      <Col span="24">
      <div class="pull-left table-title">入库单明细</div>
      <div class="pull-right count-content">
        <span class="margin-right-10">货物数量：
          <b class="tip">{{inEnterList.number}}</b> 件</span>
        <span class="margin-right-10">货物重量：
          <b class="tip">{{inEnterList.weight | formatWeight}}</b> 吨</span>
      </div>
      </Col>
    </Row>
    <Table :columns="tableColumns" :data="inEnterItems" border></Table>
    <!-- <Row class="margin-top-20 margin-bottom-10">
      <Col span="24">
      <div class="pull-left table-title">入库单审核记录</div>
      </Col>
    </Row>
    <div class="table-scrollable left-right-table">
      <table border="1">
        <tbody>
          <tr>
            <td class="left-bg">制单时间：</td>
            <td>{{inEnterList.createTime | formatSeconds}}</td>
            <td class="left-bg">制单人：</td>
            <td>{{inEnterList.creator}}</td>
            <td class="left-bg"></td>
            <td></td>
          </tr>
          <tr>
            <td class="left-bg">审核时间：</td>
            <td>{{inEnterList.auditTime | formatSeconds}}</td>
            <td class="left-bg">审核人：</td>
            <td>{{inEnterList.auditName}}</td>
            <td class="left-bg">审核结果：</td>
            <td>
              <Tag color="green">审核通过</Tag>
            </td>
          </tr>
        </tbody>
      </table>
    </div> -->
    <div class="text-center margin-top-20">
      <!-- <Button class="btn-common-width margin-right-10" type="primary" @click="submitFun">审核</Button> -->
      <Button class="btn-common-width" type="info" @click="printFun">打印</Button>
      <!-- <Button class="btn-common-width margin-right-10" type="error" @click="removeFun">删除</Button> -->
      <Button class="btn-common-width margin-left-10" @click="backFun">返回</Button>
    </div>
  </div>
</template>
<script>
import { InventoryInEnterInfo,InventoryInAuditInEnter } from "@/api/warehouse";
import { closeNowTag,isAcrobatPluginInstall } from "@/libs/util";
export default {
  name: "WarehouseRegisterDetail",
  data() {
    return {
      cranemanWorkers: [], //(Array[员工信息列表], optional): 吊车工 ,
      inEnterItems: [], //(Array[入库登记明细], optional): 入库登记明细列表 ,
      inEnterList: {}, //(入库登记, optional): 入库登记信息
      stevedoreWorkers: [], //(Array[员工信息列表], optional): 装卸工
      tableColumns: [
        {
          title: "编号",
          key: "code",
          align: "left",
          minWidth: 80
        },
        {
          title: "产地",
          key: "brandName",
          align: "left",
          minWidth: 80
        },
        {
          title: "品名",
          key: "breedName",
          align: "left",
          minWidth: 80
        },
        {
          title: "材质",
          key: "materialName",
          align: "left",
          minWidth: 80
        },
        {
          title: "规格",
          key: "specName",
          align: "left",
          minWidth: 80
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
          minWidth: 80
        },
        {
          title: "库位",
          key: "storagePlace",
          align: "left",
          minWidth: 80
        },
        {
          title: "数量(件)",
          key: "number",
          align: "right",
          minWidth: 80
        },
        {
          title: "单件重量(吨)",
          key: "perAmount",
          align: "right",
          minWidth: 80
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
          minWidth: 80,
          render: (h, data) => {
            var weightType = "";
            if (data.row.weightType == "0") {
              weightType = "抄码";
            } else if (data.row.weightType == "1") {
              weightType = "过磅";
            } else if (data.row.weightType == "2") {
              weightType = "理计";
            }
            return h("span", weightType);
          }
        },
        {
          title: "钢卷号/捆包号",
          key: "baleNumber",
          align: "left",
          minWidth: 80
        },
        {
          title: "包装",
          key: "wrap",
          align: "left",
          minWidth: 80,
          tooltip: true,
          ellipsis: true
        },
        {
          title: "外观",
          key: "appearance",
          align: "left",
          minWidth: 80,
          tooltip: true,
          ellipsis: true
        }
      ]
    };
  },
  mounted() {
    this.getList();
  },
  // activated(){
  //   this.getList();
  // },
  methods: {
    printFun(){
      var result = isAcrobatPluginInstall()
      if(result){
         window.open('/api/pwms/inventory/in/printInEnter?inEnterListId='+this.$route.query.inEnterId );
      }
     
    },
    getList() {
      InventoryInEnterInfo({
        inEnterId:this.$route.query.inEnterId
      }).then(res => {
        if(res.data.code == "200"){
            let data = res.data.data;
            this.cranemanWorkers =
              data && data.cranemanWorkers ? data.cranemanWorkers : [];
            this.inEnterItems = data && data.inEnterItems ? data.inEnterItems : [];
            this.inEnterList = data && data.inEnterList ? data.inEnterList : {};
            this.stevedoreWorkers =
              data && data.stevedoreWorkers ? data.stevedoreWorkers : [];
        }else{
            this.$Message.error(res.data.msg);
        }
      });
    },
    // submitFun() {
    //   this.$router.push({
    //     path: "WarehouseRegisterAudit"
    //   });
    // },
    // removeFun() {
    //   this.$Modal.confirm({
    //     title: "提示",
    //     content: "请确认是否删除该入库单？",
    //     onOk: () => {
    //       this.$Message.success({
    //         content: "删除成功!",
    //         duration: 1
    //       });
    //       setTimeout(() => {
    //         closeNowTag(this.$store.state.app, this.$route);
    //         this.$router.push({
    //           path: "WarehouseRegister"
    //         });
    //       }, 1000);
    //     },
    //     onCancel: () => {}
    //   });
    // },
    backFun() {
      closeNowTag(this.$store.state.app, this.$route);
      this.$router.push({
        path: "WarehouseRegister"
      });
    }
  }
};
</script>
<style>
.demo-upload-content {
  width: 120px;
  margin-right: 10px;
  float: left;
}
.ivu-upload {
  float: left;
}
.demo-upload-list {
  display: inline-block;
  width: 120px;
  height: 120px;
  text-align: center;
  line-height: 120px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
.link-more {
  float: left;
  width: 120px;
  height: 120px;
  text-align: center;
  line-height: 120px;
  border: 1px solid transparent;
  border-radius: 4px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
}
</style>


