<template>
    <div class="white-bg">
        <Form :label-width="150" class="search-form">
            <Row type="flex" justify="space-between">
               <Col :sm="8" :xs="24">
                <FormItem label="状态:">
                    <Select v-model="params.status" clearable placeholder="请选择状态">
                        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24" class="text-right">
                <FormItem label="">
                    <Button type="primary" @click="search">搜索</Button>
                    <Button style="margin-left: 8px" @click="reset">重置</Button>
                </FormItem>
                </Col>
            </Row>
        </Form>
        <Row>
            <Col span="24">
                <Button type="primary" @click="addKind" class="margin-bottom-10  margin-right-10">新增工种</Button>
                 <Button type="default" class="margin-bottom-10" @click="batchDelete">批量删除</Button>
            </Col>
        </Row>
        <Table :row-class-name="rowClassName" :columns="tableColumns" :data="tableData" @on-selection-change="selectChange" border></Table>
         <div class="page-wrapper">
            <div v-if="this.$store.state.app.screenSize>768">
                <span class="left">共{{total}}条记录 第{{pageNum}}页 / 共{{Math.ceil(total / pageSize)}}页 </span>
                <Page class="pull-right" :current="pageNum" :total="total" :page-size="pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size-opts="pageSizeOpts" show-sizer show-elevator/>
            </div>
            <div v-if="this.$store.state.app.screenSize<=768">
                <Page class="pull-right" :current="pageNum" :page-size="pageSize" :total="total" @on-change="pageChange" simple />
            </div>
        </div>
        <Modal
            ref="modal"
            v-model="showModal"
            :title="modalTitle"
            :mask-closable="false">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="工种名" prop="name">
                    <Input v-model="formValidate.name" placeholder="请输入工种名" :maxlength="20"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" size="large" @click="cancel">取消</Button>
                <Button type="primary" size="large" @click="ok" :disabled="submitDisabled">确定</Button>
            </div>
        </Modal>
    </div>

