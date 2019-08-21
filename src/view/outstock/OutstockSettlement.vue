<template>
    <div class="white-bg">
        <Form :label-width="150" class="search-form">
            <Row>
                <Col :sm="8" :xs="24">
                <FormItem label="出库结算单号:">
                    <Input v-model="params.outSettleCode" clearable></Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="货主:">
                    <Select v-model="params.ownerId" filterable clearable>
                        <Option v-for="(item,index) in ownnerList" :value="item.id" :key="index">{{ item.customerName }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="出库货物类型:">
                    <Select v-model="params.type" clearable placeholder="所有">
                        <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col :sm="8" :xs="24">
                <FormItem label="状态:">
                    <Select v-model="params.status" clearable placeholder="所有">
                        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="结算客户:">
                    <Select v-model="params.settleCustomerId" filterable clearable>
                        <Option v-for="(item,index) in ownnerList" :value="item.id" :key="index">{{ item.customerName }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="品名:">
                    <Input v-model="params.breedName" clearable :maxlength="20"></Input>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col :sm="8" :xs="24">
                <FormItem label="材质:">
                    <Input v-model="params.materialName" clearable :maxlength="20"></Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="规格:">
                    <Input v-model="params.specName" clearable :maxlength="20"></Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="产地:">
                    <Input v-model="params.brandName" clearable :maxlength="20"></Input>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col :sm="8" :xs="24">
                <FormItem>
                    <Checkbox v-model="params.isRemain" size="large" class="margin-right-30">仅显示待提货数量>0</Checkbox>
                </FormItem>
                </Col>
                <Col :sm="16" :xs="24" class="text-right">
                <Button type="primary" @click="search">查询</Button>
                <Button style="margin-left: 8px" @click="reset">重置</Button>
                </Col>
            </Row>
        </Form>
        <Row>
            <Col span="24">
            <router-link to='AddOutstockSettlement'>
                <Button type="primary" class="margin-bottom-10">新增出库结算单</Button>
            </router-link>
            <Button type="default" class="margin-bottom-10 margin-left-10" @click="bulkDel">批量删除</Button>
            </Col>
        </Row>
        <Table :row-class-name="rowClassName" :columns="tableColumns" :data="tableData" border @on-selection-change="getSelected"></Table>
        <div class="page-wrapper">
            <div v-if="this.$store.state.app.screenSize>768">
                <span class="left">共{{total}}条记录 第{{pageNum}}页 / 共{{Math.ceil(total / pageSize)}}页 </span>
                <Page class="pull-right" :current="pageNum" :total="total" :page-size="pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size-opts="pageSizeOpts" show-sizer show-elevator/>
            </div>
            <div v-if="this.$store.state.app.screenSize<=768">
                <Page class="pull-right" :current="pageNum" :page-size="pageSize" :total="total" @on-change="pageChange" simple />
            </div>
        </div>
        <receive-order ref="modalChild" :settleId="settleId" :showModal="showModal" @hide-modal="hideModel"></receive-order>
    </div>

</template>
<script>
import { commonQueryOwners } from '@/api/common'
import { OutSettleQueryList, OutSettleDeleteOrder } from "@/api/outstock";
import { formatPrice,formatWeight } from "@/libs/util";
import ReceiveOrder from "./components/ReceiveOrder";
export default {
    name: "OutstockSettlement",
    components: { ReceiveOrder },
    data() {
        return {
            showModal: false, //传入子组件的弹框显示
            settleId: 0, //传入子组件的结算单ID
            params: {
                outSettleCode: "",
                ownerId: "",
                settleCustomerId:"",
                type: "",
                status: "",
                breedName:"",
                materialName:"",
                specName:"",
                brandName:"",
                isRemain: true
            },
            searchParams:{
                outSettleCode: "",
                ownerId: "",
                settleCustomerId:"",
                type: "",
                status: "",
                breedName:"",
                materialName:"",
                specName:"",
                brandName:"",
                isRemain: true
            },
            pageSize: 10,
            pageNum: 1,
            pageSizeOpts: [10, 15, 20, 40, 50, 100],
            total: 100,
            checkedRow: [],
            ownnerList: [],
            typeList: [
                {
                    value: 0,
                    label: "原材"
                },
                {
                    value: 1,
                    label: "成品"
                },
                {
                    value: 2,
                    label: "废料"
                }
            ],
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
                    title: "出库结算单号",
                    key: "outSettleCode",
                    align: "left",
                    minWidth: 150,
                    render: (h, data) => {
                        if (
                            data.row.status == "1" ||
                            data.row.status == "2" ||
                            data.row.status == "9"
                        ) {
                            return h(
                                "span",
                                {
                                    class: "tb-link",
                                    on: {
                                        click: () => {
                                            this.$router.push({ name:'ViewOutstockSettlement',query:{id:data.row.id}});
                                        }
                                    }
                                },
                                data.row.outSettleCode
                            );
                        } else {
                            return h("span", {}, data.row.outSettleCode);
                        }
                    }
                },
                {
                    title: "货主",
                    key: "ownerName",
                    tooltip: true,
                    ellipsis: true,
                    align: "left",
                    minWidth: 200
                },
                {
                    title: "结算客户",
                    key: "settleCustomerName",
                    tooltip: true,
                    ellipsis: true,
                    align: "left",
                    minWidth: 200
                },
                {
                    title: "货物类型",
                    key: "type",
                    align: "left",
                    minWidth: 90,
                    render: (h, data) => {
                        var typeText = "";
                        if (data.row.type == "0") {
                            typeText = "原料";
                        } else if (data.row.type == "1") {
                            typeText = "成品";
                        } else if (data.row.type == "2") {
                            typeText = "废料";
                        }
                        return h("span", {}, typeText);
                    }
                },
                {
                    title: "出库结算数量(件)",
                    key: "number",
                    align: "right",
                    minWidth: 130
                },
                {
                    title: "重量(吨)",
                    key: "weight",
                    align: "right",
                    minWidth: 110,
                    render: (h, data) => {
                        return h("span",formatWeight(data.row.weight));
                    }
                },
                {
                    title: "待提货数量(件)",
                    key: "remainNumber",
                    align: "right",
                    minWidth: 120
                },
                {
                    title: "备注",
                    tooltip: true,
                    ellipsis: true,
                    key: "remark",
                    align: "left",
                    minWidth: 130
                },
                {
                    title: "结算方式",
                    key: "settleType",
                    align: "left",
                    minWidth: 80,
                    render: (h, data) => {
                        var text = "";
                        if (data.row.settleType == "0") {
                            text = "月结";
                        } else if (data.row.settleType == "1") {
                            text = "现结";
                        } else if (data.row.settleType == "2") {
                            text = "其他";
                        }
                        return h("span", text);
                    }
                },
                {
                    title: "状态",
                    key: "status",
                    align: "left",
                    minWidth: 100,
                    render: (h, data) => {
                        var statusTest = "",
                            statusClass = "";
                        if (data.row.status == "0") {
                            statusTest = "待审核";
                            statusClass = "ivu-tag-blue";
                        } else if (data.row.status == "1") {
                            statusTest = "已审核";
                            statusClass = "ivu-tag-green";
                        } else if (data.row.status == "2") {
                            statusTest = "已审核";
                            statusClass = "ivu-tag-green";
                        } else if (data.row.status == "9") {
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
                    minWidth: 170
                },
                {
                    title: "操作",
                    align: "left",
                    minWidth: 180,
                    fixed: "right",
                    render: (h, data) => {
                        var h_edit = h(
                            "span",
                            {
                                class: "tb-link margin-right-10",
                                on: {
                                    click: () => {
                                        this.$router.push({name:"EditOutstockSettlement",query:{id:data.row.id}});
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
                                        this.$router.push({ name:'AuditOutstockSettlement',query:{id:data.row.id}});
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
                                        this.$router.push({ name:'ViewOutstockSettlement',query:{id:data.row.id}});
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
                                            content:"<p>是否确认删除这条信息？</p>",
                                            okText: "确认",
                                            cancelText: "取消",
                                            onOk: () => {
                                                this.deleteFun(data.row.id);
                                            }
                                        });
                                    }
                                }
                            },
                            "删除"
                        );
                        var h_pick = h(
                            "span",
                            {
                                class: "tb-link margin-right-10",
                                on: {
                                    click: () => {
                                        this.$router.push({
                                            name: "AddPickGoods",query:{id:data.row.id}
                                        });
                                    }
                                }
                            },
                            "生成提货单"
                        );

                        return h(
                            "div",
                            (function() {
                                var childs = [];
                                var i;
                                if (data.row.status == "0") {
                                    childs.push(h_edit, h_audit, h_del);
                                }
                                if (data.row.status == "1") {
                                    if (data.row.remainNumber > 0) {
                                        childs.push(h_view, h_pick);
                                    } else {
                                       childs.push(h_view);
                                    }
                                }
                                if (data.row.status == "2") {
                                    if (data.row.remainNumber > 0) {
                                        childs.push(h_view, h_pick);
                                    } else {
                                        childs.push(h_view);
                                    }
                                }
                                if (data.row.status == "9") {
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
        this.getList();
        this.getOwnerList();
    },
    activated(){
        this.getList();
    },
    methods: {
        /**表格行增加背景class */
        rowClassName(row, index) {
            if (row.status == "0") {
                //0-待审核 
                return "table-info-row1";
            } else if (row.status == "9") {
                //9-已删除
                return "table-info-row2";
            }
            return "";
        },
        /**确认收款 */
        hideModel(data) {
            this.showModal = false;
            if(data){
                this.getList();
            }
        },
        getOwnerList() {
            commonQueryOwners().then((res) => {
                this.ownnerList = res.data.data;
            });
        },
        reset() {
            this.params = {
                outSettleCode: "",
                ownerId: "",
                settleCustomerId:"",
                type: "",
                status: "",
                breedName:"",
                materialName:"",
                specName:"",
                brandName:"",
                isRemain: true
            }
        },
        search() {
            this.searchParams.outSettleCode = this.params.outSettleCode;
            this.searchParams.ownerId = this.params.ownerId;
            this.searchParams.settleCustomerId = this.params.settleCustomerId;
            this.searchParams.type = this.params.type;
            this.searchParams.status = this.params.status;
            this.searchParams.isRemain = this.params.isRemain;
            this.searchParams.breedName = this.params.breedName;
            this.searchParams.materialName = this.params.materialName;
            this.searchParams.specName = this.params.specName;
            this.searchParams.brandName = this.params.brandName;
            this.pageChange(1);
        },
        getList() {
            const para = {
                outSettleCode: this.searchParams.outSettleCode,
                ownerId: this.searchParams.ownerId,
                settleCustomerId:this.searchParams.settleCustomerId,
                type: this.searchParams.type,
                status: this.searchParams.status,
                isRemain: this.searchParams.isRemain,
                breedName: this.searchParams.breedName,
                materialName: this.searchParams.materialName,
                specName: this.searchParams.specName,
                brandName: this.searchParams.brandName,
                numPerPage: this.pageSize,
                pageNo: this.pageNum
            };
            OutSettleQueryList(para).then(res => {
                if(res.data.code=="200"){
                    let dealData = res.data.data.recordList;
                    if(dealData){
                        for(var i=0;i<dealData.length;i++){
                            if(dealData[i].status != 0){
                                dealData[i]._disabled = true
                            }else{
                                dealData[i]._disabled = false
                            }
                        }
                    }
                    this.tableData = dealData;
                    this.total = res.data.data.totalCount;
                } 
            });
        },
        getSelected(selection) {
            this.checkedRow = selection;
        },
        bulkDel() {
            if (this.checkedRow.length > 0) {
                this.$Modal.confirm({
                    title: "提示",
                    content: "<p>是否确认删除所选项？</p>",
                    okText: "确认",
                    cancelText: "取消",
                    onOk: () => {
                        let ids = this.checkedRow.map(item => {
                            return item.id
                        })
                        this.deleteFun(ids.join(","));
                    }
                });
            } else {
                this.$Modal.warning({
                    title: "提示",
                    content: "<p>请至少选择一条信息！</p>"
                });
            }
        },
        deleteFun(ids){
            OutSettleDeleteOrder({
                id: ids
            }).then((res) => {
                if(res.data.code=="200"){
                    this.getList();
                    this.$Message.success({
                        content: "删除成功!",
                        duration: 1
                    });
                }else{
                    this.$Message.error({
                        content: res.data.msg,
                        duration: 1
                    });
                }
            });
        },
        pageChange(page) {
            this.pageNum = page;
            this.getList();
        },
        pageSizeChange(pagesize) {
            this.pageNum = 1;
            this.pageSize = pagesize;
            this.getList();
        }
    }
};
</script>



