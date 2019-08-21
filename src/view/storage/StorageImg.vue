<template>
    <div class="white-bg">
        <div class="table-scrollable left-right-table">
            <table border="1">
                <tbody>
                    <tr>
                        <td class="left-bg">编号：</td>
                        <td>AA0001</td>
                        <td class="left-bg">钢卷号：</td>
                        <td>223233232</td>
                    </tr>
                </tbody>
            </table>
        </div>
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
                    <!-- <div class="desc-content">
                        <span>描述：{{item.desc}}</span>
                    </div> -->
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
export default {
  name: "StorageImg",
  data() {
    return {
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


