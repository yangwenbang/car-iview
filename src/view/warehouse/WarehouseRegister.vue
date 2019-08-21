<template>
    <div class="white-bg">
        <Form :label-width="150" class="search-form">
            <Row type="flex" justify="space-between">
                <Col :sm="8" :xs="24">
                <FormItem label="入库日期:">
                    <DatePicker v-model="inputDate" format="yyyy/MM/dd" type="daterange" placement="bottom-start" placeholder="请选择日期" style="width:100%;"></DatePicker>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="入库单号:">
                    <Input v-model="params.inCode"></Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="货主通知单号:">
                    <Input v-model="params.ownerNoticeCode"></Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="货主:">
                    <Select filterable clearable v-model="params.ownerId">
                        <Option v-for="(item,index) in ownnerList" :value="item.id" :key="index">{{ item.customerName }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="状态:">
                    <Select v-model="params.status" clearable placeholder="全部">
                        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24" class="text-right">
                <FormItem>
                    <Button type="primary" @click="search">搜索</Button>
                    <Button style="margin-left: 8px" @click="reset">重置</Button>
                </FormItem>
                </Col>
            </Row>
        </Form>
        <Row>
            <Col span="24">
                <router-link to='WarehouseRegisterAdd' >
                    <Button type="primary" class="margin-bottom-10">新增入库</Button>
                </router-link>
                <router-link to='WarehouseDetailList' >
                    <Button type="info" class="margin-bottom-10 margin-left-10">入库明细列表</Button>
                </router-link>
                <Button type="default" class="margin-bottom-10 margin-left-10" @click="bulkDel">批量删除</Button>
                <!-- <div class="pull-right count-content"><span class="margin-right-10">货物数量：<b class="tip">16</b> 件</span> <span>总重量：<b class="tip">776.8750</b> 吨</span></div> -->
            </Col>
        </Row>
        <Table ref="selection" :row-class-name="rowClassName" :columns="tableColumns" :data="tableData" border @on-selection-change="getSelected"></Table>
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
import { commonQueryOwners } from '@/api/common'
import { InventoryInQueryEnterList,InventoryInDeleteInEnter } from '@/api/warehouse'
import { formatDate } from "@/libs/util";
export default {
    name: "WarehouseRegister",
    data() {
        return {
            inputDate:[],
            params: {
                inCode: "",
                ownerId:"",
                status: "",
                ownerNoticeCode:""
            },
            searchParams: {
                startTime:"",
                endTime:"",
                inCode: "",
                ownerId:"",
                status: "",
                ownerNoticeCode:""
            },
            pageSize: 10,
            pageNum: 1,
            pageSizeOpts: [10, 15, 20, 40, 50, 100],
            total: 0,
            ownnerList:[],
            statusList: [
                {
                    value: 0,
                    label: "待审核"
                },
                {
                    value: 1,
                    label: "审核通过"
                },
                {
                    value: 9,
                    label: "已删除"
                }
            ],
            tableData:[
            ],
            tableColumns: [
                {
                    type: 'selection',
                    width: 40,
                    align: 'center'
                },
                {
                    title: "入库单号",
                    key: "inCode",
                    align: "left",
                    minWidth: 150,
                    render: (h, data) => {
                        if(data.row.status=="1" || data.row.status=="9"){
                            return h('div',[
                                h(
                                "span",
                                {
                                    class:'tb-link',
                                    on: {
                                        click: () => {
                                            this.$router.push({ name:'WarehouseRegisterDetail',query:{inEnterId:data.row.id}});
                                        }
                                    }
                                },
                                data.row.inCode)
                            ]);
                        }else{
                            return h('div',data.row.inCode);
                        }
                    }
                },
                {
                    title: "货主",
                    key: "ownerName",
                    align: "left",
                    minWidth: 250,
                    tooltip: true,
                    ellipsis: true
                },
                {
                    title: "货主通知单号",
                    key: "ownerNoticeCode",
                    align: "left",
                    minWidth: 110,
                    tooltip: true,
                    ellipsis: true
                },
                {
                    title: "入库日期",
                    key: "inTime",
                    align: "left",
                    minWidth: 100
                },
                {
                    title: "货物数量(件)",
                    key: "number",
                    align: "right",
                    minWidth: 100
                },
                {
                    title: "货物重量(吨)",
                    key: "weight",
                    align: "right",
                    minWidth: 100
                },
                {
                    title: "备注",
                    key: "remark",
                    align: "left",
                    minWidth: 170,
                    tooltip: true,
                    ellipsis: true
                },
                {
                    title: "送货车号",
                    key: "carNumber",
                    align: "left",
                    minWidth: 90
                },
                {
                    title: "送货人",
                    key: "carContract",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "收货人",
                    key: "receiveName",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "制单人",
                    key: "creator",
                    align: "left",
                    minWidth: 90
                },
                {
                    title: "制单时间",
                    key: "createTime",
                    align: "left",
                    minWidth: 160,
                    // render: (h, data) => {
                    //     return h("span",formatSeconds(data.row.createTime));
                    // }
                },
                {
                    title: "状态",
                    key: "status",
                    align: "left",
                    minWidth: 100,
                    render: (h, data) => {
                        var statusTest = "",statusClass="";
                        if(data.row.status=="0"){
                            statusTest = "待审核";
                            statusClass = "ivu-tag-blue";
                        }else if(data.row.status=="1"){
                            statusTest = "审核通过";
                            statusClass = "ivu-tag-green";
                        }else if(data.row.status=="9"){
                            statusTest = "已删除";
                            statusClass = "ivu-tag-default";
                        }
                        return h("Tag",{class:statusClass},statusTest);
                    }
                },
                {
                    title: "操作",
                    key: "",
                    align: "left",
                    fixed: 'right',
                    minWidth: 125,
                    render: (h, data) => {
                        if(data.row.status=="0"){
                            return h('div',[
                                h(
                                "span",
                                {
                                    class:'tb-link',
                                    on: {
                                        click: () => {
                                            this.$router.push({ name:'WarehouseRegisterEdit',query:{inEnterId:data.row.id}});
                                        }
                                    }
                                },
                                "编辑"),
                                h(
                                "span",
                                {
                                    class:'tb-link margin-left-10',
                                    on: {
                                        click: () => {
                                            this.$router.push({ name:'WarehouseRegisterAudit',query:{inAuditId:data.row.id}});
                                        }
                                    }
                                },
                                "审核"),
                                h(
                                "span",
                                {
                                    class:'tb-link margin-left-10 color-red',
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '提示',
                                                content: '请确认是否删除？',
                                                onOk: () => {
                                                    this.deleteFun(data.row.id)
                                                },
                                                onCancel: () => {
                                                }
                                            });
                                        }
                                    }
                                },
                                "删除")
                            ]);
                        }
                        else{
                            return h('div',[
                                h(
                                "span",
                                {
                                    class:'tb-link',
                                    on: {
                                        click: () => {
                                            this.$router.push({ name:'WarehouseRegisterDetail',query:{inEnterId:data.row.id}});
                                        }
                                    }
                                },
                                "查看")
                            ]);
                        }
                        
                    }
                }
            ],
            checkedRow: [],
        };
    },
    mounted () {
        this.inputDate = [];
        this.getList();
        this.getOwnerList();
    },
    activated(){
        this.getList();
    },
    methods: {
        resetDate(){
            let now = new Date(); //当前日期 
            let nowDayOfWeek = now.getDay(); //今天本周的第几天
            let nowDay = now.getDate(); //当前日
            let nowMonth = now.getMonth(); //当前月 
            let nowYear = now.getFullYear(); //当前年 
            let queryBeginDate = new Date(nowYear,nowMonth,nowDay-nowDayOfWeek+1);
            let queryEndDate = new Date(nowYear,nowMonth,nowDay);
            this.searchParams.startTime = formatDate(queryBeginDate);
            this.searchParams.endTime = formatDate(queryEndDate);
            return [queryBeginDate,queryEndDate]
        },
        rowClassName (row, index) {
            if(row.status == 0){
                return 'table-info-row1';
            }else if(row.status == 9){
                return 'table-info-row2';
            }
            return '';
        },
        getOwnerList() {
            commonQueryOwners().then((res) => {
                if(res.data.code == "200"){
                    this.ownnerList = res.data.data;
                }else{
                    this.$Message.error(res.data.msg);
                }
            });
        },
        reset() {
            this.inputDate = [];
            this.params = {
                inCode: "",
                ownerId:"",
                status: "",
                ownerNoticeCode:""
            }
        },
        search() {
            this.searchParams.startTime = formatDate(this.inputDate[0]);
            this.searchParams.endTime = formatDate(this.inputDate[1]);
            this.searchParams.inCode = this.params.inCode;
            this.searchParams.ownerId = this.params.ownerId;
            this.searchParams.ownerNoticeCode = this.params.ownerNoticeCode;
            this.searchParams.status = this.params.status;
            this.pageChange(1);
        },
        getList(){
            const para = {
                "startTime": this.searchParams.startTime,
                "endTime": this.searchParams.endTime,
                "inCode": this.searchParams.inCode,
                "ownerNoticeCode":this.searchParams.ownerNoticeCode,
                "ownerId": this.searchParams.ownerId,
                "numPerPage": this.pageSize,
                "pageNo": this.pageNum,
                "status": this.searchParams.status
            };
            InventoryInQueryEnterList(para).then(res => {
                if(res.data.code == "200"){
                    const data = res.data.data ? res.data.data : null;
                    let data1 = data ? data.recordList : [];
                    for(var i=0;i<data1.length;i++){
                        if(data1[i].status != 0){
                            data1[i]._disabled = true
                        }else{
                            data1[i]._disabled = false
                        }
                    }
                    this.tableData = data1;
                    this.total =  data ? data.totalCount:0;
                }else{
                    this.$Message.error(res.data.msg);
                }
            })
        },
        pageChange (page) {
            this.pageNum = page;
            this.getList();
        },
        pageSizeChange (pagesize) {
            this.pageNum = 1;
            this.pageSize = pagesize;
            this.getList();
        },
        bulkDel(){
            if(this.checkedRow.length>0){
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>是否确认删除所选项？</p>',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => {
                        let ids = this.checkedRow.map(item => {
                            return item.id
                        })
                        this.deleteFun(ids.join(","));
                    }
                });
            }else{
                this.$Modal.warning({
                    title: '提示',
                    content: '<p>请至少选择一条信息！</p>'
                });
            }
        },
        getSelected(selection){
            this.checkedRow = selection;
        },
        deleteFun(ids){
            InventoryInDeleteInEnter({
                id:ids
            }).then((res) => {
                if(res.data.code == "200"){
                    this.getList();
                    this.$Message.success({
                        content: "删除成功!",
                        duration: 1
                    });
                }else{
                    this.$Message.error(res.data.msg);
                }
            });
        }
    }
};
</script>



