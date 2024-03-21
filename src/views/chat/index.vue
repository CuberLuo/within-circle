<template>
  <div>
    <van-nav-bar :title="chatUsername" :left-arrow="true" @click-left="onClickLeft" />
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
        ref="messageInput"
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
import { v4 } from 'uuid'
import moment from 'moment'
import { useUserInfoStore } from '@/stores/userInfo.js'
import { useResizeObserver } from '@vueuse/core'

const { userId, username, userAvatarUrl } = useUserInfoStore().user_info

const uuidv4 = v4
const route = useRoute()
const chatUserId = route.query.chatUserId
const chatUsername = route.query.chatUsername

const onClickLeft = () => {
  history.go(-1)
}
const messageInput = ref(null)
const userText = ref('')
const bottomHeight = ref('60px')

// 监听元素的宽高动态变化
useResizeObserver(messageInput, (entries) => {
  const entry = entries[0]
  const { width, height } = entry.contentRect
  bottomHeight.value = `${height + 36}px`
})

const chatList = ref([])
const socket = inject('socket')

const sendMessage = () => {
  if (userText.value == '') {
    showFailToast('内容不能为空')
    return
  }
  const chatObj = {
    id: uuidv4(),
    username,
    userId,
    chatUserId,
    avatar: userAvatarUrl,
    text: userText.value,
    chatDate: moment().format('YYYY-MM-DD HH:mm:ss')
  }
  chatList.value.push(chatObj)
  socket.emit('privateChat', chatObj, (res) => {
    if (res === void 0) return
    console.log(res)
  })
  userText.value = '' //清空输入
  // 页面dom元素更新后聊天内容滚动到底部
  nextTick(() => {
    scrollToBottom()
  })
}

const scrollToBottom = () => {
  const chatContent = document.querySelector('.chat-content')
  chatContent.scrollTop = chatContent.scrollHeight
}

onMounted(() => {
  showLoadingToast({
    duration: 0
  })
  try {
    socket.emit('privateChatHistory', { userId, chatUserId })
  } catch (e) {
    router.push('/index')
    setTimeout(() => {
      window.location.reload()
    }, 300)
  }

  // 获取聊天记录
  socket.on('privateChatHistory', ({ chatUserId, msgHistory }) => {
    console.log('获取聊天记录')
    closeToast()
    chatList.value = msgHistory
    nextTick(() => {
      scrollToBottom()
    })
  })
  //服务端回复消息
  socket.on('privateChat', (data) => {
    console.log('服务端回复消息', data)
    chatList.value.push(data)
    nextTick(() => {
      scrollToBottom()
    })
  })
  scrollToBottom()
})
</script>

<style scoped>
.van-nav-bar {
  --van-nav-bar-icon-color: var(--van-cell-text-color);
}

.chat-content {
  /* 通过v-bind在css中使用js变量 */
  height: calc(100vh - var(--van-nav-bar-height) - v-bind(bottomHeight));
  overflow-y: auto;
  background-color: var(--van-color-chat-bg);
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
  padding: 10px;
  border-radius: 5px;
  font-family: 'Microsoft YaHei';
  font-size: 14px;
}
.chat-box {
  background-color: var(--van-color-chat-to);
  color: var(--van-color-chat-to-text);
}
.me-box {
  background-color: var(--van-color-me-chat);

  color: var(--van-color-me-chat-text);
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
