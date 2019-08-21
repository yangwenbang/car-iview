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
        </tbody>
      </table>
    </div>
    <Row class="margin-top-20 margin-bottom-10">
      <Col span="24">
        <div class="pull-left table-title">权限配置</div>
      </Col>
    </Row>
    <Table :columns="tableColumns" :data="tableData" @on-selection-change="selectChange" border></Table>
    <div class="text-center margin-top-20">
      <Button
        type="primary"
        class="btn-common-width"
        @click="confirm"
        :disabled = "submitDisabled"
      >确定</Button>
    </div>
  </div>
</template>
<script>
import { showAccount,queryRightList,setUserRightManagement} from '@/api/account'
import { closeNowTag } from "@/libs/util";
export default {
  name: "StorehousePower",
  data() {
    return {
      userName: "",
      nickName: "",
      userId:this.$route.query.id,
      tableData: [],
      userRightId:[],
      currentSelect:[],
      submitDisabled:false,
      tableColumns: [
        {
          type: "selection",
          width: 40,
          align: "center"
        },
        {
          title: "权限名",
          key: "name",
          align: "left",
          minWidth: 80
        }
      ]
    };
  },
  mounted() {
    this.promiseAll();
  },
  computed: {
    newCurrentSelect: function() {
      let arr = [];
      this.currentSelect.map(item=>{
        arr.push(item.id);
      })
      return arr;
    }
  },
  methods: {
    selectChange(selection) {
      this.currentSelect = selection;
    },
    promiseAll(){
      let promiseArray=[];
      promiseArray.push(showAccount({userId:this.userId}));
      promiseArray.push(queryRightList());
      Promise.all(promiseArray).then(res=>{
        if(res[0].data.code == 200){
          this.userName = res[0].data.data.userName;
          this.nickName = res[0].data.data.nickName;
          this.rightList = res[0].data.data.userRightId ? res[0].data.data.userRightId.split(',') : [];
        }
        if(res[1].data.code == 200 ){
          this.tableData = res[1].data.data;
          this.rightList.forEach((item,index)=>{
            res[1].data.data.forEach((iitem,iindex)=>{
              if(item == iitem.id){
                this.tableData[iindex]._checked=true;
                this.newCurrentSelect.push(iitem.id)
              }
            })
          })
        }
      })
    },
    confirm(){
      this.submitDisabled = true
      const  para = {
                "userId": this.$route.query.id,
                "rightId": this.newCurrentSelect,
            };
      setUserRightManagement(para).then(res =>{
           if (res.data.code == "200") {
            this.$Message.success({
              content: "保存成功!",
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
    }
  }
};
</script>
