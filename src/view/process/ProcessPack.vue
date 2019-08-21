<template>
  <Row>
    <Col
      :xs="24"
      :sm="24"
      :md="24"
    >
    <Row :gutter="10">
      <Col span="24">
      <div class="table-content">
        <div class="ivu-table table1">
          <table
            cellspacing="0"
            cellpadding="0"
            border="0"
            width="100%"
          >
            <thead>
              <tr>
                <th
                  colspan="12"
                  class="text-center"
                >
                  <div class="ivu-table-cell">加工信息
                  </div>
                </th>
              </tr>
              <tr>
                <th class="text-center">
                  <div class="ivu-table-cell">
                    <input type="checkbox" v-model="selectAll" @click="checkAll($event.target.checked)">
                  </div>
                </th>
                <th>
                  <div class="ivu-table-cell">编号</div>
                </th>
                <th>
                  <div class="ivu-table-cell">母卷信息</div>
                </th>
                <th class="text-right">
                  <div class="ivu-table-cell">数量(件)</div>
                </th>
                <th class="text-right">
                  <div class="ivu-table-cell">重量(吨)</div>
                </th>
                <th class="text-right">
                  <div class="ivu-table-cell">用料(吨)</div>
                </th>
                <th>
                  <div class="ivu-table-cell">成品规格</div>
                </th>
                <th class="text-right">
                  <div class="ivu-table-cell">理重(吨)</div>
                </th>
                <th class="text-right">
                  <div class="ivu-table-cell">总数量(张)</div>
                </th>
                <th class="text-right">
                  <div class="ivu-table-cell">已打包数量</div>
                </th>
                <th class="text-right">
                  <div class="ivu-table-cell">待打包数量</div>
                </th>
                <th>
                  <div class="ivu-table-cell">打包数量</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="tableData.length == 0">
                <td
                  colspan="16"
                  class="text-center"
                >
                  <div class="ivu-table-cell">无数据</div>
                </td>
              </tr>
              <template v-for="(data, index) in tableData">
                <tr :key="index">
                  <td class="text-center"><div class="ivu-table-cell"><input v-model="data.processProducts[0].select" type="checkbox" @click="singleCheck($event.target.checked,index, 0)"></div></td>
                  <td :rowspan="data.processProducts.length"><div class="ivu-table-cell">{{data.inventoryCode}}</div></td>
                  <td :rowspan="data.processProducts.length">
                    <div class="ivu-table-cell">
                      <div>捆包号：{{data.baleNumber}}</div>
                      <div>产地： {{data.brandName}}</div>
                      <div>品名：{{data.breedName}}</div>
                      <div>材质： {{data.materialName}}</div>
                      <div>规格：<b style="color:#1890ff">{{data.specName}}</b></div>
                    </div>
                  </td>
                  <td :rowspan="data.processProducts.length" class="text-right"><div class="ivu-table-cell">{{data.number}}</div></td>
                  <td :rowspan="data.processProducts.length" class="text-right"><div class="ivu-table-cell">{{data.weight|formatWeight}}</div></td>
                  <td :rowspan="data.processProducts.length" class="text-right"><div class="ivu-table-cell">{{data.processWeight|formatWeight}}</div></td>
                  <td><div class="ivu-table-cell">{{data.processProducts[0].specName}}</div></td>
                  <td class="text-right"><div class="ivu-table-cell">{{data.processProducts[0].weight|formatWeight}}</div></td>
                  <td class="text-right"><div class="ivu-table-cell">{{data.processProducts[0].number}}</div></td>
                  <td class="text-right"><div class="ivu-table-cell">{{data.processProducts[0].packagedNumber}}</div></td>
                  <td class="text-right"><div class="ivu-table-cell">{{data.processProducts[0].unPackageNumber}}</div></td>
                  <td><div class="ivu-table-cell"><InputNumber :max="data.processProducts[0].unPackageNumber" :min="0" :parser="inputNum" v-model="data.processProducts[0].packageNumber"></InputNumber></div></td>
                </tr>
                <template v-for="(process, i) in data.processProducts">
                  <tr
                    :key="process.id"
                    v-if="i > 0"
                  >
                    <td class="text-center"><div class="ivu-table-cell"><input v-model="process.select" type="checkbox" @click="singleCheck($event.target.checked,index, i)"></div></td>
                    <td><div class="ivu-table-cell">{{process.specName}}</div></td>
                    <td class="text-right"><div class="ivu-table-cell">{{process.weight|formatWeight}}</div></td>
                    <td class="text-right"><div class="ivu-table-cell">{{process.number}}</div></td>
                    <td class="text-right"><div class="ivu-table-cell">{{process.packagedNumber}}</div></td> 
                    <td class="text-right"><div class="ivu-table-cell">{{process.unPackageNumber}}</div></td>
                    <td><div class="ivu-table-cell"><InputNumber :max="process.unPackageNumber" :min="0" :parser="inputNum" v-model="process.packageNumber"></InputNumber></div></td>
                  </tr>
                </template>
              </template>
            </tbody>
          </table>
        </div>
      </div>
      <div class="text-center margin-top-10">
          <Button class="btn-common-width" type="primary" @click="packageBill">打包</Button>
      </div>
      </Col>
      <Col span="24" class="margin-bottom-10">
       <div class="pull-left table-title">打包结果</div>
      </Col>
      <Col span="24">
          <Button type="default" class="margin-bottom-10" @click="batchDelete">批量删除</Button>
      </Col>
      <Col span="24">
        <div class="table-content">
          <div class="ivu-table table1">
            <table
              cellspacing="0"
              cellpadding="0"
              border="0"
              width="100%"
            >
              <thead>
                <tr>
                  <th class="text-center">
                    <div class="ivu-table-cell">
                      <input type="checkbox" v-model="deleteSelectAll" @click="selectPackageAll($event.target.checked)">
                    </div>
                  </th>
                  <th>
                    <div class="ivu-table-cell">成品包装号</div>
                  </th>
                  <th>
                    <div class="ivu-table-cell">品名</div>
                  </th>
                  <th>
                    <div class="ivu-table-cell">材质</div>
                  </th>
                  <th>
                    <div class="ivu-table-cell">产地</div>
                  </th>
                  <th>
                    <div class="ivu-table-cell">规格</div>
                  </th>
                  <th class="text-right">
                    <div class="ivu-table-cell">数量</div>
                  </th>
                  <th class="text-right">
                    <div class="ivu-table-cell">总理重</div>
                  </th>
                  <th>
                    <div class="ivu-table-cell">操作</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="packageResult.length == 0">
                  <td
                    colspan="16"
                    class="text-center"
                  >
                    <div class="ivu-table-cell">无数据</div>
                  </td>
                </tr>
                <template v-for="(data, index) in packageResult">
                  <tr :key="index">
                    <td class="text-center" :rowspan="data.processProducts.length>0?data.processProducts.length:1"><div class="ivu-table-cell" v-if="data.processProducts.length>0"><input v-model="data.select" type="checkbox" @click="singleSelect($event.target.checked,index)"></div></td>
                    <td :rowspan="data.processProducts.length>0?data.processProducts.length:1"><div class="ivu-table-cell" v-if="data.processProducts.length>0">{{data.packCode?data.packCode:(index+1-packageCode+'号包装')}}</div></td>
                    <td><div class="ivu-table-cell" v-if="data.processProducts.length>0">{{$route.query.processType}}</div></td>
                    <td><div class="ivu-table-cell" v-if="data.processProducts.length>0">{{data.materialName?data.materialName:data.processProducts[0].materialName}}</div></td>
                    <td><div class="ivu-table-cell" v-if="data.processProducts.length>0">{{data.brandName?data.brandName:data.processProducts[0].brandName}}</div></td>
                    <td><div class="ivu-table-cell" v-if="data.processProducts.length>0">{{data.processProducts[0].specName}}</div></td>
                    <td class="text-right"><div class="ivu-table-cell" v-if="data.processProducts.length>0">{{data.processProducts[0].packageNumber}}</div></td>
                    <td class="text-right"><div class="ivu-table-cell" v-if="data.processProducts.length>0">{{data.processProducts[0].packageWeight|formatWeight}}</div></td>
                    <td :rowspan="data.processProducts.length>0?data.processProducts.length:1"><div class="ivu-table-cell" v-if="data.processProducts.length>0"><span class="tb-link color-red" @click="deletePackage(index)">删除</span></div></td>
                  </tr>
                  <template v-for="(process, i) in data.processProducts">
                    <tr
                      :key="process.id"
                      v-if="i > 0"
                    >
                      <td><div class="ivu-table-cell">{{$route.query.processType}}</div></td>
                      <td><div class="ivu-table-cell">{{data.materialName?data.materialName:process.materialName}}</div></td>
                      <td><div class="ivu-table-cell">{{data.brandName?data.brandName:process.brandName}}</div></td>
                      <td><div class="ivu-table-cell">{{process.specName}}</div></td> 
                      <td class="text-right"><div class="ivu-table-cell">{{process.packageNumber}}</div></td>
                      <td class="text-right"><div class="ivu-table-cell">{{process.packageWeight|formatWeight}}</div></td>
                    </tr>
                  </template>
                </template>
              </tbody>
            </table>
          </div>
        </div>
        <div class="text-center margin-top-10">
          <Button class="btn-common-width margin-right-10" type="primary" :disabled="buttonDisabled" @click="save">保存</Button>
          <Button class="btn-common-width margin-right-10" @click="cancel">取消</Button>
        </div>
      </Col>
    </Row>
    </Col>
  </Row>
