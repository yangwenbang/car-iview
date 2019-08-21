<template>
    <Row type="flex" justify="center" class="white-bg">
        <Col :xs="24" :sm="24" :md="24">
        <Form class="submit-form" ref="formValidate" :model="formValidate" :rules="ruleValidate" label-position="right" :label-width="130">
            <Row :gutter="10">
                <Col :lg="8" :xs="24" v-if="isEdit">
                <FormItem label="加工单号:" prop="processId">
                    {{formValidate.processCode}}
                </FormItem>
                </Col>
                <Col :lg="8" :xs="24">
                <FormItem label="期望交货日期:" prop="expectDeliverTime">
                    <DatePicker type="date" v-model="formValidate.expectDeliverTime"  style="width: 100%"></DatePicker>
                </FormItem>
                </Col>
                <Col :lg="8" :xs="24">
                <FormItem label="货主:" prop="ownerId">
                    <Select
                        v-model="formValidate.ownerId"
                        filterable
                        disabled
                        placeholder="请输入货主">
                        <Option v-for="(option, index) in ownerNameList" :value="option.customerId" :key="index">{{option.customerName}}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col :lg="8" :xs="24">
                <FormItem label="联系人:" prop="contract">
                    <Input v-model="formValidate.contract" :maxlength="20" placeholder="请输入联系人" ></Input>
                </FormItem>
                </Col>
                <Col :lg="8" :xs="24">
                <FormItem label="手机号码:" prop="mobile">
                    <Input v-model="formValidate.mobile" :maxlength="11" placeholder="请输入手机号码" ></Input>
                </FormItem>
                </Col>
                <Col :lg="8" :xs="24">
                <FormItem label="加工类别:" prop="processType">
                    <RadioGroup v-model="formValidate.processType" @on-change="switchType" >
                        <Radio :label="0" :disabled="isEdit">开平</Radio>
                        <Radio :label="1" :disabled="isEdit">纵剪</Radio>
                    </RadioGroup>
                </FormItem>
                </Col>
                <Col :lg="8" :xs="24">
                <FormItem label="加工出库一票结:" prop="isIntegrate">
                    <RadioGroup v-model="formValidate.isIntegrate">
                        <Radio :label="1">是</Radio>
                        <Radio :label="0">否</Radio>
                    </RadioGroup>
                </FormItem>
                </Col>
                <Col :lg="8" :xs="24">
                <FormItem label="结算方式:" prop="settleType">
                    <Select
                        v-model="formValidate.settleType"
                        filterable
                        clearable
                        :disabled="true"
                        placeholder="请选择结算方式">
                        <Option v-for="(option, index) in settleTypeList" :value="option.value" :key="index">{{option.label}}</Option>
                    </Select>
                </FormItem>
                </Col>
            </Row>
            <FormItem label="加工要求描述:">
                <Input v-model="formValidate.processDemand" type="textarea" :maxlength="200" :autosize="{minRows: 2,maxRows: 5}" placeholder=""></Input>
            </FormItem>
            <Tabs>
                <TabPane label="开平加工单" v-if="tab">
                    <NewProcessOpen @dataChange="changeTableData" :defaultRadio="radio" @removeTableData="deleteRow" @showModal="showCoilModal" :isEdit="true" :isValidated="validated" :propData="submitSelect" :owner="formValidate.ownerId?formValidate.ownerId:0"></NewProcessOpen>
                </TabPane>
                <TabPane label="纵剪加工单" v-else>
                    <NewProcessBillScissors @dataChange="changeTableData" :defaultRadio="radio" @removeTableData="deleteRow" @showModal="showCoilModal" :isEdit="true" :isValidated="validated" :propData="submitSelect" :owner="formValidate.ownerId?formValidate.ownerId:0"></NewProcessBillScissors>
                </TabPane>
            </Tabs>
            <div class="text-center margin-top-10">
                <Button type="primary" @click="handleSubmit('formValidate')" class="btn-common-width" :disabled="submitDisabled">保存</Button>
                <Button class="btn-common-width margin-left-10" @click="backFun">取消</Button>
            </div>
        </Form>
        </Col>
        <Modal
            v-model="showModal"
            title="选择原料"
            @on-ok="submitModal"
            :mask-closable="false"
            :closable="false"
            width="1200">
            <Form :label-width="80" class="search-form">
            <Row type="flex" justify="space-between">
                <Col :sm="8" :xs="24">
                <FormItem label="编号:">
                    <Input v-model="modalParams.code" placeholder="请输入编号"></Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="入库日期:">
                    <DatePicker v-model="modalParams.time" type="daterange" placeholder="请选择日期"></DatePicker>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="货物类型:">
                    <Select v-model="modalParams.type" clearable placeholder="请选择货物类型" disabled>
                        <Option v-for="item in goodsList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="产地:">
                    <Input v-model="modalParams.brandName" placeholder="请输入产地"></Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="品名:">
                    <Input v-model="modalParams.breedName" placeholder="请输入品名"></Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="材质:">
                    <Input v-model="modalParams.materialName" placeholder="请输入材质"></Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="规格:">
                    <Input v-model="modalParams.specName" placeholder="请输入规格"></Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="库区:">
                    <Input v-model="modalParams.storageArea" placeholder="请输入库区"></Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24" class="text-right">
                <FormItem>
                    <Button type="primary" @click="search">搜索</Button>
                    <Button style="margin-left: 8px" @click="reset">重置</Button>
                </FormItem>
                </Col>
            </Row>
        </Form>
        <Table @on-selection-change="selectChange" ref="selection" :columns="modalTableColumns" :data="modalTableData" border></Table>
        <div class="page-wrapper">
            <div v-if="this.$store.state.app.screenSize>768">
                <span class="left">共{{total}}条记录 第{{pageNum}}页 / 共{{Math.ceil(total / pageSize)}}页 </span>
                <Page class="pull-right" :current="pageNum" :total="total" :page-size="pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size-opts="pageSizeOpts" show-sizer show-elevator/>
            </div>
            <div v-if="this.$store.state.app.screenSize<=768">
                <Page class="pull-right" :current="pageNum" :page-size="pageSize" :total="total" @on-change="pageChange" simple />
            </div>
        </div>  
        <div slot="footer">
            <Button @click="cancel" size="large">取消</Button>
            <Button type="primary" @click="submitModal" size="large">确定</Button>
        </div>
        </Modal>
    </Row>
