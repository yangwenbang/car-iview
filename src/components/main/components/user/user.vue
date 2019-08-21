<template>
  <div class="user-avator-dropdown">
    <!-- <Dropdown class="message-tip">
      <span class="message-badge">
        <Icon :size="30" type="ios-notifications-outline" />
        <span class="badge-count">10</span>
      </span>
      <DropdownMenu slot="list" class="message-list">
        <DropdownItem>
          <div class="icon">
            <Icon :size="16" color="white" type="md-mail"/> 
          </div>
          <div class="text">
            <p class="desc">你收到了 14 份新周报<p>
            <p class="time">一年前</p>
          </div>
        </DropdownItem>
        <DropdownItem>
          <div class="icon">
            <Icon :size="16" color="white" type="md-mail"/> 
          </div>
          <div class="text">
            <p class="desc">你推荐的 曲妮妮 已通过第三轮面试<p>
            <p class="time">2018-10-30</p>
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown> -->
    <Dropdown @on-click="handleClick">
      <span class="log-out">设置</span>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="changePsw">修改密码</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
        <DropdownItem v-if="$store.state.user.employeeId != 1" name="setDefault">默认值配置</DropdownItem>
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
          <FormItem label="确认新密码:" prop="newPasswordCheck">
            <Input v-model="formPswValidate.newPasswordCheck" type="password" :maxlength="16" />
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="modalChangePsw=false">取消</Button>
        <Button type="primary" size="large" @click="changePswFun">确定</Button>
      </div>
    </Modal>
    <Modal v-if="$store.state.user.employeeId != 1" v-model="modalSetDefault" title="默认值配置">
      <Form :label-width="100" class="search-form">
        <div style="font-weight:bold;line-height:30px;font-size:15px;">入库默认库区库位</div>
        <Row>
          <Col :sm="24" :xs="24">
          <FormItem label="库区:">
            <Select clearable v-model="formSetDefault.inDefaultAreaId">
              <Option v-for="(item,index) in kqList" :value="item.id" :key="index">{{item.name}}</Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :sm="24" :xs="24">
          <FormItem label="库位:">
            <Select clearable v-model="formSetDefault.inDefaultLocationId">
              <Option v-for="(item,index) in kwList" :value="item.id" :key="index">{{item.name}}</Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
        <div style="font-weight:bold;line-height:30px;font-size:15px;">加工成品默认库区库位</div>
        <Row>
          <Col :sm="24" :xs="24">
          <FormItem label="库区:">
            <Select clearable v-model="formSetDefault.processDefaultAreaId">
              <Option v-for="(item,index) in kqList" :value="item.id" :key="index">{{item.name}}</Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :sm="24" :xs="24">
          <FormItem label="库位:">
            <Select clearable v-model="formSetDefault.processDefaultLocationId">
              <Option v-for="(item,index) in kwList" :value="item.id" :key="index">{{item.name}}</Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
        <div style="font-weight:bold;line-height:30px;font-size:15px;">废料默认库区库位</div>
        <Row>
          <Col :sm="24" :xs="24">
          <FormItem label="库区:">
            <Select clearable v-model="formSetDefault.trashDefaultAreaId">
              <Option v-for="(item,index) in kqList" :value="item.id" :key="index">{{item.name}}</Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :sm="24" :xs="24">
          <FormItem label="库位:">
            <Select clearable v-model="formSetDefault.trashDefaultLocationId">
              <Option v-for="(item,index) in kwList" :value="item.id" :key="index">{{item.name}}</Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
        <hr>
      </Form>
      <Form :label-width="150" class="search-form">
        <Row>
          <Col :sm="24" :xs="24">
          <FormItem label="出库默认结算时间:">
            <RadioGroup v-model="formSetDefault.outDefaultSettleTime">
              <Radio label="0">出库时结算</Radio>
              <Radio label="1">提货时结算</Radio>
            </RadioGroup>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :sm="24" :xs="24">
          <FormItem label="加工费默认结算方式:">
            <RadioGroup v-model="formSetDefault.processDefaultSettleTime">
              <Radio label="1">加工出库一票结</Radio>
              <Radio label="0">单独结算</Radio>
            </RadioGroup>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="modalSetDefault=false">取消</Button>
        <Button type="primary" size="large" @click="saveDefault">确定</Button>
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
      modalChangePsw: false,
      modalSetDefault: false,
      formPswValidate: {
        newPassword: "",
        oldPassword: "",
        newPasswordCheck: "",
        userId: ""
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
        newPasswordCheck: [
          { required: true, validator: validatePassCheck, trigger: "blur" }
        ]
      },
      kqList: [],
      kwList: [],
      formSetDefault: {}
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
            userId: ""
          };
          this.$refs["formPswValidate"].resetFields();
          this.modalChangePsw = true;
          break;
        case "setDefault":
          this.modalSetDefault = true;
          this.getKQList();
          this.getKWList();
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
          getUserId().then(res => {
            if (res.data.code == "200") {
              this.formPswValidate.userId = res.data.data;
              updatePassword(this.formPswValidate).then(res => {
                if (res.data.code == "200") {
                  this.modalChangePsw = false;
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
            } else {
              this.$Message.error({
                content: res.data.msg,
                duration: 1
              });
            }
          });
        }
      });
    },
    getKQList() {
      commonAreasByWarehouseId().then(res => {
        if (res.data.code == "200") {
          this.kqList = res.data.data.map(item => {
            return { id: item.id.toString(), name: item.name };
          });
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    getKWList() {
      commonLocationByWarehouseId().then(res => {
        if (res.data.code == "200") {
          this.kwList = res.data.data.map(item => {
            return { id: item.id.toString(), name: item.name };
          });
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    saveDefault() {
      saveWarehouseDefaultConfig(this.formSetDefault).then(res => {
        if (res.data.code == "200") {
          setToken("");
          setToken({ warehouse: res.data.data });
          this.$store.commit("setWarehouse", res.data.data);
          this.modalSetDefault = false;
          this.$Message.success({
            content: "仓库默认配置修改成功！",
            duration: 1
          });
        } else {
          this.$Message.error({
            content: res.data.msg,
            duration: 1
          });
        }
      });
    }
  },
  created(){
    if(this.$store.state.user.employeeId != 1){
      this.formSetDefault = {
        inDefaultAreaId: this.$store.state.user.warehouse.inDefaultAreaId.toString(),
        inDefaultLocationId: this.$store.state.user.warehouse
          .inDefaultLocationId.toString(),
        processDefaultAreaId: this.$store.state.user.warehouse
          .processDefaultAreaId.toString(),
        processDefaultLocationId: this.$store.state.user.warehouse
          .processDefaultLocationId.toString(),
        trashDefaultAreaId: this.$store.state.user.warehouse.trashDefaultAreaId.toString(),
        trashDefaultLocationId: this.$store.state.user.warehouse
          .trashDefaultLocationId.toString(),
        outDefaultSettleTime: this.$store.state.user.warehouse.outDefaultSettleTime.toString(),
        processDefaultSettleTime: this.$store.state.user.warehouse
          .processDefaultSettleTime.toString(),
        warehouseId: this.$store.state.user.warehouse.warehouseId.toString(),
        warehouseName: this.$store.state.user.warehouse.warehouseName
      }
    }
    
  }
};
</script>
