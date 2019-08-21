<template>
  <div class="white-bg">
    <div class="userinfo">
      <Row type="flex" justify="space-around">
        <Col :sm="8" :xs="24">
        <span>加工商名称：-</span>
        </Col>
        <Col :sm="8" :xs="24">
        <span>仓库：{{$store.state.user.warehouse.warehouseName}}</span>
        </Col>
      </Row>
    </div>
    <div class="compony-type" v-show="formValidate.companyType==0">
      <Form :label-width="200" class="search-form" ref="formValidate" :model="formValidate" :rules="ruleValidate">
        <div class="table-title">基本信息</div>
        <hr class="line">
        <Row type="flex" justify="space-between">
          <Col :sm="12" :xs="24">
          <FormItem label="客户类型:" prop="companyType">
            <Select v-model="formValidate.companyType" disabled>
              <!-- <Option v-for="item in usetatusList" :value="item.value" :key="item.value">{{ item.label }}</Option> -->
              <Option value="0">企业</Option>
              <Option value="1">个人</Option>
            </Select>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem label="客户名称:" prop="companyName">
            <Input v-model="formValidate.companyName"></Input>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem label="客户简称:">
            <Input v-model="formValidate.companyShort"></Input>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem label="协议起始时间:" prop="startTime">
            <DatePicker v-model="formValidate.startTime" type="date" placement="bottom-end"></DatePicker>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem label="公司成立日期:" prop="companyDate">
            <DatePicker v-model="formValidate.companyDate" type="date" placement="bottom-end"></DatePicker>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem label="统一社会信用代码号:" prop="companyNo">
            <Input v-model="formValidate.companyNo" disabled></Input>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem label="公司注册所在地:" prop="address">
            <al-cascader v-model="formValidate.address" level="2" />
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem label="公司注册详细地址:" prop="addressDetail">
            <Input v-model="formValidate.addressDetail"></Input>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem label="公司地址:" prop="local">
            <al-cascader v-model="formValidate.local" level="2" />
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem label="公司详细地址:" prop="localDetail">
            <Input v-model="formValidate.localDetail"></Input>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem label="公司电话:">
            <Input v-model="formValidate.companyPhone"></Input>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem label="公司传真:">
            <Input v-model="formValidate.companyFax"></Input>
          </FormItem>
          </Col>
        </Row>
        <div class="table-title">开票信息</div>
        <hr class="line">
        <Row type="flex" justify="space-between">
          <Col :sm="12" :xs="24">
          <FormItem label="开户银行:" prop="bank">
            <Select v-model="formValidate.bank" filterable clearable>
              <Option v-for="(item,index) in bankList" :value="item" :key="index">{{ item }}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem label="开户行所在地:" prop="bankAddress">
            <al-cascader v-model="formValidate.bankAddress" level="1" />
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem label="开户行网点名称:" prop="bankDetail">
            <Input v-model="formValidate.bankDetail"></Input>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem label="银行账号:" prop="bankNo">
            <Input v-model="formValidate.bankNo"></Input>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem label="纳税人类型:">
            <Select v-model="formValidate.taxmanType" filterable clearable>
              <Option v-for="(item,index) in taxmanTypeList" :value="item" :key="index">{{ item }}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem label="纳税人识别号:">
            <Input v-model="formValidate.taxmanNo"></Input>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem label="开票地址:">
            <al-cascader v-model="formValidate.ticketAddress" level="2" />
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem label="开票详细地址:">
            <Input v-model="formValidate.ticketAddDetail"></Input>
          </FormItem>
          </Col>
        </Row>
        <div class="table-title">法人信息</div>
        <hr class="line">
        <Row type="flex" justify="space-between">
          <Col :sm="12" :xs="24">
          <FormItem label="法人姓名:" prop="frName">
            <Input v-model="formValidate.frName"></Input>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem label="法人身份证号:">
            <Input v-model="formValidate.frId"></Input>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem label="法人联系电话:">
            <Input v-model="formValidate.frPhone"></Input>
          </FormItem>
          </Col>
        </Row>
        <div class="table-title">联系人信息</div>
        <hr class="line">
        <Row type="flex" justify="space-between">
          <Col :sm="12" :xs="24">
          <FormItem label="联系人:" prop="lxrName">
            <Input v-model="formValidate.lxrName"></Input>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem label="联系人手机:" prop="lxrPhone">
            <Input v-model="formValidate.lxrPhone"></Input>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem label="联系人座机:">
            <Row type="flex" justify="space-between" flex-der>
              <Col :sm="7" :xs="24">
              <Input placeholder="区号" v-model="formValidate.lxrTel.qh"></Input>
              </Col>-
              <Col :sm="7" :xs="24">
              <Input placeholder="座机号" v-model="formValidate.lxrTel.zjh"></Input>
              </Col>-
              <Col :sm="7" :xs="24">
              <Input placeholder="短号" v-model="formValidate.lxrTel.dh"></Input>
              </Col>
            </Row>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem label="联系人QQ:">
            <Input v-model="formValidate.lxrQQ"></Input>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem label="财务联系人:">
            <Input v-model="formValidate.cwlxrName"></Input>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem label="财务联系人手机:">
            <Input v-model="formValidate.cwlxrPhone"></Input>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem label="财务联系人座机:">
            <Row type="flex" justify="space-between" flex-der>
              <Col :sm="7" :xs="24">
              <Input placeholder="区号" v-model="formValidate.cwlxrTel.qh"></Input>
              </Col>-
              <Col :sm="7" :xs="24">
              <Input placeholder="座机号" v-model="formValidate.cwlxrTel.zjh"></Input>
              </Col>-
              <Col :sm="7" :xs="24">
              <Input placeholder="短号" v-model="formValidate.cwlxrTel.dh"></Input>
              </Col>
            </Row>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem label="财务联系人QQ:">
            <Input v-model="formValidate.cwlxrQQ"></Input>
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
            <Alert type="warning" show-icon>注: 以下照片均需加盖企业公章,请上传清晰正面图片，图片大小控制在5M内，文件格式限使用jpg，jpeg，png格式</Alert>
            </Col>
            <Col :span="24">
            <div class="clearfix">
              <div class="demo-upload-content" v-for="(item,index) in uploadList" :key="index">
                <div class="desc-content">
                  <span style="color: red;">*</span>
                  <b>企业营业执照</b>
                </div>
                <div class="demo-upload-list">
                  <template v-if="item.status === 'finished'">
                    <img :src="item.url">
                    <div class="demo-upload-list-cover">
                      <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                      <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                    </div>
                  </template>
                  <template v-else>
                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                  </template>
                </div>
              </div>
              <div v-show="uploadList.length<2">
                <div class="desc-content">
                  <span style="color: red;">*</span>
                  <b>企业营业执照</b>
                </div>
                <Upload ref="upload" :show-upload-list="false" :default-file-list="defaultList" :on-success="handleSuccess" :format="['jpg','jpeg','png']" :max-size="5120" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" multiple type="drag" action="//jsonplaceholder.typicode.com/posts/" style="display: inline-block;width:118px;">
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
            <Alert type="warning" show-icon>注: 以下照片均需加盖企业公章,请上传清晰正面图片，图片大小控制在5M内，文件格式限使用jpg，jpeg，png格式</Alert>
            </Col>
            <Col :span="24">
            <div class="clearfix">
              <div class="demo-upload-content" v-for="(item,index) in uploadList1" :key="index">
                <div class="desc-content">
                  <span style="color: red;">*</span>
                  <b>企业营业执照</b>
                </div>
                <div class="demo-upload-list">
                  <template v-if="item.status === 'finished'">
                    <img :src="item.url">
                    <div class="demo-upload-list-cover">
                      <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
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
                  <span style="color: red;">*</span>
                  <b>企业营业执照</b>
                </div>
                <Upload ref="upload1" :show-upload-list="false" :on-success="handleSuccess" :format="['jpg','jpeg','png']" :max-size="5120" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" type="drag" action="//jsonplaceholder.typicode.com/posts/" style="display: inline-block;width:118px;">
                  <div style="width: 118px;height:118px;line-height: 118px;">
                    <Icon type="ios-camera" size="20"></Icon>
                  </div>
                </Upload>
              </div>

              <div class="demo-upload-content" v-for="(item,index) in uploadList2" :key="index">
                <div class="desc-content">
                  <span style="color: red;">*</span>
                  <b>组织机构代码证</b>
                </div>
                <div class="demo-upload-list">
                  <template v-if="item.status === 'finished'">
                    <img :src="item.url">
                    <div class="demo-upload-list-cover">
                      <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
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
                  <span style="color: red;">*</span>
                  <b>组织机构代码证</b>
                </div>
                <Upload ref="upload2" :show-upload-list="false" :on-success="handleSuccess" :format="['jpg','jpeg','png']" :max-size="5120" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" type="drag" action="//jsonplaceholder.typicode.com/posts/" style="display: inline-block;width:118px;">
                  <div style="width: 118px;height:118px;line-height: 118px;">
                    <Icon type="ios-camera" size="20"></Icon>
                  </div>
                </Upload>
              </div>

              <div class="demo-upload-content" v-for="(item,index) in uploadList3" :key="index">
                <div class="desc-content">
                  <span style="color: red;">*</span>
                  <b>税务登记证</b>
                </div>
                <div class="demo-upload-list">
                  <template v-if="item.status === 'finished'">
                    <img :src="item.url">
                    <div class="demo-upload-list-cover">
                      <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
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
                  <span style="color: red;">*</span>
                  <b>税务登记证</b>
                </div>
                <Upload ref="upload3" :show-upload-list="false" :on-success="handleSuccess" :format="['jpg','jpeg','png']" :max-size="5120" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" type="drag" action="//jsonplaceholder.typicode.com/posts/" style="display: inline-block;width:118px;">
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
        <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" v-if="visible" style="width: 100%">
      </Modal>
      <div class="text-center margin-top-10">
        <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
        <!-- <Button class="margin-left-10" @click="backFun">返回</Button> -->
      </div>
    </div>
    <div class="personal-type" v-show="personformValidate.userType==1">
      <Form :label-width="200" class="search-form" ref="personformValidate" :model="personformValidate" :rules="personruleValidate">
        <div class="table-title">基本信息</div>
        <hr class="line">
        <Row type="flex" justify="space-between">
          <Col :sm="12" :xs="24">
          <FormItem label="客户类型:" prop="userType">
            <Select v-model="personformValidate.userType" disabled>
              <Option value="0">企业</Option>
              <Option value="1">个人</Option>
            </Select>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem label="客户姓名:" prop="userName">
            <Input v-model="personformValidate.userName"></Input>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem label="身份证号码:" prop="userId">
            <Input v-model="personformValidate.userId"></Input>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem label="手机号:">
            <Input v-model="personformValidate.userPhone"></Input>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem label="座机:">
            <Row type="flex" justify="space-between" flex-der>
              <Col :sm="7" :xs="24">
              <Input placeholder="区号" v-model="personformValidate.userTel.qh"></Input>
              </Col>-
              <Col :sm="7" :xs="24">
              <Input placeholder="座机号" v-model="personformValidate.userTel.zjh"></Input>
              </Col>-
              <Col :sm="7" :xs="24">
              <Input placeholder="短号" v-model="personformValidate.userTel.dh"></Input>
              </Col>
            </Row>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem label="传真:">
            <Input v-model="personformValidate.userFax"></Input>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem label="QQ:">
            <Input v-model="personformValidate.userQQ"></Input>
          </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
          <FormItem label="协议起始时间:" prop="userstartTime">
            <DatePicker v-model="personformValidate.userstartTime" type="date" placement="bottom-end"></DatePicker>
          </FormItem>
          </Col>
        </Row>
        <div class="text-center margin-top-10">
          <Button type="primary" @click="handleSubmit('personformValidate')">保存</Button>
          <!-- <Button class="margin-left-10" @click="backFun">返回</Button> -->
        </div>
      </Form>
    </div>
  </div>

