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
        :model="refund"
      >
        <Col :span="24">
            <FormItem label="退款图片 :">
                <div class="img-upload">
                    <div class="demo-upload-list" v-for="item in uploadList">
                        <img :src="item.url">
                        <div class="demo-upload-list-cover">
                            <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                        </div>
                    </div>
                    <Modal title="图片预览" v-model="visible">
                        <img :src="imgUrl" v-if="visible" style="width: 100%">
                    </Modal>
                </div>
            </FormItem>
        </Col>
        <Col :span="24">
            <FormItem label="退款原因 :">
                <Input v-model="refund.applicationReason" style="width: 200px;" readonly></Input>
            </FormItem>
        </Col>
        <Col :span="24">
            <FormItem label="退款状态 :">
                <span>
                    <template v-if="refund.applicationStatus == '0'">
                        未处理
                    </template>
                    <template v-else-if="refund.applicationStatus == '1'">
                        申请通过
                    </template>
                    <template v-else-if="refund.applicationStatus == '2'">
                        申请拒绝
                    </template>
                </span>
            </FormItem>
        </Col>
        <Col :span="24">
            <FormItem label="退款类型:">
                <Select v-model="refund.applicationType" style="width: 200px;" disabled>
                    <Option :value="0">退款不退货</Option>
                    <Option :value="1">退款退货</Option>
                </Select>
            </FormItem>
        </Col>
        <Col :span="24">
            <FormItem label="订单号:">
                <Input v-model="refund.orderNo" style="width: 200px;" readonly></Input>
            </FormItem>
        </Col>
          <Col :span="24">
            <FormItem label="买家用户名称:">
                <Input v-model="refund.userName" style="width: 200px;" readonly></Input>
            </FormItem>
        </Col>
        <Col :span="24">
            <template v-for="commodity in refund.commodityInfos">
                <FormItem label="商品标题:">
                    <Input v-model="commodity.commodityName" style="width: 200px;" readonly></Input>
                </FormItem>
                <FormItem label="一口价:">
                    <div class="input-price">
                    <Input v-model="commodity.price" style="width: 200px;" readonly></Input>
                    <span class="tr-span">￥</span>
                    </div>
                </FormItem>
            </template>
        </Col>
         <Col :span="24">
            <FormItem label="付款金额:">
                <Input v-model="refund.payMoney" style="width: 200px;" readonly></Input>
            </FormItem>
        </Col>
        <Col :span="24">
            <FormItem label="联系方式:">
                <Input v-model="refund.contactWay" style="width: 200px;" readonly></Input>
            </FormItem>
        </Col>
        <Col :span="24">
            <FormItem label="订单状态:">
                <Select v-model="refund.payStatus" style="width: 200px;" disabled>
                    <Option :value="0">待付款</Option>
                    <Option :value="1">已付款</Option>
                    <Option :value="2">已发货</Option>
                    <Option :value="3">已收货</Option>
                    <Option :value="4">退款审核中</Option>
                    <Option :value="5">退款中</Option>
                    <Option :value="6">已退款</Option>
                    <Option :value="7">退款已拒绝</Option>
                    <Option :value="9">已取消</Option>
                    <Option :value="10">已删除</Option>
                </Select>
            </FormItem>
        </Col>
        <Col :span="24">
            <FormItem label="退款审核:">
              <RadioGroup v-model="refund.status">
                <Radio :label="1">通过</Radio>
                <Radio :label="2">拒绝</Radio>
              </RadioGroup>
            </FormItem>
        </Col>
        <Col :span="24">
            <FormItem label="退款地址:">
                <Input v-model="refund.returnAddress" style="width: 300px;"></Input>
            </FormItem>
        </Col>
        <Col :span="24">
            <FormItem label="退款拒绝原因:">
                <Input type="textarea"
                :rows="4"
                style="width: 500px"
                placeholder="请输入退款拒绝原因" 
                :maxlength="500"
                v-model="refund.refuseResaon" ></Input>
            </FormItem>
        </Col>
        </Form>
        <div class="text-center margin-top-10">
            <Button
              type="primary"
              class="btn-common-width"
              @click="save"
              :disabled="submitDisabled"
            >提交</Button>
        </div>
    </div>
  </div>
</template>
<script>
import { queryReFundOrderInfo, auditRefund } from "@/api/order";

export default {
  name: "RefundAudit",
  data() {
    return {
        imgName: "",
        imgUrl: "",
        visible: false,
        refund: {},
        uploadList: [],
        submitDisabled: false
    }
  },

  created() {
      
  },

  mounted() {
    let id = this.$route.query.id;
    this.getReFundOrderInfo(id);
  },

  methods: {

    handleView(item) {
      this.imgName = item.name;
      this.imgUrl = item.url;
      this.visible = true;
    },

    getReFundOrderInfo: function(id)  {
        let that = this;
        let params = {
            id: id
        }
        queryReFundOrderInfo(params).then(res => {
            if (res.data.code == "200") {
                that.refund = res.data.data;
                that.refund.status = 1;
                if (res.data.data.applicationPicture) {
                    let pictures = res.data.data.applicationPicture.split(",");
                    pictures.forEach(element => {
                        that.uploadList.push({ url: element, status: "finished" });
                    });
                };
            }else {
                this.$Message.error("查询退款订单失败" + res.data.msg);
            }
        });
    },

    save() {
        if(this.refund.status == 1) {
            if(this.refund.returnAddress == null || this.refund.returnAddress == '') {
                this.$Message.error("请填写退款地址!");
                return;
            }
        }else if(this.refund.status == 2){
             if(this.refund.refuseResaon == null || this.refund.refuseResaon == '') {
                this.$Message.error("请填写退款拒绝原因!")
                return;
            }
        }
        this.submitDisabled = true;
        let params = {
            orderId: this.refund.id,
            status: this.refund.status,
            refuseResaon: this.refund.refuseResaon,
            returnAddress: this.refund.returnAddress
        }
        auditRefund(params).then(res => {
            if (res.data.code == "200") {
                this.$Message.success("退款审核成功");
                this.$router.push({name: 'OrderList'});
            }else {
                 this.$Message.error("退款审核失败: " + res.data.msg);
            }
            this.submitDisabled = false;
        })
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
