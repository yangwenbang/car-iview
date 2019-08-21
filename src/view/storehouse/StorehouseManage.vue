<template>
  <div class="white-bg">
    <Form :label-width="150" class="search-form">
      <Row type="flex" justify="space-between">
        <Col :sm="8" :xs="24">
          <FormItem label="仓库名称:">
            <Select v-model="params.id" placeholder="全部" clearable filterable>
              <Option
                v-for="(item,index) in warehouseNameList"
                :value="item.id"
                :key="index"
              >{{ item.warehouseName }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
          <FormItem label="状态:">
            <Select v-model="params.status" placeholder="全部" clearable filterable>
              <Option
                v-for="(item,index) in statusList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Col>
        
        <Col :sm="8"  :xs="24">
          <FormItem label="仓库地址:">
               <al-cascader v-model="params.local" data-type="all" level="1" ref="alcascader"  />
          </FormItem>
        </Col>
        <Col :sm="24" :xs="24" class="text-right">
          <FormItem>
            <Button type="primary" @click="search">查询</Button>
            <Button style="margin-left: 8px" @click="reset">重置</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <Row>
      <Col span="24">
        <router-link :to="{name: 'NewStorehouse'}" class="margin-right-10">
          <Button type="primary" class="margin-bottom-10">新增仓库</Button>
        </router-link>
      </Col>
    </Row>

    <Table :columns="tableColumns" :data="tableData" border></Table>

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
import { formatDate, formatPrice } from "@/libs/util";
import { queryList, updateStatus,queryListByName } from "@/api/storehouse";
export default {
  data() {
    return {
      pageNum: 1,
      total: 0,
      pageSize: 10,
      params: {
        id: "",
        status: "",
        local: []
      },
      searchParams: {
        id: "",
        status: "",
        local: []
      },
      warehouseNameList:[],
      statusList: [
        {
          label: "启用",
          value: 0
        },
        {
          label: "停用",
          value: 1
        }
      ],
      tableData: [],
      tableColumns: [
        {
          title: "仓库编号",
          key: "warehouseCode",
          align: "left",
          minWidth: 140
        },
        {
          title: "仓库名称",
          key: "warehouseName",
          align: "left",
          minWidth: 140
        },
        {
          title: "所属城市",
          key: "city",
          align: "left",
          minWidth: 140
        },
        {
          title: "所属区域",
          key: "area",
          align: "left",
          minWidth: 140
        },
        {
          title: "仓库地址",
          key: "address",
          align: "left",
          minWidth: 140
        },
        {
          title: "仓库联系人",
          key: "contract",
          align: "left",
          minWidth: 140
        },
        {
          title: "联系人手机",
          key: "mobile",
          align: "left",
          minWidth: 140
        },
        {
          title: "联系人邮箱",
          key: "email",
          align: "left",
          minWidth: 140
        },
        {
          title: "状态",
          key: "status",
          align: "left",
          minWidth: 120,
          render: (h, data) => {
            if (data.row.status == "0") {
              return h("Tag", { class: "ivu-tag-green" }, "启用");
            } else if (data.row.status == "1") {
              return h("Tag", { class: "ivu-tag-red" }, "停用");
            }
          }
        },
        {
          title: "操作",
          key: "",
          fixed: "right",
          minWidth: 200,
          render: (h, data) => {
            var h_edit = h(
              "span",
              {
                class: "tb-link margin-right-10",
                on: {
                  click: () => {
                    this.$router.push({
                      name: "StorehouseUpdate",
                      query: { id: data.row.id }
                    });
                  }
                }
              },
              "编辑"
            );
            var h_view = h(
              "span",
              {
                class: "tb-link margin-right-10",
                on: {
                  click: () => {
                    this.$router.push({
                      name: "StorehouseDetail",
                      query: { id: data.row.id }
                    });
                  }
                }
              },
              "查看"
            );
            var h_stop = h(
              "span",
              {
                class: "tb-link margin-right-10 color-red",
                on: {
                  click: () => {
                    this.$Modal.confirm({
                      title: "提示",
                      content: "请确认是否停用？",
                      onOk: () => {
                        this.statusFun(data.row.id, 1);
                      },
                      onCancel: () => {}
                    });
                  }
                }
              },
              "停用"
            );
            var h_start = h(
              "span",
              {
                class: "tb-link margin-right-10 green",
                on: {
                  click: () => {
                    this.$Modal.confirm({
                      title: "提示",
                      content: "请确认是否启用？",
                      onOk: () => {
                        this.statusFun(data.row.id, 0);
                      },
                      onCancel: () => {}
                    });
                  }
                }
              },
              "启用"
            );
            var h_import = h(
              "span",
              {
                class: "tb-link margin-right-10 tb-link-orange",
                on: {
                  click: () => {
                    this.$router.push({
                      name: "StorehouseImport",
                      query: { id: data.row.id }
                    });
                  }
                }
              },
              "导入库存"
            );

            return h(
              "div",
              (function() {
                var childs = [];
                var i;
                if (data.row.status == "0") {
                  childs.push(h_edit, h_view, h_stop, h_import);
                }
                if (data.row.status == "1") {
                  childs.push(h_edit, h_view, h_start);
                }
                if (data.row.status == "2") {
                  childs.push(h_view);
                }

                return childs;
              })()
            );
          }
        }
      ]
    };
  },
  methods: {
    search() {
      this.searchParams.id = this.params.id;
      this.searchParams.status = this.params.status;
      this.searchParams.local = this.params.local;
      this.pageChange(1);
    },
    reset() {
      this.params.id = "";
      this.params.status = "";
      this.$refs.alcascader.select=[];
      this.$refs.alcascader.oldData=[];
      this.params.local =[];
    },
    getList() {
      const data = {
        id: this.searchParams.id,
        status: this.searchParams.status,
        province:this.searchParams.local.length > 0? this.searchParams.local[0].name: "",
        provinceCode:this.searchParams.local.length > 0? this.searchParams.local[0].code: "",
        city:this.searchParams.local.length > 1? this.searchParams.local[1].name: "",
        cityCode:this.searchParams.local.length > 1? this.searchParams.local[1].code: "",
        area:this.searchParams.local.length > 2? this.searchParams.local[2].name: "",
        areaCode:this.searchParams.local.length > 2? this.searchParams.local[2].code: "",
        numPerPage: this.pageSize,
        pageNo: this.pageNum
      };
      queryList(data).then(res => {
        if (res.data.code == "200") {
          const data = res.data.data;
          this.tableData = data.recordList;
          this.pageNum = data.currentPage;
          this.total = data.totalCount;
          this.pageSize = data.numPerPage;
        }
      });
      
    },
    getAddress(){
      queryListByName({warehouseName:''}).then( res =>{
        if (res.data.code == "200") {
            this.warehouseNameList = res.data.data;
        }else{
            this.$Message.error(res.data.msg);
        }
      })
    },
    pageChange(page) {
      this.pageNum = page;
      this.getList();
    },
    pageSizeChange(pagesize) {
      this.pageNum = 1;
      this.pageSize = pagesize;
      this.getList();
    },
    statusFun(id, status) {
      updateStatus({
        id: id,
        status: status
      }).then(res => {
        if (res.data.code == "200") {
          this.getList();
          this.$Message.success({
            content: "状态修改成功!",
            duration: 1
          });
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    }
  },
  mounted() {
    this.getList();
    this.getAddress()
  }
  
};
</script>

<style scoped>
</style>