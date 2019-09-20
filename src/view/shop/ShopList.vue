<template>
    <div class="white-bg device-manage">
        <Table :columns="tableColumns" :data="tableData" border></Table>
        <div class="page-wrapper">
            <div v-if="this.$store.state.app.screenSize>768">
                <span class="left">共{{total}}条记录 第{{pageNum}}页 / 共{{Math.ceil(total / pageSize)}}页</span>
                <Page class="pull-right" :current="pageNum" :total="total" :page-size="pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" show-sizer show-elevator />
            </div>
            <div v-if="this.$store.state.app.screenSize<=768">
                <Page class="pull-right" :current="pageNum" :page-size="pageSize" :total="total" @on-change="pageChange" simple />
            </div>
        </div>
    </div>
</template>

<script>
    import { queryQualityShopList, deleteQualityShop } from "@/api/shop";
    import {
        formatDate
    } from "@/libs/util";
    export default {
        name: "ShopList",
        data() {
            return {
                submitDisabled: false,
                pageNum: 1,
                total: 0,
                pageSize: 10,
                shopName: '',
                shopList: [],
                tableData: [],
                tableColumns: [
                    {
                        title: "商店名称",
                        key: "shopName",
                        minWidth: 140
                    },
                    {
                        title: "负责人姓名",
                        key: "chargePerson",
                        minWidth: 140
                    },
                    {
                        title: "负责人联系电话",
                        key: "chargePersonTelephone",
                        minWidth: 140
                    },
                    {
                        title: "商家地址",
                        key: "address",
                        minWidth: 140
                    },
                    {
                        title: "商家描述",
                        key: "description",
                        minWidth: 140
                    },
                    {
                        title: "操作",
                        key: "",
                        fixed: "right",
                        minWidth: 50,
                        render: (h, data) => {
                                return h(
                                "div",
                                [h("span",{
                                    class: "tb-link margin-right-10",
                                    on: {
                                    click: () => {
                                            this.$router.push({
                                                name: "register",
                                                query: {
                                                    id: data.row.id
                                                }
                                            });
                                        }
                                    }
                                },
                                "查看"),
                                h("span", {
                                    class: 'tb-link margin-right-20 color-red',
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '删除',
                                                content: '是否要删除该质检商家？',
                                                onOk: () => {
                                                    let deleteData = {
                                                        id: data.row.id
                                                    }
                                                    deleteQualityShop(deleteData).then(res => {
                                                        if (res.data.code == "200") {
                                                            this.$Message.success({
                                                                content: '删除成功',
                                                                duration: 1
                                                            });
                                                            this.getShopList(this.pageNum, this.pageSize)
                                                        } else {
                                                            this.$Message.error({
                                                                content: res.data.msg,
                                                                duration: 1
                                                            });
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    }
                                }, "删除")
                                ]);
                        }
                    }
                ]
            };
        },
        methods: {
            pageChange: function(value) {
                this.getCategoryList(value, this.pageSize);
            },
            pageSizeChange: function(value) {
                this.getCategoryList(this.pageNum, value);
            },
            getShopList(pageNo, numPerPage) {
                var that = this;
                let params = {
                    pageNo: pageNo,
                    numPerPage: numPerPage,
                    // 是否分页，0-不分页 1-分页
                    isPage: 1,
                    shopName: this.shopName
                };
                queryQualityShopList(params).then(res => {
                    if (res.data.code == "200") {
                        this.tableData  = res.data.data.recordList.map(item => {
                            item.address = item.address.split(",").join("");
                            return item;
                        })
                        this.total = res.data.data.totalCount;
                        this.pageNum = res.data.data.currentPage;
                        this.pageSize = res.data.data.numPerPage;
                    } else {
                        this.$Message.error("查询质检商家列表失败" + rdata.msg)
                    }
                });
            }
        },
        created: function() {
            this.getShopList(1, 10);
        }
    };
</script>

<style scoped>
    .device-manage>>>.table-delete td {
        background-color: #f0f2f5;
    }
</style>
