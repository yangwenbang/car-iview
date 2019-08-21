import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import routesManager from './routers_manager'
import store from '@/store'
import iView from 'iview'
import { setToken, getToken, canTurnTo,closeNowTag } from '@/libs/util'
import config from '@/config'
const { homeName } = config
Vue.use(Router)
const employeeId = store.state.user.employeeId;
let routersNew;
if(employeeId == "1"){
  routersNew = routesManager
}else{
  routersNew = routes
}
const router = new Router({
  routes:routersNew,
  //mode: 'history'
})
const LOGIN_PAGE_NAME = 'login'
const turnTo = (to, access, next) => {
  if (canTurnTo(to.name, access, routes)) next() // 有权限，可访问
  else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
}
if(process.env.NODE_ENV != 'development') {
  router.beforeEach((to, from, next) => {
    iView.LoadingBar.start()
    const token = getToken()
    //const token = '{"warehouse":{"warehouseId":1,"warehouseName":"上海城南库"}}'
    if (!token && to.name !== LOGIN_PAGE_NAME) {
      // 未登录且要跳转的页面不是登录页
      next({
        name: LOGIN_PAGE_NAME // 跳转到登录页
      })
    } else if (!token && to.name === LOGIN_PAGE_NAME) {
      // 未登陆且要跳转的页面是登录页
      next() // 跳转
    } else if (token && to.name === LOGIN_PAGE_NAME) {
      // 已登录且要跳转的页面是登录页
      next({
        name: homeName // 跳转到homeName页
      })
    } else {
      if(token){
        const tokenJson = eval('(' + token + ')');
        //const tokenJson = {"warehouse":{"warehouseId":1,"warehouseName":"上海城南库"}}
        store.commit("setWarehouse",tokenJson.warehouse);
        if(to.name == "error_401"){
          closeNowTag(store.state.app, from);
          next();
        }else{
          next();
        }
      }else{
        next({
          name: 'login'
        })
      }
      
    }
  })
}

router.afterEach(to => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
