import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import IndexView from '@/views/index/index.vue'
const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),\
  history: createWebHashHistory(),
  routes: [
    {
      path: '/auth',
      name: 'auth',
      meta: { title: '用户认证' },
      component: () => import('@/views/auth/index.vue')
    },
    {
      path: '/register',
      name: 'register',
      meta: { title: '注册' },
      component: () => import('@/views/register/index.vue')
    },
    {
      path: '/error',
      meta: { title: '请求错误' },
      component: () => import('@/views/error/index.vue')
    },
    {
      path: '/',
      redirect: '/index',
      component: () => import('@/layout/index.vue'),
      children: [
        {
          path: '/index',
          name: 'index',
          meta: { title: '主页' },
          component: IndexView
        },
        {
          path: '/map',
          name: 'map',
          meta: { title: '地图' },
          component: () => import('@/views/map/index.vue')
        },
        {
          path: '/message',
          name: 'message',
          meta: { title: '消息' },
          component: () => import('@/views/message/index.vue')
        },
        {
          path: '/me',
          name: 'me',
          meta: { title: '我' },
          component: () => import('@/views/me/index.vue')
        },
        {
          path: '/post',
          name: 'post',
          meta: { title: '发布' },
          component: () => import('@/views/post/index.vue')
        },
        {
          path: '/myLike',
          name: 'myLike',
          meta: { title: '我的点赞' },
          component: () => import('@/views/myLike/index.vue')
        },
        {
          path: '/myPost',
          name: 'myPost',
          meta: { title: '我的发布' },
          component: () => import('@/views/myPost/index.vue')
        },
        {
          path: '/myFollow',
          name: 'myFollow',
          meta: { title: '我的关注' },
          component: () => import('@/views/myFollow/index.vue')
        },
        {
          path: '/myFans',
          name: 'myFans',
          meta: { title: '我的粉丝' },
          component: () => import('@/views/myFans/index.vue')
        },
        {
          path: '/scanQRCode',
          name: 'scanQRCode',
          meta: { title: '扫码' },
          component: () => import('@/views/scanQRCode/index.vue')
        },
        {
          path: '/myQRCode',
          name: 'myQRCode',
          meta: { title: '我的二维码' },
          component: () => import('@/views/myQRCode/index.vue')
        },
        {
          path: '/:catchAll(.*)',
          meta: { title: '页面找不到啦~~' },
          component: () => import('@/views/404/index.vue')
        }
      ]
    },
    {
      path: '/chat',
      name: 'chat',
      meta: { title: '聊天' },
      component: () => import('@/views/chat/index.vue')
    }
  ]
})

// 后置路由守卫
router.afterEach((to, from) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
})

export default router
