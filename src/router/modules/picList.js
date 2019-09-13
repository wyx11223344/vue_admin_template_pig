/**
 * Created by WYX
 * Time 2019/9/7
 */
import Layout from '@/layout'
export default {
    path: '/picture',
    component: Layout,
    redirect: '/picture/table',
    name: 'Picture',
    meta: { title: '图片管理', icon: 'user' },
    children: [
        {
            path: 'table',
            name: 'Table',
            component: () => import('@/views/picture/index'),
            meta: { title: '图片表格', icon: 'pic_logo' }
        }
    ]
}
