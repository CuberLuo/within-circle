<template>
  <div>
    <van-nav-bar :title="chatUsername" :left-arrow="true" @click-left="onClickLeft" />
    <div class="chat-content">
      <div
        class="chat-row"
        v-for="(chat, index) in chatList"
        :key="chat.id"
        :style="{
          'flex-direction': chat.username === username ? 'row-reverse' : 'row'
        }"
      >
        <van-image class="user-avatar" round :src="chat.avatar" />
        <van-popover
          v-model:show="chat.showPopover"
          trigger="manual"
          :actions="[{ text: '删除', value: chat.id, index: index }]"
          actions-direction="horizontal"
          placement="top"
          theme="dark"
          @select="onSelectAction"
        >
          <template #reference>
            <div
              v-if="!chat.isImg"
              class="chat-box-wrapper"
              v-touch:longtap="longtapHandler(chat, chat.id)"
            >
              <div :class="{ 'chat-box': true, 'me-box': chat.username === username }">
                <span style="user-select: none" v-text="chat.text" />
              </div>
            </div>
            <div v-else class="chat-img-wrapper" v-touch:longtap="longtapHandler(chat, chat.id)">
              <van-image
                class="chat-img"
                fit="scale-down"
                :src="chat.imgUrl"
                @click="showImage(chat.imgUrl)"
                @load="scrollToBottom"
              />
            </div>
          </template>
        </van-popover>
      </div>
    </div>
    <div class="op-wrapper">
      <van-field
        ref="messageInput"
        id="messageInput"
        class="message-input"
        v-model="userText"
        autosize
        rows="1"
        type="textarea"
        placeholder="请输入信息"
        @focus="onMessageInputFocus"
        @blur="onMessageInputBlur"
      />
      <van-popover
        trigger="manual"
        v-model:show="showEmojiPopover"
        placement="top-end"
        theme="dark"
      >
        <Emoji @clickedEmoji="clickedEmoji" />
        <template #reference>
          <van-icon
            class="op-icon"
            name="smile-o"
            @click="showEmojiPopover = !showEmojiPopover"
            @mousedown.prevent
          />
        </template>
      </van-popover>
      <van-uploader v-if="userText === ''" :before-read="beforeRead" :after-read="afterRead">
        <!-- @mousedown.prevent防止点击元素后输入框失去焦点 -->
        <van-icon class="op-icon" name="add-o" @mousedown.prevent />
      </van-uploader>
      <van-button v-else type="primary" @click="sendMessage">发送</van-button>
    </div>
  </div>
</template>

<script setup>
import { v4 } from 'uuid'
import moment from 'moment'
import { useUserInfoStore } from '@/stores/userInfo.js'
import { useResizeObserver } from '@vueuse/core'
import { showImagePreview } from 'vant'
import { useBeforeReadFile } from '@/mixins/fileCompress.js'
import { uploadFile } from '@/api/post.js'
import {
  useAddUserContact,
  useUpdateUserContact,
  useUpdateUnReadNum,
  useClearUnReadNum,
  useUpdateLocalChatHistory
} from '@/mixins/userContact.js'
import Emoji from './Emoji.vue'

const { userId, username, userAvatarUrl } = useUserInfoStore().user_info

const uuidv4 = v4
const route = useRoute()
const chatUserId = route.query.chatUserId
const chatUsername = route.query.chatUsername
const chatUserAvatar = route.query.chatUserAvatar
const onClickLeft = () => {
  window.removeEventListener('resize', keyBoardCheck)
  useClearUnReadNum(chatUserId)
  history.go(-1)
}
const messageInput = ref(null)
const userText = ref('')
const bottomHeight = ref('60px')
const sendImgUrl = ref('')
const showEmojiPopover = ref(false)

let blurIndex = null
const preventInputBulr = () => {
  const messageInputDom = document.getElementById('messageInput')
  // 点击表情输入框不失去焦点
  messageInputDom.focus()
}
const clickedEmoji = (val) => {
  if (blurIndex == userText.value.length || blurIndex == null) userText.value += val
  else userText.value = userText.value.slice(0, blurIndex) + val + userText.value.slice(blurIndex)
  const messageInputDom = document.getElementById('messageInput')
  // 点击表情输入框不失去焦点
  messageInputDom.focus()

  nextTick(() => {
    const messageInputDom = document.getElementById('messageInput')
    // emoji占两个字符所以光标位置要加2
    messageInputDom.setSelectionRange(blurIndex + 2, blurIndex + 2)
    /* 通过ref绑定设置光标位置写法太复杂 */
    // messageInput.value.$el.children[0].children[0].children[0].setSelectionRange(
    //   blurIndex + 1,
    //   blurIndex + 1
    // )
  })

  showEmojiPopover.value = false
}

const onMessageInputFocus = (event) => {
  nextTick(() => {
    scrollToBottom()
  })
}
const onMessageInputBlur = (event) => {
  blurIndex = event.srcElement.selectionStart //光标所在的位置
  console.log('blurIndex: ', blurIndex)
  // event.target.focus()
}

