<template>
    <Row type="flex" justify="center" class="white-bg">
        <Col :xs="24" :sm="24" :md="24">
        <div class="step-content">
            <Steps :current="1">
                <Step title="已完成" content="这里是该步骤的描述信息"></Step>
                <Step title="进行中" content="这里是该步骤的描述信息"></Step>
                <Step title="待进行" content="这里是该步骤的描述信息"></Step>
                <Step title="待进行" content="这里是该步骤的描述信息"></Step>
            </Steps>
        </div>
        </Col>
        <Col :xs="24" :sm="24" :md="12">
        <Form class="submit-form" ref="formValidate" :model="formValidate" :rules="ruleValidate" label-position="right" :label-width="110">
            <FormItem label="产品需求标题:" prop="title">
                <Input v-model="formValidate.title" placeholder="请输入产品需求标题"></Input>
            </FormItem>
            <Row :gutter="10">
                <Col :lg="12" :xs="24">
                <FormItem label="所属产品线:" prop="productLine">
                    <Select v-model="formValidate.productLine" multiple filterable @on-change="changeProductLine">
                        <Option v-for="item in productLineList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col :lg="12" :xs="24">
                <FormItem label="评审人:" prop="reviewer" class="inputHasTooltip">
                    <div class="custom-input">
                        <Tag class="custom-tag" v-for="(item,index) in formValidate.reviewer" :value="item" :key="index">{{item}}</Tag>
                    </div>
                    <Tooltip placement="top" class="right-tooltip">
                        <Icon type="md-help-circle" size="17"/>
                        <div slot="content">
                            <p>1.评审人可操作评审</p>
                            <p>2.可操作需求变更</p>
                            <p>3.可操作完善产品需求</p>
                        </div>
                    </Tooltip>
                </FormItem>
                </Col>
            </Row>
            <Row :gutter="10">
                <Col :lg="12" :xs="24">
                <FormItem label="来源:" prop="origin">
                    <Select v-model="formValidate.origin" filterable>
                        <Option v-for="item in originList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col :lg="12" :xs="24">
                <FormItem label="优先级:" prop="priority">
                    <Select v-model="formValidate.priority" filterable>
                        <Option v-for="item in priorityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                </Col>
            </Row>
            <FormItem label="期望上线时间:">
                <DatePicker type="date" v-model="formValidate.updateTime" placeholder="请选择" style="width: 100%"></DatePicker>
            </FormItem>
            <FormItem label="用户需求:" class="inputHasTooltip">
                <Select v-model="formValidate.userDemand" filterable>
                    <Option v-for="item in userDemandList" :value="item.id" :key="item.id">{{ item.text }}</Option>
                </Select>
                <Tooltip placement="top" class="right-tooltip">
                    <Icon type="md-help-circle" size="17"/>
                    <div slot="content">
                        <p>1.关联的用户需求,单个选择!</p>
                    </div>
                </Tooltip>
            </FormItem>
            <FormItem label="合并用户需求:" class="inputHasTooltip">
                <Select v-model="formValidate.mergeUserDemand" multiple filterable>
                    <Option v-for="item in userDemandList" :value="item.id" :key="item.id">{{ item.text }}</Option>
                </Select>
                <Tooltip placement="top" class="right-tooltip">
                    <Icon type="md-help-circle" size="17"/>
                    <div slot="content">
                        <p>1.类似的需求可以合并为一个产品需求！</p>
                        <p>2.合并用户需求不可与选择的用户需求重复</p>
                    </div>
                </Tooltip>
            </FormItem>
            <Row :gutter="10">
                <Col :lg="12" :xs="24">
                <FormItem label="抄送:">
                    <Select v-model="formValidate.copySend" multiple filterable>
                        <Option v-for="item in copySendList" :value="item.id" :key="item.id">{{ item.text }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col :lg="12" :xs="24">
                <FormItem label="指派:" class="inputHasTooltip">
                    <Select v-model="formValidate.assign" multiple filterable>
                        <Option v-for="item in assignList" :value="item.id" :key="item.id">{{ item.text }}</Option>
                    </Select>
                    <Tooltip placement="top" class="right-tooltip">
                        <Icon type="md-help-circle" size="17"/>
                        <div slot="content">
                            <p>1.指派人可完善产品需求,同时进行邮件通知!</p>
                            <p>2.当转产品需求时，只显示产品需求管理员</p>
                            <p>3.只创建产品需求时，只显示应用管理员</p>
                        </div>
                    </Tooltip>
                </FormItem>
                </Col>
            </Row>
            <FormItem label="附件:" prop="enclosure">
                <Upload action="//jsonplaceholder.typicode.com/posts/">
                    <Button icon="ios-cloud-upload-outline">点击上传</Button>
                </Upload>
            </FormItem>
            <FormItem label="描述:">
                <page-editor v-if="this.$store.state.app.screenSize>768" ref="editor" :value="formValidate.content" @on-change="handleChange"></page-editor>
                <Input v-if="this.$store.state.app.screenSize<=768" v-model="formValidate.content" type="textarea" :autosize="{minRows: 2,maxRows: 5}" />
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
            </FormItem>
        </Form>
        </Col>
    </Row>
</template>

<script>
import PageEditor from "_c/editor";
import { closeNowTag } from "@/libs/util";
export default {
    name: "AddProduct",
    components: {
        PageEditor
    },
    data() {
        return {
            formValidate: {
                title: "",
                productLine: [],
                reviewer: [],
                origin: "3",
                priority: "",
                updateTime: "",
                userDemand: "",
                mergeUserDemand: [],
                copySend: [],
                copySend: [],
                assign: [],
                enclosure: "",
                content: ""
            },
            ruleValidate: {
                title: [
                    {
                        required: true,
                        message: "标题是必填项",
                        trigger: "change"
                    }
                ],
                productLine: [
                    {
                        required: true,
                        type: "array",
                        message: "所属产品线是必填项",
                        trigger: "change"
                    }
                ],
                origin: [
                    {
                        required: true,
                        message: "来源是必填项",
                        trigger: "change"
                    }
                ],
                priority: [
                    {
                        required: true,
                        message: "优先级是必填项",
                        trigger: "change"
                    }
                ]
            },
            productLineList: [
                {
                    value: "1",
                    label: "商城demo"
                },
                {
                    value: "2",
                    label: "BCS用户信用评分"
                },
                {
                    value: "3",
                    label: "账务-账户"
                },
                {
                    value: "4",
                    label: "隆众-app后台接口"
                },
                {
                    value: "5",
                    label: "隆众-数据中心"
                },
                {
                    value: "6",
                    label: "财务-对账单"
                }
            ],
            originList: [
                {
                    value: "1",
                    label: "客户"
                },
                {
                    value: "2",
                    label: "用户"
                },
                {
                    value: "3",
                    label: "产品经理"
                },
                {
                    value: "4",
                    label: "市场"
                },
                {
                    value: "5",
                    label: "客服"
                },
                {
                    value: "6",
                    label: "竞争对手"
                }
            ],
            priorityList: [
                {
                    value: "1",
                    label: "level0(低)"
                },
                {
                    value: "2",
                    label: "level1(一般)"
                },
                {
                    value: "3",
                    label: "level2(中)"
                },
                {
                    value: "4",
                    label: "level3(高)"
                },
                {
                    value: "5",
                    label: "level4(极高)"
                },
                {
                    value: "6",
                    label: "level5(紧急)"
                }
            ],
            userDemandList: [
                { id: 117, text: "隆众平台-基础数据管理功能研发" },
                { id: 116, text: "V3SP1_需求_联数据监控务-bone01" },
                { id: 115, text: "资金成本分口利润" },
                { id: 114, text: "融资帮你采、随你押合同承兑汇票收款优化" }
            ],
            copySendList: [
                { id: 396, text: "钱泽明" },
                { id: 395, text: "林娴" },
                { id: 394, text: "杨帆" },
                { id: 393, text: "肖凯" },
                { id: 392, text: "刘志" }
            ],
            assignList: [
                { id: 396, text: "钱泽明" },
                { id: 395, text: "林娴" },
                { id: 394, text: "杨帆" },
                { id: 393, text: "肖凯" },
                { id: 392, text: "刘志" }
            ]
        };
    },
    methods: {
        handleSubmit(name) {
            this.$refs[name].validate(valid => {
               if (valid) {
                    this.$Message.success({
                        content: "提交成功!",
                        duration: 1
                    });
                    setTimeout(() => {
                        closeNowTag(this.$store.state.app, this.$route);
                        this.$router.push({
                            path: "ProductRequireList"
                        });
                    }, 1000);
                } else {
                    this.$Message.error("提交失败");
                }
            });
        },
        handleChange(html, text) {
            console.log(html, text);
        },
        changeProductLine(val) {
            this.formValidate.reviewer = ["张元访", "张增"];
        }
    }
};
</script>

<style lang="less" scoped>
.custom-input {
    width: 100%;
    height: 32px;
    line-height: 0;
    padding: 0 0 0 4px;
    user-select: none;
    cursor: pointer;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #dcdee2;
    .custom-tag {
        height: 24px;
        line-height: 24px;
        margin-top: 3px;
    }
}
.step-content{padding-bottom:20px;}
</style>
