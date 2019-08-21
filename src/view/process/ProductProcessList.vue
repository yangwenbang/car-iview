<template>
    <div class="white-bg">
        <Form :label-width="150" class="search-form">
            <Row type="flex" justify="space-between">
                <Col :sm="8" :xs="24">
                <FormItem label="加工单号:">
                    <Input v-model="params.processCode" placeholder="请输入加工单号"></Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="机组:">
                    <Select v-model="params.deviceId" clearable placeholder="请选择机组">
                        <Option v-for="item in deviceList" :value="item.deviceId" :key="item.deviceId">{{ item.deviceName }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="加工类别:">
                    <Select v-model="params.processType" clearable placeholder="请选择加工类别">
                        <Option v-for="item in processTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="货主:">
                    <Select v-model="params.ownerId" filterable clearable placeholder="请输入加工货主">
                        <Option v-for="item in ownerNameList" :value="item.customerId" :key="item.customerId">{{ item.customerName }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="加工状态:">
                    <Select v-model="params.status" clearable placeholder="请选择状态">
                        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col :lg="8" :xs="24">
                <FormItem label="交货日期:">
                    <DatePicker type="daterange" v-model="params.deliverTime" placeholder="请选择" style="width: 100%"></DatePicker>
                </FormItem>
                </Col>
                <Col :lg="8" :xs="24">
                <FormItem label="制单日期:">
                    <DatePicker type="daterange" v-model="params.createTime" placeholder="请选择" style="width: 100%"></DatePicker>
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
        <Row>
            <Col span="24">
                <Button type="primary" @click="search" class="margin-bottom-10">刷新加工表</Button>
                <div class="pull-right count-content"><b>【合计】</b><span class="margin-right-10">加工卷数：<b class="tip">{{totalNumber}}</b> 卷</span> <span class="margin-right-10">加工重量：<b class="tip">{{totalWeight}}</b> 吨</span></div>
            </Col>
        </Row>
        <Table :row-class-name="rowClassName" :columns="tableColumns" :data="tableData" border></Table>
         <div class="page-wrapper">
            <div v-if="this.$store.state.app.screenSize>768">
                <span class="left">共{{total}}条记录 第{{pageNum}}页 / 共{{Math.ceil(total / pageSize)}}页 </span>
                <Page class="pull-right" :current="pageNum" :total="total" :page-size="pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size-opts="pageSizeOpts" show-sizer show-elevator/>
            </div>
            <div v-if="this.$store.state.app.screenSize<=768">
                <Page class="pull-right" :current="pageNum" :page-size="pageSize" :total="total" @on-change="pageChange" simple />
            </div>
        </div>
    </div>

</template>
<script>
import { InventoryProcessQueryProduceProcessList, InventoryProcessDeviceList, InventoryProcessCustomerList } from '@/api/process';
import { formatDate, formatWeight } from "@/libs/util";
export default {
    name: "ProductProcessList",
    data() {
        return {
            params: {
                ownerId: '',
                processCode: '',
                processType: '',
                deviceId: '',
                status: '',
                deliverTime: '',
                createTime: '',
                pageNo: 1,
                numPerPage: 10
            },
            searchParams: {
                ownerId: '',
                processCode: '',
                processType: '',
                deviceId: '',
                status: '',
                startDeliverTime: '',
                endDeliverTime: '',
                startCreateTime: '',
                endCreateTime: '',
                pageNo: 1,
                numPerPage: 10
            },
            totalNumber: 0,
            totalWeight: 0,
            pageSize: 10,
            pageNum: 1,
            pageSizeOpts: [5,10, 15, 20],
            total: 0,
            deviceList: [],
            statusList: [
                {
                    value: "1",
                    label: "待加工"
                },
                {
                    value: "2",
                    label: "待录入数据"
                },
                {
                    value: "3",
                    label: "待确认加工完成"
                },
                {
                    value: "4",
                    label: "加工完成"
                }
            ],
            ownerNameList: [],
            processTypeList: [
                {
                    value: 0,
                    label: "开平"
                },
                {
                    value: 1,
                    label: "纵剪"
                },
                // {
                //     value: 2,
                //     label: "纵剪+开平"
                // }
            ],
            tableData:[],
            tableColumns: [
                {
                    title: "加工单号",
                    key: "processCode",
                    align: "left",
                    minWidth: 120
                },
                {
                    title: "货主",
                    key: "ownerName",
                    align: "left",
                    minWidth: 200
                },
                {
                    title: "加工卷数（件）",
                    key: "number",
                    align: "right",
                    minWidth: 140
                },
                {
                    title: "用料重量（吨）",
                    key: "weight",
                    align: "right",
                    minWidth: 140,
                    render: (h, params) => {
                        return h('span', formatWeight(params.row.weight))
                    }
                },
                {
                    title: "加工类别",
                    key: "processType",
                    align: "left",
                    minWidth: 100,
                    render: (h, params) => {
                        let typeName = "";
                        switch(params.row.processType) {
                            case 0: typeName = "开平"; break;
                            case 1: typeName = "纵剪"; break;
                            case 2: typeName = "纵剪+开平"; break;
                        }
                        return h('span', typeName);
                    }
                },
                {
                    title: "库区",
                    key: "storageArea",
                    align: "left",
                    minWidth: 100
                },
                {
                    title: "交货日期",
                    key: "expectDeliverTime",
                    align: "left",
                    minWidth: 100
                },
                {
                    title: "加工状态",
                    key: "status",
                    align: "left",
                    minWidth: 120,
                    render: (h, params) => {
                        var statusTest = "",statusClass="";
                        switch(params.row.status) {
                            case 1: 
                                statusTest = "待加工";
                                statusClass = "ivu-tag-blue";
                                break;
                            case 2:
                                statusTest = "待录入数据";
                                statusClass = "ivu-tag-cyan";
                                break;
                            case 3: 
                                statusTest = "待确认加工完成";
                                statusClass = "ivu-tag-orange";
                                break;
                            case 4: 
                                statusTest = "加工完成";
                                statusClass = "ivu-tag-green";
                                break;
                            case 9: 
                                statusTest = "已删除";
                                statusClass = "ivu-tag-default";
                            break;
                        }
                        return h("Tag",{class:statusClass},statusTest);
                    }
                },
                {
                    title: "制单人",
                    key: "creator",
                    align: "left",
                    minWidth: 100
                },
                {
                    title: "制单日期",
                    key: "createTime",
                    align: "left",
                    minWidth: 100
                },
                {
                    title: "操作",
                    key: "",
                    fixed: 'right',
                    minWidth: 140,
                     render: (h, params) => {
                        switch(params.row.status) {
                            case 1:
                                return h(
                                    "span",
                                    {
                                        class:'tb-link margin-right-10',
                                        on: {
                                            click: () => {
                                                this.$router.push({ 
                                                    name:'ProductProcessListMessage',
                                                    query: {
                                                        progress: 0,
                                                        processId: params.row.processId
                                                    }
                                                });
                                            }
                                        }
                                    },"开始加工") ;
                            case 2:
                                return h('div',[
                                    h("span",
                                        {
                                            class:'tb-link margin-right-10',
                                            on: {
                                                click: () => {
                                                    this.$router.push({
                                                        name: 'RevokeProcess',
                                                        query: {
                                                            processId: params.row.processId
                                                        }
                                                    })
                                                }
                                            }
                                        },"撤销加工") ,
                                    h("span",
                                        {
                                            class:'tb-link margin-right-10',
                                            on: {
                                                click: () => {
                                                    this.$router.push({
                                                        name: 'ProductProcessListMessage',
                                                        query: {
                                                            progress: 1,
                                                            processId: params.row.processId
                                                        }
                                                    })
                                                }
                                            }
                                        },"录入数据") 
                                ])
                            case 3:
                                return h('div',[
                                    h("span",
                                        {
                                            class:'tb-link margin-right-10',
                                            on: {
                                                click: () => {
                                                    this.$router.push({
                                                        name: 'ProductProcessListMessage',
                                                        query: {
                                                            progress: 1,
                                                            processId: params.row.processId
                                                        }
                                                    })
                                                }
                                            }
                                        },"修改数据"),
                                        h("span",
                                        {
                                            class:'tb-link margin-right-10',
                                            on: {
                                                click: () => {
                                                    this.$router.push({
                                                        name: 'ProductProcessListMessage',
                                                        query: {
                                                            progress: 2,
                                                            processId: params.row.processId
                                                        }
                                                    })
                                                }
                                            }
                                        },"确认完成"),
                                ])
                            case 4:
                                return h(
                                    "span",
                                    {
                                        class:'tb-link margin-right-10',
                                        on: {
                                            click: () => {
                                                this.$router.push({ 
                                                    name:'ProductProcessListDetail',
                                                    query: {
                                                        processId: params.row.processId
                                                    }
                                                });
                                            }
                                        }
                                    },"查看") ;
                        }
                    }
                }
            ],
        };
    },
    methods: {
        rowClassName (row, index) {
            if(row.status == 0){
                return 'table-info-row1';
            }else if(row.status == 9){
                return 'table-info-row2';
            }
            return '';
        },
        reset() {
            this.params = {
                processCode: '',
                deviceId: '',
                status: '',
                deliverTime: ['',''],
                createTime: ['','']
            }
        },
        search() {
            this.pageChange(1);
        },
        pageChange (page) {
            this.params.pageNo = this.pageNum = page;
            this.getList();
        },
        pageSizeChange (pagesize) {
            this.params.pageNo = this.pageNum = 1;
            this.params.numPerPage = this.pageSize = pagesize;
            this.getList();
        },
        getList(){
            this.searchParams = {
                ownerId: this.params.ownerId ? this.params.ownerId : '',
                processCode: this.params.processCode ? this.params.processCode : '',
                processType: this.params.processType,
                deviceId: this.params.deviceId ? this.params.deviceId : '',
                status: this.params.status ? this.params.status : '',
                startDeliverTime: this.params.deliverTime[0] ? formatDate(this.params.deliverTime[0]) : '',
                endDeliverTime: this.params.deliverTime[1] ? formatDate(this.params.deliverTime[1]) : '',
                startCreateTime: this.params.createTime[0] ? formatDate(this.params.createTime[0]) : '',
                endCreateTime: this.params.createTime[1] ? formatDate(this.params.createTime[1]) : '',
                pageNo: this.params.pageNo,
                numPerPage: this.params.numPerPage
            }
            InventoryProcessQueryProduceProcessList(this.searchParams).then(res => {
                const data = res.data.data;
                if(res.data.code == "200") {
                    this.total = data.pageResultDTO.totalCount;
                    this.totalNumber = data.totalNumber;
                    this.totalWeight = data.totalWeight;
                    this.tableData = data.pageResultDTO.recordList;
                }
                else {
                    this.$Message.error(res.data.msg);
                }
            })
        },
        getDeviceList() {
            InventoryProcessDeviceList().then(res => {
                if(res.data.code == '200') {
                    this.deviceList = res.data.data;
                }
             })
        },
        getOwerNameList() {
            InventoryProcessCustomerList().then(res => {
                if(res.data.code == '200') {
                    this.ownerNameList = res.data.data;
                }
            })
        },
    },
    created() {
        this.getDeviceList();
        this.getOwerNameList();
    },
    mounted () {
        this.search();
    },
    activated() {
        this.search();
    },
};
</script>



