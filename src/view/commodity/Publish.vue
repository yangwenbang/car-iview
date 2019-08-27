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
        ref="commodityform"
        :model="commodity"
        :rules="ruleValidate"
      >
        <div class="table-title">发布商品</div>
        <hr class="line">
        <Row type="flex" justify="space-between">
          <Col :sm="12" :xs="24">
            <FormItem label="订单编号:">
              <Input type="text" v-model="commodity.commodityCode" :maxlength="30" @on-input-change="queryCommodityCode"></Input>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="商品标题:" prop="commodityName">
              <Input v-model="commodity.commodityName" :maxlength="30"></Input>
            </FormItem>
          </Col>
          <Col :span="24">
            <FormItem label="上传图片 :">
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
                  :default-file-list="defaultList"
                  :on-success="handleSuccess"
                  :format="['jpg','jpeg','png']"
                  :max-size="2048"
                  :on-format-error="handleFormatError"
                  :on-exceeded-size="handleMaxSize"
                  :before-upload="handleBeforeUpload"
                  multiple
                  type="drag"
                  action="/car/qualityshop/uploadPicture"
                  style="display: inline-block;width:58px;"
                >
                  <div style="width: 58px;height:58px;line-height: 58px;">
                    <Icon type="ios-camera" size="20"></Icon>
                  </div>
                </Upload>
                <Modal title="图片预览" v-model="visible">
                  <img :src="imgUrl" v-if="visible" style="width: 100%">
                </Modal>
              </div>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="商品描述:">
              <textarea
                style="height:100px;width:388px;padding:3px;border-radius:5px"
                placeholder="请输入商品描述"
                v-model="commodity.description"
                :maxlength="500"
              ></textarea>
            </FormItem>
          </Col>
          <Col :span="24" style="margin-bottom: 10px;">
            <FormItem label="产品分类:">
              <RadioGroup v-model="commodity.commodityCategoryId" @on-change="categoryChange">
                <Radio
                  v-for="(category,index) in categoryList"
                  :key="index"
                  :label="category.id"
                >{{category.categoryName}}</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="一口价:">
              <div class="input-price">
                <Input style="width: 200px;" v-model="commodity.price"></Input>
                <span class="tr-span">￥</span>
              </div>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem label="原厂/非原厂:">
              <RadioGroup v-model="commodity.commodityType" @on-change="typeChange">
                <Radio :label="0">原厂</Radio>
                <Radio :label="1">非原厂</Radio>
              </RadioGroup>
              <Input style="width: 200px;" v-if="commodity.commodityType==0" v-model="attributeFirstWord" :maxlength="1" @input="typeChange"/>
            </FormItem>
          </Col>
           <Col :sm="12" :xs="24" v-for="(categoryAttribute, index) in categoryAttributeList" :key="index">
            <FormItem :label='categoryAttribute.attributeName + ":"'>
                <Select v-model="categoryAttribute.selectId">
                  <Option v-for="attribute in categoryAttribute.childAttribute" :key="attribute.id" :value="attribute.id">{{attribute.attributeName}}</Option>
              </Select>
            </FormItem>
           </Col>
           <br></br>
           <Col :span="24">
            <FormItem label="商家补充描述:" prop="additionalDescription">
              <textarea
                style="height:100px;width:388px;padding:3px;border-radius:5px"
                placeholder="请输入商家补充描述"
                v-model="commodity.additionalDescription"
                :maxlength="500"
              ></textarea>
            </FormItem>
          </Col>
        </Row>
        <div class="text-center margin-top-10">
          <Button type="primary" class="btn-common-width" @click="save('commodityform')" :disabled="submitDisabled">保存</Button>
          <Button class="btn-common-width margin-left-10">取消</Button>
        </div>
      </Form>
    </div>
  </div>
</template>
<script>
import { queryCategory, queryCategoryAttribute, auditCommodity } from "@/api/commodity";

