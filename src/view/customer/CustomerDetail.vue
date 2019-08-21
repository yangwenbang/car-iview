<template>
    <div class="white-bg">
        <Row class="margin-bottom-10">
            <Col span="24">
            <div class="pull-left table-title">基本信息</div>
            </Col>
        </Row>
        <div v-if="infor.companyType == '0'">
            <div class="table-scrollable left-right-table">
                <table border="1">
                    <tbody>
                        <tr>
                            <td class="left-bg">客户类型：</td>
                            <td>{{infor.companyType == '0' ? '企业' : infor.companyType == '1' ? '业务部门' : infor.companyType == '2' ? '子公司' : infor.companyType == '3' ? '个人' : ''}}</td>
                            <td class="left-bg">客户名称：</td>
                            <td>{{infor.customerName}}</td>
                        </tr>
                        <tr>
                            <td class="left-bg">客户简称：</td>
                            <td>{{infor.customerShortName}}</td>
                            <td class="left-bg">协议起止时间：</td>
                            <td>{{infor.protocolStartDate}}-{{infor.protocolEndDate}}</td>
                        </tr>
                        <tr>
                            <td class="left-bg">公司成立时间：</td>
                            <td>{{infor.foundDate}}</td>
                            <td class="left-bg">统一社会信用代码号：</td>
                            <td>{{infor.creditCode}}</td>
                        </tr>
                        <tr>
                            <td class="left-bg">公司注册地址：</td>
                            <td>{{infor.registerProvince}}{{infor.registerCity}}{{infor.registerArea}}{{infor.registerAddress}}</td>
                            <td class="left-bg">公司地址：</td>
                            <td>{{infor.province}}{{infor.city}}{{infor.area}}{{infor.address}}</td>
                        </tr>
                        <tr>
                            <td class="left-bg">公司电话：</td>
                            <td>{{infor.phone}}</td>
                            <td class="left-bg">企业传真：</td>
                            <td>{{infor.fax}}</td>
                        </tr>
                        <tr>
                            <td class="left-bg">是否允许月结：</td>
                            <td>{{infor.isMonthSettle==0 ? "否" : "是"}}</td>
                            <td class="left-bg"></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <Row class="margin-top-20 margin-bottom-10">
                <Col span="24">
                <div class="pull-left table-title">开票信息</div>
                </Col>
            </Row>
            <div class="table-scrollable left-right-table">
                <table border="1">
                    <tbody>
                        <tr>
                            <td class="left-bg">开户银行：</td>
                            <td>{{infor.openBank}}</td>
                            <td class="left-bg">开户行所在地：</td>
                            <td>{{infor.openBankProvince}}{{infor.openBankCity}}{{infor.openBankArea}}</td>
                        </tr>
                        <tr>
                            <td class="left-bg">开户行网点名称：</td>
                            <td>{{infor.openBankPoint}}</td>
                            <td class="left-bg">银行账号：</td>
                            <td>{{infor.openBankAccount}}</td>
                        </tr>
                        <tr>
                            <td class="left-bg">纳税人类型：</td>
                            <td>{{infor.taxPayType == '0' ? '一般纳税人' : infor.taxPayType == '1' ? '小规模纳税人' : infor.taxPayType == '2' ? '非增值税纳税人' : ''}}</td>
                            <td class="left-bg">纳税人识别号：</td>
                            <td>{{infor.taxPayNumber}}</td>
                        </tr>
                        <tr>
                            <td class="left-bg">开票地址：</td>
                            <td>{{infor.invocieProvince}}{{infor.invocieCity}}{{infor.invocieArea}}{{infor.invocieAddress}}</td>
                            <td class="left-bg">发票邮寄地址：</td>
                            <td>{{infor.invocieSendProvince}}{{infor.invocieSendCity}}{{infor.invocieSendArea}}{{infor.invocieSendAddress}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <Row class="margin-top-20 margin-bottom-10">
                <Col span="24">
                <div class="pull-left table-title">法人信息</div>
                </Col>
            </Row>
            <div class="table-scrollable left-right-table">
                <table border="1">
                    <tbody>
                        <tr>
                            <td class="left-bg">法人姓名：</td>
                            <td>{{infor.corporate}}</td>
                            <td class="left-bg">法人身份证号：</td>
                            <td>{{infor.corporateCard}}</td>
                        </tr>
                        <tr>
                            <td class="left-bg">法人联系电话：</td>
                            <td>{{infor.corporatePhone}}</td>
                            <td class="left-bg"></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <Row class="margin-top-20 margin-bottom-10">
                <Col span="24">
                <div class="pull-left table-title">联系人信息</div>
                </Col>
            </Row>
            <div class="table-scrollable left-right-table">
                <table border="1">
                    <tbody>
                        <tr>
                            <td class="left-bg">联系人：</td>
                            <td>{{infor.customerContracts ? infor.customerContracts[0].contract : ""}}</td>
                            <td class="left-bg">联系人手机：</td>
                            <td>{{infor.customerContracts ? infor.customerContracts[0].contractPhone : ""}}</td>
                        </tr>
                        <tr>
                            <td class="left-bg">联系人座机：</td>
                            <td>{{infor.customerContracts ? infor.customerContracts[0].contractCallAreaNumber : ""}}-{{infor.customerContracts ? infor.customerContracts[0].contractCallNumber : ""}}-{{infor.customerContracts ? infor.customerContracts[0].contractCornette : ""}}</td>
                            <td class="left-bg">联系人QQ：</td>
                            <td>{{infor.customerContracts ? infor.customerContracts[0].contractQQ : ""}}</td>
                        </tr>
                        <tr>
                            <td class="left-bg">财务联系人：</td>
                            <td>{{infor.customerContracts ? infor.customerContracts[0].financeContract : ""}}</td>
                            <td class="left-bg">财务联系人手机：</td>
                            <td>{{infor.customerContracts ? infor.customerContracts[0].financeContractPhone : ""}}</td>
                        </tr>
                        <tr>
                            <td class="left-bg">财务联系人座机：</td>
                            <td>{{infor.customerContracts ? infor.customerContracts[0].financeContractCallAreaNumber : ""}}-{{infor.customerContracts ? infor.customerContracts[0].financeContractCallNumber : ""}}-{{infor.customerContracts ? infor.customerContracts[0].financeContractCornette : ""}}</td>
                            <td class="left-bg">财务联系人QQ：</td>
                            <td>{{infor.customerContracts ? infor.customerContracts[0].financeContractQQ : ""}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <Row class="margin-top-20 margin-bottom-10">
                <Col span="24">
                <div class="pull-left table-title">公司证件</div>
                </Col>
            </Row>
            <Row class="margin-top-10">
                <Col :span="24">
                <div class="clearfix">
                    <div class="demo-upload-content" v-for="(item,index) in uploadList" :key="index">
                        <div class="demo-upload-list">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                            </div>
                        </div>
                        <div class="desc-content">
                            <span>描述：{{item.desc}}</span>
                        </div>
                    </div>
                </div>
                <Modal title="查看图片" v-model="visible">
                    <img :src="imgName" v-if="visible" style="width: 100%">
                </Modal>
                </Col>
            </Row>
        </div>
        <div v-if="infor.companyType == '3'">
           <div class="table-scrollable left-right-table">
                <table border="1">
                    <tbody>
                        <tr>
                            <td class="left-bg">客户类型：</td>
                            <td>{{infor.companyType == '0' ? '企业' : infor.companyType == '1' ? '业务部门' : infor.companyType == '2' ? '子公司' : infor.companyType == '3' ? '个人' : ''}}</td>
                            <td class="left-bg">客户姓名：</td>
                            <td>{{infor.customerName}}</td>
                        </tr>
                        <tr>
                            <td class="left-bg">身份证号码：</td>
                            <td>{{infor.corporateCard}}</td>
                            <td class="left-bg">手机号：</td>
                            <td>{{infor.customerContracts ? infor.customerContracts[0].contractPhone : ""}}</td>
                        </tr>
                        <tr>
                            <td class="left-bg">座机：</td>
                            <td>{{infor.customerContracts ? infor.customerContracts[0].contractCallAreaNumber : ""}}-{{infor.customerContracts ? infor.customerContracts[0].contractCallNumber : ""}}-{{infor.customerContracts ? infor.customerContracts[0].contractCornette : ""}}</td>
                            <td class="left-bg">传真：</td>
                            <td>{{infor.fax}}</td>
                        </tr>
                        <tr>
                            <td class="left-bg">QQ：</td>
                            <td>{{infor.customerContracts ? infor.customerContracts[0].contractQQ : ""}}</td>
                            <td class="left-bg">协议起止时间：</td>
                            <td>{{infor.protocolStartDate}}-{{infor.protocolEndDate}}</td>
                        </tr>
                        <tr>
                            <td class="left-bg">是否允许月结：</td>
                            <td>{{infor.isMonthSettle==0 ? "否" : "是"}}</td>
                            <td class="left-bg"></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div> 
        </div>
        <Row class="margin-top-20 margin-bottom-10">
            <Col span="24">
            <div class="pull-left table-title">日志</div>
            </Col>
        </Row>
        <div class="table-scrollable left-right-table">
            <table border="1">
                <tbody>
                    <tr>
                        <td class="left-bg">提交时间：</td>
                        <td>{{infor.createTime}}</td>
                        <td class="left-bg">提交人：</td>
                        <td>{{infor.creator}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import { closeNowTag } from "@/libs/util";
import { showCustomer } from "@/api/customer";
export default {
  name: "CustomerAudit",
  data() {
    return {
      result: "",
      params: {
        result: "审核通过",
        desc: ""
      },
      imgName: "",
      visible: false,
      uploadList: [],
      infor: {}
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      showCustomer({
        customerId: this.$route.query.id
      }).then(res => {
        const data = res.data;
        if (data.code == "200") {
          this.infor = data.data;
          if(data.data.businessLicense){
              this.uploadList.push({
                name: "",
                url: "//mfs.banksteel.com/" + data.data.businessLicense,
                desc: "三证合一"
              });
          }
          
          const threeLicense3 = data.data.threeLicense ? data.data.threeLicense.split(",") : [];
            for(var i=0;i<threeLicense3.length;i++){
                if(i == 0){
                    this.uploadList.push({
                        name: "",
                        url: "//mfs.banksteel.com/" + threeLicense3[i],
                        desc: "企业营业执照"
                    });
                }else if(i == 1){
                    this.uploadList.push({
                        name: "",
                        url: "//mfs.banksteel.com/" + threeLicense3[i],
                        desc: "组织机构代码证"
                    });
                }else if(i == 2){
                    this.uploadList.push({
                        name: "",
                        url: "//mfs.banksteel.com/" + threeLicense3[i],
                        desc: "税务登记证"
                    });
                }
            }
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    handleView(name) {
      this.imgName = name;
      this.visible = true;
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


