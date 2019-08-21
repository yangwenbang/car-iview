<template>
    <div class="white-bg">
        <Form :label-width="150" class="search-form">
            <Row justify="space-between">
                <Col :sm="8" :xs="24">
                <FormItem label="过户单号:">
                    <Input></Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="过户日期:">
                    <DatePicker v-model="formValidate.inputDate" type="date" style="width:100%;"></DatePicker>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="原货主:">
                    <Input></Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="新货主:">
                    <Input></Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="过户凭证:">
                    <Input></Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="数量:">
                    <Input>
                    <span slot="append">件</span>
                    </Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="重量:">
                    <Input>
                    <span slot="append">吨</span>
                    </Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="过户费用:">
                    <Input>
                    <span slot="append">元</span>
                    </Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="其他费用:">
                    <Input>
                    <span slot="append">元</span>
                    </Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="总金额:">
                    <Input>
                    <span slot="append">元</span>
                    </Input>
                </FormItem>
                </Col>
                <Col :sm="24" :xs="24">
                <FormItem label="备注:">
                    <Input type="textarea" :autosize="{minRows: 2,maxRows: 5}" />
                </FormItem>
                </Col>
            </Row>
        </Form>
        <Row class="margin-top-20 margin-bottom-10">
            <Col span="24">
            <div class="pull-left table-title">过户货物明细
                <Button size="small" type="info" class="margin-left-10" @click="modal = true">选择过户货物</Button>
            </div>
            <div class="pull-right count-content">【合计】
                <span class="margin-right-10">附加费：
                    <b class="tip">233.00</b> 元</span>
                <span class="margin-right-10">打包费：
                    <b class="tip">300.00</b> 元</span>
            </div>
            </Col>
        </Row>
        <Table :columns="tableColumns" :data="tableData" border @on-selection-change="getSelected"></Table>
        <div class="text-center margin-top-20">
            <Button type="primary" @click="submitFun">保存</Button>
        </div>
        <Modal v-model="modal" title="选择过户货物" width="90%">
            <transfer-goods></transfer-goods>
        </Modal>
    </div>
</template>
<script>
import TransferGoods from "./components/TransferGoods";
import { closeNowTag } from "@/libs/util";
export default {
    name: "AddTransfer",
    components: { TransferGoods },
    data() {
        return {
            formValidate: {
                openInfo: "",
                warehouseName: "",
                payType: "月结",
                isOpen: "是"
            },
            checkedRow: [],
            modal: false,
            pageSize: 10,
            pageNum: 1,
            pageSizeOpts: [10, 15, 20, 40, 50, 100],
            total: 100,
            warehouseNameList: [
                {
                    value: "仓库1",
                    label: "仓库1"
                },
                {
                    value: "仓库2",
                    label: "仓库2"
                },
                {
                    value: "仓库3",
                    label: "仓库3"
                }
            ],
            tableData: [
                {
                    a: "AA0001",
                    b: "沙钢",
                    c: "带钢",
                    d: "3.5*203",
                    e: "货主",
                    f: "3",
                    g: "0.5",
                    h: "0.7",
                    i: "300.00",
                    j: "0.00",
                    k: "300.00",
                    l: "",
                    m: "",
                    n: "",
                    o: "",
                    p: "",
                    q: ""
                },
                {
                    a: "AA0001",
                    b: "沙钢",
                    c: "带钢",
                    d: "3.5*203",
                    e: "货主",
                    f: "3",
                    g: "0.5",
                    h: "0.7",
                    i: "300.00",
                    j: "0.00",
                    k: "300.00",
                    l: "",
                    m: "",
                    n: "",
                    o: "",
                    p: "",
                    q: ""
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
                    title: "规格",
                    key: "d",
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
                    title: "过户费用",
                    key: "i",
                    align: "right",
                    minWidth: 80
                },
                {
                    title: "其他费用",
                    key: "j",
                    align: "right",
                    minWidth: 80
                },
                {
                    title: "金额",
                    key: "k",
                    align: "right",
                    minWidth: 80
                },
                {
                    title: "库区",
                    key: "l",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "库位",
                    key: "m",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "包装",
                    key: "n",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "外观",
                    key: "o",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "钢卷号/捆包号",
                    key: "p",
                    align: "left",
                    minWidth: 120
                },
                {
                    title: "其他信息",
                    key: "q",
                    tooltip: true,
                    ellipsis: true,
                    align: "left",
                    minWidth: 100
                },
                {
                    title: "操作",
                    align: "center",
                    minWidth: 60,
                    render: (h, data) => {
                        return h("div", [
                            h("Icon", {
                                props: {
                                    type: "md-remove-circle",
                                    size: 20
                                },
                                class: "tb-link-remove color-red",
                                on: {
                                    click: () => {
                                        this.tableData.splice(data.index, 1);
                                    }
                                }
                            })
                        ]);
                    }
                }
            ]
        };
    },
    mounted() {
        this.getList();
    },
    methods: {
        reset() {
            this.formValidate = {};
        },
        search() {
            this.pageChange(1);
        },
        getSelected(selection) {
            this.checkedRow = selection;
        },
        submitFun() {
            if (this.checkedRow.length > 0) {
                //调用接口
                this.$Message.success({
                    content: "新增成功!",
                    duration: 1
                });
                setTimeout(() => {
                    closeNowTag(this.$store.state.app, this.$route);
                    this.$router.push({
                        name: "TransferManage"
                    });
                }, 1000);
            } else {
                this.$Modal.warning({
                    title: "提示",
                    content: "<p>请至少选择一条信息！</p>"
                });
            }
        },
        getList() {
            // getTableData(formValidate).then(res => {
            //     this.tableData = res.data.list;
            //     this.total = res.data.total;
            // });
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


