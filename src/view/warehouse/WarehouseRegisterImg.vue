<template>
    <div class="white-bg">
        <Table :columns="tableColumns" :data="tableData" border></Table>
        <Row class="margin-top-20 margin-bottom-10">
            <Col span="24">
              <div class="table-title">照片(共8张)</div>
              <div class="clearfix margin-top-10">
                <div class="demo-upload-content" v-for="(item,index) in uploadList" :key="index">
                    <div class="demo-upload-list">
                        <img :src="item.url">
                        <div class="demo-upload-list-cover">
                            <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                        </div>
                    </div>
                    <div class="desc-content">
                        <span>描述：{{item.desc}}</span>
                    </div>
                </div>
            </div>
            <Modal title="查看图片" v-model="visible">
                <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" v-if="visible" style="width: 100%">
            </Modal>
            </Col>
        </Row>
    </div>
</template>
<script>
import { closeNowTag } from "@/libs/util";
export default {
  name: "WarehouseRegisterImg",
  data() {
    return {
      tableData: [
        {
          a: "AA0001",
          b: "沙钢",
          c: "带钢",
          d: "3.5*203",
          e: "Q235B",
          f: "清晰",
          g: "2342342"
        }
      ],
      tableColumns: [
        {
          title: "编号",
          key: "a",
          align: "left",
          minWidth: 100
        },
        {
          title: "产地",
          key: "b",
          align: "left",
          minWidth: 100
        },
        {
          title: "品名",
          key: "c",
          align: "left",
          minWidth: 100
        },
        {
          title: "规格",
          key: "d",
          align: "left",
          minWidth: 100
        },
        {
          title: "材质",
          key: "e",
          align: "left",
          minWidth: 100
        },
        {
          title: "外观",
          key: "f",
          align: "left",
          minWidth: 100
        },
        {
          title: "钢卷号",
          key: "g",
          align: "left",
          minWidth: 100
        }
      ],
      imgName: "",
      visible: false,
      uploadList: [
        {
          name: "a42bdcc1178e62b4694c830f028db5c0",
          url:
            "https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar",
          desc: "图片1"
        },
        {
          name: "bc7521e033abdd1e92222d733590f104",
          url:
            "https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar",
          desc: "图片2"
        },
        {
          name: "a42bdcc1178e62b4694c830f028db5c0",
          url:
            "https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar",
          desc: "图片1"
        },
        {
          name: "bc7521e033abdd1e92222d733590f104",
          url:
            "https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar",
          desc: "图片2"
        },
        {
          name: "a42bdcc1178e62b4694c830f028db5c0",
          url:
            "https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar",
          desc: "图片1"
        },
        {
          name: "bc7521e033abdd1e92222d733590f104",
          url:
            "https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar",
          desc: "图片2"
        },
        {
          name: "a42bdcc1178e62b4694c830f028db5c0",
          url:
            "https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar",
          desc: "图片1"
        },
        {
          name: "bc7521e033abdd1e92222d733590f104",
          url:
            "https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar",
          desc: "图片2"
        }
      ],
      stockList: [{ label: "AT001", value: 1 }, { label: "AT002", value: 2 }]
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      // getTableData(params).then(res => {
      //     this.tableData = res.data.list;
      //     this.total = res.data.total;
      // });
    },
    handleView(name) {
      this.imgName = name;
      this.visible = true;
    },
    submitFun() {
      this.$Modal.confirm({
        title: "提示",
        content: "请确认是否提交审核结果？",
        onOk: () => {
          this.$Message.success({
            content: "提交成功!",
            duration: 1
          });
          setTimeout(() => {
            closeNowTag(this.$store.state.app, this.$route);
            this.$router.push({
              path: "WarehouseRegister"
            });
          }, 1000);
        },
        onCancel: () => {
        }
      });
    }
  }
};
</script>
<style>
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
.link-more{
  float:left;
  width: 120px;
  height: 120px;
  text-align: center;
  line-height: 120px;
  border: 1px solid transparent;
  border-radius: 4px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
}
</style>


