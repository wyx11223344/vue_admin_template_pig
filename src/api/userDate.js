import request from '@/utils/request'

export function userList(params) {
    return request({
        url: '/user/user_get',
        method: 'POST',
        params
    })
}

export function userChange(params) {
    return request({
        url: '/user/user_change',
        method: 'POST',
        params
    })
}
