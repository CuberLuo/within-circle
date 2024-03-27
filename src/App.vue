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

const socketLogin = ref(false)
provide('socketLogin', socketLogin)
const socket = inject('socket')

const websocketInit = (user_info) => {
  // 非空对象表示已登录
  if (Object.keys(user_info).length !== 0) {
    console.log('socket执行login')
    socket.emit('login', user_info, (res) => {
      if (res === void 0) socketLogin.value = false
      else socketLogin.value = true
      console.log(res)
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
  websocketInit(useUserInfoStore().user_info)
})
</script>

<style scoped></style>
