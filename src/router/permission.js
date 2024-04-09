import { useUserTokenStore } from '@/stores/userToken.js'
// 不需要token就能访问的页面
const whitelist = ['/index', '/auth', '/register']
// 前置路由守卫
router.beforeEach((to, from, next) => {
  if (useUserTokenStore().token) {
    // 有token
    if (to.path === '/auth') {
      next('/') // 已登录后跳转到主页
    } else {
      next()
    }
  } else {
    // 无token
    if (whitelist.indexOf(to.path) === -1) {
      showFailToast('对不起,您尚未登录')
      next('/auth') // 未登录时只能跳转到登录页
    } else {
      next()
    }
  }
})
