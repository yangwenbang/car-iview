<template>
    <div class="white-bg">
        <Table :columns="tableColumns2" :data="tableData2" border>
        </Table>
        <Form :label-width="150" class="search-form margin-top-20">
            <Row type="flex" justify="space-between">
                <Col :sm="12" :xs="24">
                <FormItem label="收款类型:">
                    <Select v-model="params.payType" clearable>
                        <Option v-for="item in payTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col :sm="12" :xs="24">
                <FormItem label="收款方式:">
                    <Select v-model="params.payWay" clearable>
                        <Option v-for="item in payWayList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                </Col>
            </Row>
            <Row type="flex" justify="space-between">
                <Col :sm="12" :xs="24">
                <FormItem label="收款金额:">
                    <Input v-model="params.money">
                        <span slot="append">元</span>
                    </Input>
                </FormItem>
                </Col>
                <Col :sm="12" :xs="24">
                <FormItem label="付款人:">
                    <Select v-model="params.payPerson" clearable>
                        <Option v-for="item in payPersonList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                </Col>
            </Row>
        </Form>
        <div class="text-center margin-top-10">
            <Button type="primary" class="btn-common-width" @click="submitFun">收款</Button>
            <Button class="btn-common-width margin-left-10" @click="backFun">取消</Button>
        </div>
        <hr class="separat-line margin-top-20" size="1px">
        <Row class="margin-top-20 margin-bottom-10">
            <Col span="24">
            <div class="pull-left table-title">出库结算单</div>
            </Col>
        </Row>
        <div class="table-scrollable left-right-table">
            <table border="1">
                <tbody>
                    <tr>
                        <td class="left-bg">出库结算单号：</td>
                        <td>435435353</td>
                        <td class="left-bg">预计提货日期：</td>
                        <td>2019-1-12</td>
                        <td class="left-bg">货主：</td>
                        <td>上海金属公司</td>
                    </tr>
                    <tr> 
                        <td class="left-bg">结算方式：</td>
                        <td>现金结算</td>
                        <td class="left-bg">提货车号：</td>
                        <td>沪D20392</td>
                        <td class="left-bg">司机姓名：</td>
                        <td>王二</td>
                    </tr>
                    <tr>
                        <td class="left-bg">司机电话：</td>
                        <td>13810001000</td>
                        <td class="left-bg">身份证号：</td>
                        <td>310201196601012302</td>
                    </tr>
                    <tr>
                        <td class="left-bg">备注：</td>
                        <td colspan="5">-</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <Row class="margin-top-20">
            <Col span="24">
            <div class="pull-left table-title">出库结算单明细</div>
            <div class="pull-right count-content">
                <span class="margin-right-10">数量：
                    <b class="tip">10</b> 件</span>
                <span class="margin-right-10">总重量：
                    <b class="tip">20.0000</b> 吨</span>
                <span class="margin-right-10">总重量：
                    <b class="tip">2342.00</b> 元</span>
            </div>
            </Col>
        </Row>
        <Table :columns="tableColumns" :data="tableData" border></Table>
        
    </div>
