import request from '@/utils/request'

export function login(data) {
    return request({
        url: 'loginc/userLogin',
        method: 'post',
        data
    })
}

export function logout() {
    return request({
        url: 'loginc/login_out',
        method: 'post'
    })
}
