<template>
  <header class="authHeader">
    <NavBar />
  </header>
  <div class="tab_div">
    <van-tabs v-model:active="active">
      <van-tab title="验证码登录"><SmsLogin /></van-tab>
      <van-tab title="密码登录"><PasswordLogin /></van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import SmsLogin from './SmsLogin.vue'
import PasswordLogin from './PasswordLogin.vue'
import NavBar from '@/layout/components/NavBar.vue'
const active = ref(0)
</script>

<style scoped>
.authHeader {
  position: absolute;
  top: 0;
  width: 100%;
}
.tab_div {
  display: flex;
  flex-direction: column;
  align-items: center; /* 垂直居中 */
  align-items: stretch;
  justify-content: center;
  height: 100vh;
}
</style>
