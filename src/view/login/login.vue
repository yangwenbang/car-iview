<template>
  <div class="login">
    <Row type="flex" justify="center" class="top">
      <Col :span="16" :lg="16" :md="16" :sm="16" :xs="22" class="container">
      <div class="title">车两系统登录</div>
      <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
        <FormItem prop="userName">
          <Input v-model="form.userName" placeholder="请输入用户名" size="large" prefix="md-person" :maxlength="20"></Input>
        </FormItem>
        <FormItem prop="password">
          <Input type="password" v-model="form.password" placeholder="请输入密码" size="large" prefix="md-lock" :maxlength="16"></Input>
        </FormItem>
        <FormItem>
          <Button @click="handleSubmit" type="primary" long>登&nbsp;录</Button>
        </FormItem>
        <div style="text-align: center;"><a href="" target="_blank">商家注册</a></div>
        <FormItem>
            <div style="text-align: center;">建议使用chrome浏览器(<a href="https://www.google.cn/chrome/" target="_blank">点击下载</a>)</div>
        </FormItem>
      </Form>
      </Col>
    </Row>
  </div>
</template>
<script>
import { setToken } from "@/libs/util";
import { mapActions } from "vuex";

export default {
  name: 'Login',
  components: {},
  data() {
    return {
      modalLogin: false,
      warehouseSelected: [],
      warehouseArr: [],
      form: {
        userName: "",
        password: ""
      },
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
    ...mapActions(["handleLogin"]),
    handleSubmit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.handleLogin(this.form).then(res => {
            const user = res;
            this.$store.commit('setToken', user);
            window.location.href = "/";
          }).catch(err => {
            this.$Message.error(err);
          })
        }
      });
    }
  }
};
</script>
<style lang="less">
@import "./login.less";
</style>
