<template>
    <div class="white-bg">
        <Form :label-width="150" class="search-form">
            <Row>
                <Col :sm="8" :xs="24">
                <FormItem label="出库结算单号:">
                    <Input v-model="params.orders"></Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="货物编号:">
                    <Input v-model="params.numbers"></Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="产地:">
                    <Select v-model="params.factory" filterable clearable>
                        <Option v-for="(item,index) in factoryList" :value="item" :key="index">{{ item }}</Option>
                    </Select>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col :sm="8" :xs="24">
                <FormItem label="品名:">
                    <Select v-model="params.breed" filterable clearable>
                        <Option v-for="(item,index) in breedList" :value="item" :key="index">{{ item }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="材质:">
                    <Select v-model="params.material" filterable clearable>
                        <Option v-for="(item,index) in materialList" :value="item" :key="index">{{ item }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="规格:">
                     <Input v-model="params.spec"></Input>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col :sm="24" :xs="24" class="text-right">
                <FormItem>
                    <Button type="primary" @click="search">查询</Button>
                    <Button style="margin-left: 8px" @click="reset">重置</Button>
                </FormItem>
                </Col>
            </Row>
        </Form>
        <Row>
            <Col span="24">
            <div class="pull-right count-content">
                <span class="margin-right-10">货物数量：
                    <b class="tip">233</b> 件</span>
                <span class="margin-right-10">总重量：
                    <b class="tip">300.0000</b> 吨</span>
                <span class="margin-right-10">总金额：
                    <b class="tip">2200.00</b> 元</span>
            </div>
            </Col>
        </Row>
        <Table :columns="tableColumns" :data="tableData" border></Table>
        <div class="page-wrapper">
            <div v-if="this.$store.state.app.screenSize>768">
                <span class="left">共{{total}}条记录 第{{pageNum}}页 / 共{{Math.ceil(total / pageSize)}}页 </span>
                <Page class="pull-right" :current="pageNum" :total="total" :page-size="pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size-opts="pageSizeOpts" show-sizer show-elevator/>
            </div>
            <div v-if="this.$store.state.app.screenSize<=768">
                <Page class="pull-right" :current="pageNum" :page-size="pageSize" :total="total" @on-change="pageChange" simple />
            </div>
        </div>
    </div>

</template>
<script>
import { closeNowTag } from "@/libs/util";
import { getTableData } from "@/api/data";
export default {
    name: "OutstockDetailList",
    data() {
        return {
            params: {
                numbers: "",
                orders: "",
                factory: "",
                breed: "",
                spec: "",
                material: ""
            },
            pageSize: 10,
            pageNum: 1,
            pageSizeOpts: [10, 15, 20, 40, 50, 100],
            total: 100,
            factoryList: ["沙钢", "唐钢"],
            breedList: ["热卷", "冷轧卷"],
            materialList: ["HRB400", "HRB400B"],
            tableData: [
                {
                    col1: "130009922",
                    col2: "AT001",
                    col3: "沙钢",
                    col4: "冷轧卷",
                    col5: "1.0*1250*C",
                    col6: "Q235B",
                    col7: "A区",
                    col8: "A1－1",
                    col9: "3",
                    col10: "7.43",
                    col11: "7.48",
                    col12: "抄码",
                    col13: "20.00",
                    col14: "23.00",
                    col15: "334.00",
                    col16: "453***",
                    col17: "包装完好",
                    col18: "外观完好",
                    col19: "没啥信息"
                },
                {
                    col1: "130009922",
                    col2: "AT001",
                    col3: "沙钢",
                    col4: "冷轧卷",
                    col5: "1.0*1250*C",
                    col6: "Q235B",
                    col7: "A区",
                    col8: "A1－1",
                    col9: "3",
                    col10: "7.43",
                    col11: "7.48",
                    col12: "抄码",
                    col13: "20.00",
                    col14: "23.00",
                    col15: "334.00",
                    col16: "453***",
                    col17: "包装完好",
                    col18: "外观完好",
                    col19: "没啥信息"
                },
                {
                    col1: "130009922",
                    col2: "AT001",
                    col3: "沙钢",
                    col4: "冷轧卷",
                    col5: "1.0*1250*C",
                    col6: "Q235B",
                    col7: "A区",
                    col8: "A1－1",
                    col9: "3",
                    col10: "7.43",
                    col11: "7.48",
                    col12: "抄码",
                    col13: "20.00",
                    col14: "23.00",
                    col15: "334.00",
                    col16: "453***",
                    col17: "包装完好",
                    col18: "外观完好",
                    col19: "没啥信息"
                },
                {
                    col1: "130009922",
                    col2: "AT001",
                    col3: "沙钢",
                    col4: "冷轧卷",
                    col5: "1.0*1250*C",
                    col6: "Q235B",
                    col7: "A区",
                    col8: "A1－1",
                    col9: "3",
                    col10: "7.43",
                    col11: "7.48",
                    col12: "抄码",
                    col13: "20.00",
                    col14: "23.00",
                    col15: "334.00",
                    col16: "453***",
                    col17: "包装完好",
                    col18: "外观完好",
                    col19: "没啥信息"
                },
                {
                    col1: "130009922",
                    col2: "AT001",
                    col3: "沙钢",
                    col4: "冷轧卷",
                    col5: "1.0*1250*C",
                    col6: "Q235B",
                    col7: "A区",
                    col8: "A1－1",
                    col9: "3",
                    col10: "7.43",
                    col11: "7.48",
                    col12: "抄码",
                    col13: "20.00",
                    col14: "23.00",
                    col15: "334.00",
                    col16: "453***",
                    col17: "包装完好",
                    col18: "外观完好",
                    col19: "没啥信息"
                }
            ],
            tableColumns: [
                {
                    title: "出库结算单号",
                    key: "col1",
                    align: "left",
                    minWidth: 110
                },
                {
                    title: "编号",
                    key: "col2",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "产地",
                    key: "col3",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "品名",
                    key: "col4",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "材质",
                    key: "col6",
                    align: "left",
                    minWidth: 100
                },
                {
                    title: "规格",
                    key: "col5",
                    align: "left",
                    minWidth: 110
                },
                {
                    title: "库区",
                    key: "col7",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "库位",
                    key: "col8",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "数量",
                    key: "col9",
                    align: "right",
                    minWidth: 80
                },
                {
                    title: "单件重量",
                    key: "col10",
                    align: "right",
                    minWidth: 80
                },
                {
                    title: "总重量",
                    key: "col11",
                    align: "right",
                    minWidth: 80
                },
                {
                    title: "计重方式",
                    key: "col12",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "出库单价",
                    key: "col13",
                    align: "right",
                    minWidth: 80
                },
                {
                    title: "其他费用",
                    key: "col14",
                    align: "right",
                    minWidth: 80
                },
                {
                    title: "总金额",
                    key: "col15",
                    align: "right",
                    minWidth: 80
                },
                {
                    title: "钢卷号/捆包号",
                    key: "col16",
                    align: "left",
                    minWidth: 120
                },
                {
                    title: "包装",
                    key: "col17",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "外观",
                    key: "col18",
                    align: "left",
                    minWidth: 80
                }
            ]
        };
    },
    mounted() {
        this.getList();
    },
    methods: {
        reset() {
            this.params = {};
        },
        search() {
            this.pageChange(1);
        },
        getList() {
            // getTableData(params).then(res => {
            //     this.tableData = res.data.list;
            //     this.total = res.data.total;
            // });
        },
        backFun() {
            closeNowTag(this.$store.state.app, this.$route);
            this.$router.push({
                path: "OutstockSettlement"
            });
        },
        pageChange(page) {
            this.pageNum = page;
            this.getList();
        },
        pageSizeChange(pagesize) {
            this.pageNum = 1;
            this.pageSize = pagesize;
            this.getList();
        }
    }
};
</script>


