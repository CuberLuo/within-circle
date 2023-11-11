<script setup>
const sayHi = () => {
  showSuccessToast('你好!')
}
</script>

<template>
  <main>
    <van-button type="primary" @click="sayHi">Hello</van-button>
  </main>
</template>
