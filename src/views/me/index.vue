<template>
  <div>
    <div>me</div>
    <van-button plain type="primary" @click="exitLogin()">退出登录</van-button>
  </div>
</template>

<script setup>
import { useUserTokenStore } from '@/stores/userToken.js'
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

<style scoped></style>
