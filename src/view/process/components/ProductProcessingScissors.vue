<template>
    <!-- 加工中纵剪 -->
    <Row :gutter="10">
        <Col span="24">
            <div class="table-title margin-top-20 margin-bottom-10">加工信息</div>
        </Col>
        <Col span="24">
            <div class="table-content">
                <div class="ivu-table table1">
                    <table cellspacing="0" cellpadding="0" border="0" width="100%">
                        <thead>
                            <tr>
                                <th colspan="7" class="text-center"><div class="ivu-table-cell">母卷信息</div></th>
                                <th colspan="4" class="text-center"> <div class="ivu-table-cell">加工信息</div></th>
                                <th colspan="6" class="text-center"><div class="ivu-table-cell">实际加工数据录入</div></th>
                                <th colspan="8" class="text-center"><div class="ivu-table-cell">废料数据录入</div></th>
                            </tr>
                            <tr>
                                <th><div class="ivu-table-cell">编号</div></th>
                                <th><div class="ivu-table-cell">母卷信息</div></th>
                                <th><div class="ivu-table-cell">规格</div></th>
                                <th class="text-right"><div class="ivu-table-cell">数量(件)</div></th>
                                <th class="text-right"><div class="ivu-table-cell">重量(吨)</div></th>
                                <th class="text-right"><div class="ivu-table-cell">用料(吨)</div></th>
                                <th class="text-right"><div class="ivu-table-cell">分段</div></th>
                                <th class="text-right"><div class="ivu-table-cell">加工宽度(mm)</div></th>
                                <th class="text-right"><div class="ivu-table-cell">加工数量(条)</div></th>
                                <th class="text-right"><div class="ivu-table-cell">理重(吨)</div></th>
                                <th class="text-right"><div class="ivu-table-cell">单件理重(吨)</div></th>
                                <th><div class="ivu-table-cell">实际加工数量(条)</div></th>
                                 <th><div class="ivu-table-cell">实际宽度(mm)</div></th>
                                <th><div class="ivu-table-cell">
                                    <span class="color-red">*</span>
                                    <span>库区</span>
                                    <span class="tb-link" @click="tableCopy('storageAreaId')">
                                        [复制库区]
                                    </span>
                                    </div>
                                </th>
                                <th><div class="ivu-table-cell">
                                    <span class="color-red">*</span>
                                    <span>库位</span>
                                    <span class="tb-link" @click="tableCopy('storagePlaceId')">
                                        [复制库位]
                                    </span>
                                    </div>
                                </th>
                                <th><div class="ivu-table-cell">打包号</div></th>
                                <th><div class="ivu-table-cell">描述</div></th>
                                <th style="width: 65px;"><div class="ivu-table-cell">操作</div></th>
                                <th style="width: 160px;"><div class="ivu-table-cell"><span class="color-red">*</span>废料类型</div></th>
                                <th style="width: 160px;"><div class="ivu-table-cell"><span class="color-red">*</span>规格</div></th>
                                <th style="width: 160px;"><div class="ivu-table-cell"><span class="color-red">*</span>数量</div></th>
                                <th class="text-right" style="width: 160px;"><div class="ivu-table-cell">总重量</div></th>
                                <th style="width: 160px;"><div class="ivu-table-cell"><span class="color-red">*</span>库区</div></th>
                                <th style="width: 160px;"><div class="ivu-table-cell"><span class="color-red">*</span>库位</div></th>
                                <th style="width: 168px;"><div class="ivu-table-cell">描述</div></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="tableData1.length == 0">
                                <td
                                colspan="14"
                                class="text-center"
                                >
                                <div class="ivu-table-cell">无数据</div>
                                </td>
                            </tr>
                            <template v-for="(data, index) in tableData1">
                                <tr :key="data.materialId" :class="{'tr-even': index%2==1}">
                                    <td :rowspan="data.processProductsCopy.length>0?data.processProductsCopy.length:1"><div class="ivu-table-cell">{{data.inventoryCode}}</div></td>
                                    <td :rowspan="data.processProductsCopy.length>0?data.processProductsCopy.length:1">
                                        <div class="ivu-table-cell">
                                            <div>钢卷号/捆包号：{{data.baleNumber}}</div>
                                            <div>产地： {{data.brandName}}</div>
                                            <div>品名：{{data.breedName}}</div>
                                            <div>材质： {{data.materialName}}</div>
                                            <div>库区库位：{{data.storageArea +' '+data.storagePlace}}</div>
                                            <div>包装：{{data.wrap}}</div>
                                        </div>
                                    </td>
                                    <td :rowspan="data.processProductsCopy.length>0?data.processProductsCopy.length:1"><div class="ivu-table-cell">{{data.specName}}</div></td>
                                    <td class="text-right" :rowspan="data.processProductsCopy.length>0?data.processProductsCopy.length:1"><div class="ivu-table-cell">{{data.number}}</div></td>
                                    <td class="text-right" :rowspan="data.processProductsCopy.length>0?data.processProductsCopy.length:1"><div class="ivu-table-cell">{{data.weight|formatWeight}}</div></td>
                                    <td class="text-right" :rowspan="data.processProductsCopy.length>0?data.processProductsCopy.length:1"><div class="ivu-table-cell">{{data.processWeight|formatWeight}}</div></td>
                                    <td class="text-right" :rowspan="data.processProductsCopy.length>0?data.processProductsCopy.length:1"><div class="ivu-table-cell">{{data.sectionNumber}}</div></td>
                                    <td class="text-right"><div class="ivu-table-cell" v-if="data.processProductsCopy.length>0">{{data.processProductsCopy[0].specWidth|formatPrice}}</div></td>
                                    <td class="text-right"><div class="ivu-table-cell" v-if="data.processProductsCopy.length>0">{{data.processProductsCopy[0].number}}</div></td>
                                    <td class="text-right"><div class="ivu-table-cell" v-if="data.processProductsCopy.length>0">{{data.processProductsCopy[0].weight|formatWeight}}</div></td>
                                    <td class="text-right"><div class="ivu-table-cell" v-if="data.processProductsCopy.length>0">{{data.processProductsCopy[0].perWeight|formatWeight}}</div></td>
                                    <td><div class="ivu-table-cell" v-if="data.processProductsCopy.length>0">
                                        <InputNumber v-model="data.processProductsCopy[0].realNumber" :precision="0" :min="0" :parser="inputNum" @on-change="changeRealNumber($event,data.processProductsCopy[0].key, 0)"></InputNumber>
                                        </div>
                                    </td>
                                    <td><div class="ivu-table-cell" v-if="data.processProductsCopy.length>0">
                                        <InputNumber v-model="data.processProductsCopy[0].realWidth" :min="0" :parser="inputDecimal" class="input-number-no-operate" @on-change="changeRealWidth($event,data.processProductsCopy[0].key, 0)"></InputNumber>
                                        </div>
                                    </td>
                                    <td><div class="ivu-table-cell" v-if="data.processProductsCopy.length>0">
                                        <Select v-model="data.processProductsCopy[0].storageAreaId" clearable @on-change="changeSelect('storageAreaId',data.processProductsCopy[0].packCode, data.processProductsCopy[0].storageAreaId)" style="min-width:120px" :class="{'error-border':isValidate&&(data.processProductsCopy[0].storageAreaId==''||data.processProductsCopy[0].storageAreaId==undefined)}">
                                            <Option v-for="item in areaOptions" :value="item.id" :key="'a'+item.id">{{ item.name }}</Option>
                                        </Select>
                                        <div class="color-red" v-if="isValidate&&(data.processProductsCopy[0].storageAreaId==''||data.processProductsCopy[0].storageAreaId==undefined)">请选择库区</div>
                                        </div>
                                    </td>
                                    <td><div class="ivu-table-cell" v-if="data.processProductsCopy.length>0">
                                        <Select v-model="data.processProductsCopy[0].storagePlaceId" clearable @on-change="changeSelect('storagePlaceId',data.processProductsCopy[0].packCode, data.processProductsCopy[0].storagePlaceId)" style="min-width:120px" :class="{'error-border':isValidate&&(data.processProductsCopy[0].storagePlaceId==''||data.processProductsCopy[0].storagePlaceId==undefined)}">
                                            <Option v-for="item in bitOptions" :value="item.id" :key="'b'+item.id">{{ item.name }}</Option>
                                        </Select>
                                        <div class="color-red" v-if="isValidate&&(data.processProductsCopy[0].storagePlaceId==''||data.processProductsCopy[0].storagePlaceId==undefined)">请选择库位</div>
                                        </div>
                                    </td>
                                    <td><div class="ivu-table-cell" v-if="data.processProductsCopy.length>0">{{data.processProductsCopy[0].packCode?data.processProductsCopy[0].packCode:'未打包'}}</div>
                                    <td><div class="ivu-table-cell" v-if="data.processProductsCopy.length>0">
                                        <Input v-model="data.processProductsCopy[0].note" type="textarea" @on-change="changeSelect" :maxlength="30"></Input>
                                        </div>
                                    </td>
                                    <td :rowspan="data.processProductsCopy.length>0?data.processProductsCopy.length:1" colspan="8">
                                        <div class="ivu-table-cell">
                                            <template v-if="data.processScrapList.length == 0">
                                                <div class="ivu-table-cell text-center"><Icon
                                                    class="tb-link-add color-green"
                                                    type="md-add-circle"
                                                    :size="20"
                                                    @click="addProcessScrap(index)"
                                                    ></Icon></div>
                                            </template>
                                            <div v-else class="table-content ivu-table table2">
                                                <table cellspacing="0" cellpadding="0" border="0" width="100%">
                                                    <template v-for="(processScrap, m) in data.processScrapList">
                                                        <tr :key="'processScrap' + m">
                                                            <td><div class="ivu-table-cell"><Icon
                                                                class="tb-link-add color-green"
                                                                type="md-add-circle"
                                                                :size="20"
                                                                @click="addProcessScrap(index)"
                                                                ></Icon>
                                                                <Icon
                                                                class="tb-link-remove color-red"
                                                                type="md-remove-circle"
                                                                :size="20"
                                                                @click="removeProcessScrap(index, m)"
                                                                ></Icon></div></td>
                                                            <td><div class="ivu-table-cell">
                                                                <Select v-model="processScrap.scrapType"  @on-change="changeScrapType(index, m)" :transfer="true" style="min-width:120px">
                                                                    <Option v-for="item in scrapTypeList" :value="item.value" :key="'scrapType'+item.value">{{ item.label }}</Option>
                                                                </Select>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div v-if="processScrap.scrapType == 4" class="ivu-table-cell">
                                                                    {{processScrap.thick}}*{{processScrap.width}}*
                                                                    <InputNumber v-model="processScrap.long" :parser="inputPrice" :min="0" @on-change="changeInput" :class="{'width-70':true,'input-number-no-operate':true,'error-border':isValidate&&(processScrap.long==''||processScrap.long==undefined)}"></InputNumber>
                                                                    <div class="color-red" v-if="isValidate&&(processScrap.long==''||processScrap.long==undefined)">请输入大于0的数字</div>
                                                                </div>
                                                                <div v-else-if="processScrap.scrapType == 5" class="ivu-table-cell">
                                                                     {{processScrap.thick}}*
                                                                    <InputNumber v-model="processScrap.width" :parser="inputPrice" :min="0" @on-change="changeInput" :class="{'width-70':true,'input-number-no-operate':true,'error-border':isValidate&&(processScrap.width==''||processScrap.width==undefined)}"></InputNumber>
                                                                    *{{processScrap.long}}
                                                                    <div class="color-red" v-if="isValidate&&(processScrap.width==''||processScrap.width==undefined)">请输入大于0的数字</div>
                                                                </div>
                                                            </td>
                                                            <td><div class="ivu-table-cell">
                                                                 <InputNumber v-model="processScrap.number" :precision="0" :min="0" :parser="inputNum" @on-change="changeSelect" :class="{'error-border':isValidate&&(processScrap.number==null||processScrap.number==undefined)}"></InputNumber>
                                                                 <div class="color-red" v-if="isValidate&&(processScrap.number==null||processScrap.number==undefined||processScrap.number==0)">请输入大于0的数字</div>
                                                                </div>
                                                            </td>
                                                            <td class="text-right"><div class="ivu-table-cell">{{processScrap.weight|formatWeight}}</div></td>
                                                            <td><div class="ivu-table-cell">
                                                                <Select v-model="processScrap.storageAreaId"  @on-change="changeSelect" :transfer="true" style="min-width:120px" :class="{'error-border':isValidate&&(processScrap.storageAreaId==''||processScrap.storageAreaId==undefined)}">
                                                                    <Option v-for="item in areaOptions" :value="item.id" :key="'e'+item.id">{{ item.name }}</Option>
                                                                </Select>
                                                                <div class="color-red" v-if="isValidate&&(processScrap.storageAreaId==''||processScrap.storageAreaId==undefined)">请选择库区</div>
                                                                </div>
                                                            </td>
                                                            <td><div class="ivu-table-cell">
                                                                <Select v-model="processScrap.storagePlaceId" @on-change="changeSelect" :transfer="true" style="min-width:120px" :class="{'error-border':isValidate&&(processScrap.storagePlaceId==''||processScrap.storagePlaceId==undefined)}">
                                                                    <Option v-for="item in bitOptions" :value="item.id" :key="'f'+item.id">{{ item.name }}</Option>
                                                                </Select>
                                                                <div class="color-red" v-if="isValidate&&(processScrap.storagePlaceId==''||processScrap.storagePlaceId==undefined)">请选择库位</div>
                                                                </div>
                                                            </td>
                                                            <td class="text-right">
                                                                <div class="ivu-table-cell"><Input v-model="processScrap.note" @on-change="changeSelect" type="textarea" :maxlength="200"></Input></div>
                                                            </td>
                                                        </tr>
                                                    </template>
                                                </table>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <template v-for="(process, i) in data.processProductsCopy">
                                    <tr :key="'abc'+index+i" v-if="i > 0" :class="{'tr-even': getCurentRowIndex(process.key)%2==1}">
                                        <td class="text-right"><div class="ivu-table-cell">{{process.specWidth|formatPrice}}</div></td>
                                        <td class="text-right"><div class="ivu-table-cell">{{process.number}}</div></td>
                                        <td class="text-right"><div class="ivu-table-cell">{{process.weight|formatWeight}}</div></td>
                                        <td class="text-right"><div class="ivu-table-cell">{{process.perWeight|formatWeight}}</div></td>
                                        <td><div class="ivu-table-cell">
                                            <InputNumber v-model="process.realNumber" :precision="0" :min="0" :parser="inputNum" @on-change="changeRealNumber($event, process.key, i)"></InputNumber>
                                            </div>
                                        </td>
                                        <td><div class="ivu-table-cell">
                                            <InputNumber v-model="process.realWidth" :min="0" :parser="inputDecimal" class="input-number-no-operate"  @on-change="changeRealWidth($event,process.key, i)"></InputNumber>
                                        </div>
                                    </td>
                                        <td><div class="ivu-table-cell">
                                            <Select v-model="process.storageAreaId" clearable @on-change="changeSelect('storageAreaId', process.packCode, process.storageAreaId)" style="min-width:120px" :class="{'error-border':isValidate&&(process.storageAreaId==''||process.storageAreaId==undefined)}">
                                                <Option v-for="item in areaOptions" :value="item.id" :key="'c'+item.id">{{ item.name }}</Option>
                                            </Select>
                                            <div class="color-red" v-if="isValidate&&(process.storageAreaId==''||process.storageAreaId==undefined)">请选择库区</div>
                                            </div>
                                        </td>
                                        <td><div class="ivu-table-cell">
                                            <Select v-model="process.storagePlaceId" clearable @on-change="changeSelect('storagePlaceId', process.packCode, process.storagePlaceId)" style="min-width:120px" :class="{'error-border':isValidate&&(process.storagePlaceId==''||process.storagePlaceId==undefined)}">
                                                <Option v-for="item in bitOptions" :value="item.id" :key="'d'+item.id">{{ item.name }}</Option>
                                            </Select>
                                            <div class="color-red" v-if="isValidate&&(process.storagePlaceId==''||process.storagePlaceId==undefined)">请选择库位</div>
                                            </div>
                                        </td>
                                        <td><div class="ivu-table-cell">{{process.packCode?process.packCode:'未打包'}}</div>
                                        <td><div class="ivu-table-cell">
                                            <Input v-model="process.note" type="textarea" @on-change="changeSelect" :maxlength="30"></Input>
                                        </div>
                                        </td>
                                    </tr>
                                </template>
                            </template>
                            <tr class="sum" v-if="tableData1.length >0">
                                <td><div class="ivu-table-cell">合计</div></td>
                                <td><div class="ivu-table-cell"></div></td>
                                <td><div class="ivu-table-cell"></div></td>
                                <td class="text-right"><div class="ivu-table-cell">{{sumCol9}}</div></td>
                                <td class="text-right"><div class="ivu-table-cell">{{sumCol10|formatWeight}}</div></td>
                                <td class="text-right"><div class="ivu-table-cell">{{sumCol11|formatWeight}}</div></td>
                                <td><div class="ivu-table-cell"></div></td>
                                <td><div class="ivu-table-cell"></div></td>
                                <td class="text-right"><div class="ivu-table-cell">{{sumColl2}}</div></td>
                                <td class="text-right"><div class="ivu-table-cell">{{sumColl3|formatWeight}}</div></td>
                                <td><div class="ivu-table-cell"></div></td>
                                <td><div class="ivu-table-cell">{{sumAmount}}</div></td>
                                <td><div class="ivu-table-cell"></div></td>
                                <td><div class="ivu-table-cell"></div></td>
                                <td><div class="ivu-table-cell"></div></td>
                                <td><div class="ivu-table-cell"></div></td>
                                <td><div class="ivu-table-cell"></div></td>
                                <td colspan="8"></td>
                            </tr>
                    </tbody>
                    </table>
                </div>
            </div>
        </Col>
    </Row>
