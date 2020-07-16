<template>
  <div class="main">
    <div class="content">
      <Form
        :label-width="200"
        class="search-form"
        ref="commodityform"
        :model="commodity"
        :rules="ruleValidate"
      >
        <div class="table-title">产品数据详情</div>
        <hr class="line">
        <Row type="flex" justify="space-between">
          <!-- <Col :sm="12" :xs="24">
            <FormItem label="商品编号:">
              <Input
                type="text"
                v-model="commodity.commodityCode"
                :maxlength="30"
                @on-enter="queryCommodity"
              ></Input>
            </FormItem>
          </Col> -->
          <!-- <Col :sm="12" :xs="24">
            <FormItem label="商品标题:" prop="commodityName">
              <Input v-model="commodity.commodityName" :maxlength="30"></Input>
            </FormItem>
          </Col> -->
          <!-- <Col :span="24">
            <FormItem label="上传图片 :">
              <div class="clearfix">
                <div class="demo-upload-list" v-for="(item,index) in uploadList">
                  <template v-if="item.status === 'finished'">
                    <img :src="item.url">
                    <div class="demo-upload-list-cover">
                      <Icon type="md-arrow-back"  @click.native="moveLeft(index)"></Icon>
                      <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                      <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                      <Icon type="md-arrow-forward" @click.native="moveRight(index)"></Icon>
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
              </div>
            </FormItem>
          </Col> -->
          <!-- <Col  :span="24">
            <FormItem label="商品描述:">
              <Input
                type="textarea"
                :rows="4"
                style="max-width: 500px;"
                placeholder="请输入商品描述"
                v-model="commodity.description"
                :maxlength="500"
              ></Input>
            </FormItem>
          </Col> -->
          <!-- <Col :span="24" style="margin-bottom: 10px;">
            <FormItem label="产品分类:">
              <RadioGroup v-model="commodity.commodityCategoryId" @on-change="categoryChange">
                <Radio
                  v-for="(category,index) in categoryList"
                  :key="index"
                  :label="category.id"
                >{{category.categoryName}}</Radio>
              </RadioGroup>
            </FormItem>
          </Col> -->
          <!-- <Col :sm="12" :xs="24">
            <FormItem label="一口价:" prop="price">
              <div class="input-price">
                <Input style="width: 200px;" v-model="commodity.price"></Input>
                <span class="tr-span">￥</span>
              </div>
            </FormItem>
          </Col> -->
          <Col :sm="12" :xs="24">
            <FormItem label="原厂/非原厂:">
              <RadioGroup v-model="commodity.commodityType" @on-change="typeChange">
                <Radio :label="0">原厂</Radio>
                <Radio :label="1">非原厂</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24">
            <FormItem>
             <template v-if="commodity.commodityType == 0">
                <Input
                  style="width: 50px;"
                  v-model="attributeFirstWord"
                  :maxlength="1"
                  @input="typeChange"
                />
              </template>
              <template v-else>
                <Input
                  style="width: 50px;"
                  v-model="attributeFirstWord"
                  :maxlength="1"
                  @input="queryFactoryBrand()"
                />
              </template>
              (汽车品牌名称首字母,不区分大小写)
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
              </div>
            </FormItem>
          </Col>
          <Col :span="24">
            <FormItem label="运费方式:">
              <Select v-model="commodity.freightType" style="width: 200px;">
                <Option :value="0">包邮 </Option>
                <Option :value="1">到付</Option>
              </Select>
            </FormItem>
          </col>
          <!-- <Col :span="24">
            <FormItem label="商家补充描述:" prop="additionalDescription">
              <Input
                type="textarea"
                :rows="4"
                style="max-width: 500px"
                placeholder="请输入商家补充描述"
                v-model="commodity.additionalDescription"
                :maxlength="500"
              ></Input>
            </FormItem>
          </Col> -->
        </Row>
        <div class="text-center margin-top-10">
            <Button
              type="primary"
              class="btn-common-width"
              @click="save(1)"
              :disabled="submitDisabled"
            >完成</Button>
        </div>
        <Modal title="图片预览" v-model="visible">
          <img :src="imgUrl" v-if="visible" style="width: 100%">
        </Modal>
      </Form>
    </div>
  </div>
</template>
<script>
import {
  queryCategory,
  queryCategoryAttribute,
  auditCommodity,
  queryFactoryBrand
} from '@/api/commodity'

