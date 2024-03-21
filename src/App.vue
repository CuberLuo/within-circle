<template>
  <van-config-provider
    :theme="theme"
    :theme-vars-dark="themeVarsDark"
    :theme-vars-light="themeVarsLight"
  >
    <RouterView />
  </van-config-provider>
</template>

<script setup>
import { useThemeStore } from '@/stores/theme.js'
import { useUserInfoStore } from '@/stores/userInfo.js'
import { app } from './main'
import SocketIO from '@/utils/socket'
import { onMounted } from 'vue'
const themeVarsDark = reactive({
  switchNodeBackground: '#141414',
  tabbarItemTextColor: '#a9b2bb',
  colorChatTo: '#2c2c2c',
  colorMeChat: '#3eb477',
  colorChatBg: '#111111',
  colorMeChatText: '#001c03',
  colorChatToText: '#d7d7d7'
})
const themeVarsLight = reactive({
  switchNodeBackground: '#ffffff',
  tabbarItemTextColor: '#a9b2bb',
  colorChatTo: '#ffffff',
  colorMeChat: '#95ec6a',
  colorChatBg: '#ededed',
  colorMeChatText: '#081f00',
  colorChatToText: '#171717'
})
const theme = ref('')
theme.value = useThemeStore().theme
watch(
  //监听pinia中的theme值的变化
  () => useThemeStore().theme,
  (newVal) => {
    theme.value = newVal
  }
)

const websocketInit = (user_info) => {
  // 非空对象表示已登录
  if (Object.keys(user_info).length !== 0) {
    const { username, userId } = useUserInfoStore().user_info
    // 引入自定义的SocketIO插件
    app.use(SocketIO, {
      connection: import.meta.env.VITE_SOCKET_SERVER,
      options: {
        autoConnect: true, // 自动连接
        transports: ['websocket'], // 指定为websocket连接
        reconnect: true,
        reconnectionAttempts: 5, // 重连次数
        query: {
          username,
          userId
        }
      }
    })
  }
}

watch(
  () => useUserInfoStore().user_info,
  (newVal) => {
    websocketInit(newVal)
  }
)

onMounted(() => {
  console.log('websocket初始化')
  websocketInit(useUserInfoStore().user_info)
})
</script>

<style scoped></style>
