<template>
    <div class="white-bg">
        <Form :label-width="150" class="search-form">
            <Row type="flex" justify="space-between">
                <Col :sm="8" :xs="24">
                    <FormItem label="客户名称:">
                        <Input v-model="params.customerName"></Input>
                    </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                    <FormItem label="状态:">
                        <Select v-model="params.auditStatus">
                            <Option v-for="item in auditStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                    <FormItem label="启用状态:">
                        <Select v-model="params.status">
                            <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                </Col>
            </Row>
            <Row type="flex" justify="space-between">
                <Col :sm="24" :xs="24" class="text-right">
                    <FormItem>
                        <Button type="primary" @click="search">搜索</Button>
                        <Button style="margin-left: 8px" @click="reset">重置</Button>
                    </FormItem>
                </Col>
            </Row>
        </Form>
        <Row>
            <Col span="24">
                <router-link to='CustomerAdd' >
                    <Button type="primary" class="margin-bottom-10">新增</Button>
                </router-link>
                <Button type="default" class="margin-bottom-10 margin-left-10" @click="bulkDel">批量删除</Button>
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
import { customerList,deleteCustomer,banCustomer } from '@/api/customer'
export default {
    name: "CustomerMaintain",
    data() {
        return {
            params: {
                customerName: "",
                auditStatus:"",
                status: ""
            },
            searchParams: {//搜索参数
                customerName: "",
                auditStatus:"",
                status: ""
            },
            auditStatusList:[
                {
                    value: '0',
                    label: '待审核'
                },
                {
                    value: '1',
                    label: '已审核'
                },
                {
                     value: '9',
                    label: '已删除'                   
                }
            ],
            statusList:[
                {
                    value: '0',
                    label: '启用'
                },
                {
                    value: '1',
                    label: '停用'
                }
            ],
            pageSize: 10,
            pageNum: 1,
            pageSizeOpts: [10, 15, 20, 40, 50, 100],
            total: 0,
            tableData:[],
            tableColumns: [
                {
                    type: 'selection',
                    width: 40,
                    align: 'center'
                },
                {
                    title: "客户编号",
                    key: "id",
                    align: "left",
                    minWidth: 80,
                    render: (h, data) => {
                        return h(
                            "span",
                            {
                                class:'tb-link',
                                on: {
                                    click: () => {
                                        this.$router.push({ name:'CustomerDetail',query:{id:data.row.customerId}});
                                    }
                                }
                            },
                            data.row.customerId
                        );
                    }
                },
                {
                    title: "客户名称",
                    key: "customerName",
                    align: "left",
                    minWidth: 150,
                    tooltip: true,
                    ellipsis: true
                },
                {
                    title: "客户类型",
                    key: "companyType",
                    align: "left",
                    minWidth: 80,
                    render: (h, data) => {
                        var statusTest = "";
                        if(data.row.companyType=="0"){
                            statusTest = "企业";
                        }else if(data.row.companyType=="1"){
                            statusTest = "业务部门";
                        }else if(data.row.companyType=="2"){
                            statusTest = "子公司";
                        }else if(data.row.companyType=="3"){
                            statusTest = "个人";
                        }
                        return h("span",statusTest);
                    }
                },
                {
                    title: "客户简称",
                    key: "customerShortName",
                    align: "left",
                    minWidth: 100
                },
                {
                    title: "状态",
                    key: "auditStatus",
                    align: "center",
                    minWidth: 80,
                    render: (h, data) => {
                        var statusTest = "",statusClass="";
                        if(data.row.auditStatus=="0"){
                            statusTest = "待审核";
                            statusClass = "ivu-tag-blue";
                        }else if(data.row.auditStatus=="1"){
                            statusTest = "已审核";
                            statusClass = "ivu-tag-green";
                        }else if(data.row.auditStatus=="9"){
                            statusTest = "已删除";
                            statusClass = "ivu-tag-default";
                        }
                        return h("Tag",{class:statusClass},statusTest);
                    }
                },
                {
                    title: "启用状态",
                    key: "status",
                    align: "center",
                    minWidth: 150,
                    render:(h,data)=>{
                        let statusTest = "",statusClass="";
                        if(data.row.auditStatus=="0"){
                            return ""
                        }else{
                            if(data.row.status=="1"){
                                statusTest = "停用";
                                statusClass = "ivu-tag-red";
                            }else if(data.row.status=="0"){
                                statusTest = "启用";
                                statusClass = "ivu-tag-green";
                            }else{
                                return ""
                            }
                        }
                        
                        return h("Tag",{class:statusClass},statusTest);
                    }
                },
                {
                    title: "操作",
                    key: "",
                    align: "left",
                    fixed: 'right',
                    minWidth: 160,
                    render: (h, data) => {
                        let newOperate;
                        if(data.row.status == "0"){
                            newOperate = h(
                                "span",
                                {
                                    class:'tb-link color-red margin-left-10',
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '提示',
                                                content: '请确认是否停用？',
                                                onOk: () => {
                                                    this.banCustomerFun(data.row.customerId,1)
                                                },
                                                onCancel: () => {
                                                }
                                            });
                                        }
                                    }
                                },
                                "停用")
                        }else if(data.row.status == "1"){
                            newOperate = h(
                                "span",
                                {
                                    class:'tb-link color-green margin-left-10',
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '提示',
                                                content: '请确认是否启用？',
                                                onOk: () => {
                                                    this.banCustomerFun(data.row.customerId,0)
                                                },
                                                onCancel: () => {
                                                }
                                            });
                                        }
                                    }
                                },
                                "启用")
                        }
                        if(data.row.auditStatus=="0"){
                            return h('div',[
                                h(
                                "span",
                                {
                                    class:'tb-link color-red',
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '提示',
                                                content: '请确认是否删除？',
                                                onOk: () => {
                                                    this.deleteFun(data.row.customerId)
                                                },
                                                onCancel: () => {
                                                }
                                            });
                                        }
                                    }
                                },
                                "删除"),
                                h(
                                "span",
                                {
                                    class:'tb-link margin-left-10',
                                    on: {
                                        click: () => {
                                            this.$router.push({ name:'CustomerEdit',query:{id:data.row.customerId}});
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
                                            this.$router.push({ name:'CustomerAudit',query:{id:data.row.customerId}});
                                        }
                                    }
                                },
                                "审核")
                            ]);
                        }else if(data.row.auditStatus=="1"){
                            return h('div',[
                                h(
                                "span",
                                {
                                    class:'tb-link',
                                    on: {
                                        click: () => {
                                            this.$router.push({ name:'CustomerDetail',query:{id:data.row.customerId}});
                                        }
                                    }
                                },
                                "查看"),newOperate
                            ]);
                        }else if(data.row.auditStatus=="9"){
                            return h('div',[
                                h(
                                "span",
                                {
                                    class:'tb-link',
                                    on: {
                                        click: () => {
                                            this.$router.push({ name:'CustomerDetail',query:{id:data.row.customerId}});
                                        }
                                    }
                                },
                                "查看")
                            ]);
                        }
                        
                    }
                },
                
            ],
            checkedRow: [],
        };
    },
    mounted () {
        this.getList();
    },
    activated(){
        this.getList();
    },
    methods: {
        rowClassName (row, index) {
            if(row.auditStatus == "0"){
                return 'table-info-row1';
            }
            return '';
        },
        reset() {
            this.params = {
                customerName: "",
                auditStatus:"",
                status: ""
            }
        },
        search() {
            this.searchParams.customerName = this.params.customerName;
            this.searchParams.auditStatus = this.params.auditStatus;
            this.searchParams.status = this.params.status;
            this.pageChange(1);
        },
        getList(){
            const para = {
                "customerName": this.searchParams.customerName,
                "auditStatus": this.searchParams.auditStatus,
                "status": this.searchParams.status,
                "numPerPage": this.pageSize,
                "pageNo": this.pageNum
            };
            customerList(para).then(res => {
                if(res.data.code == "200"){
                    const data = res.data.data ? res.data.data : null;
                    let data1 = data ? data.recordList : [];
                    for(var i=0;i<data1.length;i++){
                        if(data1[i].auditStatus != 0){
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
                            return item.customerId
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
        deleteFun(ids){
            deleteCustomer({
                customerId:ids
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
        },
        getSelected(selection){
            this.checkedRow = selection;
        },
        banCustomerFun(id,flag){
            banCustomer({
                customerId:id,
                flag:flag
            }).then(res=>{
                if(res.data.code == "200"){
                    this.getList();
                    this.$Message.success({
                        content: "状态修改成功!",
                        duration: 1
                    });
                }else{
                    this.$Message.error(res.data.msg);
                }
            })
        }
    }
};
</script>



