import { useUserTokenStore } from '@/stores/userToken.js'
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
    if (to.path !== '/auth' && to.path !== '/register') {
      showFailToast('对不起,您尚未登录')
      next('/auth') // 未登录时只能跳转到登录页
    } else {
      next()
    }
  }
})
