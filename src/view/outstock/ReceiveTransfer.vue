<template>
    <div class="white-bg">
        <Row class="margin-bottom-10">
            <Col span="24">
            <div class="pull-left table-title">过户单</div>
            </Col>
        </Row>
        <div class="table-scrollable left-right-table">
            <table border="1">
                <tbody>
                    <tr>
                        <td class="left-bg">过户单号：</td>
                        <td>{{formData.transferCode}}</td>
                        <td class="left-bg">过户费：</td>
                        <td>{{formData.transferFee|formatPrice}}</td>
                        <td class="left-bg">附加费：</td>
                        <td>{{formData.otherFee|formatPrice}}</td>
                    </tr>
                    <tr>
                        <td class="left-bg">合计金额：</td>
                        <td>{{formData.sumFee|formatPrice}}</td>
                        <td class="left-bg"></td>
                        <td></td>
                        <td class="left-bg"></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colspan="6">
                            <Form :label-width="150" class="search-form" ref="formValidate" :model="formData" :rules="ruleValidate">
                                <Row class="margin-top-15 margin-bottom-10">
                                    <Col :sm="8" :xs="8">
                                    <FormItem label="付款单位:" prop="payCustomerId">
                                        <Select v-model="formData.payCustomerId" :transfer="true" filterable clearable label-in-value @on-change="changePay">
                                            <Option v-for="(item,index) in ownerList" :value="item.value" :key="index">{{ item.label }}</Option>
                                        </Select>
                                    </FormItem>
                                    </Col>
                                </Row>
                            </Form>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="text-center margin-top-20">
            <Button class="btn-common-width margin-right-10" type="primary" @click="submitFun">收款</Button>
            <Button class="btn-common-width margin-right-10" @click="cancel">取消</Button>
        </div>
    </div>
</template>
<script>
import { closeNowTag,formatPrice,formatWeight } from "@/libs/util";
import { transferTransferPayment, transferInvokeTransferPayment } from "@/api/outstock";
export default {
    name: "ReceiveTransfer",
    data() {
        return {
            transferId: this.$route.query.transferId,
            formData: {},
            ownerList: [],
            ruleValidate:{
                payCustomerId: [
                    {
                        required: true,
                        message: "请选择付款单位",
                        trigger: "change",
                        type: 'number'
                    }
                ]
            }
        };
    },
    mounted() {
        this.getData();
    },
    methods: {
        getData() {
            transferTransferPayment({transferId: this.transferId}).then(res => {
                if(res.data.code == '200') {
                    this.formData = res.data.data;
                    if(this.formData.newOwnerId) {
                        this.ownerList.push({
                            value: this.formData.newOwnerId,
                            label: this.formData.newOwner
                        })
                    }
                    if(this.formData.oldOwnerId) {
                        this.ownerList.push({
                            value: this.formData.oldOwnerId,
                            label: this.formData.oldOwner
                        })
                    }
                }else {
                    this.$Message.error(res.data.msg);
                }
            })
        },
        changePay(e) {
            if(e) {
                this.formData.payCustomerName = e.label;
            } else {
                this.formData.payCustomerName = ''; 
            }
        },
        submitFun() {
             this.$refs.formValidate.validate(valid => {
                 if(valid) {
                     this.$Modal.confirm({
                        title: "提示",
                        content: "请确认是否提交收款信息？",
                        onOk: () => {
                            let param = {
                                transferId: this.transferId,
                                payCustomerId: this.formData.payCustomerId,
                                payCustomerName: this.formData.payCustomerName
                            }
                            transferInvokeTransferPayment(param).then(res => {
                                if(res.data.code == '200') {
                                    this.$Message.success('收款成功');
                                    setTimeout(() => {
                                        closeNowTag(this.$store.state.app, this.$route);
                                        this.$router.push({
                                            path: "TransferManage"
                                        });
                                    },500)
                                    
                                } else {
                                    this.$Message.error(res.data.msg);
                                }
                            })
                        },
                        onCancel: () => {
                    
                        }
                    });
                 }
             })
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
<style lang="less" scoped>
.f14 {font-size: 14px !important; line-height: 34px!important;}
</style>




