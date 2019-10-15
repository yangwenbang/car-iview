<template>
  <div class="white-bg device-manage">
    <Form :label-width="150" class="search-form">
      <Row type="flex" justify="space-between">
        <Col :sm="8" :xs="24">
            <FormItem label="发布标题:">
              <Input v-model="searchForm.publishTitle"></Input>
            </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
            <FormItem label="发布人名字:">
              <Input v-model="searchForm.publishUserName"></Input>
            </FormItem>
        </Col>
        <Col :span="24" class="text-right">
          <FormItem>
            <Button type="primary" @click="search">查询</Button>
            <Button style="margin-left: 8px" @click="reset">重置</Button>
          </FormItem>
        </Col>
      </Row>
      <Modal title="图片预览" v-model="visible">
          <img :src="imgUrl" v-if="visible" style="width: 100%">
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
import { queryPublishPostList, queryPublishPostInfo, deletePublishPost, saveOrUpdatePost } from "@/api/post";
import { formatDate } from "@/libs/util";
export default {
  name: "PostList",
  data() {
    return {
      pageNum: 1,
      total: 0,
      pageSize: 10,
      imgUrl: "",
      visible: false,
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
          minWidth: 50,
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
            return h("span", {
                class: {
                  'ivu-table-cell-tooltip-content': true
                },
                attrs: {
                  title: data.row.publishContent
                }
            }, data.row.publishContent);
          }
        },
        {
          title: "发布时间",
          key: "publishTime",
          minWidth: 100,
        }
      ]
    };
  },
  methods: {
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
</style>
