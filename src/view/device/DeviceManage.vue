<template>
    <div class="white-bg device-manage">
        <Form :label-width="150" class="search-form">
            <Row type="flex" justify="space-between">
                <Col :sm="8" :xs="24">
                    <FormItem label="加工方式:">
                        <Select v-model="searchForm.processMethod" clearable>
                            <Option v-for="(item,index) in processList" :value="item.value" :key="index">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                    <FormItem label="品牌:">
                        <Input v-model="searchForm.brand" placeholder="请输入品牌"></Input>
                    </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                    <FormItem label="状态:">
                        <Select v-model="searchForm.state" clearable>
                            <Option v-for="(item,index) in stateList" :value="item.value" :key="index">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                    <FormItem label="设备编号:">
                        <Input v-model="searchForm.deviceCode" placeholder="请输入设备型号"></Input>
                    </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                    <FormItem label="设备名:">
                        <Input v-model="searchForm.deviceName" placeholder="请输入设备型号"></Input>
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
        <Row>
            <Col span="24">
                <Button type="primary" @click="addDevice" class="margin-bottom-10 margin-right-10">新增设备</Button>
                <Button type="default" class="margin-bottom-10" @click="batchDelete">批量删除</Button>
            </Col>
        </Row>
        <Table :columns="tableColumns" :row-class-name="rowClassName" :data="tableData" @on-selection-change="selectionChange" border></Table>
        <div class="page-wrapper">
            <div v-if="this.$store.state.app.screenSize>768">
                <span class="left">共{{total}}条记录 第{{pageNum}}页 / 共{{Math.ceil(total / pageSize)}}页 </span>
                <Page class="pull-right" :current="pageNum" :total="total" :page-size="pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" show-sizer show-elevator/>
            </div>
            <div v-if="this.$store.state.app.screenSize<=768">
                <Page class="pull-right" :current="pageNum" :page-size="pageSize" :total="total" @on-change="pageChange" simple />
            </div>
        </div>
        <Modal
            ref="modal"
            v-model="modal"
            :title="modalTitle"
            @on-ok="submit">
            <Form ref="formValidate" :model="changeForm" :rules="ruleValidate" :label-width="100">
                <FormItem label="设备编号:" prop="deviceCode">
                    <Input v-model="changeForm.deviceCode" placeholder="请输入设备编号" :maxlength="20"></Input>
                </FormItem>
                <FormItem label="设备名:" prop="deviceName">
                    <Input v-model="changeForm.deviceName" placeholder="请输入设备名" :maxlength="20"></Input>
                </FormItem>
                <FormItem label="加工方式:" prop="processMode">
                    <Select v-model="changeForm.processMode" clearable>
                        <Option v-for="(item,index) in processList" :value="item.value" :key="index" placeholder="请选择加工方式">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="品牌:" >
                    <Input v-model="changeForm.brand" placeholder="请输入品牌" :maxlength="20"></Input>
                </FormItem>
                <FormItem label="备注:">
                    <Input type="textarea" v-model="changeForm.remark" placeholder="请输入备注" :maxlength="200"></Input>
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
import { queryDeviceList,addDevice,updateDevice,updateStatus,deleteDevice } from '@/api/device'
import { formatDate } from '@/libs/util'
export default {
    data(){
        return {
            submitDisabled:false,
            modalTitle:'新增设备',
            updataId:'',
            tableCheckList:'',
            modal:false,
            opreateType:0,//0-添加，1-修改
            pageNum:1,
            total:0,
            pageSize:10,
            searchForm:{
                brand:'',
                state:'',
                deviceCode:'',
                deviceName:'',
                processMethod:'',
            },
            changeForm:{
                deviceCode:'',
                deviceName:'',
                processMode:'',
                brand:'',
                remark:'',
            },
            stateList:[
                {
                    label:'启用',
                    value:0
                },
                {
                    label:'停用',
                    value:1
                },
            ],
            processList:[
                {
                    label:'开平',
                    value:0
                },
                {
                    label:'纵剪',
                    value:1
                },
                {
                    label:'开平+纵剪',
                    value:2
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
                    title: "状态",
                    key: "status",
                    align: "left",
                    minWidth: 50,
                    render:(h,data)=>{
                        if(data.row.status=="0"){
                            return h("Tag",{class:"ivu-tag-green"},"启用中");
                        }else if(data.row.status=="1"){
                            return h("Tag",{class:"ivu-tag-red"},"停用中");
                        }else if(data.row.status=="9"){
                            return h("Tag",{class:"ivu-tag"},"已删除");
                        }
                        
                    }
                },
                {
                    title: "设备名",
                    key: "deviceName",
                    minWidth: 140
                },
                 {
                    title: "设备编号",
                    key: "deviceType",
                    align: "left",
                    minWidth: 200
                },
                {
                    title: "加工方式",
                    key: "processMode",
                    minWidth: 140,
                     render:(h,data)=>{
                        if(data.row.processMode =="0"){
                            return h("span",{},"开平");
                        }else if(data.row.processMode=="1"){
                            return h("span",{},"纵剪");
                        }else{
                            return h("span",{},"开平+纵剪");
                        }
                        
                    }
                },
                {
                    title: "品牌",
                    key: "brand",
                    align: "left",
                    minWidth: 120,
                },
                
                {
                    title: "备注",
                    key: "remark",
                    align: "left",
                    minWidth: 120,
                },
                {
                    title: "操作",
                    key: "",
                    fixed: 'right',
                    minWidth: 140,
                    render: (h, data) => {
                        if(data.row.status!='9'){
                            let child=[
                            h("span",
                                    {
                                        class:'tb-link margin-right-10',
                                        on: {
                                            click: () => {
                                                this.$refs.formValidate.resetFields();
                                                this.changeForm.deviceCode=data.row.deviceType;
                                                this.changeForm.deviceName=data.row.deviceName;
                                                this.changeForm.processMode=data.row.processMode;
                                                this.changeForm.brand=data.row.brand;
                                                this.changeForm.remark=data.row.remark;
                                                this.updataId=data.row.id;
                                                this.opreateType=1;
                                                this.modalTitle="修改设备"
                                                this.modal=true;
                                            }
                                        }
                                    },"修改") ,
                            h("span",
                                {
                                    class:'tb-link margin-right-10 color-red',
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title:' ',
                                                content:'是否要删除该设备？',
                                                onOk:()=>{
                                                    let deleteData={
                                                        deviceIds:data.row.id,
                                                        status:9
                                                    }
                                                    deleteDevice(deleteData).then(res=>{
                                                        if(res.data.code=="200"){
                                                            this.$Message.success({
                                                                content:'删除成功',
                                                                duration:1
                                                            });
                                                            this.getDeviceList(this.pageNum,this.pageSize)
                                                        }else{
                                                            this.$Message.error({
                                                                content:res.data.msg,
                                                                duration:1
                                                            });
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    }
                                },"删除") 
                            ];
                            if(data.row.status=='0'){
                                child.push(
                                    h("span",
                                    {
                                        class:'tb-link margin-right-10 tb-link-orange',
                                        on: {
                                            click: () => {
                                                this.$Modal.confirm({
                                                    title:'信息确认',
                                                    content:'是否要停用该设备？',
                                                    onOk:()=>{
                                                        let updataData={
                                                            deviceId:data.row.id,
                                                            status:1
                                                        }
                                                        updateStatus(updataData).then(res=>{
                                                            if(res.data.code=="200"){
                                                                this.$Message.success({
                                                                    content:'停用成功',
                                                                    duration:1
                                                                });
                                                                this.getDeviceList(this.pageNum,this.pageSize)
                                                            }else{
                                                                this.$Message.error({
                                                                    content:res.data.msg,
                                                                    duration:1
                                                                });
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        }
                                    },"停用"))
                            }else{
                                child.push(
                                    h("span",
                                    {
                                        class:'tb-link margin-right-10 color-green',
                                        on: {
                                            click: () => {
                                                this.$Modal.confirm({
                                                    title:'信息确认',
                                                    content:'是否要启用该设备？',
                                                    onOk:()=>{
                                                        let updataData={
                                                            deviceId:data.row.id,
                                                            status:0
                                                        }
                                                        updateStatus(updataData).then(res=>{
                                                            if(res.data.code=="200"){
                                                                this.$Message.success({
                                                                    content:'启用成功',
                                                                    duration:1
                                                                });
                                                                this.getDeviceList(this.pageNum,this.pageSize)
                                                            }else{
                                                                this.$Message.error({
                                                                    content:res.data.msg,
                                                                    duration:1
                                                                });
                                                            }
                                                        })
                                                    }
                                                })
                                                
                                            }
                                        }
                                    },"启用"))
                            }
                            return h('div',child)
                        }else{
                            return h('span','')
                        }
                        
                    }
                }
            ],
            ruleValidate: {
                deviceCode: [
                    { required: true, message: '设备编号不能为空', trigger: 'blur' }
                ],
                deviceName: [
                    { required: true, message: '设备名不能为空', trigger: 'blur' }
                ],
                processMode: [
                    { required: true,type:'number', message: '加工方式不能为空', trigger: 'change' }
                ],
            }
        }
    },
    methods:{
        search:function(){
           this.getDeviceList(1,10) 
        },
        reset:function(){
            this.searchForm.brand='';
            this.searchForm.state='';
            this.searchForm.deviceCode='';
            this.searchForm.deviceName='';
            this.searchForm.processMethod='';
        },
        cancel:function(){
            this.modal=false;
        },
        submit:function(){
            this.$refs.formValidate.validate(valid=>{
                if(valid){
                    this.submitDisabled = true;
                    let data={
                        deviceType:this.changeForm.deviceCode,
                        deviceName:this.changeForm.deviceName,
                        processMode:this.changeForm.processMode,
                        brand:this.changeForm.brand,
                        remark:this.changeForm.remark
                    }
                    if(this.opreateType=="0"){
                        addDevice(data).then(res=>{
                            if(res.data.code=="200"){
                                this.$Message.success({
                                    content:'设备添加成功',
                                    duration:1
                                });
                                this.modal=false;
                                this.getDeviceList(this.pageNum,this.pageSize)
                            }else{
                                this.$Message.error({
                                    content:res.data.msg,
                                    duration:1
                                });
                            }
                            setTimeout(() => {
                                this.submitDisabled = false;
                            }, 1000);
                        })
                    }
                    if(this.opreateType=="1"){
                        data.id=this.updataId
                        updateDevice(data).then(res=>{
                            if(res.data.code=="200"){
                                this.$Message.success({
                                    content:'信息修改成功',
                                    duration:1
                                });
                                this.modal=false;
                                this.getDeviceList(this.pageNum,this.pageSize)
                            }else{
                                this.$Message.error({
                                    content:res.data.msg,
                                    duration:1
                                });
                            }
                            setTimeout(() => {
                                this.submitDisabled = false;
                            }, 1000);
                        })
                    }
                }
            })
        },
        addDevice:function(){
            this.$refs.formValidate.resetFields();
            this.changeForm.brand='';
            this.changeForm.remark='';
            this.modalTitle="新增设备"
            this.modal=true;
            this.opreateType=0;
        },
        batchDelete:function(){
            if(this.tableCheckList==''){
                this.$Modal.warning({
                    title:'提示',
                    content:'请至少选择一个设备'
                })
            }else{
                this.$Modal.confirm({
                    title:'信息确认',
                    content:'是否删除你所选择的这些设备？',
                    onOk:()=>{
                        let deleteData={
                            deviceIds:this.tableCheckList,
                            status:9,
                        }
                        deleteDevice(deleteData).then(res=>{
                            if(res.data.code=='200'){
                                this.$Message.success({
                                    content:'删除成功',
                                    duration:1
                                });
                                this.getDeviceList(this.pageNum,this.pageSize)
                            }else{
                                this.$Message.error({
                                    content:res.data.msg,
                                    duration:1
                                });
                            }
                        })
                    }
                })
            }
        },
        rowClassName:function(row,index){
            if(row.status=="9"){
                return 'table-delete'
            }
        },
        selectionChange:function(selection){
            let temp=selection.map(item=>{
                return item.id
            })
            this.tableCheckList=temp.toString()
        },
        getDeviceList:function(pageNo,numPerPage){
            let data={
                brand:this.searchForm.brand,
                status:this.searchForm.state,
                deviceType:this.searchForm.deviceCode,
                deviceName:this.searchForm.deviceName,
                processMode:this.searchForm.processMethod,
                pageNo:pageNo,
                numPerPage:numPerPage
            }
            queryDeviceList(data).then(res=>{
                if(res.data.code=='200'){
                    this.tableData=res.data.data.recordList.map(item=>{
                        if(item.status=='9'){
                            item._disabled=true
                        }
                        return item
                    });
                    this.total=res.data.data.totalCount;
                    this.pageNum=res.data.data.currentPage;
                    this.pageSize=res.data.data.numPerPage;
                }
            })
        },
        pageChange:function(value){
            this.getDeviceList(value,this.pageSize)
        },
        pageSizeChange:function(value){
            this.getDeviceList(this.pageNum,value)
        }
    },
    mounted:function(){
       this.getDeviceList(1,10)
    }
}
</script>

<style scoped>
.device-manage >>> .table-delete td{
    background-color: #f0f2f5;
}
</style>