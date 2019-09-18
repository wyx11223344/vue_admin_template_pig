/**
 * Created by WYX
 * Time 2019/9/5
 */
import request from '@/utils/request'
import axios from 'axios'
import getSign from '@/utils/sign'

export function typePicList(params) {
    return request({
        url: '/web/type_pic_list',
        method: 'POST',
        params
    })
}

export function typePicType(params) {
    return request({
        url: '/web/type_pic_type',
        method: 'POST',
        params
    })
}

export function picChange(params) {
    const arr = getSign()
    params.append('timestamp', arr[0])
    params.append('rand', arr[1])
    params.append('signature', arr[2])
    params.append('noLog', true)
    return axios.post(`${process.env.VUE_APP_BASE_API}/webChange/pic_change`,
        params
    )
}
