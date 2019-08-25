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
            <Form :label-width="200" class="search-form" ref="commodityform" :model="commodity" :rules="ruleValidate">
                <div class="table-title">发布商品</div>
                <hr class="line">
                <Row type="flex" justify="space-between">
                    <Col :sm="12" :xs="24">
                    <FormItem label="订单编号:" prop="commodityCode">
                        <Input v-model="commodity.commodityCode" :maxlength="30"></Input>
                    </FormItem>
                    </Col>
                    <Col :sm="12" :xs="24">
                    <FormItem label="商品标题:" prop="commodityName">
                        <Input v-model="commodity.commodityName" :maxlength="30"></Input>
                    </FormItem>
                    </Col>
                    <Col :span="24" style="margin-bottom: 10px;">
                    <div class="clearfix">
                        <label class="ivu-form-item-label" style="width: 200px;">
                            上传图片:
                        </label>
                        <imgUpload ref="imgUpload" :imgPath="commodity.commodityPicture" @change="upload"></imgUpload>
                    </div>
                    </Col>
                    <Col :sm="12" :xs="24">
                    <FormItem label="商品描述:">
                        <textarea style="height:100px;width:388px;padding:3px;border-radius:5px" placeholder="请输入商品描述" v-model="commodity.description" :maxlength="500"></textarea>
                    </FormItem>
                    </Col>
                    <Col :span="24" style="margin-bottom: 10px;">
                    <FormItem label="产品分类:" prop="commodityCategoryId">
                        <RadioGroup v-model="commodity.commodityCategoryId">
                            <Radio v-for="category in categoryList" :key="category.id" :label="category.id">{{category.categoryName}}</Radio>
                        </RadioGroup>
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
    import imgUpload from "@/components/img/imgUpload";
    import {queryCategory, queryCategoryAttribute} from "@/api/commodity";

    export default {
        name: "Publish",
        components: {
            imgUpload
        },
        data() {
            return {
                commodity: {
                    commodityCode: "",
                    commodityName: "",
                    commodityType: 1,
                    commodityPicture: "",
                    description: "",
                    commodityCategoryId: ""
                },
                categoryList: [],
                categoryAttributeList: [],
                ruleValidate: {
                    commodityCode: [{
                        message: "请选择是否支持月结",
                        trigger: "change",
                        type: "number"
                    }],
                    commodityName: [{
                        required: true,
                        message: "请输入商品标题",
                        trigger: "change"
                    }],
                    description: [{
                        required: true,
                        message: "请输入商品描述",
                        trigger: "change"
                    }],
                    commodityCategoryId: [{
                        required: true,
                        message: "请选择商品分类",
                        trigger: "change",
                        type: 'number'
                    }]
                }
            };
        },
        created() {
            this.getCategoryList();
        },
        mounted() {},
        methods: {
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
                                that.categoryAttributeList = rdata.data;
                            }
                        });
                    } else {
                        this.$Message.error("查询分类失败" + rdata.msg);
                    }
                });
            },
            upload(imgs) {
                var that = this;
                // var datas = that.$refs.imgUpload.$data.datas;
                if (imgs != null && imgs.length > 0) {
                    var urls = "";
                    for (var i = 0; i < imgs.length; i++) {
                        if (i != imgs.length - 1 && imgs[i].urlPath) {
                            urls += imgs[i].urlPath + ",";
                        } else {
                            urls += imgs[i].urlPath;
                        }
                    }
                    that.commodity.commodityPicture = urls;
                }
            }
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
</style>