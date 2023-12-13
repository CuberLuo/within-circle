<template>
  <van-config-provider
    :theme="theme"
    :theme-vars-dark="themeVarsDark"
    :theme-vars-light="themeVarsLight"
  >
    <RouterView />
  </van-config-provider>
</template>

<script setup>
import { useThemeStore } from '@/stores/theme.js'
const themeVarsDark = reactive({ switchNodeBackground: '#141414', tabbarItemTextColor: '#a9b2bb' })
const themeVarsLight = reactive({ switchNodeBackground: '#ffffff', tabbarItemTextColor: '#a9b2bb' })
const theme = ref('')
theme.value = useThemeStore().theme
watch(
  //监听pinia中的theme值的变化
  () => useThemeStore().theme,
  (newVal) => {
    theme.value = newVal
  }
)
</script>

<style scoped></style>
