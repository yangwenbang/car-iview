<template>
    <Modal v-model="modal" title="结算单收款" width="70%" @on-ok="doOk" @on-cancel="doCancel">
        <Table :columns="tableColumns" :data="tableData" border>
        </Table>
    </Modal>
</template>
<script>
import { OutSettleDetail,OutSettleCollect } from "@/api/outstock";
import { formatPrice } from "@/libs/util";
export default {
    name: "ReceiveOrder",
    props: {
        showModal: Boolean,
        settleId: Number
    },
    data() {
        return {
            modal: this.showModal,
            tableColumns: [
                {
                    title: "业务单号",
                    key: "outSettleCode",
                    align: "left",
                    minWidth: 100
                },
                {
                    title: "货主",
                    key: "ownerName",
                    align: "left",
                    minWidth: 100
                },
                {
                    title: "结算客户",
                    key: "settleCustomerName",
                    align: "left",
                    minWidth: 100
                },
                {
                    title: "出库费用(元)",
                    key: "outPrice",
                    align: "right",
                    minWidth: 100,
                    render: (h, data) => {
                        return h("span",formatPrice(data.row.outPrice));
                    }
                },
                {
                    title: "其他费用(元)",
                    key: "otherPrice",
                    align: "right",
                    minWidth: 100,
                    render: (h, data) => {
                        return h("span",formatPrice(data.row.otherPrice));
                    }
                },
                {
                    title: "附加费(元)",
                    key: "extraCharge",
                    align: "right",
                    minWidth: 100,
                    render: (h, data) => {
                        return h("span",formatPrice(data.row.extraCharge));
                    }
                },
                {
                    title: "打包费(元)",
                    key: "packageCharge",
                    align: "right",
                    minWidth: 100,
                    render: (h, data) => {
                        return h("span",formatPrice(data.row.packageCharge));
                    }
                },
                {
                    title: "合计",
                    key: "amountTotal",
                    align: "right",
                    minWidth: 100,
                    render: (h, data) => {
                        return h("span",formatPrice(data.row.amountTotal));
                    }
                }
            ],
            tableData: []
        };
    },
    mounted() {
    },
    methods: {
        getList() {
            OutSettleDetail({
                id: this.settleId
            }).then(res => {
                if(res.data.code=="200"){
                    var data = res.data.data;
                    if(data){
                        var totalOutPrice = 0,totalOtherPrice = 0;
                        for(let i=0;i<data.itemList.length;i++){
                            totalOutPrice+=Number(data.itemList[i].outAmount);
                            totalOtherPrice+=Number(data.itemList[i].otherCharge);
                        }
                        this.tableData = [{
                            outSettleCode: data.outSettleCode,
                            ownerName: data.ownerName,
                            settleCustomerName: data.settleCustomerName,
                            outPrice: totalOutPrice,
                            otherPrice: totalOtherPrice,
                            extraCharge: data.extraCharge,
                            packageCharge: data.packageCharge,
                            amountTotal: data.amountTotal
                        }];
                    }
                    
                }
            });
        },
        doOk(){
            OutSettleCollect({
                id: this.settleId
            }).then(res => {
                console.log(res)
                if(res.data.code=='200'){
                     this.$Message.success("收款成功！");
                }else{
                    this.$Message.error(res.data.msg);
                }
                this.$emit("hide-modal",true);//参数true是用来判断是点击了取消还是确认
            });
        },
        doCancel(){
            this.$emit("hide-modal");
        }
    },
    watch: {
        showModal(newVal, oldVal) {
            this.modal = newVal;
        },
        settleId(newVal, oldVal){
            this.settleId = newVal;
        }
    }
};
</script>


