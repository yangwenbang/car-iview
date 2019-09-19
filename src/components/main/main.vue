<template>
    <Layout style="height: 100%" class="main">
        <div class="menu-collapsed-mb" :hidden="collapsed"></div>
        <Sider hide-trigger collapsible :width="220" :collapsed-width="60" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden'}">
            <side-menu accordion ref="sideMenu" :active-name="$route.meta.activeName?$route.meta.activeName:$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList">
                <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
                <div class="logo-con">
                    <a href="javascript:;" v-show="!collapsed">
                        <img :src="Logo" key="logo">
                        <h1>车两系统</h1>
                    </a>
                    <a href="javascript:;" v-show="collapsed">
                        <img :src="Logo" key="logo" />
                    </a>
                </div>
            </side-menu>
        </Sider>
        <Layout>
            <Header class="header-con">
                <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange" :class="collapsed?'showRightUser':''">
                    <user :user-avator="userAvator" />
                    <language v-if="$config.useI18n" @on-lang-change="setLocal" style="margin-right: 10px;" :lang="local" />
                    <error-store v-if="$config.plugin['error-store'] && $config.plugin['error-store'].showInHeader" :has-read="hasReadErrorPage" :count="errorCount"></error-store>
                    <fullscreen v-if="this.$store.state.app.screenSize>768" v-model="isFullscreen" style="margin-right: 10px;" />
                    <div class="shop-info margin-right-20" v-if="JSON.parse(this.$store.state.user.token).isAdmin != 1">{{shopName}}</div>
                </header-bar>
            </Header>
            <Content class="main-content-con">
                <Layout class="main-layout-con">
                    <div class="tag-nav-wrapper" v-if="this.$store.state.app.screenSize>768 && this.$config.isShowTags">
                        <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag" />
                    </div>
                    <Content class="content-wrapper">
                        <div class="page-breadcrumb" v-show="this.$route.name!=='home'" >
                            <breadcrumb-title></breadcrumb-title>
                        </div>
                        <keep-alive :include="cacheList" v-if="this.$store.state.app.screenSize>768 && this.$config.isShowTags">
                            <router-view/>
                        </keep-alive>
                        <router-view v-if="this.$store.state.app.screenSize<768 || !this.$config.isShowTags" ></router-view>
                    </Content>
                </Layout>
            </Content>
        </Layout>
    </Layout>
</template>
<script>
import SideMenu from "./components/side-menu";
import HeaderBar from "./components/header-bar";
import BreadcrumbTitle from "./components/BreadcrumbTitle";
import TagsNav from "./components/tags-nav";
import User from "./components/user";
import Fullscreen from "./components/fullscreen";
import Language from "./components/language";
import ErrorStore from "./components/error-store";
import { mapMutations, mapActions, mapGetters } from "vuex";
import { getNewTagList, getNextRoute, routeEqual } from "@/libs/util";
import Logo from "@/assets/images/car-logo.png";
import "./main.less";
export default {
    name: "Main",
    components: {
        SideMenu,
        HeaderBar,
        BreadcrumbTitle,
        Language,
        TagsNav,
        Fullscreen,
        ErrorStore,
        User
    },
    data() {
        return {
            collapsed: false,
            Logo,
            isFullscreen: false
        };
    },
    computed: {
        ...mapGetters(["errorCount"]),
        tagNavList() {
            return this.$store.state.app.tagNavList;
        },
        tagRouter() {
            return this.$store.state.app.tagRouter;
        },
        userAvator() {
            //return this.$store.state.user.avatorImgPath;
            return ""
        },
        cacheList() {
          return this.tagNavList.length
                ? this.tagNavList
                      .filter(item => !(item.meta && item.meta.notCache))
                      .map(item => item.name)
                : [];
        },
        menuList() {
            return this.$store.getters.menuList;
        },
        local() {
            return this.$store.state.app.local;
        },
        hasReadErrorPage() {
            return this.$store.state.app.hasReadErrorPage;
        },
        shopName() {
            return JSON.parse(this.$store.state.user.token).qualityShopName;
        }
    },
    methods: {
        ...mapMutations([
            "setBreadCrumb",
            "setTagNavList",
            "addTag",
            "setLocal"
        ]),
        ...mapActions(["handleLogin"]),
        turnToPage(route) {
            let { name, params, query } = {};
            if (typeof route === "string") name = route;
            else {
                name = route.name;
                params = route.params;
                query = route.query;
            }
            if (name.indexOf("isTurnByHref_") > -1) {
                window.open(name.split("_")[1]);
                return;
            }
            this.$router.push({
                name,
                params,
                query
            });
            if(this.$store.state.app.screenSize<=768){
                this.collapsed = true;
            }
        },
        handleCollapsedChange(state) {
            this.collapsed = state;
        },
        handleCloseTag(res, type, route) {
            if (type === "all") {
                this.turnToPage(this.$config.homeName);
            } else if (routeEqual(this.$route, route)) {
                if (type !== "others") {
                    const nextRoute = getNextRoute(this.tagNavList, route);
                    this.$router.push(nextRoute);
                }
            }
            this.setTagNavList(res);
        },
        handleClick(item) {
            this.turnToPage(item);
        }
    },
    watch: {
        $route(newRoute) {
            const { name, query, params, meta } = newRoute;
            this.addTag({
                route: { name, query, params, meta },
                type: "push"
            });
            this.setBreadCrumb(newRoute);
            this.setTagNavList(getNewTagList(this.tagNavList, newRoute));
            this.$refs.sideMenu.updateOpenName(newRoute.name);
        }
    },
    mounted() {
        /**
         * @description 初始化设置面包屑导航和标签导航
         */
        this.setTagNavList();
        this.addTag({
            route: this.$store.state.app.homeRoute
        });
        this.setBreadCrumb(this.$route);
        // 设置初始语言
        // this.setLocal(this.$i18n.locale);
        // 如果当前打开页面不在标签栏中，跳到homeName页
        // if (!this.tagNavList.find(item => item.name === this.$route.name)) {
        //     this.$router.push({
        //         name: this.$config.homeName
        //     });
        // }
        // 以上注销代码改为如果当前打开页面不在标签栏中，则注册该页面到标签栏
        if (!this.tagNavList.find(item => item.name === this.$route.name)) {
            const newRoute = this.$route;
            const { name, query, params, meta } = newRoute;
            this.addTag({
                route: { name, query, params, meta },
                type: "push"
            });
            this.setBreadCrumb(newRoute);
            this.setTagNavList(getNewTagList(this.tagNavList, newRoute));
            this.$refs.sideMenu.updateOpenName(newRoute.name);
        }
        //手机屏幕时，左侧是默认合起来的
        if(this.$store.state.app.screenSize<=768){
            this.collapsed = true;
        }
    }
};
</script>
