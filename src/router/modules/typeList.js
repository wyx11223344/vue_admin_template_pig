/**
 * Created by WYX
 * Time 2019/8/26
 */
import Layout from '@/layout'
export default {
    path: '/typeList',
    component: Layout,
    redirect: '/typeList/card',
    name: 'TypeList',
    meta: { title: '类型管理', icon: 'type' },
    children: [
        {
            path: 'card',
            name: 'TypeListCardIndex',
            component: () => import('@/views/typeList/card/index'),
            meta: { title: '类型管理卡片', icon: 'card' }
        },
        {
            path: 'chart',
            name: 'chart',
            component: () => import('@/views/user/chart/index'),
            meta: { title: '类型管理图形', icon: 'chart' }
        }
    ]
}
