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
      <Form
        :label-width="200"
        class="search-form"
        ref="shopform"
        :model="shop"
        :rules="ruleValidate"
      >
        <div class="table-title">商家入驻</div>
        <hr class="line">
        <Row type="flex" justify="space-between">
          <Col :span="24">
            <FormItem label="上传头像 :" required>
              <div class="clearfix">
                <div class="demo-upload-list" v-for="item in uploadList">
                  <template v-if="item.status === 'finished'">
                    <img :src="item.url">
                    <div class="demo-upload-list-cover">
                      <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                      <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                    </div>
                  </template>
                  <template v-else>
                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                  </template>
                </div>
                <Upload
                  ref="upload"
                  :show-upload-list="false"
                  :on-success="handleSuccess"
                  :format="['jpg','jpeg','png']"
                  :max-size="8*1024"
                  :on-format-error="handleFormatError"
                  :on-exceeded-size="handleMaxSize"
                  :before-upload="handleBeforeUpload"
                  type="drag"
                  action="/car/qualityshop/uploadPicture"
                  style="display: inline-block;width:100px;"
                >
                  <div style="width: 100px;height:100px;line-height: 100px;">
                    <Icon type="ios-camera" size="20"></Icon>
                  </div>
                </Upload>
              </div>
            </FormItem>
          </Col>
          <Col :span="24">
            <FormItem label="店面照片 :" required>
              <div class="clearfix">
                <div class="demo-upload-list" v-for="item in uploadList1">
                  <template v-if="item.status === 'finished'">
                    <img :src="item.url">
                    <div class="demo-upload-list-cover">
                      <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                      <Icon type="ios-trash-outline" @click.native="handleRemove1(item)"></Icon>
                    </div>
                  </template>
                  <template v-else>
                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                  </template>
                </div>
                <Upload
                  ref="upload1"
                  :show-upload-list="false"
                  :on-success="handleSuccess1"
                  :format="['jpg','jpeg','png']"
                  :max-size="8*1024"
                  :on-format-error="handleFormatError"
                  :on-exceeded-size="handleMaxSize"
                  :before-upload="handleBeforeUpload1"
                  multiple
                  type="drag"
                  action="/car/qualityshop/uploadPicture"
                  style="display: inline-block;width:100px;"
                >
                  <div style="width: 100px;height:100px;line-height: 100px;">
                    <Icon type="ios-camera" size="20"></Icon>
                  </div>
                </Upload>
              </div>
            </FormItem>
          </Col>
          <Col :span="24">
            <FormItem label="上传营业执照 :" required>
              <div class="clearfix">
                <div class="demo-upload-list" v-for="item in uploadList2">
                  <template v-if="item.status === 'finished'">
                    <img :src="item.url">
                    <div class="demo-upload-list-cover">
                      <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                      <Icon type="ios-trash-outline" @click.native="handleRemove2(item)"></Icon>
                    </div>
                  </template>
                  <template v-else>
                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                  </template>
                </div>
                <Upload
                  ref="upload2"
                  :show-upload-list="false"
                  :on-success="handleSuccess2"
                  :format="['jpg','jpeg','png']"
                  :max-size="8*1024"
                  :on-format-error="handleFormatError"
                  :on-exceeded-size="handleMaxSize"
                  :before-upload="handleBeforeUpload2"
                  type="drag"
                  action="/car/qualityshop/uploadPicture"
                  style="display: inline-block;width:100px;"
                >
                  <div style="width: 100px;height:100px;line-height: 100px;">
                    <Icon type="ios-camera" size="20"></Icon>
                  </div>
                </Upload>
              </div>
            </FormItem>
          </Col>
          <Col :span="24">
            <FormItem label="公司名称:" prop="companyName">
              <Input
                type="text"
                v-model="shop.companyName"
                :maxlength="50"
                placeholder="请填写公司名称"
                style="width: 500px"
              ></Input>
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem label="法人姓名:" prop="legalPerson">
              <Input
                type="text"
                v-model="shop.legalPerson"
                :maxlength="10"
                style="width: 200px"
                placeholder="请填写法人姓名"
              ></Input>
            </FormItem>
          </Col>
          <Col :span="18">
            <FormItem label="法人身份证照片(正反面):" required>
              <div class="clearfix">
                <div class="demo-upload-list" v-for="item in uploadList3">
                  <template v-if="item.status === 'finished'">
                    <img :src="item.url">
                    <div class="demo-upload-list-cover">
                      <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                      <Icon type="ios-trash-outline" @click.native="handleRemove3(item)"></Icon>
                    </div>
                  </template>
                  <template v-else>
                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                  </template>
                </div>
                <Upload
                  ref="upload3"
                  :show-upload-list="false"
                  :on-success="handleSuccess3"
                  :format="['jpg','jpeg','png']"
                  :max-size="8*1024"
                  :on-format-error="handleFormatError"
                  :on-exceeded-size="handleMaxSize"
                  :before-upload="handleBeforeUpload3"
                  type="drag"
                  action="/car/qualityshop/uploadPicture"
                  style="display: inline-block;width:100px;"
                >
                  <div style="width: 100px;height:100px;line-height: 100px;">
                    <Icon type="ios-camera" size="20"></Icon>
                  </div>
                </Upload>
              </div>
            </FormItem>
          </Col>
          <Col span="6">
             <FormItem label="负责人姓名:" prop="chargePerson">
              <Input
                type="text"
                v-model="shop.chargePerson"
                :maxlength="10"
                style="width: 200px"
              ></Input>
            </FormItem>
          </Col>
          <Col span=18>
             <FormItem label="负责人联系电话:" prop="chargePersonTelephone">
              <Input
                type="text"
                v-model="shop.chargePersonTelephone"
                :maxlength="11"
                style="width: 200px"
              ></Input>
            </FormItem>
          </Col>
          <Col span="6">
             <FormItem label="备用联系人:">
              <Input
                type="text"
                v-model="shop.standbyPerson"
                :maxlength="10"
                style="width: 200px"
              ></Input>
            </FormItem>
          </Col>
          <Col span="18">
             <FormItem label="备用联系人联系电话:">
              <Input
                type="text"
                v-model="shop.standbyPersonTelephone"
                :maxlength="11"
                style="width: 200px"
              ></Input>
            </FormItem>
          </Col>
          <Col span="6">
             <FormItem label="店面联系电话:" prop="shopTelephone">
              <Input
                type="text"
                v-model="shop.shopTelephone"
                style="width: 200px"
              ></Input>
            </FormItem>
          </Col>
          <Col span="18">
             <FormItem label="店面名称:" prop="shopName">
              <Input
                type="text"
                v-model="shop.shopName"
                style="width: 200px"
              ></Input>
            </FormItem>
          </Col>
          <Col span="12">
             <FormItem label="公司地址:" prop="address">
              <al-cascader v-model="shop.address" level="2" style="width: 300px;"/>
            </FormItem>
          </Col>
          <Col span="12"></Col>
          <Col span="12">
            <FormItem label="详细地址" prop="detailAddress">
              <Input v-model="shop.detailAddress" style="width: 300px;"></Input>
            </FormItem>
          </Col>
          <Col span="12"></Col>
          <Col :sm="8" :xs="24">
            <FormItem label="营业时间:" required>
              <TimePicker
                v-model="shop.businessTime"
                format="HH:mm"
                type="timerange"
                placement="bottom-start"
                placeholder="请选择营业时间"
                style="width:100%;"
              ></TimePicker >
            </FormItem>
          </Col>
          <Col span="12"></Col>
          <Col :sm="8" :xs="24">
            <FormItem label="输入手机号码:">
              <Input v-model="telephone" placeholder="请输入手机号码"></Input>
              <Input class="kaptcha" v-model="shop.mobileVerificationCode" placeholder="请输入验证码"></Input>
              <span class="star-red">*</span>
              <Button
              type="primary"
              class="input-button"
              @click="getkaptcha"
              >获取验证码</Button>
              </FormItem>
          </Col>
          <Col span="12">

          </Col>
        </Row>
        <Modal title="图片预览" v-model="visible">
          <img :src="imgUrl" v-if="visible" style="width: 100%">
        </Modal>
      </Form>
    </div>
  </div>
