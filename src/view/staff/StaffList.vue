<template>
    <div class="white-bg">
        <Form :label-width="150" class="search-form">
            <Row type="flex" justify="space-between">
                <Col :lg="8" :xs="24">
                <FormItem label="新增日期:">
                    <DatePicker type="daterange" v-model="params.createTime" placeholder="请选择日期" style="width: 100%"></DatePicker>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="工种:">
                    <Select v-model="params.kindId" clearable placeholder="请选择工种" filterable>
                        <Option v-for="item in kindList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="状态:">
                    <Select v-model="params.status" clearable placeholder="请选择状态">
                        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="姓名:">
                    <Input v-model="params.name" placeholder="请输入姓名" :maxlength="20"></Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="手机号:">
                    <Input v-model="params.mobile" placeholder="请输入手机号" :maxlength="20" @on-blur="validateTel"></Input>
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
                <Button type="primary" @click="addStaff" class="margin-bottom-10 margin-right-10">新增工人</Button>
                <Button type="default" class="margin-bottom-10" @click="batchDelete">批量删除</Button>
            </Col>
        </Row>
        <Table :row-class-name="rowClassName" :columns="tableColumns" @on-selection-change="selectChange" :data="tableData" border></Table>
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
                <FormItem label="姓名" prop="employeeName">
                    <Input v-model="formValidate.employeeName" placeholder="请输入姓名" :maxlength="20"></Input>
                </FormItem>
                <FormItem label="手机号" prop="mobile">
                    <Input v-model="formValidate.mobile" placeholder="请输入手机号" :maxlength="20" @on-blur="validateTel1"></Input>
                </FormItem>
                <FormItem label="身份证号" prop="employeeCard">
                    <Input v-model="formValidate.employeeCard" placeholder="请输入身份证号" @on-blur="validateCard"></Input>
                </FormItem>
                <FormItem label="工种" prop="kindId">
                    <Select v-model="formValidate.kindId" clearable placeholder="请选择工种" filterable label-in-value @on-change="changKind">
                        <Option v-for="item in kindList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="备注" prop="remark">
                    <Input v-model="formValidate.remark" type="textarea" :rows="3" placeholder="请输入备注" :maxlength="200"></Input>
                </FormItem>
                <FormItem label="对应仓库" prop="employeeWarehouseDTOs">
                    <CheckboxGroup v-model="formValidate.employeeWarehouseDTOs">
                        <Checkbox v-for="item in warehouseList" :label="item.warehouseId" :key="item.warehouseId">{{item.warehouseName}}</Checkbox>
                    </CheckboxGroup>
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
import {deleteEmployee, queryEmployeeList, saveEmployee, showEmployee, startOrBanEmployee, updateEmployee, queryAllEmployeeKind} from '@/api/staff';
import {getWarehouse} from '@/api/login';
import { formatDate, formatWeight } from "@/libs/util";
//验证手机号码
var rex = /^1[3-9]+\d{9}$/;
//验证座机号
var rex2 = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
//验证身份证
var rex3 = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/;
export default {
    name: "StaffList",
    data() {
        return {
            submitDisabled:false,
            params: {
                createTime: ['',''],
                kindId: '',
                status: '',
                name: '',
                mobile: '',
                pageNo: 1,
                numPerPage: 10
            },
            searchParams: {
                startCreateTime: '',
                endCreateTime: '',
                kindId: '',
                status: '',
                name: '',
                mobile: '',
                pageNo: 1,
                numPerPage: 10
            },
            formValidate: {
                employeeCard: "",
                employeeId: "",
                employeeName: "",
                employeeWarehouseDTOs: [],
                kindId: '',
                kindName: "",
                mobile: "",
                remark: ''
            },
            ruleValidate: {
                employeeName: [
                    { required: true, message: '姓名不能为空', trigger: 'change' }
                ],
                employeeWarehouseDTOs:[
                    { required: true, type: 'array', message: '请选择仓库', trigger: 'change' }
                ]
            },
            currentSelect: [],
            pageSize: 10,
            pageNum: 1,
            pageSizeOpts: [5,10, 15, 20],
            total: 0,
            kindList: [],
            warehouseList: [],
            warehouse:{},
            showModal: false,
            modalTitle: '新增工人',
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
                    title: "姓名",
                    key: "name",
                    align: "left",
                    minWidth: 120
                },
                {
                    title: "手机号",
                    key: "mobile",
                    align: "left",
                    minWidth: 200
                },
                {
                    title: "身份证号",
                    key: "card",
                    minWidth: 140
                },
                {
                    title: "新增日期",
                    key: "createTime",
                    minWidth: 140
                },
                {
                    title: "工种",
                    key: "kindName",
                    align: "left",
                    minWidth: 100
                },
                {
                    title: "对应仓库",
                    key: "employeeWarehouses",
                    minWidth: 140,
                    render: (h,params) => {
                        return h('span',params.row.employeeWarehouses?params.row.employeeWarehouses.map(o => {
                            return o.employeeName;
                        }).join('，'):'');
                    }
                },
                {
                    title: "备注",
                    key: "remark",
                    minWidth: 140,
                    ellipsis: true,
                    tooltip: true
                },
                {
                    title: "状态",
                    key: "status",
                    align: "left",
                    minWidth: 120,
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
                                            this.modalTitle = '修改工人';
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
                createTime: ['',''],
                kindId: '',
                status: '',
                name: '',
                mobile: ''
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
            this.searchParams = {
                startCreateTime: this.params.createTime[0] ? formatDate(this.params.createTime[0]) : '',
                endCreateTime: this.params.createTime[1] ? formatDate(this.params.createTime[1]) : '',
                kindId: this.params.kindId,
                status: this.params.status,
                name: this.params.name,
                mobile: this.params.mobile,
                pageNo: this.params.pageNo,
                numPerPage: this.params.numPerPage
            }
            queryEmployeeList(this.searchParams).then(res => {
                const data = res.data.data;
                if(res.data.code == "200") {
                    this.total = data.totalCount;
                    var recordList = data.recordList ? data.recordList :[];
                    this.tableData = recordList.map(o=>{
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
                content: '<p>请确认'+content+'所选工人？</p>',
                onOk: () => {
                    startOrBanEmployee({
                        employeeId: id,
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
                    content: '请选择工人'
                });
            }
        },
        delete(param) {
            this.$Modal.confirm({
                title: '信息确认',
                content: '<p>请确认删除所选工人？</p>',
                onOk: () => {
                    deleteEmployee({
                        employeeIds:param,
                        status: 9
                    }).then(res => {
                        if(res.data.code == "200") {
                            this.$Message.success('删除成功');
                            // this.pageChange(this.pageSize)
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
        getKindList() {
            queryAllEmployeeKind().then(res => {
                if(res.data.code == '200') {
                    this.kindList = [];
                    let recordList = res.data.data?res.data.data:[]
                    recordList.map(o => {
                        if(o.status == 0) {
                            this.kindList.push({
                                id: o.id,
                                name: o.name
                            })
                        }
                    });
                }
             })
        },
        getWarehouseList() {
            getWarehouse().then(res =>{
                if(res.data.code == '200') {
                    this.warehouseList = res.data.data?res.data.data:[];
                    this.warehouseList.map(o => {
                        this.warehouse[o.warehouseId] = o.warehouseName;
                    })
                }
            })
        },
        changKind(o){
            this.formValidate.kindName = o?o.label:'';
        },
        addStaff() {
            this.formValidate.employeeCard = "";
            this.formValidate.employeeId = "";
            this.formValidate.employeeName = "";
            this.formValidate.employeeWarehouseDTOs = [];
            this.formValidate.kindId = "";
            this.formValidate.kindName = "";
            this.formValidate.mobile = "";
            this.formValidate.remark = "";
            this.modalTitle = '新增工人';
            this.showModal = true;
            let warehouseId = this.$store.state.user.warehouse.warehouseId;
            if(warehouseId) {
                this.formValidate.employeeWarehouseDTOs.push(warehouseId)
            }
            this.$refs.formValidate.resetFields();
        },
        getEmployeeMsg(id) {
            showEmployee({employeeId:id}).then(res => {
                if(res.data.code == '200') {
                    let data = res.data.data;
                    this.formValidate.employeeCard = data.card;
                    this.formValidate.employeeId = data.id;
                    this.formValidate.employeeName = data.name;
                    this.formValidate.employeeWarehouseDTOs = data.employeeWarehouses.map(o=>{return o.warehouseId});
                    this.formValidate.kindId = data.kindId;
                    this.formValidate.kindName = data.kindName;
                    this.formValidate.mobile = data.mobile;
                    this.formValidate.remark = data.remark;
                } else {
                    this.$Message.error(res.data.msg);
                }
            })
        },
        ok() {
            this.$refs.formValidate.validate((valid) => {
                if (valid) {
                    this.submitDisabled = true;
                    let employeeWarehouseDTOs = this.formValidate.employeeWarehouseDTOs.map(o =>{
                        return {
                            warehouseId: o,
                            warehouseName: this.warehouse[o]
                        }
                    })

                    this.formValidate.employeeWarehouseDTOs = employeeWarehouseDTOs;
                    let params = JSON.parse(JSON.stringify(this.formValidate));
                    if(this.modalTitle == '新增工人') {
                        saveEmployee(params).then(res => {
                            if(res.data.code == '200') {
                                this.$Message.success('添加成功');
                                this.showModal = false;
                                this.search();
                            } else {
                                this.showModal = true;
                                this.$refs.formValidate.resetFields();
                                this.formValidate = JSON.parse(JSON.stringify(params));
                                this.formValidate.employeeWarehouseDTOs = params.employeeWarehouseDTOs.map(o => {
                                    return o.warehouseId;
                                })
                                this.$Message.error(res.data.msg);
                            }
                            setTimeout(() => {
                                this.submitDisabled = false;
                            }, 1000);
                        })
                    } else {
                        updateEmployee(params).then(res => {
                            if(res.data.code == '200') {
                                this.$Message.success('修改成功');
                                this.showModal = false;
                                this.search();
                            } else {
                                this.showModal = true;
                                this.$refs.formValidate.resetFields();
                                this.formValidate = JSON.parse(JSON.stringify(params));
                                this.formValidate.employeeWarehouseDTOs = params.employeeWarehouseDTOs.map(o => {
                                    return o.warehouseId;
                                })
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
        validateTel(){
            if (!rex.test(this.params.mobile) && !rex2.test(this.params.mobile)) {
               this.params.mobile = '';
            }
        },
        validateTel1(){
            if (!rex.test(this.formValidate.mobile) && !rex2.test(this.formValidate.mobile)) {
              this.formValidate.mobile = '';
            }
        },
        validateCard(){
            if (!rex3.test(this.formValidate.employeeCard)) {
              this.formValidate.employeeCard = '';
            }
        }
    },
    created() {
        this.getKindList();
        this.getWarehouseList();
    },
    mounted () {
        this.search();
        let warehouseId = this.$store.state.user.warehouse.warehouseId;
        if(warehouseId) {
            this.formValidate.employeeWarehouseDTOs.push(warehouseId);
        }
    },
    activated() {
        this.getKindList();
        this.getWarehouseList();
        this.search();
    },
};
</script>



