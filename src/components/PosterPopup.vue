<template>
  <van-popup v-model:show="showPosterPopup" round class="poster-popup" @close="closePopup">
    <van-image round class="user-img" :src="avatarUrl" />
    <div class="right-wrapper">
      <span class="user-info">
        {{ username }}
      </span>
      <van-button class="follow-btn" :text="follow ? '已关注' : '关注'" @click="opUserFollow" />
    </div>
  </van-popup>
</template>

<script setup>
import { getPosterUserInfo } from '@/api/userinfo.js'
import { followUser } from '@/api/user.js'
const props = defineProps({
  posterId: {
    type: Number
  },
  showPopup: {
    type: Boolean
  }
})

const showPosterPopup = ref(false)
watch(
  () => props.showPopup,
  async (newVal) => {
    showPosterPopup.value = newVal
    if (showPosterPopup.value) {
      try {
        const res = await getPosterUserInfo(props.posterId)
        if (res.code == status_code.OK) {
          username.value = res.data.username
          avatarUrl.value = res.data.avatar_url
          follow.value = res.data.follow
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
)
const emits = defineEmits(['updateShowPopup'])
const closePopup = () => {
  emits('updateShowPopup', false)
}
const avatarUrl = ref('')
const username = ref('')
const follow = ref(false)
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
</script>

<style scoped>
.poster-popup {
  width: 80vw;
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
  font-size: 26px;
  font-weight: 700;
}
.follow-btn {
  height: 8vw;
}
.right-wrapper {
  display: flex;
  flex-direction: column;
  margin-left: 15px;
  height: 80px;
  /* 子元素均匀分布 */
  justify-content: space-evenly;
}
</style>
