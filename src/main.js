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
// 组件加入
import specialUi from '@wyx962717593/special-ui'
import '@wyx962717593/special-ui/dist/special-ui.css'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * 循环遍历全局注册过滤器
 */
Object.keys(filters).forEach((key) => {
    Vue.filter(key, filters[ key ])
})

// 个人组件注册
Vue.use(specialUi)// 全部注册
// set ElementUI lang to EN
Vue.use(directive)
Vue.use(ElementUI)
Vue.prototype.$echarts = echarts // 引入组件
Vue.prototype.baseStaticUrl = 'http://193.112.145.172:8000'

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
