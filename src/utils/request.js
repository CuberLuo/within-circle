import axios from 'axios'
import { useUserTokenStore } from '@/stores/userToken.js'
import { useUserInfoStore } from '@/stores/userInfo.js'
import { useContactListStore } from '@/stores/contactList'
import { tokenRefresh, isRefreshRequest } from '@/api/refreshToken'
// axios封装
const service = axios.create({
  baseURL: '/api',
  timeout: 30 * 1000 //网络请求最多30s
})
// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const store = useUserTokenStore()
    if (isRefreshRequest(config)) {
      // 请求头Authorization注入refreshToken
      config.headers.Authorization = `Bearer ${store.refreshToken}`
    } else if (store.token) {
      // 请求头Authorization注入token
      config.headers.Authorization = `Bearer ${store.token}`
    }
    return config // 返回配置
  },
  (error) => {
    console.log(error.response)
    showFailToast(error.message)
    // 请求失败
    return Promise.reject(error)
  }
)
// 响应拦截器
service.interceptors.response.use(
  async (response) => {
    const { code, msg } = response.data
    if (code == status_code.UNAUTHORIZED && !isRefreshRequest(response.config)) {
      const res = await tokenRefresh()
      if (res.code == status_code.UNAUTHORIZED) {
        showFailToast('长时间未登录方圆几里，请重新登录')
        useUserTokenStore().removeToken() //清除Pinia和localStorage中无效的token
        useUserInfoStore().removeUserInfo()
        removeItem('chatHistoty')
        useContactListStore().removeContactList()
        useContactListStore().removeUnreadNum()
        router.push('/auth')
        setTimeout(() => {
          window.location.reload()
        }, 10)
      } else {
        const { access_token, refresh_token } = res.data
        useUserTokenStore().setToken(access_token, refresh_token)
        //更换新的access_token重新请求
        response.config.headers.Authorization = `Bearer ${access_token}`
        const newRes = await service.request(response.config)
        return newRes //此处newRes表示新的响应json
      }
    } else if (code == status_code.ERROR) {
      showFailToast(msg)
    }
    return response.data //返回响应json
  },
  (error) => {
    console.log(error.response)
    showFailToast(error.message) // 提示错误信息
    return Promise.reject(error)
  }
)
export default service
