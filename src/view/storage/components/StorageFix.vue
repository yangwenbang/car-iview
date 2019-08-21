<template>
    <div class="table-scrollable left-right-table tiaozheng">
        <Form ref="form" :rules="ruleValidate" :model="bind">    
            <table border="1">
                <tbody>
                    <tr>
                        <td class="left-bg">货主：</td>
                        <td>{{bind.ownerName}}</td>
                        <td class="left-bg">入库日期：</td>
                        <td>{{bind.inTime}}</td>
                    </tr>
                    <tr>
                        <td class="left-bg">仓库：</td>
                        <td>{{bind.warehouseName}}</td>
                        <td class="left-bg">货物类型：</td>
                        <td>{{hwtype}}</td>
                    </tr>
                    <tr>
                        <td class="left-bg">材料类型：</td>
                        <td colspan="3">{{yctype}}</td>
                    </tr>
                    <tr v-if="bind.type==1 && parent.id">
                        <td style="text-align: right;border-right:none">
                            母卷信息
                        </td>
                        <td colspan="3 " style="border-left:none">
                           
                        </td>
                    </tr>
                    <tr v-if="bind.type==1 && parent.id">
                        <td class="left-bg">钢卷号/捆包号：</td>
                        <td>{{parent.baleNumber}}</td>
                        <td class="left-bg">产地：</td>
                        <td>{{parent.brandName}}</td>
                    </tr>
                    <tr v-if="bind.type==1 && parent.id">
                        <td class="left-bg">品名：</td>
                        <td>{{parent.breedName}}</td>
                        <td class="left-bg">材质：</td>
                        <td>{{parent.materialName}}</td>
                    </tr>
                    <tr v-if="bind.type==1 && parent.id">
                        <td class="left-bg">规格：</td>
                        <td>{{parent.specName}}</td>
                        <td class="left-bg">包装：</td>
                        <td>{{parent.wrap}}</td>
                    </tr>
                    <tr v-if="bind.type==1 && parent.id">
                        <td colspan="4">
                            &nbsp;
                        </td>
                    </tr>
                    <tr>
                        <td class="left-bg">编号：</td>
                        <td>
                            <Input v-model="bind.code"></Input>
                        </td>
                        <td class="left-bg">产地：</td>
                        <td>
                            <Select filterable v-model="bind.brandCode" :label-in-value="true" @on-change="getBrand">
                                <Option v-for="(item,index) in bind.brandNameList" :value="item.value" :key="index">{{ item.label }}</Option>
                            </Select>
                        </td>
                    </tr>
                    <tr>
                        <td class="left-bg"><span class="color-red">*</span>品名：</td>
                        <td>
                            <FormItem prop="breedCode">
                                <Select filterable v-model="bind.breedCode" :label-in-value="true" @on-change="getBreed">
                                    <Option v-for="(item,index) in bind.breedNameList" :value="item.value" :key="index">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                        </td>
                        <td class="left-bg"><span class="color-red">*</span>材质：</td>
                         <td>
                            <FormItem prop="materialCode"> 
                                <Select filterable v-model="bind.materialCode" :label-in-value="true" @on-change="getMarerial">
                                    <Option v-for="(item,index) in bind.materialNameList" :value="item.value" :key="index">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                        </td>
                    </tr>
                    <tr>
                        <td class="left-bg"><span class="color-red">*</span>规格：</td>
                        <td>
                            <FormItem prop="specName"> 
                                <Input v-model="bind.specName"></Input>
                            </FormItem>
                        </td>
                        <td class="left-bg"><span class="color-red">*</span>数量：</td>
                        <td>
                            <FormItem prop="number"> 
                                <InputNumber class="input-number-no-operate" v-model="bind.number" :parser="NumberDecimal" :min="0"></InputNumber>
                            </FormItem>
                        </td>
                    </tr>
                    <tr>
                        <td class="left-bg"><span class="color-red">*</span>单件重量：</td>
                        <td>
                            <FormItem prop="perAmount"> 
                                <InputNumber  class="input-number-no-operate" v-model="bind.perAmount" :parser="weightDecimal" :min="0"></InputNumber>
                            </FormItem>
                        </td>
                        <td class="left-bg"><span class="color-red">*</span>库区：</td>
                        <td>
                            <FormItem prop="storageAreaId"> 
                                <Select filterable v-model="bind.storageAreaId" :label-in-value="true" @on-change="getStorageArea">
                                    <Option v-for="(item,index) in bind.storageAreaList" :value="item.value" :key="index">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                        </td>
                    </tr>
                    <tr>
                        <td class="left-bg"><span class="color-red">*</span>库位：</td>
                        <td>
                            <FormItem prop="storagePlaceId"> 
                                <Select filterable v-model="bind.storagePlaceId" :label-in-value="true" @on-change="getStoragePlace">
                                    <Option v-for="(item,index) in bind.storagePlaceList" :value="item.value" :key="index">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                        </td>
                        <td class="left-bg">包装：</td>
                        <td><Input v-model="bind.wrap"></Input></td>
                    </tr>                   
                    <tr>
                        <td class="left-bg">外观：</td>
                        <td><Input v-model="bind.appearance"></Input></td>
                        <td class="left-bg">钢卷号：</td>
                        <td><Input v-model="bind.baleNumber"></Input></td>
                    </tr>
                </tbody>
            </table>
        </Form>
        <Row >
            <Col :xs="2" :sm="2" :md="2" offset="19"><Button type="text" :long="true"  @click="cancle" >取消</Button></Col>
            <Col :xs="2" :sm="2" :md="2" offset="1"><Button type="primary" :long="true" @click="submit" >提交</Button></Col>
        </Row>
    </div>
