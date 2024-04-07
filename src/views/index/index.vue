<template>
  <van-tabs v-model:active="active">
    <van-tab title="所有发布">
      <ContentAll />
    </van-tab>
    <van-tab title="猜你喜欢">
      <Recommend />
    </van-tab>
  </van-tabs>
</template>

<script setup>
import ContentAll from './ContentAll.vue'
import Recommend from './Recommend.vue'
const active = ref(0)
</script>

<style scoped></style>
