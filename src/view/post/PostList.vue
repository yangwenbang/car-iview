<template>
  <div class="white-bg device-manage">
    <Form :label-width="150" class="search-form">
      <Row type="flex" justify="space-between">
        <Col :sm="8" :xs="24">
            <FormItem label="发贴标题:">
              <Input v-model="searchForm.publishTitle"></Input>
            </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
            <FormItem label="发贴人名称:">
              <Input v-model="searchForm.publishUserName"></Input>
            </FormItem>
        </Col>
        <Col :sm="8" :xs="24"></Col>
        <Col span="6">
            <Button type="primary" @click="publish">发帖</Button>
        </Col>
        <Col :span="18" class="text-right">
          <FormItem>
            <Button type="primary" @click="search">查询</Button>
            <Button style="margin-left: 8px" @click="reset">重置</Button>
          </FormItem>
        </Col>
      </Row>
      <Modal title="头像预览" v-model="visible">
          <img :src="imgUrl" v-if="visible" style="width: 100%">
      </Modal>
      <Modal ref="modal" v-model="modal" width="800px" :title="modalTitle" @on-ok="submit">
          <Form ref="formValidate" :model="changeForm" :rules="ruleValidate" :label-width="100">
              <FormItem label="发帖标题:" prop="publishTitle" >
                <Input v-model="changeForm.publishTitle" style="width: 500px;" placeholder="请输入帖子标题" :maxlength="20"></Input>
              </FormItem>
              <FormItem label="发帖内容:" prop="publishContent">
                <!-- <div ref="editorElem" style="text-align:left;"></div> -->
                <Input
                type="textarea"
                :rows="4"
                style="width: 500px"
                placeholder="请输入发帖内容"
                v-model="changeForm.publishContent"
                :maxlength="500"
                ></Input>
              </FormItem>
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
              <FormItem label="发贴地址:">
                <al-cascader v-model="addressArray" level="2" style="width: 300px;"/>
              </FormItem>
              <FormItem label="详细地址">
                <Input v-model="changeForm.detailAddress" style="width: 300px;"></Input>
              </FormItem>
              <FormItem label="是否置顶:" style="width: 200px;">
                <Select v-model="changeForm.isTop">
                  <Option :value="0">否</Option>
                  <Option :value="1">是</Option>
                </Select>
              </FormItem>
          </Form>
          <div slot="footer">
              <Button type="text" size="large" @click="cancel">取消</Button>
              <Button type="primary" size="large" @click="submit" :disabled="submitDisabled">确定</Button>
          </div>
      </Modal>
    </Form>
    <Table
      :columns="tableColumns"
      :data="tableData"
      border
    ></Table>
    <div class="page-wrapper">
      <div v-if="this.$store.state.app.screenSize>768">
        <span class="left">共{{total}}条记录 第{{pageNum}}页 / 共{{Math.ceil(total / pageSize)}}页</span>
        <Page
          class="pull-right"
          :current="pageNum"
          :total="total"
          :page-size="pageSize"
          @on-change="pageChange"
          @on-page-size-change="pageSizeChange"
          show-sizer
          show-elevator
        />
      </div>
      <div v-if="this.$store.state.app.screenSize<=768">
        <Page
          class="pull-right"
          :current="pageNum"
          :page-size="pageSize"
          :total="total"
          @on-change="pageChange"
          simple
        />
      </div>
    </div>
  </div>
</template>

