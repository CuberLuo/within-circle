<template>
  <div>
    <van-cell class="user-cell">
      <template #value>
        <div class="user-cv">
          <van-image round class="user-img" :src="avatarUrl" @click="showUserAvatarPopup" />
          <span class="user-info">
            {{ username }}
          </span>
        </div>
      </template>
    </van-cell>
    <UserAvatarPopup
      :showPopup="showAvatarPopup"
      :avatarUrl="avatarUrl"
      @updateShowPopup="updateShowAvatarPopup"
      @updateUserAvatar="updateUserAvatar"
    />
    <ThemeMode />

    <van-cell is-link title="我的发布" @click="goToMyPostPage()" />
    <van-cell is-link title="我的点赞" @click="goToLikePage()" />
    <PhoneBindPopup
      :showPopup="showPhoneBindPopup"
      @updateShowPopup="updateShowPhoneBindPopup"
      @updatePhoneInfo="updatePhoneInfo"
    />
    <van-cell is-link title="手机号" :value="phoneNum" @click="bindPhone()" />
    <PwdPopup :showPopup="showPwdPopup" @updateShowPopup="updateShowPwdPopup" />
    <van-cell is-link title="修改密码" @click="showUserPwdPopup()" />
    <van-button plain block @click="exitLogin()" id="exitBtn">退出登录</van-button>
  </div>
</template>

<script setup>
import ThemeMode from './ThemeMode.vue'
import UserAvatarPopup from './UserAvatarPopup.vue'
import PhoneBindPopup from './PhoneBindPopup.vue'
import PwdPopup from './PwdPopup.vue'
import { useUserTokenStore } from '@/stores/userToken.js'
import { getUserInfo } from '@/api/userinfo'
const username = ref('')
const registerDate = ref('')
const avatarUrl = ref('')
const phoneNum = ref('')
const showAvatarPopup = ref(false)
const showPwdPopup = ref(false)
const showPhoneBindPopup = ref(false)

const showUserAvatarPopup = () => {
  showAvatarPopup.value = true
}
const updateShowAvatarPopup = (val) => {
  showAvatarPopup.value = val
}
const updateUserAvatar = (val) => {
  avatarUrl.value = val
}
const showUserPwdPopup = () => {
  showPwdPopup.value = true
}
const updateShowPwdPopup = (val) => {
  showPwdPopup.value = val
}
const showUserPhoneBindPopup = () => {
  showPhoneBindPopup.value = true
}
const updateShowPhoneBindPopup = (val) => {
  showPhoneBindPopup.value = val
}
const updatePhoneInfo = (val) => {
  phoneNum.value = val
}

const goToLikePage = () => router.push('/myLike')
const goToMyPostPage = () => router.push('/myPost')
const bindPhone = () => {
  if (phoneNum.value != '未绑定') showToast('手机号暂不支持解绑或换绑')
  else showUserPhoneBindPopup()
}

onMounted(async () => {
  //组件挂载到DOM后立即执行
  try {
    const res = await getUserInfo()
    if (res.code == status_code.OK) {
      const { data } = res
      username.value = data.username
      registerDate.value = data.registerDate
      avatarUrl.value = data.avatarUrl
      phoneNum.value = data.phoneNum == '' ? '未绑定' : data.phoneNum
    } else {
      showFailToast(res.msg)
      useUserTokenStore().removeToken() //移除Pinia和localStorage中的token
      router.push('/auth')
    }
  } catch (error) {
    console.log(error)
  }
})

const exitLogin = () => {
  showConfirmDialog({
    title: '温馨提示',
    message: '您确认要退出吗？'
  })
    .then(() => {
      useUserTokenStore().removeToken() //移除Pinia和localStorage中的token
      router.push('/auth')
    })
    .catch((e) => {})
}
</script>

<style scoped>
#exitBtn {
  margin-top: 6px;
}
/* :deep().van-cell__value {
  text-align: left;
} */
.user-cell {
  margin: 10px 0;
  height: 100px;
}
.user-cv {
  display: flex;
  align-items: center;
}

.user-img {
  width: 80px;
  height: 80px;
}
.user-info {
  font-size: 26px;
  font-weight: 700;
  margin-left: 15px;
}
</style>