</template>

<script>
import { closeNowTag, formatDate } from "@/libs/util";
import { formatSecondTime } from "@/libs/filters";
import NewProcessBillScissors from './NewProcessBillScissors';
import NewProcessOpen from './NewProcessOpen';
import { InventoryProcessUpdateProcess, InventoryProcessCustomerList, InventoryQueryVInventoryItem, InventoryProcessProcessInfo } from '@/api/process';
export default {
    name: "ProcessBillEdit",
    components: {
        NewProcessBillScissors,
        NewProcessOpen
    },
    data() {
        return {
            submitDisabled:false,
            formValidate: {
                processCode: '',
                ownerId: '',
                contract: '',
                mobile: '',
                isIntegrate: '',
                settleType: '',
                processType: this.$route.query.typeName,
                processDemand: ''
            },
            processId: this.$route.query.processId,
            groupRadio: {},
            radio: {},
            ruleValidate: {
                ownerName: [
                    {
                        required: true,
                        message: "请输入货主",
                        trigger: "change",
                        type: 'number'
                    }
                ],
                processType: [
                    {
                        required: true,
                        message: "请选择加工类别",
                        trigger: "change",
                        type: 'number'
                    }
                ],
                isIntegrate: [
                    {
                        required: true,
                        message: "请选择是否加工出库一票结",
                        trigger: "change",
                        type: 'number'
                    }
                ],
                settleType: [
                    {
                        required: true,
                        message: "请选择结算方式",
                        trigger: "change",
                        type: 'number'
                    }
                ]
            },
            ownerNameList: [],
            brandNameList: [],
            breedNameList: [],
            materialNameList: [],
            specNameList: [],
            storageAreaList: [],
            settleTypeList: [{
                label: '现结',
                value: 0
            },{
                label: '月结',
                value: 1
            }],
            tab: true,
            isEdit: this.$route.query.isEdit,
            validated: false,
            showModal: false,
            goodsList:[{
                label: '原材',
                value: 0
            },{
                label: '成品',
                value: 1
            }],
            modalParams: {
                greaterThanZero: 1,
                code: '',
                time: [],
                type: 0,
                brandName: '',
                breedName: '',
                materialName: '',
                specName: '',
                storageArea: '',
                pageNo: 1,
                numPerPage: 10
            },
            modalParamsSearch: {
                greaterThanZero: 1,
                code: '',
                startTime:'',
                endTime: '',
                type: 0,
                brandName: '',
                breedName: '',
                materialName: '',
                specName: '',
                storageArea: '',
                pageNo: 1,
                numPerPage: 10
            },
            pageSize: 10,
            pageNum: 1,
            pageSizeOpts: [5, 10, 15, 20],
            total: 0,
            modalTableData: [],
            modalTableColumns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center',
                    fixed: 'left'
                },{
                    title: "编号",
                    key: "code",
                    align: "left",
                    minWidth: 120
                },{
                    title: "货物类型",
                    key: "type",
                    align: "left",
                    minWidth: 90,
                    render: (h, params) => {
                        let name = "";
                        if(params.row.type == 0) {
                            name = '原材'; 
                        } else {
                            name = '成品'
                        }
                        return h('span', name);
                    }
                },{
                    title: "产地",
                    key: "brandName",
                    align: "left",
                    minWidth: 150
                },{
                    title: "品名",
                    key: "breedName",
                    align: "left",
                    minWidth: 150
                },{
                    title: "材质",
                    key: "materialName",
                    align: "left",
                    minWidth: 80
                },{
                    title: "规格",
                    key: "specName",
                    align: "left",
                    minWidth: 100,
                    render: (h, params) => {
                        return h('span',params.row.specName)
                    }
                },{
                    title: "库区",
                    key: "storageArea",
                    align: "left",
                    minWidth: 80
                },{
                    title: "库位",
                    key: "storagePlace",
                    align: "left",
                    minWidth: 60
                },{
                    title: "数量(件)",
                    key: "number",
                    align: "right",
                    minWidth: 80
                },{
                    title: "单件重量(吨)",
                    key: "perAmount",
                    align: "right",
                    minWidth: 100
                },{
                    title: "总重量(吨)",
                    key: "weight",
                    align: "right",
                    minWidth: 90
                },{
                    title: "加锁数量",
                    key: "lockNum",
                    align: "right",
                    minWidth: 100
                },{
                    title: "可加工数量",
                    key: "availableNumber",
                    align: "right",
                    minWidth: 90
                },{
                    title: "入库日期",
                    key: "inTime",
                    align: "left",
                    minWidth: 100
                },{
                    title: "仓租天数",
                    key: "storageDay",
                    align: "right",
                    minWidth: 80
                },{
                    title: "包装",
                    key: "wrap",
                    align: "left",
                    minWidth: 100
                },{
                    title: "外观",
                    key: "appearance",
                    align: "left",
                    minWidth: 100
                },{
                    title: "钢卷号/捆包号",
                    key: "baleNumber",
                    align: "left",
                    minWidth: 150
                }
            ],
            currentSelect: [],
            tableSelect: [],
            submitSelect: [],
            tableData: []
        };
    },
    methods: {
        getOwnerName() {
            InventoryProcessCustomerList().then(res => {
                if(res.data.code == "200") {
                    this.ownerNameList = res.data.data ? res.data.data : [];
                }
            })
        },
        changeTableData(data) {
            this.tableData = data.tableData;
            this.groupRadio = data.radio;
        },
        handleSubmit(name) {
            this.validated = true;
            let tableValidate = true;
            //规格不足卷数
            let amount = 0;
            this.tableData.map((o, i) => {
                if(!this.validateCol5(i)) {
                    tableValidate = false;
                }
                if(!this.tab) {
                    if(!this.validateInteger(o.sectionNumber)) {
                        tableValidate = false;
                    }
                }
                o.processProducts.map(o1 => {
                    if(!this.validateDecimal(o1.specWidth) || !this.validateInteger(o1.number)) {
                        tableValidate = false;
                    }
                })
                if(o.remainWidth <= 0) {
                    amount += o.availableNumber;
                }
            })
            this.$refs[name].validate(valid => {
                if(valid && this.tableData.length < 1) {
                    tableValidate = false;
                    this.$Message.error('请选择加工卷');
                }
                if (valid && tableValidate) {
                   if(amount > 0) {
                        this.$Modal.confirm({
                            title: '提示',
                            content: '<p>有'+amount+'个卷加工后等于或超过用料，是否继续？</p>',
                            onOk: () => {
                                if(!this.submitDisabled){
                                    this.save();
                                }
                            },
                            onCancel: () => {
                            }
                        });
                    } else {
                        this.save() 
                    }
                }
            });
        },
        save() {
            this.submitDisabled = true;
            let ownerName = "";
            this.ownerNameList.map(o => {
                if(o.customerId == this.formValidate.ownerId) {
                    ownerName = o.customerName;
                }
            })
            InventoryProcessUpdateProcess({
                processId: this.processId,
                processCode: this.formValidate.processCode,
                expectDeliverTime: this.formValidate.expectDeliverTime?formatSecondTime(this.formValidate.expectDeliverTime):'',
                ownerName: ownerName,
                ownerId: this.formValidate.ownerId,
                contract: this.formValidate.contract,
                mobile: this.formValidate.mobile,
                processType: this.formValidate.processType,
                settleType: this.formValidate.settleType,
                isIntegrate: this.formValidate.isIntegrate,
                processDemand: this.formValidate.processDemand,
                deviceId: this.groupRadio.deviceId,
                deviceName: this.groupRadio.deviceName,
                processMaterials: JSON.parse(JSON.stringify(this.tableData))

            }).then(res => {
                if(res.data.code == '200') {
                    this.$Message.success({
                        content: "提交成功!",
                        duration: 1
                    });
                    closeNowTag(this.$store.state.app, this.$route);
                    this.$router.push({
                        name: "ProcessList"
                    });
                } else {
                    this.$Message.error(res.data.msg);
                }
                setTimeout(() => {
                    this.submitDisabled = false;
                }, 1000);
            })
        },
        validateCol5(index) {
            let flag = true;
            let currentValue = this.tableData[index].processWeight;
           
            if (!Number(currentValue)) {
                flag = false;
            } else if(Number(currentValue) < 0) {
                flag = false;
            } else {
                if(String(currentValue).indexOf(".")>-1){
                    let val_arr = String(currentValue).split(".");
                    if(val_arr[1].length>4){
                        flag = false;
                    } 
                } 
                if(Number(currentValue) > Number(this.tableData[index].weight)) {
                    flag = false;
                }
            }
            return flag;
        },
        //大于0的整数
        validateInteger(currentValue) {
            let flag= true;
            if (!Number(currentValue)) {
                flag = false;
            } else {
                if(Number(currentValue) <= 0) {
                flag = false;
                } else {
                    if(String(currentValue).indexOf(".")>-1){
                       flag = false;
                    }
                }
            } 
            return flag;
        },
        //大于0，小数后两位
        validateDecimal(currentValue) {
            let flag= true;
            if (!Number(currentValue)) {
               flag = false;
            } else if(Number(currentValue) < 0) {
                flag = false;
            } else {
                if(String(currentValue).indexOf(".")>-1){
                    let val_arr = String(currentValue).split(".");
                    if(val_arr[1].length>2){
                        flag = false;
                    } 
                }
            }
            return flag;
        },
        search() {
            this.pageChange(1);
        },
        reset() {
            this.modalParams = {
                code: '',
                time: [],
                type: this.modalParams.type,
                brandName: '',
                breedName: '',
                materialName: '',
                specName: '',
                storageArea: '',
                pageNo: 1,
                numPerPage: 10
            }
        },
        pageChange (page) {
            this.modalParams.pageNo = this.pageNum = page;
            this.getInventoryItem();
        },
        pageSizeChange (pagesize) {
            this.modalParams.pageNo = this.pageNum = 1;
            this.modalParams.numPerPage = this.pageSize = pagesize;
            this.getInventoryItem();
        },
        getInventoryItem() {
            this.modalParamsSearch = {
                avaliableNumberGreaterThanZero:1,
                greaterThanZero: 1,
                ownerId: this.formValidate.ownerId,
                code: this.modalParams.code,
                startTime: this.modalParams.time ? formatDate(this.modalParams.time[0]) : '',
                endTime: this.modalParams.time ? formatDate(this.modalParams.time[1]) : '',
                type: this.modalParams.type,
                brandName: this.modalParams.brandName,
                breedName: this.modalParams.breedName,
                materialName: this.modalParams.materialName,
                specName: this.modalParams.specName,
                storageArea: this.modalParams.storageArea,
                pageNo: this.modalParams.pageNo,
                numPerPage: this.modalParams.numPerPage,
            };

            if(this.modalParams.type == 1) {
                this.modalParamsSearch.isPack = 0;
                this.modalParamsSearch.inventoryType = 2;
            } else {
                delete this.modalParamsSearch.isPack;
                delete this.modalParamsSearch.inventoryType
            }
            InventoryQueryVInventoryItem(this.modalParamsSearch).then(res => {
                if(res.data.code == '200') {
                    const data = res.data.data;
                    let modalData = data.recordList ? data.recordList : [];
                    this.modalTableData = modalData.map(o => {
                        o.itemId = o.id;
                        return o;
                    })
                    this.total = data ? data.totalCount : 0;
                    this.diabledChecked();
                } else {
                    this.$Message.error(res.data.msg);
                }
            })
        },
        selectChange(selection) {
            this.currentSelect = JSON.parse(JSON.stringify(this.tableSelect));
            let dataCopy = JSON.parse(JSON.stringify(this.currentSelect));
            selection.map((o, i) => {
                let isHave = false;
                dataCopy.map((o1, j) => {
                    if(o.itemId == o1.itemId) {
                        isHave = true;
                    }
                })
                if(!isHave) {
                    this.currentSelect.push(o);
                }
            })
        },
        deleteRow(data) {
            let dataCopy = JSON.parse(JSON.stringify(this.currentSelect));
            let tableSelectCopy = JSON.parse(JSON.stringify(this.tableSelect));
            dataCopy.map((o, i) => {
                if(data.itemId == o.itemId) {
                    this.currentSelect.splice(i, 1);
                }
            })

            tableSelectCopy.map((o, i) => {
                if(data.itemId == o.itemId) {
                    this.tableSelect.splice(i, 1);
                }
            })
        },
        showCoilModal(data) {
            this.modalParams.type = data;
            this.search();
            this.diabledChecked();
            this.showModal = true;
        },
        diabledChecked() {
            let dataCopy = this.modalTableData.map(o => {
                o._checked  = false;
                o._disabled = false;
                return o;
            });

            this.modalTableData = [];
            dataCopy.map((o, i) => {
                this.tableSelect.map((o1, j) => {
                    if(o.itemId == o1.itemId) {
                        o._checked = true;
                        o._disabled = true;
                    }
                })
                this.modalTableData.push(o);
            })
        },
        cancel() {
            this.currentSelect = JSON.parse(JSON.stringify(this.tableSelect));
            this.showModal = false;
        },
        submitModal() {
            this.tableSelect = JSON.parse(JSON.stringify(this.currentSelect));
            this.submitSelect = JSON.parse(JSON.stringify(this.tableSelect));
            this.showModal = false;
        },
        switchType() {
            if(this.formValidate.processType == 0) {
                this.tab = true;
            } else if(this.formValidate.processType == 1) {
                this.tab = false;
            }
            this.submitSelect = JSON.parse(JSON.stringify(this.currentSelect));
        },
        backFun() {
            this.$Modal.confirm({
                title: "提示",
                content: "取消将不保存填写内容，请确认是否取消？",
                onOk: () => {
                    closeNowTag(this.$store.state.app, this.$route);
                    this.$router.push({
                        path: "ProcessList"
                    });
                },
                onCancel: () => {
                }
            });
        },
        initSelect() {
            InventoryProcessProcessInfo({
                processId: this.processId
            }).then(res => {
                if(res.data.code == '200') {
                    const data = res.data.data;
                    this.tableSelect = data.processMaterials ? data.processMaterials : [];
                    delete data.processMaterials;
                    this.formValidate = data;
                    this.radio = {
                        deviceId: data.deviceId,
                        deviceName: data.deviceName
                    }
                    this.submitSelect = JSON.parse(JSON.stringify(this.tableSelect));
                    this.currentSelect = JSON.parse(JSON.stringify(this.tableSelect));
                    this.search();
                }
            })
        },
    },
    mounted() {
        this.initSelect();
        this.getOwnerName();
        this.switchType();
    }
};
</script>

<style lang="less" scoped>
.ivu-radio-wrapper {
    line-height: 0;
}
.ivu-form-item-label::before {
    content: '';
}
@deep: ~'>>>';
.error-border {
    border: 1px solid #ed4014;
    @{deep} .ivu-input{
        border: 0 !important;
    }
}

</style>
