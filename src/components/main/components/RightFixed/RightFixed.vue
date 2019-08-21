<template>
    <div class="right-fixed" :style="{ right: rightCss + 'px' }" @click="changeType">
        <div class="right-btn">
            <Icon type="md-add" size="28"/>
        </div>
        
        <div class="content">
            <a href="">新增发布域</a>
            <a href="">新增产品线</a>
            <a href="">新增应用</a>
            <a href="">新增用户需求</a>
            <a href="">新增产品需求</a>
            <a href="">新增子需求</a>
            <a href="">新增用例</a>
            <a href="">创建变更</a>
            <a href="">新增发布</a>
            <a href="">新增缺陷</a>
            <a href="">申请回滚</a>
            <a href="">新建项目间Rebase</a>
            <a href="">申请重启.缩容.扩容</a>
        </div>
    </div>
</template>

<script>
import "./RightFixed.less";
export default {
    name: "RightFixed",
    data() {
        return {
            rightCss: -160,
        };
    },
    methods: {
        changeType() {
            this.rightCss = this.rightCss == 0 ? -160 : 0;
        }
    }
};
</script>
