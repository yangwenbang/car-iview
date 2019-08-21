<template>
  <div class="white-bg">
    <div class="userinfo">
      <Row type="flex" justify="space-around">
        <Col :sm="8" :xs="24">
          <span>加工商名称：{{supplierName}}</span>
        </Col>
        <Col :sm="8" :xs="24">
          <span>仓库：{{$store.state.user.warehouse.warehouseName}}</span>
        </Col>
      </Row>
    </div>
    <div class="compony-type" v-show="formValidate.companyType==0">
      <Form
        :label-width="200"
        class="search-form"
        ref="formValidate"
        :model="formValidate"
        :rules="ruleValidate"
      >
        <div class="table-title">基本信息</div>
        <hr class="line">
        <Row type="flex" justify="space-between">
          <Col :sm="12" :xs="24">
            <FormItem label="客户类型:" prop="companyType">
              <Select v-model="formValidate.companyType">
                <!-- <Option v-for="item in usetatusList" :value="item.value" :key="item.value">{{ item.label }}</Option> -->
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
          <Col :sm="12" :xs="24">
            <FormItem label="统一社会信用代码号:" prop="creditCode">
              <Input v-model="formValidate.creditCode"></Input>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="公司注册地址:">
              <al-cascader v-model="formValidate.registLocal" level="2"/>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="公司注册详细地址:">
              <Input v-model="formValidate.registerAddress" :maxlength="60"></Input>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="公司地址:">
              <al-cascader v-model="formValidate.local" level="2"/>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="公司详细地址:" prop="address">
              <Input v-model="formValidate.address" :maxlength="60"></Input>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="公司电话:">
              <Input v-model="formValidate.phone" :maxlength="30"></Input>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="公司传真:">
              <Input v-model="formValidate.fax" :maxlength="30"></Input>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="是否允许月结:" prop="isMonthSettle">
              <RadioGroup v-model="formValidate.isMonthSettle">
                <Radio :label="1">是</Radio>
                <Radio :label="0">否</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <div class="table-title">开票信息</div>
        <hr class="line">
        <Row type="flex" justify="space-between">
          <Col :sm="12" :xs="24">
            <FormItem label="开户银行:">
              <Select
                v-model="formValidate.openBank"
                filterable
                clearable
                remote
                :remote-method="getBankList"
                @on-clear="getBankList('')"
              >
                <Option
                  v-for="(item,index) in openBankList"
                  :value="item.bankName"
                  :key="index"
                >{{ item.bankName }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="开户行所在地:">
              <al-cascader v-model="formValidate.openBankAddress" level="1"/>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="开户行网点名称:">
              <Input v-model="formValidate.openBankPoint"></Input>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="银行账号:">
              <Input v-model="formValidate.openBankAccount" :maxlength="30"></Input>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="纳税人类型:">
              <Select v-model="formValidate.taxPayType" filterable clearable>
                <Option
                  v-for="(item,index) in taxPayTypeList"
                  :value="item.value"
                  :key="index"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="纳税人识别号:">
              <Input v-model="formValidate.taxPayNumber" :maxlength="30"></Input>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="开票地址:">
              <al-cascader v-model="formValidate.ticketAddress" level="2"/>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="开票详细地址:">
              <Input v-model="formValidate.invocieAddress" :maxlength="60"></Input>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="发票邮寄地址:">
              <al-cascader v-model="formValidate.sendAddress" level="2"/>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="发票邮寄详细地址:">
              <Input v-model="formValidate.invocieSendAddress"></Input>
            </FormItem>
          </Col>
        </Row>
        <div class="table-title">法人信息</div>
        <hr class="line">
        <Row type="flex" justify="space-between">
          <Col :sm="12" :xs="24">
            <FormItem label="法人姓名:">
              <Input v-model="formValidate.corporate" :maxlength="30"></Input>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="法人身份证号:">
              <Input v-model="formValidate.corporateCard" :maxlength="30"></Input>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="法人联系电话:">
              <Input v-model="formValidate.corporatePhone" :maxlength="20"></Input>
            </FormItem>
          </Col>
        </Row>
        <div class="table-title">联系人信息</div>
        <hr class="line">
        <Row type="flex" justify="space-between">
          <Col :sm="12" :xs="24">
            <FormItem label="联系人:" prop="contract">
              <Input v-model="formValidate.contract" :maxlength="30"></Input>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="联系人手机:" prop="contractPhone">
              <Input v-model="formValidate.contractPhone" :maxlength="20"></Input>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="联系人座机:">
              <Row type="flex" justify="space-between" flex-der>
                <Col :sm="7" :xs="24">
                  <Input
                    placeholder="区号"
                    v-model="formValidate.contractCallAreaNumber"
                    :maxlength="10"
                  ></Input>
                </Col>-
                <Col :sm="7" :xs="24">
                  <Input
                    placeholder="座机号"
                    v-model="formValidate.contractCallNumber"
                    :maxlength="10"
                  ></Input>
                </Col>-
                <Col :sm="7" :xs="24">
                  <Input placeholder="短号" v-model="formValidate.contractCornette" :maxlength="10"></Input>
                </Col>
              </Row>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="联系人QQ:">
              <Input v-model="formValidate.contractQQ" :maxlength="20"></Input>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="财务联系人:">
              <Input v-model="formValidate.financeContract" :maxlength="30"></Input>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="财务联系人手机:">
              <Input v-model="formValidate.financeContractPhone" :maxlength="20"></Input>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="财务联系人座机:">
              <Row type="flex" justify="space-between" flex-der>
                <Col :sm="7" :xs="24">
                  <Input
                    placeholder="区号"
                    v-model="formValidate.financeContractCallAreaNumber"
                    :maxlength="10"
                  ></Input>
                </Col>-
                <Col :sm="7" :xs="24">
                  <Input
                    placeholder="座机号"
                    v-model="formValidate.financeContractCallNumber"
                    :maxlength="10"
                  ></Input>
                </Col>-
                <Col :sm="7" :xs="24">
                  <Input
                    placeholder="短号"
                    v-model="formValidate.financeContractCornette"
                    :maxlength="10"
                  ></Input>
                </Col>
              </Row>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="财务联系人QQ:">
              <Input v-model="formValidate.financeContractQQ" :maxlength="20"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div class="table-title">公司证件</div>
      <hr class="line">
      <Tabs>
        <TabPane label="三证合一">
          <Row>
            <Col :sm="12" :xs="24">
              <Alert
                type="warning"
                show-icon
              >注: 以下照片均需加盖企业公章,请上传清晰正面图片，图片大小控制在5M内，文件格式限使用jpg，jpeg，png格式</Alert>
            </Col>
            <Col :span="24">
              <div class="clearfix">
                <div class="demo-upload-content" v-for="item in uploadList" :key="item.uid">
                  <div class="desc-content">
                    <b>企业营业执照</b>
                  </div>
                  <div class="demo-upload-list">
                    <template v-if="item.status === 'finished'">
                      <img :src="item.url">
                      <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                      </div>
                    </template>
                    <template v-else>
                      <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                    </template>
                  </div>
                </div>
                <div v-show="uploadList.length<1">
                  <div class="desc-content">
                    <b>企业营业执照</b>
                  </div>
                  <Upload
                    ref="upload"
                    :show-upload-list="false"
                    :default-file-list="defaultList"
                    :on-success="handleSuccess"
                    name="files"
                    accept=".jpg, .jpeg, .png"
                    :format="['jpg','jpeg','png']"
                    :max-size="5120"
                    :on-format-error="handleFormatError"
                    :on-exceeded-size="handleMaxSize"
                    :before-upload="handleBeforeUpload"
                    type="drag"
                    action="/api/pwms/customer/uploadFiles"
                    style="display: inline-block;width:118px;"
                  >
                    <div style="width: 118px;height:118px;line-height: 118px;">
                      <Icon type="ios-camera" size="20"></Icon>
                    </div>
                  </Upload>
                </div>
              </div>
            </Col>
          </Row>
        </TabPane>
        <TabPane label="普通三证">
          <Row>
            <Col :sm="12" :xs="24">
              <Alert
                type="warning"
                show-icon
              >注: 以下照片均需加盖企业公章,请上传清晰正面图片，图片大小控制在5M内，文件格式限使用jpg，jpeg，png格式</Alert>
            </Col>
            <Col :span="24">
              <div class="clearfix">
                <div class="demo-upload-content" v-for="item in uploadList1" :key="item.uid">
                  <div class="desc-content">
                    <b>企业营业执照</b>
                  </div>
                  <div class="demo-upload-list">
                    <template v-if="item.status === 'finished'">
                      <img :src="item.url">
                      <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemove1(item)"></Icon>
                      </div>
                    </template>
                    <template v-else>
                      <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                    </template>
                  </div>
                </div>
                <div class="pull-left margin-left-10" v-show="uploadList1.length<1">
                  <div class="desc-content">
                    <b>企业营业执照</b>
                  </div>
                  <Upload
                    ref="upload1"
                    :show-upload-list="false"
                    :on-success="handleSuccess"
                    name="files"
                    accept=".jpg, .jpeg, .png"
                    :format="['jpg','jpeg','png']"
                    :max-size="5120"
                    :on-format-error="handleFormatError"
                    :on-exceeded-size="handleMaxSize"
                    type="drag"
                    action="/api/pwms/customer/uploadFiles"
                    style="display: inline-block;width:118px;"
                  >
                    <div style="width: 118px;height:118px;line-height: 118px;">
                      <Icon type="ios-camera" size="20"></Icon>
                    </div>
                  </Upload>
                </div>

                <div class="demo-upload-content" v-for="item in uploadList2" :key="item.uid">
                  <div class="desc-content">
                    <b>组织机构代码证</b>
                  </div>
                  <div class="demo-upload-list">
                    <template v-if="item.status === 'finished'">
                      <img :src="item.url">
                      <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemove2(item)"></Icon>
                      </div>
                    </template>
                    <template v-else>
                      <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                    </template>
                  </div>
                </div>
                <div class="pull-left margin-left-10" v-show="uploadList2.length<1">
                  <div class="desc-content">
                    <b>组织机构代码证</b>
                  </div>
                  <Upload
                    ref="upload2"
                    :show-upload-list="false"
                    :on-success="handleSuccess"
                    name="files"
                    accept=".jpg, .jpeg, .png"
                    :format="['jpg','jpeg','png']"
                    :max-size="5120"
                    :on-format-error="handleFormatError"
                    :on-exceeded-size="handleMaxSize"
                    type="drag"
                    action="/api/pwms/customer/uploadFiles"
                    style="display: inline-block;width:118px;"
                  >
                    <div style="width: 118px;height:118px;line-height: 118px;">
                      <Icon type="ios-camera" size="20"></Icon>
                    </div>
                  </Upload>
                </div>

                <div class="demo-upload-content" v-for="item in uploadList3" :key="item.uid">
                  <div class="desc-content">
                    <b>税务登记证</b>
                  </div>
                  <div class="demo-upload-list">
                    <template v-if="item.status === 'finished'">
                      <img :src="item.url">
                      <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemove3(item)"></Icon>
                      </div>
                    </template>
                    <template v-else>
                      <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                    </template>
                  </div>
                </div>
                <div class="pull-left margin-left-10" v-show="uploadList3.length<1">
                  <div class="desc-content">
                    <b>税务登记证</b>
                  </div>
                  <Upload
                    ref="upload3"
                    :show-upload-list="false"
                    :on-success="handleSuccess"
                    name="files"
                    accept=".jpg, .jpeg, .png"
                    :format="['jpg','jpeg','png']"
                    :max-size="5120"
                    :on-format-error="handleFormatError"
                    :on-exceeded-size="handleMaxSize"
                    type="drag"
                    action="/api/pwms/customer/uploadFiles"
                    style="display: inline-block;width:118px;"
                  >
                    <div style="width: 118px;height:118px;line-height: 118px;">
                      <Icon type="ios-camera" size="20"></Icon>
                    </div>
                  </Upload>
                </div>
              </div>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
      <Modal title="查看图片" v-model="visible">
        <img :src="imgName" v-if="visible" style="width: 100%">
      </Modal>
      <div class="text-center margin-top-10">
        <Button
          type="primary"
          class="btn-common-width"
          @click="handleSubmit('formValidate')"
          :disabled="submitDisabled"
        >保存</Button>
        <Button class="btn-common-width margin-left-10" @click="backFun">取消</Button>
      </div>
    </div>
    <div class="personal-type" v-show="personformValidate.userType==1">
      <Form
        :label-width="200"
        class="search-form"
        ref="personformValidate"
        :model="personformValidate"
        :rules="personruleValidate"
      >
        <div class="table-title">基本信息</div>
        <hr class="line">
        <Row type="flex" justify="space-between">
          <Col :sm="12" :xs="24">
            <FormItem label="客户类型:" prop="userType">
              <Select v-model="personformValidate.userType">
                <Option value="0">企业</Option>
                <Option value="1">个人</Option>
              </Select>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="客户姓名:" prop="customerName">
              <Input v-model="personformValidate.customerName"></Input>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="身份证号码:" prop="corporateCard">
              <Input v-model="personformValidate.corporateCard"></Input>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="手机号:">
              <Input v-model="personformValidate.phone"></Input>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="座机:">
              <Row type="flex" justify="space-between" flex-der>
                <Col :sm="7" :xs="24">
                  <Input placeholder="区号" v-model="personformValidate.contractCallAreaNumber"></Input>
                </Col>-
                <Col :sm="7" :xs="24">
                  <Input placeholder="座机号" v-model="personformValidate.contractCallNumber"></Input>
                </Col>-
                <Col :sm="7" :xs="24">
                  <Input placeholder="短号" v-model="personformValidate.contractCornette"></Input>
                </Col>
              </Row>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="传真:">
              <Input v-model="personformValidate.fax"></Input>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="QQ:">
              <Input v-model="personformValidate.contractQQ"></Input>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="协议起止时间:">
              <DatePicker
                v-model="personformValidate.protocolStartDate1"
                type="daterange"
                placement="bottom-end"
              ></DatePicker>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="是否允许月结:" prop="isMonthSettle">
              <RadioGroup v-model="personformValidate.isMonthSettle">
                <Radio :label="1">是</Radio>
                <Radio :label="0">否</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <div class="text-center margin-top-10">
          <Button
            type="primary"
            class="btn-common-width"
            @click="handleSubmit('personformValidate')"
            :disabled="submitDisabled"
          >保存</Button>
          <Button class="btn-common-width margin-left-10" @click="backFun">取消</Button>
        </div>
      </Form>
    </div>
  </div>
</template>
<script>
import {
  queryBankTitle,
  saveCustomer,
  savePersonal,
  getSupplier
} from "@/api/customer";
import { closeNowTag, formatDate } from "@/libs/util";
export default {
  name: "CustomerAdd",
  components: {},
  watch: {
    "formValidate.companyType": {
      handler: function() {
        this.personformValidate.userType = this.formValidate.companyType;
      }
    },
    "personformValidate.userType": {
      handler: function() {
        this.formValidate.companyType = this.personformValidate.userType;
      }
    }
  },
  data() {
    return {
      submitDisabled: false,
      supplierName: "",
      formValidate: {
        //warehouse: "",
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
      personformValidate: {
        //个人类型
        userType: 0,
        companyType: 3, //客户类型
        customerName: "", //客户姓名
        corporateCard: "", //身份证号码
        phone: "", //手机号
        contractCallAreaNumber: "",
        contractCallNumber: "",
        contractCornette: "",
        fax: "", //传真
        contractQQ: "", //QQ
        protocolStartDate1: [], //协议起止时间
        isMonthSettle: ""
      },
      ruleValidate: {
        isMonthSettle: [
          {
            required: true,
            message: "请选择是否支持月结",
            trigger: "change",
            type: 'number'
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
        // protocolStartDate: [
        //   {
        //     required: true,
        //     message: "请填写协议起止时间",
        //     type: "array",
        //     trigger: "change",
        //     fields:{
        //       0:{
        //         required: true,
        //         type: "date",
        //         message: "请填写协议起止时间"
        //       },
        //       1:{
        //         required: true,
        //         type: "date",
        //         message: "请填写协议起止时间"
        //       }
        //     }
        //   }
        // ],
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
            type: 'number'
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
        // protocolStartDate1: [
        //   {
        //     required: true,
        //     message: "请填写协议起止时间",
        //     type: "array",
        //     trigger: "change",
        //     fields:{
        //       0:{
        //         required: true,
        //         type: "date",
        //         message: "请填写协议起止时间"
        //       },
        //       1:{
        //         required: true,
        //         type: "date",
        //         message: "请填写协议起止时间"
        //       }
        //     }
        //   }
        // ]
      },
      openBankList: [],
      taxPayTypeList: [
        { label: "一般纳税人", value: "0" },
        { label: "小规模纳税人", value: "1" },
        { label: "非增值税纳税人", value: "2" }
      ],
      defaultList: [],
      businessLicense: [],
      imgName: "",
      visible: false,
      uploadList: [],
      uploadList1: [],
      uploadList2: [],
      uploadList3: [],
      showUploadImg: false
    };
  },
  wtach: {},
  mounted() {
    this.uploadList = this.$refs.upload.fileList;
    this.uploadList1 = this.$refs.upload1.fileList;
    this.uploadList2 = this.$refs.upload2.fileList;
    this.uploadList3 = this.$refs.upload3.fileList;
    this.getBankList("");
    this.getSupplierFun();
  },
  methods: {
    getSupplierFun() {
      getSupplier().then(res => {
        if (res.data.code == "200") {
          this.supplierName = res.data.data;
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    getBankList(query) {
      queryBankTitle({
        bankTitle: query
      }).then(res => {
        if (res.data.code == "200") {
          this.openBankList = res.data.data;
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    handleView(name) {
      this.imgName = name;
      this.visible = true;
    },
    handleRemove(file) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
    },
    handleRemove1(file) {
      const fileList1 = this.$refs.upload1.fileList;
      this.$refs.upload1.fileList.splice(fileList1.indexOf(file), 1);
    },
    handleRemove2(file) {
      const fileList2 = this.$refs.upload2.fileList;
      this.$refs.upload2.fileList.splice(fileList2.indexOf(file), 1);
    },
    handleRemove3(file) {
      const fileList3 = this.$refs.upload3.fileList;
      this.$refs.upload3.fileList.splice(fileList3.indexOf(file), 1);
    },
    handleSuccess(res, file) {
      if (res.code == "200") {
        file.url = "//mfs.banksteel.com/" + res.data;
        //this.businessLicense.push(res.data);
      } else {
        this.$Message.error(res.msg);
      }

      // file.url =
      //   "https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar";
      // file.name = "7eb99afb9d5f317c912f08b5212fd69a";
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "文件上传失败",
        desc: "文件 " + file.name + " 格式不正确，请上传图片."
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "提示",
        desc: "文件  " + file.name + " 大于2M"
      });
    },
    handleBeforeUpload() {
      const check = this.uploadList.length < 2;
      if (!check) {
        this.$Notice.warning({
          title: "最多只能上传两张图片"
        });
      }
      return check;
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.submitDisabled = true;
          if (name == "formValidate") {
            this.submitFun1();
          } else {
            this.submitFun2();
          }
        } else {
          //this.$Message.error("提交失败");
        }
      });
    },
    submitFun1() {
      let businessLicense = this.uploadList.map(item => {
        if (item.response.code == "200") {
          return item.response.data;
        } else {
          return "";
        }
      });
      let threeLicense = [];
      let threeLicense1 = this.uploadList1.map(item => {
        if (item.response.code == "200") {
          threeLicense.push(item.response.data);
          return item.response.data;
        } else {
          return "";
        }
      });
      let threeLicense2 = this.uploadList2.map(item => {
        if (item.response.code == "200") {
          threeLicense.push(item.response.data);
          return item.response.data;
        } else {
          return "";
        }
      });
      let threeLicense3 = this.uploadList3.map(item => {
        if (item.response.code == "200") {
          threeLicense.push(item.response.data);
          return item.response.data;
        } else {
          return "";
        }
      });
      //if(businessLicense.length == 1 || threeLicense.length == 3){
      saveCustomer({
        isMonthSettle: this.formValidate.isMonthSettle,
        companyType: 0, //企业类型：企业
        businessLicense: businessLicense.join(","), //企业营业执照三证合一
        threeLicense: threeLicense.join(","), //普通企业营业执照
        customerName: this.formValidate.customerName,
        customerShortName: this.formValidate.customerShortName,
        creditCode: this.formValidate.creditCode,
        foundDate: this.formValidate.foundDate
          ? formatDate(this.formValidate.foundDate)
          : "", //公司成立日期
        //registLocal: [],//公司注册所在地
        registerProvince:
          this.formValidate.registLocal.length > 0
            ? this.formValidate.registLocal[0].name
            : "",
        registerCity:
          this.formValidate.registLocal.length > 1
            ? this.formValidate.registLocal[1].name
            : "",
        registerArea:
          this.formValidate.registLocal.length > 2
            ? this.formValidate.registLocal[2].name
            : "",
        registerAddress: this.formValidate.registerAddress, //公司注册详细地址
        //local: [],//公司地址
        province:
          this.formValidate.local.length > 0
            ? this.formValidate.local[0].name
            : "",
        city:
          this.formValidate.local.length > 1
            ? this.formValidate.local[1].name
            : "",
        area:
          this.formValidate.local.length > 2
            ? this.formValidate.local[2].name
            : "",
        protocolStartDate:
          this.formValidate.protocolStartDate &&
          this.formValidate.protocolStartDate[0]
            ? formatDate(this.formValidate.protocolStartDate[0])
            : "", //协议起止时间
        protocolEndDate:
          this.formValidate.protocolStartDate &&
          this.formValidate.protocolStartDate[1]
            ? formatDate(this.formValidate.protocolStartDate[1])
            : "", //协议起止时间
        address: this.formValidate.address, //公司详细地址
        phone: this.formValidate.phone, //公司电话
        fax: this.formValidate.fax, //公司传真
        openBank: this.formValidate.openBank, //开户银行
        //openBankAddress: [],//开户行所在地
        openBankProvince:
          this.formValidate.openBankAddress.length > 0
            ? this.formValidate.openBankAddress[0].name
            : "",
        openBankCity:
          this.formValidate.openBankAddress.length > 1
            ? this.formValidate.openBankAddress[1].name
            : "",
        openBankPoint: this.formValidate.openBankPoint, //开户行网点名称
        openBankAccount: this.formValidate.openBankAccount, //银行账号
        taxPayType: this.formValidate.taxPayType
          ? parseInt(this.formValidate.taxPayType)
          : undefined, //纳税人类型
        taxPayNumber: this.formValidate.taxPayNumber, //纳税人识别号
        //ticketAddress: [],//开票地址
        invocieProvince:
          this.formValidate.ticketAddress.length > 0
            ? this.formValidate.ticketAddress[0].name
            : "",
        invocieCity:
          this.formValidate.ticketAddress.length > 1
            ? this.formValidate.ticketAddress[1].name
            : "",
        invocieArea:
          this.formValidate.ticketAddress.length > 2
            ? this.formValidate.ticketAddress[2].name
            : "",
        invocieAddress: this.formValidate.invocieAddress, //开票详细地址
        corporate: this.formValidate.corporate, //法人姓名
        corporateCard: this.formValidate.corporateCard, //法人身份证号码
        corporatePhone: this.formValidate.corporatePhone, //法人联系电话
        contract: this.formValidate.contract, //业务联系人
        contractPhone: this.formValidate.contractPhone, //业务联系人手机
        contractCallAreaNumber: this.formValidate.contractCallAreaNumber, //业务联系人座机区号
        contractCallNumber: this.formValidate.contractCallNumber, //业务联系人座机号
        contractCornette: this.formValidate.contractCornette, //业务联系人短号
        contractQQ: this.formValidate.contractQQ, //联系人QQ
        financeContract: this.formValidate.financeContract, //财务联系人
        financeContractPhone: this.formValidate.financeContractPhone, //财务联系人手机
        financeContractCallAreaNumber: this.formValidate
          .financeContractCallAreaNumber, //财务联系人座机区号
        financeContractCallNumber: this.formValidate.financeContractCallNumber, //财务联系人座机号
        financeContractCornette: this.formValidate.financeContractCornette, //财务联系人短号
        financeContractQQ: this.formValidate.financeContractQQ, //财务联系人QQ
        //sendAddress: [],//开票邮寄地址
        invocieSendProvince:
          this.formValidate.sendAddress.length > 0
            ? this.formValidate.sendAddress[0].name
            : "",
        invocieSendCity:
          this.formValidate.sendAddress.length > 1
            ? this.formValidate.sendAddress[1].name
            : "",
        invocieSendArea:
          this.formValidate.sendAddress.length > 2
            ? this.formValidate.sendAddress[2].name
            : "",
        invocieSendAddress: this.formValidate.invocieSendAddress
      }).then(res => {
        console.log(this.formValidate.local)
        if (res.data.code == "200") {
          this.$Message.success({
            content: "保存成功!",
            duration: 1
          });
          setTimeout(() => {
            closeNowTag(this.$store.state.app, this.$route);
            this.$router.push({
              path: "CustomerMaintain"
            });
          }, 1000);
        } else {
          this.$Message.error(res.data.msg);
        }
        setTimeout(() => {
          this.submitDisabled = false;
        }, 1000);
      });
      // }else{
      //   this.$Message.error("请上传三证合一或补全普通三证！");
      // }
    },
    submitFun2() {
      this.personformValidate.protocolStartDate =
        this.personformValidate.protocolStartDate1 &&
        this.personformValidate.protocolStartDate1[0]
          ? formatDate(this.personformValidate.protocolStartDate1[0])
          : "";
      this.personformValidate.protocolEndDate =
        this.personformValidate.protocolStartDate1 &&
        this.personformValidate.protocolStartDate1[1]
          ? formatDate(this.personformValidate.protocolStartDate1[1])
          : "";
      savePersonal(this.personformValidate).then(res => {
        if (res.data.code == "200") {
          this.$Message.success({
            content: "保存成功!",
            duration: 1
          });
          setTimeout(() => {
            closeNowTag(this.$store.state.app, this.$route);
            this.$router.push({
              path: "CustomerMaintain"
            });
          }, 1000);
        } else {
          this.$Message.error(res.data.msg);
        }
        setTimeout(() => {
          this.submitDisabled = false;
        }, 1000);
      });
    },
    backFun() {
      this.$Modal.confirm({
        title: "提示",
        content: "有数据未保存，是否确定放弃？",
        onOk: () => {
          closeNowTag(this.$store.state.app, this.$route);
          this.$router.push({
            path: "CustomerMaintain"
          });
        },
        onCancel: () => {}
      });
    }
  }
};
</script>
<style scoped>
.userinfo {
  font-size: 14px;
  margin-bottom: 20px;
}
.text-center {
  text-align: center;
}
.search-form .ivu-form-item {
  margin-bottom: 20px;
}
.tb-link-add,
.tb-link-remove {
  cursor: pointer;
}
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
.desc-content {
  line-height: 30px;
}
</style>



