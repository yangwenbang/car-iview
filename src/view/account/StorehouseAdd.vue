<template>
  <div class="white-bg">
    <Form :label-width="150" class="search-form" :rules="ruleValidate" ref="formValidate" :model="formValidate">
      <Row type="flex" justify="space-between">
        <Col :sm="8" :xs="24" >
          <FormItem label="用户名:" prop="userName">
            <Input v-model="formValidate.userName" :maxlength="20"></Input>
          </FormItem>
        </Col>
        <Col :sm="8" :xs="24" >
          <FormItem label="姓名:" prop="nickName">
            <Input v-model="formValidate.nickName" :maxlength="20"></Input>
          </FormItem>
        </Col>
        <Col :sm="8" :xs="24">
          <FormItem label="密码:" prop="password">
            <Input v-model="formValidate.password" type="password" :maxlength="16"></Input>
          </FormItem>
        </Col>
        <br>
        <Col :sm="8" :xs="24" >
          <FormItem label="重复密码:" prop="keyword">
            <Input v-model="formValidate.keyword" type="password" :maxlength="16" ></Input>
          </FormItem>
        </Col>
        <Col :sm="8" :xs="24" >
         <FormItem label="手机号:">
            <Input v-model="formValidate.mobile" :maxlength="16" @on-blur="validateTel"></Input>
          </FormItem>
         </Col>
        <Col :sm="8" :xs="24">
             <FormItem label="身份证:">
            <Input v-model="formValidate.card"  @on-blur="validateCard"></Input>
          </FormItem>
         </Col>
        <Col :sm="8" :xs="24">
             <FormItem label="备注:" >
            <Input v-model="formValidate.remark"></Input>
          </FormItem>
          </Col> 
        <Col :sm="24" :xs="24">
             <FormItem label="对应仓库:" prop="userWarehouseDTOS" >
                <CheckboxGroup v-model="formValidate.userWarehouseDTOS">
                    <Checkbox  v-for="item in formValidate.warehouseList" 
                        :key="item.warehouseId" :label="item.warehouseId" >{{item.warehouseName}}</Checkbox>
              </CheckboxGroup>
          </FormItem>
         </Col>
      </Row> 
       <Col :sm="24" :xs="24">
          <FormItem label="对应角色:" >
            <Table  :columns="tableColumns" :data="tableData" @on-selection-change="selectChange" border v-model="formValidate.userRoleDTOS" ></Table>      
          </FormItem>
      </Col>
    </Form>
     <div class="text-center margin-top-10">
      <Button type="primary" class="btn-common-width"  @click="handleSubmit('formValidate')" :disabled="submitDisabled">确定新增</Button>
    </div>
  </div>
