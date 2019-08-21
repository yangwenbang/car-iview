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

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
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
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          title: '首页',
          notCache: true,
          icon: 'md-home',
          singleSubMenu:true
        },
        component: () => import('@/view/home/home')
      }
    ]
  },
  {
    path: '/account',
    name: 'account',
    meta: {
      icon: 'md-people',
      title: '账户管理'
    },
    component: Main,
    children: [
      {
        path: 'StorehouseAccount',
        name: 'StorehouseAccount',
        meta: {
          title: '仓库端账号管理',
          pageTitle: '仓库端账号管理'
        },
        component: () => import('@/view/account/StorehouseAccount.vue')
      },
      {
        path:'StorehouseAdd',
        name:'StorehouseAdd',
        meta:{
          title:'新增账号',
          pageTitle:'新增账号',
          hideInMenu:true,
          activeName:'StorehouseAccount'
        },
        component: () => import('@/view/account/StorehouseAdd.vue')
      },
      {
        path:'StorehouseCheck',
        name:'StorehouseCheck',
        meta:{
          title:'查看账号',
          pageTitle:'查看账号',
          hideInMenu:true,
          activeName:'StorehouseAccount'
        },
        component: () => import('@/view/account/StorehouseCheck.vue')
      },
      {
        path:'StorehouseEdit',
        name:'StorehouseEdit',
        meta:{
          title:'修改账号',
          pageTitle:'修改账号',
          hideInMenu:true,
          activeName:'StorehouseAccount'
        },
        component: () => import('@/view/account/StorehouseEdit.vue')
      },
      {
        path:'StorehousePower',
        name:'StorehousePower',
        meta:{
          title:'权限配置',
          pageTitle:'权限配置',
          hideInMenu:true,
          activeName:'StorehouseAccount'
        },
        component: () => import('@/view/account/StorehousePower.vue')
      },
      {
        path: 'RoleManagement',
        name: 'RoleManagement',
        meta: {
          title: '角色管理',
          pageTitle: '角色管理'
        },
        component: () => import('@/view/account/RoleManagement.vue')
      },
      {
        path:'ModifyRole',
        name:'ModifyRole',
        meta:{
          title:'角色管理修改',
          pageTitle:'角色管理修改',
          hideInMenu:true,
          activeName:'RoleManagement'
        },
        component: () => import('@/view/account/ModifyRole.vue')
      },
      {
        path:'AddRoleManagement',
        name:'AddRoleManagement',
        meta:{
          title:'新增角色',
          pageTitle:'新增角色',
          hideInMenu:true,
          activeName:'RoleManagement'
        },
        component: () => import('@/view/account/AddRoleManagement.vue')
      },
      {
        path:'ViewRole',
        name:'ViewRole',
        meta:{
          title:'查看角色',
          pageTitle:'查看角色',
          hideInMenu:true,
          activeName:'RoleManagement'
        },
        component: () => import('@/view/account/ViewRole.vue')
      },
    ]
  },
  {
    path: '/storehouse',
    name: 'storehouse',
    meta: {
      icon: 'md-cog',
      title: '仓库管理'
    },
    component: Main,
    children: [
        {
            path: 'StorehouseManage',
            name: 'StorehouseManage',
            meta: {
              title: '仓库管理',
              pageTitle: '仓库管理',
              singleSubMenu:true
            },
            component: () => import('@/view/storehouse/StorehouseManage.vue')
        },
        {
          path: 'NewStorehouse',
          name: 'NewStorehouse',
          meta: {
            title: '新增仓库',
            pageTitle: '新增仓库',
            hideInMenu: true,
            activeName: 'StorehouseManage'
          },
          component: () => import('@/view/storehouse/NewStorehouse.vue')
        },
        {
          path: 'StorehouseUpdate',
          name: 'StorehouseUpdate',
          meta: {
            title: '编辑仓库',
            pageTitle: '编辑仓库',
            hideInMenu: true,
            activeName: 'StorehouseManage'
          },
          component: () => import('@/view/storehouse/StorehouseUpdate.vue')
        },
        {
          path: 'StorehouseDetail',
          name: 'StorehouseDetail',
          meta: {
            title: '查看仓库',
            pageTitle: '查看仓库',
            hideInMenu: true,
            activeName: 'StorehouseManage'
          },
          component: () => import('@/view/storehouse/StorehouseDetail.vue')
        },
        {
          path: 'StorehouseImport',
          name: 'StorehouseImport',
          meta: {
            title: '导入仓库',
            pageTitle: '导入仓库',
            hideInMenu: true,
            activeName: 'StorehouseManage'
          },
          component: () => import('@/view/storehouse/StorehouseImport.vue')
        },
    ]
  },
  {
    path: '/error_401',
    name: 'error_401',
    component: Main,
    meta: {
      hideInMenu: true
    },
    children: [
      {
        path: '/error_401',
        name: 'error_401',
        meta: {
          title: '401',
        },
        component: () => import('@/view/error-page/401.vue')
      }
    ],
  },
  {
    path: '/error_404',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  },
  {
    path: '/error_500',
    name: 'error_500',
    component: Main,
    meta: {
      hideInMenu: true
    },
    children: [
      {
        path: '/error_500',
        name: 'error_500',
        meta: {
          title: '500',
          pageTitle: '错误提示'
        },
        component: () => import('@/view/error-page/500.vue')
      }
    ]
  }
]