</template>
<script>
import { closeNowTag } from "@/libs/util";
export default {
    name: "ReceiveOutstockSettlement",
    data() {
        return {
            params: {
                payType: "1",
                payWay: "1",
                money: "",
                payPerson: ""
            },
            payTypeList: [
                {
                    value: "1",
                    label: "所有"
                },
                {
                    value: "2",
                    label: "出库结算单"
                }
            ],
            payWayList: [
                {
                    value: "1",
                    label: "现金"
                },
                {
                    value: "2",
                    label: "刷卡"
                },
                {
                    value: "3",
                    label: "支付宝"
                },
                {
                    value: "4",
                    label: "微信"
                }
            ],
            payPersonList: [
                {
                    value: "1",
                    label: "李MM"
                },
                {
                    value: "2",
                    label: "王MM"
                }
            ],
            tableData: [
                {
                    a: "AA0001",
                    b: "沙钢",
                    c: "带钢",
                    d: "3.5*203",
                    e: "Q235B",
                    f: "3",
                    g: "0.5",
                    h: "0.7",
                    i: "4300",
                    j: "0",
                    k: "0",
                    l: "",
                    m: "",
                    n: "",
                    o: "",
                    p: "",
                    q: "",
                    r: ""
                },
                {
                    a: "AA0001",
                    b: "沙钢",
                    c: "带钢",
                    d: "3.5*203",
                    e: "Q235B",
                    f: "3",
                    g: "0.5",
                    h: "0.7",
                    i: "4300",
                    j: "0",
                    k: "0",
                    l: "",
                    m: "",
                    n: "",
                    o: "",
                    p: "",
                    q: "",
                    r: ""
                }
            ],
            tableData2: [
                {
                    a: "出库结算单",
                    b: "435435353",
                    c: "无锡城南库",
                    d: "30",
                    e: "0",
                    f: "30"
                },{
                    a: "合计",
                    b: "",
                    c: "",
                    d: "",
                    e: "",
                    f: "30"
                }
            ],
            tableColumns: [
                {
                    title: "编号",
                    key: "a",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "产地",
                    key: "b",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "品名",
                    key: "c",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "材质",
                    key: "e",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "规格",
                    key: "d",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "数量",
                    key: "f",
                    align: "right",
                    minWidth: 80
                },
                {
                    title: "单件重量",
                    key: "g",
                    align: "right",
                    minWidth: 80
                },
                {
                    title: "总重量",
                    key: "h",
                    align: "right",
                    minWidth: 80
                },
                {
                    title: "单价",
                    key: "i",
                    align: "right",
                    minWidth: 80
                },
                {
                    title: "运杂费",
                    key: "j",
                    align: "right",
                    minWidth: 80
                },
                {
                    title: "其他费",
                    key: "k",
                    align: "right",
                    minWidth: 80
                },
                {
                    title: "金额",
                    key: "l",
                    align: "right",
                    minWidth: 80
                },
                {
                    title: "库区",
                    key: "m",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "库位",
                    key: "n",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "包装",
                    key: "o",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "外观",
                    key: "p",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "钢卷号/捆包号",
                    key: "q",
                    align: "left",
                    minWidth: 120
                },
                {
                    title: "其他信息",
                    key: "r",
                    tooltip: true,
                    ellipsis: true,
                    align: "left",
                    minWidth: 100
                }
            ],
            tableColumns2: [
                {
                    title: "收款类型",
                    key: "a",
                    align: "left",
                    minWidth: 100
                },
                {
                    title: "业务单号",
                    key: "b",
                    align: "left",
                    minWidth: 100
                },
                {
                    title: "仓库名称",
                    key: "c",
                    align: "left",
                    minWidth: 100
                },
                {
                    title: "出库费（元）",
                    key: "d",
                    align: "right",
                    minWidth: 100
                },
                {
                    title: "加工费（元）",
                    key: "e",
                    align: "right",
                    minWidth: 100
                },
                {
                    title: "总额",
                    key: "f",
                    align: "right",
                    minWidth: 100
                }
            ]
        };
    },
    mounted() {
        this.getList();
    },
    methods: {
        reset() {
            this.params = {};
        },
        search() {
            this.pageChange(1);
        },
        getList() {
            // getTableData(params).then(res => {
            //     this.tableData = res.data.list;
            //     this.total = res.data.total;
            // });
        },
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
                onCancel: () => {
                }
            });
        },
        submitFun() {
            this.$Modal.confirm({
                title: "提示",
                content: "请确认是否提交收款信息？",
                onOk: () => {
                    this.$Message.success({
                        content: "收款成功!",
                        duration: 1
                    });
                    setTimeout(() => {
                        closeNowTag(this.$store.state.app, this.$route);
                        this.$router.push({
                            path: "OutstockSettlement"
                        });
                    }, 1000);
                },
                onCancel: () => {
               
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


