import '@/assets/main.css'
import '@/assets/font/iconfont.css'
import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import 'vant/es/notify/style'
import 'vant/es/image-preview/style'
import { Lazyload } from 'vant'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Vue3TouchEvents from 'vue3-touch-events'

import App from './App.vue'
import router from './router'
import '@/router/permission'
import SocketIO from '@/utils/socket'
/* import VConsole from 'vconsole'
const vconsole = new VConsole({
  onReady() {
    console.log('vConsole is ready!')
  }
}) */
const app = createApp(App)
const setupApp = async () => {
  const pinia = createPinia()

  app.use(pinia)
  app.use(Lazyload, {
    lazyComponent: true
  })
  app.use(router)

  // 引入自定义的SocketIO插件
  app.use(SocketIO, {
    connection: import.meta.env.VITE_SOCKET_SERVER,
    options: {
      autoConnect: true, // 自动连接
      transports: ['websocket'], // 指定为websocket连接
      reconnect: true,
      reconnectionAttempts: 5 // 重连次数
    }
  })
  app.use(Vue3TouchEvents)
  await router.isReady()

  app.mount('#app')
}

setupApp()
