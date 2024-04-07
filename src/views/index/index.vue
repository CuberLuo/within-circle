<template>
  <van-tabs v-model:active="active" sticky swipeable>
    <van-tab title="所有发布">
      <ContentAll v-if="active === 0" :key="active" />
    </van-tab>
    <van-tab title="猜你喜欢">
      <Recommend v-if="active === 1" :key="active" />
    </van-tab>
  </van-tabs>
</template>

<script setup>
import ContentAll from './ContentAll.vue'
import Recommend from './Recommend.vue'
const active = ref(0)
</script>

<style scoped></style>
