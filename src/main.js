import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import * as filters from './utils/filters'
import echarts from 'echarts' // 引入echarts
import directive from './directive/waves/index'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * 循环遍历全局注册过滤器
 */
Object.keys(filters).forEach((key) => {
    Vue.filter(key, filters[ key ])
})
/**
 * If you don't want to use mock-server
 * you want to use mockjs for request interception
 * you can execute:
 *
 * import { mockXHR } from '../mock'
 * mockXHR()
 */

// set ElementUI lang to EN
Vue.use(directive)
Vue.use(ElementUI)
Vue.prototype.$echarts = echarts // 引入组件

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
