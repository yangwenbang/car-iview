<template>
    <div>
        <div class="header">
            <div style="display: inline-block;height: 118px;vertical-align: middle;">
                <img src="../../assets/images/v2_pvwezc.png" width="118px" height="118px">
            </div>
            <span class="header-item">&nbsp;•&nbsp;商家版</span>
        </div>
        <div class="header-logo">
            <img src="../../assets/images/v2_pvwxm2.png" width="484px" height="488px">
        </div>
        <div class="content">
        </div>
    </div>
</template>
<script>
    export default {
        name: "Register",
        components: {},
        data() {
            return {

            }
        },
        created() {

        },
        mounted() {},
        methods: {}
    }
</script>
<style lang="less" scoped>
    .header {
        padding: 0 30px;
        text-align: left;
        height: 118px;
        margin: 30px 0;

        .header-item {
            vertical-align: middle;
            font-family: SourceHanSansSC-regular;
            font-size: 18px;
            color: #101010;
        }
    }

    .header-logo {
        position: relative;
        display: inline-block;
        height: 285px;
        width: 100%;
        background: rgba(251, 198, 71, 1);
    }

    .header-logo img {
        position: absolute;
        left: 50%;
        top: -150px;
        margin-left: -245px;
    }

    .content {
        margin: 30px 0;
    }

    .demo-upload-list {
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
        margin-right: 4px;
    }

    .demo-upload-list img {
        width: 100%;
        height: 100%;
    }

    .demo-upload-list-cover {
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.6);
    }

    .demo-upload-list:hover .demo-upload-list-cover {
        display: block;
    }

    .demo-upload-list-cover i {
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }

    .input-price /deep/ input {
        padding: 5px 20px;
    }
</style>