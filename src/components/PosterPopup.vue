<template>
  <van-popup v-model:show="showPosterPopup" round class="poster-popup" @close="closePopup">
    <van-image round class="user-img" :src="avatarUrl" />
    <div class="right-wrapper">
      <span class="user-info">
        {{ chatUsername }}
      </span>
      <div class="btn-wrapper" v-if="!myInfo">
        <van-button
          class="popup-follow-btn"
          :text="follow ? '已关注' : '关注'"
          @click="opUserFollow"
        />
        <van-button class="popup-chat-btn" @click="privateChat">私聊</van-button>
      </div>
    </div>
  </van-popup>
</template>

<script setup>
import { getPosterUserInfo } from '@/api/userinfo.js'
import { followUser } from '@/api/user.js'
const props = defineProps({
  posterId: Number
})

const showPosterPopup = defineModel()
watch(
  () => showPosterPopup.value,
  async (newVal) => {
    showPosterPopup.value = newVal
    if (showPosterPopup.value) {
      try {
        const res = await getPosterUserInfo(props.posterId)
        if (res.code == status_code.OK) {
          chatUsername.value = res.data.username
          avatarUrl.value = res.data.avatar_url
          follow.value = res.data.follow
          myInfo.value = res.data.my_info
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
)
const closePopup = () => {
  showPosterPopup.value = false
}
const avatarUrl = ref('')
const chatUsername = ref('')
const follow = ref(false)
const myInfo = ref(false)
const opUserFollow = async () => {
  try {
    const res = await followUser({
      user_id: props.posterId
    })
    if (res.code == status_code.OK) {
      follow.value = !follow.value
      showToast(res.msg)
    }
  } catch (error) {
    console.log(error)
  }
}

const privateChat = () => {
  router.push({
    path: '/chat',
    query: {
      chatUserId: props.posterId,
      chatUsername: chatUsername.value,
      type: 'private'
    }
  })
}
</script>

<style scoped>
.poster-popup {
  width: 85vw;
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.user-img {
  width: 80px;
  height: 80px;
}
.user-info {
  display: flex;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
}
.popup-follow-btn,
.popup-chat-btn {
  height: 8vw;
  width: 20vw;
}
.right-wrapper {
  display: flex;
  flex-direction: column;
  height: 80px;
  width: 200px;
  /* 子元素均匀分布 */
  justify-content: space-evenly;
}
.btn-wrapper {
  display: flex;
  justify-content: space-evenly;
}
</style>
