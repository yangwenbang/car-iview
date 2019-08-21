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
                            <td>{{typeName}}</td>
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
        <Col :span="24" class="margin-top-20">
            <Tabs>
                <TabPane label="开平加工单" v-if="typeName == '开平'">
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
                            <router-link v-if="status == 1" :to="{name: 'ProcessPack', query: {processId:$route.query.processId,processType: typeName,processCode: processMessage.processCode}}" class="margin-right-10">
                                <Button type="primary" class="margin-bottom-10">配置打包信息</Button>
                            </router-link>
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
                                <router-link v-if="status == 1" :to="{name: 'ProcessPack', query: {processId:$route.query.processId,processType: typeName,processCode: processMessage.processCode}}" class="margin-right-10">
                                    <Button type="primary" class="margin-bottom-10">配置打包信息</Button>
                                </router-link>
                                <Table :row-class-name="rowClassName" :columns="tableColumns3" :data="tableData1" disabled-hover border></Table>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </TabPane>
            </Tabs>
        </Col>
        <Col span="24" class="margin-top-20 margin-bottom-10" v-if="packageResult.length > 0">
            <div class="pull-left table-title">打包结果</div>
        </Col>
        <Col span="24" v-if="packageResult.length > 0">
            <div class="table-content">
                <div class="ivu-table table1">
                    <table
                    cellspacing="0"
                    cellpadding="0"
                    border="0"
                    width="100%"
                    >
                    <thead>
                        <tr>
                        <th>
                            <div class="ivu-table-cell">打包号</div>
                        </th>
                        <th>
                            <div class="ivu-table-cell">品名</div>
                        </th>
                        <th>
                            <div class="ivu-table-cell">材质</div>
                        </th>
                        <th>
                            <div class="ivu-table-cell">产地</div>
                        </th>
                        <th>
                            <div class="ivu-table-cell">规格</div>
                        </th>
                        <th class="text-right">
                            <div class="ivu-table-cell">数量</div>
                        </th>
                        <th class="text-right">
                            <div class="ivu-table-cell">总理重</div>
                        </th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(data, index) in packageResult">
                        <tr :key="index">
                            <td :rowspan="data.processPackItemDTOS.length>0?data.processPackItemDTOS.length:1"><div class="ivu-table-cell">{{data.packCode}}</div></td>
                            <td><div class="ivu-table-cell">{{typeName}}</div></td>
                            <td><div class="ivu-table-cell" v-if="data.processPackItemDTOS.length>0">{{data.processPackItemDTOS[0].materialName}}</div></td>
                            <td><div class="ivu-table-cell" v-if="data.processPackItemDTOS.length>0">{{data.processPackItemDTOS[0].brandName}}</div></td>
                            <td><div class="ivu-table-cell" v-if="data.processPackItemDTOS.length>0">{{data.processPackItemDTOS[0].specName}}</div></td>
                            <td class="text-right"><div class="ivu-table-cell" v-if="data.processPackItemDTOS.length>0">{{data.processPackItemDTOS[0].number}}</div></td>
                            <td class="text-right"><div class="ivu-table-cell" v-if="data.processPackItemDTOS.length>0">{{data.processPackItemDTOS[0].number*data.processPackItemDTOS[0].perWeight|formatWeight}}</div></td>
                        </tr>
                        <template v-for="(process, i) in data.processPackItemDTOS">
                            <tr
                            :key="process.id"
                            v-if="i > 0"
                            >
                            <td><div class="ivu-table-cell">{{typeName}}</div></td>
                            <td><div class="ivu-table-cell">{{process.materialName}}</div></td>
                            <td><div class="ivu-table-cell">{{process.brandName}}</div></td>
                            <td><div class="ivu-table-cell">{{process.specName}}</div></td> 
                            <td class="text-right"><div class="ivu-table-cell">{{process.number}}</div></td>
                            <td class="text-right"><div class="ivu-table-cell">{{process.number*process.perWeight|formatWeight}}</div></td>
                            </tr>
                        </template>
                        </template>
                    </tbody>
                    </table>
                </div>
            </div>
        </Col>
        <div class="text-align-center margin-top-10">
            <Button v-if="status != 9" class="btn-common-width margin-right-10" type="info" @click="printFun">打印</Button>
            <Button class="btn-common-width margin-left-10" @click="backFun">关闭</Button>
        </div>
    </Row>
