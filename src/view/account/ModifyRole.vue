<template>
  <div class="white-bg add-role">
    <Form :label-width="150" class="search-form" :model="params" :rules="ruleValidate" ref="form">
      <Row type="flex" justify="space-between">
        <Col :sm="8" :xs="24">
          <FormItem label="角色名:" prop="rolename">
            <Input v-model="params.rolename" placeholder :maxlength="20"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row type="flex" justify="space-between">
        <Col :sm="8" :xs="24">
          <FormItem label="备注:">
            <Input type="textarea" v-model="params.remark" :maxlength="200"/>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <Row>
      <h3 style="margin-bottom:20px;">对应权限</h3>
    </Row>
    <Table
      :columns="tableColumns"
      @on-selection-change="selectChange"
      :data="tableData"
      border
      style="width:100%;"
    ></Table>
    <div class="text-center margin-top-20">
      <Button type="primary" class="btn-common-width" :disabled="submitDisabled" @click="add">确定修改</Button>
    </div>
  </div>
</template>
<script>
import { updateRole,queryRole,queryRightList } from "@/api/role";
import { formatDate, formatWeight,closeNowTag } from "@/libs/util";
export default {
  name: "ModifyRole",
  data() {
    return {
      submitDisabled: false,
      tableCheckList: [],
      tableData: [],
      tableColumns: [
        {
          type: "selection",
          width: 100,
          align: "center"
        },
        {
          title: "权限名",
          key: "name",
          align: "center",
          minWidth: 300
        }
      ],
      params: {
        rolename: "",
        remark: "",
      },
       ruleValidate: {
        rolename: [
            { required: true, message: '请填写角色名', trigger: 'blur' }
        ]
       },
    };
  },
  mounted() {
    this.promiseAll();
  },
  methods: {
    add() {
      this.$refs.form.validate((valid)=>{
        if(valid){
          if(this.tableCheckList.length==0){
             this.$Modal.warning({
                    title:'提示',
                    content:'请至少选择一个权限'
                })
          }else{
            this.submitDisabled = true;
            let data={
              "id":this.$route.query.id,
              "name":this.params.rolename,
              "platform": 0,
              "remark": this.params.remark,
              "rightIds":this.tableCheckList
            }
            updateRole(data).then(res => {
              if (res.data.code == "200") {
                this.$Message.success({
                  content: "修改成功!",
                  duration: 1
                });
                setTimeout(() => {
                  closeNowTag(this.$store.state.app, this.$route);
                  this.$router.push({
                    name: "RoleManagement"
                  });
                }, 1000);
              } else {
                this.$Message.error({
                  content: res.data.msg,
                  duration: 1
                });
              }
              setTimeout(() => {
                this.submitDisabled = false;
              }, 1000);
            });
          }
        }
      })
      
    },
    selectChange(selection) {
      let temp = selection.map(item => {
        return item.id
      });
      this.tableCheckList = temp;
    },
    promiseAll(){
      let promiseArray=[];
      promiseArray.push(queryRole({id:this.$route.query.id}));
      promiseArray.push(queryRightList());
      Promise.all(promiseArray).then(res=>{
        if(res[0].data.code==200){
          this.params.rolename=res[0].data.data.name;
          this.params.remark=res[0].data.data.remark;
          this.rightList=res[0].data.data.rights;
        }
        if(res[1].data.code==200){
          this.tableData=res[1].data.data;
          res[0].data.data.rights.forEach((item,index)=>{
            res[1].data.data.forEach((iitem,iindex)=>{
              if(item.id==iitem.id){
                this.tableData[iindex]._checked=true;
                this.tableCheckList.push(item.id)
              }
            })
          })
        }
      })
    }
  }
};
</script>
<style scoped>
.add-role .search-form .ivu-form-item {
  margin-bottom: 25px;
}
</style>




