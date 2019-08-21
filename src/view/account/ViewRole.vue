<template>
    <div class="white-bg">
        <Form :label-width="150" class="search-form">
            <Row type="flex" justify="space-between">
                <Col :sm="8" :xs="24">
                <FormItem label="角色名:">
                    <Input v-model="params.rolename" placeholder="" :maxlength="20" :disabled="true"></Input>
                </FormItem>
                </Col>
               
            </Row>
            <Row type="flex" justify="space-between">
                <Col :sm="8" :xs="24">
                <FormItem label="对应权限:">
                   <template v-for="item in rightList">
                       <div>【{{item.name}}】</div>
                   </template>
                </FormItem>
                </Col>
            </Row>
            <Row type="flex" justify="space-between">
                <Col :sm="8" :xs="24">
                <FormItem label="备注:">
          <Input v-model="params.remark" type="textarea" :maxlength="200" :disabled="true" />
        </FormItem>
                </Col>
            </Row>
        </Form>
        <Row>
           <h3 style="margin-bottom:20px;">操作记录</h3>
        </Row>
        <Table  :columns="tableColumns" :data="tableData" border style="width:800px;"></Table>
         <div class="page-wrapper">
            
        </div>
       
    </div>
    
</template>
<script>
import {queryRole} from '@/api/role';
export default {
    name: "ViewRole",
    data() {
        return {
            params: {
                 rolename: "",
                 remark: "",
                 operateName:"",
                 creator:"",
                 creatorTime:""
            },
            tableData:[],
            rightList:[],
            tableColumns: [
                {
                    title: "操作类型",
                    key: "operateName",
                    align: "center",
                    minWidth: 120
                },
                 {
                    title: "操作人",
                    key: "creator",
                    align: "center",
                    minWidth: 120
                },
                 {
                    title: "操作时间",
                    key: "creatorTime",
                    align: "creatorTime",
                    minWidth: 120
                },

            ],
        };
    },
    activated:function(){
      this. getList();
    },
    mounted:function(){
        this.getList();
    },
    methods: {
        getList(){
            queryRole({
                id:this.$route.query.id
            }).then(res => {
                if(res.data.code == "200"){
                    this.params.rolename=res.data.data.name;
                    this.params.remark=res.data.data.remark;
                    this.tableData=res.data.data.operateLogs;
                    this.rightList=res.data.data.rights;
                }else{
                    this.$Message.error(res.data.msg);
                }
            })
        },
    },
       
};
</script>



