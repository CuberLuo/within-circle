<template>
  <div>
    <van-cell class="user-cell">
      <template #value>
        <div class="user-cv">
          <van-image
            round
            class="user-img"
            src="https://within-circle.techvip.site/images/default_user.png"
          />

          <span class="user-info">
            {{ username }}
          </span>
        </div>
      </template>
    </van-cell>
    <ThemeMode />
    <van-cell is-link title="我的发布" @click="goToMyPostPage()" />
    <van-cell is-link title="我的点赞" @click="goToLikePage()" />

    <van-cell is-link title="个人资料" @click="goToPersonalInfoPage()" />
    <van-cell is-link title="关于方圆几里" @click="goToAboutPage()" />
    <van-button plain block @click="exitLogin()" id="exitBtn">退出登录</van-button>
  </div>
</template>

<script setup>
import ThemeMode from './ThemeMode.vue'
import { useUserTokenStore } from '@/stores/userToken.js'
import { getUserInfo } from '@/api/userinfo'
const username = ref('')
const registerDate = ref('')

const goToLikePage = () => router.push('/myLike')
const goToMyPostPage = () => router.push('/myPost')
const goToPersonalInfoPage = () => router.push('/myPersonalInfo')
const goToAboutPage = () => router.push('/about')

onMounted(async () => {
  //组件挂载到DOM后立即执行
  try {
    const res = await getUserInfo()
    const { data } = res
    username.value = data.username
    registerDate.value = data.registerDate
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
:deep().van-cell__value {
  text-align: left;
}
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
