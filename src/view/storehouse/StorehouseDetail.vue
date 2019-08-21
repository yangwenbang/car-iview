<template>
  <Row type="flex" justify="center" class="white-bg detail-panel">
    <Col :xs="24" :sm="24" :md="24">
      <div class="table-scrollable left-right-table">
        <table border="1">
          <tbody>
            <tr>
              <td class="left-bg">仓库编码：</td>
              <td>{{storehouseData.warehouseCode}}</td>
              <td class="left-bg">仓库名称：</td>
              <td> {{storehouseData.warehouseName}} </td>
              <td class="left-bg">联系人：</td>
              <td> {{storehouseData.contract}} </td>
            </tr>
            <tr>
              <td class="left-bg">联系电话：</td>
              <td> {{storehouseData.phone}} </td>
              <td class="left-bg">仓库地址：</td>
              <td> {{storehouseData.province+storehouseData.city+storehouseData.area+storehouseData.address}} </td>
              <td class="left-bg">联系邮箱:</td>
              <td> {{storehouseData.email}} </td>
            </tr>
            <tr>
              <td class="left-bg">备注：</td>
              <td colspan="5"> {{storehouseData.remark}} </td>
            </tr>
            <tr>
              <td class="left-bg">状态：</td>
              <td> {{storehouseData.status==0? '启用': storehouseData.status==1? '停用':''}} </td>
              <td class="left-bg">提交时间：</td>
              <td> {{storehouseData.createTime}} </td>
              <td class="left-bg">提交人：</td>
              <td> {{storehouseData.creator}} </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Col>
  </Row>
</template>
<script>
import { getOne } from "@/api/storehouse"
export default {
  name: "StorehouseDetail",
  data(){
    return {
      id : this.$route.query.id,
      storehouseData:{},
    }
  },
  mounted(){
    this.getList()
  },
  methods:{
    getList(){
      getOne({id:this.id}).then( res => {
        if(res.data.code == "200"){
          const data = res.data.data;
          this.storehouseData = data
        }
      })
    }
  }

};
</script>