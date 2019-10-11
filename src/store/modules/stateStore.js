/*
 * @Description: 模板数据
 * @Author: wu.weiming
 * @Date: 2019-1-15
 * @Last Modified by:
 * @Last Modified time:
 */
'use strict'
const stateStore = {
    state: {
        loadingArr: 0 // 关于加载动画几时结束
    },
    mutations: {
        changeLoadingArr: (state, token) => { // 这里的state对象对应上面的state
            state.loadingArr = token
        }
    }
}

export default stateStore
