import Main from '@/components/main'
import { setToken, getToken } from '@/libs/util'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  pageTitle: {String} 面包屑左侧的标题
 *  showAlways: (default: false) 设为true后如果该路由只有一个子路由，在菜单中也会显示该父级菜单
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由，例如['super_admin'],则为super_admin的用户才能访问，不设置，则所有用户均可访问
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 *  activeName: {String} 设置该字段跟父级菜单的name一致,一般用在菜单内页
 *  singleSubMenu: (false) 设为true后在左侧菜单会单独显示包含左侧的与一级菜单平级的菜单链接，出现该标签时，该条路由外层必须只能单独存在该条children
 * }
 */
var hideMenu = true;
if (getToken()) {
    hideMenu = JSON.parse(getToken()).isAdmin == 1 ? false : true;
}

export default [{
        path: '/login',
        name: 'login',
        meta: {
            title: '登录',
            hideInMenu: true
        },
        component: () =>
            import ('@/view/login/login.vue')
    },
    {
        path: '/',
        name: '_home',
        redirect: '/home',
        component: Main,
        meta: {
            notCache: true,
            icon: 'md-home'
        },
        children: [{
            path: '/home',
            name: 'home',
            meta: {
                title: '首页',
                notCache: true,
                icon: 'md-home',
                singleSubMenu: true
            },
            component: () =>
                import ('@/view/home/home')
        }]
    },
    {
        path: '/qualityShop',
        name: 'qualityShop',
        meta: {
            title: '质检商家',
            icon: 'ios-speedometer-outline',
            hideInMenu: hideMenu
        },
        component: Main,
        children: [{
                path: 'register',
                name: 'register',
                meta: {
                    title: '商家入驻',
                    pageTitle: '商家入驻'
                },
                component: () =>
                    import ('@/view/shop/Register.vue')
            },
            {
                path: 'shopList',
                name: 'shopList',
                meta: {
                    title: '商家列表',
                    pageTitle: '商家列表'
                },
                component: () =>
                    import ('@/view/shop/ShopList.vue')
            }
        ]
    },
    {
        path: '/commodity',
        name: 'commodity',
        meta: {
            icon: 'ios-car',
            title: '商品管理'
        },
        component: Main,
        children: [{
                path: 'CommodityList',
                name: 'CommodityList',
                meta: {
                    title: '商品列表',
                    pageTitle: '商品列表'
                },
                component: () =>
                    import ('@/view/commodity/CommodityList.vue')
            },
            {
                path: 'CommodityAdd',
                name: 'CommodityAdd',
                meta: {
                    title: '发布商品',
                    pageTitle: '发布商品'
                },
                component: () =>
                    import ('@/view/commodity/Publish.vue')
            },
            {
                path: 'CategoryList',
                name: 'CategoryList',
                meta: {
                    title: '产品分类',
                    pageTitle: '产品分类',
                    hideInMenu: hideMenu
                },
                component: () =>
                    import ('@/view/commodity/CategoryList.vue')
            },
            {
                path: 'CategoryTree',
                name: 'CategoryTree',
                meta: {
                    title: '分类属性',
                    pageTitle: '分类属性',
                    hideInMenu: hideMenu
                },
                component: () =>
                    import ('@/view/commodity/CategoryTree.vue')
            }
        ]
    },
    {
        path: '/order',
        name: 'order',
        meta: {
            icon: 'ios-list-box-outline',
            title: '订单管理'
        },
        component: Main,
        children: [{
                path: 'OrderList',
                name: 'OrderList',
                meta: {
                    title: '订单列表',
                    pageTitle: '订单列表'
                },
                component: () =>
                    import ('@/view/order/OrderList.vue')
            },
            {
                path: 'PaymentRecordList',
                name: 'PaymentRecordList',
                meta: {
                    title: '打款列表',
                    pageTitle: '打款列表',
                    hideInMenu: hideMenu
                },
                component: () =>
                    import ('@/view/order/PaymentRecordList.vue')
            },
            {
                path: 'RefundAudit',
                name: 'RefundAudit',
                meta: {
                    title: '退款审核',
                    pageTitle: '退款审核',
                    hideInMenu: true,
                    activeName: 'OrderList'
                },
                component: () =>
                    import ('@/view/order/RefundAudit.vue')
            }
        ]
    },
    {
        path: '/user',
        name: 'user',
        meta: {
            icon: 'md-contacts',
            title: '账号管理',
            hideInMenu: hideMenu
        },
        component: Main,
        children: [{
            path: 'ShopAccount',
            name: 'ShopAccount',
            meta: {
                title: '商家账号',
                pageTitle: '商家账号'
            },
            component: () =>
                import ('@/view/account/ShopAccount.vue')
        }]
    },
    {
        path: '/error_401',
        name: 'error_401',
        component: Main,
        meta: {
            hideInMenu: true
        },
        children: [{
            path: '/error_401',
            name: 'error_401',
            meta: {
                title: '401',
            },
            component: () =>
                import ('@/view/error-page/401.vue')
        }],
    },
    {
        path: '/error_404',
        name: 'error_404',
        meta: {
            hideInMenu: true
        },
        component: () =>
            import ('@/view/error-page/404.vue')
    },
    {
        path: '/error_500',
        name: 'Error_500',
        component: Main,
        meta: {
            hideInMenu: true
        },
        children: [{
            path: '/error_500',
            name: 'error_500',
            meta: {
                title: '500',
            },
            component: () =>
                import ('@/view/error-page/500.vue')
        }]
    },

]