</template>
<script>
import { sendSms } from "@/api/shop";
export default {
  name: "Register",
  data() {
    return {
      shop: {
        headPortraitUrls: '',
        shopPicture: '',
        businessLicenseUrls: '',
        companyName: '',
        legalPerson: '',
        legalPersonCardUrls: '',
        chargePerson: '',
        chargePersonTelephone: '',
        standbyPerson: '',
        standbyPersonTelephone: '',
        shopTelephone: '',
        shopName: '',
        address: [],
        detailAddress: '',
        businessTime: [],
        mobileVerificationCode: ''
      },
      telephone: '',
      imgName: "",
      imgUrl: "",
      visible: false,
      uploadList: [],
      uploadList1: [],
      uploadList2: [],
      uploadList3: [],
      ruleValidate: {
        companyName: [
          {
            type: 'string',
            required: true,
            message: "请输入公司名称",
            trigger: "change"
          }
        ],
        legalPerson: [
          {
            type: 'string',
            required: true,
            message: '请输入法人姓名',
            trigger: 'change'
          }
        ],
        chargePerson: [
          {
            type: 'string',
            required: true,
            message: '请输入负责人姓名',
            trigger: 'change'
          }
        ],
        chargePersonTelephone: [
          { required: true, message: "负责人电话不能为空", trigger: "blur" },
          {
            type: "number",
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("负责人电话不能为空"));
              } else if (!/^1[3-9]+\d{9}$/.test(value)) {
                callback("请输入正确的手机号");
              } else {
                callback();
              }
            }
          }
        ],
        shopTelephone: [
          {
            type: 'string',
            required: true,
            message: '请输入店面联系方式',
            trigger: 'change'
          }
        ],
        shopName: [
          {
            type: 'string',
            required: true,
            message: '请输入店面名称',
            trigger: 'change'
          }
        ],
        address: [
          {
            required: true,
            type: "array",
            message: "公司地址不能为空",
            trigger: "change"
          }
        ],
        detailAddress: [
          { required: true, message: "详细地址不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {},
  mounted() {},
  methods: {
    handleView(item) {
      this.imgName = item.name;
      this.imgUrl = item.url;
      this.visible = true;
    },
    handleRemove(file) {
      this.uploadList.splice(this.uploadList.indexOf(file), 1);
    },
    handleRemove1(file) {
      this.uploadList1.splice(this.uploadList1.indexOf(file), 1);
    },
    handleRemove2(file) {
      this.uploadList2.splice(this.uploadList2.indexOf(file), 1);
    },
    handleRemove3(file) {
      this.uploadList3.splice(this.uploadList3.indexOf(file), 1);
    },
    handleSuccess(res, file) {
      if (res.code == "200") {
        file.url = "http://" + res.data;
      } else {
        this.$Message.error(res.msg);
      }
      this.uploadList.push(file);
      this.shop.headPortraitUrls = file.url;
    },
    handleSuccess1(res, file) {
      if (res.code == "200") {
        file.url = "http://" + res.data;
      } else {
        this.$Message.error(res.msg);
      }
      this.uploadList1.push(file);
      var urls = "";
      if (this.uploadList1 != null && this.uploadList1.length > 0) {
        for (var i = 0; i < this.uploadList1.length; i++) {
          if (i != this.uploadList1.length - 1) {
            urls += this.uploadList1[i].url + ",";
          } else {
            urls += this.uploadList1[i].url;
          }
        }
      }
      this.shop.shopPicture = urls;
    },
    handleSuccess2(res, file) {
      if (res.code == "200") {
        file.url = "http://" + res.data;
      } else {
        this.$Message.error(res.msg);
      }
      this.uploadList2.push(file);
      this.shop.businessLicenseUrls = file.url;
    },
    handleSuccess3(res, file) {
      if (res.code == "200") {
        file.url = "http://" + res.data;
      } else {
        this.$Message.error(res.msg);
      }
      this.uploadList3.push(file);
      var urls = "";
      if (this.uploadList3 != null && this.uploadList3.length > 0) {
        for (var i = 0; i < this.uploadList3.length; i++) {
          if (i != this.uploadList3.length - 1) {
            urls += this.uploadList3[i].url + ",";
          } else {
            urls += this.uploadList3[i].url;
          }
        }
      }
      this.shop.legalPersonCardUrls = urls;
    },
    handleBeforeUpload() {
      const check = this.uploadList.length < 1;
      if (!check) {
        this.$Message.info("最多上传1张头像图片.");
      }
      return check;
    },
    handleBeforeUpload1() {
      const check = this.uploadList1.length < 4;
      if (!check) {
        this.$Message.info("最多上传4张店面图片.");
      }
      return check;
    },
    handleBeforeUpload2() {
      const check = this.uploadList2.length < 1;
      if (!check) {
        this.$Message.info("最多上传1张营业执照图片.");
      }
      return check;
    },
    handleBeforeUpload3() {
      const check = this.uploadList3.length < 2;
      if (!check) {
        this.$Message.info("最多上传2张身份证照片.");
      }
      return check;
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "文件格式不正确",
        desc: "文件格式 " + file.name + " 不正确, 请选择 jpg 、jpeg 、 png文件."
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "文件大小超限",
        desc: "文件  " + file.name + " 太大，上传文件大小不能超过8M."
      });
    },

    getkaptcha() {
      if(this.telephone != '' && this.telephone != null) {
        if (!/^1[3-9]+\d{9}$/.test(this.telephone)) {
          this.$Message.error("请输入正确的手机号码");
        }else {
          let params = {
            telephone: this.telephone
          }
          sendSms(params).then(response => {
            let rdata = response.data;
            if (rdata.code == 200) {
              this.$Message.info(rdata.data)
            }else {
              this.$Message.error("查询分类失败" + rdata.msg);
            }
          });
        }
      }else {
          this.$Message.error("请输入手机号码");
      }
    }
  }
};
</script>
<style lang="less" scoped>
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

.demo-upload-list {
  display: inline-block;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
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

.input-price /deep/ input {
  padding: 5px 20px;
}

.table-title {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}

.input-button {
  display: inline-block;
  border-color: #fbc647;
  background-color: #fbc647;
  margin-top: 10px;
}

.kaptcha {
  display: inline-block;
  position: absolute;
  margin-left: 32px;
  width: 200px;
}
.star-red {
    display: inline-block;
    position: absolute;
    margin-left: 20px;
    line-height: 35px;
    font-family: SimSun;
    font-size: 12px;
    color: #ed4014;
  }
</style>
