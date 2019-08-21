<template>
  <div class="detail-panel">
    <div class="white-bg">
      <Row>
        <Col :lg="8" :md="12" :sm="12" :xs="24">
        <span class="term">标题：</span>
        <span class="field">{{detailInfo.input1}}</span>
        </Col>
        <Col :lg="8" :md="12" :sm="12" :xs="24">
        <span class="term">状态：</span>
        <span class="field">{{detailInfo.input2}}</span>
        </Col>
        <Col :lg="8" :md="12" :sm="12" :xs="24">
        <span class="term">子需求：</span>
        <span class="field tb-link">{{detailInfo.input3}}</span>
        </Col>
        <Col :lg="8" :md="12" :sm="12" :xs="24">
        <span class="term">关联功能：</span>
        <span class="field tb-link">{{detailInfo.input4}}</span>
        </Col>
        <Col :lg="8" :md="12" :sm="12" :xs="24">
        <span class="term">优先级：</span>
        <span class="field">{{detailInfo.input5}}</span>
        </Col>
        <Col :lg="8" :md="12" :sm="12" :xs="24">
        <span class="term">用例类型：</span>
        <span class="field">{{detailInfo.input6}}</span>
        </Col>
        <Col :lg="8" :md="12" :sm="12" :xs="24">
        <span class="term">执行人：</span>
        <span class="tb-link field">{{detailInfo.input7}}</span>
        </Col>
        <Col :lg="8" :md="12" :sm="12" :xs="24">
        <span class="term">适用阶段：</span>
        <span class="field">{{detailInfo.input8}}</span>
        </Col>
        <Col :lg="8" :md="12" :sm="12" :xs="24">
        <span class="term">创建时间：</span>
        <span class="field">{{detailInfo.input9}}</span>
        </Col>
        <Col :lg="8" :md="12" :sm="12" :xs="24">
        <span class="term">修改时间：</span>
        <span class="field">{{detailInfo.input10}}</span>
        </Col>
        <Col :lg="8" :md="12" :sm="12" :xs="24">
        <span class="term">创建人：</span>
        <span class="tb-link field">{{detailInfo.input11}}</span>
        </Col>
        <Col :lg="8" :md="12" :sm="12" :xs="24">
        <span class="term">修改人：</span>
        <span class="tb-link field">{{detailInfo.input12}}</span>
        </Col>
        <Col :lg="8" :md="12" :sm="12" :xs="24">
        <span class="term">执行条件：</span>
        <span class="field">{{detailInfo.input13}}</span>
        </Col>
        <Col :span="24">
        <span class="term">步骤：</span>
        <Table :columns="stepColumn" :data="stepTableData" stripe border class="margin-bottom-15"></Table>
        </Col>
        <Col :span="24">
        <span class="term">附件：</span>
        </Col>
        <Col :span="24">
        <span class="term">描述：</span>
        </Col>
      </Row>
      <Row>
        <Col :span="24">
        <Button type="primary">关闭</Button>
        <Button type="primary" class="margin-left-10">编辑</Button>
        <Button type="primary" class="margin-left-10">执行</Button>
        <Button type="primary" class="margin-left-10">复制用例</Button>
        </Col>
      </Row>
      <Row class="margin-top-15">
        <Col :span="24">
        <div class="table-top-desc">
          测试结果： 共执行
          <span class="blue">0</span> 次
        </div>
        <Table :columns="columns2" :data="tableData2" stripe border></Table>
        </Col>
      </Row>
    </div>
    <Row class="margin-top-15 history-record">
      <Col :lg="24" :md="24" :sm="24" :xs="24">
      <h4 class="title">历史操作记录：</h4>
      <p>2018-10-23 08:31:59 由张超进行了：<span class="color-green">关闭</span>操作, 原先状态：创建</p>
      <p>2017-08-11 10:31:10 由张超进行了：<span class="color-green">创建</span>操作, 原先状态：未创建</p>
      </Col>
    </Row>
  </div>
</template>
<script>
export default {
    name: "UseCaseDetail",
    components: {},
    data() {
        return {
            detailInfo: {
                input1: "智能测试用例",
                input2: "已激活",
                input3: "测试bone",
                input4: "test",
                input5: "level0(低)",
                input6: "功能测试",
                input7: "张超",
                input8: "功能测试阶段",
                input9: "2018-11-26 13:27",
                input10: "2018-11-26 13:27 ",
                input11: "张超",
                input12: "张超",
                input13: ""
            },
            stepColumn: [
                {
                    title: "编号",
                    type: "index",
                    align: "left",
                    width: 100
                },
                {
                    title: "步骤",
                    key: "step",
                    align: "left",
                    minWidth: 180
                },
                {
                    title: "预期",
                    key: "expect",
                    align: "left",
                    minWidth: 180
                }
            ],
            stepTableData: [
                {
                    step: "不勾选用例直接点击执行测试用例",
                    expect: "提示请选择要执行的测试用例"
                }
            ],
            columns2: [
                {
                    title: "执行时间",
                    key: "dealTime",
                    align: "left",
                    width: 200
                },
                {
                    title: "执行人",
                    key: "dealer",
                    align: "left",
                    minWidth: 180
                },
                {
                    title: "结果",
                    key: "result",
                    align: "left",
                    minWidth: 180
                },
                {
                    title: "操作",
                    align: "left",
                    width: 100
                }
            ],
            tableData2: [
                {
                    dealTime: "2018-11-29 21:18",
                    dealer: "张超",
                    result: "测试良好测试良好"
                },
                {
                    dealTime: "2018-11-29 21:18",
                    dealer: "张超",
                    result: "测试良好测试良好"
                }
            ]
        };
    },
    methods: {}
};
</script>
<style lang="less" scoped>

</style>
