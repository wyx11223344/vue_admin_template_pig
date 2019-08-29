/**
 * Created by WYX
 * Time 2019/8/26
 */
import Layout from '@/layout'
export default {
    path: '/user',
    component: Layout,
    redirect: '/user/table',
    name: 'user',
    meta: { title: '用户管理', icon: 'user' },
    children: [
        {
            path: 'table',
            name: 'Table',
            component: () => import('@/views/user/table/index'),
            meta: { title: '用户表格', icon: 'table' }
        },
        {
            path: 'chart',
            name: 'chart',
            component: () => import('@/views/user/chart/index'),
            meta: { title: '用户图形', icon: 'chart' }
        }
    ]
}
