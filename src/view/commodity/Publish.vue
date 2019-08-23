<template>
  <div>
    <div class="header">
      <div style="display: inline-block;height: 118px;vertical-align: middle;">
        <img src="../../assets/images/v2_pvwezc.png" width="118px" height="118px">
      </div>
      <span class="header-item">&nbsp;•&nbsp;商家版</span>
    </div>
    <div class="header-logo">
      <img src="../../assets/images/v2_pvwxm2.png" width="484px" height="488px">
    </div>
    <div class="content">
       <Form :label-width="200" class="search-form" ref="commodityform" :model="formValidate" :rules="ruleValidate">
        <div class="table-title">基本信息</div>
        <hr class="line">
        <Row type="flex" justify="space-between">
          <Col :sm="12" :xs="24">
            <FormItem label="客户类型:" prop="companyType">
              <Select v-model="formValidate.companyType">
                <Option value="0">企业</Option>
                <Option value="1">个人</Option>
              </Select>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="客户名称:" prop="customerName">
              <Input v-model="formValidate.customerName" :maxlength="30"></Input>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="客户简称:" prop="customerShortName">
              <Input v-model="formValidate.customerShortName" :maxlength="20"></Input>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="协议起止时间:">
              <DatePicker
                v-model="formValidate.protocolStartDate"
                type="daterange"
                placement="bottom-end"
              ></DatePicker>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="公司成立日期:">
              <DatePicker
                v-model="formValidate.foundDate"
                type="date"
                separator="/"
                placement="bottom-end"
              ></DatePicker>
            </FormItem>
          </Col>
        </Row>
        <div class="text-center margin-top-10">
          <Button type="primary" class="btn-common-width">保存</Button>
          <Button class="btn-common-width margin-left-10">取消</Button>
        </div>
      </Form>
    </div>
  </div>
</template>
<script>
export default {
  name: "Publish",
  components: {},
  data() {
    return {
      formValidate: {
        customerName: "",
        customerShortName: "",
        creditCode: "",
        foundDate: "", //公司成立日期
        registLocal: [], //公司注册所在地
        registerAddress: "", //公司注册详细地址
        local: [], //公司地址
        protocolStartDate: [], //协议起止时间
        address: "", //公司详细地址
        phone: "", //公司电话
        fax: "", //公司传真
        companyType: "0", //客户类型
        openBank: "", //开户银行
        openBankAddress: [], //开户行所在地
        openBankPoint: "", //开户行网点名称
        openBankAccount: "", //银行账号
        taxPayType: "", //纳税人类型
        taxPayNumber: "", //纳税人识别号
        ticketAddress: [], //开票地址
        invocieAddress: "", //开票详细地址
        corporate: "", //法人姓名
        corporateCard: "", //法人身份证号码
        corporatePhone: "", //法人联系电话
        contract: "", //业务联系人
        contractPhone: "", //业务联系人手机
        contractCallAreaNumber: "", //业务联系人座机区号
        contractCallNumber: "", //业务联系人座机号
        contractCornette: "", //业务联系人短号
        contractQQ: "", //联系人QQ
        financeContract: "", //财务联系人
        financeContractPhone: "", //财务联系人手机
        financeContractCallAreaNumber: "", //财务联系人座机区号
        financeContractCallNumber: "", //财务联系人座机号
        financeContractCornette: "", //财务联系人短号
        financeContractQQ: "", //财务联系人QQ
        sendAddress: [], //开票邮寄地址
        invocieSendAddress: "", //开票邮寄详细地址
        isMonthSettle: ""
      },
      ruleValidate: {
        isMonthSettle: [
          {
            required: true,
            message: "请选择是否支持月结",
            trigger: "change",
            type: "number"
          }
        ],
        customerName: [
          {
            required: true,
            message: "请填写公司名称",
            trigger: "change"
          }
        ],
        customerShortName: [
          {
            required: true,
            message: "请填写公司简称",
            trigger: "change"
          }
        ],
        creditCode: [
          {
            required: true,
            message: "请填写统一社会信用代码号",
            trigger: "change"
          }
        ],
        companyType: [
          {
            required: true,
            message: "请选择企业属性",
            trigger: "change"
          }
        ],
        contract: [
          {
            required: true,
            message: "请填写联系人姓名",
            trigger: "change"
          }
        ],
        contractPhone: [
          {
            required: true,
            message: "请填写联系人手机",
            trigger: "change"
          }
        ]
      },
      personruleValidate: {
        isMonthSettle: [
          {
            required: true,
            message: "请选择是否支持月结",
            trigger: "change",
            type: "number"
          }
        ],
        userType: [
          {
            required: true,
            message: "请选择客户类型",
            trigger: "change"
          }
        ],
        customerName: [
          {
            required: true,
            message: "请填写客户姓名",
            trigger: "change"
          }
        ],
        corporateCard: [
          {
            required: true,
            message: "请填写身份证号码",
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {},
  mounted() {},
  methods: {}
};
</script>
<style lang="less" scoped>
.panel .tr {
  position: relative;
}

.panel .tip {
  position: absolute;
  left: 12px;
  font-size: 12px;
  color: #c6303e;
  text-align: left;
  margin: 5px auto;
  width: 250px;
}

.panel .not {
  background-color: rgba(49, 195, 166, 0.5);
  cursor: not-allowed;
}

.header {
  padding: 0 30px;
  text-align: left;
  height: 118px;
  margin: 30px 0;

  .header-item {
    vertical-align: middle;
    font-family: SourceHanSansSC-regular;
    font-size: 18px;
    color: #101010;
  }
}

.header-logo {
  position: relative;
  display: inline-block;
  height: 285px;
  width: 100%;
  background: rgba(251, 198, 71, 1);
}

.header-logo img {
  position: absolute;
  left: 50%;
  top: -150px;
  margin-left: -245px;
}

.content {
  margin: 30px 0;
}

.panel /deep/ input {
  border-radius: 5px !important;
}

.tr-radio {
  padding: 10px;
}

.tr-span {
  position: absolute;
  left: 5px;
  top: 8px;
}
</style>
