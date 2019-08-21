
<template>
    <!-- 加工完成，成品入库 -->
    <Row :gutter="10">
        <Col span="24">
            <div class="table-title margin-top-20 margin-bottom-10">出库信息</div>
        </Col>
        <Col span="24">
            <Table :columns="tableColumns1" :data="tableData1" border></Table>
        </Col>
        <Col span="24">
            <div class="table-title margin-top-20 margin-bottom-10">入库信息</div>
        </Col>
        <Col span="24">
            <Table :columns="tableColumns2" :data="tableData2" border></Table>
        </Col>
    </Row>
</template>

<script>
import { formatWeight } from "@/libs/filters";
export default {
    name: "GoodsWarehousing",
    props: {
        tableData: Array,
        type: String
    },
    data() {
        return {
            typeName: this.type,
            tableData1:this.tableData,
            tableData2: [],
            tableColumns1: [{
                    title: "货物类型",
                    key: "goodsType",
                    align: "left",
                    minWidth: 120,
                    render: (h, params) => {
                        let name = '';
                        if(params.row.goodsType == 0) {
                            name = '原料'
                        } else if(params.row.goodsType == 1) {
                            name = '成品'
                        }
                        return h('span', name)
                    }
                },{
                    title: "材料类型",
                    key: "inventoryType",
                    align: "left",
                    minWidth: 120,
                    render: (h, params) => {
                        let name = '';
                        switch(params.row.inventoryType) {
                            case 0: name = '原材'; break;
                            case 1: name = '余卷'; break;
                            case 2: name = '分条料'; break;
                            case 3: name = '开平板'; break;
                            case 4: name = '头尾板'; break;
                            case 5: name = '边丝'; break;
                        }
                        return h('span', name)
                    }
                },{
                    title: "编号",
                    key: "inventoryCode",
                    align: "left",
                    minWidth: 120
                },{
                    title: "钢卷号/捆包号",
                    key: "baleNumber",
                    align: "left",
                    minWidth: 120
                },{
                    title: "产地",
                    key: "brandName",
                    align: "left",
                    minWidth: 120
                },{
                    title: "品名",
                    key: "breedName",
                    align: "left",
                    minWidth: 120
                },{
                    title: "材质",
                    key: "materialName",
                    align: "left",
                    minWidth: 120
                },{
                    title: "规格",
                    key: "specName",
                    align: "left",
                    minWidth: 120
                },{
                    title: "数量",
                    key: "number",
                    align: "right",
                    minWidth: 120
                },{
                    title: "重量(吨)",
                    key: "weight",
                    align: "right",
                    minWidth: 120,
                    render: (h, params) => {
                        return h('span',formatWeight(params.row.weight))
                    }
                },{
                    title: "库区",
                    key: "storageArea",
                    align: "left",
                    minWidth: 120
                },{
                    title: "库位",
                    key: "storagePlace",
                    align: "left",
                    minWidth: 120
                },
            ],
            tableColumns2: [
                {
                    title: "打包号",
                    key: "packCode",
                    align: "left",
                    minWidth: 120,
                    render: (h, params) => {
                        if(params.row.packCode) {
                            return h('span', params.row.packCode);
                        } else {
                            return h('span', '未打包')
                        }
                    }
                },{
                    title: "货物类型",
                    key: "type",
                    align: "left",
                    minWidth: 120,
                    render: (h, params) => {
                        let name = '';
                        if(params.row.type == 0) {
                            name = '原料';
                        } else if(params.row.type == 1) {
                            name = '成品';
                        } else if(params.row.type == 2) {
                            name = '废料';
                        }
                        return h('span', name)
                    }
                },
                {
                    title: "材料类型",
                    key: "inventoryType",
                    align: "left",
                    minWidth: 120,
                    render: (h, params) => {
                        let name = '';
                        switch(params.row.inventoryType) {
                            case 0: name = '原材'; break;
                            case 1: name = '余卷'; break;
                            case 2: name = '分条料'; break;
                            case 3: name = '开平板'; break;
                            case 4: name = '头尾板'; break;
                            case 5: name = '边丝'; break;
                        }
                        return h('span', name)
                    }
                },
                {
                    title: "产地",
                    key: "brandName",
                    align: "left",
                    minWidth: 120
                },
                {
                    title: "品名",
                    key: "breedName",
                    align: "left",
                    minWidth: 120
                },
                {
                    title: "材质",
                    key: "materialName",
                    align: "left",
                    minWidth: 120
                },
                {
                    title: "规格",
                    key: "specName",
                    align: "left",
                    minWidth: 120
                },
                {
                    title: "数量",
                    key: "realNumber",
                    align: "right",
                    minWidth: 120
                },
                {
                    title: "单件重量(吨)",
                    key: "perWeight",
                    align: "right",
                    minWidth: 120,
                    render: (h, params) => {
                        return h('span',formatWeight(params.row.perWeight))
                    }
                },
                {
                    title: "总重量(吨)",
                    key: "weight",
                    align: "right",
                    minWidth: 120,
                    render: (h, params) => {
                        return h('span',formatWeight(params.row.weight))
                    }
                },
                {
                    title: "库区",
                    key: "storageArea",
                    align: "left",
                    minWidth: 120
                },
                {
                    title: "库位",
                    key: "storagePlace",
                    align: "left",
                    minWidth: 120
                }
            ]
        };
    },
    watch: {
        tableData: {
            handler(newVal, oldVal) {
                this.tableData1 = newVal;
                this.tableData2 = [];
                newVal.map(o => {
                    o.processProducts.map(o1 => {
                        this.tableData2.push(o1);
                    })
                })
            },
            deep: true
        },
        type(newVal, oldVal) {
            this.typeName = newVal;
        }
    },
    methods: {
    }
};
</script>