</template>

<script>
import {decimalInput,formatWeight} from '@/libs/util';
import { commonAreasByWarehouseId, commonLocationByWarehouseId } from '@/api/common';
export default {
    name: "ProductProcessingScissors",
    props: {
        validate: Boolean,
        propData: Array,
        processStatus: Number
    },
    data() {
        return {
            isValidate: this.validate,
            //实际加工数量汇总
            sumAmount: 0,
            sumCol9: 0,
            sumCol10: 0,
            sumCol11: 0,
            sumColl2: 0,
            sumColl3: 0,
            //库区下拉框列表
            areaOptions: [],
            //库位下拉框列表
            bitOptions: [],
            tableData1: this.propData,
            status: this.processStatus,
            scrapTypeList: [{
                label: '头尾板',
                value: 4
            },{
                label: '边丝',
                value: 5
            }]
        };
    },
    watch: {
        propData: {
           handler(newVal, oldVal) {
               this.tableData1 = JSON.parse(JSON.stringify(newVal));
               this.getData();
           },
           deep: true
        }, 
        validate(newVal, oldVal) {
            this.isValidate = newVal;
        },
        processStatus(newVal, oldVal) {
            this.status = newVal;
            this.getData();
        }
    },
    methods: {
        getOptions() {
            commonAreasByWarehouseId().then(res => {
                if(res.data.code == '200') {
                    this.areaOptions = res.data.data;
                }
            })
            commonLocationByWarehouseId().then(res => {
                if(res.data.code == '200') {
                    this.bitOptions = res.data.data;
                }
            })
        },
        changeRealNumber(val, key, index) {
            this.tableData1[this.getCurentRowIndex(key)].processProductsCopy[index].realNumber = val;
            this.computedWeightPerWeight();
            this.$emit('change', this.formatData())
        },
        computedWeightPerWeight() {
            this.sumAmount = 0;
            this.tableData1.map((o,i) => {
                //原卷宽度
                let originalWidth = Number(o.specName.split('*')[1]);
                //头尾板重量
                let totalWeight = 0;
                o.processScrapList.map(o1 => {
                    if(o1.scrapType == 4) {
                        //头尾板
                       o1.weight = formatWeight((Number(o1.thick) * Number(o1.width) * Number(o1.long) * 7.85 * o1.number)/1000000000);
                       totalWeight += Number(o1.weight);
                    }
                }) 
                o.processProductsCopy.map((o1,j) => {
                    this.sumAmount += Number(o1.realNumber);
                    //单件理重 = 理重/实际加工数量
                    let realNumber = Number(o1.number);
                    
                    if(o1.realNumber !="" && o1.realNumber != 0) {
                        realNumber=Number(o1.realNumber);
                    }
                    
                    // 单件理重=加工宽度/原卷宽度*（原卷重量-头尾板重量）/分段数
                    // 理重=单件理重*实际加工数量
                    this.tableData1[i].processProductsCopy[j].perWeight = o1.specWidth/originalWidth*(o.weight-totalWeight)/o.sectionNumber;
                    o1.weight = formatWeight(this.tableData1[i].processProductsCopy[j].perWeight*realNumber);
                    
                })
            })
        },
        inputDecimal(value){
            return decimalInput(value,8,2)
        },
        inputNum(value) {
            return decimalInput(value,8,0);
        },
        inputPrice(value){
            return decimalInput(value,14,2)
        },
        changeRealWidth(val, key, index) {
            this.tableData1[this.getCurentRowIndex(key)].processProductsCopy[index].realWidth = val;
            this.$emit('change', this.formatData())
        },
        changeSelect(prop, packCode, id) {
            if(packCode) {
                this.tableData1.map(o => {
                    o.processProductsCopy.map(o1 => {
                        if(o1.packCode == packCode) {
                            o1[prop] = id;
                        }
                    })
                })
            }
            this.$forceUpdate();
            this.$emit('change', this.formatData())
        },
        changeScrapType(tableIndex, scrapIndex) {
            let scrapObj = this.tableData1[tableIndex].processScrapList[scrapIndex];
            if(scrapObj.scrapType == 4) {
                scrapObj.width = this.tableData1[tableIndex].specName.split("*")[1];
                scrapObj.long = null;
            } else if(scrapObj.scrapType == 5) {
                scrapObj.width = null;
                scrapObj.long = "C";
            }
            this.$emit('change', this.formatData());
        },
        tableCopy(colName) {
            let copy = this.tableData1[0].processProductsCopy[0][colName];
            let tableDataCopy = JSON.parse(JSON.stringify(this.tableData1))
            tableDataCopy.map((o, i) => {
                o.processProductsCopy.map((o1, j) => {
                    this.tableData1[i].processProductsCopy[j][colName] = copy;
                });
            })
            this.$emit('change', this.formatData())
        },
        formatData() {
            let arr = [];
            let processMaterialScrapList = [];
            this.tableData1.map(o => {
                let totalLong = 0;
                o.processProductsCopy.map(o1 => {
                    let temp = {
                        id: o1.productId,
                        note: o1.note,
                        realWidth: Number(o1.realWidth),
                        realNumber: o1.realNumber,
                        storageAreaId: o1.storageAreaId,
                        storageArea: '',
                        storagePlaceId: o1.storagePlaceId,
                        storagePlace: '',
                        packItemId: o1.packItemId
                    }
                    this.areaOptions.map(o2 => {
                        if(o1.storageAreaId == o2.id) {
                            temp.storageArea = o2.name;
                        }
                    })
                    this.bitOptions.map(o2 => {
                        if(o1.storagePlaceId == o2.id) {
                            temp.storagePlace = o2.name;
                        }
                    })
                    arr.push(temp)
                })

                let processMaterial = {
                    processMaterialId: o.materialId,
                    processScrapList: []
                }
                //原卷宽度
                let specNameWidth = o.specName.split("*")[1]?o.specName.split("*")[1]:0;
                //头尾板重量总和
                let totalWeight = 0;
                o.processScrapList.map(o1 => {
                    if(o1.scrapType == 4) {
                        //头尾板
                       o1.weight = formatWeight((Number(o1.thick) * Number(o1.width) * Number(o1.long) * 7.85 * o1.number)/1000000000);
                       totalWeight += Number(o1.weight);
                    }
                    this.areaOptions.map(o2 => {
                        if(o1.storageAreaId == o2.id) {
                            o1.storageArea = o2.name;
                        }
                    })
                    this.bitOptions.map(o2 => {
                        if(o1.storagePlaceId == o2.id) {
                            o1.storagePlace = o2.name;
                        }
                    }) 
                })
                //计算边丝重量
                o.processScrapList.map(o1 => {
                    o1.specName = o1.thick + "*" + o1.width + "*" + o1.long;
                     if(o1.scrapType == 5) {
                        //边丝
                       o1.weight = formatWeight((o.processWeight-totalWeight)*( Number(o1.width)/Number(o.specName.split("*")[1]))*o1.number);
                    }
                })
                processMaterial.processScrapList = JSON.parse(JSON.stringify(o.processScrapList));
                processMaterialScrapList.push(processMaterial);
            })
            this.computedWeightPerWeight();
            return {processProductList:arr,processMaterialScrapList:processMaterialScrapList};
        },
        getData() {
            this.sumAmount = 0;
            this.sumCol9 = 0;
            this.sumCol10 = 0;
            this.sumCol11 = 0;
            this.sumColl2 = 0;
            this.sumColl3 = 0;
            if(this.tableData1.length > 0) {
                this.tableData1.map((o, i) => {
                    this.sumCol9 += Number(o.number);
                    this.sumCol10 += Number(o.weight);
                    this.sumCol11 += Number(o.processWeight);
                    let specNameArr = o.specName.split('*');
                    o.processProductsCopy = [];
                    o.processScrapList = [];

                    o.processProducts.map(o1 => {
                        o1.materialId = o.materialId;
                        if(o1.inventoryType == 2 || o1.inventoryType == 3 || o1.inventoryType == 0 || o1.inventoryType == 1) {
                            o1.storageAreaId = o1.storageAreaId ? o1.storageAreaId:this.$store.state.user.warehouse.processDefaultAreaId;
                            o1.storagePlaceId = o1.storagePlaceId ? o1.storagePlaceId:this.$store.state.user.warehouse.processDefaultLocationId;
                            o.processProductsCopy.push(o1)
                        }
                        if(o1.inventoryType == 4 || o1.inventoryType == 5) {
                            let scrapSpecNameArr = o1.specName.split("*");
                            o.processScrapList.push({
                                note: o1.note,
                                number: o1.number,
                                scrapType: o1.inventoryType,
                                specName: o1.specName,
                                thick: o1.specName?scrapSpecNameArr[0]:specNameArr[0],
                                width: o1.specName?Number(scrapSpecNameArr[1]):Number(specNameArr[1]),
                                long: Number(scrapSpecNameArr[2])?Number(scrapSpecNameArr[2]):"C",
                                storageArea: o1.storageArea,
                                storageAreaId: o1.storageAreaId ? o1.storageAreaId:this.$store.state.user.warehouse.trashDefaultAreaId,
                                storagePlace: o1.storagePlace,
                                storagePlaceId: o1.storagePlaceId?o1.storagePlaceId:this.$store.state.user.warehouse.trashDefaultLocationId,
                                weight: o1.weight,
                            })
                        }
                    })

                    if(o.processScrapList.length == 0) {
                        o.processScrapList.push({
                            note: "",
                            number: null,
                            scrapType: 4,
                            specName: "",
                            thick: Number(specNameArr[0]),
                            width: Number(specNameArr[1]),
                            long: null,
                            storageArea: "",
                            storageAreaId: this.$store.state.user.warehouse.trashDefaultAreaId,
                            storagePlace: "",
                            storagePlaceId: this.$store.state.user.warehouse.trashDefaultLocationId,
                            weight: 0
                        })
                    }

                    o.processProductsCopy.map((o1,j) => {
                        this.sumColl2 += Number(o1.number);
                        this.sumColl3 += Number(o1.weight);
                        this.sumAmount += Number(o1.realNumber);

                         //加工状态待录入数据时，解决后台未计算单件理重、实际宽度默认值问题
                        if(this.status == 2) {
                            this.tableData1[i].processProductsCopy[j].realWidth = Number(o1.specWidth);
                            let realNumber = Number(o1.number);
                            if(o1.realNumber !="" && o1.realNumber != 0) {
                                realNumber=Number(o1.realNumber);
                            }
                            this.tableData1[i].processProductsCopy[j].perWeight = o1.weight/realNumber;
                        }
                    })
                })
            }
        },
        addProcessScrap(tableIndex) {
            let specNameArr = this.tableData1[tableIndex].specName.split('*');
            this.tableData1[tableIndex].processScrapList.push({
                note: "",
                number: null,
                scrapType: 4,
                specName: "",
                thick: Number(specNameArr[0]),
                width: Number(specNameArr[1]),
                long: null,
                storageArea: "",
                storageAreaId: this.$store.state.user.warehouse.trashDefaultAreaId,
                storagePlace: "",
                storagePlaceId: this.$store.state.user.warehouse.trashDefaultLocationId,
                weight: 0
            });
            this.$forceUpdate();
            this.$emit('change', this.formatData())
        },
        removeProcessScrap(tableIndex,processScrapIndex) {
            this.tableData1[tableIndex].processScrapList.splice(processScrapIndex,1);
            this.$forceUpdate();
            this.$emit('change', this.formatData())
        },
        changeInput() {
            this.$forceUpdate();
            this.$emit('change', this.formatData())
        },
        getCurentRowIndex(processKey) {
            let index = 0;
            this.tableData1.map((o, i) => {
                if (o.key == processKey) {
                index = i;
                }
            });
            return index;
        },
        validateSpecName(scrapType, specName) {
            var arr = specName.split("*");
            if(Number(arr[0]) && Number(arr[1]) && arr[2] && arr.length == 3) {
                if(scrapType == 4) {
                    //头尾板
                    if(Number(arr[2])) {
                        return true;
                    } else {
                        return false;
                    }
                } else if(scrapType == 5) {
                    //边丝
                    if(arr[2] == "C" || arr[2] == "c") {
                        return true;
                    } else {
                        return false;
                    }
                }
            } else {
                return false;
            }
        }
    },
    created() {
        this.getOptions();
    },
    mounted() {
        this.tableData1 = this.propData;
        this.status = this.processStatus;
        this.getData();
    }
};
</script>

