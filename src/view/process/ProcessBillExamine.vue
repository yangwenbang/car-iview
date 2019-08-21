<template>
    <Row type="flex" justify="center" class="white-bg detail-panel">
        <Col :xs="24" :sm="24" :md="24">
            <div class="table-scrollable left-right-table">
                <table border="1">
                    <tbody>
                        <tr>
                            <td class="left-bg">加工单号：</td>
                            <td>{{processMessage.processCode}}</td>
                            <td class="left-bg">期望交货日期：</td>
                            <td>{{processMessage.expectDeliverTime==0?'':processMessage.expectDeliverTime}}</td>
                            <td class="left-bg">货主：</td>
                            <td>{{processMessage.ownerName}}</td>
                        </tr>
                        <tr>
                            <td class="left-bg">联系人：</td>
                            <td>{{processMessage.contract}}</td>
                            <td class="left-bg">手机号码：</td>
                            <td> {{processMessage.mobile}}</td>
                            <td class="left-bg">加工类别：</td>
                            <td>{{$route.query.typeName}}</td>
                        </tr>
                        <tr>
                            <td class="left-bg">加工出库一票结：</td>
                            <td>{{processMessage.isIntegrate==1?'是':'否'}}</td>
                            <td class="left-bg">结算方式：</td>
                            <td> {{processMessage.settleType==0?'现结':'月结'}}</td>
                            <td class="left-bg"></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td class="left-bg">加工要求描述：</td>
                            <td colspan="5">{{processMessage.processDemand}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Col>
        <Col :span="24">
            <Tabs>
                <TabPane label="开平加工单" v-if="$route.query.typeName == '开平'">
                <Row>
                    <Col :xs="24" :sm="24" :md="24"> 
                        <Row class="margin-bottom-10">
                            <Col span="24">
                                <div class="pull-left table-title">机组</div>
                            </Col>
                        </Row>
                        <Form>
                            {{processMessage.deviceName}}
                        </Form>
                        <Row :gutter="10">
                            <Col span="24">
                                <div class="pull-left margin-bottom-10 margin-top-20 table-title">
                                    <span class="margin-right-10">加工信息</span>
                                </div>
                            </Col>
                            <Col span="24">
                            <Table :row-class-name="rowClassName" :columns="tableColumns1" :data="tableData1" disabled-hover border>
                            </Table>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                </TabPane>
                <TabPane label="纵剪加工单" v-else>
                    <Row>
                        <Col :xs="24" :sm="24" :md="24"> 
                            <Row class="margin-bottom-10">
                                <Col span="24">
                                <div class="pull-left table-title">机组</div>
                                </Col>
                            </Row>
                            <Form>
                                {{processMessage.deviceName}}
                            </Form>
                            <Row :gutter="10">
                                <Col span="24">
                                    <div class="pull-left margin-bottom-10 margin-top-20 table-title">
                                        <span class="margin-right-10">加工信息</span>
                                    </div>
                                </Col>
                                <Col span="24">
                                <Table :row-class-name="rowClassName" :columns="tableColumns3" :data="tableData1" disabled-hover border></Table>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </TabPane>
            </Tabs>
        </Col>
        <div class="text-align-center margin-top-10">
            <Button type="primary" @click="handleSubmit" class="btn-common-width">审核</Button>
            <Button class="btn-common-width margin-left-10" @click="backFun">取消</Button>
        </div>
    </Row>
</template>

<script>
import { closeNowTag, formatWeight, formatPrice } from "@/libs/util";
import InlayTableHeader from './components/InlayTableHeader';
import { InventoryProcessAuditProcess,InventoryProcessProcessInfo } from '@/api/process'
export default {
    name: "ProcessBillExamine",
    components: {
        InlayTableHeader
    },
    data() {
        return {
            processMessage: {
                processCode: '',
                ownerName: '',
                expectDeliverTime: '',
                contract: '',
                mobile: '',
                processType: this.$route.query.typeName,
                processDemand: '',
                deviceName: '',
            },
            processId: this.$route.query.processId,
            tableData1:[],
            tableColumns1: [
                {
                    title: '母卷',
                    align: 'center',
                    children: [
                        {
                            title: "编号",
                            key: "inventoryCode",
                            align: "left",
                            minWidth: 80
                        },
                        {
                            title: "母卷信息",
                            key: "",
                            align: "left",
                            minWidth: 150,
                            render: (h, params) => {
                                if(params.row.inventoryCode != '合计') {
                                    return h('div',[
                                        h('div','捆包号：'+params.row.baleNumber),
                                        h('div','产地：'+params.row.brandName),
                                        h('div','品名：'+params.row.breedName),
                                        h('div','材质：'+params.row.materialName),
                                        h('div',{
                                            style: {
                                                color: '#1890ff',
                                                fontWeight: '600'
                                            }
                                        },'规格：'+params.row.specName),
                                        h('div','库区库位：'+params.row.storageArea+' '+params.row.storagePlace),
                                        h('div','包装：'+params.row.wrap)
                                    ])
                                } else {
                                    return h('span', '')
                                }
                            }
                        },
                        {
                            title: "数量(卷)",
                            key: "number",
                            align: "right",
                            minWidth: 80
                        },
                        {
                            title: "重量(吨)",
                            key: "weight",
                            align: "right",
                            minWidth: 80,
                            render: (h, params) => {
                                return h('span', formatWeight(params.row.weight))
                            }
                        },
                        {
                            title: "用料(吨)",
                            key: "processWeight",
                            align: "right",
                            minWidth: 80,
                            render: (h, params) => {
                                return h('span', formatWeight(params.row.processWeight))
                            }
                        },
                    ]
                },
                {
                    title: '加工信息',
                    align: 'center',
                    children: [
                        {
                            title: '规格信息',
                            align: 'center',
                            width: 619,
                            renderHeader: (h, params) => {
                                return h(InlayTableHeader,{
                                    props: {
                                        columns: this.tableColumns2,
                                    }
                                })
                            },
                            render: (h, params) => {
                                return h('Table',{
                                    props: {
                                        showHeader: false,
                                        disabledHover: true,
                                        columns: this.tableColumns2,
                                        data: params.row.processProducts
                                    }
                                })
                            }
                        },
                        {
                            title: '金额(元)',
                            key: 'totalPrice',
                            align: 'right',
                            minWidth: 80,
                            render: (h, params) => {
                                return h('span', formatPrice(params.row.totalPrice))
                            }
                        }
                    ]
                }
            ],
            tableColumns2: [
                {
                    title: "加工长度(mm)",
                    key: "specWidth",
                    width: 120,
                    align: 'right'
                },
                {
                    title: "加工数量(张)",
                    key: "number",
                    width: 120,
                    align: 'right'
                },
                {
                    title: "理重(吨)",
                    key: "weight",
                    width: 120,
                    align: 'right',
                    render: (h, params) => {
                        return h('span', formatWeight(params.row.weight))
                    }
                },
                {
                    title: '加工单价(元/吨)',
                    key: 'unitPrice',
                    align: 'right',
                    width: 120,
                    render: (h, params) => {
                        if(params.row.unitPrice !== '') {
                            return h('span', formatPrice(params.row.unitPrice))
                        } else {
                            return h('span', '')
                        }
                    }
                },
                {
                    title: '其他费用(元)',
                    key: 'otherCharge',
                    align: 'right',
                    width: 120,
                    render: (h, params) => {
                        if(params.row.otherCharge !== '') {
                            return h('span', formatPrice(params.row.otherCharge))
                        } else {
                            return h('span', '')
                        }
                    }
                }
            ],
            //纵剪
            tableColumns3: [
                {
                    title: '母卷',
                    align: 'center',
                    children: [
                        {
                        title: "编号",
                        key: "inventoryCode",
                        align: "left",
                        minWidth: 80
                    },
                    {
                        title: "母卷信息",
                        key: "",
                        align: "left",
                        minWidth: 150,
                        render: (h, params) => {
                            if(params.row.inventoryCode != '合计') {
                                return h('div',[
                                    h('div','捆包号：'+params.row.baleNumber),
                                    h('div','产地：'+params.row.brandName),
                                    h('div','品名：'+params.row.breedName),
                                    h('div','材质：'+params.row.materialName),
                                    h('div',{
                                            style: {
                                                color: '#1890ff',
                                                fontWeight: '600'
                                            }
                                        },'规格：'+params.row.specName),
                                    h('div','库区库位：'+params.row.storageArea+' '+params.row.storagePlace),
                                    h('div','包装：'+params.row.wrap)
                                ])
                            } else {
                                return h('span', '')
                            }
                        }
                    },
                    {
                        title: "数量(卷)",
                        key: "number",
                        align: "right",
                        minWidth: 80
                    },
                    {
                        title: "重量(吨)",
                        key: "weight",
                        align: "right",
                        minWidth: 80,
                        render: (h, params) => {
                            return h('span', formatWeight(params.row.weight))
                        }
                    },
                    {
                        title: "用料(吨)",
                        key: "processWeight",
                        align: "right",
                        minWidth: 80,
                        render: (h, params) => {
                            return h('span', formatWeight(params.row.processWeight))
                        }
                    },
                    {
                        title: "分段",
                        key: "sectionNumber",
                        align: "right",
                        minWidth: 80
                    },
                    ]
                },
                {
                    title: '加工信息',
                    align: 'center',
                    children: [
                        {
                            title: '规格信息',
                            align: 'center',
                            width: 619,
                            renderHeader: (h, params) => {
                                return h(InlayTableHeader,{
                                    props: {
                                        columns: this.tableColumns4,
                                    }
                                })
                            },
                            render: (h, params) => {
                                return h('Table',{
                                    props: {
                                        showHeader: false,
                                        disabledHover: true,
                                        columns: this.tableColumns4,
                                        data: params.row.processProducts
                                    }
                                })
                            }
                        },
                        {
                            title: '金额(元)',
                            key: 'totalPrice',
                            align: 'right',
                            minWidth: 80,
                            render: (h, params) => {
                                return h('span', formatPrice(params.row.totalPrice))
                            }
                        },
                    ]
                }
            ],
            tableColumns4: [
                {
                    title: "加工宽度(mm)",
                    key: "specWidth",
                    width: 120,
                    align: 'right'
                },
                {
                    title: "加工数量(条)",
                    key: "number",
                    width: 120,
                    align: 'right'
                },
                {
                    title: "理重(吨)",
                    key: "weight",
                    width: 120,
                    align: 'right',
                    render: (h, params) => {
                        return h('span', formatWeight(params.row.weight))
                    }
                },
                {
                    title: '加工单价(元/吨)',
                    key: 'unitPrice',
                    align: 'right',
                    width: 120,
                    render: (h, params) => {
                        if(params.row.unitPrice !== '') {
                            return h('span', formatPrice(params.row.unitPrice))
                        } else {
                            return h('span', '')
                        }
                    }
                },
                {
                    title: '其他费用(元)',
                    key: 'otherCharge',
                    align: 'right',
                    width: 120,
                    render: (h, params) => {
                        if(params.row.otherCharge !== '') {
                            return h('span', formatPrice(params.row.otherCharge))
                        } else {
                            return h('span', '')
                        }
                    }
                }
            ]
        };
    },
    methods: {
        rowClassName(row, index) {
            if (row.inventoryCode == "合计") {
                return "table-info-row2";
            }
            return "";
        },
        handleSubmit() {
            InventoryProcessAuditProcess({
                processId: this.processId
            }).then(res => {
                if(res.data.code == '200') {
                    this.$Message.success({
                        content: res.data.data,
                        duration: 1
                    });
                    closeNowTag(this.$store.state.app, this.$route);
                    this.$router.push({
                        name: 'ProcessList'
                    })
                } else {
                    this.$Message.error(res.data.msg);
                }
            })
        },
        backFun() {
            closeNowTag(this.$store.state.app, this.$route);
            this.$router.push({
                path: "ProcessList"
            });
        },
        getData() {
            InventoryProcessProcessInfo({
                processId: this.processId
            }).then(res => {
                if(res.data.code == "200") {
                    const data = res.data.data;
                    this.tableData1 = data.processMaterials ? data.processMaterials : [];
                    delete data.processMaterials;
                    this.processMessage = data;
                    let sum = {
                        inventoryCode: '合计',
                        number: 0,
                        weight: 0,
                        processWeight: 0,
                        totalPrice: 0,
                        processProducts: [
                            {
                                number: 0,
                                weight: 0,
                                otherCharge: '',
                                unitPrice: ''
                            }
                        ]
                    }
                    this.tableData1.map((o, index) => {
                        sum.number += o.number;
                        sum.weight += o.weight;
                        sum.processWeight += o.processWeight;
                        sum.totalPrice += o.totalPrice;
                        o.processProducts.map(o1 => {
                            sum.processProducts[0].number += o1.number;
                            sum.processProducts[0].weight += o1.weight;
                        })
                    })
                    if(this.tableData1.length > 0) {
                        this.tableData1.push(sum)
                    }
                } else {
                    this.$Message.error(res.data.msg);
                }
            })
        }
    },
    mounted() {
        this.getData();
    }
};
</script>

<style lang="less" scoped>
.ivu-radio-wrapper {
    line-height: 0;
}
.border {
    border: 1px solid #cccccc;
    padding: 10px;
}
.text-align-center {
    text-align: center;
}
</style>
