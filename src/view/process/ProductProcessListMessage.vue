<template>
    <Row type="flex" justify="center" class="white-bg">
        <Col :xs="24" :sm="24" :md="24">
        <div class="table-scrollable left-right-table">
            <table border="1">
                <tbody>
                    <tr>
                        <td class="left-bg">加工单号：</td>
                        <td>{{formValidate.processCode}}</td>
                        <td class="left-bg">货主：</td>
                        <td>{{formValidate.ownerName}}</td>
                        <td class="left-bg">交货日期：</td>
                        <td>{{formValidate.expectDeliverTime}}</td>
                    </tr>
                    <tr>
                        <td class="left-bg">加工机组：</td>
                        <td>{{formValidate.deviceName}}</td>
                        <td class="left-bg">加工方式：</td>
                        <td>{{typeName}}</td>
                        <td class="left-bg">制单日期：</td>
                        <td>{{formValidate.createTime}}</td>
                    </tr>
                    <tr>
                        <td class="left-bg">制单人：</td>
                        <td>{{formValidate.creator}}</td>
                        <td class="left-bg">开始加工时间：</td>
                        <td>{{formValidate.startProcessTime}}</td>
                        <td class="left-bg"></td>
                        <td colspan="3"></td>
                    </tr>
                    <tr>
                        <td class="left-bg">加工要求描述：</td>
                        <td colspan="5">{{formValidate.processDemand}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="margin-top-20">
             <Steps :current="progress">
                <Step title="确认开始" ></Step>
                <Step title="录入加工数据" ></Step>
                <Step title="加工完成，成品入库" ></Step>
            </Steps>
        </div>
        <ProcessMessageTable  v-show="progress == 0" :type="typeName" :data="tableData"></ProcessMessageTable>
        <ProductProcessingScissors v-show="progress == 1 && typeName == '纵剪'" :propData="tableData"  @change="tableDataChange" :validate="isValidate" :processStatus="status"></ProductProcessingScissors>
        <ProductProcessingOpen v-show="progress == 1 && typeName == '开平'" :propData="tableData"  @change="tableDataChange" :validate="isValidate" :processStatus="status"></ProductProcessingOpen>
        <GoodsWarehousing v-show="progress == 2" :tableData="tableData" :type="typeName"></GoodsWarehousing>
        </Col>
        <div class="text-center margin-top-10">
            <Button v-show="progress == 0" class="btn-common-width margin-right-10" type="primary" :disabled="buttonDisabled" @click="start">确认开始</Button>
            <Button v-show="progress == 1" class="btn-common-width margin-right-10" type="primary" :disabled="buttonDisabled1" @click="submit">保存</Button>
            <Button v-show="progress == 2" class="btn-common-width margin-right-10" type="primary" @click="preStep">上一步</Button>
            <Button v-show="progress == 2" class="btn-common-width margin-right-10" type="primary" :disabled="buttonDisabled2" @click="finish">加工完成</Button>
            <Button v-if="progress == 1" class="btn-common-width margin-right-10" @click="cancel">取消</Button>
            <Button v-else class="btn-common-width margin-right-10" @click="commonCancel">取消</Button>
        </div>
    </Row>
</template>

<script>
import { closeNowTag } from "@/libs/util";
import ProcessMessageTable from './components/ProcessMessageTable';
import ProductProcessingScissors from './components/ProductProcessingScissors';
import ProductProcessingOpen from './components/ProductProcessingOpen';
import GoodsWarehousing from './components/GoodsWarehousing';
import { InventoryProcessProduceProcessInfo,InventoryProcessStartProcess, InventoryProcessInputProcessData, InventoryProcessProcessComplete } from '@/api/process'
export default {
    name: "ProductProcessListMessage",
    components: {
        ProcessMessageTable,
        ProductProcessingScissors,
        GoodsWarehousing,
        ProductProcessingOpen
    },
    data() {
        return {
            formValidate: {
                processCode: '',
                expectDeliverTime: '',
                deviceName: '',
                processType: '',
                createTime: '',
                creator: '',
                startProcessTime: '',
                processDemand: ''
            },
            status: 0,
            emitData: {processProductList: [],processMaterialScrapList: []},
            typeName: '开平',
            processId: this.$route.query.processId,
            progress: this.$route.query.progress ? Number(this.$route.query.progress) : 0,
            //是否开启验证
            isValidate: false,
            //验证结果
            validated: true,
            tableData:[],
            currentTableData: [],
            buttonDisabled: false,
            buttonDisabled1: false,
            buttonDisabled2: false
        };
    },
    methods: {
        getTypeName(code) {
            let name = '';
            switch(code) {
                case 0: name = '开平'; break;
                case 1: name = '纵剪'; break;
                case 2: name = '纵剪+开平'; break;
            }
            return name;
        },
        start() {
            this.$Modal.confirm({
                title: '信息确认',
                content: '<p>是否确认开始本次加工</p>',
                onOk: () => {
                    this.buttonDisabled = true;
                    InventoryProcessStartProcess({
                        processId: this.processId
                    }).then(res => {
                        if(res.data.code == '200') {
                            this.buttonDisabled = false;
                            this.progress = 1;
                            this.getData();
                            this.$Message.success(res.data.data);
                        } else {
                            this.$Message.error(res.data.msg);
                        }
                    })
                },
                onCancel: () => {

                }
            });
        },
        submit() {
            //开启验证
            this.isValidate = true;
            this.validated = true;
            let validatedProcessMateria = true;
            for(var i = 0; i < this.emitData.processProductList.length; i++) {
                let o = this.emitData.processProductList[i];
                if(o.storageAreaId == "" || o.storageAreaId == undefined|| o.storagePlaceId == "" ||o.storagePlaceId == undefined) {
                    this.validated = false;
                    break;
                }
                if(!this.validated) {
                    break;
                }
            }
            for(var i=0; i < this.emitData.processMaterialScrapList.length; i++) {
                let o = this.emitData.processMaterialScrapList[i];
                for(var j = 0; j < o.processScrapList.length; j++) {
                    var o1 = o.processScrapList[j];
                    if(o1.storageAreaId == "" || o1.storageAreaId == undefined|| o1.storagePlaceId == "" ||o1.storagePlaceId == undefined || o1.number=="" || o1.number==null || o1.number==0 || o1.specName==""|| o1.specName==undefined) {
                        validatedProcessMateria = false;
                    }
                    if(validatedProcessMateria) {
                        validatedProcessMateria = this.validateSpecName(o1.scrapType, o1.specName);
                    }
                    if(!validatedProcessMateria) {
                        break;
                    }
                }
                if(!validatedProcessMateria) {
                    break;
                }
            }

            if(this.validated && validatedProcessMateria) {
                this.buttonDisabled1 = true;
                let processProductList = this.emitData.processProductList.map(o => {
                    return {
                        id: Number(o.id),
                        note: o.note,
                        realWidth: o.realWidth,
                        realNumber: Number(o.realNumber),
                        storageAreaId: Number(o.storageAreaId),
                        storageArea: o.storageArea,
                        storagePlaceId: Number(o.storagePlaceId),
                        storagePlace: o.storagePlace,
                        packItemId: o.packItemId
                    }
                })
                InventoryProcessInputProcessData({
                    processId: this.processId,
                    processProductList: processProductList,
                    processMaterialScrapList: this.emitData.processMaterialScrapList
                }).then(res => {
                    if(res.data.code == '200') {
                        this.buttonDisabled1 = false;
                        this.progress = 2;
                        this.$Message.success(res.data.data);
                        this.getData();
                    } else {
                        this.$Message.error(res.data.msg);
                    }
                })
            }
        },
        tableDataChange(data) {
            this.emitData = JSON.parse(JSON.stringify(data));
        },
        preStep() {
            this.progress = 1;
            this.getData();
        },
        finish() {
            this.$Modal.confirm({
                title: '信息确认',
                content: '<p>确认数据是否无误？完成加工后数据将进入库存！</p>',
                onOk: () => {
                    this.buttonDisabled2 = true;
                    InventoryProcessProcessComplete({
                        processId: this.processId
                    }).then(res => {
                        if(res.data.code == '200') {
                            this.buttonDisabled2 = false;
                            closeNowTag(this.$store.state.app, this.$route);
                            this.$router.push({
                                name: 'ProductProcessList'
                            })
                        } else {
                            this.$Message.error(res.data.msg);
                        }
                    })
                    
                },
                onCancel: () => {

                }
            });
        },
        cancel() {
            this.$Modal.confirm({
                title: '提示',
                content: '<p>取消将不保存填写内容，请确认是否取消?</p>',
                onOk: () => {
                    closeNowTag(this.$store.state.app, this.$route);
                    this.$router.push({
                        name: 'ProductProcessList'
                    })
                },
                onCancel: () => {

                }
            });
        },
        commonCancel() {
            closeNowTag(this.$store.state.app, this.$route);
            this.$router.push({
                name: 'ProductProcessList'
            })
        },
        getData() {
            let notDisplayVolume = this.progress == 2?1:0;
            InventoryProcessProduceProcessInfo({
                processId: this.processId,
                notDisplayVolume: notDisplayVolume
            }).then(res => {
                if(res.data.code == '200') {
                    const data = res.data.data;
                    this.formValidate = data;
                    this.status = data.status;
                    this.typeName = this.getTypeName(data.processType);
                    let tempDate = data.processMaterials ? data.processMaterials : [];
                    this.emitData.processProductList = [];
                    this.emitData.processMaterialScrapList = [];
                    this.tableData = tempDate.map((o, index) => {
                        o.key = index;
                        let processMaterial = {
                            processMaterialId: o.materialId,
                            processScrapList: []
                        }
                        let processProducts = o.processProducts.map(o1 => {
                            if(o1.inventoryType == 2 || o1.inventoryType == 3 || o1.inventoryType == 0 || o1.inventoryType == 1) {
                                this.emitData.processProductList.push({
                                    id: o1.productId,
                                    note: o1.note,
                                    realWidth: o1.realWidth,
                                    realNumber: o1.realNumber,
                                    storageAreaId:o1.storageAreaId ? o1.storageAreaId:this.$store.state.user.warehouse.processDefaultAreaId,
                                    storageArea: o1.storageArea,
                                    storagePlaceId: o1.storagePlaceId ? o1.storagePlaceId:this.$store.state.user.warehouse.processDefaultLocationId,
                                    storagePlace: o1.storagePlace,
                                    packItemId: o1.packItemId
                                })
                            }

                            if(o1.inventoryType == 4 || o1.inventoryType == 5) {
                                processMaterial.processScrapList.push({
                                    note: o1.note,
                                    number: o1.number,
                                    scrapType: o1.inventoryType,
                                    specName: o1.specName,
                                    storageArea: o1.storageArea,
                                    storageAreaId: o1.storageAreaId ? o1.storageAreaId:this.$store.state.user.warehouse.trashDefaultAreaId,
                                    storagePlace: o1.storagePlace,
                                    storagePlaceId: o1.storagePlaceId?o1.storagePlaceId:this.$store.state.user.warehouse.trashDefaultLocationId,
                                    weight: o1.weight
                                })
                            }
                            o1.key = index;
                            return o1;
                        })
                        if(processMaterial.processScrapList.length == 0) {
                            processMaterial.processScrapList.push({
                                note: "",
                                number: null,
                                scrapType: 4,
                                specName: "",
                                storageArea: "",
                                storageAreaId: this.$store.state.user.warehouse.trashDefaultAreaId,
                                storagePlace: "",
                                storagePlaceId: this.$store.state.user.warehouse.trashDefaultLocationId,
                                weight: 0
                            })
                        }
                        this.emitData.processMaterialScrapList.push(processMaterial)
                        return o;
                    })
                }
            })
        },
        validateSpecName(scrapType, specName) {
            var arr = specName.split("*");
            if(Number(arr[0]) && Number(arr[1]) && arr[2] && arr.length == 3) {
                if(scrapType == 4) {
                    //头尾板
                    if(Number(arr[2])) {
                        return true;
                    } else {
                        return false;
                    }
                } else if(scrapType == 5) {
                    //边丝
                    if(arr[2] == "C" || arr[2] == "c") {
                        return true;
                    } else {
                        return false;
                    }
                }
            } else {
                return false;
            }
        }
    },
    created() {
        
    },
    mounted() {
        this.getData();
    }
};
</script>

<style lang="less" scoped>
.table-scrollable {
    height: auto;
}
.tooltip-header {
    width: 120px;
    padding: 0;
    color: #000000;
    background-color: #fff;
}
.table-content{border-left:1px solid #ddd;border-top:1px solid #ddd;position: relative;}
.table-content .table1{width:100%;overflow:auto; }
.table-content .table1 table{table-layout: auto;min-width:1600px;}
.table-content .table1 table td{white-space: nowrap;}
.table1 .sum td {background-color: #f3f3f3;}
.text-center { text-align: center;}
.text-right { text-align: right;}
</style>

