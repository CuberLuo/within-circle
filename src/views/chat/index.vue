<template>
  <div>
    <van-nav-bar :title="route.query.chatUsername" :left-arrow="true" @click-left="onClickLeft" />
    <div class="chat-content">
      <div
        class="chat-row"
        v-for="chat in chatList"
        :key="chat.id"
        :style="{
          'flex-direction': chat.username === username ? 'row-reverse' : 'row'
        }"
      >
        <van-image class="user-avatar" round :src="chat.avatar" />

        <div class="chat-box-wrapper">
          <div :class="{ 'chat-box': true, 'me-box': chat.username === username }">
            <span v-text="chat.text" />
          </div>
        </div>
      </div>
    </div>
    <div class="op-wrapper">
      <van-field
        class="message-input"
        v-model="userText"
        autosize
        rows="1"
        type="textarea"
        placeholder="请输入信息"
      />
      <van-button type="primary" @click="sendMessage">发送</van-button>
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

const ServerUrl = getServerUrl()
const uuidv4 = v4
const route = useRoute()
const chatUserId = route.query.chatUserId
const chatUsername = route.query.chatUsername

const onClickLeft = () => {
  history.go(-1)
}
const userText = ref('')
const chatList = ref([
  {
    id: uuidv4(),
    username,
    userId,
    avatar: userAvatarUrl,
    text: '消息001',
    chatDate: '2024-01-02 23:01:01'
  },
  {
    id: uuidv4(),
    username: chatUsername,
    userId: chatUserId,
    avatar: 'https://within-circle.techvip.site/images/default_user.jpg',
    text: '消息002',
    chatDate: '2024-01-02 23:01:02'
  },
  {
    id: uuidv4(),
    username,
    userId,
    avatar: userAvatarUrl,
    text: 'This message is too long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long',
    chatDate: '2024-01-02 23:01:03'
  },
  {
    id: uuidv4(),
    username: chatUsername,
    userId: chatUserId,
    avatar: 'https://within-circle.techvip.site/images/default_user.jpg',
    text: 'This message is too long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long',
    chatDate: '2024-01-02 23:01:04'
  },
  {
    id: uuidv4(),
    username,
    userId,
    avatar: userAvatarUrl,
    text: 'This message is too long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long',
    chatDate: '2024-01-02 23:01:05'
  }
])

const socket = io(ServerUrl, {
  query: {
    username,
    userId,
    chatUserId
  }
})

const sendMessage = () => {}
</script>

<style scoped>
.van-nav-bar {
  --van-nav-bar-icon-color: var(--van-cell-text-color);
}

.chat-content {
  height: calc(100vh - var(--van-nav-bar-height) - 60px);
  border: 1px solid red;
  overflow-y: auto;
}

.chat-row {
  display: flex;
  justify-content: flex-start;
}

.user-avatar {
  width: 40px;
  height: 40px;
  margin: 5px 3px;
}

.chat-box-wrapper {
  display: flex;
  align-items: center;
}

.chat-box,
.me-box {
  max-width: 70vw;
  /* 内容过长时自动换行 */
  overflow-wrap: break-word;
  /* 保留代码中出现的空白字符，自动换行 */
  white-space: pre-wrap;
  margin: 5px 0;
  width: fit-content;
  padding: 5px;
  border-radius: 5px;
}
.chat-box {
  background-color: #363534;
  color: #ffffff;
}
.me-box {
  background-color: #3b9e72;
  color: #000000;
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
