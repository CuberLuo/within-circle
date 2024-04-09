<template>
  <header class="authHeader">
    <NavBar />
  </header>
  <div class="app-title-wrapper">
    <h1 @click="goToIndex">方圆几里</h1>
  </div>
  <div class="tab_div">
    <van-tabs v-model:active="active">
      <van-tab title="验证码登录"><SmsLogin /></van-tab>
      <van-tab title="密码登录"><PasswordLogin /></van-tab>
      <div style="margin: 0 12px">
        <van-button round block plain type="primary" @click="goToRegister"> 注册 </van-button>
      </div>
    </van-tabs>
  </div>
</template>

<script setup>
import SmsLogin from './SmsLogin.vue'
import PasswordLogin from './PasswordLogin.vue'
import NavBar from '@/layout/components/NavBar.vue'
const active = ref(0)

const goToIndex = () => {
  router.push('/index')
}
const goToRegister = () => {
  router.push('/register')
}
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
.app-title-wrapper {
  position: absolute;
  top: 10vh;
  left: 50%;
  transform: translateX(-50%);
}
.app-title-wrapper h1 {
  font-size: 40px;
  background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