<script>
import E from "wangeditor";
import { queryPublishPostList, queryPublishPostInfo, deletePublishPost, saveOrUpdatePost } from "@/api/post";
import { formatDate } from "@/libs/util";
export default {
  name: "PostList",
  data() {
    return {
      editor: null,
      submitDisabled: false,
      pageNum: 1,
      total: 0,
      pageSize: 10,
      imgUrl: "",
      visible: false,
      modal: false,
      modalTitle: '修改帖子',
      uploadList: [],
      addressArray: [],
      changeForm: {
        id: "",
        publishTitle: "",
        publishContent: "",
        publishPicture: "",
        publishAddress: "",
        detailAddress: "",
        isTop: 0
      },
      searchForm: {
        publishTitle: "",
        publishUserName: ""
      },
      tableData: [],
      tableColumns: [
        {
          title: "发布人名称",
          key: "publishUserName",
          minWidth: 50
        },
        {
          title: "发布人头像",
          key: "publishUserPicture",
          minWidth: 50,
          align: 'center',
          render: (h, data) => {
            return h('div', [
                  h('img', {
                    class: ['img-pointer'],
                    style: {
                        width: "30px",
                        verticalAlign: "middle",
                    },
                    attrs: {
                        src: data.row.publishUserPicture
                    },
                    on: {
                        click: () => {
                          this.handleView(data.row)
                        }
                    }
                  })
              ], '');
            }
        },
        {
          title: "是否置顶",
          key: "isTop",
          minWidth: 30,
          render: (h, data) => {
            if (data.row.isTop == "0") {
              return h("span", "否");
            } else if (data.row.isTop == "1") {
              return h("span", "是");
            }
          }
        },
        {
          title: "发贴标题",
          key: "publishTitle",
          minWidth: 50
        },
        {
          title: "发贴内容",
          key: "publishContent",
          minWidth: 100,
          render: (h, data) => {
            return h("div", {
                class: {
                  'ivu-table-cell-tooltip-content': true
                },
                attrs: {
                  title: data.row.publishContent
                },
                domProps: {
                  innerHTML: data.row.publishContent
                }
            }, );
          }
        },
        {
          title: "发布时间",
          key: "publishTime",
          minWidth: 50,
        },
        {
          title: "发贴地址",
          key: "",
          minWidth: 100,
          render: (h, data) => {
            return h("span", data.row.publishAddress + data.row.detailAddress);
          }
        },
        {
          title: "操作",
          key: "",
          fixed: "right",
          minWidth: 140,
          render: (h, data) => {
            return h("div", [
              h("span",{
                class: "tb-link margin-right-10",
                on: {
                  click: () => {
                  }
                }
              },
              "查看"),
              h("span",{
                class: "tb-link margin-right-10",
                on: {
                  click: () => {

                  }
                }
              },
              "修改"),
              h("span",{
                class: "tb-link margin-right-10",
                on: {
                  click: () => {
                     this.$Modal.confirm({
                        title: '删除帖子',
                        content: '是否要删除该帖子？',
                        onOk: () => {
                            let params = {
                                id: data.row.id
                            }
                            deletePublishPost(params).then(res => {
                                if (res.data.code == "200") {
                                    this.$Message.success({
                                        content: '删除成功',
                                        duration: 1
                                    });
                                    this.queryPublishPostList(this.pageNum, this.pageSize)
                                } else {
                                    this.$Message.error({
                                        content: res.data.msg,
                                        duration: 1
                                    });
                                }
                            })
                        }
                    })
                  }
                }
              },
              "删除"),
            ]);
          }
        }
      ],
      ruleValidate: {
          publishTitle: [
              { required: true, message: '发帖标题不能为空', trigger: 'blur' }
          ],
          publishContent: [
              { required: true, message: '发帖内容不能为空', trigger: 'blur'}
          ]
      }
    };
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
        this.changeForm.publishPicture = urls;
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
        that.changeForm.publishPicture = urls;
      }
    },

    handleFormatError(file) {
      this.$Notice.warning({
        title: "文件格式不正确",
        desc:
          "文件格式 " +
          file.name +
          " 不正确, 请选择 jpg or png文件."
      });
    },

    handleMaxSize(file) {
      this.$Notice.warning({
        title: "文件大小超限",
        desc: "文件  " + file.name + " 太大，上传文件大小不能超过50M."
      });
    },

    handleBeforeUpload() {
      const check = this.uploadList.length < 6;
      if (!check) {
        this.$Notice.warning({
          title: "最多上次6张图片."
        });
      }
      return check;
    },

    search: function() {
      this.queryPublishPostList(1, 10);
    },

    reset: function() {
        this.searchForm.publishTitle = "",
        this.searchForm.publishUserName = ""
    },

    queryPublishPostList: function(pageNo, numPerPage) {
      let params = {
        publishTitle: this.searchForm.publishTitle,
        publishUserName: this.searchForm.publishUserName,
        pageNo: pageNo,
        numPerPage: numPerPage,
        isPage: 1
      };
      queryPublishPostList(params).then(res => {
        if (res.data.code == "200") {
          this.tableData = res.data.data.recordList;
          this.total = res.data.data.totalCount;
          this.pageNum = res.data.data.currentPage;
          this.pageSize = res.data.data.numPerPage;
        }
      });
    },

    publish: function() {
      this.changeForm.id = "";
      this.changeForm.publishTitle = "";
      this.changeForm.publishContent = "";
      this.changeForm.publishPicture = "";
      this.changeForm.isTop = 0;
      this.modal = true;
      this.modalTitle = "新增发帖";
    },

    submit: function() {
      this.$refs.formValidate.validate(valid => {
          if(valid){
            this.submitDisabled = true;
            let address = '';
            for(let i = 0; i != this.addressArray.length; i ++) {
                if(i != this.addressArray.length - 1) {
                    address += this.addressArray[i].name + ",";
                }else {
                    address += this.addressArray[i].name;
                }
            };
            this.changeForm.publishAddress = address;
            saveOrUpdatePost(this.changeForm).then(res=>{
                if(res.data.code=="200"){
                    this.$Message.success({
                        content:'新增发帖成功',
                        duration:1
                    });
                    this.modal=false;
                    this.queryPublishPostList(this.pageNum,this.pageSize)
                }else{
                    this.$Message.error({
                        content:res.data.msg,
                        duration:1
                    });
                }
                setTimeout(() => {
                    this.submitDisabled = false;
                }, 1000);
            })
          }
      });
    },

    cancel: function() {
        this.modal = false;
    },

    pageChange: function(value) {
      this.queryPublishPostList(value, this.pageSize);
    },

    pageSizeChange: function(value) {
      this.queryPublishPostList(this.pageNum, value);
    },

    handleView(item) {
      this.imgUrl = item.publishUserPicture;
      this.visible = true;
    },
  },

  mounted: function() {
    this.queryPublishPostList(1, 10);

    // this.editor = new E(this.$refs.editorElem);
    //   // 编辑器的事件，每次改变会获取其html内容
    // this.editor.customConfig.onchange = (html) => {
    //   this.changeForm.publishContent = html;
    // };
    // this.editor.create(); // 创建富文本实例
  }
};
</script>

<style scoped>
.device-manage >>> .table-delete td {
  background-color: #f0f2f5;
}

.img-pointer:hover {
  cursor: pointer;
}

.ivu-table-cell-tooltip-content {
     display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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

</style>
