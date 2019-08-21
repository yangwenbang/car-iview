<template>
    <!-- 撤销加工，开始加工加工信息 -->
    <Row :gutter="10">
        <Col span="24">
            <div class="table-title margin-top-20 margin-bottom-10">加工信息</div>
        </Col>
        <Col span="24">
            <Table v-if="processType == '纵剪'" :row-class-name="rowClassName" :columns="tableColumns1" :data="tableData1" border></Table>
            <Table v-if="processType == '开平'" :row-class-name="rowClassName" :columns="tableColumns3" :data="tableData1" border></Table>
        </Col>
    </Row>
</template>

<script>
import { formatWeight, formatPrice } from "@/libs/util";
import InlayTableHeader from './InlayTableHeader';
export default {
    name: "ProcessMessageTable",
    components: {
        InlayTableHeader
    },
    props: {
        type: String,
        data: Array
    },
    data() {
        return {
            processType: this.type,
            tableData1: this.data,
            tableColumns1: [
                {
                    title: '母卷信息',
                    align: 'center',
                    children: [
                        {
                            title: "编号",
                            key: "inventoryCode",
                            align: "left",
                            minWidth: 80,
                            render: (h, params) => {
                                if(params.row.inventoryCode == '合计') {
                                    return h('b', params.row.inventoryCode)
                                } else {
                                    return h('span', params.row.inventoryCode)
                                }
                                
                            }
                        },
                        {
                            title: "母卷信息",
                            key: "",
                            align: "left",
                            minWidth: 200,
                            render: (h, params) => {
                                if(params.row.inventoryCode != '合计') {
                                    return h('div',[
                                        h('div','钢卷号/捆包号：'+params.row.baleNumber),
                                        h('div','产地：'+params.row.brandName),
                                        h('div','品名：'+params.row.breedName),
                                        h('div','材质：'+params.row.materialName),
                                        h('div','库区库位：'+params.row.storagePlace+' '+params.row.storageArea),
                                        h('div','包装：'+params.row.wrap)
                                    ])
                                }
                            }
                        },
                        {
                            title: "规格",
                            key: "specName",
                            align: "left",
                            minWidth: 100,
                            render: (h, params) => {
                                return h('span',{
                                    class: 'color-red'
                                }, params.row.specName)
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
                            minWidth: 120,
                            render: (h, params) => {
                                return h('span', formatWeight(params.row.processWeight))
                            }
                        },
                        {
                            title: "分段",
                            key: "sectionNumber",
                            align: "right",
                            minWidth: 120
                        }
                    ]
                },
                {
                  title: '加工信息',
                  align: 'center',
                  children: [
                      {
                        title: '加工信息',
                        align: 'center',
                        width: 500,
                        renderHeader: (h, params) => {
                            return h(InlayTableHeader,{
                                props: {
                                    columns: this.tableColumns2
                                }
                            })
                        },
                        render: (h, params) => {
                            return h('Table',{
                                props: {
                                    showHeader: false,
                                    columns: this.tableColumns2,
                                    data: params.row.processProducts
                                }
                            })
                        }
                      }
                  ]
                }
            ],
            tableColumns2: [{
                    title: "加工宽度(mm)",
                    key: "specWidth",
                    align: "right",
                    width: 120
                },
                {
                    title: "加工数量(条)",
                    key: "number",
                    align: "right",
                    width: 120
                },
                {
                    title: "理重(吨)",
                    key: "weight",
                    align: "right",
                    width: 120,
                    render: (h, params) => {
                        return h('span', formatWeight(params.row.weight))
                    }
                },
                {
                    title: "打包号",
                    key: "packCode",
                    align: "left",
                    width: 120,
                    render: (h, params) => {
                        if(params.row.packCode) {
                            return h('span', params.row.packCode);
                        } else {
                            return h('span', '未打包')
                        }
                    }
                }
            ],
            tableColumns3: [
                {
                    title: '母卷信息',
                    align: 'center',
                    children: [
                        {
                            title: "编号",
                            key: "inventoryCode",
                            align: "left",
                            minWidth: 80,
                            render: (h, params) => {
                                if(params.row.inventoryCode == '合计') {
                                    return h('b', params.row.inventoryCode)
                                } else {
                                    return h('span', params.row.inventoryCode)
                                }
                                
                            }
                        },
                        {
                            title: "母卷信息",
                            key: "",
                            align: "left",
                            minWidth: 200,
                            render: (h, params) => {
                                if(params.row.inventoryCode != '合计') {
                                    return h('div',[
                                        h('div','钢卷号/捆包号：'+params.row.baleNumber),
                                        h('div','产地：'+params.row.brandName),
                                        h('div','品名：'+params.row.breedName),
                                        h('div','材质：'+params.row.materialName),
                                        h('div','库区库位：'+params.row.storageArea+' '+params.row.storagePlace),
                                        h('div','包装：'+params.row.wrap)
                                    ])
                                }
                            }
                        },
                        {
                            title: "规格",
                            key: "specName",
                            align: "left",
                            minWidth: 100,
                            render: (h, params) => {
                                return h('span',{
                                    class: 'color-red'
                                }, params.row.specName)
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
                            minWidth: 120,
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
                        title: '加工信息',
                        align: 'center',
                        width: 500,
                        renderHeader: (h, params) => {
                            return h(InlayTableHeader,{
                                props: {
                                    columns: this.tableColumns4
                                }
                            })
                        },
                        render: (h, params) => {
                            return h('Table',{
                                props: {
                                    showHeader: false,
                                    columns: this.tableColumns4,
                                    data: params.row.processProducts
                                }
                            })
                        }
                      }
                  ]
                }
            ],
            tableColumns4: [{
                    title: "加工长度(mm)",
                    key: "specWidth",
                    align: "right",
                    width: 120
                },
                {
                    title: "加工数量(张)",
                    key: "number",
                    align: "right",
                    width: 120
                },
                {
                    title: "理重(吨)",
                    key: "weight",
                    align: "right",
                    width: 120,
                    render: (h, params) => {
                        return h('span', formatWeight(params.row.weight))
                    }
                },
                {
                    title: "打包号",
                    key: "packCode",
                    align: "left",
                    width: 120,
                    render: (h, params) => {
                        if(params.row.packCode) {
                            return h('span', params.row.packCode);
                        } else {
                            return h('span', '未打包')
                        }
                    }
                }
            ]
        };
    },
    watch: {
        data:{
            handler(newVal, oldVal) {
                this.tableData1 = newVal;
            },
            deep: true
        },
        type(newVal, oldVal) {
            this.processType = newVal;
        }
    },
    methods: {
        rowClassName (row, index) {
            if(row.inventoryCode == '合计'){
                return 'table-info-row2';
            }
            return '';
        },
        getData() {
            if(this.tableData1.length > 0) {
                let tempObj = {
                    inventoryCode: '合计',
                    number: 0,
                    weight: 0,
                    processWeight: 0,
                    processProducts: [{
                        number: 0,
                        weight: 0
                    }]
                }
                this.tableData1.map((o, i) => {
                    tempObj.number += Number(o.number);
                    tempObj.weight += Number(o.weight);
                    tempObj.processWeight += Number(o.processWeight);
                    o.processProducts.map(o1 => {
                        tempObj.processProducts[0].number += Number(o1.number);
                        tempObj.processProducts[0].weight += Number(o1.weight);
                    })
                })
                this.tableData1.push(tempObj)
            }
        }
        
    },
    mounted() {
        this.getData();
    }
};
</script>
