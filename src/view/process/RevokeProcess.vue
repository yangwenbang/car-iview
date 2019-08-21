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
                        <td class="left-bg"></td>
                        <td colspan="3"></td>
                    </tr>
                    <tr>
                        <td class="left-bg">加工要求描述：</td>
                        <td colspan="5">{{formValidate.processDemand}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <ProcessMessageTable :type="typeName" :data="tableData"></ProcessMessageTable>
        </Col>
        <div class="text-center margin-top-10">
            <Button class="btn-common-width margin-right-10" type="primary" @click="revokeProcess">撤销加工</Button>
            <Button class="btn-common-width margin-right-10" @click="cancel">取消</Button>
        </div>
    </Row>
</template>
<script>
import { closeNowTag } from "@/libs/util";
import InlayTableHeader from './components/InlayTableHeader';
import ProcessMessageTable from './components/ProcessMessageTable';
import { InventoryProcessRevokeProcess, InventoryProcessProduceProcessInfo } from '@/api/process';
export default {
    name: "RevokeProcess",
    components: {
        InlayTableHeader,
        ProcessMessageTable
    },
    data() {
        return {
            formValidate: {
                processCode: '',
                expectDeliverTime: '',
                deviceName: '',
                processType: this.$route.query.type,
                createTime: '',
                creator: '',
                startProcessTime: '',
                processDemand: ''
            },
            typeName: '开平',
            processId: this.$route.query.processId,
            tableData:[],
        };
    },
    methods: {
        getTypeName(code) {
            let name = '';
            switch(code) {
                case 0: name = '开平'; break;
                case 1: name = '纵剪'; break;
                case 2: name = '纵剪+开平'; break;
            }
            return name;
        },
        revokeProcess() {
            this.$Modal.confirm({
                title: '信息确认',
                content: '<p>是否撤销本次加工?</p>',
                onOk: () => {
                    closeNowTag(this.$store.state.app, this.$route);
                    InventoryProcessRevokeProcess({
                        processId: this.processId
                    }).then(res => {
                        if(res.data.code == '200') {
                            closeNowTag(this.$store.state.app, this.$route);
                            this.$router.push({
                                name: 'ProductProcessList'
                            })
                        } else {
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
                        name: 'ProductProcessList'
                    })
                },
                onCancel: () => {

                }
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
                    this.typeName = this.getTypeName(data.processType)
                    this.tableData = data.processMaterials ? data.processMaterials : [];
                }
            })
        },
    },
    mounted() {
        this.getData();
    }
};
</script>

<style lang="less" scoped>
.table-scrollable {
    height: auto;
}
</style>