</template>
<script>
import {addEmployeeKind, editEmployeeKind, updateEmployeeKind, queryEmployeeKindList, updateEmployeeKindStatus, deleteEmployeeKind} from '@/api/staff';
import { formatDate, formatWeight } from "@/libs/util";
export default {
    name: "StaffTypeList",
    data() {
        return {
            submitDisabled:false,
            params: {
                status: '',
                pageNo: 1,
                numPerPage: 10
            },
            searchParams: {
                status: '',
                pageNo: 1,
                numPerPage: 10
            },
            formValidate: {
                id: '',
                name: ""
            },
            ruleValidate: {
                name: [
                    { required: true, message: '工种名不能为空', trigger: 'change' }
                ]
            },
            loading: true,
            currentSelect:[],
            modalTitle:'新增工种',
            showModal: false,
            pageSize: 10,
            pageNum: 1,
            pageSizeOpts: [5,10, 15, 20],
            total: 0,
            statusList: [
                {
                    value: 0,
                    label: "启用中"
                },
                {
                    value: 1,
                    label: "停用中"
                }
            ],
            tableData:[],
            tableColumns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: "ID",
                    key: "id",
                    align: "left",
                    minWidth: 120
                },
                {
                    title: "工种名",
                    key: "name",
                    align: "left",
                    minWidth: 140
                },
                {
                    title: "新增日期",
                    key: "displayTime",
                    align: "right",
                    minWidth: 140
                },
                {
                    title: "员工数",
                    key: "employeeNumber",
                    align: "right",
                    minWidth: 140
                },
                {
                    title: "状态",
                    key: "status",
                    align: "left",
                    minWidth: 100,
                    render: (h, params) => {
                        var statusTest = "",statusClass="";
                        switch(params.row.status) {
                            case 0: 
                                statusTest = "启用中";
                                statusClass = "ivu-tag-green";
                                return h("Tag",{class:statusClass},statusTest);
                                break;
                            case 1:
                                statusTest = "停用中";
                                statusClass = "ivu-tag-red";
                                return h("Tag",{class:statusClass},statusTest);
                                break;
                            case 9: 
                                statusTest = "已删除";
                                statusClass = "ivu-tag-default";
                                return h("Tag",{class:statusClass},statusTest);
                            break;
                        }
                        return h('span','');
                    }
                },
                {
                    title: "操作",
                    key: "",
                    fixed: 'right',
                    width: 140,
                    minWidth: 140,
                    render: (h, params) => {
                        let edit =  h("span",
                                {
                                    class:'tb-link margin-right-10',
                                    on: {
                                        click: () => {
                                            this.showModal = true;
                                            this.modalTitle = '修改工种';
                                            this.$refs.formValidate.resetFields();
                                            this.getEmployeeMsg(params.row.id);
                                        }
                                    }
                                },"编辑") ;
                        let start = h("span",
                                {
                                    class:'tb-link green margin-right-10 ',
                                    on: {
                                        click: () => {
                                            this.startOrStop(params.row.id, 0);
                                        }
                                    }
                                },"启用") ;
                        let stop = h("span",
                                {
                                    class:'tb-link tb-link-orange margin-right-10',
                                    on: {
                                        click: () => {
                                            this.startOrStop(params.row.id, 1);
                                        }
                                    }
                                },"停用") ;
                        let remove = h("span",
                        {
                            class:'tb-link color-red margin-right-10',
                            on: {
                                click: () => {
                                    this.delete(params.row.id);
                                }
                            }
                        },"删除") ;
                        let operate = [];
                         switch(params.row.status) {
                             case 0: operate.push(edit, stop, remove);break;
                             case 1: operate.push(edit, start, remove);break;
                         }
                        return h('div',operate);
                    }
                }
            ],
        };
    },
    methods: {
        rowClassName (row, index) {
            if(row.status == 9){
                return 'table-info-row2';
            }
            return '';
        },
        reset() {
            this.params = {
                status: ''
            }
        },
        search() {
            this.pageChange(1);
        },
        pageChange (page) {
            this.params.pageNo = this.pageNum = page;
            this.getList();
        },
        pageSizeChange (pagesize) {
            this.params.pageNo = this.pageNum = 1;
            this.params.numPerPage = this.pageSize = pagesize;
            this.getList();
        },
        getList(){
            this.searchParams = JSON.parse(JSON.stringify(this.params))
            queryEmployeeKindList(this.searchParams).then(res => {
                const data = res.data.data;
                if(res.data.code == "200") {
                    this.total = data.totalCount;
                    this.tableData = data.recordList.map(o=>{
                        if(o.status == 9) {
                            o._disabled = true;
                        } else {
                           o._disabled = false;  
                        }
                        return o;
                    });
                }
                else {
                    this.$Message.error(res.data.msg);
                }
            })
        },
        startOrStop(id, status) {
            let content = status == 0?'启用':'停用';
            this.$Modal.confirm({
                title: '信息确认',
                content: '<p>请确认'+content+'所选工种？</p>',
                onOk: () => {
                    updateEmployeeKindStatus({
                        employeeKindId: id,
                        status: status
                    }).then(res => {
                        if(res.data.code == "200") {
                            this.$Message.success('操作成功');
                            this.getList();
                        } else {
                            this.$Message.error(res.data.msg);
                        }
                    })
                },
                onCancel: () => {
                }
            });
        },
        batchDelete() {
            if(this.currentSelect.length > 0) {
                let params = this.currentSelect.map(o => {
                    return o.id
                }).join(",")
                this.delete(params);
            } else {
                this.$Modal.warning({
                    title: '提示',
                    content: '请选择工种'
                });
            }
        },
        delete(param) {
            this.$Modal.confirm({
                title: '信息确认',
                content: '<p>请确认删除所选工种？</p>',
                onOk: () => {
                    deleteEmployeeKind({
                        employeeKindIds:param,
                        status: 9
                    }).then(res => {
                        if(res.data.code == "200") {
                            this.$Message.success('删除成功');
                            this.getList();
                        } else {
                            this.$Message.error(res.data.msg);
                        }
                    })
                },
                onCancel: () => {
                }
            });
        },
        addKind() {
            this.formValidate.id = "";
            this.formValidate.name = "";
            this.modalTitle = '新增工种';
            this.showModal = true;
            this.$refs.formValidate.resetFields();
        },
        getEmployeeMsg(id) {
            editEmployeeKind({employeeKindId:id}).then(res => {
                if(res.data.code == '200') {
                    let data = res.data.data;
                    this.formValidate.id = data.id;
                    this.formValidate.name = data.name;
                } else {
                    this.$Message.error(res.data.msg);
                }
            })
        },
        ok() {
            this.$refs.formValidate.validate((valid) => {
                if (valid) {
                    this.submitDisabled = true;
                    if(this.modalTitle == '新增工种') {
                        addEmployeeKind(this.formValidate).then(res => {
                            if(res.data.code == '200') {
                                this.$Message.success('添加成功');
                                this.showModal = false;
                                this.search();
                            } else {
                                this.showModal = true;
                                this.$Message.error(res.data.msg);
                            }
                            setTimeout(() => {
                                this.submitDisabled = false;
                            }, 1000);
                        })
                    } else {
                        updateEmployeeKind(this.formValidate).then(res => {
                            if(res.data.code == '200') {
                                this.$Message.success('修改成功');
                                this.showModal = false;
                                this.search();
                            } else {
                                this.showModal = true;
                                this.$Message.error(res.data.msg);
                            }
                            setTimeout(() => {
                                this.submitDisabled = false;
                            }, 1000);
                        })
                    }
                } else {
                    this.showModal = true;
                }
            })
        },
        cancel() {
            this.showModal = false;
        },
        selectChange(selection) {
            this.currentSelect = selection;
        },
    },
    created() {
    },
    mounted () {
        this.search();
    },
    activated() {
        this.search();
    },
};
</script>


