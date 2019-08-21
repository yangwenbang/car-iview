<template>
    <div>
        <Form  :label-width="150"  class="search-form">
            <Row type="flex" justify="space-between">
                <Col :sm="8" :xs="24">
                <FormItem label="编号:">
                    <Input v-model="params.code" clearable></Input>
                </FormItem>
                </Col>
                 <Col :sm="8" :xs="24">
                <FormItem label="打包号:">
                    <Input v-model="params.packCode" clearable></Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="汇总编号:">
                    <Input v-model="params.summaryId" clearable></Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="货主:">
                    <Select v-model="params.ownerId" filterable label-in-value @on-change="changeSelect">
                        <Option v-for="item in customerList" :value="item.customerId" :key="item.customerId">{{ item.customerName }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="入库日期:">
                    <DatePicker v-model="inputDate" format="yyyy/MM/dd" type="daterange" placement="bottom-start" placeholder="请选择日期" style="width:100%;"></DatePicker>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="货物类型:">
                    <Select clearable v-model="params.type"  placeholder="所有" @on-change="changeType">
                        <Option v-for="item in typesList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="材料类型:">
                    <Select clearable v-model="params.inventoryType">
                        <Option v-for="item in inventoryTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem label="产地:" >
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
                <Col :sm="8" :xs="24">
                <FormItem label="库区:">
                    <Input :maxlength="20" v-model="params.storageArea" clearable></Input>
                </FormItem>
                </Col>
                <Col :sm="8" :xs="24">
                <FormItem > 
                    <Checkbox v-model="params.greaterThanZero">显示数量 > 0件 </Checkbox>      
                </FormItem>  
                </Col>       
                <Col :sm="8" :xs="24">
                <FormItem > 
                    <Checkbox v-model="params.avaliableNumberGreaterThanZero">可供数量 > 0件 </Checkbox>      
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
        <div class="tooltip-header" v-show="tooltipIsShow" :style="{top:tooltipTop+'px',left:tooltipLeft+'px'}">
            {{tooltipContent}}
        </div>
        <Modal
            v-model="modal"
            title="库存调整"
            ok-text="保存"
            width="60%"
            :footer-hide="true"
            @on-ok="updateStorage"
            @on-cancel="cancle">
            <storage-fix :data="currentClickrow" ref="updateStorageTable" @updateList="getList" @contralmodal="contralmodal"></storage-fix>
        </Modal>
         <Modal v-model="modal3" title="打包货物明细" width="60%" ok-text="确定" >
            <div class="table-scrollable ivu-table ivu-table-db">
                <table cellspacing="0" cellpadding="0" border="0" width="100%">
                   <thead>
                     <tr>
                       <th>打包号</th>
                       <th>货物类型</th>
                       <th>材料类型</th>
                       <th>产地</th>
                       <th>品名</th>
                       <th>材质</th>
                       <th>规格</th>
                       <th class="right">数量(件)</th>
                       <th class="right">单件重量（吨）</th>
                       <th class="right">总重量（吨）</th>
                     </tr>
                   </thead>
                    <tbody>
                        <template v-if="dbInfor.length > 0">
                        <tr v-for="(item,index) in dbInfor" :key="index" >
                            <td :rowspan="dbInfor.length" v-if="index == 0">{{item.packCode}}</td>
                            <td>{{item.type == '0' ? '原料' : item.type == '1' ? '成品' : '废料'}}</td>
                            <td>{{item.inventoryType == '0' ? '原材' : item.inventoryType == '1' ? '余卷' : item.inventoryType == '2' ? '分条料' : item.inventoryType == '3' ? '开平板' : item.inventoryType == '4' ? '头尾板' : item.inventoryType == '5' ? '边丝' : ''}}</td>
                            <td>{{item.brandName}}</td>
                            <td>{{item.breedName}}</td>
                            <td>{{item.materialName}}</td>
                            <td>{{item.specName}}</td>
                            <td class="right">{{item.number}}</td>
                            <td class="right">{{item.perAmount|formatWeight}}</td>
                            <td class="right">{{item.weight|formatWeight}}</td>
                        </tr>
                        </template>
                        <tr v-else>
                            <td class="right">暂无数据</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div slot="footer" class="text-center">
                <Button type="primary" @click="modal3=false">确定</Button>
            </div>
        </Modal>
        <Modal
            v-model="modal2"
            title="母卷信息"
            class-name="parent-info" >
            <Row>
                <Col span="8"><span class="jumbo-roll">编号：{{parent.code}}</span></Col>
                <Col span="8"><span class="jumbo-roll">产地：{{parent.brandName}}</span></Col>
                <Col span="8"><span class="jumbo-roll">品名：{{parent.breedName}}</span></Col>
            </Row>
            <Row>
                <Col span="8"><span class="jumbo-roll">材质：{{parent.materialName}}</span></Col>
                <Col span="8"><span class="jumbo-roll">数量（件）：{{parent.number}}</span></Col>
                <Col span="8"><span class="jumbo-roll">单件重量（吨）：{{parent.perAmount}}</span></Col>
            </Row>
            <Row>
                <Col span="12"><span class="jumbo-roll">计重方式：{{weightType}}</span></Col>
                <Col span="12"><span class="jumbo-roll">钢卷号/捆包号：{{parent.baleNumber}}</span></Col>
            </Row>
            <Row>
                <Col span="12"><span class="jumbo-roll">包装：{{parent.wrap}}</span></Col>
                <Col span="12"><span class="jumbo-roll">外观：{{parent.appearance}}</span></Col>
            </Row>
            <div slot="footer">
                <Button type="info" size="large" long @click="modal2=false">确定</Button>
            </div>
        </Modal>
    </div>

</template>
<script>
// import { getTableData } from '@/api/data'
import StorageFix from './StorageFix'
import {StorageDetail,getParentInventory} from '@/api/storage'
import {InventoryProcessCustomerList} from '@/api/process'
import {formatWeight,formatDate} from "@/libs/util";
import { queryInventoryItemsByPackId } from "@/api/outstock";
export default {
    name: "StorageManage",
    components: { StorageFix},
    data() {
        return {
            modal:false,
            modal2:false,
            modal3:false,
            dbInfor: [],
            currentClickrow:{},//当前点击调整行数据
            currentPack:{},
            inputDate:[],
            tooltipContent:"",
            tooltipIsShow: false,
            loading:true,
            tooltipTop:0,
            tooltipLeft:0,
            pageNo:1,
            numPerPage:10,
            lastId:0,
            parent:{},
            params: {
                code:"",
                packCode:"",
                summaryId:"",
                ownerName:"",
                ownerId: "",
                warehouseName:"",
                type:"",
                brandName:"",
                breedName:"",
                materiaName:"",
                specName:"",
                storageArea:"",
                greaterThanZero:true,
                avaliableNumberGreaterThanZero:true,
                inventoryType: ""
            },
            searchParams: {
                code:"",
                packCode:"",
                summaryId:"",
                ownerName:"",
                ownerId: "",
                warehouseName:"",
                type:"",
                brandName:"",
                breedName:"",
                materiaName:"",
                specName:"",
                storageArea:"",
                greaterThanZero:1,
                avaliableNumberGreaterThanZero:1,
                inventoryType: ""

            },
            pageSizeOpts: [10, 15, 20, 40, 50, 100],
            total: 0,
            customerList:[],
            typesList: [
               {
                    value: 0,
                    label: "原材"
                },
                {
                    value: 1,
                    label: "成品"
                },
                {
                    value: 2,
                    label: "废料"
                }
            ],
            inventoryTypeList: [
               {
                    value: 0,
                    label: "原材"
                },
                {
                    value: 1,
                    label: "余卷"
                },
                {
                    value: 2,
                    label: "分条料"
                },
                {
                    value: 3,
                    label: "开平板"
                },
                {
                    value: 4,
                    label: "头尾板"
                },
                {
                    value: 5,
                    label: "边丝"
                }
            ],
            warehouseList:[],
            tableData:[],
            tableColumns: [
                {
                    title: "编号",
                    key: "code",
                    align: "left",
                    minWidth: 120,
                    render: (h, data) => {
                        return h(
                            "span",
                            {
                                class:'tb-link',
                                on: {
                                    click: () => {
                                        this.$router.push({ name:'StorageTrack',query:{id:data.row.id,type:data.row.type}});
                                    }
                                }
                            },
                            data.row.code
                        );
                    }
                },
               {
                    title: "打包号",
                    key: "packCode",
                    align: "left",
                    minWidth: 120,
                    render: (h, data) => {
                        return h("a",{
                            class: "tb-link",
                            on: {
                                click: () => {
                                    this.modal3 = true;
                                    this.getDBInfor(data.row.packId);
                                }
                            }
                        },data.row.packCode)
                    }
                },
                {
                    title: "汇总编号",
                    key: "summaryId",
                    align: "left",
                    minWidth: 80
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
                    title: "材料类型",
                    key: "inventoryType",
                    align: "left",
                    minWidth: 80,
                    render: (h,data) =>{
                        var typeText = '';
                        if(data.row.inventoryType == "0"){
                            typeText = "原材"
                        }else if(data.row.inventoryType == "1"){
                            typeText = "余卷"
                        }else if(data.row.inventoryType == "2"){
                            typeText = "分条料"
                        }else if(data.row.inventoryType == "3"){
                            typeText = "开平板"
                        }else if(data.row.inventoryType == "4"){
                            typeText = "头尾板"
                        }else if(data.row.inventoryType == "5"){
                            typeText = "边丝"
                        }
                        return h('span',{},typeText)
                    }
                },
                {
                    title: "产地",
                    key: "brandName",
                    align: "left",
                    minWidth: 100
                },
                {
                    title: "品名",
                    key: "breedName",
                    align: "left",
                    minWidth: 120
                },
                {
                    title: "材质",
                    key: "materialName",
                    align: "left",
                    minWidth: 100
                },
                {
                    title: "规格",
                    key: "specName",
                    align: "right",
                    minWidth: 120
                },
                {
                    title: "数量(件)",
                    key: "number",
                    align: "right",
                    minWidth: 100
                },
                {
                    title: "单件重量(吨)",
                    key: "perAmount",
                    align: "right",
                    minWidth: 100,
                    render: (h, data) => {
                        return h("span",formatWeight(data.row.perAmount));
                    }
                },
                {
                    title: "总重量(吨)",
                    key: "weight",
                    align: "right",
                    minWidth: 100,
                    render: (h, data) => {
                        return h("span",formatWeight(data.row.weight));
                    }
                },
                {
                    title: "加锁数量(件)",
                    key: "lockNum",
                    align: "right",
                    minWidth: 100
                },
               
                {
                    title: "可供数量(件)",
                    key: "availableNumber",
                    align: "right",
                    minWidth: 100
                },
                {
                    title: "可供重量(吨)",
                    key: "availableWeight",
                    align: "right",
                    minWidth: 100,
                    render: (h, data) => {
                        return h("span",formatWeight(data.row.availableWeight));
                    }
                },
                {
                    title: "库区",
                    key: "storageArea",
                    align: "right",
                    minWidth: 80
                },
                {
                    title: "库位",
                    key: "storagePlace",
                    align: "right",
                    minWidth: 80
                },
                {
                    title: "入库日期",
                    key: "inTime",
                    align: "left",
                    minWidth: 100
                },
                {
                    title: "仓租天数",
                    key: "storageDay",
                    align: "right",
                    minWidth: 80
                },              
                {
                    title: "包装",
                    key: "wrap",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "外观",
                    key: "appearance",
                    align: "left",
                    minWidth: 80
                },
                {
                    title: "钢卷号",
                    key: "baleNumber",
                    align: "left",
                    minWidth: 120
                },
                {
                    title: "母卷信息",
                    key: "",
                    align: "left",
                    minWidth: 100,
                    render: (h, data) => {
                        if(data.row.type=="1"){
                            return h("span",
                                {
                                    class:'tb-link margin-left-10',
                                    on: {
                                        click: () => {
                                            if(this.lastId!=data.row.id){
                                                this.lastId=data.row.id
                                                getParentInventory({inventoryItemId:data.row.id}).then(res=>{
                                                    if(res.data.code=='200'){
                                                        if(res.data.data!=null){
                                                            this.parent=res.data.data
                                                            this.modal2 = true;
                                                        }else{
                                                            this.parent={};
                                                            this.$Modal.warning({
                                                                title: '提示',
                                                                content: '没有母卷信息'
                                                            });
                                                        }
                                                        
                                                    }else{
                                                        this.$Message.error(res.data.msg);
                                                    }
                                                })
                                            }else{
                                                if(this.parent.id){
                                                    this.modal2 = true;
                                                }else{
                                                    this.$Modal.warning({
                                                        title: '提示',
                                                        content: '没有母卷信息'
                                                    });
                                                }
                                            }
                                           
                                            
                                        }
                                    }
                                },
                                "查看")
                        }else{
                            return h("span",'')
                        }
                        
                    }
                },
                {
                    title: "操作",
                    key: "",
                    align: "left",
                    fixed: 'right',
                    minWidth: 100,
                    render: (h, data) => {
                        return h("span",
                                {
                                    class:'tb-link margin-left-10',
                                    on: {
                                        click: () => {
                                            this.currentClickrow=data.row;
                                            this.modal = true;
                                        }
                                    }
                                },
                                "调整")
                    }
                }
            ]  
        }
    },
    computed:{
        weightType:function(){
            if(this.parent.weightType==0){
                return '抄码'
            }else if(this.parent.weightType==1){
                return '过磅'
            }else{
                return '理重'
            }
        }
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
        updateStorage(){
            this.$refs.updateStorageTable.updateStorage();
        },
        cancle(){
            this.currentClickrow={}
            this.currentPack={}
        },
        reset() {
            this.params = {
                code:"",
                packCode:"",
                summaryId:"",
                ownerName:"",
                ownerId: "",
                warehouseName:"",
                type:"",
                brandName:"",
                breedName:"",
                materialName:"",
                specName:"",
                storageArea:"",
                inventoryType: ""
            }
            this.inputDate = [];
        },
        search() {
            this.searchParams.startTime = formatDate(this.inputDate[0]);
            this.searchParams.endTime = formatDate(this.inputDate[1]);
            this.searchParams.code = this.params.code;
            this.searchParams.packCode = this.params.packCode;
            this.searchParams.summaryId = this.params.summaryId;
            this.searchParams.ownerName = this.params.ownerName;
            this.searchParams.ownerId = this.params.ownerId;
            this.searchParams.warehouseName = this.params.warehouseName;
            this.searchParams.type = this.params.type;
            this.searchParams.brandName = this.params.brandName;
            this.searchParams.breedName = this.params.breedName;
            this.searchParams.materialName = this.params.materialName;
            this.searchParams.specName = this.params.specName;
            this.searchParams.storageArea = this.params.storageArea;
            this.searchParams.greaterThanZero = this.params.greaterThanZero ? 1 : 0;
            this.searchParams.avaliableNumberGreaterThanZero = this.params.avaliableNumberGreaterThanZero ? 1 : 0;
            this.searchParams.inventoryType = this.params.inventoryType;
            this.pageChange(1);
        },
        getList(){
            const para = {
                startTime:this.searchParams.startTime,
                endTime:this.searchParams.endTime,
                code:this.searchParams.code,
                packCode:this.searchParams.packCode,
                summaryId:this.searchParams.summaryId,
                ownerName:this.searchParams.ownerName,
                ownerId:this.searchParams.ownerId,
                warehouseName:this.searchParams.warehouseName,
                type:this.searchParams.type,
                brandName:this.searchParams.brandName,
                breedName:this.searchParams.breedName,
                materialName:this.searchParams.materialName,
                specName:this.searchParams.specName,
                storageArea:this.searchParams.storageArea,
                greaterThanZero:this.searchParams.greaterThanZero,
                avaliableNumberGreaterThanZero:this.searchParams.avaliableNumberGreaterThanZero,
                inventoryType: this.searchParams.inventoryType,
                numPerPage: this.numPerPage,
                pageNo: this.pageNo,
            };
           
            StorageDetail(para).then(res =>{
                if(res.data.code == "200"){
                    let result = res.data.data;
                    let dealData = result.recordList;
                    this.tableData = dealData;
                    this.total = result.totalCount;                    
                }          
            });
            
        },
        contralmodal(value){
            this.modal=value;
            this.modal3 = value;
        },
        pageChange (page) {
            this.pageNo = page;
            this.getList();
        },
        pageSizeChange (pagesize) {
            this.pageNo = 1;
            this.numPerPage = pagesize;
            this.getList();
        },
        getDBInfor(packId) {
            queryInventoryItemsByPackId({ packIds: packId }).then(res => {
                this.dbInfor = res.data.data ? res.data.data : [];
            });
        },
        changeSelect(e) {
            this.params.ownerName = e.label;
            this.params.ownerId = e.value;
        },
        changeType(e) {
            switch(this.params.type) {
                case 0: this.inventoryTypeList = [{
                        value: 0,
                        label: "原材"
                    },
                    {
                        value: 1,
                        label: "余卷"
                    }]; 
                    break;
                case 1: this.inventoryTypeList = [{
                        value: 2,
                        label: "分条料"
                    },
                    {
                        value: 3,
                        label: "开平板"
                    }]; 
                    break;
                case 2: this.inventoryTypeList = [{
                        value: 4,
                        label: "头尾板"
                    },
                    {
                        value: 5,
                        label: "边丝"
                    }]; 
                    break;
                default: this.inventoryTypeList = [{
                        value: 0,
                        label: "原材"
                    },
                    {
                        value: 1,
                        label: "余卷"
                    },
                    {
                        value: 2,
                        label: "分条料"
                    },
                    {
                        value: 3,
                        label: "开平板"
                    },
                    {
                        value: 4,
                        label: "头尾板"
                    },
                    {
                        value: 5,
                        label: "边丝"
                    }]; 
            }
        }
    }
};
</script>
<style scoped>
.parent-info .jumbo-roll{
    display:inline-block;
    font-size:14px;
    margin-top:10px;
}
.ivu-table table {
    min-width: 1200px;
}
.ivu-table-db th,.ivu-table-db td{padding:5px;}
.ivu-modal-content{height:400px!important;}
.right{text-align: right}
.text-center{text-align: center!important;}
</style>



