<template>
  <div>
    <van-cell class="user-cell">
      <template #value>
        <div class="user-cv">
          <van-image round class="user-img" :src="avatarUrl" @click="showAvatarPopup = true" />
          <span class="user-info">
            {{ username }}
          </span>
          <div class="qrcode-zone">
            <van-space :size="18">
              <van-icon class="qrcode-icon" name="qr" @click="goToMyQRCode" />
              <van-icon class="qrcode-icon" name="scan" @click="goToScanQRCode" />
            </van-space>
          </div>
        </div>
      </template>
    </van-cell>
    <UserData :userDataObj="userDataObj" />
    <UserAvatarPopup
      v-model="showAvatarPopup"
      :avatarUrl="avatarUrl"
      @updateUserAvatar="updateUserAvatar"
    />
    <ThemeMode />

    <van-cell is-link title="我的发布" @click="goToMyPostPage()" />
    <van-cell is-link title="我的点赞" @click="goToLikePage()" />
    <PhoneBindPopup v-model="showPhoneBindPopup" @updatePhoneInfo="updatePhoneInfo" />
    <van-cell is-link title="手机号" :value="phoneNum" @click="bindPhone()" />
    <PwdPopup v-model="showPwdPopup" />
    <van-cell is-link title="修改密码" @click="showPwdPopup = true" />
    <van-button plain block @click="exitLogin()" id="exitBtn">退出登录</van-button>
  </div>
</template>

<script setup>
import ThemeMode from './ThemeMode.vue'
import UserAvatarPopup from './UserAvatarPopup.vue'
import PhoneBindPopup from './PhoneBindPopup.vue'
import PwdPopup from './PwdPopup.vue'
import UserData from './UserData.vue'
import { getUserInfo } from '@/api/userinfo'
import { useLogout } from '@/mixins/userInfo.js'

const socket = inject('socket')
const username = ref('')
const registerDate = ref('')
const avatarUrl = ref('')
const phoneNum = ref('')
const showAvatarPopup = ref(false)
const showPwdPopup = ref(false)
const showPhoneBindPopup = ref(false)
const userDataObj = ref({})

const updateUserAvatar = (val) => {
  avatarUrl.value = val
}
const updatePhoneInfo = (val) => {
  phoneNum.value = val
}

const goToLikePage = () => router.push('/myLike')
const goToMyPostPage = () => router.push('/myPost')
const goToMyQRCode = () => router.push('/myQRCode')
const goToScanQRCode = () => router.push('/scanQRCode')

const bindPhone = () => {
  if (phoneNum.value != '未绑定') showToast('手机号暂不支持解绑或换绑')
  else showPhoneBindPopup.value = true
}

onMounted(async () => {
  //组件挂载到DOM后立即执行
  try {
    const res = await getUserInfo()
    if (res.code == status_code.OK) {
      const { data } = res
      username.value = data.username
      registerDate.value = data.register_date
      avatarUrl.value = data.avatar_url
      phoneNum.value = data.phone_num == '' ? '未绑定' : data.phone_num
      userDataObj.value = {
        fans_num: data.fans_num,
        follower_num: data.follower_num
      }
    }
  } catch (error) {
    console.log(error)
  }
})

const exitLogin = () => {
  showConfirmDialog({
    title: '温馨提示',
    message: '您确认要退出吗？(退出登录将清空所有聊天记录)'
  })
    .then(() => {
      useLogout()
      socket.emit('logout', (res) => {
        console.log(res)
        router.push('/auth')
        setTimeout(() => {
          window.location.reload()
        }, 10)
      })
    })
    .catch((e) => {})
}
</script>

<style src="@/assets/styles/userinfo.css" scoped />
<style scoped>
#exitBtn {
  margin-top: 6px;
}
.user-cell {
  margin-bottom: 0 !important;
}

.qrcode-zone {
  display: flex;
  justify-content: flex-end;
  flex: 1;
}
.qrcode-icon {
  font-size: 24px;
}
</style>