</template>
<script>
// import { getTableData } from '@/api/data'
import { closeNowTag } from "@/libs/util";
export default {
  name: "CustomerAdd",
  components: {},
  data() {
    return {
      resArr: [],
      formValidate: {
        warehouse: "",
        companyName: "上海钢联",
        companyShort: "上海钢联",
        companyNo: "CJNZBBAAASUIOO001",
        companyDate: new Date(), //公司成立日期
        address: [], //公司注册所在地
        addressDetail: "", //公司注册详细地址
        local: [], //公司地址
        startTime: new Date(), //协议起始时间
        localDetail: "上海市宝山区园丰路68号", //公司详细地址
        companyPhone: "17621688256", //公司电话
        companyFax: "17621688256", //公司传真
        companyType: "0", //客户类型
        bank: "中国建设银行", //开户银行
        bankAddress: [], //开户行所在地
        bankDetail: "上海市宝山区南翔支行", //开户行网点名称
        bankNo: "322566654221206554", //银行账号
        taxmanType: "个人", //纳税人类型
        taxmanNo: "125221263544", //纳税人识别号
        ticketAddress: [], //开票地址
        ticketAddDetail: "上海市宝山区园丰路68号", //开票详细地址
        frName: "朱军红", //法人姓名
        frId: "321284188002164568", //法人身份证号码
        frPhone: "17622266689", //法人联系电话
        lxrName: "王五", //联系人
        lxrPhone: "15900000000", //联系人手机
        lxrTel: {
          qh: "020", //联系人座机区号
          zjh: "62955", //联系人座机号
          dh: "123" //联系人短号
        },
        lxrQQ: "45467", //联系人QQ
        cwlxrName: "李四", //财务联系人
        cwlxrPhone: "13000000000", //财务联系人手机
        cwlxrTel: {
          qh: "020", //财务联系人座机区号
          zjh: "62955", //财务联系人座机号
          dh: "123" //财务联系人短号
        },
        cwlxrQQ: "132456" //财务联系人QQ
      },
      personformValidate: {
        //个人类型
        userType: "0", //客户类型
        userName: "", //客户姓名
        userId: "", //身份证号码
        userPhone: "", //手机号
        userTel: {
          qh: "", //区号
          zjh: "", //座机号
          dh: "" //短号
        },
        userFax: "", //传真
        userQQ: "", //QQ
        userstartTime: "" //协议起始时间
      },
      ruleValidate: {
        warehouse: [
          {
            required: true,
            message: "请选择仓库名称",
            trigger: "change"
          }
        ],
        companyName: [
          {
            required: true,
            message: "请填写公司名称",
            trigger: "change"
          }
        ],
        companyNo: [
          {
            required: true,
            message: "请填写统一社会信用代码号",
            trigger: "change"
          }
        ],
        address: [
          {
            required: true,
            type: "array",
            message: "请选择公司注册所在地",
            trigger: "change"
          }
        ],
        addressDetail: [
          {
            required: true,
            message: "请填写公司注册详细地址",
            trigger: "change"
          }
        ],
        startTime: [
          {
            required: true,
            message: "请填写协议起始时间",
            type: "date",
            trigger: "change"
          }
        ],
        companyDate: [
          {
            required: true,
            message: "请填写公司成立日期",
            type: "date",
            trigger: "change"
          }
        ],
        local: [
          {
            required: true,
            type: "array",
            message: "请选择公司地址",
            trigger: "change"
          }
        ],
        localDetail: [
          {
            required: true,
            message: "请填写公司详细地址",
            trigger: "change"
          }
        ],
        // companyPhone: [
        //   {
        //     required: true,
        //     message: "请填写公司电话",
        //     trigger: "change"
        //   }
        // ],
        companyType: [
          {
            required: true,
            message: "请选择企业属性",
            trigger: "change"
          }
        ],
        bank: [
          {
            required: true,
            message: "请选择开户银行",
            trigger: "change"
          }
        ],
        bankAddress: [
          {
            required: true,
            type: "array",
            message: "请选择开户行所在地",
            trigger: "change"
          }
        ],
        bankDetail: [
          {
            required: true,
            message: "请填写开户行网点名称",
            trigger: "change"
          }
        ],
        bankNo: [
          {
            required: true,
            message: "请填写开户行账号",
            trigger: "change"
          }
        ],
        // taxmanType: [
        //   {
        //     required: true,
        //     message: "请选择纳税人类型",
        //     trigger: "change"
        //   }
        // ],
        // taxmanNo: [
        //   {
        //     required: true,
        //     message: "请填写纳税人识别号",
        //     trigger: "change"
        //   }
        // ],
        // ticketAddress: [
        //   {
        //     required: true,
        //     type: "array",
        //     message: "请选择开票地址",
        //     trigger: "change"
        //   }
        // ],
        // ticketAddDetail: [
        //   {
        //     required: true,
        //     message: "请填写开票详细地址",
        //     trigger: "change"
        //   }
        // ],
        frName: [
          {
            required: true,
            message: "请填写法人姓名",
            trigger: "change"
          }
        ],
        // frId: [
        //   {
        //     required: true,
        //     message: "请填写法人身份证号",
        //     trigger: "change"
        //   }
        // ],
        // frPhone: [
        //   {
        //     required: true,
        //     message: "请填写法人联系电话",
        //     trigger: "change"
        //   }
        // ]
        lxrName: [
          {
            required: true,
            message: "请填写联系人姓名",
            trigger: "change"
          }
        ],
        lxrPhone: [
          {
            required: true,
            message: "请填写联系人手机",
            trigger: "change"
          }
        ]
      },
      personruleValidate: {
        userType: [
          {
            required: true,
            message: "请选择客户类型",
            trigger: "change"
          }
        ],
        userName: [
          {
            required: true,
            message: "请填写客户姓名",
            trigger: "change"
          }
        ],
        userId: [
          {
            required: true,
            message: "请填写身份证号码",
            trigger: "change"
          }
        ],
        userstartTime: [
          {
            required: true,
            message: "请填写协议起始时间",
            type: "date",
            trigger: "change"
          }
        ]
      },
      companyTypeList: ["企业", "个人"],
      bankList: ["中国建设银行", "中国招商银行"],
      warehouseList: ["上海钢联1库", "上海钢联2库"],
      taxmanTypeList: ["一般纳税人", "小规模纳税人", "非增值税纳税人"],
      tableData: [
        {
          col1: "AT001",
          col2: "沙钢",
          col3: "冷轧卷",
          col4: "1.0*1250*C",
          col5: "Q235B",
          col6: "A区",
          col7: "A1－1",
          col8: "3",
          col9: "7.4300",
          col10: "7.4800",
          col11: "抄码",
          col12: "453***",
          col13: "AS***",
          col14: "4443",
          col15: "34466",
          col16: "",
          col17: "",
          status: 1
        }
      ],
      tableColumns: [
        {
          title: "编号",
          key: "col1",
          align: "left",
          minWidth: 120,
          render: (h, data) => {
            if (data.row.status == 0) {
              return h("Input", {
                props: {
                  value: data.row.col1
                }
              });
            } else {
              return h("span", data.row.col1);
            }
          }
        },
        {
          title: "产地",
          key: "col2",
          align: "left",
          minWidth: 180,
          render: (h, data) => {
            if (data.row.status == 0) {
              return h("Input", {
                props: {
                  value: data.row.col2
                }
              });
            } else {
              return h("span", data.row.col2);
            }
          }
        },
        {
          title: "品名",
          key: "col3",
          align: "left",
          minWidth: 180,
          renderHeader: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    color: "red"
                  }
                },
                "*"
              ),
              h("span", "品名")
            ]);
          },
          render: (h, data) => {
            if (data.row.status == 0) {
              return h("Input", {
                props: {
                  value: data.row.col3
                }
              });
            } else {
              return h("span", data.row.col3);
            }
          }
        },
        {
          title: "规格",
          key: "col4",
          align: "left",
          minWidth: 180,
          renderHeader: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    color: "red"
                  }
                },
                "*"
              ),
              h("span", "规格")
            ]);
          },
          render: (h, data) => {
            if (data.row.status == 0) {
              return h("Input", {
                props: {
                  value: data.row.col4
                }
              });
            } else {
              return h("span", data.row.col4);
            }
          }
        },
        {
          title: "材质",
          key: "col5",
          align: "left",
          minWidth: 180,
          renderHeader: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    color: "red"
                  }
                },
                "*"
              ),
              h("span", "材质")
            ]);
          },
          render: (h, data) => {
            if (data.row.status == 0) {
              return h("Input", {
                props: {
                  value: data.row.col5
                }
              });
            } else {
              return h("span", data.row.col5);
            }
          }
        },
        {
          title: "库区",
          key: "col6",
          align: "left",
          minWidth: 120,
          render: (h, data) => {
            if (data.row.status == 0) {
              return h("Input", {
                props: {
                  value: data.row.col6
                }
              });
            } else {
              return h("span", data.row.col6);
            }
          }
        },
        {
          title: "库位",
          key: "col7",
          align: "left",
          minWidth: 120,
          render: (h, data) => {
            if (data.row.status == 0) {
              return h("Input", {
                props: {
                  value: data.row.col7
                }
              });
            } else {
              return h("span", data.row.col7);
            }
          }
        },
        {
          title: "件数",
          key: "col8",
          align: "right",
          minWidth: 120,
          renderHeader: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    color: "red"
                  }
                },
                "*"
              ),
              h("span", "件数")
            ]);
          },
          render: (h, data) => {
            if (data.row.status == 0) {
              return h("Input", {
                props: {
                  value: data.row.col8
                }
              });
            } else {
              return h("span", data.row.col8);
            }
          }
        },
        {
          title: "单件重量",
          key: "col9",
          align: "right",
          minWidth: 120,
          renderHeader: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    color: "red"
                  }
                },
                "*"
              ),
              h("span", "单件重量")
            ]);
          },
          render: (h, data) => {
            if (data.row.status == 0) {
              return h("Input", {
                props: {
                  value: data.row.col9
                }
              });
            } else {
              return h("span", data.row.col9);
            }
          }
        },
        {
          title: "总重量",
          key: "col10",
          align: "right",
          minWidth: 160,
          renderHeader: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    color: "red"
                  }
                },
                "*"
              ),
              h("span", "总重量")
            ]);
          },
          render: (h, data) => {
            if (data.row.status == 0) {
              return h("Input", {
                props: {
                  value: data.row.col10
                }
              });
            } else {
              return h("span", data.row.col10);
            }
          }
        },
        {
          title: "计重方式",
          key: "col11",
          align: "left",
          minWidth: 120,
          renderHeader: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    color: "red"
                  }
                },
                "*"
              ),
              h("span", "计重方式")
            ]);
          },
          render: (h, data) => {
            if (data.row.status == 0) {
              return h("Input", {
                props: {
                  value: data.row.col11
                }
              });
            } else {
              return h("span", data.row.col11);
            }
          }
        },
        {
          title: "钢卷号",
          key: "col12",
          align: "left",
          minWidth: 120,
          render: (h, data) => {
            if (data.row.status == 0) {
              return h("Input", {
                props: {
                  value: data.row.col12
                }
              });
            } else {
              return h("span", data.row.col12);
            }
          }
        },
        {
          title: "炉号",
          key: "col13",
          align: "left",
          minWidth: 120,
          render: (h, data) => {
            if (data.row.status == 0) {
              return h("Input", {
                props: {
                  value: data.row.col13
                }
              });
            } else {
              return h("span", data.row.col13);
            }
          }
        },
        {
          title: "船号",
          key: "col14",
          align: "left",
          minWidth: 120,
          render: (h, data) => {
            if (data.row.status == 0) {
              return h("Input", {
                props: {
                  value: data.row.col14
                }
              });
            } else {
              return h("span", data.row.col14);
            }
          }
        },
        {
          title: "合同号",
          key: "col15",
          align: "left",
          minWidth: 150,
          render: (h, data) => {
            if (data.row.status == 0) {
              return h("Input", {
                props: {
                  value: data.row.col15
                }
              });
            } else {
              return h("span", data.row.col15);
            }
          }
        },
        {
          title: "包装",
          key: "col16",
          align: "left",
          minWidth: 120,
          render: (h, data) => {
            if (data.row.status == 0) {
              return h("Input", {
                props: {
                  value: data.row.col16
                }
              });
            } else {
              return h("span", data.row.col16);
            }
          }
        },
        {
          title: "外观",
          key: "col17",
          align: "left",
          minWidth: 120,
          render: (h, data) => {
            if (data.row.status == 0) {
              return h("Input", {
                props: {
                  value: data.row.col17
                }
              });
            } else {
              return h("span", data.row.col17);
            }
          }
        },
        {
          title: "操作",
          key: "",
          align: "left",
          fixed: "right",
          minWidth: 180,
          renderHeader: (h, params) => {
            return h("div", [
              h("span", "操作"),
              h("Icon", {
                props: {
                  type: "md-add-circle",
                  size: 20
                },
                class: "tb-link-add margin-left-10 color-green",
                on: {
                  click: () => {
                    this.tableData.push({
                      col1: "",
                      col2: "",
                      col3: "",
                      col4: "",
                      col5: "",
                      col6: "",
                      col7: "",
                      col8: "",
                      col9: "",
                      col10: "",
                      col11: "",
                      col12: "",
                      col13: "",
                      col14: "",
                      col15: "",
                      col16: "",
                      col17: "",
                      status: 0
                    });
                  }
                }
              })
            ]);
          },
          render: (h, data) => {
            let editOperate;
            if (data.row.status == 0) {
              editOperate = h(
                "span",
                {
                  class: "tb-link",
                  on: {
                    click: () => {
                      this.tableData[data.index].status = 1;
                    }
                  }
                },
                "保存"
              );
            } else {
              editOperate = h(
                "span",
                {
                  class: "tb-link",
                  on: {
                    click: () => {
                      this.tableData[data.index].status = 0;
                    }
                  }
                },
                "编辑"
              );
            }
            return h("div", [
              editOperate,
              h(
                "span",
                {
                  class: "tb-link margin-left-10",
                  on: {
                    click: () => {
                      this.showUploadImg = true;
                    }
                  }
                },
                "上传照片"
              ),
              h("Icon", {
                props: {
                  type: "md-remove-circle",
                  size: 20
                },
                class: "tb-link-remove margin-left-10 color-red",
                on: {
                  click: () => {
                    this.tableData.splice(data.index, 1);
                  }
                }
              })
            ]);
          }
        }
      ],
      defaultList: [
        {
          name: "a42bdcc1178e62b4694c830f028db5c0",
          url:
            "https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar",
          desc: "test"
        }
      ],
      descTips: [{ status: true, val: "" }, { status: true, val: "" }],
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
  },
  methods: {
    editDesc(index) {
      this.descTips[index].status = false;
    },
    saveDesc(index) {
      this.descTips[index].status = true;
      this.defaultList[index].desc = this.descTips[index].val;
    },
    closeDesc(index) {
      this.descTips[index].status = true;
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
      file.url =
        "https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar";
      file.name = "7eb99afb9d5f317c912f08b5212fd69a";
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "The file format is incorrect",
        desc:
          "File format of " +
          file.name +
          " is incorrect, please select jpg or png."
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "Exceeding file size limit",
        desc: "File  " + file.name + " is too large, no more than 2M."
      });
    },
    handleBeforeUpload() {
      const check = this.uploadList.length < 3;
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
          this.$Message.success({
            content: "提交成功!",
            duration: 1
          });
          setTimeout(() => {
            closeNowTag(this.$store.state.app, this.$route);
            this.$router.push({
              path: "CustomerMaintain"
            });
          }, 1000);
        } else {
          this.$Message.error("提交失败");
        }
      });
    },
    backFun() {
      closeNowTag(this.$store.state.app, this.$route);
      this.$router.push({
        path: "CustomerMaintain"
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



