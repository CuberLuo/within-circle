<template>
  <div class="app-main">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive exclude="post,amap">
          <component :is="Component" :key="route.path" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script setup></script>

<style scoped>
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: opacity 0.5s; /* 只对透明度进行过渡 */
}

.fade-transform-enter-from,
.fade-transform-leave-to {
  opacity: 0; /* 初始状态和最终状态都设置为完全透明 */
}
</style>
