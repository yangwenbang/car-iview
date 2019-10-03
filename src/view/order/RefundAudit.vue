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
                    <div class="demo-upload-list" v-for="item in applicationPicture">
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

      </Form>
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
        uploadList: []
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
        let params = {
            id: id
        }
        queryReFundOrderInfo(params).then(res => {
            if (res.data.code == "200") {
                this.refund = res.data.data;
                if (this.refund.applicationPicture) {
                    let pictures = this.refund.applicationPicture.split(",");
                    pictures.map(item => {
                        this.uploadList.push({ url: item, status: "finished" });
                    });
                };
            }else {
                this.$Message.error("查询退款订单失败" + res.data.msg);
            }
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