<style lang="less" scoped>
.table-content{border-left:1px solid #ddd;border-top:1px solid #ddd;position: relative;}
.table-content .table1{width:100%;overflow:auto; }
.table-content .table1 table{table-layout: auto;min-width:1600px;}
.table-content .table1 table td{white-space: nowrap;}
.table1 .sum td {background-color: #D7D7D8;}
.table1 .tr-even td {
  background-color: #f3f3f3;
}
.table-content .table1 .table2 table {
    table-layout: fixed;
    width: auto;
    min-width: auto;
    @{deep} tr td:not(:first-child) .ivu-table-cell{
        width: 160px;
        min-width: 160px;
        max-width: 160px;
    }
    @{deep} tr td:first .ivu-table-cell{
        width: 60px!important;
        min-width: 60px!important;
        max-width: 60px!important;
    }
}
.ivu-table-cell {white-space: nowrap !important;}
.text-center { text-align: center;}
.text-right { text-align: right;}
@deep: ~'>>>';
.error-border {
    @{deep} .ivu-select-selection, 
    @{deep} .ivu-input, 
    @{deep} .ivu-input-number{
       border-color: #ed4014
    }
}
@{deep} .ivu-input, .ivu-input-number {
    width: 140px;
}
.width-70 {
    width: 70px!important;
}
</style>

