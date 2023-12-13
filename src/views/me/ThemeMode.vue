<template>
  <van-cell title="主题">
    <!-- 使用 right-icon 插槽来自定义右侧图标 -->
    <template #right-icon>
      <van-switch
        v-model="openDarkTheme"
        active-color="#2c2c2c"
        inactive-color="#dcdee0"
        @update:model-value="onUpdateSwitchValue"
      >
        <template #node>
          <div class="icon-wrapper">
            <van-icon
              :class="'iconfont ' + (openDarkTheme ? 'icon-moon' : 'icon-sunny')"
              :class-prefix="openDarkTheme ? 'moon' : 'sunny'"
            />
          </div>
        </template>
      </van-switch>
    </template>
  </van-cell>
</template>

<script setup>
import { useThemeStore } from '@/stores/theme.js'

const openDarkTheme = ref()
const theme = useThemeStore().theme
openDarkTheme.value = theme === 'dark' ? true : false
const onUpdateSwitchValue = (newValue) => {
  openDarkTheme.value = newValue
  if (newValue === true) useThemeStore().setTheme('dark')
  else useThemeStore().setTheme('light')
}
</script>

<style scoped>
.icon-wrapper {
  width: var(--van-switch-node-size);
  height: var(--van-switch-node-size);
  display: flex;
  /* 子元素水平居中 */
  justify-content: center;
  /* 子元素垂直居中 */
  align-items: center;
}
</style>
