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
import moment from 'moment'
import { useAddUserContact } from '@/mixins/userContact.js'

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
socket.on('privateChat', (data) => {
  console.log('服务端回复消息', data)
  showNotify({
    message: `${moment().format('HH:mm:ss')} 用户${data.username}给您发来一条新消息`,
    type: 'primary',
    teleport: '#app'
  })
  if (data.isImg) useAddUserContact(data.avatar, data.userId, data.username)
  else useAddUserContact(data.avatar, data.userId, data.username, data.text)
  updateLocalChatHistory(data.userId, data)
})

const updateLocalChatHistory = (chatUserId, chatObj) => {
  // 更新本地聊天记录
  let chatHistory = getItem('chatHistoty')
  chatHistory[chatUserId].push(chatObj)
  setItem('chatHistoty', chatHistory)
}

watch(
  () => useUserInfoStore().user_info,
  (newVal) => {
    websocketInit(newVal)
  }
)

onMounted(() => {
  if (!getItem('chatHistoty')) setItem('chatHistoty', {})
  if (!getItem('contactList')) setItem('contactList', [])
  websocketInit(useUserInfoStore().user_info)
})
</script>

<style scoped></style>