</template>

<script>
import { formatPrice, formatWeight, decimalInput,closeNowTag } from "@/libs/util";
import { InventoryProcessQueryPackageInfo, InventoryProcessSaveProcessPack } from '@/api/process';
import { InventoryProcessProcessInfo } from '@/api/process';
export default {
  name: "ProcessPack",
  data() {
    return {
      processId: this.$route.query.processId,
      single: false,
      tableData: [],
      //选中的数据
      selection: [],
      selectAll: false,
      packageResult: [],
      initPackageInfo: [],
      isPackage:[],
      deleteData:[],
      deleteSelectAll: false,
      ownerId: '',
      ownerName: '',
      packageCode : 0,
      buttonDisabled: false
    };
  },
  methods: {
    getData() {
      InventoryProcessQueryPackageInfo({
          processId: this.processId
      }).then(res => {
          if(res.data.code == '200') {
              const data = res.data.data;
              var processInfo = data.processInfo ? data.processInfo : [];
              this.ownerId = data.ownerId;
              this.ownerName = data.ownerName;
              this.initPackageInfo = data.packageInfo.map(o=>{
                o.select = false;
                o.processProducts = o.processPackItemDTOS.map(o1 => {
                  o.materialId = o1.processMaterialId;
                  o1.packageNumber = o1.number;
                  o1.packageWeight = o1.perWeight*o1.number;
                  processInfo.map(o2 => {
                    o2.processProducts.map(o3 => {
                      if(o1.processProductId == o3.productId) {
                        o1.number = o3.number;
                      }
                    })
                  })
                  return JSON.parse(JSON.stringify(o1));
                })
                return JSON.parse(JSON.stringify(o));
              });
              this.packageCode = this.initPackageInfo.length;
              this.packageResult = JSON.parse(JSON.stringify(this.initPackageInfo));
              this.tableData = processInfo.map( o=> {
                o.processProducts = o.processProducts.map(o1 => {
                  o1.select = false;
                  o1.packageNumber = null;
                  return o1;
                })
                return o;
              })
          } else {
              this.$Message.error(res.data.msg);
          }
      })
    },
    singleCheck(flag, processInfoIndex, processProductsIndex){
      let processProductsLen = 0;
      for(let i in this.tableData) {
        processProductsLen += this.tableData[i].processProducts.length;
      }

      if(flag) {
        this.selection.push({
          processInfoIndex: processInfoIndex,
          processProductsIndex: processProductsIndex
        })
        if(processProductsLen == this.selection.length) {
          this.selectAll = true;
        }
      } else {
        let selection = JSON.parse(JSON.stringify(this.selection));
        this.selectAll = false;
        selection.map((o, i) => {
          if(o.processInfoIndex == processInfoIndex && o.processProductsIndex == processProductsIndex) {
            this.selection.splice(i,1);
          }
        })
      }
    },
    checkAll(flag) {
      this.selection = [];
      if(flag) {
        this.tableData.map((o,i)=> {
          o.processProducts.map((o1,j) => {
            this.tableData[i].processProducts[j].select = true;
            this.selection.push({
              processInfoIndex: i,
              processProductsIndex: j
            })
          })
        })
      } else {
         this.tableData.map((o,i)=> {
          o.processProducts.map((o1,j) => {
            this.tableData[i].processProducts[j].select = false;
          })
        })
      }
    },
    selectPackageAll(flag){
      this.deleteData = [];
      if(flag) {
        this.packageResult.map((o,i) => {
          o.select  = true;
          this.deleteData.push({
            materialId: o.materialId
          })
        })
      } else {
        this.packageResult.map((o,i) => {
          o.select  = false;
        })
      }
    },
    singleSelect(flag, i) {
      let processProductsLen = 0;
      if(flag) {
        this.deleteData.push({
          materialId: this.packageResult.materialId
        })

        if(this.packageResult.length == this.deleteData.length) {
          this.deleteSelectAll = true;
        }
      } else {
        let deleteData = JSON.parse(JSON.stringify(this.deleteData));
        this.deleteSelectAll = false;
        deleteData.map((o, i) => {
          if(o.materialId == this.packageResult[i].materialId) {
             this.deleteData.splice(i,1);
          }
        })
      }
    },
    deletePackage(i) {
      this.packageResult[i].processProducts.map(o => {
        this.tableData.map(o1 => {
          o1.processProducts.map(o2 => {
            if(o.productId == o2.productId ||　o.processProductId　==　o2.productId) {
              o2.packagedNumber -= o.packageNumber;
              o2.unPackageNumber += o.packageNumber;
            }
          })
        })
      })
      this.packageResult.splice(i,1);
      if(i < this.packageCode) {
        this.packageCode --;
      }
    },
    batchDelete(){
      this.$Modal.confirm({
          title: '信息确认',
          content: '<p>是否删除全部已选择的打包记录?</p>',
          onOk: () => {
            let packageResult = JSON.parse(JSON.stringify(this.packageResult));
            if(this.deleteSelectAll) {
              this.packageResult.map((o,i) => {
                if(o.select) {
                  o.processProducts.map(o1 => {
                    this.tableData.map(o2 => {
                      o2.processProducts.map(o3 => {
                        if(o1.productId == o3.productId || o1.processProductId　== o3.productId) {
                          o3.packagedNumber -= o1.packageNumber;
                          o3.unPackageNumber += o1.packageNumber;
                        }
                      })
                    })
                  })
                }
              })
              this.packageCode = 0;
              this.packageResult = [];
              this.deleteData = [];
            } else {
              this.packageResult.map((o,i) => {
                if(o.select) {
                  o.processProducts.map(o1 => {
                    this.tableData.map(o2 => {
                      o2.processProducts.map(o3 => {
                        if(o1.productId == o3.productId || o1.processProductId　== o3.productId || o1.processProductId　== o3.processProductId　) {
                          o3.packagedNumber -= o1.packageNumber;
                          o3.unPackageNumber += o1.packageNumber;
                        }
                      })
                    })
                  })
                }
              })

              //批量删除的数量
              let account = 0;
              this.packageResult.map((o,i) => {
                if(o.select) {
                  account ++ ;
                }
              })
              
              for(var i = 0; i < account; i++) {
                this.packageResult.map((o,i) => {
                  if(o.select) {
                    this.packageResult.splice(i,1);
                    if(i < this.packageCode) {
                      this.packageCode --;
                    }
                  }
                })
              }
            }
            this.deleteSelectAll = false;
          },
          onCancel: () => {
          }
      });
    },
    //点击打包
    packageBill(){
      let packageNumberFlag = true;
      for(var i in this.tableData) {
        for(var j in this.tableData[i].processProducts) {
          if(this.tableData[i].processProducts[j].select && !this.tableData[i].processProducts[j].packageNumber) {
            //选中的数据打包数量是否大于0
            packageNumberFlag = false;
            break;
          }
        }
        if(!packageNumberFlag) {
          break;
        }
      }

      if(this.selection.length == 0) {
        this.$Modal.warning({
          title: '提示',
          content: '请选择要打包的成品'
        });
      } else if(!packageNumberFlag) {
        this.$Modal.warning({
            title: '提示',
            content: '请输入打包数量'
          });
      } else {
        this.selection = [];
        this.selectAll = false;
        let temp = {
          id: '',
          processCode: '',
          processProducts: []
        };
        this.tableData.map((o,i) => {
          o.processProducts.map((o1,j) => {
            if(o1.select) {
              var tempObj = JSON.parse(JSON.stringify(o1));
              tempObj.packageWeight = o1.packageNumber/o1.number*o1.weight;
              temp.processProducts.push(tempObj);
            }
            //改变打包数量和已打包数量
            if(o1.select) {
              o1.packagedNumber += o1.packageNumber;
              o1.unPackageNumber -= o1.packageNumber;
            }
            o1.packageNumber = null;
            o1.select = false;
          })
          
        })
        if(temp.processProducts.length > 0) {
          this.packageResult.push(temp);
        }
      }
    },
    save(){
      var processCode = this.$route.query.processCode;
      let isPackage = [];
      let unPackage = {
        processCode: processCode,
        processPackItemDTOS:[]
      };

      this.packageResult.map(o => {
        let temp = {
          id: o.id?o.id:0,
          processCode: processCode,
          processPackItemDTOS: []
        }
        o.processProducts.map(o1 => {
          temp.processPackItemDTOS.push({
            // inventoryType: '',
            // note: '',
            number: o1.packageNumber,
            processMaterialId: o1.processMaterialId?o1.processMaterialId:o1.materialId,
            processProductId: o1.processProductId? o1.processProductId:o1.productId,
            weight: formatWeight(o1.perWeight* o1.packageNumber)
          })
        })
        isPackage.push(temp);
      })
      this.tableData.map(o => {
        o.processProducts.map(o1 => {
          if(o1.unPackageNumber > 0) {
            unPackage.processPackItemDTOS.push({
              // inventoryType: 0,
              // note: "",
              number: o1.unPackageNumber,
              processMaterialId: o1.processMaterialId?o1.processMaterialId:o1.materialId,
              processProductId: o1.processProductId? o1.processProductId:o1.productId,
              weight: formatWeight(o1.unPackageNumber*o1.perWeight)
            })
          }
        })
      })

      this.buttonDisabled = true;
      if(this.packageResult.length > 0) {
        InventoryProcessSaveProcessPack({
          ownerId: this.ownerId,
          ownerName: this.ownerName,
          processId: this.processId,
          isPackage: isPackage,
          unPackage: unPackage
        }).then(res => {
          if(res.data.code == "200") {
            this.buttonDisabled = false;
            this.$Message.success('打包成功');
            closeNowTag(this.$store.state.app, this.$route);
            this.$router.push({ 
              name:'ProcessList'
            });
          } else {
            this.$Message.error(res.data.msg);
          }
        })
      } else {
        this.$Modal.warning({
          title: '提示',
          content: '请先打包'
        });
      }
    },
    cancel() {
      this.$Modal.confirm({
          title: '提示',
          content: '<p>请确认是否取消?</p>',
          onOk: () => {
              closeNowTag(this.$store.state.app, this.$route);
              this.$router.push({
                  name: 'ProcessList'
              })
          },
          onCancel: () => {

          }
      });
    },
    inputNum(value) {
        return decimalInput(value,16,0);
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style lang="less" scoped>
.table-content {
  border-left: 1px solid #ddd;
  border-top: 1px solid #ddd;
  position: relative;
}
.table-content .table1 {
  width: 100%;
  overflow: auto;
}
.table-content .table1 table {
  table-layout: auto;
  min-width: 1600px;
}
.table-content .table1 .ivu-table-cell {
  white-space: nowrap;
}
@{deep} .table-content .table1 tr:hover td {
  background-color: #FEF8E1
}
.text-center {
  text-align: center;
}
.text-right {
  text-align: right;
}
@deep: ~'>>>';
.error-border {
    @{deep} .ivu-input{
       border-color: #ed4014
    }
}
@{deep} .ivu-input, .ivu-input-number {
    min-width: 140px;
    width: 100%;
}
</style>
