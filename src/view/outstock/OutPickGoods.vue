<template>
    <div class="white-bg">
        <div class="table-scrollable left-right-table">
            <table border="1">
                <tbody>
                    <tr>
                        <td class="left-bg">提货单号：</td>
                        <td>435435353</td>
                        <td class="left-bg">出库结算单号：</td>
                        <td>2342432432</td>
                        <td class="left-bg">预计提货日期：</td>
                        <td>2019-1-12</td>
                    </tr>
                    <tr>
                        <td class="left-bg">货主：</td>
                        <td>上海金属公司</td>
                        <td class="left-bg">提货凭证：</td>
                        <td>身份证</td>
                        <td class="left-bg">提货车号：</td>
                        <td>沪D20392</td>
                    </tr>
                    <tr>
                        <td class="left-bg">司机姓名：</td>
                        <td>王二</td>
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
        <Row class="margin-top-20 margin-bottom-10">
            <Col span="24">
            <div class="pull-left table-title">提货单明细</div>
            <div class="pull-right count-content">
                <span class="margin-right-10">提货总数量：
                    <b class="tip">10</b> 件</span>
                <span class="margin-right-10">提货总重量：
                    <b class="tip">20.0000</b> 吨</span>
            </div>
            </Col>
        </Row>
        <Table :columns="tableColumns" :data="tableData" border></Table>
        <div class="text-center margin-top-20">
            <Button type="primary" @click="confirmOut">确认出库</Button>
            <Button class="btn-common-width margin-left-10" @click="backFun">取消</Button>
        </div>
    </div>
</template>
<script>
import { closeNowTag } from "@/libs/util";
export default {
    name: "OutPickGoods",
    data() {
        return {
            tableData: [
                {
                    a: "AA0001",
                    a1: "成品",
                    b: "沙钢",
                    c: "带钢",
                    d: "3.5*203",
                    e: "Q235B",
                    f: "3",
                    g: "0.5",
                    h: "0.7",
                    m: "",
                    n: "",
                    o: "",
                    p: "",
                    q: "",
                    r: ""
                },
                {
                    a: "AA0001",
                    a1: "成品",
                    b: "沙钢",
                    c: "带钢",
                    d: "3.5*203",
                    e: "Q235B",
                    f: "3",
                    g: "0.5",
                    h: "0.7",
                    m: "",
                    n: "",
                    o: "",
                    p: "",
                    q: "",
                    r: ""
                }
            ],
            tableColumns: [
                {
                    title: "编号",
                    key: "a",
                    align: "left",
                    minWidth: 100
                },
                {
                    title: "货物类型",
                    key: "a1",
                    align: "left",
                    minWidth: 100
                },
                {
                    title: "产地",
                    key: "b",
                    align: "left",
                    minWidth: 100
                },
                {
                    title: "品名",
                    key: "c",
                    align: "left",
                    minWidth: 100
                },
                {
                    title: "材质",
                    key: "e",
                    align: "left",
                    minWidth: 100
                },
                {
                    title: "规格",
                    key: "d",
                    align: "left",
                    minWidth: 100
                },
                {
                    title: "库区",
                    key: "m",
                    align: "left",
                    minWidth: 100
                },
                {
                    title: "库位",
                    key: "n",
                    align: "left",
                    minWidth: 100
                },
                {
                    title: "提货数量",
                    key: "f",
                    align: "right",
                    minWidth: 100
                },
                {
                    title: "单件重量",
                    key: "g",
                    align: "right",
                    minWidth: 100
                },
                {
                    title: "提货总重量",
                    key: "h",
                    align: "right",
                    minWidth: 100
                },

                {
                    title: "包装",
                    key: "o",
                    align: "left",
                    minWidth: 100
                },
                {
                    title: "外观",
                    key: "p",
                    align: "left",
                    minWidth: 100
                },
                {
                    title: "钢卷号/捆包号",
                    key: "q",
                    align: "left",
                    minWidth: 120
                }
            ]
        };
    },
    mounted() {
        this.getList();
    },
    methods: {
        getList() {
            // getTableData(params).then(res => {
            //     this.tableData = res.data.list;
            //     this.total = res.data.total;
            // });
        },
        backFun() {
            closeNowTag(this.$store.state.app, this.$route);
            this.$router.push({
                path: "PickGoodsManage"
            });
        },
        confirmOut() {
            this.$Modal.confirm({
                    title: '提示',
                    content: '<p>是否确认出库？</p>',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => {
                        //调用接口
                        this.$Message.success({
                            content: "出库成功!",
                            duration: 1
                        });
                        setTimeout(() => {
                            closeNowTag(this.$store.state.app, this.$route);
                            this.$router.push({
                                name: "PickGoodsManage"
                            });
                        }, 1000);
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


