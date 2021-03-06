/**
 * Created by WYX
 * Time 2019/8/22
 */
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