const longtapHandler = (chat, i) => {
  return function (direction, mouseEvent) {
    chat.showPopover = true
  }
}
const onSelectAction = (action) => {
  chatList.value.splice(action.index, 1)
  let chatHistory = getItem('chatHistoty')
  chatHistory[chatUserId].splice(action.index, 1)
  setItem('chatHistoty', chatHistory)
  // 删除某项聊天内容后需要更新联系人列表的聊天预览文字
  if (chatList.value.length === 0)
    useUpdateUserContact(chatUserAvatar, chatUserId, chatUsername, '', '')
  const lastChat = chatList.value[chatList.value.length - 1]
  if (lastChat.isImg)
    useUpdateUserContact(chatUserAvatar, chatUserId, chatUsername, lastChat.chatDate)
  else
    useUpdateUserContact(chatUserAvatar, chatUserId, chatUsername, lastChat.chatDate, lastChat.text)
}

// 监听元素的宽高动态变化
useResizeObserver(messageInput, (entries) => {
  const entry = entries[0]
  const { width, height } = entry.contentRect
  bottomHeight.value = `${height + 36}px`
})

const chatList = ref([])

const socket = inject('socket')

socket.off('privateChat')
//服务端回复消息
socket.on('privateChat', (data) => {
  console.log('chat 服务端回复消息', data)
  // 联系人列表相关信息更新
  if (data.isImg) useAddUserContact(data.avatar, data.userId, data.username, data.chatDate)
  else useAddUserContact(data.avatar, data.userId, data.username, data.chatDate, data.text)
  if (route.path != '/chat' || chatUserId != data.userId) {
    showNotify({
      message: `${moment().format('HH:mm:ss')} 用户${data.username}给您发来一条新消息`,
      type: 'primary',
      teleport: '#app'
    })
    useUpdateUnReadNum(data.userId)
  }
  if (chatUserId == data.userId) {
    chatList.value.push(data)
  }

  useUpdateLocalChatHistory(data.userId, data)
  nextTick(() => {
    scrollToBottom()
  })
})

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
    showPopover: false,
    chatDate: moment().format('YYYY-MM-DD HH:mm:ss')
  }
  chatList.value.push(chatObj)
  useAddUserContact(
    chatUserAvatar,
    chatUserId,
    chatUsername,
    moment().format('YYYY-MM-DD HH:mm:ss'),
    userText.value
  )
  useUpdateLocalChatHistory(chatUserId, chatObj)
  socket.emit('privateChat', chatObj, (res) => {
    if (res === void 0) return
    console.log(res)
  })
  userText.value = '' //清空输入
  // 页面dom元素更新后聊天内容滚动到底部
  nextTick(() => {
    scrollToBottom()
    const messageInputDom = document.getElementById('messageInput')
    // 点击发送后输入框不失去焦点
    messageInputDom.focus()
  })
}

const scrollToBottom = () => {
  const chatContent = document.querySelector('.chat-content')
  chatContent.scrollTop = chatContent.scrollHeight
}

const showImage = (url) => {
  showImagePreview({
    images: [url],
    showIndex: false
  })
}

const beforeRead = (file) => {
  return useBeforeReadFile(file, 500)
}

const afterRead = async (file) => {
  sendImgUrl.value = file.objectUrl
  let formData = new FormData()
  formData.append('pic', file.file)

  let chatObj = {
    id: uuidv4(),
    username,
    userId,
    chatUserId,
    avatar: userAvatarUrl,
    isImg: true,
    imgUrl: sendImgUrl.value,
    chatDate: moment().format('YYYY-MM-DD HH:mm:ss')
  }
  chatList.value.push(chatObj)

  let onlineImageUrl = ''
  try {
    const res = await uploadFile(formData)
    onlineImageUrl = res.data.url
    if (res.code == status_code.OK) {
      // 通过socket发送图片链接到后端时需要将本地链接替换为云链接
      // 不直接更改chatObj的图片链接防止出现图片闪烁
      const chatObjCopy = { ...chatObj }
      chatObjCopy.imgUrl = onlineImageUrl
      useAddUserContact(
        chatUserAvatar,
        chatUserId,
        chatUsername,
        moment().format('YYYY-MM-DD HH:mm:ss')
      )
      useUpdateLocalChatHistory(chatUserId, chatObjCopy)
      socket.emit('privateChat', chatObjCopy, (res) => {
        if (res === void 0) return
        console.log(res)
      })
    } else {
      showFailToast('图片上传出错')
      return
    }
  } catch (err) {
    console.log(err)
    showFailToast('图片上传出错')
    return
  }

  // 页面dom元素更新后聊天内容滚动到底部
  nextTick(() => {
    scrollToBottom()
  })
}

const keyBoardCheck = () => {
  // 窗口大小改变意味着键盘弹出或收起
  scrollToBottom()
}
onMounted(() => {
  console.log('onMounted')
  // 读取本地聊天记录
  let chatHistory = getItem('chatHistoty') || {}
  const chatUserHistoryList = chatHistory[chatUserId]
  if (!chatUserHistoryList) {
    chatHistory[chatUserId] = []
    setItem('chatHistoty', chatHistory)
  }
  chatList.value = chatHistory[chatUserId]
  nextTick(() => {
    scrollToBottom()
  })

  window.addEventListener('resize', keyBoardCheck)
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
  margin: 5px 0;
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

.chat-img {
  margin: 5px 0;
  min-width: 50px;
  min-height: 50px;
}
:deep() .van-image__img {
  max-width: 200px;
  max-height: 150px;
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
  width: 20vw;
  margin-left: 10px;
}

.message-input::after {
  display: none;
}

.op-icon {
  font-size: 30px;
  margin-left: 10px;
}
</style>
