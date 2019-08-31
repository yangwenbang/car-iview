import Main from '@/components/main'

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
    // {
    //   path: '/warehouse',
    //   name: 'warehouse',
    //   meta: {
    //     icon: 'md-log-in',
    //     title: '质检商家管理'
    //   },
    //   component: Main,
    //   children: [
    //     {
    //       path: 'WarehouseRegister',
    //       name: 'WarehouseRegister',
    //       meta: {
    //         title: '入库登记',
    //         pageTitle: '入库登记'
    //       },
    //       component: () => import('@/view/warehouse/WarehouseRegister.vue')
    //     },
    //     {
    //       path: 'WarehouseDetailList',
    //       name: 'WarehouseDetailList',
    //       meta: {
    //         title: '入库明细列表',
    //         pageTitle: '入库明细列表',
    //         hideInMenu: true,
    //         activeName: 'WarehouseRegister'
    //       },
    //       component: () => import('@/view/warehouse/WarehouseDetailList.vue')
    //     },
    //     {
    //       path: 'WarehouseRegisterAdd',
    //       name: 'WarehouseRegisterAdd',
    //       meta: {
    //         title: '新增入库单',
    //         pageTitle: '新增入库单',
    //         hideInMenu: true,
    //         activeName: 'WarehouseRegister'
    //       },
    //       component: () => import('@/view/warehouse/WarehouseRegisterAdd.vue')
    //     },
    //     {
    //       path: 'WarehouseRegisterEdit',
    //       name: 'WarehouseRegisterEdit',
    //       meta: {
    //         title: '编辑入库单',
    //         pageTitle: '编辑入库单',
    //         hideInMenu: true,
    //         activeName: 'WarehouseRegister'
    //       },
    //       component: () => import('@/view/warehouse/WarehouseRegisterEdit.vue')
    //     },
    //     {
    //       path: 'WarehouseRegisterDetail',
    //       name: 'WarehouseRegisterDetail',
    //       meta: {
    //         title: '入库单',
    //         pageTitle: '入库单',
    //         hideInMenu: true,
    //         activeName: 'WarehouseRegister'
    //       },
    //       component: () => import('@/view/warehouse/WarehouseRegisterDetail.vue')
    //     },
    //     {
    //       path: 'WarehouseRegisterAudit',
    //       name: 'WarehouseRegisterAudit',
    //       meta: {
    //         title: '入库审核',
    //         pageTitle: '入库审核',
    //         hideInMenu: true,
    //         activeName: 'WarehouseRegister'
    //       },
    //       component: () => import('@/view/warehouse/WarehouseRegisterAudit.vue')
    //     },
    //     {
    //       path: 'WarehouseRegisterImg',
    //       name: 'WarehouseRegisterImg',
    //       meta: {
    //         title: '照片查看',
    //         pageTitle: '照片查看',
    //         hideInMenu: true,
    //         activeName: 'WarehouseRegister'
    //       },
    //       component: () => import('@/view/warehouse/WarehouseRegisterImg.vue')
    //     }
    //   ]
    // },
    // {
    //   path: '/outstock',
    //   name: 'outstock',
    //   meta: {
    //     icon: 'md-log-out',
    //     title: '出库管理'
    //   },
    //   component: Main,
    //   children: [
    //     {
    //       path: 'OutstockSettlement',
    //       name: 'OutstockSettlement',
    //       meta: {
    //         //notCache: true,
    //         title: '出库结算',
    //         pageTitle: '出库结算'
    //       },
    //       component: () => import('@/view/outstock/OutstockSettlement.vue')
    //     },
    //     {
    //       path: 'OutstockDetailList',
    //       name: 'OutstockDetailList',
    //       meta: {
    //         title: '出库结算明细列表',
    //         pageTitle: '出库结算明细列表',
    //         hideInMenu: true,
    //         activeName: 'OutstockSettlement'
    //       },
    //       component: () => import('@/view/outstock/OutstockDetailList.vue')
    //     },
    //     {
    //       path: 'AddOutstockSettlement',
    //       name: 'AddOutstockSettlement',
    //       meta: {
    //         title: '新增出库结算单',
    //         pageTitle: '新增出库结算单',
    //         hideInMenu: true,
    //         activeName: 'OutstockSettlement'
    //       },
    //       component: () => import('@/view/outstock/AddOutstockSettlement.vue')
    //     },
    //     {
    //       path: 'EditOutstockSettlement',
    //       name: 'EditOutstockSettlement',
    //       meta: {
    //         title: '编辑出库结算单',
    //         pageTitle: '编辑出库结算单',
    //         hideInMenu: true,
    //         activeName: 'OutstockSettlement'
    //       },
    //       component: () => import('@/view/outstock/EditOutstockSettlement.vue')
    //     },
    //     {
    //       path: 'EditPriceOutstockSettlement',
    //       name: 'EditPriceOutstockSettlement',
    //       meta: {
    //         title: '修改出库结算单价格',
    //         pageTitle: '修改出库结算单价格',
    //         hideInMenu: true,
    //         activeName: 'OutstockSettlement'
    //       },
    //       component: () => import('@/view/outstock/EditPriceOutstockSettlement.vue')
    //     },
    //     {
    //       path: 'ViewOutstockSettlement',
    //       name: 'ViewOutstockSettlement',
    //       meta: {
    //         title: '查看出库结算单',
    //         pageTitle: '查看出库结算单',
    //         hideInMenu: true,
    //         activeName: 'OutstockSettlement'
    //       },
    //       component: () => import('@/view/outstock/ViewOutstockSettlement.vue')
    //     },
    //     {
    //       path: 'ReceiveOutstockSettlement',
    //       name: 'ReceiveOutstockSettlement',
    //       meta: {
    //         title: '结算单收款',
    //         pageTitle: '结算单收款',
    //         hideInMenu: true,
    //         activeName: 'OutstockSettlement'
    //       },
    //       component: () => import('@/view/outstock/ReceiveOutstockSettlement.vue')
    //     },
    //     {
    //       path: 'AuditOutstockSettlement',
    //       name: 'AuditOutstockSettlement',
    //       meta: {
    //         title: '审核结算单',
    //         pageTitle: '审核结算单',
    //         hideInMenu: true,
    //         activeName: 'OutstockSettlement'
    //       },
    //       component: () => import('@/view/outstock/AuditOutstockSettlement.vue')
    //     },
    //     {
    //       path: 'PickGoodsManage',
    //       name: 'PickGoodsManage',
    //       meta: {
    //         title: '提货管理',
    //         pageTitle: '提货管理'
    //       },
    //       component: () => import('@/view/outstock/PickGoodsManage.vue')
    //     },
    //     {
    //       path: 'AddPickGoods',
    //       name: 'AddPickGoods',
    //       meta: {
    //         title: '新增提货单',
    //         pageTitle: '新增提货单',
    //         hideInMenu: true,
    //         activeName: 'PickGoodsManage'
    //       },
    //       component: () => import('@/view/outstock/AddPickGoods.vue')
    //     },
    //     {
    //       path: 'EditPickGoods',
    //       name: 'EditPickGoods',
    //       meta: {
    //         title: '编辑提货单',
    //         pageTitle: '编辑提货单',
    //         hideInMenu: true,
    //         activeName: 'PickGoodsManage'
    //       },
    //       component: () => import('@/view/outstock/EditPickGoods.vue')
    //     },
    //     {
    //       path: 'ViewPickGoods',
    //       name: 'ViewPickGoods',
    //       meta: {
    //         title: '查看提货单',
    //         pageTitle: '查看提货单',
    //         hideInMenu: true,
    //         activeName: 'PickGoodsManage'
    //       },
    //       component: () => import('@/view/outstock/ViewPickGoods.vue')
    //     },
    //     {
    //       path: 'AuditPickGoods',
    //       name: 'AuditPickGoods',
    //       meta: {
    //         title: '审核提货单',
    //         pageTitle: '审核提货单',
    //         hideInMenu: true,
    //         activeName: 'PickGoodsManage'
    //       },
    //       component: () => import('@/view/outstock/AuditPickGoods.vue')
    //     },
    //     {
    //       path: 'OutPickGoods',
    //       name: 'OutPickGoods',
    //       meta: {
    //         title: '出库确认',
    //         pageTitle: '出库确认',
    //         hideInMenu: true,
    //         activeName: 'PickGoodsManage'
    //       },
    //       component: () => import('@/view/outstock/OutPickGoods.vue')
    //     },
    //     {
    //       path: 'TransferManage',
    //       name: 'TransferManage',
    //       meta: {
    //         title: '过户管理',
    //         pageTitle: '过户管理'
    //       },
    //       component: () => import('@/view/outstock/TransferManage.vue')
    //     },
    //     {
    //       path: 'AddTransfer',
    //       name: 'AddTransfer',
    //       meta: {
    //         title: '新增过户单',
    //         pageTitle: '新增过户单',
    //         hideInMenu: true,
    //         activeName: 'TransferManage'
    //       },
    //       component: () => import('@/view/outstock/AddTransfer.vue')
    //     },
    //     {
    //       path: 'EditTransfer',
    //       name: 'EditTransfer',
    //       meta: {
    //         title: '编辑过户单',
    //         pageTitle: '编辑过户单',
    //         hideInMenu: true,
    //         activeName: 'TransferManage'
    //       },
    //       component: () => import('@/view/outstock/EditTransfer.vue')
    //     },
    //     {
    //       path: 'ViewTransfer',
    //       name: 'ViewTransfer',
    //       meta: {
    //         title: '查看过户单',
    //         pageTitle: '查看过户单',
    //         hideInMenu: true,
    //         activeName: 'TransferManage'
    //       },
    //       component: () => import('@/view/outstock/ViewTransfer.vue')
    //     },
    //     {
    //       path: 'AuditTransfer',
    //       name: 'AuditTransfer',
    //       meta: {
    //         title: '过户单审核',
    //         pageTitle: '过户单审核',
    //         hideInMenu: true,
    //         activeName: 'TransferManage'
    //       },
    //       component: () => import('@/view/outstock/AuditTransfer.vue')
    //     },
    //     {
    //       path: 'ReceiveTransfer',
    //       name: 'ReceiveTransfer',
    //       meta: {
    //         title: '过户收款',
    //         pageTitle: '过户收款',
    //         hideInMenu: true,
    //         activeName: 'TransferManage'
    //       },
    //       component: () => import('@/view/outstock/ReceiveTransfer.vue')
    //     }
    //   ]
    // },
    // {
    //   path: '/process',
    //   name: 'process',
    //   meta: {
    //     icon: 'ios-hammer',
    //     title: '加工管理'
    //   },
    //   component: Main,
    //   children: [
    //     {
    //       path: 'ProcessList',
    //       name: 'ProcessList',
    //       meta: {
    //         title: '加工单管理',
    //         pageTitle: '加工单管理'
    //       },
    //       component: () => import('@/view/process/ProcessList.vue')
    //     },
    //     {
    //       path: 'NewProcessBill',
    //       name: 'NewProcessBill',
    //       meta: {
    //         title: '新增加工单',
    //         pageTitle: '新增加工单',
    //         hideInMenu: true,
    //         activeName: 'ProcessList'
    //       },
    //       component: () => import('@/view/process/NewProcessBill.vue')
    //     },
    //     {
    //       path: 'ProcessBillEdit',
    //       name: 'ProcessBillEdit',
    //       meta: {
    //         title: '编辑加工单',
    //         pageTitle: '编辑加工单',
    //         hideInMenu: true,
    //         activeName: 'ProcessList'
    //       },
    //       component: () => import('@/view/process/ProcessBillEdit.vue')
    //     },
    //     {
    //       path: 'ProcessBillDetail',
    //       name: 'ProcessBillDetail',
    //       meta: {
    //         title: '查看加工单',
    //         pageTitle: '查看加工单',
    //         hideInMenu: true,
    //         activeName: 'ProcessList'
    //       },
    //       component: () => import('@/view/process/ProcessBillDetail.vue')
    //     },
    //     {
    //       path: 'ProcessBillExamine',
    //       name: 'ProcessBillExamine',
    //       meta: {
    //         title: '加工单审核',
    //         pageTitle: '加工单审核',
    //         hideInMenu: true,
    //         activeName: 'ProcessList'
    //       },
    //       component: () => import('@/view/process/ProcessBillExamine.vue')
    //     },
    //     {
    //       path: 'ProcessPack',
    //       name: 'ProcessPack',
    //       meta: {
    //         title: '成品打包',
    //         pageTitle: '成品打包',
    //         hideInMenu: true,
    //         activeName: 'ProcessList'
    //       },
    //       component: () => import('@/view/process/ProcessPack.vue')
    //     },
    //     {
    //       path: 'ProductProcessList',
    //       name: 'ProductProcessList',
    //       meta: {
    //         title: '生产加工表',
    //         pageTitle: '生产加工表'
    //       },
    //       component: () => import('@/view/process/ProductProcessList.vue')
    //     },
    //     {
    //       path: 'RevokeProcess',
    //       name: 'RevokeProcess',
    //       meta: {
    //         title: '撤销加工',
    //         pageTitle: '撤销加工',
    //         hideInMenu: true,
    //         activeName: 'ProductProcessList'
    //       },
    //       component: () => import('@/view/process/RevokeProcess.vue')
    //     },
    //     {
    //       path: 'ProductProcessListMessage',
    //       name: 'ProductProcessListMessage',
    //       meta: {
    //         title: '加工信息',
    //         pageTitle: '加工信息',
    //         hideInMenu: true,
    //         activeName: 'ProductProcessList'
    //       },
    //       component: () => import('@/view/process/ProductProcessListMessage.vue')
    //     },
    //     {
    //       path: 'ProductProcessListDetail',
    //       name: 'ProductProcessListDetail',
    //       meta: {
    //         title: '加工详情',
    //         pageTitle: '加工详情',
    //         hideInMenu: true,
    //         activeName: 'ProductProcessList'
    //       },
    //       component: () => import('@/view/process/ProductProcessListDetail.vue')
    //     },
    //   ]
    // },
    // {
    //   path: '/storage',
    //   name: 'storage',
    //   meta: {
    //     icon: 'md-cube',
    //     title: '库存管理'
    //   },
    //   component: Main,
    //   children: [
    //     {
    //       path: 'StorageManage',
    //       name: 'StorageManage',
    //       meta: {
    //         title: '库存管理',
    //         pageTitle: '库存管理',
    //         singleSubMenu:true
    //       },
    //       component: () => import('@/view/storage/StorageManage.vue')
    //     },
    //     {
    //       path: 'StorageImg',
    //       name: 'StorageImg',
    //       meta: {
    //         title: '货物照片',
    //         pageTitle: '货物照片',
    //         hideInMenu: true,
    //         activeName: 'StorageManage'
    //       },
    //       component: () => import('@/view/storage/StorageImg.vue')
    //     },
    //     {
    //       path: 'StorageTrack',
    //       name: 'StorageTrack',
    //       meta: {
    //         title: '详细信息',
    //         pageTitle: '详细信息',
    //         hideInMenu: true,
    //         activeName: 'StorageManage'
    //       },
    //       component: () => import('@/view/storage/StorageTrack.vue')
    //     }
    //   ]
    // },
    // {
    //   path: '/customer',
    //   name: 'customer',
    //   meta: {
    //     icon: 'md-person',
    //     title: '客商管理'
    //   },
    //   component: Main,
    //   children: [
    //     {
    //       path: 'CustomerMaintain',
    //       name: 'CustomerMaintain',
    //       meta: {
    //         title: '客户管理',
    //         pageTitle: '客户管理'
    //       },
    //       component: () => import('@/view/customer/CustomerMaintain.vue')
    //     },
    //     {
    //       path: 'CustomerAdd',
    //       name: 'CustomerAdd',
    //       meta: {
    //         title: '新增客户',
    //         pageTitle: '新增客户',
    //         hideInMenu: true,
    //         activeName: 'CustomerMaintain'
    //       },
    //       component: () => import('@/view/customer/CustomerAdd.vue')
    //     },
    //     {
    //       path: 'CustomerAudit',
    //       name: 'CustomerAudit',
    //       meta: {
    //         title: '审核客户',
    //         pageTitle: '审核客户',
    //         hideInMenu: true,
    //         activeName: 'CustomerMaintain'
    //       },
    //       component: () => import('@/view/customer/CustomerAudit.vue')
    //     },
    //     {
    //       path: 'CustomerDetail',
    //       name: 'CustomerDetail',
    //       meta: {
    //         title: '客户详情',
    //         pageTitle: '客户详情',
    //         hideInMenu: true,
    //         activeName: 'CustomerMaintain'
    //       },
    //       component: () => import('@/view/customer/CustomerDetail.vue')
    //     },
    //     {
    //       path: 'CustomerEdit',
    //       name: 'CustomerEdit',
    //       meta: {
    //         title: '编辑客户',
    //         pageTitle: '编辑客户',
    //         hideInMenu: true,
    //         activeName: 'CustomerMaintain'
    //       },
    //       component: () => import('@/view/customer/CustomerEdit.vue')
    //     }
    //   ]
    // },
    // {
    //   path: '/store',
    //   name: 'store',
    //   meta: {
    //     icon: 'ios-home',
    //     title: '仓库管理'
    //   },
    //   component: Main,
    //   children: [
    //     {
    //       path: 'StoreAreaMaintain',
    //       name: 'StoreAreaMaintain',
    //       meta: {
    //         title: '库区管理',
    //         pageTitle: '库区管理'
    //       },
    //       component: () => import('@/view/store/StoreAreaMaintain.vue')
    //     },
    //     {
    //       path: 'StorePlaceMaintain',
    //       name: 'StorePlaceMaintain',
    //       meta: {
    //         title: '库位管理',
    //         pageTitle: '库位管理'
    //       },
    //       component: () => import('@/view/store/StorePlaceMaintain.vue')
    //     }
    //   ]
    // },
    // {
    //   path: '/staff',
    //   name: 'staff',
    //   meta: {
    //     icon: 'md-contacts',
    //     title: '工人管理'
    //   },
    //   component: Main,
    //   children: [
    //     {
    //       path: 'StaffList',
    //       name: 'StaffList',
    //       meta: {
    //         title: '工人管理',
    //         pageTitle: '工人管理'
    //       },
    //       component: () => import('@/view/staff/StaffList.vue')
    //     },
    //     {
    //       path: 'StaffTypeList',
    //       name: 'StaffTypeList',
    //       meta: {
    //         title: '工种管理',
    //         pageTitle: '工种管理'
    //       },
    //       component: () => import('@/view/staff/StaffTypeList.vue')
    //     }
    //   ]
    // },
    // {
    //   path: '/device',
    //   name: 'device',
    //   meta: {
    //     icon: 'md-build',
    //     title: '设备管理'
    //   },
    //   component: Main,
    //   children: [
    //       {
    //           path: 'DeviceManage',
    //           name: 'DeviceManage',
    //           meta: {
    //             title: '设备管理',
    //             pageTitle: '设备管理',
    //             singleSubMenu:true
    //           },
    //           component: () => import('@/view/device/DeviceManage.vue')
    //         }
    //   ]
    // },
    // {
    //   path: '/financial',
    //   name: 'financial',
    //   meta: {
    //     icon: 'logo-yen',
    //     title: '财务管理'
    //   },
    //   component: Main,
    //   children: [
    //       {
    //           path: 'FinancialManage',
    //           name: 'FinancialManage',
    //           meta: {
    //             title: '财务管理',
    //             pageTitle: '财务管理',
    //             singleSubMenu:true
    //           },
    //           component: () => import('@/view/financial/FinancialManage.vue')
    //         }
    //   ]
    // },
    {
        path: '/qualityShop',
        name: 'qualityShop',
        meta: {
            icon: 'ios-speedometer-outline',
            title: '质检商家'
        },
        component: Main,
        children: [{
            path: '',
            name: '',
            meta: {
                title: '',
                pageTitle: ''
            },
            component: () =>
                import ('@/view/commodity/Publish.vue')
        }]
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
                    pageTitle: '产品分类'
                },
                component: () =>
                    import ('@/view/commodity/CategoryList.vue')
            }
        ]
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