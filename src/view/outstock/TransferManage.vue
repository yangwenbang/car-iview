<template>
    <div class="white-bg">
        <Form :label-width="150" class="search-form">
            <Row type="flex" justify="space-between">
                <Col :sm="8" :xs="24">
                <FormItem label="过户单号:">
                    <Input v-model="params.transferCode"></Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="过户日期:">
                    <DatePicker v-model="transferTime" type="daterange" placement="bottom-end" placeholder="请选择日期"></DatePicker>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="原货主:">
                    <Select filterable clearable v-model="params.oldOwnerId">
                        <Option v-for="(item,index) in ownnerList" :value="item.id" :key="index">{{ item.customerName }}</Option>
                    </Select>
                </FormItem>
                </Col>
            </Row>
            <Row type="flex" justify="space-between">
                <Col :sm="8" :xs="24">
                <FormItem label="新货主:">
                    <Select filterable clearable v-model="params.newOwnerId">
                        <Option v-for="(item,index) in ownnerList" :value="item.id" :key="index">{{ item.customerName }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="状态:">
                    <Select v-model="params.status" clearable placeholder="所有">
                        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24" class="text-right">
                <FormItem>
                    <Button type="primary" @click="search">查询</Button>
                    <Button style="margin-left: 8px" @click="reset">重置</Button>
                </FormItem>
                </Col>
            </Row>
        </Form>
        <Row>
            <Col span="24">
            <router-link to='AddTransfer'>
                <Button type="primary" class="margin-bottom-10 margin-right-10">新增过户单</Button>
            </router-link>
            <Button type="default" class="margin-bottom-10" @click="bulkDel">批量删除</Button>
            </Col>
        </Row>
        <Table :row-class-name="rowClassName" :columns="tableColumns" :loading="loading" :data="tableData" border @on-selection-change="getSelected"></Table>
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
import { transferQueryTransferList, transferDeleteTransfer } from "@/api/outstock";
import { commonQueryOwners } from "@/api/common";
import { formatDate,formatPrice,formatWeight } from "@/libs/util";
export default {
    name: "TransferManage",
    data() {
        return {
            params: {
                transferCode: "",
                transferStartTime: '',
                transferEndTime: '',
                oldOwnerId: '',
                oldOwner: '',
                newOwnerId: '',
                newOwner: '',
                status: "",
                pageNo: 1,
                numPerPage: 10
            },
            loading: false,
            searchParams: {},
            transferTime:[],
            ownnerList: [],
            pageSize: 10,
            pageNum: 1,
            pageSizeOpts: [10, 15, 20, 40, 50, 100],
            total: 100,
            checkedRow: [],
            statusList: [
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
            tableData: [],
            tableColumns: [
                {
                    type: "selection",
                    width: 40,
                    align: "center"
                },
                {
                    title: "过户单号",
                    key: "transferCode",
                    align: "left",
                    minWidth: 120,
                    render: (h, data) => {
                        if(data.row.status == 1||data.row.status == 2||data.row.status == 9){
                            return h(
                                "span",
                                {
                                    class: "tb-link",
                                    on: {
                                        click: () => {
                                            this.$router.push({
                                                name: "ViewTransfer",
                                                query: {
                                                    transferId: data.row.transferId
                                                }
                                            });
                                        }
                                    }
                                },
                                data.row.transferCode
                            );
                        }else{
                           return h("span",{},data.row.transferCode);
                        }
                        
                    }
                },
                {
                    title: "原货主",
                    tooltip: true,
                    ellipsis: true,
                    key: "oldOwner",
                    align: "left",
                    minWidth: 180
                },
                {
                    title: "新货主",
                    tooltip: true,
                    ellipsis: true,
                    key: "newOwner",
                    align: "left",
                    minWidth: 100
                },
                {
                    title: "过户日期",
                    key: "transferTime",
                    align: "left",
                    minWidth: 150
                },
                {
                    title: "货物类型",
                    key: "type",
                    align: "left",
                    minWidth: 100,
                    render: (h, data) => {
                        var name = data.row.type==0?'原料':data.row.type==1?'成品':'废料';
                        return h('span',name);
                    }
                },
                {
                    title: "货物数量(件)",
                    key: "transferNumber",
                    align: "right",
                    minWidth: 100
                },
                {
                    title: "重量(吨)",
                    key: "transferWeight",
                    align: "right",
                    minWidth: 100,
                    render: (h, data) => {
                        return h('span', formatWeight(data.row.transferWeight));
                    }
                },
                {
                    title: "备注",
                    tooltip: true,
                    ellipsis: true,
                    key: "remark",
                    align: "left",
                    minWidth: 120
                },
                {
                    title: "金额",
                    key: "sumFee",
                    align: "right",
                    minWidth: 110,
                    render: (h, data) => {
                        return h('span', formatPrice(data.row.sumFee));
                    }
                },
                {
                    title: "状态",
                    key: "status",
                    align: "left",
                    minWidth: 80,
                    render: (h, data) => {
                        var statusTest = "",
                            statusClass = "";
                        if (data.row.status == 0) {
                            statusTest = "待审核";
                            statusClass = "ivu-tag-blue";
                        } else if (data.row.status ==1) {
                            statusTest = "已审核";
                            statusClass = "ivu-tag-green";
                        }else if (data.row.status == 9) {
                            statusTest = "已删除";
                            statusClass = "ivu-tag-default";
                        }
                        return h("Tag", { class: statusClass }, statusTest);
                    }
                },
                {
                    title: "制单人",
                    key: "creator",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "制单时间",
                    key: "createTime",
                    align: "left",
                    minWidth: 160
                },
                {
                    title: "操作",
                    align: "left",
                    minWidth: 150,
                    fixed: "right",
                    render: (h, data) => {
                        var h_edit = h(
                            "span",
                            {
                                class: "tb-link margin-right-10",
                                on: {
                                    click: () => {
                                        this.$router.push({
                                            name: "EditTransfer",
                                            query: {
                                                transferId: data.row.transferId
                                            }
                                        });
                                    }
                                }
                            },
                            "编辑"
                        );
                        var h_audit = h(
                            "span",
                            {
                                class: "tb-link margin-right-10",
                                on: {
                                    click: () => {
                                        this.$router.push({
                                            name: "AuditTransfer",
                                            query: {
                                                transferId: data.row.transferId
                                            }
                                        });
                                    }
                                }
                            },
                            "审核"
                        );
                        var h_view = h(
                            "span",
                            {
                                class: "tb-link margin-right-10",
                                on: {
                                    click: () => {
                                        this.$router.push({
                                            name: "ViewTransfer",
                                            query: {
                                                transferId: data.row.transferId
                                            }
                                        });
                                    }
                                }
                            },
                            "查看"
                        );
                        var h_del = h(
                            "span",
                            {
                                class: "tb-link color-red",
                                on: {
                                    click: () => {
                                        this.$Modal.confirm({
                                            title: "提示",
                                            content:
                                                "<p>是否确认删除这条信息？</p>",
                                            okText: "确认",
                                            cancelText: "取消",
                                            onOk: () => {
                                                this.deleteTransfer([data.row.transferId]);
                                            }
                                        });
                                    }
                                }
                            },
                            "删除"
                        );

                        return h(
                            "div",
                            (function() {
                                var childs = [];
                                var i;
                                if (data.row.status == 0) {
                                    childs.push(h_edit, h_audit, h_del);
                                }
                                if (data.row.status != 0) {
                                    childs.push(h_view);
                                }
                                return childs;
                            })()
                        );
                    }
                }
            ]
        };
    },
    mounted() {
        this.getOwnerList();
        this.search();
    },
    activated() {
        this.search();
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
            this.transferTime = [];
            this.params = {
                transferCode: '',
                transferStartTime: '',
                transferEndTime: '',
                oldOwnerId: '',
                oldOwner: '',
                newOwnerId: '',
                newOwner: '',
                status: "",
                pageNo: 1,
                numPerPage: 10
            };
        },
        search() {
            this.params.transferStartTime = this.transferTime[0]?formatDate(this.transferTime[0]):'';
            this.params.transferEndTime = this.transferTime[1]?formatDate(this.transferTime[1]):'';
            this.pageChange(1);
        },
        pageChange(page) {
            this.params.pageNo = this.pageNum = page;
            this.getList();
        },
        pageSizeChange(pagesize) {
            this.params.pageNo = this.pageNum = 1;
            this.params.numPerPage = this.pageSize = pagesize;
            this.getList();
        },
        getList() {
            this.searchParams = JSON.parse(JSON.stringify(this.params));
            this.searchParams.transferCode = this.searchParams.transferCode.replace(/(^\s*)|(\s*$)/g,'');
            this.loading = true;
            transferQueryTransferList(this.searchParams).then(res => {
                this.loading = false;
                if(res.data.code == "200") {
                    const data = res.data.data ? res.data.data : null;
                    let data1 = data ? data.recordList : [];
                    for(var i=0;i<data1.length;i++){
                        if(data1[i].status != 0){
                            data1[i]._disabled = true
                        }else{
                            data1[i]._disabled = false
                        }
                    }
                    this.tableData = data1;
                    this.total =  data ? data.totalCount:0;
                } else {
                    this.$Message.error(res.data.msg);
                }
            });
        },
        getSelected(selection) {
            this.checkedRow = selection.map(o => {
                return o.transferId;
            });
        },
        bulkDel() {
            if (this.checkedRow.length > 0) {
                this.$Modal.confirm({
                    title: "提示",
                    content: "<p>是否确认删除所选项？</p>",
                    okText: "确认",
                    cancelText: "取消",
                    onOk: () => {
                        this.deleteTransfer(this.checkedRow);
                    }
                });
            } else {
                this.$Modal.warning({
                    title: "提示",
                    content: "<p>请至少选择一条信息！</p>"
                });
            }
        },
        deleteTransfer(transferId) {
            transferDeleteTransfer(transferId).then(res => {
                if(res.data.code == "200") {
                    this.$Message.success('删除成功');
                    this.getList();
                }else {
                    this.$Message.error(res.data.msg);
                }
            })
        },
        
        getOwnerList() {
            commonQueryOwners().then((res) => {
                this.ownnerList = res.data.data.map(item=>{
                    return {id:item.id.toString(),customerName:item.customerName}
                });
            });
        },
    }
};
</script>


