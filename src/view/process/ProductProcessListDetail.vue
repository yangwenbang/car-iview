<template>
    <Row type="flex" justify="center" class="white-bg">
        <Col :xs="24" :sm="24" :md="24">
        <div class="table-scrollable left-right-table">
            <table border="1">
                <tbody>
                    <tr>
                        <td class="left-bg">加工单号：</td>
                        <td>{{formValidate.processCode}}</td>
                        <td class="left-bg">货主：</td>
                        <td>{{formValidate.ownerName}}</td>
                        <td class="left-bg">交货日期：</td>
                        <td>{{formValidate.expectDeliverTime}}</td>
                    </tr>
                    <tr>
                        <td class="left-bg">加工机组：</td>
                        <td>{{formValidate.deviceName}}</td>
                        <td class="left-bg">加工方式：</td>
                        <td>{{typeName}}</td>
                        <td class="left-bg">制单日期：</td>
                        <td>{{formValidate.createTime}}</td>
                    </tr>
                    <tr>
                        <td class="left-bg">制单人：</td>
                        <td>{{formValidate.creator}}</td>
                        <td class="left-bg">开始加工时间：</td>
                        <td>{{formValidate.startProcessTime}}</td>
                        <td class="left-bg">加工完成时间：</td>
                        <td>{{formValidate.confirmTime}}</td>
                    </tr>
                    <tr>
                        <td class="left-bg">加工要求描述：</td>
                        <td colspan="5">{{formValidate.processDemand}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <Row :gutter="10">
            <Col span="24" class="margin-top-20 margin-bottom-10">
                <div class="pull-left table-title">出库信息（原材信息）</div>
            </Col>
            <Col span="24">
                <Table :columns="tableColumns1" :data="tableData1" border></Table>
            </Col>
            <Col span="24">
                <div class="table-title margin-top-20 margin-bottom-10">入库信息（加工成品和原卷）</div>
            </Col>
            <Col span="24">
                 <Table :columns="tableColumns2" :data="tableData2" border></Table>
            </Col>
        </Row>
        </Col>
        <div class="text-center margin-top-10">
            <Button class="btn-common-width margin-right-10" type="info" @click="printFun">打印</Button>
            <Button class="btn-common-width" @click="backFun">关闭</Button>
        </div>
    </Row>
</template>

<script>
import { closeNowTag, formatWeight, formatPrice, isAcrobatPluginInstall} from "@/libs/util";
import InlayTableHeader from './components/InlayTableHeader';
import { InventoryProcessProduceProcessInfo } from '@/api/process';
export default {
    name: "ProductProcessListDetail",
    components: {
        InlayTableHeader
    },
    data() {
        return {
            formValidate: {
                processCode: '',
                expectDeliverTime: '',
                deviceName: '',
                processType: '',
                createTime: '',
                creator: '',
                startProcessTime: '',
                confirmTime: '',
                processDemand: ''
            },
            typeName: '',
            processId: this.$route.query.processId,
            tableData1:this.tableData,
            tableData2: [],
            tableColumns1: [
                {
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
                    title: "计重方式",
                    key: "weightType",
                    minWidth: 120,
                    render: (h, params) => {
                        let name = '';
                        switch(params.row.weightType) {
                            case 0: name = '抄码'; break;
                            case 1: name = '过磅'; break;
                            case 2: name = '理计'; break;
                        }
                        return h('span',name)
                    }
                },{
                    title: "用料(吨)",
                    key: "processWeight",
                    align: "right",
                    minWidth: 120,
                    render: (h, params) => {
                        return h('span',formatWeight(params.row.processWeight))
                    }
                }
            ],
            tableColumns2: [
                {
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
                    title: "编号",
                    key: "code",
                    align: "left",
                    minWidth: 120
                },
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
                    title: "计重方式",
                    key: "weightType",
                    minWidth: 120,
                    render: (h, params) => {
                        let name = '';
                        switch(params.row.weightType) {
                            case 0: name = '抄码'; break;
                            case 1: name = '过磅'; break;
                            case 2: name = '理计'; break;
                        }
                        return h('span',name)
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
    methods: {
        printFun(){
             var result = isAcrobatPluginInstall();
             if(result){
                  window.open("/api/pwms/inventory/process/printProcessProduct?processId=" + this.$route.query.processId)
             }
        },
        getTypeName(code) {
            let name = '';
            switch(code) {
                case 0: name = '开平'; break;
                case 1: name = '纵剪'; break;
                case 2: name = '纵剪+开平'; break;
            }
            return name;
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
                path: "ProductProcessList"
            });
        },
        getData() {
            InventoryProcessProduceProcessInfo({
                processId: this.processId,
                notDisplayVolume: 0
            }).then(res => {
                if(res.data.code == '200') {
                    const data = res.data.data;
                    this.formValidate = data;
                    this.typeName = this.getTypeName(data.processType);
                    if(data.processType == 1 && this.tableColumns1[this.tableColumns1.length-1].title !="分段") {
                        this.tableColumns1.push({
                            title: "分段",
                            key: "sectionNumber",
                            align: "right",
                            minWidth: 120
                        })
                    }
                    this.tableData1 = data.processMaterials ? data.processMaterials : [];
                    this.tableData2 = [];
                    this.tableData1.map((o, i) => {
                        o.processProducts.map(o1 => {
                            this.tableData2.push(o1)
                        })
                    })
                }
            })
        }
    },
    activated() {
        this.getData();
    }
};
</script>

<style lang="less" scoped>
.table-scrollable {
    height: auto;
}
</style>
