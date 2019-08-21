<template>
    <div class="white-bg">
        <Form :label-width="150" class="search-form">
            <Row type="flex" justify="space-between">
                <Col :sm="8" :xs="24">
                <FormItem label="加工货主:">
                    <Select v-model="params.ownerName" filterable clearable placeholder="请输入加工货主">
                        <Option v-for="item in ownerNameList" :value="item.customerName" :key="item.customerId">{{ item.customerName }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="加工单号:">
                    <Input v-model="params.processCode" placeholder="请输入加工单号"></Input>
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
                <FormItem label="加工机组:">
                    <Select v-model="params.deviceId" clearable placeholder="请选择加工机组">
                        <Option v-for="item in deviceList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="状态:">
                    <Select v-model="params.status" clearable placeholder="请选择状态">
                        <Option v-for="item in optionList3" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
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
                <router-link :to="{name: 'NewProcessBill'}" class="margin-right-10">
                    <Button type="primary" class="margin-bottom-10">新增加工单</Button>
                </router-link>
                <Button type="default" class="margin-bottom-10" @click="batchDelete">批量删除</Button>
            </Col>
        </Row>
        <Table :row-class-name="rowClassName" @on-selection-change="selectChange" :columns="tableColumns" :data="tableData" border></Table>
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
import { formatPrice, formatWeight } from "@/libs/filters";
import { InventoryProcessQueryProcessList,InventoryProcessDeleteProcess, InventoryProcessDeviceList, InventoryProcessCustomerList } from '@/api/process';
export default {
    name: "ProcessList",
    data() {
        return {
            params: {
                ownerName: '',
                processCode: '',
                processType: '',
                deviceId: '',
                status: '',
                pageNo: 1,
                numPerPage: 10
            },
            searchParams: {},
            ownerNameOptList: [],
            loading1: false,
            pageSize: 10,
            pageNum: 1,
            pageSizeOpts: [5, 10, 15, 20],
            total: 0,
            optionLoading: false,
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
            deviceList: [],
            ownerNameList: [],
            optionList3: [
                {
                    value: 0,
                    label: "待审核"
                },
                {
                    value: 1,
                    label: "已审核"
                },
                {
                    value: 9,
                    label: "已删除"
                }
            ],
            tableData:[],
            currentSelect: [],
            tableColumns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: "加工单号",
                    key: "processCode",
                    align: "left",
                    minWidth: 150,
                    render: (h, params) => {
                        return h('span',{
                            class: 'tb-link',
                            on: {
                                click: () => {
                                    this.$router.push({ 
                                        name:'ProcessBillDetail',
                                        query: {
                                            typeName: this.getProcessTypeName(params.row.processType),
                                            processId: params.row.processId
                                        }
                                    });
                                }
                            }
                        }, params.row.processCode)
                    }
                },
                {
                    title: "货主",
                    key: "ownerName",
                    align: "left",
                    minWidth: 200,
                    ellipsis: true,
                    tooltip: true
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
                    title: "加工卷数(件)",
                    key: "number",
                    align: "right",
                    minWidth: 140
                },
                 {
                    title: "用料重量(吨)",
                    key: "weight",
                    align: "right",
                    minWidth: 120,
                    render: (h, params) => {
                        return h('span',formatWeight(params.row.weight))
                    }
                },
                {
                    title: "加工机组",
                    key: "deviceName",
                    align: "left",
                    minWidth: 120
                },
                {
                    title: "总金额(元)",
                    key: "amount",
                    align: "right",
                    minWidth: 120,
                    render: (h, params) => {
                        return h('span',formatPrice(params.row.amount))
                    }
                },
                {
                    title: "状态",
                    key: "status",
                    align: "left",
                    minWidth: 120,
                    render: (h, params) => {
                        var statusTest = "",statusClass="";
                        switch(params.row.status) {
                            case 0: 
                                statusTest = "待审核";
                                statusClass = "ivu-tag-blue";
                                break;
                            case 1:
                                statusTest = "已审核";
                                statusClass = "ivu-tag-cyan";
                                break;
                            case 2: 
                                statusTest = "加工中";
                                statusClass = "ivu-tag-orange";
                                break;
                            case 3: 
                                statusTest = "待确认加工完成";
                                statusClass = "ivu-tag-purple";
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
                    title: "制单时间",
                    key: "createTime",
                    align: "left",
                    minWidth: 180
                },
                {
                    title: "操作",
                    key: "",
                    fixed: 'right',
                    minWidth: 140,
                    render: (h, params) => {
                        let h_edit = h(
                                "span",
                                    {
                                        class:'tb-link margin-right-10',
                                        on: {
                                            click: () => {
                                                this.$router.push({ 
                                                    name:'ProcessBillEdit', 
                                                    query: {
                                                        isEdit: true,
                                                        typeName: params.row.processType,
                                                        processId: params.row.processId
                                                    }
                                                });
                                            }
                                        }
                                    },
                                    "编辑"
                                );
                        let h_audit = h(
                                    "span",
                                    {
                                        class:'tb-link margin-right-10',
                                        on: {
                                            click: () => {
                                                this.$router.push({ 
                                                    name:'ProcessBillExamine',
                                                    query: {
                                                        typeName: this.getProcessTypeName(params.row.processType),
                                                        processId: params.row.processId
                                                    }
                                                } );
                                            }
                                        }
                                    },
                                    "审核"
                                );
                        let h_delete = h(
                                "span",
                                {
                                    class:'tb-link color-red',
                                    on: {
                                        click: () => {
                                            this.delete(params.row.processId);
                                        }
                                    }
                                },
                                "删除"
                            );
                        let h_view = h(
                                "span",
                                    {
                                        class:'tb-link margin-right-10',
                                        on: {
                                            click: () => {
                                                this.$router.push({ 
                                                    name:'ProcessBillDetail',
                                                    query: {
                                                        processId: params.row.processId
                                                    }
                                                });
                                            }
                                        }
                                    },
                                    "查看"
                                );
                        let h_pack =  h(
                                "span",
                                {
                                    class:'tb-link margin-right-10',
                                    on: {
                                        click: () => {
                                            this.$router.push({ 
                                                name:'ProcessPack',
                                                query: {
                                                    processId: params.row.processId,
                                                    processType: this.getProcessTypeName(params.row.processType),
                                                    processCode: params.row.processCode
                                                }
                                            });
                                        }
                                    }
                                },
                                "打包"
                            );
                        let operate = [];
                        switch(params.row.status){
                            case 0: operate.push(h_edit, h_audit, h_delete); break;
                            case 1: operate.push(h_pack, h_view); break;
                            default: operate.push(h_view);
                        }
                        return h('div', operate);
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
                ownerName: '',
                processCode: '',
                processType: '',
                deviceId: '',
                status: '',
                pageNo: 1,
                numPerPage: 10
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
            this.searchParams = JSON.parse(JSON.stringify(this.params));
            InventoryProcessQueryProcessList(this.searchParams).then(res => {
                if(res.data.code == "200") {
                    const data = res.data.data;
                    this.total = data ? data.totalCount : 0;
                    this.tableData = (data ? data.recordList : []).map(o => {
                        if(o.status != 0) {
                            o._disabled = true;
                        } else {
                            o._disabled = false;
                        }
                        return o;
                    });
                } else {
                    this.$Message.error(res.data.msg);
                }
            })
        },
        getDeviceList() {
            InventoryProcessDeviceList().then(res => {
                if(res.data.code == "200") {
                    this.deviceList = res.data.data.map(o => {
                        return {
                            label: o.deviceName,
                            value: o.deviceId
                        }
                    })
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
        selectChange(selection) {
            this.currentSelect = selection;
        },
        batchDelete() {
            if(this.currentSelect.length > 0) {
                let params = this.currentSelect.map(o => {
                    return o.processId
                }).join(",")
                this.delete(params);
            } else {
                this.$Modal.warning({
                    title: '提示',
                    content: '请选择加工单'
                });
            }
        },
        delete(param) {
            this.$Modal.confirm({
                title: '信息确认',
                content: '<p>请确认删除所选加工单？</p>',
                onOk: () => {
                    InventoryProcessDeleteProcess({
                        processId:param 
                    }).then(res => {
                        if(res.data.code == "200") {
                            this.$Message.success('删除成功');
                            this.getList();
                        } else {
                            this.$Message.error(res.data.msg);
                        }
                    })
                },
                onCancel: () => {
                }
            });
        },
        getProcessTypeName(code) {
            let typeName = "";
            switch(code) {
                case 0: typeName = '开平'; break;
                case 1: typeName = '纵剪'; break;
                case 2: typeName = '纵剪+开平'; break;
            }
            return typeName;
        },
        getStorage() {
            this.optionLoading = true;
            setTimeout(()=> {
                this.optionLoading = false;
            },200)
        }
    },
    created() {
        this.getOwerNameList();
        this.getDeviceList();
    },
    mounted () {
        this.search();
    },
    activated() {
        this.search();
    },
};
</script>



