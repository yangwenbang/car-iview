<template>
    <div class="white-bg">
        <Form :label-width="150" class="search-form" ref="formParams" :model="formParams">
            <Row>
               <Col :sm="8" :xs="24">
                <FormItem label="出库结算单号:">
                    <div class="val-text">{{formParams.outSettleCode}}</div>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="货主:">
                    <div class="val-text">{{formParams.ownerName}}</div>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="货物类型:">
                    <div class="val-text">{{formParams.type==0?'原料':formParams.type==1?'成品':''}}</div>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="结算方式:">
                    <div class="val-text">{{payTypeList[formParams.settleType]}}</div>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="结算客户:">
                    <div class="val-text">{{formParams.settleCustomerName}}</div>
                </FormItem>
                </Col>
                <Col :sm="24" :xs="24">
                <FormItem label="备注:">
                    <Input v-model="formParams.remark" type="textarea" :maxlength="200" :autosize="{minRows: 2,maxRows: 5}" />
                </FormItem>
                </Col>
            </Row>
        </Form>
        <Row class="margin-top-20 margin-bottom-10">
            <Col span="24">
            <div class="pull-left table-title">出库结算单明细
            </div>
            <div class="pull-right count-content">
                <span class="margin-right-10">出库总数量：
                    <b class="tip">{{formParams.numberTotal}}</b> 件</span>
                <span class="margin-right-10">出库总重量：
                    <b class="tip">{{formParams.weightTotal | formatWeight}}</b> 吨</span>
            </div>
            </Col>
        </Row>
        <Table :row-class-name="rowClassName" :columns="tableColumns" :data="tableData" border class="validTable vertical-middle">
            <template slot-scope="{ row, index }" slot="outSinglePrice">
                <Form :ref="'formSinglePrice'+index" :model="row">
                    <FormItem class="input-number-no-operate" prop="outSinglePrice" :rules="{type:'number',required: true, message: '请输入出库单价', trigger: 'blur'}">
                        <!-- <Input :disabled="row.isDisabled" :maxlength="20" v-model="row.outSinglePrice" @on-keyup="changeSinglePrice(row,index)"></Input> -->
                        <InputNumber :disabled="row.isDisabled" v-model="row.outSinglePrice" @on-change="changeSinglePrice(row,index)" :parser="inputDecimal"/>
                    </FormItem>
                </Form>
            </template>

            <template slot="otherPrice" slot-scope="{ row, index }">
                <Form :ref="'formOtherPrice'+index" :model="row">
                    <FormItem class="input-number-no-operate" prop="otherPrice" :rules="[priceRules]">
                        <!-- <Input :disabled="row.isDisabled" :maxlength="20" v-model="row.otherPrice" @on-keyup="changeOtherPrice(row,index)"></Input> -->
                        <InputNumber :disabled="row.isDisabled" v-model="row.otherPrice" @on-change="changeOtherPrice(row,index)" :parser="inputDecimal"/>
                    </FormItem>
                </Form>
            </template>
            <div slot="footer" class="table-foot">
                <Form :label-width="150" class="search-form margin-top-15" ref="formPrice" :model="formPrice" :rules="rulePrice">
                    <Row>
                        <Col :sm="8" :xs="24">
                            <FormItem class="input-number-no-operate" label="附加费:" prop="extraCharge">
                                <!-- <Input v-model="formPrice.extraCharge" :maxlength="20" @on-keyup="totalAmount"> -->
                                <InputNumber v-model="formPrice.extraCharge" @on-change="totalAmount" :parser="inputDecimal"/>
                                <span slot="append">元</span></Input>
                            </FormItem>
                        </Col>
                        <Col :sm="8" :xs="24">
                            <FormItem class="input-number-no-operate" label="打包费:" prop="packageCharge">
                                <!-- <Input v-model="formPrice.packageCharge" :maxlength="20" @on-keyup="totalAmount"> -->
                                <InputNumber v-model="formPrice.packageCharge" @on-change="totalAmount" :parser="inputDecimal"/>
                                <span slot="append">元</span></Input>
                            </FormItem>
                        </Col>
                        <Col :sm="8" :xs="24">
                            <div class="val-text text-right margin-right-20"><span class="total-money">结算总金额：<b class="tip color-red">{{formParams.amountTotal | formatPrice}}</b> 元</span></div>
                        </Col>
                    </Row>
                </Form>
            </div>
        </Table>
        <div class="text-center margin-top-20">
            <Button type="primary" class="btn-common-width" @click="handleSubmit">保存</Button>
            <Button class="btn-common-width margin-left-10" @click="backFun">取消</Button>
        </div>
        <Modal v-model="modal1" title="母卷信息" width="60%" ok-text="确定">
            <div class="table-scrollable left-right-table" v-if="mjInfor">
                <table border="1">
                    <tbody>
                        <tr>
                            <td class="left-bg">编号：</td>
                            <td>{{mjInfor.code}}</td>
                            <td class="left-bg">产地：</td>
                            <td>{{mjInfor.brandName}}</td>
                        </tr>
                        <tr>
                            <td class="left-bg">品名：</td>
                            <td>{{mjInfor.breedName}}</td>
                            <td class="left-bg">材质：</td>
                            <td>{{mjInfor.materialName}}</td>
                        </tr>
                        <tr>
                            <td class="left-bg">数量（件）：</td>
                            <td>{{mjInfor.number}}</td>
                            <td class="left-bg">单件重量（吨）：</td>
                            <td>{{mjInfor.perAmount | formatWeight}}</td>
                        </tr>
                        <tr>
                            <td class="left-bg">计重方式：</td>
                            <td>{{mjInfor.weightType == '0' ? "抄码" : mjInfor.weightType == '1' ? "过磅" : mjInfor.weightType == '2' ? "理重" : ""}}</td>
                            <td class="left-bg">钢卷号/捆包号：</td>
                            <td>{{mjInfor.baleNumber}}</td>
                        </tr>
                        <tr>
                            <td class="left-bg">包装：</td>
                            <td>{{mjInfor.wrap}}</td>
                            <td class="left-bg">外观：</td>
                            <td>{{mjInfor.appearance}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <h3 v-else style="text-align:center;">没有母卷信息</h3>
            <div slot="footer">
                <Button type="primary" @click="modal1=false">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import OutGoods from "./components/OutGoods";
import { OutSettleDetail,updateOutSettlePrice,getParentInventoryItemDetail} from "@/api/outstock";
import { closeNowTag,formatPrice,formatWeight,decimalInput } from "@/libs/util";
export default {
    name: "EditPriceOutstockSettlement",
    components: { OutGoods },
    data() {
        const validateMoney = (rule, value, callback) => {
            if(value){
                if (!Number(value)) {
                    callback(new Error('请输入数字'));
                } else {
                    if(value < 0){
                        callback(new Error('不能为负'));
                    }
                    if(String(value).indexOf(".")>-1){
                        let val_arr = String(value).split(".");
                        if(val_arr[1].length>2){
                            callback(new Error('最多两位小数点'));
                        }
                    }
                    callback();
                }
            }else{
                callback();
            }
        };   
        return {
            hasMJ: false,
            modal1: false,
            mjInfor: {},
            formParams: {
                settleCustomerId:"",
                settleCustomerName:"",
            },
            ownerId:"",
            formPrice:{
                extraCharge:null,
                packageCharge:null,
            },
            priceRules: {
                validator: validateMoney, trigger: 'blur'
            },
            rulePrice:{
                extraCharge: [{type:"number", validator: validateMoney, trigger: 'blur' }],
                packageCharge: [{type:"number",validator: validateMoney, trigger: 'blur' }]
            },
            payTypeList:{
                "0":"月结",
                "1":"现结",
                "2":"其他"
            },
            tableData:[],
            oldDeletedIds: [],
            tableColumns: [
                // {
                //     title: "操作",
                //     align: "center",
                //     minWidth: 80,
                //     render: (h, data) => {
                //         if(data.row.isDisabled){
                //             return h("div", [
                //                 h("a", {
                //                     on: {
                //                         click: () => {
                //                             var index = this.oldDeletedIds.indexOf(data.row.id);
                //                             this.oldDeletedIds.splice(index, 1);
                //                             this.tableData[data.index].isDisabled = false;
                //                             this.totalAmount();
                //                         }
                //                     }
                //                 },'取消删除')
                //             ]);
                //         }else{
                //             return h("div", [
                //                 h("Icon", {
                //                     props: {
                //                         type: "md-remove-circle",
                //                         size: 20
                //                     },
                //                     class: "tb-link-remove color-red",
                //                     on: {
                //                         click: () => {
                //                             let countDisabled = 0;
                //                             for(var i=0;i<this.tableData.length;i++){
                //                                 if(!this.tableData[i].isDisabled){
                //                                     countDisabled++
                //                                 }
                //                             }
                //                             if(countDisabled == 1){
                //                                 this.$Message.error({
                //                                     content: "至少保留一条信息！",
                //                                     duration: 1
                //                                 });
                //                             }else{
                //                                 //如果是删除了原来的，那就要记下来id,新添加的明细是没有id的
                //                                 if(data.row.id){
                //                                     this.oldDeletedIds.push(data.row.id);
                //                                     this.tableData[data.index].isDisabled = true;
                //                                 }else{
                //                                     this.tableData.splice(data.index, 1);
                //                                 }
                //                                 this.totalAmount();
                //                             }
                                            
                //                         }
                //                     }
                //                 })
                //             ]);
                //         }
                //     }
                // },
                {
                    title: "编号",
                    key: "code",
                    align: "left",
                    minWidth: 120
                },
                {
                    title: "打包号",
                    key: "packCode",
                    align: "left",
                    minWidth: 120
                },
                {
                    title: "产地",
                    key: "brandName",
                    align: "left",
                    minWidth: 100
                },
                {
                    title: "品名",
                    key: "breedName",
                    align: "left",
                    minWidth: 120
                },
                {
                    title: "材质",
                    key: "materialName",
                    align: "left",
                    minWidth: 100
                },
                {
                    title: "规格",
                    key: "specName",
                    align: "left",
                    minWidth: 100
                },
                {
                    title: "库区",
                    key: "storageArea",
                    align: "left",
                    minWidth: 100
                },
                {
                    title: "库位",
                    key: "storagePlace",
                    align: "left",
                    minWidth: 100
                },
                {
                    title: "可结算数量(件)",
                    key: "remainNum",
                    align: "right",
                    minWidth: 120
                },
                {
                    title: "出库结算数量(件)",
                    key: "realOutNumber",
                    align: "right",
                    minWidth: 140
                },
                {
                    title: "单件重量(吨)",
                    key: "perAmount",
                    align: "right",
                    minWidth: 100,
                    render: (h, data) => {
                        return h("span", formatWeight(data.row.perAmount));
                    }
                },
                {
                    title: "出库结算重量(吨)",
                    key: "totalWeight",
                    align: "right",
                    minWidth: 130,
                    render: (h, data) => {
                        return h("span", formatWeight(data.row.totalWeight));
                    }
                },
                {
                    title: "计量方式",
                    key: "weightType",
                    align: "left",
                    minWidth: 80,
                    render: (h, params) => {
                        let text = "";
                        if(params.row.weightType==0){
                            text = "抄码";
                        }else if(params.row.weightType==1){
                            text = "过磅";
                        }else if(params.row.weightType==2){
                            text = "理重";
                        }
                        return h("span",text);
                    }
                },
                {
                    title: "出库单价(元/吨)",
                    slot: "outSinglePrice",
                    minWidth: 140,
                    renderHeader: (h, params) => {
                        return h("div", [
                            h(
                                "span",
                                {
                                    style: {color: "red"}
                                },
                                "*"
                            ),
                            h("span", "出库单价(元/吨)")
                        ]);
                    },
                },
                {
                    title: "出库费用(元)",
                    key: "outTotalPrice",
                    align: "right",
                    minWidth: 110,
                    render: (h, data) => {
                        return h("span", formatPrice(data.row.outTotalPrice));
                    }
                },
                {
                    title: "其他费用(元)",
                    slot: "otherPrice",
                    minWidth: 120
                },
                {
                    title: "总金额(元)",
                    key: "totalMoney",
                    align: "right",
                    minWidth: 120,
                    render: (h, data) => {
                        return h("span", formatPrice(data.row.totalMoney));
                    }
                },
                {
                    title: "包装",
                    key: "wrap",
                    align: "left",
                    minWidth: 100
                },
                {
                    title: "外观",
                    key: "appearance",
                    align: "left",
                    minWidth: 100
                },
                {
                    title: "钢卷号/捆包号",
                    key: "baleNumber",
                    align: "left",
                    minWidth: 120
                },
            ],
            totalNumber:"",
            totalWeight:"",
            totalMoney:"",
            selectedIds:[]
        };
    },
    mounted() {
        this.getList();
    },
    methods: {
        inputDecimal(value){
            return decimalInput(value,14,2)
        },
        rowClassName (row, index) {
            if(row.isDisabled){
                return 'table-info-error';
            }else{
                return '';
            };
        },
        /**获取出库结算单明细列表*/
        getList() {
            OutSettleDetail({
                id: this.$route.query.id
            }).then(res => {
                if(res.data.code=="200"){
                    let data = res.data.data;
                    this.formParams = data;
                    this.formParams.settleCustomerId = this.formParams.settleCustomerId.toString();
                    this.formPrice.extraCharge =data.extraCharge ? parseFloat(data.extraCharge) : null;
                    this.formPrice.packageCharge =data.packageCharge ? parseFloat(data.packageCharge) : null;
                    this.ownerId = data.ownerId.toString();
                    if (this.formParams.type == 1) {
                        if (!this.hasMJ) {
                            this.tableColumns.splice(5, 0, {
                            title: "母卷信息",
                            align: "center",
                            minWidth: 80,
                            render: (h, data) => {
                                if (data.row.type == 1) {
                                return h(
                                    "a",
                                    {
                                    class: "tb-link",
                                    on: {
                                        click: () => {
                                        this.modal1 = true;
                                        this.getMjInfor(data.row.id);
                                        }
                                    }
                                    },
                                    "查看"
                                );
                                } else {
                                return h("span", "无");
                                }
                            }
                            });
                        }
                        this.hasMJ = true;
                        } else {
                        if (this.hasMJ) {
                            this.tableColumns.splice(5, 1);
                        }
                        this.hasMJ = false;
                    }
                    for(let i = 0;i<data.itemList.length;i++){
                        this.tableData.push({
                            id: data.itemList[i].id,//出库结算单明细ID
                            inventoryItemId: data.itemList[i].inventoryItemId,//物资明细ID
                            ownerName: data.ownerName,
                            warehouseId: data.warehouseId,
                            warehouseName: data.warehouseName,
                            code: data.itemList[i].code,
                            brandName: data.itemList[i].brandName,
                            breedName: data.itemList[i].breedName,
                            materialName: data.itemList[i].materialName,
                            specName: data.itemList[i].specName,
                            storageArea: data.itemList[i].storageArea,
                            storagePlace: data.itemList[i].storagePlace,
                            remainNum: Number(data.itemList[i].remainNum)+Number(data.itemList[i].number), //编辑的时候可结算数量要加上原出库的数量
                            realOutNumber: data.itemList[i].number,
                            perAmount: data.itemList[i].perAmount,
                            totalWeight: data.itemList[i].weight,
                            weightType: data.itemList[i].weightType,
                            outSinglePrice: data.itemList[i].price ? parseFloat(data.itemList[i].price) : null,
                            outTotalPrice: data.itemList[i].outAmount,
                            otherPrice: data.itemList[i].otherCharge ? parseFloat(data.itemList[i].otherCharge) : null,
                            totalMoney: data.itemList[i].amount,
                            wrap: data.itemList[i].wrap,
                            appearance: data.itemList[i].appearance,
                            baleNumber: data.itemList[i].baleNumber,
                            type:data.itemList[i].type,
                            packCode:data.itemList[i].packCode,
                            isDisabled:false
                        });
                    }
                }
            });
        },
        getMjInfor(inventoryItemId) {
            getParentInventoryItemDetail({ inventoryItemId: inventoryItemId }).then(
                res => {
                this.mjInfor = res.data.data;
                }
            );
        },
        /** 出库单价 联动 出库费用,总金额 */
        changeSinglePrice(row,index){
            let a = row.outSinglePrice?(isNaN(row.outSinglePrice)?0:row.outSinglePrice):0;//出库单价
            let d = row.otherPrice?(isNaN(row.otherPrice)?0:row.otherPrice):0;//其他费用
            //出库费用=出库总重量*出库单价
            row.outTotalPrice = row.totalWeight *a ? (row.totalWeight *a).toFixed(2) : "0.00"; 
            //总金额=出库费用+其他费用
            row.totalMoney = Number(row.outTotalPrice) + Number(d) ? (Number(row.outTotalPrice) + Number(d)).toFixed(2) : "0.00";
            //将修改完的值赋给原始的tableData
            this.tableData[index] = row;
            //表格头部的合计变化
            this.totalAmount();
        },
        /** 其他费用 联动 总金额 */
        changeOtherPrice(row,index){
            let d = row.otherPrice?(isNaN(row.otherPrice)?0:row.otherPrice):0;//其他费用
            //总金额=出库费用+其他费用
            row.totalMoney = Number(row.outTotalPrice) + Number(d) ? (Number(row.outTotalPrice) + Number(d)).toFixed(2) : "0.00";
            //将修改完的值赋给原始的tableData
            this.tableData[index] = row;
            //表格头部的合计变化
            this.totalAmount();
        },
        /**合计的总数量，总重量 ，总金额 */
        totalAmount(){
            var number = 0,weight=0,money=0;
            for(let i =0;i<this.tableData.length;i++){
                if(!this.tableData[i].isDisabled){
                    number += Number(this.tableData[i].realOutNumber);
                    weight += Number(this.tableData[i].totalWeight);
                    money += Number(this.tableData[i].totalMoney);
                }
            }
            this.formParams.numberTotal = number;
            this.formParams.weightTotal = weight ? weight.toFixed(4) : "0.0000";
            //附加费
            let extraCharge = this.formPrice.extraCharge?(isNaN(this.formPrice.extraCharge)?0:Number(this.formPrice.extraCharge)):0;
            //打包费
            let packageCharge = this.formPrice.packageCharge?(isNaN(this.formPrice.packageCharge)?0:Number(this.formPrice.packageCharge)):0;
            //总金额=表格合计总金额+附加费+打包费
            this.formParams.amountTotal = (money+packageCharge+extraCharge)? (money+packageCharge+extraCharge).toFixed(2) : "0.00";
        },
        /** 出库结算单明细验证*/
        checkTable(){
            //循环验证出库单价
            let singlePriceFlagArr = [];
            for (let i = 0, len = this.tableData.length; i < len; i++) {
                this.$refs["formSinglePrice" + i].validate(valid => {
                    if (valid) {
                        singlePriceFlagArr[i]=true;
                    } else {
                        singlePriceFlagArr[i]=false;
                    }
                });
            }
            //循环验证其他费用
            let otherPriceFlagArr  = [];
            for (let i = 0, len = this.tableData.length; i < len; i++) {
                this.$refs["formOtherPrice" + i].validate(valid => {
                    if (valid) {
                        otherPriceFlagArr[i]=true;
                    } else {
                        otherPriceFlagArr[i]=false;
                    }
                });
            }
            //验证下面的打包费和附加费
            let formPriceFlag;
            this.$refs['formPrice'].validate(valid => {
                if (valid) {
                    formPriceFlag=true;
                } else {
                    formPriceFlag=false;
                }
            });
            //所有的验证只要有一个没通过，就不通过
            if(singlePriceFlagArr.indexOf(false) > -1||otherPriceFlagArr.indexOf(false) > -1||!formPriceFlag){
                return false;
            }else{
               return true; 
            } 
        },
        /** 保存出库结算单*/
        handleSubmit() {
            let tableFlag = this.checkTable();
            if(tableFlag){
                let tbLength = 0;
                for(var i=0;i<this.tableData.length;i++){
                    if(!this.tableData[i].isDisabled){
                        tbLength++
                    }
                }
                if(tbLength>0){
                    let para = {
                        id: this.$route.query.id,
                        deleteIds:this.oldDeletedIds.join(","),
                        ownerId:this.ownerId,
                        ownerName:this.formParams.ownerName,
                        warehouseId:this.tableData[0].warehouseId,
                        warehouseName:this.tableData[0].warehouseName,
                        settleCustomerId:this.formParams.settleCustomerId,
                        settleCustomerName:this.formParams.settleCustomerName,
                        type:this.formParams.type,
                        remark:this.formParams.remark,
                        settleType:this.formParams.settleType,

                        extraCharge:this.formPrice.extraCharge?Number(this.formPrice.extraCharge):0,
                        packageCharge:this.formPrice.packageCharge?Number(this.formPrice.packageCharge):0
                    }
                    let outSettleItemDTOs = [];
                    for(let i =0;i<this.tableData.length;i++){
                        if(!this.tableData[i].isDisabled){
                            outSettleItemDTOs.push({
                                weight:this.tableData[i].totalWeight?Number(this.tableData[i].totalWeight):0,
                                id: this.tableData[i].id?this.tableData[i].id:"",
                                inventoryItemId:this.tableData[i].inventoryItemId,
                                number:this.tableData[i].realOutNumber,
                                otherCharge:this.tableData[i].otherPrice?Number(this.tableData[i].otherPrice):0,
                                price:this.tableData[i].outSinglePrice?Number(this.tableData[i].outSinglePrice):0,
                            })
                        }
                    }
                    para.outSettleItemDTOs = outSettleItemDTOs;
                    updateOutSettlePrice(para).then(res => {
                        if(res.data.code=="200"){
                            this.$Message.success({
                                content: "修改出库结算单价格成功!",
                                duration: 1
                            });
                            setTimeout(() => {
                                closeNowTag(this.$store.state.app, this.$route);
                                this.$router.push({
                                    name: "OutstockSettlement"
                                });
                            }, 1000);
                        }else{
                            this.$Message.error({
                                content: res.data.msg,
                                duration: 1
                            });
                        }
                        
                    });
                }else{
                    this.$Message.error({
                        content: "请选择出库货物!",
                        duration: 1
                    });
                }
            }else{
                return false;
            }
        },
        /**取消*/
        backFun() {
            this.$Modal.confirm({
                title: "提示",
                content: "有数据未保存，是否确定放弃？",
                onOk: () => {
                    closeNowTag(this.$store.state.app, this.$route);
                    this.$router.push({
                        path: "OutstockSettlement"
                    });
                },
                onCancel: () => {}
            });
        }
    },
    watch: {
        //监听相同路由下参数变化的时候，从而实现异步刷新
        '$route'(to,from) {
            //重新获取数据
            if(to.name=="EditOutstockSettlement"){
                this.tableData =[];
                this.getList();
            }
            
        },
    }
};
</script>
<style scoped>
.search-form .ivu-form-item {
  margin-bottom: 20px;
}
.total-money{
    display: block;
    margin-top: -5px;
}
</style>


