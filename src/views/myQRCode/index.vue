<template>
  <div class="my-qrcode-wrapper">
    <div id="imageCode"></div>
  </div>
</template>

<script setup>
defineOptions({
  name: 'myQRCode'
})
import AraleQRCode from 'arale-qrcode'
import { useUserInfoStore } from '@/stores/userInfo.js'
import { useThemeStore } from '@/stores/theme.js'

var color = '#3476da'
const qrBgColor = useThemeStore().theme === 'dark' ? '#1e1e1e' : '#f7f8fa'
var codeFigure = new AraleQRCode({
  size: 240,
  text: `{userId:${useUserInfoStore().user_info.userId}}`,
  image: useUserInfoStore().user_info.userAvatarUrl,
  render: 'canvas',
  background: qrBgColor,
  foreground: color,
  pdground: color, // 三个角的颜色
  correctLevel: 3 //纠错级别(数字越大说明所需纠错级别越大)
})
onMounted(() => {
  if (document.getElementById('imageCode').childNodes.length == 0) {
    document.querySelector('#imageCode').appendChild(codeFigure)
  }
})
</script>

<style scoped>
.my-qrcode-wrapper {
  height: calc(100vh - var(--van-nav-bar-height) - var(--van-tabbar-height));
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
