<template>
    <div class="white-bg">
        <Form :label-width="150" class="search-form">
            <Row type="flex" justify="space-between">
                <Col :sm="8" :xs="24">
                <FormItem label="用户需求标题:">
                    <Input v-model="params.title" placeholder="搜索用户需求标题"></Input>
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
                <router-link to='ExampleAdd' >
                    <Button type="primary" class="margin-bottom-10">创建</Button>
                </router-link>
                <div class="pull-right count-content"><span class="margin-right-10">交易笔数：<b class="tip">16</b> 笔</span> <span class="margin-right-10">重量合计：<b class="tip">776.8750</b> 吨</span> <span class="margin-right-10">货款合计：<b class="tip">1440597.86</b> 元</span> <span class="margin-right-10">实提重量合计：<b class="tip">339.6017</b> 吨</span> <span>实提货款合计：<b class="tip">628772.76</b> 元 </span></div>
            </Col>
        </Row>
        <Table :row-class-name="rowClassName" :columns="tableColumns" :data="tableData" border></Table>
        <div class="page-wrapper">
            <div v-if="this.$store.state.app.screenSize>768">
                <span class="left">共{{total}}条记录 第{{pageNum}}页 / 共{{Math.ceil(total / pageSize)}}页 </span>
                <Page class="pull-right" :current="pageNum" :total="total" :page-size="pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size-opts="pageSizeOpts" show-sizer show-elevator/>
            </div>
            <div v-if="this.$store.state.app.screenSize<=768">
                <Page class="pull-right" :current="pageNum" :page-size="pageSize" :total="total" @on-change="pageChange" simple />
            </div>
        </div>
        <div class="tooltip-header" v-show="tooltipIsShow" :style="{top:tooltipTop+'px',left:tooltipLeft+'px'}">
            {{tooltipContent}}
        </div>

    </div>

</template>
<script>
import { getTableData } from '@/api/data'
export default {
    name: "UserRequireList",
    data() {
        return {
            tooltipContent:"",
            tooltipIsShow: false,
            tooltipTop:0,
            tooltipLeft:0,
            params: {
                title: "",
                status: "", 
            },
            searchParams: {
                title: "",
                status: ""
            },
            pageSize: 10,
            pageNum: 1,
            pageSizeOpts: [10, 15, 20, 40, 50, 100],
            total: 100,
            statusList: [
                {
                    value: "1",
                    label: "待审核"
                },
                {
                    value: "2",
                    label: "已审核"
                },
                {
                    value: "3",
                    label: "已删除"
                }
            ],
            tableData:[],
            tableColumns: [
                {
                    title: "用户需求标题",
                    key: "demandTitle",
                    align: "left",
                    minWidth: 380
                },
                {
                    title: "创建人",
                    key: "creater",
                    align: "left",
                    minWidth: 120,
                    renderHeader: (h,params)=>{
                        return h('div',[
                            h('span','创建人'),
                            h('span', {
                                attrs:{
                                    content:"创建人操作关闭,编辑"
                                },
                                style: {
                                    marginLeft: '5px',
                                    cursor: 'pointer'
                                },
                                on: {
                                    'mouseover': (e) => {
                                        this.tooltipIsShow = true;
                                        this.tooltipContent = e.currentTarget.getAttribute('content');
                                        this.tooltipLeft = e.currentTarget.getBoundingClientRect().left + 20;
                                        this.tooltipTop = e.currentTarget.getBoundingClientRect().top - 10;
                                    },
                                    'mouseout': (e) => {
                                        this.tooltipIsShow = false;
                                        this.tooltipContent = "";
                                    }
                                }
                              
                            }, [h('Icon',{
                                    props:{
                                        type: 'md-help-circle',
                                        size: 17
                                    }
                                })
                            ])
                        ])
                    }
                },
                {
                    title: "修改人",
                    key: "editor",
                    align: "left",
                    minWidth: 100
                },
                {
                    title: "创建时间",
                    key: "creatTime",
                    align: "left",
                    minWidth: 180
                },
                {
                    title: "状态",
                    key: "status",
                    align: "left",
                    minWidth: 160,
                    render: (h, data) => {
                        var statusTest = "";
                        if(data.row.status=="1"){
                            statusTest = "待审核"
                        }else if(data.row.status=="2"){
                            statusTest = "已审核"
                        }else if(data.row.status=="3"){
                            statusTest = "已删除"
                        }
                        return h("span",statusTest);
                    }
                },
                {
                    title: "操作",
                    key: "",
                    align: "left",
                    minWidth: 100,
                    renderHeader: (h,params)=>{
                        return h('div',[
                            h('span','操作'),
                            h('span', {
                                attrs:{
                                    content:"只有PMO角色才能执行转产品需求操作"
                                },
                                class:"header-tooltip",
                                style: {
                                    marginLeft: '5px',
                                    cursor: 'pointer'
                                },
                                    on: {
                                    'mouseover': (e) => {
                                        this.tooltipIsShow = true;
                                        this.tooltipContent = e.currentTarget.getAttribute('content');
                                        this.tooltipLeft = e.currentTarget.getBoundingClientRect().left - 240;
                                        this.tooltipTop = e.currentTarget.getBoundingClientRect().top - 10;
                                    },
                                    'mouseout': (e) => {
                                        this.tooltipIsShow = false;
                                        this.tooltipContent = "";
                                    }
                                }
                              
                            }, [h('Icon',{
                                    props:{
                                        type: 'md-help-circle',
                                        size: 17
                                    }
                                })
                               
                            ])
                            
                        ])
                    },
                    render: (h, data) => {
                        return h(
                            "span",
                            {
                                class:'tb-link',
                                on: {
                                    click: () => {
                                        this.$router.push({ name:'ExampleDetail'});
                                    }
                                }
                            },
                            "查看"
                        );
                    }
                }
            ],
        };
    },
    mounted () {
        this.getList();
    },
    methods: {
        rowClassName (row, index) {
            if(row.status == 1){
                return 'table-info-row1';
            }else if(row.status == 3){
                return 'table-info-row2';
            }
            return '';
        },
        reset() {
            this.params = {
                title: "",
                status: ""
            }
        },
        search() {
            this.searchParams.title = this.params.title;
            this.searchParams.status = this.params.status;
            this.pageChange(1);
        },
        getList(){
            const para = {
                title: this.searchParams.title,
                status: this.searchParams.status,
                pageSize: this.pageSize,
                pageNum: this.pageNum,
            };
            getTableData(para).then(res => {
                this.tableData = res.data.list;
                this.total =  res.data.total;
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
        }
    }
};
</script>



