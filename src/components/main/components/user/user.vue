<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <span class="log-out">设置</span>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="changePsw">修改密码</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Modal v-model="modalChangePsw" title="修改密码">
      <Form :label-width="120" class="search-form" ref="formPswValidate" :model="formPswValidate" :rules="ruleValidatePsw">
        <Row>
          <Col :sm="24" :xs="24">
          <FormItem label="原密码:" prop="oldPassword">
            <Input v-model="formPswValidate.oldPassword" type="text" :maxlength="16" />
          </FormItem>
          </Col>
          <Col :sm="24" :xs="24" style="margin-top:10px;">
          <FormItem label="新密码:" prop="newPassword">
            <Input v-model="formPswValidate.newPassword" type="password" :maxlength="16" />
          </FormItem>
          </Col>
          <Col :sm="24" :xs="24" style="margin-top:10px;">
          <FormItem label="确认新密码:" prop="confirmPassword">
            <Input v-model="formPswValidate.confirmPassword" type="password" :maxlength="16" />
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="modalChangePsw=false">取消</Button>
        <Button type="primary" size="large" @click="changePswFun">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import "./user.less";
import { mapActions, mapMutations } from "vuex";
import { getUserId, updatePassword } from "@/api/login";
import {
  commonAreasByWarehouseId,
  commonLocationByWarehouseId,
  saveWarehouseDefaultConfig
} from "@/api/common";
import { setPriority } from "os";
import { setTimeout } from "timers";
import { setToken } from "@/libs/util";
import { encrypt, decrypt } from '@/libs/aes';

export default {
  name: "User",
  props: {
    userAvator: {
      type: String,
      default: ""
    }
  },
  data() {
    const validatePassCheck = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入确认密码"));
      } else if (value && value !== this.formPswValidate.newPassword) {
        callback(new Error("新密码与确认密码不一致！"));
      } else {
        callback();
      }
    };
    return {
      userName: "",
      modalChangePsw: false,
      formPswValidate: {
        newPassword: "",
        oldPassword: "",
        confirmPassword: "",
        userName: ""
      },
      ruleValidatePsw: {
        oldPassword: [
          {
            required: true,
            message: "请输入原密码",
            trigger: "blur"
          },
          {
            type: "string",
            min: 6,
            message: "密码限制为6-16位",
            trigger: "blur"
          }
        ],
        newPassword: [
          {
            required: true,
            message: "请输入新密码",
            trigger: "blur"
          },
          {
            type: "string",
            min: 6,
            message: "密码限制为6-16位",
            trigger: "blur"
          }
        ],
        confirmPassword: [
          { required: true, validator: validatePassCheck, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    ...mapActions(["handleLogOut"]),
    ...mapMutations(["setTagNavList"]),
    handleClick(name) {
      switch (name) {
        case "logout":
          this.handleQuiteClick();
          break;
        case "changePsw":
          this.formPswValidate = {
            newPassword: "",
            oldPassword: "",
            userName: ""
          };
          this.$refs["formPswValidate"].resetFields();
          this.modalChangePsw = true;
          break;
      }
    },
    handleQuiteClick() {
      this.handleLogOut().then(() => {
        let res = this.$store.state.app.tagNavList.filter(
          item => item.name === this.$config.homeName
        );
        this.setTagNavList(res);
        this.$router.push({
          name: "login"
        });
      });
    },
    changePswFun() {
      this.$refs["formPswValidate"].validate(valid => {
        if (valid) {
          debugger
          this.modalChangePsw = false;
          var user = JSON.parse(this.$store.state.user.token);
          this.formPswValidate.userName = user.name;
          this.formPswValidate.oldPassword =  encrypt(this.formPswValidate.oldPassword);
          this.formPswValidate.newPassword =  encrypt(this.formPswValidate.newPassword);
          this.formPswValidate.confirmPassword =  encrypt(this.formPswValidate.confirmPassword);
          updatePassword(this.formPswValidate).then(res => {
            if (res.data.code == "200") {
              this.$Message.success({
                content: "密码修改成功！",
                duration: 1
              });
              setTimeout(() => {
                this.handleQuiteClick();
              }, 1000);
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
  },
  created(){
    this.userName = this.$store.state.user.token.name;
  }
};
</script>
