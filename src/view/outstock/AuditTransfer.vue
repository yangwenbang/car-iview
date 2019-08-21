<template>
    <div class="white-bg">
        <div class="table-scrollable left-right-table">
            <table border="1">
                <tbody>
                    <tr>
                        <td class="left-bg">过户单号：</td>
                        <td>{{transferData.transferCode}}</td>
                        <td class="left-bg">过户日期：</td>
                        <td>{{transferData.transferDate}}</td>
                        <td class="left-bg">货物类型：</td>
                        <td>{{transferData.type==0?'原料':transferData.type==1?'成品':'废料'}}</td>
                    </tr>
                    <tr>
                        <td class="left-bg">原货主：</td>
                        <td>{{transferData.oldOwner}}</td>
                        <td class="left-bg">新货主：</td>
                        <td>{{transferData.newOwner}}</td>
                        <td class="left-bg">付款单位：</td>
                        <td>{{transferData.payCustomerName}}</td>
                    </tr>
                    <tr>
                        <td class="left-bg">结算方式：</td>
                        <td>{{transferData.payType==0?'现结':'月结'}}</td>
                        <td class="left-bg">备注</td>
                        <td colspan="3">{{transferData.remark}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <Row class="margin-top-20 margin-bottom-10">
            <Col span="24">
            <div class="pull-left table-title">过户货物明细</div>
            </Col>
        </Row>
        <Table :row-class-name="rowClassName" :columns="tableColumns" :data="tableData" border></Table>
        <div class="text-center margin-top-20">
            <Button class="btn-common-width margin-right-10" type="primary" @click="submitFun">审核</Button>
            <Button class="btn-common-width margin-right-10" @click="cancel">取消</Button>
        </div>
    </div>
</template>
<script>
import { closeNowTag,formatPrice,formatWeight } from "@/libs/util";
import { transferQueryTransfer, transferAuditTransfer } from "@/api/outstock";
export default {
    name: "AuditTransfer",
    data() {
        return {
            transferId: this.$route.query.transferId,
            transferData: {},
            tableData: [],
            tableColumns: [
                {
                    title: "编号",
                    key: "code",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "打包号",
                    key: "packCode",
                    align: "left",
                    minWidth: 120
                },
                {
                    title: "产地",
                    key: "brandName",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "品名",
                    key: "breedName",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "材质",
                    key: "materialName",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "规格",
                    key: "specName",
                    align: "left",
                    minWidth: 120
                },
                {
                    title: "过户数量(件)",
                    key: "number",
                    align: "right",
                    minWidth: 100
                },
                {
                    title: "单件重量(吨)",
                    key: "perAmount",
                    align: "right",
                    minWidth: 100,
                    render: (h, data) => {
                        if(data.row.code != '合计' && data.row.transferPrice != '附加费') {
                            return h('span', formatWeight(data.row.perAmount));
                        }
                    }
                },
                {
                    title: "重量(吨)",
                    key: "weight",
                    align: "right",
                    minWidth: 80,
                    render: (h, data) => {
                        if(data.row.transferPrice != '附加费') {
                            return h('span', formatWeight(data.row.weight));
                        }
                    }
                },
                {
                    title: "计重方式",
                    key: "weightType",
                    align: "right",
                    minWidth: 80,
                    render: (h, data) => {
                        var name = '';
                        switch(data.row.weightType) {
                            case 0: name = '抄码'; break;
                            case 1: name = '过磅'; break;
                            case 2: name = '理计'; break;
                        }
                        return h('span',name);
                    }
                },
                {
                    title: "单价(元/吨)",
                    key: "transferPrice",
                    align: "right",
                    minWidth: 100,
                    render: (h, data) => {
                        if(data.row.code != '合计' && data.row.transferPrice != '附加费') {
                            return h('span', formatPrice(data.row.transferPrice));
                        } 
                        if(data.row.transferPrice == '附加费') {
                            return h('span', data.row.transferPrice);
                        }
                    }
                },
                {
                    title: "金额(元)",
                    key: "transferFee",
                    align: "right",
                    minWidth: 120,
                    render: (h, data) => {
                        return h('span', formatPrice(data.row.transferFee));
                    }
                },
                {
                    title: "库区",
                    key: "storageArea",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "库位",
                    key: "storagePlace",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "包装",
                    key: "wrap",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "外观",
                    key: "appearance",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "钢卷号/捆包号",
                    key: "baleNumber",
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
        rowClassName (row, index) {
            if(row.code == '合计'){
                return 'table-info-row2';
            }
            return '';
        },
        getList() {
            transferQueryTransfer({transferId: this.transferId}).then(res => {
                if(res.data.code == "200") {
                    let data = res.data.data;
                    this.transferData = data;
                    this.tableData = data.transferItemList?data.transferItemList:[];
                    if(this.tableData.length > 0) {
                        this.tableData.push({
                            transferPrice:'附加费',
                            transferFee: data.otherFee
                        },{
                            code: '合计',
                            number: data.transferNumber,
                            weight: data.transferWeight,
                            transferFee: data.sumFee
                        })
                    }
                }else {
                    this.$Message.error(res.data.msg);
                }
            })
        },
        submitFun() {
            this.$Modal.confirm({
                title: "提示",
                content: "请确认是否提交审核结果？",
                onOk: () => {
                    transferAuditTransfer({transferId:this.transferData.id}).then(res => {
                        if(res.data.code == "200") {
                            this.$Message.success('审核成功！');
                            setTimeout(() => {
                                closeNowTag(this.$store.state.app, this.$route);
                                this.$router.push({
                                    path: "TransferManage"
                                });
                            },500)
                        }else {
                            this.$Message.error(res.data.msg);
                        }
                    })
                },
                onCancel: () => {
               
                }
            });
        },
        cancel() {
            this.$Modal.confirm({
                title: '提示',
                content: '<p>请确认是否取消?</p>',
                onOk: () => {
                    closeNowTag(this.$store.state.app, this.$route);
                    this.$router.push({
                        name: 'TransferManage'
                    })
                },
                onCancel: () => {

                }
            });
        },
    }
};
</script>