</template>
<script>
import { adjustInventory,getParentInventory } from '@/api/storage'
import {decimalInput} from "@/libs/util"
import { commonBrandInfos,commonBreedInfos,commonMaterialInfos,commonSpecInfos,commonAreasByWarehouseId,commonLocationByWarehouseId } from '@/api/common'
export default {
    props:{
        data:Object,
    },
    name: "StorageFix",
    data() {
        return {
            bind:{
                itemid:0,//*库存id 
                ownerName:'',
                inTime:null,
                warehouseName:'',
                type:0,//类型
                inventoryType:0,
                code:'',//编号
                brandCode:'',
                brandName:'',
                breedCode:'',
                breedName:'',
                materialCode:'',
                tempmaterialCode:'',//下拉框数组清空后，绑定的materialCode会被设为undefine
                materialName:'',
                storageArea:'',
                storageAreaId:'',
                storagePlace:'',
                storagePlaceId:'',
                specCode:'',
                specName:'',
                saveSpecName:'',
                number:0,//件数
                perAmount:0,//件重
                wrap:'',//包装
                appearance:'',//外观
                baleNumber:'',//钢卷号
                brandNameList:[],
                breedNameList:[],
                materialNameList:[],
                storageAreaList:[],
                storagePlaceList:[],
            },
            ruleValidate: {
                breedCode: [
                    { required: true, message: '请选择品名',trigger: 'change'}
                ],
                materialCode: [
                    { required: true, message: '请选择材质',trigger: 'change'},
                ],
                specName: [
                    { required: true, message: '请填写规格',trigger: 'blur'}
                ],
                number: [
                    { type:"number",required: true, message: '请填写数量',trigger: 'blur'}
                ],
                perAmount: [
                    { type:"number",required: true, message: '请填写单件重量',trigger: 'blur'}
                ],
                storageAreaId: [
                    { type:"number",required: true, message: '请选择库区',trigger: 'change'}
                ],
                storagePlaceId: [
                    { type:"number",required: true, message: '请选择库位',trigger: 'change'}
                ]
            },
            parent:{}
        };
    },
    computed:{
        hwtype:function(){
            if(this.bind.type==0){
                return '原料'
            }else if(this.bind.type==1){
                return '成品'
            }else if(this.bind.type==2){
                return '废料'
            }
        },
        yctype:function(){
            if(this.bind.inventoryType==0){
                return '原材'
            }else if(this.bind.inventoryType==1){
                return '余卷'
            }else if(this.bind.inventoryType==2){
                return '分条料'
            }else if(this.bind.inventoryType==3){
                return '开平板'
            }else if(this.bind.inventoryType==4){
                return '头尾板'
            }else if(this.bind.inventoryType==5){
                return '边丝'
            }
        },
        bindBreedCode:function(){
            return this.bind.breedCode;
        },
        bindmaterialCode:function(){
            return this.bind.materialCode;
        }
    },
    watch:{
        data:{
            handler(newValue,oldValue){
                if(newValue.id){//关闭modal清空data，id为undefine则为打开
                    for(let i in newValue){//   存在就赋值。
                        if(this.bind.hasOwnProperty(i)){
                            this.bind[i]=newValue[i]
                        }
                    }
                    if(this.bind.type==1){
                        getParentInventory({inventoryItemId:newValue.id}).then(res=>{
                            if(res.data.code=='200'){
                                if(res.data.data!=null){
                                    this.parent=res.data.data;
                                }
                            }
                        })
                    }
                    if(this.bind.brandNameList.length==0){//没有产地就加载
                        this.getbrandNameList();
                    }
                    if(this.bind.breedNameList.length==0){//没有品名就加载
                        this.getcommonBreedInfos();
                    }
                    if(this.bind.storageAreaList.length==0){//没有库区就加载
                        this.getAreas();
                    }
                    if(this.bind.storagePlaceList.length==0){//没有库位就加载
                        this.getLocation();
                    }
                    this.bind.tempmaterialCode=newValue.materialCode
                    this.bind.saveSpecName=newValue.specName
                    this.bind.itemid=newValue.id
                    this.having(this.bind.brandNameList,this.bind.brandNameAndcode)
                    this.$refs.form.validate();
                }
            },
            deep:true
        },
        bindBreedCode:function(){
            if(this.bind.breedCode){
                this.getcommonMaterialInfos();
            }
        },
        bindmaterialCode:function(){
            if(!this.bindmaterialCode){
                this.bind.materialCode=this.bind.tempmaterialCode
                this.$refs.form.validate();
            };
        }
    },
    methods: {
        getBrand:function(value){
            if(value){
                this.bind.brandName=value.label
            }
        },
        getBreed:function(value){
            if(value){
                this.bind.breedName=value.label
            }
        },
        getMarerial:function(value){
            if(value){
                this.bind.materialName=value.label
            }
        },
        getStorageArea:function(value){
            if(value){
                this.bind.storageArea=value.label
            }
        },
        getStoragePlace:function(value){
            if(value){
                this.bind.storagePlace=value.label
            }
        },
        weightDecimal:function(value){
            return decimalInput(value,12,4);
        },
        NumberDecimal:function(value){
            return decimalInput(value,12,0);
        },
        having:function(List,target){
            let having=false;
            if(target){
                List.forEach((item,index)=>{
                    having=item.value===target
                })
                if(!having){
                    List.push({
                        value:target,
                        label:target.split('-')[1]
                    })
                }
            }
        },
        getbrandNameList:function(){
            commonBrandInfos().then(res=>{
                for(let i=0;i<res.data.data.length;i++){
                    this.bind.brandNameList.push({
                        value:res.data.data[i].brandCode,
                        label:res.data.data[i].brandName
                    })
                }
            })
        },
        getcommonBreedInfos:function(){
            commonBreedInfos().then(res=>{
                for(let i=0;i<res.data.data.length;i++){
                    this.bind.breedNameList.push({
                        value:res.data.data[i].breedCode,
                        label:res.data.data[i].breedName
                    })
                }
            })
        },
        getcommonMaterialInfos:function(){
            this.bind.materialNameList=[];
            commonMaterialInfos({breedCode:this.bind.breedCode}).then(res=>{
                for(let i=0;i<res.data.data.length;i++){
                    this.bind.materialNameList.push({
                        value:res.data.data[i].materialCode,
                        label:res.data.data[i].materialName
                    })
                }
            })
        },
        getAreas:function(){
            commonAreasByWarehouseId().then(res=>{
                for(let i=0;i<res.data.data.length;i++){
                    this.bind.storageAreaList.push({
                        value:res.data.data[i].id,
                        label:res.data.data[i].name
                    })
                }
            })
        },
        getLocation:function(){
            commonLocationByWarehouseId().then(res=>{
                for(let i=0;i<res.data.data.length;i++){
                    this.bind.storagePlaceList.push({
                        value:res.data.data[i].id,
                        label:res.data.data[i].name
                    })
                }
            })
        },
        submit:function(){
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.$emit('contralmodal',false);
                    this.updateStorage();
                }
            })
        },
        cancle:function(){
            this.$emit('contralmodal',false);
        },
        updateStorage:function(){
            let data={
                itemId:this.bind.itemid,
                type:this.bind.type,
                code:this.bind.code,
                brandCode:this.bind.brandCode,
                brandName:this.bind.brandName,
                breedCode: this.bind.breedCode,
                breedName: this.bind.breedName,
                materialCode:this.bind.materialCode,
                materialName:this.bind.materialName,
                specCode:this.bind.specName==this.bind.saveSpecName?this.bind.specCode:0,
                specName:this.bind.specName,
                storageArea:this.bind.storageArea,
                storageAreaId:this.bind.storageAreaId,
                storagePlace:this.bind.storagePlace,
                storagePlaceId:this.bind.storagePlaceId,
                number:this.bind.number,
                perAmount:this.bind.perAmount,
                wrap:this.bind.wrap,
                appearance:this.bind.appearance,
                baleNumber:this.bind.baleNumber,
            };
            adjustInventory(data).then(res=>{
                if(res.data.code=="200"){
                    this.$Message.success({
                        content:'信息修改成功',
                        duration:1
                    });
                    this.$emit('updateList');
                }else{
                    this.$Message.error(res.data.msg);
                    
                }
            })
        },
    }
};
</script>
<style scoped>
.ivu-row{
    margin: 12px 18px;
}
.ivu-form-item{
    margin-bottom: 0px;
}
.tiaozheng >>> .ivu-form-item-error-tip{
    position: relative;
}
.tiaozheng >>> .ivu-input-number{
    width: 100%;
}
.tiaozheng td span{
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
}
.ivu-col{
    margin-right:-33px;
}
</style>


