/**
 * Created by WYX
 * Time 2019/9/5
 */
import request from '@/utils/request'

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
