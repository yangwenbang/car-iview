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
            <FormItem label="商品编号:">
              <Input
                type="text"
                v-model="commodity.commodityCode"
                :maxlength="30"
                @on-enter="queryCommodityCode"
              ></Input>
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
                  :max-size="50*1024"
                  :on-format-error="handleFormatError"
                  :on-exceeded-size="handleMaxSize"
                  :before-upload="handleBeforeUpload"
                  multiple
                  type="drag"
                  action="/car/qualityshop/uploadPicture"
                  style="display: inline-block;width:100px;"
                >
                  <div style="width: 100px;height:100px;line-height: 100px;">
                    <Icon type="ios-camera" size="20"></Icon>
                  </div>
                </Upload>
                <Modal title="图片预览" v-model="visible">
                  <img :src="imgUrl" v-if="visible" style="width: 100%">
                </Modal>
              </div>
            </FormItem>
          </Col>
          <Col  :span="24">
            <FormItem label="商品描述:">
              <Input
                type="textarea"
                :rows="4"
                style="width: 500px"
                placeholder="请输入商品描述"
                v-model="commodity.description"
                :maxlength="500"
              ></Input>
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
            <FormItem label="一口价:" prop="price">
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
              <template v-if="commodity.commodityType == 0">
                <Input
                  style="width: 200px;"
                  v-model="attributeFirstWord"
                  :maxlength="1"
                  @input="typeChange"
                />
              </template>
              <template v-else>
                <Input
                  style="width: 200px;"
                  v-model="attributeFirstWord"
                  :maxlength="1"
                  @input="queryFactoryBrand()"
                />
              </template>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24" v-if="commodity.commodityType == 1">
            <FormItem label="适用车型:">
               <Cascader :data="brandList" trigger="hover" :disabled="attributeFirstWord == ''? true : false" filterable change-on-select v-model="brandValue"  style="width: 200px;"></Cascader>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24" v-for="(categoryAttribute, index) in categoryAttributeList" :key="index">
            <FormItem :label="categoryAttribute.attributeName + ':'">
              <template v-if="categoryAttribute.isManualInput == 0">
                <Select
                  label-in-value
                  v-model="categoryAttribute.selectId"
                  clearable
                  filterable
                  style="width: 200px;"
                  @on-change="selectChange($event, index)"
                >
                  <Option
                    v-for="attribute in categoryAttribute.childAttribute"
                    :key="attribute.id"
                    :value="attribute.id"
                  >{{attribute.attributeName}}</Option>
                </Select>
                <Input
                  style="width: 200px; margin-left: 10px;"
                  v-if="categoryAttribute.inputContext != null"
                  v-model="categoryAttribute.inputContext"
                />
              </template>
              <template v-else>
                <Input v-model="categoryAttribute.inputContext" style="width: 200px;"/>
              </template>
            </FormItem>
            <FormItem label="请上传划痕图片: " v-if="categoryAttribute.attributeName.indexOf('划痕') > -1">
              <div class="attrUploadPic">
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
                  :default-file-list="defaultList"
                  :on-success="handleSuccess1"
                  :format="['jpg','jpeg','png']"
                  :max-size="50*1024"
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
                <Modal title="图片预览" v-model="visible">
                  <img :src="imgUrl" v-if="visible" style="width: 100%">
                </Modal>
              </div>
            </FormItem>
          </Col>
          <Col :span="24">
            <FormItem label="商家补充描述:" prop="additionalDescription">
              <Input
                type="textarea"
                :rows="4"
                style="width: 500px"
                placeholder="请输入商家补充描述"
                v-model="commodity.additionalDescription"
                :maxlength="500"
              ></Input>
            </FormItem>
          </Col>
        </Row>
        <div class="text-center margin-top-10">
          <template v-if="commodity.commodityCode">
            <Button
              type="primary"
              class="btn-common-width"
              @click="save('commodityform', 1)"
              :disabled="submitDisabled"
            >上架</Button>
            <Button type="dashed" class="btn-common-width" @click="save('commodityform', 2)">下架</Button>
          </template>
          <template v-else>
            <Button
              type="primary"
              class="btn-common-width"
              @click="save('commodityform', 1)"
              :disabled="submitDisabled"
            >上架</Button>
          </template>
        </div>
      </Form>
    </div>
  </div>
</template>
<script>
import { queryReFundOrderInfo, auditRefund } from "@/api/order";
import { delimiter } from 'path';

export default {
  name: "RefundAudit",
  data() {
    return {
    }
  },
  created() {
  },
  mounted() {
    debugger
    var that = this;
    let id = that.$router.query.id;
    this.getReFundOrderInfo(id);
  },
  methods: {
    getReFundOrderInfo: function(id)  {

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
  width: 102px;
  height: 102px;
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
  width: 102%;
  height: 102%;
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

.attrUploadPic {
  display: inline-block;
}

.table-title {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}
</style>
