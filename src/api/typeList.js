/**
 * Created by WYX
 * Time 2019/8/26
 */
import request from '@/utils/request'

export function typeListGet(params) {
    return request({
        url: '/web/list_get',
        method: 'POST',
        params
    })
}

export function typeListChange(params) {
    return request({
        url: '/webChange/list_change',
        method: 'POST',
        params
    })
}
