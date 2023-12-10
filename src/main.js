import '@/assets/main.css'
import '@/assets/font/iconfont.css'
import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import 'vant/es/notify/style'
import 'vant/es/image-preview/style'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import '@/router/permission'
import VConsole from 'vconsole'

const app = createApp(App)
const pinia = createPinia()
const vconsole = new VConsole({
  onReady() {
    console.log('vConsole is ready!')
  }
})

app.use(pinia)
app.use(router)

app.mount('#app')
