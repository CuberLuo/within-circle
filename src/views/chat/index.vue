<template>
  <div>
    <van-nav-bar :title="route.query.chatUsername" :left-arrow="true" @click-left="onClickLeft" />
    <div>私聊</div>
    <div class="op-wrapper">
      <van-field
        class="message-input"
        v-model="userText"
        autosize
        rows="1"
        type="textarea"
        placeholder="请输入信息"
      />
      <van-button type="primary">发送</van-button>
    </div>
  </div>
</template>

<script setup>
import { io } from 'socket.io-client'
import { v4 } from 'uuid'
import { getServerUrl } from '@/components/data/server'
import { useUserInfoStore } from '@/stores/userInfo.js'

const { userId, username, userAvatarUrl } = useUserInfoStore().user_info
console.log('userAvatarUrl: ', userAvatarUrl)
console.log('username: ', username)
console.log('userId: ', userId)

const route = useRoute()
const onClickLeft = () => {
  history.go(-1)
}
const userText = ref('')
const chatList = ref([])

const ServerUrl = getServerUrl()
const uuidv4 = v4

const socket = io(ServerUrl, {
  query: {
    username,
    userId,
    chatUserId: route.query.chatUserId
  }
})
</script>

<style scoped>
.van-nav-bar {
  --van-nav-bar-icon-color: var(--van-cell-text-color);
}
.op-wrapper {
  position: absolute;
  bottom: 10px;
  display: flex;
  align-items: center;
  width: calc(100vw - 20px);
  margin: 0 10px;
}
.message-input {
  border-radius: 3vw;
}
:deep().van-field__control {
  max-height: 75px;
  overflow: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.van-button {
  height: 40px;
}

.message-input::after {
  display: none;
}

.van-button {
  width: 20vw;
  margin-left: 10px;
}
</style>
