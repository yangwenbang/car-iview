<template>
    <div class="white-bg">
        <Tabs type="card" v-model="tabName">
            <TabPane label="库存明细" name="库存明细"><storage-detail></storage-detail></TabPane>
            <TabPane label="库存汇总" name="库存汇总"><storage-summary v-on:summary-submit="tabChange"></storage-summary></TabPane>
        </Tabs>
    </div>

</template>
<script>
// import { getTableData } from '@/api/data'
import StorageDetail from './components/StorageDetail'
import StorageSummary from './components/StorageSummary'

export default {
    name: "StorageManage",
    components: { StorageDetail,StorageSummary },
    data() {
        return {
            tabName:"库存明细"
        };
    },
    mounted () {
    },
    methods: {
        tabChange: function (param){
            this.tabName = "库存明细"
        }
    }
};
</script>



