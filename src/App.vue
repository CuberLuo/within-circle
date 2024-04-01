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
import { useAddUserContact, useUpdateUnReadNum } from '@/mixins/userContact.js'
import { useContactListStore } from '@/stores/contactList'

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

const socket = inject('socket')

const websocketInit = (user_info) => {
  // 非空对象表示已登录
  if (Object.keys(user_info).length !== 0) {
    console.log('socket执行login')
    socket.emit('login', user_info, (res) => {
      console.log(res)
      // 获取云端暂存的消息记录更新至本地
      const cloudChatObj = res.data
      for (const key in cloudChatObj) {
        cloudChatObj[key].forEach((element) => {
          if (element.isImg) useAddUserContact(element.avatar, element.userId, element.username)
          else useAddUserContact(element.avatar, element.userId, element.username, element.text)
          useUpdateUnReadNum(key)
          updateLocalChatHistory(key, element)
        })
      }
    })
  }
}
socket.off('privateChat')
socket.on('privateChat', (data) => {
  console.log('服务端回复消息', data)
  if (data.isImg) useAddUserContact(data.avatar, data.userId, data.username)
  else useAddUserContact(data.avatar, data.userId, data.username, data.text)
  showNotify({
    message: `${moment().format('HH:mm:ss')} 用户${data.username}给您发来一条新消息`,
    type: 'primary',
    teleport: '#app'
  })
  useUpdateUnReadNum(data.userId)
  updateLocalChatHistory(data.userId, data)
})

const updateLocalChatHistory = (chatUserId, chatObj) => {
  // 更新本地聊天记录
  let chatHistory = getItem('chatHistoty')
  const chatUserHistoryList = chatHistory[chatUserId]
  if (!chatUserHistoryList) {
    chatHistory[chatUserId] = []
  }

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
  if (!getItem('contactList')) useContactListStore().setContactList([])
  websocketInit(useUserInfoStore().user_info)
})
</script>

<style scoped></style>