export default {
  name: "Publish",
  components: {},
  data() {
    return {
      submitDisabled: false,
      commodity: {
        id: "",
        commodityCode: "",
        commodityName: "",
        commodityType: 1,
        commodityPicture: "",
        description: "",
        additionalDescription: "",
        commodityCategoryId: "",
        price: "",
        commidityAttributeDetail: []
      },
      // 原厂属性首字母
      attributeFirstWord: "A",
      categoryList: [],
      categoryAttributeList: [],
      commodityCategoryId: "",
      defaultList: [
        // {
        //   name: "a42bdcc1178e62b4694c830f028db5c0",
        //   url:
        //     "https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar"
        // },
        // {
        //   name: "bc7521e033abdd1e92222d733590f104",
        //   url:
        //     "https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar"
        // }
      ],
      imgName: "",
      imgUrl: "",
      visible: false,
      uploadList: [],
      ruleValidate: {
        commodityName: [
          {
            required: true,
            message: "请输入商品标题",
            trigger: "change"
          }
        ],
        description: [
          {
            required: true,
            message: "请输入商品描述",
            trigger: "change"
          }
        ],
        additionalDescription: [
           {
            required: true,
            message: "请输入商家补充描述",
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {
    this.getCategoryList();
  },
  mounted() {
    this.uploadList = this.$refs.upload.fileList;
  },
  methods: {
    handleView(item) {
      this.imgName = item.name;
      this.imgUrl = item.url;
      this.visible = true;
    },
    handleRemove(file) {
      this.uploadList.splice(this.uploadList.indexOf(file), 1);
       if (this.uploadList != null && this.uploadList.length > 0) {
        var urls = "";
        for (var i = 0; i < this.uploadList.length; i++) {
          if (i != this.uploadList.length - 1) {
            urls += this.uploadList[i].url + ",";
          } else {
            urls += this.uploadList[i].url;
          }
        }
        this.commodity.commodityPicture = urls;
      }
    },
    handleSuccess(res, file) {
      if (res.code == "200") {
        file.url = "http://" + res.data;
      } else {
        this.$Message.error(res.msg);
      }
      var that = this;
      that.uploadList.push(file);
      if (that.uploadList != null && that.uploadList.length > 0) {
        var urls = "";
        for (var i = 0; i < that.uploadList.length; i++) {
          if (i != that.uploadList.length - 1) {
            urls += that.uploadList[i].url + ",";
          } else {
            urls += that.uploadList[i].url;
          }
        }
        that.commodity.commodityPicture = urls;
      }
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
      const check = this.uploadList.length < 5;
      if (!check) {
        this.$Notice.warning({
          title: "Up to five pictures can be uploaded."
        });
      }
      return check;
    },

    getCategoryList() {
      var that = this;
      let params = {
        pageNo: 1,
        numPerPage: 10,
        // 是否分页，0-不分页 1-分页
        isPage: 0
      };
      queryCategory(params).then(response => {
        let rdata = response.data;
        if (rdata.code == 200) {
          that.categoryList = rdata.data.recordList;
          that.commodity.commodityCategoryId = that.categoryList[0].id;
          let params = {
            id: that.commodity.commodityCategoryId,
            attributeType: that.commodity.commodityType
          };
          queryCategoryAttribute(params).then(response => {
            let rdata = response.data;
            if (rdata.code == 200) {
              that.categoryAttributeList = rdata.data.commidityAttributeDetail;
            }
          });
        } else {
          this.$Message.error("查询分类失败" + rdata.msg);
        }
      });
    },

    typeChange() {
      let that = this;
      that.categoryAttributeList = [];
      let params = {};
      if(that.commodity.commodityType == 1) {
        params = {
          id: that.commodity.commodityCategoryId,
          attributeType: that.commodity.commodityType

        };
      }else {
         params = {
          id: that.commodity.commodityCategoryId,
          attributeType: that.commodity.commodityType,
          attributeFirstWord: that.attributeFirstWord
        };
      }
      queryCategoryAttribute(params).then(response => {
        var rdata = response.data;
        if (rdata.code == 200) {
          that.categoryAttributeList = rdata.data.commidityAttributeDetail;
        }
      });
    },

    categoryChange() {
      let that = this;
      let params = {};
      if(that.commodityCategoryId == that.commodity.commodityCategoryId) {
          params = {
            id: that.commodity.commodityCategoryId,
            commodityCode: that.commodity.commodityCode,
            attributeType: that.commodity.commodityType
          };
      }else {
          params = {
            id: that.commodity.commodityCategoryId,
            attributeType: that.commodity.commodityType
          };
      }
      queryCategoryAttribute(params).then(response => {
        var rdata = response.data;
        if (rdata.code == 200) {
          that.categoryAttributeList = rdata.data.commidityAttributeDetail;
          if(rdata.data.commodityType) {
            that.commodity.commodityType = rdata.data.commodityType;
          }
        }
      });
    },

    queryCommodityCode() {
      let that = this;
      let params = {};
      if(that.commodity.commodityType == 1) {
        params = {
          id: that.commodity.commodityCategoryId,
          commodityCode: that.commodity.commodityCode,
          attributeType: that.commodity.commodityType
        };
      }else {
         params = {
          id: that.commodity.commodityCategoryId,
          commodityCode: that.commodity.commodityCode,
          attributeType: that.commodity.commodityType,
          attributeFirstWord: that.attributeFirstWord
        };
      }
      queryCategoryAttribute(params).then(response => {
        var rdata = response.data;
        if (rdata.code == 200) {
          that.commodity.id = rdata.data.id;
          that.categoryAttributeList = rdata.data.commidityAttributeDetail;
          that.commodity.commodityCategoryId = rdata.data.commodityCategoryId;
          that.commodityCategoryId = rdata.data.commodityCategoryId;
          that.commodity.commodityType = rdata.data.commodityType;
          that.commodity.commodityName = rdata.data.commodityName;
          that.commodity.description = rdata.data.description;
          that.commodity.additionalDescription = rdata.data.additionalDescription;
          that.commodity.price = rdata.data.price;
          that.commodity.commodityPicture = rdata.data.commodityPicture;
          // 图片回显
          that.uploadList = [];
          if(rdata.data.commodityPicture) {
            let pictures = rdata.data.commodityPicture.split(",");
            pictures.map(item => {
              that.uploadList.push({url: item, status: 'finished'});
            });
          }

        }
      });
    },

    save(name) {
       this.$refs[name].validate(valid => {
        if (valid) {
          this.submitDisabled = true;
          this.categoryAttributeList.map(item => {
            if(item.selectId) {
              let selectItem = item.childAttribute.filter(attribute => {
                return attribute.id == item.selectId;
              });
              let attributeDetail = {
                attributeName: selectItem[0].attributeName,
                attributeType: selectItem[0].attributeType,
                isAuditType: selectItem[0].isAuditType,
                parentAttributeId: item.id,
                parentAttributeName: selectItem[0].parentAttributeName,
                categoryAttributeId: selectItem[0].id
              };
              this.commodity.commidityAttributeDetail.push(attributeDetail);
            }
          });

          auditCommodity(this.commodity).then(response => {
            debugger
              var rdata = response.data;
              if (rdata.code == 200) {
                  this.$Message.success("保存成功");
                  window.history.go(-1);
              } else {
                  this.$Message.error("保存失败" + rdata.msg);
                  this.submitDisabled = false;
              }
          });
        }
       });

    },
  }
};
</script>
<style lang="less" scoped>
.table-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #000;
}

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

.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
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

.tr-span {
  position: absolute;
  left: 6px;
  top: 2px;
  font-size: 16px;
}

.input-price /deep/ input {
  padding: 5px 20px;
}
</style>
