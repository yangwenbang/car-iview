<template>
  <div class="login">
    <Row type="flex" justify="center" class="top">
      <Col :span="16" :lg="16" :md="16" :sm="16" :xs="22" class="container">
      <!-- <div class="header">
        <img src="../../assets/images/logo.png" />
        <span class="title">仓储加工系统</span>
      </div> -->
      <div class="title">仓储加工系统登录</div>
      <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
        <FormItem prop="type">
          <Select size="large" v-model="form.type">
            <Option v-for="(item,index) in typeList" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem prop="userName">
          <Input v-model="form.userName" placeholder="请输入用户名" size="large" prefix="md-person" :maxlength="20">
          </Input>
        </FormItem>
        <FormItem prop="password">
          <Input type="password" v-model="form.password" placeholder="请输入密码" size="large" prefix="md-lock" :maxlength="16">
          </Input>
        </FormItem>
        <FormItem>
          <Button @click="handleSubmit" type="primary" long>登&nbsp;录</Button>
        </FormItem>
      </Form>
      <Modal v-model="modalLogin" title="选择仓库" @on-ok="ok">
        <Select @on-change="changeWarehouse" label-in-value style="width:100%">
          <Option v-for="item in warehouseArr" :value="item.warehouseId" :key="item.warehouseId">{{ item.warehouseName }}</Option>
        </Select>
      </Modal>
      </Col>
    </Row>
  </div>
</template>
<script>
import { setToken } from "@/libs/util";
import { mapActions } from "vuex";
import { warehouseChoose } from "@/api/login";
export default {
  components: {},
  data() {
    return {
      modalLogin: false,
      warehouseSelected: [],
      warehouseArr: [],
      form: {
        userName: "",
        password: "",
        type:"0"
      },
      typeList:[
        {id:"0",name:'仓库端'},
        {id:"1",name:'管理端'}
      ],
      rules: {
        userName: [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ],
        password: [{ required: true, message: "密码不能为空", trigger: "blur" },{ type: 'string', min: 6, message: '密码限制为6-16位', trigger: 'blur' }]
      }
    };
  },
  mounted(){
    setToken("");
  },
  methods: {
    ...mapActions(["handleLogin", "getWarehouse","getPlatform"]),
    handleSubmit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.handleLogin(this.form).then(res => {
            debugger
            if(this.form.type == "1"){
              if(res.length > 0){
                let warehouse1 = {warehouseId:res[0].supplierId,warehouseName: res[0].supplierName};
                setToken({ warehouse: warehouse1 });
                this.$store.commit("setWarehouse", warehouse1);
              }
              this.getPlatform().then(res => {
                // this.$router.push({
                //   name: this.$config.homeName
                // });
                window.location.href="/";
              }).catch(err => {
                this.$Message.error(err);
              })
            }else{
              const warehouseArr = res;
              if (warehouseArr.length > 1) {
                this.modalLogin = true;
                this.warehouseArr = warehouseArr;
              } else {
                const warehouse = warehouseArr ? warehouseArr[0] : [];
                this.saveWarehouse(warehouse);
              }
            }

          }).catch(err => {
            this.$Message.error(err);
          })
        }
      });
    },
    saveWarehouse(warehouse) {
      warehouseChoose({
        warehouseId: warehouse.warehouseId
      }).then(res => {
        if (res.data.code == "200") {
          setToken({ warehouse: warehouse });
          this.$store.commit("setWarehouse", warehouse);
          this.getPlatform().then(res => {
            // this.$router.push({
            //   name: this.$config.homeName
            // });
            window.location.href="/";
          }).catch(err => {
            this.$Message.error(err);
          })
        } else {
          setToken("");
          this.$Message.error(res.data.msg);
        }
      });
    },
    changeWarehouse(obj) {
      this.warehouseArr.map(item =>{
        if(item.warehouseId == obj.value){
          this.warehouseSelected = item;
        }
      })
    },
    ok() {
      this.saveWarehouse(this.warehouseSelected);
    }
  }
};
</script>
<style lang="less">
@import "./login.less";
</style>
