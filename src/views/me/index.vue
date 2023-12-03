<template>
  <div>
    <div>用户名:{{ username }}</div>
    <div>注册日期:{{ registerDate }}</div>
    <ThemeMode />
    <van-button plain block @click="exitLogin()" id="exitBtn">退出登录</van-button>
  </div>
</template>

<script setup>
import ThemeMode from './ThemeMode.vue'
import { useUserTokenStore } from '@/stores/userToken.js'
import { getUserInfo } from '@/api/userinfo'
const username = ref('')
const registerDate = ref('')

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
</style>
