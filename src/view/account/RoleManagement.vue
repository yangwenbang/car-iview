<template>
  <div class="white-bg">
    <Form :label-width="150" class="search-form">
      <Row type="flex" justify="space-between">
        <Col :sm="8" :xs="24">
          <FormItem label="角色名:">
            <Input v-model="params.roleName" placeholder :maxlength="20"></Input>
          </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
          <FormItem label="状态:">
            <Select v-model="params.status" clearable placeholder="请选择状态">
              <Option
                v-for="item in statusList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col :sm="8" :xs="24" class="text-right">
          <FormItem>
            <Button type="primary" @click="search">搜索</Button>
            <Button style="margin-left: 8px" @click="reset">重置</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <Row>
      <Col span="24">
        <router-link to="AddRoleManagement">
          <Button type="primary" class="margin-bottom-10 margin-right-10">新增角色</Button>
        </router-link>
        <Button type="default" class="margin-bottom-10" @click="deleteAll">批量删除</Button>
      </Col>
    </Row>
    <Table
      :columns="tableColumns"
      :row-class-name="rowClassName" 
      @on-selection-change="selectChange"
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
          :page-size-opts="pageSizeOpts"
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
    <!-- <Modal v-model="modal" title="提示" @on-ok="ok" @on-cancel="cancel">
      <p>请再次确认是否删除此角色</p>
    </Modal> -->
  </div>