export default {
  name: 'Publish',
  components: {},
  data () {
    return {
      submitDisabled: false,
      commodity: {
        id: '',
        commodityCode: '',
        auditStatus: '',
        commodityName: '',
        commodityType: 1,
        commodityPicture: '',
        description: '',
        additionalDescription: '',
        commodityCategoryId: '',
        price: '',
        freightType: 0,
        commidityAttributeDetail: []
      },
      // 原厂属性首字母
      attributeFirstWord: 'A',
      categoryList: [],
      categoryAttributeList: [],
      commodityCategoryId: '',
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
      brandList: [],
      brandValue: [],
      imgName: '',
      imgUrl: '',
      visible: false,
      uploadList: [],
      uploadList1: [],
      ruleValidate: {
        // commodityName: [
        //   {
        //     type: 'string',
        //     min: 12,
        //     required: true,
        //     message: "请输入商品标题(最少12个字符)",
        //     trigger: "change"
        //   }
        // ],
        // description: [
        //   {
        //     required: true,
        //     message: "请输入商品描述",
        //     trigger: "change"
        //   }
        // ],
        // additionalDescription: [
        //   {
        //     required: true,
        //     message: "请输入商家补充描述",
        //     trigger: "change"
        //   }
        // ],
        // price: [
        //  {required: true, message: "请输入一口价"},
        // ]
      }
    }
  },
  created () {
    this.getCategoryList()
  },
  mounted () {
  },
  methods: {
    handleView (item) {
      this.imgName = item.name
      this.imgUrl = item.url
      this.visible = true
    },
    handleRemove (file) {
      this.uploadList.splice(this.uploadList.indexOf(file), 1)
    },
    handleRemove1 (file) {
      this.uploadList1.splice(this.uploadList1.indexOf(file), 1)
    },
    handleSuccess (res, file) {
      if (res.code == '200') {
        file.url = 'http://' + res.data
      } else {
        this.$Message.error(res.msg)
      }
      if (this.uploadList.length >= 8) {
        this.$Message.error('发布商品图片最多上传八张!')
        return
      }
      this.uploadList.push(file)
    },
    handleSuccess1 (res, file) {
      if (res.code == '200') {
        file.url = 'http://' + res.data
      } else {
        this.$Message.error(res.msg)
      }
      this.uploadList1.push(file)
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc:
          '文件格式 ' +
          file.name +
          ' 不正确, 请选择 jpg or png文件.'
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '文件大小超限',
        desc: '文件  ' + file.name + ' 太大，上传文件大小不能超过50M.'
      })
    },
    handleBeforeUpload () {
      const check = this.uploadList.length < 8
      if (!check) {
        this.$Notice.warning({
          title: '最多上次8张图片.'
        })
      }
      return check
    },
    handleBeforeUpload1 () {
      const check = this.uploadList1.length < 5
      if (!check) {
        this.$Notice.warning({
          title: '最多上次5张图片.'
        })
      }
      return check
    },

    getCategoryList () {
      var that = this
      let params = {
        pageNo: 1,
        numPerPage: 10,
        // 是否分页，0-不分页 1-分页
        isPage: 0
      }
      queryCategory(params).then(response => {
        let rdata = response.data
        if (rdata.code == 200) {
          that.categoryList = rdata.data.recordList
          let commodityCode = that.$route.query.commodityCode
          let commodityType = that.$route.query.commodityType ? that.$route.query.commodityType : 0
          let commodityCategoryId = that.$route.query.commodityCategoryId
          let commodityId = that.$route.query.commodityId
          if (commodityId) {
            that.commodity.id = commodityId
            that.commodity.commodityCode = commodityCode
            that.commodity.commodityType = commodityType
            that.commodity.commodityCategoryId = commodityCategoryId
            that.queryCommodity()
          } else {
            that.commodity.commodityCategoryId = that.categoryList[0].id
            var param = {
              id: that.commodity.commodityCategoryId,
              attributeType: that.commodity.commodityType
            }
            queryCategoryAttribute(param).then(response => {
              let rdata = response.data
              if (rdata.code == 200) {
                that.categoryAttributeList = Object.assign([], rdata.data.commidityAttributeDetail)
              }
            })
            that.queryFactoryBrand()
          }
        } else {
          this.$Message.error('查询分类失败' + rdata.msg)
        }
      })
    },

    typeChange () {
      let that = this
      that.categoryAttributeList = []
      let params = {}
      if (that.commodity.commodityType == 1) {
        params = {
          id: that.commodity.commodityCategoryId,
          attributeType: that.commodity.commodityType
        }
      } else {
        params = {
          id: that.commodity.commodityCategoryId,
          attributeType: that.commodity.commodityType,
          attributeFirstWord: that.attributeFirstWord
        }
      }
      queryCategoryAttribute(params).then(response => {
        var rdata = response.data
        if (rdata.code == 200) {
          that.categoryAttributeList = rdata.data.commidityAttributeDetail
        }
      })
      this.queryFactoryBrand()
    },

    categoryChange () {
      let that = this
      let params = {}
      if (that.commodityCategoryId == that.commodity.commodityCategoryId) {
        params = {
          id: that.commodity.commodityCategoryId,
          commodityCode: that.commodity.commodityCode,
          attributeType: that.commodity.commodityType,
          attributeFirstWord: that.attributeFirstWord
        }
      } else {
        params = {
          id: that.commodity.commodityCategoryId,
          attributeType: that.commodity.commodityType,
          attributeFirstWord: that.attributeFirstWord
        }
      }
      queryCategoryAttribute(params).then(response => {
        var rdata = response.data
        if (rdata.code == 200) {
          that.categoryAttributeList = rdata.data.commidityAttributeDetail
          if (rdata.data.commodityType) {
            that.commodity.commodityType = rdata.data.commodityType
          }
        }
      })
    },

    queryCommodity () {
      let that = this
      let params = {}
      if (that.commodity.commodityType == 1) {
        params = {
          id: that.commodity.commodityCategoryId,
          commodityId: that.commodity.commodityId,
          commodityCode: that.commodity.commodityCode,
          attributeType: that.commodity.commodityType
        }
      } else {
        params = {
          id: that.commodity.commodityCategoryId,
          commodityId: that.commodity.commodityId,
          commodityCode: that.commodity.commodityCode,
          attributeType: that.commodity.commodityType,
          attributeFirstWord: that.attributeFirstWord
        }
      }
      queryCategoryAttribute(params).then(response => {
        var rdata = response.data
        if (rdata.code == 200) {
          that.commodity.id = rdata.data.id
          that.categoryAttributeList = rdata.data.commidityAttributeDetail
          that.categoryAttributeList.forEach(item => {
            if (item.attributeName.indexOf('划痕') > -1 && item.pictureUrls != null) {
              let imgUrls = item.pictureUrls.split(',')
              imgUrls.map(url => {
                that.uploadList1.push({ url: url, status: 'finished' })
              })
            }
          })
          that.commodity.commodityCategoryId = rdata.data.commodityCategoryId
          that.commodityCategoryId = rdata.data.commodityCategoryId
          that.commodity.commodityType = rdata.data.commodityType
          that.commodity.commodityName = rdata.data.commodityName
          that.commodity.freightType = rdata.data.freightType
          that.commodity.description = rdata.data.description
          that.commodity.additionalDescription = rdata.data.additionalDescription
          that.commodity.price = rdata.data.price
          that.commodity.commodityPicture = rdata.data.commodityPicture
          // 非原厂回显车型
          if (that.commodity.commodityType == 1) {
            that.brandValue = rdata.data.noFactoryCarBrands
            that.attributeFirstWord = rdata.data.noFactoryCarBrandsFirstWord
          }
          // 图片回显
          that.uploadList = []
          if (rdata.data.commodityPicture) {
            let pictures = rdata.data.commodityPicture.split(',')
            pictures.map(item => {
              that.uploadList.push({ url: item, status: 'finished' })
            })
          };
          that.queryFactoryBrand()
        }
      })
    },

    save (status) {
      this.commodity.auditStatus = status
      this.submitDisabled = true
      this.categoryAttributeList.forEach(item => {
        if (item.isManualInput == 0) {
          if (item.selectId) {
            let selectItem = item.childAttribute.filter(attribute => {
              return attribute.id == item.selectId
            })
            let attributeDetail = {}
            if (selectItem[0].attributeName == '其他' || selectItem[0].attributeName == '其它') {
              attributeDetail = {
                attributeName: selectItem[0].attributeName,
                attributeType: selectItem[0].attributeType,
                isAuditType: selectItem[0].isAuditType,
                parentAttributeId: item.id,
                parentAttributeName: selectItem[0].parentAttributeName,
                categoryAttributeId: selectItem[0].id,
                inputContext: item.inputContext,
                isCarBrand: 0
              }
            } else {
              // 判断属性是否包含有划痕
              if (item.attributeName.indexOf('划痕') > -1) {
                let pictureUrls = ''
                if (this.uploadList1 != null && this.uploadList1.length > 0) {
                  for (var i = 0; i < this.uploadList1.length; i++) {
                    if (i != this.uploadList1.length - 1) {
                      pictureUrls += this.uploadList1[i].url + ','
                    } else {
                      pictureUrls += this.uploadList1[i].url
                    }
                  }
                }
                attributeDetail = {
                  attributeName: selectItem[0].attributeName,
                  attributeType: selectItem[0].attributeType,
                  isAuditType: selectItem[0].isAuditType,
                  parentAttributeId: item.id,
                  parentAttributeName: selectItem[0].parentAttributeName,
                  categoryAttributeId: selectItem[0].id,
                  pictureUrls: pictureUrls,
                  isCarBrand: 0
                }
              } else {
                attributeDetail = {
                  attributeName: selectItem[0].attributeName,
                  attributeType: selectItem[0].attributeType,
                  isAuditType: selectItem[0].isAuditType,
                  parentAttributeId: item.id,
                  parentAttributeName: selectItem[0].parentAttributeName,
                  categoryAttributeId: selectItem[0].id,
                  isCarBrand: 0
                }
              }
            }
            this.commodity.commidityAttributeDetail.push(attributeDetail)
          }
        } else if (item.isManualInput == 1) {
          let attributeDetail = {
            attributeType: item.attributeType,
            isAuditType: item.isAuditType,
            parentAttributeId: item.id,
            parentAttributeName: item.attributeName,
            inputContext: item.inputContext,
            isCarBrand: 0
          }
          this.commodity.commidityAttributeDetail.push(attributeDetail)
        }
      })
      // 保存适用车型
      if (this.commodity.commodityType == 1 && this.brandValue.length > 0) {
        let brand = {}
        let child = {}
        this.brandList.forEach(item => {
          if (this.brandValue[0] == item.value) {
            brand = item
          }
        })
        if (this.brandValue.length > 1) {
          brand.children.forEach(item => {
            if (this.brandValue[1] == item.value) {
              child = item
            }
          })
        }
        let attributeDetail = {}
        if (Object.keys(child).length != 0) {
          attributeDetail = {
            attributeName: child.label,
            attributeType: '',
            isAuditType: child.isAuditType,
            parentAttributeId: child.parentId,
            parentAttributeName: child.parentAttributeName,
            categoryAttributeId: child.value,
            isCarBrand: 1
          }
        } else {
          attributeDetail = {
            attributeName: brand.label,
            attributeType: '',
            isAuditType: brand.isAuditType,
            parentAttributeId: brand.value,
            parentAttributeName: brand.label,
            categoryAttributeId: brand.value,
            isCarBrand: 1
          }
        }
        this.commodity.commidityAttributeDetail.push(attributeDetail)
      };
      if (this.uploadList != null && this.uploadList.length > 0) {
        let urls = ''
        for (var i = 0; i < this.uploadList.length; i++) {
          if (i != this.uploadList.length - 1) {
            urls += this.uploadList[i].url + ','
          } else {
            urls += this.uploadList[i].url
          }
        }
        this.commodity.commodityPicture = urls
      };

      window.localStorage.setItem('commodity', JSON.stringify(this.commodity))

      //     const u = window.navigator.userAgent;

      //     const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      //     if (isiOS) {
      //         //vue调用iOS方法，且传值给iOS （iOS 方法名为 onItemClick）
      //         window.webkit.messageHandlers.onItemClick.postMessage(
      //           this.commodity
      //         );
      //       } else {
      //         //vue调用Android方法，且传值给Android （Android方法名为 onItemClick）
      //         window.$App.onItemClick(
      //          this.commodity
      //         );
      //       }
      auditCommodity(this.commodity).then(response => {
        var rdata = response.data
        if (rdata.code == 200) {
          window.alert('保存成功')
          // this.$Message.success("保存成功");
          // window.location.reload();
        } else {
          // window.alert("保存失败!");
          this.$Message.error('保存失败' + rdata.msg)
          // this.submitDisabled = false;
          window.location.reload()
        }
      })
    },

    selectChange (option, index) {
      if (option.label != '其它' && option.label != '其他') {
        this.categoryAttributeList[index].inputContext = null
      } else {
        this.categoryAttributeList[index].inputContext = ''
      }
    },

    queryFactoryBrand () {
      let params = {
        attributeFirstWord: this.attributeFirstWord
      }
      queryFactoryBrand(params).then(response => {
        let rdata = response.data
        if (rdata.code = 200) {
          this.brandList = rdata.data
        }
      })
    },

    moveLeft (index) {
      if (index != 0) {
        this.uploadList[index] = this.uploadList.splice(index - 1, 1, this.uploadList[index])[0]
      } else {
        this.uploadList.push(this.uploadList.shift())
      }
    },

    moveRight (index) {
      if (index != this.uploadList.length - 1) {
        this.uploadList[index] = this.uploadList.splice(index + 1, 1, this.uploadList[index])[0]
      } else {
        this.uploadList.unshift(this.uploadList.splice(index, 1)[0])
      }
    }
  }
}
</script>
<style lang="less" scoped>
.main {
    overflow-x: hidden;
    height:100%;
    overflow: auto;
    padding: 15px;
    width: 100%;
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
