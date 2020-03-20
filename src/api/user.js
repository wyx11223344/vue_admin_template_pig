/**
 * Created by WYX
 * Time 2019/8/22
 */
import request from '@/utils/request'

export function login(data) {
    return request({
        url: '/loginc/userLogin',
        method: 'post',
        data
    })
}

export function logout() {
    return request({
        url: '/loginc/login_out',
        method: 'post'
    })
}
