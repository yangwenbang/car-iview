<template>
    <div class="">
        <Form :label-width="150" class="search-form">
            <Row type="flex" justify="space-between">
                <Col :sm="8" :xs="24">
                <FormItem label="编号:">
                    <Input v-model="params.numbers"></Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="产地:">
                    <Input v-model="params.origin"></Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="品名:">
                    <Input v-model="params.breed"></Input>
                </FormItem>
                </Col>
            </Row>
            <Row type="flex" justify="space-between">
                <Col :sm="8" :xs="24">
                <FormItem label="规格:">
                    <Input v-model="params.spec"></Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="材质:">
                    <Input v-model="params.material"></Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="库区:">
                    <Input v-model="params.area"></Input>
                </FormItem>
                </Col>
            </Row>
            <Row type="flex" justify="space-between">
                <Col :sm="24" :xs="24" class="text-right">
                <FormItem>
                    <Button type="primary" @click="search">查询</Button>
                    <Button style="margin-left: 8px" @click="reset">重置</Button>
                </FormItem>
                </Col>
            </Row>
        </Form>
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
export default {
    name: "OutGoods",
    data() {
        return {
            params: {
                numbers: "",
                shipper: "",
                warehousename: "",
                dateTime:"",
                origin: "",
                breed: "",
                spec: "",
                material: "",
                area: ""
            },
            pageSize: 10,
            pageNum: 1,
            pageSizeOpts: [10, 15, 20, 40, 50, 100],
            total: 100,
            tableData: [
                {
                    a: "AA0001",
                    d: "沙钢",
                    e: "带钢",
                    f: "3.5*203",
                    g: "Q235B",
                    h: "1",
                    i: "0.5",
                    j: "0.7",
                    m: "",
                    n: "",
                    o: "",
                    p: "",
                    q: "",
                    r: ""
                },
                {
                    a: "AA0002",
                    d: "沙钢",
                    e: "带钢",
                    f: "3.5*203",
                    g: "Q235B",
                    h: "1",
                    i: "0.5",
                    j: "0.7",
                    m: "",
                    n: "",
                    o: "",
                    p: "",
                    q: "",
                    r: ""
                }
            ],
            tableColumns: [
                {
                    type: "selection",
                    width: 40,
                    align: "center"
                },
                {
                    title: "编号",
                    key: "a",
                    align: "left",
                    minWidth: 80,
                },
                {
                    title: "产地",
                    key: "d",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "品名",
                    key: "e",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "规格",
                    key: "f",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "材质",
                    key: "g",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "数量",
                    key: "h",
                    align: "right",
                    minWidth: 80
                },
                {
                    title: "单件重量",
                    key: "i",
                    align: "right",
                    minWidth: 80
                },
                {
                    title: "总重量",
                    key: "j",
                    align: "right",
                    minWidth: 80
                },
                {
                    title: "库区",
                    key: "m",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "库位",
                    key: "n",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "包装",
                    key: "o",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "外观",
                    key: "p",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "钢卷号/捆包号",
                    key: "q",
                    align: "left",
                    minWidth: 120
                },
                {
                    title: "其他信息",
                    key: "r",
                    tooltip: true,
                    ellipsis: true,
                    align: "left",
                    minWidth: 100,
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


