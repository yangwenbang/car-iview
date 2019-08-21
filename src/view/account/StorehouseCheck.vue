<template>
  <div class="white-bg">
            <div class="table-scrollable left-right-table">
                <table border="1">
                    <tbody>
                        <tr>
                            <td class="left-bg">用户名:</td>
                            <td>{{userName}}</td>
                            <td class="left-bg">姓名:</td>
                            <td>{{nickName}}</td>
                        </tr>
                        <tr>
                            <td class="left-bg">手机号:</td>
                            <td>{{mobile}}</td>
                            <td class="left-bg">身份证:</td>
                            <td>{{card}}</td>
                        </tr>
                        <tr>
                            <td class="left-bg">备注:</td>
                            <td>{{remark}}</td>
                            <td class="left-bg">对应仓库:</td>
                            <td>{{warehouseName}}</td>
                        </tr>
                         <tr>
                            <td class="left-bg">对应角色;</td>
                            <td>{{userRoleName}}</td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <Row class="margin-top-20 margin-bottom-10">
                <Col span="24">
                <div class="pull-left table-title">操作记录</div>
                </Col>
            </Row>
           <Table  :columns="tableColumns" :data="tableData" border></Table>          
  </div>
</template>
<script>
import { showAccount} from '@/api/account'
export default {
    name: "StorehouseCheck",
    data() {
        return {
            userName:'',
            nickName:'',
            mobile:'',
            card:'',
            remark:'',
            warehouseName:'',
            userRoleName:'',
            userId:this.$route.query.id,
            tableData: [ ],
                tableColumns: [
                    {
                        title: "操作类型",
                        key: "operateName",
                        align: "left",
                        minWidth: 80
                    },
                    {
                        title: "操作人",
                        key: "creator",
                        align: "left",
                        minWidth: 120
                    },
                    {
                        title: "操作时间",
                        key: "creatorTime",
                        align: "left",
                        minWidth: 80
                    },
                ]
        };
    },
    activated:function(){
      this.getList();
    },
    methods:{
         getList(){
            showAccount({
                userId:this.userId
            }).then(res => {
                  if(res.data.code == "200"){
                    const data = res.data.data ? res.data.data : null;
                    this.userName = data.userName;
                    this.nickName = data.nickName;
                    this.mobile = data.mobile;
                    this.card = data.card;
                    this.remark = data.remark;
                    this.warehouseName = data.warehouseName;
                    this.userRoleName = data.userRoleName;
                    this.tableData = data.operateLogs
            }else{
                this.$Message.error(res.data.msg);
            }
          })
        },
    }
};
</script>
