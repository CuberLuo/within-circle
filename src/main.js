import '@/assets/main.css'
import '@/assets/font/iconfont.css'
import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import 'vant/es/notify/style'
import 'vant/es/image-preview/style'
import { Lazyload } from 'vant'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import '@/router/permission'
// import VConsole from 'vconsole'
/* const vconsole = new VConsole({
  onReady() {
    console.log('vConsole is ready!')
  }
}) */
export const app = createApp(App)
const setupApp = async () => {
  const pinia = createPinia()

  app.use(pinia)
  app.use(Lazyload, {
    lazyComponent: true
  })
  app.use(router)
  await router.isReady()

  app.mount('#app')
}

setupApp()