</template>
<script>
import { saveAccount,getWarehouse,queryRoleList} from '@/api/account'
import { closeNowTag } from "@/libs/util";
//验证手机号码
var rex = /^1[3-9]+\d{9}$/;
//验证座机号
var rex2 = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
//验证身份证
var rex3 = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/;
export default {
    name:'StorehouseAdd',
    data(){
       const validatePass = (rule, value, callback) => {
         let userNameReg = /^[A-Za-z0-9-_]+$/;
                if (!userNameReg.test(value) && value !== ' ') {
                    callback(new Error('请输入1-20位字母、数字、下划线'));
                } else{
                    callback()
                }
       };  
      const  validateName = (rule,value,callback) =>{
        let nameReg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/
                if (!nameReg.test(value) && value !== ' ') {
                    callback(new Error('请输入1-20位汉字、字母、数字'));
                } else {
                    callback();
                }
      } 
       const validatePassCheck = (rule, value, callback) => {
         let passwordReg = /^[A-Za-z0-9-_]+$/;
                if (!passwordReg.test(value) && value !== ' ') {
                    callback(new Error('请输入1-16位字母、数字、下划线'));
                }  else {
                    callback();
                }
       };
       const validateKeyCheck = (rule, value, callback) => {
         let keywordReg = /^[A-Za-z0-9-_]+$/;
                if (!keywordReg.test(value) && value !== ' ') {
                    callback(new Error('请输入1-16位字母、数字、下划线'));
                } else if (value !== this.formValidate.password) {
                    callback(new Error('两次输入的密码不一致'));
                } else {
                    callback();
                }
       };
        return{
          isDisable: false,//表单重复提交
          formValidate:{
              userName:'',
              nickName:'',
              password:'',
              keyword:'',
              mobile:'',
              card:'',
              remark:'',
              userId:'',
              type:'',
              userWarehouseDTOS:[],
              warehouseList:[]
          },
          currentSelect:[],
          roleName:"",
          status:0,
          platform:0,
          submitDisabled: false,
          ruleValidate: {
              userName: [
                {
                  required: true,
                  validator: validatePass, 
                  trigger: 'change'
                },
              ],
              nickName: [
                {
                  required: true,
                  validator: validateName,
                },
              ],
              password: [
                {
                  required: true,
                  validator: validatePassCheck,
                  trigger: 'change'
                }   
              ],
              keyword: [
                {
                  required: true,
                  validator: validateKeyCheck, 
                  trigger: 'change'
                },        
              ],
              userWarehouseDTOS:[
                { 
                  required: true, 
                  type: 'array', 
                  min:1,
                  message: '请选择仓库', 
                  trigger: 'change' }
                ]
             },
              tableColumns: [ 
                  {
                      type: "selection",
                      width: 40,
                      align: "center"
                  },
                  {
                      title: "角色名",
                      key: "name",
                      align: "left",
                  },
                ] ,
              tableData:[]
            }
    },
    mounted:function(){
      this.getList()
    },
    methods:{
      validateTel(){
          if (!rex.test(this.formValidate.mobile) && !rex2.test(this.formValidate.mobile)) {
               this.formValidate.mobile = '';
            }
      },
      validateCard(){
          if (!rex3.test(this.formValidate.card)) {
              this.formValidate.card = '';
            }
      },
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
            if (valid) {
               this.submitDisabled = true;
               this.submit();
            }
        })
      },
      selectChange(selection) {
         let temp = selection.map(item => {
          return{
            roleId:item.id,
            roleName:item.name
          }
      });
         this.currentSelect = temp;
      },
      getList(){
          getWarehouse({}).then(res => {
              if(res.data.code == "200") {
              this.formValidate.warehouseList = res.data.data.map(o => {
                  return {
                      warehouseName: o.warehouseName,
                      warehouseId: o.id
                  }
              })
           }
          })
         queryRoleList({
              "status":0,
              "platform":0,
              "pageQuery":0,
          }).then(res => {
                if (res.data.code == "200") {
                  this.tableData = res.data.data.recordList
                }
          })
      },   
    submit(){
        var arr = []
        for (let {warehouseName,warehouseId} of this.formValidate.warehouseList) {
            this.formValidate.userWarehouseDTOS.map(o =>{
                if(warehouseId == o){
                  arr.push({warehouseName,warehouseId})
                }
           })
          } 
        this.formValidate.userWarehouseDTOS = arr
        let saveData ={
          userName: this.formValidate.userName,
          nickName: this.formValidate.nickName,
          password: this.formValidate.password,
          keyword: this.formValidate.keyword,
          mobile: this.formValidate.mobile,
          card: this.formValidate.card,
          remark: this.formValidate.remark,
          type:this.formValidate.type,
          userRoleDTOS: this.currentSelect,
          userWarehouseDTOS:this.formValidate.userWarehouseDTOS
        }
        saveAccount(saveData).then(res => {
          if (res.data.code == "200") {
            this.$Message.success({
              content: "新增成功!",
              duration: 1
            });
            setTimeout(() => {
              closeNowTag(this.$store.state.app, this.$route);
              this.$router.push({
                path: "StorehouseAccount"
              });
            }, 1000);
          } else {
            this.$Message.error(res.data.msg);
          }
          setTimeout(() => {
            this.submitDisabled = false;
          }, 1000);
        })
      },
   }
}
</script>
<style scoped>
.search-form .ivu-form-item {
  margin-bottom: 20px;
}
</style>


