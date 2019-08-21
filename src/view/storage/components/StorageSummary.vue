<template>
    <div>
        <Form :label-width="150" class="search-form">
            <Row type="flex" justify="space-between">
                <Col :sm="8" :xs="24">
                <FormItem label="汇总编号:">
                    <Input v-model="params.id" clearable></Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="货主:">
                    <Select v-model="params.ownerName" filterable>
                        <Option v-for="item in customerList" :value="item.customerName" :key="item.customerId">{{ item.customerName }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="货物类型:">
                    <Select v-model="params.type" clearable placeholder="所有">
                        <Option v-for="item in typesList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="产地:">
                    <Input :maxlength="20" v-model="params.brandName" clearable></Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="品名:">
                    <Input :maxlength="20" v-model="params.breedName" clearable></Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="材质:">
                    <Input :maxlength="20"  v-model="params.materialName" clearable></Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="规格:">
                    <Input :maxlength="20" v-model="params.specName" clearable></Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24" class="text-right">
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
                <span class="left">共{{total}}条记录 第{{pageNo}}页 / 共{{Math.ceil(total / numPerPage)}}页 </span>
                <Page class="pull-right" :current="pageNo" :total="total" :page-size="numPerPage" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size-opts="pageSizeOpts" show-sizer show-elevator/>
            </div>
            <div v-if="this.$store.state.app.screenSize<=768">
                <Page class="pull-right" :current="pageNo" :page-size="numPerPage" :total="total" @on-change="pageChange" simple />
            </div>
        </div>
    </div>

</template>
<script>
// import { getTableData } from '@/api/data'

import {StorageSummary} from '@/api/storage'
import {formatWeight} from "@/libs/util";
import {InventoryProcessCustomerList} from '@/api/process'
export default {
    name: "StorageManage",
    components: { },
    data() {
        return {
            params: {
                id:"",
                ownerName:"",
                type:"",
                brandName:"",
                breedName:"",
                materiaName:"",
                specName:"",
            },
            searchParams: {
                id:"",
                ownerName:"",
                type:"",
                brandName:"",
                breedName:"",
                materiaName:"",
                specName:"",
            },
            numPerPage:10,
            pageNo: 1,
            pageSizeOpts: [10, 15, 20, 40, 50, 100],
            total: 0,
            customerList:[],
            typesList: [
                {
                    value: "0",
                    label: "原料"
                },
                {
                    value: "1",
                    label: "成品"
                },
                {
                    value: "2",
                    label: "废料"
                }
            ],
            tableData:[],
            tableColumns: [
                {
                    title: "汇总编号",
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
                                        this.$emit('summary-submit',data.row.id);
                                    }
                                }
                            },
                            data.row.id
                        );
                    }
                },
                {
                    title:"货主",
                    key: "ownerName",
                    align: "left",
                    minWidth: 250,            
                },
                {
                    title: "货物类型",
                    key: "type",
                    align: "left",
                    minWidth: 80,
                     render: (h,data) =>{
                        var typeText = '';
                        if(data.row.type == "0"){
                            typeText = "原料"
                        }else if(data.row.type == "1"){
                            typeText = "成品"
                        }else if(data.row.type == "2"){
                            typeText = "废料"
                        }
                        return h('span',{},typeText)
                    }
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
                    minWidth: 80
                },
                {
                    title: "数量",
                    key: "number",
                    align: "right",
                    minWidth: 80
                },                
                {
                    title: "总重量",
                    key: "weight",
                    align: "right",
                    minWidth: 100,
                    render: (h, data) => {
                        return h("span",formatWeight(data.row.weight));
                    }
                }
            ],
        };
    },
    mounted () {
        this.getList();
        InventoryProcessCustomerList().then(res =>{
            if(res.data.code == "200"){
                this.customerList = res.data.data;
            }
        })
    },
    methods: {
        reset() {
            this.params = {
                id:"",
                ownerName:"",
                type:"",
                brandName:"",
                breedName:"",
                materialName:"",
                specName:"",
            }
        },
        search() {
            this.searchParams.id = this.params.id;
            this.searchParams.ownerName = this.params.ownerName;
            this.searchParams.type = this.params.type;
            this.searchParams.brandName = this.params.brandName;
            this.searchParams.breedName = this.params.breedName;
            this.searchParams.materialName = this.params.materialName;
            this.searchParams.specName = this.params.specName;
            this.pageChange(1);
        },
        getList(){       
            const para = {
                id:this.searchParams.id,
                ownerName:this.searchParams.ownerName,
                type:this.searchParams.type,
                brandName:this.searchParams.brandName,
                breedName:this.searchParams.breedName,
                materialName:this.searchParams.materialName,
                specName:this.searchParams.specName,
                numPerPage: this.numPerPage,
                pageNo: this.pageNo,
            };
            StorageSummary(para).then(res=>{         
                if(res.data.code == "200"){           
                    let dealData = res.data.data.recordList;
                    this.tableData = dealData;
                    this.total = res.data.data.totalCount;
                    this.numPerPage = res.data.data.numPerPage
                }
            });
            
        },
        pageChange (page) {
            this.pageNo = page;
            this.getList();
        },
        pageSizeChange (pagesize) {
            this.pageNo = 1;
            this.numPerPage = pagesize;
            this.getList();
        }
    }
};
</script>