</template>

<script>
import { closeNowTag, formatWeight, formatPrice,isAcrobatPluginInstall } from "@/libs/util";
import InlayTableHeader from './components/InlayTableHeader';
import { InventoryProcessProcessInfo } from '@/api/process'
export default {
    name: "ProcessBillDetail",
    components: {
        InlayTableHeader
    },
    data() {
        return {
            processMessage: {},
            processId: this.$route.query.processId,
            packageResult: [],
            status: '',
            typeName: '',
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
                                        h('div','库区库位：'+params.row.storageArea+' '+params.row.storagePlace),
                                        h('div','包装：'+params.row.wrap)
                                    ])
                                } else {
                                    return h('span', '')
                                }
                            }
                        },
                        {
                            title: "规格",
                            key: "specName",
                            align: "left",
                            minWidth: 120,
                            render: (h, params) => {
                                if(params.row.inventoryCode != '合计') {
                                    return h('div',{
                                        style: {
                                            color: '#1890ff',
                                            fontWeight: '600'
                                        }
                                    },params.row.specName)
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
                            title: '加工规格',
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
                    align: 'right',
                    width: 120
                },
                {
                    title: "加工数量(张)",
                    key: "number",
                    align: 'right',
                    width: 120
                },
                {
                    title: "理重(吨)",
                    key: "weight",
                    align: 'right',
                    width: 120,
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
                                    h('div','库区库位：'+params.row.storageArea+' '+params.row.storagePlace),
                                    h('div','包装：'+params.row.wrap)
                                ])
                            } else {
                                return h('span', '')
                            }
                        }
                    },
                    {
                        title: "规格",
                        key: "specName",
                        align: "left",
                        minWidth: 120,
                        render: (h, params) => {
                            if(params.row.inventoryCode != '合计') {
                                return h('div',{
                                    style: {
                                        color: '#1890ff',
                                        fontWeight: '600'
                                    }
                                },params.row.specName)
                            } else {
                                return h('span','')
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
                        minWidth: 80,
                        render: (h, params) => {
                            if(params.row.inventoryCode != '合计') {
                                return h('span', params.row.sectionNumber)
                            } else {
                                return h('span','')
                            }
                        }
                    },
                    ]
                },
                {
                    title: '加工信息',
                    align: 'center',
                    children: [
                        {
                            title: '加工规格',
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
                    align: 'right',
                    width: 120
                },
                {
                    title: "数量(条)",
                    key: "number",
                    align: 'right',
                    width: 120
                },
                {
                    title: "理重(吨)",
                    key: "weight",
                    align: 'right',
                    width: 120,
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
    activated() {
        this.getData();
    },
    methods: {
        printFun(){
             var result = isAcrobatPluginInstall();
             if(result){
                  window.open("/api/pwms/inventory/process/printProcessOrder?processId=" + this.$route.query.processId)
             }
        },
        rowClassName(row, index) {
            if (row.inventoryCode == "合计") {
                return "table-info-row2";
            }
            return "";
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
                if(res.data.code == '200') {
                    const data = res.data.data;
                    this.tableData1 = data.processMaterials ? data.processMaterials : [];
                    this.packageResult = data.packageInfo ?  data.packageInfo:[];
                    this.status = data.status;
                    switch(data.processType) {
                        case 0: this.typeName='开平'; break;
                        case 1: this.typeName='纵剪'; break;
                        case 2: this.typeName='纵剪+开平'; break;
                    }
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
    }
};
</script>

<style lang="less" scoped>
.table-content {
  border-left: 1px solid #ddd;
  border-top: 1px solid #ddd;
  position: relative;
}
.table-content .table1 {
  width: 100%;
  overflow: auto;
}
.table-content .table1 table {
  table-layout: auto;
  min-width: 1600px;
}
.table-content .table1 .ivu-table-cell {
  white-space: nowrap;
}
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
.text-right {
  text-align: right;
}
</style>
