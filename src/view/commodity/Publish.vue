<template>
    <div>
        <div class="header">
            <div style="display: inline-block;height: 118px;vertical-align: middle;">
                <img src="../../assets/images/v2_pvwezc.png" width="118px" height="118px" />
            </div>
            <span class="header-item">&nbsp;•&nbsp;商家版</span>
        </div>
        <div class="header-logo">
            <img src="../../assets/images/v2_pvwxm2.png" width="484px" height="488px" />
        </div>
        <div class="content">
        </div>
    </div>
</template>
<script>
    export default {
        name: "Publish",
        components: {
        },
        data() {
            return {

            };
        },
        created() {
        },
        mounted() {
        },
        methods: {


        }
    };
</script>
<style lang="less" scoped>
    .panel .tr {
        position: relative;
    }

    .panel .tip {
        position: absolute;
        left: 12px;
        font-size: 12px;
        color: #c6303e;
        text-align: left;
        margin: 5px auto;
        width: 250px;
    }

    .panel .not {
        background-color: rgba(49, 195, 166, 0.5);
        cursor: not-allowed;
    }

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

    .panel /deep/ input {
        border-radius: 5px !important;
    }

    .tr-radio {
        padding: 10px;
    }

    .tr-span {
        position: absolute;
        left: 5px;
        top: 8px;
    }
</style>
