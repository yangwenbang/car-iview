<template>
    <div class="white-bg device-manage">
        <Row>
            <Col span="24">
            <Button type="primary" @click="addCategory" class="margin-bottom-10 margin-right-10">新增分类</Button>
            </Col>
        </Row>
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
        <Modal ref="modal" v-model="modal" :title="modalTitle" @on-ok="submit">
            <Form ref="formValidate" :model="changeForm" :rules="ruleValidate" :label-width="100">
                <FormItem label="分类名称:" prop="categoryName">
                    <Input v-model="changeForm.categoryName" placeholder="请输入分类名称" :maxlength="20"></Input>
                </FormItem>
                <FormItem label="顺序号:" prop="seq">
                    <Input v-model="changeForm.seq" placeholder="请输入顺序号" :maxlength="3"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" size="large" @click="cancel">取消</Button>
                <Button type="primary" size="large" @click="submit" :disabled="submitDisabled">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import {
        queryCategory,
        saveCategory,
        updateCategory,
        deleteCategory
    } from "@/api/commodity";
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
                modal: false,
                modalTitle: '修改分类',
                changeForm: {
                    id: "",
                    categoryName: "",
                    seq: ""
                },
                categoryList: [],
                tableData: [],
                tableColumns: [{
                        title: "分类名称",
                        key: "categoryName",
                        minWidth: 140
                    },
                    {
                        title: "分类顺序",
                        key: "seq",
                        minWidth: 140
                    },
                    {
                        title: "操作",
                        key: "",
                        fixed: "right",
                        minWidth: 50,
                        render: (h, data) => {
                            return h('div', [h("span", {
                                    class: 'tb-link margin-right-20',
                                    on: {
                                        click: () => {
                                            this.$refs.formValidate.resetFields();
                                            this.changeForm.id = data.row.id;
                                            this.changeForm.categoryName = data.row.categoryName;
                                            this.changeForm.seq = data.row.seq;
                                            this.modalTitle = "修改分类";
                                            this.modal = true;
                                        }
                                    }
                                }, "修改"),

                                h("span", {
                                    class: 'tb-link margin-right-20 color-red',
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: ' ',
                                                content: '是否要删除该分类？',
                                                onOk: () => {
                                                    let deleteData = {
                                                        id: data.row.id
                                                    }
                                                    deleteCategory(deleteData).then(res => {
                                                        if (res.data.code == "200") {
                                                            this.$Message.success({
                                                                content: '删除成功',
                                                                duration: 1
                                                            });
                                                            this.getCategoryList(this.pageNum, this.pageSize)
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
                            ])
                        }
                    }
                ],
                ruleValidate: {
                    categoryName: [{
                        required: true,
                        message: '分类名称不能为空',
                        trigger: 'blur'
                    }],
                    seq: [{
                        required: true,
                        message: '顺序号不能为空',
                        trigger: 'blur'
                    }]
                }
            };
        },
        methods: {
            addCategory: function() {
                this.$refs.formValidate.resetFields();
                this.changeForm.id = '',
                    this.changeForm.changeForm = '';
                this.changeForm.seq = '';
                this.modalTitle = "新增分类"
                this.modal = true;
            },
            submit: function() {
                this.$refs.formValidate.validate(valid => {
                    if (valid) {
                        this.submitDisabled = true;
                        let data = {};
                        if (this.changeForm.id) {
                            data = {
                                categoryName: this.changeForm.categoryName,
                                seq: this.changeForm.seq,
                                id: this.changeForm.id
                            }
                            updateCategory(data).then(res => {
                                if (res.data.code == "200") {
                                    this.$Message.success({
                                        content: '分类修改成功',
                                        duration: 1
                                    });
                                    this.modal = false;
                                    this.getCategoryList(this.pageNum, this.pageSize)
                                } else {
                                    this.$Message.error({
                                        content: res.data.msg,
                                        duration: 1
                                    });
                                }
                                setTimeout(() => {
                                    this.submitDisabled = false;
                                }, 1000);
                            })
                        } else {
                            data = {
                                categoryName: this.changeForm.categoryName,
                                seq: this.changeForm.seq
                            }
                            saveCategory(data).then(res => {
                                if (res.data.code == "200") {
                                    this.$Message.success({
                                        content: '新增分类成功',
                                        duration: 1
                                    });
                                    this.modal = false;
                                    this.getCategoryList(this.pageNum, this.pageSize)
                                } else {
                                    this.$Message.error({
                                        content: res.data.msg,
                                        duration: 1
                                    });
                                }
                                setTimeout(() => {
                                    this.submitDisabled = false;
                                }, 1000);
                            })
                        }
                    }
                });
            },
            cancel: function() {
                this.modal = false;
            },
            pageChange: function(value) {
                this.getCategoryList(value, this.pageSize);
            },
            pageSizeChange: function(value) {
                this.getCategoryList(this.pageNum, value);
            },
            getCategoryList(pageNo, numPerPage) {
                var that = this;
                let params = {
                    pageNo: pageNo,
                    numPerPage: numPerPage,
                    // 是否分页，0-不分页 1-分页
                    isPage: 1
                };
                queryCategory(params).then(res => {
                    if (res.data.code == "200") {
                        this.tableData = res.data.data.recordList;
                        this.total = res.data.data.totalCount;
                        this.pageNum = res.data.data.currentPage;
                        this.pageSize = res.data.data.numPerPage;
                    } else {
                        this.$Message.error("查询分类失败" + rdata.msg)
                    }
                });
            }
        },
        created: function() {
            this.getCategoryList(1, 10);
        }
    };
</script>

<style scoped>
    .device-manage>>>.table-delete td {
        background-color: #f0f2f5;
    }
</style>