<script setup>
import { showSuccessToast } from 'vant'
</script>

<template>
  <main>
    <van-button type="primary" @click="showSuccessToast('你好!')">Hello</van-button>
  </main>
</template>
