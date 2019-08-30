// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import config from '@/config'
import importDirective from '@/directive'
import installPlugin from '@/plugin'
import iviewArea from 'iview-area';
import { Select, Option } from 'element-ui';

import $ from 'jquery'
import 'iview/dist/styles/iview.css'
import '@/assets/styles/common.less'
import '@/assets/icons/iconfont.css'

Vue.use(iView)
Vue.use(iviewArea)
Vue.use(Select)
Vue.use(Option)

import * as filters from '@/libs/filters'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * 注册指令
 */
importDirective(Vue)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