</template>
<script>
import { queryRoleList ,deleteRole,enableOrDisabledUserRole} from "@/api/role";
import { formatDate, formatWeight } from "@/libs/util";
export default {
  name: "RoleManagement",
  data() {
    return {
      submitDisabled: false,
      modal: false,
      params: {
        roleName:"",
        status: "",
        
      },
      searchParams: {
        //搜索参数
        ID: "",
        status: "",
        roleName: "",
        subordinate:"",
        accounts: "",
        remark: "",
        operate: ""
      },
      selection:[],
      currentSelect: [],
      pageSize: 10,
      pageNum: 1,
      pageSizeOpts: [5, 10, 15, 20],
      total: 0,
      kindList: [],
      warehouseList: [],
      warehouse: {},
      showModal: false,
      modalTitle: "新增员工",
      statusList: [
        {
          value: 0,
          label: "启用中"
        },
        {
          value: 1,
          label: "停用中"
        }
      ],
      tableData: [],
      tableColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: "ID",
          key: "id",
          align: "left",
          minWidth: 120
        },
        {
          title: "状态",
          key: "status",
          align: "left",
          minWidth: 120,
          render: (h, data) => {
            let statusTest = "",
              statusClass = "";
              if (data.row.auditStatus == "0") {
              return "";
            } else{
            if (data.row.status == "1") {
              statusTest = "停用中";
              statusClass = "ivu-tag-red";
            } else if (data.row.status == "0") {
              statusTest = "启用中";
              statusClass = "ivu-tag-green";
            } else {
              return "";
            }
            }
            return h("Tag", { class: statusClass }, statusTest);
          }
        },
        {
          title: "角色名",
          key: "name",
          minWidth: 140
        },
        {
          title: "下属权限数",
          key: "rightNum",
          minWidth: 140
        },
        {
          title: "对应账号数",
          key: "userNum",
          align: "left",
          minWidth: 100
        },

        {
          title: "备注",
          key: "remark",
          minWidth: 140,
          ellipsis: true,
          tooltip: true
        },

        {
          title: "操作",
          fixed: "right",
          width: 160,
          minWidth: 160,
          render: (h, data) => {
            var h_edit = h(
              "span",
              {
                class: "tb-link margin-right-10",
                on: {
                  click: () => {
                    this.$router.push({
                      name: "ModifyRole",
                      query: { id: data.row.id }
                    });
                  }
                }
              },
              "修改"
            );
            var h_view = h(
              "span",
              {
                class: "tb-link margin-right-10",
                on: {
                  click: () => {
                    this.$router.push({
                      name: "ViewRole",
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
                class: "tb-link tb-link-orange margin-right-10",
                on: {
                  click: () => {
                    this.$Modal.confirm({
                      title: "信息确认",
                      content: "是否要停用该角色？",
                      onOk: () => {
                        let updataData = {
                          id: data.row.id,
                          status: 1
                        };
                        enableOrDisabledUserRole(updataData).then(res => {
                          if (res.data.code == "200") {
                            this.$Message.success({
                              content: "停用成功",
                              duration: 1
                            });
                          this.getRoleList(this.pageSize,this.pageNum)
                          } else {
                            this.$Message.error({
                              content: res.data.msg,
                              duration: 1
                            });
                          }
                        });
                      }
                    });
                  }
                }
              },
              "停用"
            );

            var h_start = h(
              "span",
              {
                class: "tb-link green margin-right-10 ",
                on: {
                  click: () => {
                    this.$Modal.confirm({
                      title: "信息确认",
                      content: "是否要启用该角色？",
                      onOk: () => {
                        let updataData = {
                          id: data.row.id,
                          status: 0
                        };
                        enableOrDisabledUserRole(updataData).then(res => {
                          if (res.data.code == "200") {
                            this.$Message.success({
                              content: "启用成功",
                              duration: 1
                            });
                           this.getRoleList(this.pageSize,this.pageNum)
                          } else {
                            this.$Message.error({
                              content: res.data.msg,
                              duration: 1
                            });
                          }
                        });
                      }
                    });
                  }
                }
              },
              "启用"
            );

            var h_del = h(
              "span",
              {
                class: "tb-link color-red",
                on: {
                  click: () => {
                    this.$Modal.confirm({
                      title: "提示",
                      content: `<p>是否删除该角色？</p></br>删除后${
                        data.row.userNum
                      }名用户将失去此角色对应权限`,
                      okText: "确认",
                      cancelText: "取消",
                      onOk: () => {
                        setTimeout(()=>{
                          this.$Modal.confirm({
                            title: "提示",
                            content: `是否再次确认删除？`,
                            okText: "确认",
                            cancelText: "取消",
                            onOk: () => {
                            deleteRole([data.row.id]).then(res=>{
                                if(res.data.code==200){
                                  this.getRoleList(this.pageSize,1);
                                  this.$Message.success({
                                    content: "删除成功",
                                    duration: 1
                                  });

                                }else{
                                  this.$Message.error({
                                    content: res.data.msg,
                                    duration: 1
                                  });   
                                }
                              })
                            }
                        });
                        },300)
                      }
                    });
                  }
                }
              },
              "删除"
            );
            return h(
              "div",
              (function() {
                var childs = [];
                var i;
                if(data.row.status==0){
                  childs.push(h_view,h_edit,h_stop,h_del)
                }else{
                  childs.push(h_view,h_edit,h_start,h_del)
                }
                return childs;
              })()
            );
          }
        }
      ]
    };
  },
  mounted(){
    this.getRoleList(this.pageSize,this.pageNum);
  },
  activated(){
  this.getRoleList(this.pageSize,this.pageNum);
  },
  methods: {
    rowClassName(row, index) {
      if (row.auditStatus == "0") {
        return "table-info-row1";
      }
      return "";
    },
    pageChange:function(page){
      this.getRoleList(this.pageSize,page);
    },
    pageSizeChange:function(size){
      this.getRoleList(size,this.pageNum);
    },
    search:function(){
      this.getRoleList(this.pageSize,1);
    },
    reset:function(){
      this.params.roleName="";
      this.params.status="";
    },
    deleteAll:function(){ 
      if(this.selection.length==0){
        this.$Modal.warning({
            title:'提示',
            content:'请至少选择一个角色'
        })
      }else{
         this.$Modal.confirm({
            title:'信息确认',
            content:'是否删除你所选择的这些角色？',
            onOk:()=>{
              let temp=[];
              for(let i=0; i<this.selection.length;i++){
                temp.push(this.selection[i].id)
              }
              deleteRole(temp).then(res=>{
                if(res.data.code=="200"){
                  this.getRoleList(this.pageSize,1);
                  this.$Message.success({
                    content: "删除成功",
                    duration: 1
                  });
                }
              })
            }
        })
        
      }
      
    },
    selectChange:function(selection){
      this.selection=selection
    },
    getRoleList:function(pageSize,pageNum){
      this.pageSize=pageSize;
      this.pageNum=pageNum;
      let data={
        "roleName":this.params.roleName,
        "status":this.params.status,
        "platform":0,
        "numPerPage":this.pageSize,
        "pageNo":this.pageNum
      }
      queryRoleList(data).then(res=>{
        if(res.data.code=="200"){
          this.tableData=res.data.data.recordList;
          this.total=res.data.data.totalCount
        }
      })
    }
  },
 
};
</script>



