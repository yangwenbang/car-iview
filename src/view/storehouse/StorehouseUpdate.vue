<template>
  <Row type="flex" justify="space-between" class="white-bg storehouse-edit">
    <Col :xs="24" :sm="24" :md="24">
      <Form
        class="submit-form"
        ref="formValidate"
        :model="formValidate"
        :rules="ruleValidate"
        label-position="right"
        :label-width="130"
      >
        
        <Col :lg="12" :xs="24">
          <FormItem label="仓库名称:" prop="warehouseName">
            <Input :maxlength="30" v-model="formValidate.warehouseName"></Input>
          </FormItem>
        </Col>
        <Col :lg="12" :xs="24">
          <FormItem label="联系人:" prop="contract">
            <Input :maxlength="30" v-model="formValidate.contract"></Input>
          </FormItem>
        </Col>
        <Col :lg="12" :xs="24">
          <FormItem label="联系电话:" prop="phone">
            <Input :maxlength="20" v-model="formValidate.phone"></Input>
          </FormItem>
        </Col>

        <Col :lg="12" :xs="24">
          <FormItem label="仓库地址:" >
            <Row type="flex" justify="space-between">
              <Col :lg="11" :xs="24" class="selectCity" >
                 <al-cascader v-model="formValidate.local"   level="2"/>
              </Col>

              <Col :lg="11" :xs="24">
                <Input :maxlength="60" v-model="formValidate.address"></Input>
              </Col>
            </Row>
          </FormItem>
        </Col>

        <Col :lg="12" :xs="24">
          <FormItem label="联系邮箱:" prop="email">
            <Input :maxlength="30" v-model="formValidate.email"></Input>
          </FormItem>
        </Col>

        <Col :lg="24" :xs="24">
          <FormItem label="备注:" prop="remark">
            <Input
              type="textarea"
              v-model="formValidate.remark"
              :maxlength="200"
              :autosize="{minRows: 2,maxRows: 5}"
            ></Input>
          </FormItem>
        </Col>

        <Col :lg="24" :xs="24">
          <FormItem label="状态:" prop="status">
            <RadioGroup v-model="formValidate.status">
              <Radio :label="0">启用</Radio>
              <Radio :label="1">停用</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
         <Col :lg="24" :xs="24">
         <div class="text-center margin-top-10">
          <Button type="primary" class="btn-common-width" :disabled="submitDisabled" @click="handleSubmit('formValidate')">保存</Button>
          <Button class="btn-common-width margin-left-10" @click="backFun">取消</Button>
        </div>
         </Col>
        
      </Form>
    </Col>
  </Row>
</template>

<script>
import { closeNowTag } from "@/libs/util";
import { update,getOne} from "@/api/storehouse"
export default {
  name:'StorehouseUpdate',
  data() {
    return { 
      id : this.$route.query.id,
      submitDisabled:false,
      formValidate: {
        warehouseCode: "",
        warehouseName: "",
        contract: "",
        phone: "",
        address: "",
        local:[],
        email: "",
        remark: "",
        status: "",
      },
      ruleValidate: {
        warehouseName: [
          {
            required: true,
            message: "请输入仓库名称",
            trigger: "change",
            type: "string"
          }
        ],
        contract: [
          {
            required: true,
            message: "请输入联系人",
            trigger: "change",
            type: "string"
          }
        ],
        phone: [
          {
            required: true,
            message: "请输入联系电话",
            trigger: "change",
          }
        ],
        address: [
          {
            required: true,
            message: "请输入仓库地址",
            trigger: "change",
            type: "string"
          }
        ]
      }
    };
  },
  mounted(){
    this.getList()
  },
  methods: {
    getList(){
      getOne({id:this.id}).then( res => {
        if(res.data.code == "200"){
          const data = res.data.data;
          this.formValidate.local.push(data.province,data.city,data.area)
          this.formValidate.warehouseCode = data.warehouseCode;
          this.formValidate.warehouseName = data.warehouseName;
          this.formValidate.contract = data.contract;
          this.formValidate.phone = data.phone;
          this.formValidate.address = data.address;
          this.formValidate.email = data.email;
          this.formValidate.remark = data.remark;
          this.formValidate.status = data.status;
        }
      })
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.submitDisabled = true;
          this.submitFun();
        } else {
        }
      });
    },
    submitFun(){
      update({
        id:this.id,
        warehouseName:this.formValidate.warehouseName,
        contract:this.formValidate.contract,
        phone:this.formValidate.phone,
        address:this.formValidate.address,
        email:this.formValidate.email,
        remark:this.formValidate.remark,
        status:this.formValidate.status,
        province:this.formValidate.local.length > 0? this.formValidate.local[0].name: "",
        provinceCode:this.formValidate.local.length > 0? this.formValidate.local[0].code: "",
        city:this.formValidate.local.length > 1? this.formValidate.local[1].name: "",
        cityCode:this.formValidate.local.length > 1? this.formValidate.local[1].code: "",
        area:this.formValidate.local.length > 2? this.formValidate.local[2].name: "",
        areaCode:this.formValidate.local.length > 2? this.formValidate.local[2].code: "",
      }).then(res =>{
          if (res.data.code == "200") {
          this.$Message.success({
            content: "修改成功!",
            duration: 1
          });
          setTimeout(() => {
            closeNowTag(this.$store.state.app, this.$route);
            this.$router.push({
              path: "StorehouseManage"
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
    backFun() {
      this.$Modal.confirm({
        title: "提示",
        content: "取消将不保存填写内容，请确认是否取消？",
        onOk: () => {
          closeNowTag(this.$store.state.app, this.$route);
          this.$router.push({
            path: "StorehouseManage"
          });
        },
        onCancel: () => {}
      });
    }
  }
};
</script>

<style lang="less" scoped>
.selectCity{
 margin-top:2px;
 }
</style>



