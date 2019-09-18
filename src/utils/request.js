import axios from 'axios'
import { Loading, Message } from 'element-ui'
import store from '@/store'
import qs from 'qs'
import getSign from '@/utils/sign'
let loadingInstance

// create an axios instance
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
    withCredentials: true, // send cookies when cross-domain requests
    timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
    config => {
    // do something before request is sent

        // if (store.getters.token) {
        //   // let each request carry token
        //   // ['X-Token'] is a custom headers key
        //   // please modify it according to the actual situation
        //   config.headers['X-Token'] = getToken()
        // }
        // 加密添加请求头
        if (!config.data) {
            config.data = {}
        }
        const arr = getSign()
        config.data.timestamp = arr[0]
        config.data.rand = arr[1]
        config.data.signature = arr[2]
        if (config.method === 'post') {
            config.data = qs.stringify(config.data) // post请求格式化数据
        }
        loadingInstance = Loading.service({ // 加载动画
            text: '玩命加载中...',
            background: 'rgba(255, 255, 255, 0.6)'
        })
        store.commit('changeLoadingArr', store.getters.loadingArr + 1) // 动画加载个数加1
        return config
    },
    error => {
    // do something with request error
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

    /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
    response => {
        const res = response.data
        store.commit('changeLoadingArr', store.getters.loadingArr - 1) // 动画加载个数减1
        if (store.getters.loadingArr === 0) {
            loadingInstance.close()
        }
        // if the custom code is not 20000, it is judged as an error.
        if (res.code !== 200) {
            Message({
                message: res.msg || 'error',
                type: 'error',
                duration: 5 * 1000
            })

            // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
            if (res.code === 50001) {
                // to re-login
                Message.error('您已退出登录')
                setTimeout(() => {
                    store.dispatch('user/resetToken').then(() => {
                        location.reload()
                    })
                    return res
                }, 1000)
            }
            if (res === '您无权访问') {
            // to re-login
                // to re-login
                Message.error('您已退出登录')
                setTimeout(() => {
                    store.dispatch('user/resetToken').then(() => {
                        location.reload()
                    })
                    return res
                }, 1000)
            }
            return Promise.reject(res.message || 'error')
        } else {
            return res
        }
    },
    err => {
        store.commit('changeLoadingArr', store.getters.loadingArr - 1) // 动画加载个数减1
        if (store.getters.loadingArr === 0) {
            loadingInstance.close()
        }
        Message({
            message: err.message,
            type: 'error',
            duration: 5 * 1000
        })
        if (err.response) {
            switch (err.response.status) {
                case 400:
                    err.message = '错误请求'
                    break
                case 401:
                    err.message = '未授权，请重新登录'
                    break
                case 403:
                    err.message = '拒绝访问'
                    break
                case 404:
                    err.message = '请求错误，未找到该资源'
                    break
                case 405:
                    err.message = '请求方法未允许'
                    break
                case 408:
                    err.message = '请求超时'
                    break
                case 500:
                    err.message = '服务端出错'
                    break
                case 501:
                    err.message = '网络未实现'
                    break
                case 502:
                    err.message = '网络错误'
                    break
                case 503:
                    err.message = '服务不可用'
                    break
                case 504:
                    err.message = '网络超时'
                    break
                case 505:
                    err.message = 'http版本不支持该请求'
                    break
                default:
                    err.message = `连接错误${err.response.status}`
            }
        } else {
            err.message = '连接服务器失败'
        }
        return Promise.reject(err.message)
    }
)

export default service
