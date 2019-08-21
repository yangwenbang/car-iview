<template>
  <div class="change-platform-content pull-right margin-right-20">
      <span style="color:#fff;font-size:20px;font-weight:bold;cursor:pointer;" v-if="$store.state.user.employeeId != 1" @click="changeWarehouse">{{$store.state.user.warehouse.warehouseName}}<Icon type="md-arrow-dropdown" /></span>
      <span style="color:#fff;font-size:20px;font-weight:bold;cursor:pointer;" v-else>{{$store.state.user.warehouse.warehouseName}}</span>
    <!-- <router-link to='ExampleList'>入库管理</router-link>
    <router-link to='ExampleList'>原料管理</router-link>
    <router-link to='ExampleList'>加工管理</router-link> -->
    <Modal v-model="modalChangeWarehouse" title="选择仓库" @on-ok="saveWarehouse">
        <Select style="width:100%" v-model="warehouseId">
          <Option v-for="item in warehouseArr" :value="item.warehouseId" :key="item.warehouseId">{{ item.warehouseName }}</Option>
        </Select>
      </Modal>
  </div>
</template>

<script>
import './ChangePlatform.less'
import { setToken } from "@/libs/util";
import { getWarehouse,warehouseChoose } from "@/api/login";
import { mapMutations } from "vuex";
export default {
    name: "ChangePlatform",
    data() {
        return {
            warehouseId:this.$store.state.user.warehouse.warehouseId,
            changeType:false,
            modalChangeWarehouse:false,
            warehouseArr:[]
        }
    }, 
    methods: {
        ...mapMutations(["setTagNavList"]),
        changeWarehouse(){
            this.modalChangeWarehouse = true;
            getWarehouse().then(res => {
                if (res.data.code == "200") {
                    this.warehouseArr = res.data.data;
                }
            });
        },
        saveWarehouse() {
            warehouseChoose({
                warehouseId: this.warehouseId
            }).then(res => {
                if (res.data.code == "200") {
                    setToken({ warehouse: res.data.data });
                    this.$store.commit("setWarehouse", res.data.data);
                    this.$Message.success("仓库切换成功！");
                    this.modalChangeWarehouse = false;
                    let res1 = this.$store.state.app.tagNavList.filter(
                        item => item.name === this.$config.homeName
                    );
                    this.setTagNavList(res1);
                    window.location.href="/";
                } else {
                    this.$Message.error(res.data.msg);
                }
            });
        },
        handleClick(name) {
            switch (name) {
                case "quality":
                     this.$router.push({
                            name: "task"
                        });
                    break;
            }
        },
        changeDownType(type){
            this.changeType = type;
        }
    },
    mounted(){
    }
};
</script>
